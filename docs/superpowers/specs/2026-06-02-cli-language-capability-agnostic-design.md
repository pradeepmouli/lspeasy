# CLI: Language-Agnostic & Capability-Agnostic Design

**Date:** 2026-06-02  
**Status:** Approved  
**Branch:** `feat/cli-agnostic`

## Problem

The current `@lspeasy/cli` is hardcoded to TypeScript (`typescript-language-server --stdio`) and exposes a fixed set of commands (`rename`, `move-file`, `move-symbol`, `query`) regardless of what the connected server actually supports. This makes the CLI unusable out-of-the-box for any other language, and it silently offers commands that a given server may not implement.

## Goals

1. **Language-agnostic** — discover which LSP server to launch from a project-local `lsp.json`, matching by file extension.
2. **Capability-agnostic** — dynamically build the CLI command surface from what `InitializeResult.capabilities` actually advertises, derived from existing Zod schemas.
3. **No legacy aliases** — clean break; the old flat commands (`rename`, `move-file`, etc.) are removed.

---

## Architecture

```
lsp.json discovery
      ↓
  server command + fileExtension→languageId
      ↓
  LSPClient.initialize()
      ↓
  InitializeResult.capabilities
      ↓
  LSPSchemas × capabilities  →  zodToCommander()
      ↓
  namespace/subcommand tree  +  generic `call` fallback
```

---

## Section 1 — lsp.json Discovery

The CLI walks up from `--root` (default: cwd), checking these locations in order and stopping at first hit:

```
<root>/lsp.json
<root>/.claude/lsp.json
<root>/.github/lsp.json
~/.claude/lsp.json          ← global user fallback
```

**Format** (existing convention used by Claude Code and Copilot CLI):

```json
{
  "lspServers": {
    "typescript": {
      "command": "typescript-language-server",
      "args": ["--stdio"],
      "fileExtensions": {
        ".ts": "typescript",
        ".tsx": "typescriptreact"
      }
    },
    "rust": {
      "command": "rust-analyzer",
      "args": [],
      "fileExtensions": {
        ".rs": "rust"
      }
    }
  }
}
```

The CLI picks the server entry whose `fileExtensions` map contains the extension of the first file argument. The matched `command` + `args` spawn the server process; the matched `languageId` value is passed in the LSP `textDocumentSync` handshake.

`--server <cmd>` overrides discovery entirely (CI, unusual setups).

If no `lsp.json` is found and no `--server` is given, the CLI exits with a clear error message describing the expected format and search locations — no silent default.

---

## Section 2 — Runtime Zod → Commander Translation

### Source of truth

`packages/core/src/protocol/schemas.ts` already provides:
- `LSPSchemas` — method-keyed registry of Zod param schemas (`'textDocument/hover'` → `HoverParamsSchema`, etc.)
- `getSchemaForMethod(method)` — runtime lookup

`packages/core/src/protocol/infer.ts` provides:
- `getCapabilityForRequestMethod(method)` — returns the dot-path into `ServerCapabilities` for a given method (e.g. `'hoverProvider'`, `'renameProvider'`)

### Capability filtering

```ts
for (const method of Object.keys(LSPSchemas)) {
  const capPath = getCapabilityForRequestMethod(method);
  if (capPath && getProperty(capabilities, capPath)) {
    registerCommand(program, method, LSPSchemas[method]);
  }
}
```

`getProperty` (dot-path traversal) is already in `packages/core/src/protocol/capabilities.ts`.

### `zodToCommander(method, schema)`

Walks the Zod schema and builds a Commander `Command`. Recognition is applied in order:

| Schema shape | CLI surface |
|---|---|
| Has `textDocument` + `position` | `<file> <line:col>` positional (1-based input → 0-based LSP internally) |
| Has `textDocument` + `position` + `newName: z.string()` | `<file> <line:col> <newName>` |
| Has `textDocument` + `range` | `<file> <startLine:col>-<endLine:col>` |
| Has `textDocument` only | `<file>` |
| Remaining `z.ZodString` fields | `--field-name <value>` |
| Remaining `z.ZodBoolean` fields | `--flag` / `--no-flag` |
| `z.ZodOptional<T>` | optional variant of above |
| Nested objects / unions | `--params <json>` override (always available as escape hatch) |

