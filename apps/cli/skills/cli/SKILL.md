---
description: API reference for cli
name: cli
---

# cli

## Features

- **Semantic refactoring** — project-wide rename, move-file with importer updates, extract symbol
- **Reference tracking** — find all references, call hierarchy, workspace symbol search
- **Code actions** — list and apply quick-fixes and refactors at any range; filter by kind with `--code-action-only` or trigger-kind with `--code-action-trigger-kind` instead of writing raw `--params` JSON
- **Any LSP server** — TypeScript, Rust, Python, Go, or any LSP-compliant server via `lsp.json`
- **Proxy daemon** — warm server connections for sub-100ms subsequent invocations
- **Dry-run preview** — `--dry-run` prints diffs without writing; safe to inspect before committing
- **Multi-platform config interop** — `lsproxy config import/export/diff/list` bridges `lsp.json` with Copilot CLI, Claude Code, and Codex; `--user` targets `~/.claude/lsp.json` for user-level scope
- **Self-describing discovery** — bare `lsproxy` lists configured languages with live daemon status; `lsproxy --help <language> <namespace> <request>` shows parameter schema, flag list, and illustrative example input/output; add `--json` for machine-readable output for agents

## Quick Start

```
lsproxy <namespace> <command> [args] [flags]
lsproxy call <method> --params <json>
lsproxy config <list|import|export|diff> [platform] [--user] [--json]
```

Commands are built from the server's capabilities at startup. Available namespaces:
`callHierarchy`, `codeAction`, `codeLens`, `completionItem`, `documentLink`,
`inlayHint`, `textDocument`, `workspace`, `workspaceSymbol`.

```bash
lsproxy textDocument hover           src/foo.ts 12:7
lsproxy textDocument rename          src/foo.ts 12:7 newName
lsproxy textDocument references      src/foo.ts 12:7
lsproxy textDocument definition      src/foo.ts 12:7
lsproxy textDocument formatting      src/foo.ts
lsproxy textDocument rangeFormatting src/foo.ts 1:1-50:1
lsproxy workspace   symbol           MyClass
lsproxy call        textDocument/semanticTokens/full --params '{"textDocument":{"uri":"file:///…"}}'
```

### Code actions

`codeAction` returns a JSON array of available fixes and refactors for a range.
When exactly one action carries an edit it is applied automatically; when zero or
multiple carry edits the array is printed and no files are changed.

```bash
lsproxy textDocument codeAction --dry-run src/foo.ts 12:1-12:20

# Filter by kind (comma-separated; valid: quickfix, refactor, refactor.extract, source, …)
lsproxy textDocument codeAction --code-action-only quickfix,refactor src/foo.ts 12:1-12:20

# Specify trigger kind: 1 = Invoked (user gesture), 2 = Automatic (on save / idle)
lsproxy textDocument codeAction --code-action-trigger-kind 1 src/foo.ts 12:1-12:20
```

Run `lsproxy --help typescript textDocument codeAction` to see the full parameter schema
and an illustrative example input/output for the connected server.

## Dynamic discovery model

The help surface is built from live server capabilities and `lsp.json` config, not a
static command list.

**Depth 0 — bare `lsproxy` (or `lsproxy --help`)**

Lists every configured language with live daemon status or cold status. Add `--json`
for machine-readable output.

**Depth 1 — `lsproxy --help <language>`**

Connects to that language's server and shows its advertised namespaces filtered to
what the server actually supports.

**Depth 2 — `lsproxy --help <language> <namespace>`**

Lists available requests within that namespace for the running server.

**Depth 3 — `lsproxy --help <language> <namespace> <request>`**

Shows Commander help (positional args + all flag-mapped params) plus illustrative
**Example input** and **Example output** from the Zod schemas. Add `--json` to
receive `arguments`, `options`, `paramsSchema`, and `resultSchema` — useful for
building agent prompts or automation scripts.

```bash
lsproxy --help typescript textDocument codeAction
lsproxy --help typescript textDocument codeAction --json
```

## Config interop