### Expanding `LSPSchemas`

Currently covers ~6 methods. One-time expansion to all standard text document and workspace capabilities (`rename`, `codeAction`, `signatureHelp`, `typeDefinition`, `implementation`, `documentHighlight`, `formatting`, `rangeFormatting`, `onTypeFormatting`, `foldingRange`, `selectionRange`, `linkedEditingRange`, `inlayHint`, `workspaceSymbol`, etc.). After that, schema + CLI stay in sync automatically.

---

## Section 3 — Namespace/Subcommand Tree

LSP method names (`textDocument/hover`) split on `/` to form Commander subcommand groups:

```
lspeasy textDocument hover      src/foo.ts 12:7
lspeasy textDocument rename     src/foo.ts 12:7 newName
lspeasy textDocument references src/foo.ts 12:7
lspeasy workspace symbol        queryString
```

Registration:

```ts
const [namespace, subcommand] = method.split('/');
const nsCmd = program.commands.find(c => c.name() === namespace)
  ?? program.command(namespace);
nsCmd.command(subcommand)
  .description(...)
  .argument(...)
  .action(...);
```

**Generic fallback** (always registered, regardless of capabilities):

```
lspeasy call textDocument/hover --params '{"textDocument":{"uri":"..."},"position":{"line":0,"character":0}}'
```

---

## Section 4 — Two-Pass Parse

Commander normally parses before commands are registered. Since command registration depends on a live server connection, the CLI uses a two-pass approach:

1. **First pass** — lightweight `util.parseArgs` extracts global flags (`--root`, `--server`, `--json`, `--wait`, `--verbose`, `--dry-run`, `--help`) without Commander.
2. **Connect** — discover server, spawn, run `initialize`, read capabilities.
3. **Build tree** — register namespace/subcommand tree from `LSPSchemas × capabilities`.
4. **Second pass** — hand full `process.argv` to Commander for normal parse and dispatch.

`--help` at the top level (no file argument present) is static — it shows global flags and notes that available commands depend on the connected server. `lspeasy textDocument --help` or any subcommand-level `--help` triggers connect-then-describe, so that help output reflects what the actual server supports. A file argument must be present for server discovery when `--help` is used at the subcommand level.

---

## Section 5 — Error Handling

| Scenario | Behavior |
|---|---|
| No `lsp.json` + no `--server` | Exit with error describing expected format and search locations |
| File extension matches no server entry | Exit with error listing available extensions from the found `lsp.json` |
| `initialize` times out | Distinct timeout error (not a generic connection failure); suggest `--wait <ms>` |
| Server advertises zero matching capabilities | List what was found; suggest `lspeasy call` fallback |
| Zod parse failure on server response | Show method name + raw response; exit non-zero |
| `--dry-run` on write commands | Print affected files/edits; no disk writes |

---

## Section 6 — Testing

- **`zodToCommander()` unit tests** — feed known schemas (TextDocumentPositionParams, RenameParams, etc.), assert Commander command shape, argument names, option flags.
- **`lsp.json` discovery unit tests** — mock fs walk, assert correct server entry is selected per file extension and search order.
- **Capability filtering unit tests** — feed synthetic `ServerCapabilities` objects, assert correct subset of commands is registered.
- **Integration tests** — use existing `InProcessTransport` pattern to spin up a fake LSP server with controlled capabilities; assert dispatch and response formatting.
- **E2E tests** — extend `e2e/` with `typescript-language-server` to verify full flow: discovery → connect → command tree → request → output.

---

## Out of Scope

- `move-file` and `move-symbol` — these are multi-step orchestrations (`workspace/willRenameFiles`, `codeAction` with specific kinds) and are removed with the legacy commands. They can be reintroduced later as named orchestration commands once the core capability-agnostic layer is stable.
- `@lspeasy/middleware` package — no changes.
- Server-side changes — CLI only.