The `config` command family bridges `lsp.json` with other tools' native config formats.

```bash
lsproxy config list                        # all platforms + detected servers
lsproxy config import claude-code          # pull Claude Code servers into lsp.json
lsproxy config export copilot             # push lsp.json to Copilot CLI config
lsproxy config diff codex                 # diff lsp.json vs Codex (read-only)
lsproxy config list --user                # user scope (~/.claude/lsp.json)
lsproxy config import claude-code --json  # machine-readable output
```

Supported platforms: `lspjson` (full), `copilot` (full), `claude-code` (plugin-resolved),
`codex` (read-only), `vscode` (read-only). `import` stamps provenance for round-trip
fidelity. `export` skips servers the target cannot represent and reports them as
`skipped`. Codex is read-only; VS Code is detected but export is unsupported.

## Troubleshooting

**Commands missing from `--help`** — lsproxy only registers commands for capabilities the
server actually advertises. If `textDocument rename` doesn't appear, the server doesn't
support `renameProvider`. Use `lsproxy call initialize --params '{}'` to inspect the
server's capability response.

**Wrong positions** — Positions must be 1-based (`line:col`). Most editors display
1-based positions; LSP protocol is 0-based internally but lsproxy converts for you.
Passing 0-based values shifts edits by one line/column.

**Server not found** — Without `--server`, lsproxy walks up from `--root` looking for
`lsp.json`. If it can't find one it will time out. Either add `lsp.json` to the project
root or pass `--server <cmd>` explicitly.

**Write commands applied unexpectedly** — `rename`, `formatting`, and code actions that
produce edits write to disk immediately. Always run with `--dry-run` first on an
unfamiliar codebase.

## Commands

### config

Read/write LSP server config across platforms (lsp.json, Copilot CLI, Claude Code, Codex)

**Usage:**
```
lsproxy config [options] [command]
```

#### config list

List detected platforms and their configured servers

```
lsproxy config list [options]
```

| Flag | Description |
| --- | --- |
| `--user` | User-level config (~/.claude/lsp.json) instead of project |

#### config import

Import a platform's LSP servers into lsp.json

```
lsproxy config import [options] <platform>
```

| Flag | Description |
| --- | --- |
| `--user` | User-level config instead of project |

#### config export

Export lsp.json servers to a platform's native config

```
lsproxy config export [options] <platform>
```

| Flag | Description |
| --- | --- |
| `--user` | User-level config instead of project |

#### config diff

Diff lsp.json against a platform's config

```
lsproxy config diff [options] <platform>
```

| Flag | Description |
| --- | --- |
| `--user` | User-level config instead of project |

### callHierarchy

callHierarchy operations

**Usage:**
```
lsproxy callHierarchy [options] [command]
```

### codeAction

codeAction operations

**Usage:**
```
lsproxy codeAction [options] [command]
```

### codeLens

codeLens operations

**Usage:**
```
lsproxy codeLens [options] [command]
```

### completionItem

completionItem operations

**Usage:**
```
lsproxy completionItem [options] [command]
```

### documentLink

documentLink operations

**Usage:**
```
lsproxy documentLink [options] [command]
```

### inlayHint

inlayHint operations

**Usage:**
```
lsproxy inlayHint [options] [command]
```

### textDocument

textDocument operations

**Usage:**
```
lsproxy textDocument [options] [command]
```

### workspace

workspace operations

**Usage:**
```
lsproxy workspace [options] [command]
```

### workspaceSymbol

workspaceSymbol operations

**Usage:**
```
lsproxy workspaceSymbol [options] [command]
```

### call

Send any LSP request by method name with raw JSON params

**Usage:**
```
lsproxy call [options] <method>
```

| Flag | Type | Required | Default | Env | Description |
| --- | --- | --- | --- | --- | --- |
| `--params` | `string` | no | — | — | LSP params as JSON |

**Arguments:**
- `method` *(required)*

## References

Load these on demand — do NOT read all at once:

- When using CLI commands → read `references/commands.md` for flags, arguments, and defaults
