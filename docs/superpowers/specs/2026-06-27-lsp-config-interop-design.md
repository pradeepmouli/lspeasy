# Design: Multi-platform LSP config interop for `lsproxy`

- **Date:** 2026-06-27
- **Status:** Approved (pending spec review)
- **Package(s):** `apps/cli` (`@lsproxy/cli`), `packages/core` (`@lspeasy/core`)

## Problem

`lsproxy` reads LSP server configuration only from its own `lsp.json` format
(`packages/core/src/discover.ts`: project → parents → `~/.claude/lsp.json`).
Meanwhile a user already has LSP servers configured across other tools — Claude
Code, Codex, Copilot CLI, VS Code — in their own formats. Today there is no way
to import that configuration into `lsproxy`, nor to push `lsproxy`'s
configuration back out. Users maintain config twice.

This feature adds **two-way interop**: read LSP config from supported platforms
into `lsproxy`'s canonical model, and write `lsproxy`'s config back out into
those platforms' native formats.

## Goals

- A canonical model (`lsp.json`) is the hub; per-platform **adapters** convert
  to/from it.
- v1 ships explicit, directional commands — `lsproxy config list|import|export|diff`
  — designed so a declarative `sync` (one source of truth → reconcile all) can be
  layered on later without rework.
- Platforms that cannot express the canonical `command`/`args` model are handled
  via **capability tiers**, not forced into it.
- Plugin-based platforms (Claude Code, Codex) resolve their enabled plugins via a
  **local plugin resolver** that reads installed `.lsp.json` definitions — no
  network, no remote registry.

## Non-goals

- No declarative `sync` command in v1 (design accommodates it; implementation deferred).
- No network/registry fetching — the resolver reads only locally-installed plugin files.
- No editing of a platform's config beyond LSP-server entries (we touch only the
  relevant keys, surgically).
- VS Code full support is out of v1 (see "VS Code" below).
- The lsproxy **runtime** does not *consume* the extra `.lsp.json` fields
  (`transport`, `initializationOptions`, `settings`, `maxRestarts`) in v1 — but
  they are **preserved** end-to-end (import → canonical → export) for round-trip
  fidelity. Parsed information is never silently dropped; "we don't use it yet"
  is not "we throw it away."

## Background: the two platform classes

| Class | Platforms | Stores | Two-way? |
|---|---|---|---|
| Explicit-command | `lsp.json` (canonical), Copilot CLI | full `command`/`args`/extensions | yes, 1:1 |
| Plugin-toggle | Claude Code (`~/.claude/settings.json`), Codex (`~/.codex/config.toml`) | *which* installed plugins are enabled (`<plugin>@<marketplace>: true`) | yes, via local plugin resolver |
| No portable model | VS Code | per-extension; no server map | detected-but-unsupported in v1 |

**Key fact (verified):** each installed plugin ships a `.lsp.json` at
`~/.claude/plugins/marketplaces/<marketplace>/<plugin>/.lsp.json`:
```json
{ "rust": { "command": "rust-analyzer", "args": [],
            "extensionToLanguage": { ".rs": "rust" },
            "transport": "stdio", "initializationOptions": {}, "settings": {}, "maxRestarts": 3 } }
```
`extensionToLanguage` is exactly lspeasy's `fileExtensions` (different key). One
plugin may define multiple servers (e.g. `vscode-langservers` → `html`, `css`,
`eslint`). This makes the resolver a local-file read with a one-key rename.

## Canonical model (`@lspeasy/core`)

Reuse `LspJson`/`LspServerEntry`. Add one optional field for round-tripping:

```ts
export interface LspServerEntry {
  command: string;
  args?: string[];
  fileExtensions: Record<string, string>;
  /** Provenance: qualified plugin id this entry was imported from, e.g.
   *  "rust-analyzer@claude-code-lsps". Lets `export` round-trip to a plugin
   *  toggle instead of guessing. Omitted for hand-written/explicit entries. */
  marketplacePlugin?: string;
  /** Preserved-but-not-consumed fields carried verbatim from richer native
   *  formats (e.g. plugin `.lsp.json`), so import → export round-trips losslessly.
   *  The lsproxy runtime ignores these in v1; they exist purely to avoid
   *  dropping information we parsed. */
  transport?: string;
  initializationOptions?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  maxRestarts?: number;
}
```

The existing `discover.ts`/`RefactorSession` read only `command`/`args`/
`fileExtensions`; the new optional fields are inert at runtime (no behavior
change) and exist solely for round-trip preservation. Add a
`languageId → default extensions` table (LSP standardizes languageIds) used
as a fallback when a source names a language but omits extensions. Lives in core
beside `discover.ts` (e.g. `language-extensions.ts`).

## Components (`apps/cli/src/config/`)

### Adapter interface + registry (`adapter.ts`, `registry.ts`)
```ts
type Tier = 'full' | 'plugin-resolved' | 'read-only';
type Scope = 'user' | 'project';

interface PlatformAdapter {
  id: string;            // 'lspjson' | 'copilot' | 'claude-code' | 'codex' | 'vscode'
  name: string;
  tier: Tier;
  detect(scope: Scope, root: string): boolean;   // is this platform present?
  configPath(scope: Scope, root: string): string; // where its config lives
  read(scope: Scope, root: string): CanonicalServers;        // native → canonical
  write?(servers: CanonicalServers, scope: Scope, root: string): WriteResult; // canonical → native
}

type CanonicalServers = Record<string, LspServerEntry>; // == LspJson['lspServers']
interface WriteResult { written: string[]; skipped: Array<{ name: string; reason: string }>; path: string; }
```
The registry holds the adapters; commands select by `id`. Each adapter is its own
focused file.

### Local plugin resolver (`plugin-resolver.ts`)
Provenance-agnostic. Scans `~/.claude/plugins/marketplaces/*/*/.lsp.json` and
builds a bidirectional map:
- `resolve(pluginId: string): LspServerEntry[]` — `<plugin>@<marketplace>` → canonical servers (renaming `extensionToLanguage` → `fileExtensions`, stamping `marketplacePlugin`, and **carrying through** `transport`/`initializationOptions`/`settings`/`maxRestarts` verbatim so nothing parsed is lost).
- `findPluginFor(entry: LspServerEntry): string | undefined` — match a canonical server back to a `<plugin>@<marketplace>` id (prefer the stamped `marketplacePlugin`; else match by `command`).
- `listAll(): Record<string, LspServerEntry[]>` — every installed plugin's servers (also usable as a standalone read-only discovery source).

Used by both plugin adapters. No marketplace/remote concept — purely local installed files.

### Adapters (`adapters/`)
- `lspjson.ts` — **full**. Reads/writes `lsp.json` (the canonical format itself); the `import`/`export` target.
- `copilot.ts` — **full**. Reads/writes Copilot CLI's JSON LSP config (format confirmed at implementation against the `lsp-setup` skill / Copilot docs).
- `claude-code.ts` — **plugin-resolved**. Read: parse enabled `<plugin>@<marketplace>: true` toggles in `~/.claude/settings.json`, resolve via the plugin resolver. Write: for each canonical server, `findPluginFor` → toggle that plugin `true` (surgical key edit); servers with no matching installed plugin are skipped + reported.
- `codex.ts` — **plugin-resolved**. Same logic over `~/.codex/config.toml` (TOML). Requires a TOML parser dependency. Writes are surgical (toggle the relevant key) to preserve the file's other content.
- `vscode.ts` — **read-only**, v1 = **detected-but-unsupported**: `detect()` reports presence; `read()` returns empty with a clear "no portable LSP server map" notice. Revisit if a faithful source (e.g. a Piebald VS Code extension reusing `.lsp.json`) is confirmed.

### CLI commands (`commands.ts`, wired into `cli.ts`)
- `lsproxy config list` — every detected platform with its tier and configured servers.
- `lsproxy config import <platform>` — native → canonical, merged into the target `lsp.json`.
- `lsproxy config export <platform>` — canonical `lsp.json` → native.
- `lsproxy config diff <platform>` — show differences between `lsp.json` and the platform.
- Flags: `--user` (`~/.claude/lsp.json`) / `--project` (repo `lsp.json`, default); `--json` for all (agent contract, consistent with the command-discovery feature).

## Data flow

- **import**: `adapter.read()` → `CanonicalServers` (plugin adapters call the resolver to fill `command`/`args`/`fileExtensions` + stamp `marketplacePlugin`) → merge into target `lsp.json` (by server name; report adds/updates).
- **export**: read target `lsp.json` → `adapter.write()` → native (explicit adapters write `command`/`args`/extensions; plugin adapters map each entry via `findPluginFor` to a toggle). Lossy entries (no matching plugin) are skipped + reported.
- **diff**: read both sides into canonical, compare, render added/removed/changed.

## Error handling & safety

- Missing platform config or absent plugin dir → skip with a notice, never error
  (matches discovery's never-error ethos; `@never`-style silent fallbacks documented).
- **Writes to existing user files are surgical and backed up.** For `settings.json`
  (JSON) and `config.toml` (TOML), parse → set only the specific key(s) → write,
  preserving unrelated content; write a `<file>.bak` first. Never full-rewrite a
  user's hand-authored file in a way that drops comments/ordering where avoidable.
- **Lossy export** (canonical server with no matching installed plugin for a
  plugin-toggle platform) → warn, skip that server, list it in the `WriteResult.skipped`
  summary; non-zero exit only in `--json`-consistent error cases, not for partial skips.
- Parse errors in a platform's config → clear error scoped to that platform; other
  platforms in a `list` still report.
- `--json` emits structured results for every command (results, skips, diffs).

## Testing

- **core**: `language-extensions` table lookups; `LspServerEntry.marketplacePlugin` optional field type.
- **plugin resolver**: over a fixture plugin tree (`marketplaces/<mp>/<plugin>/.lsp.json`), assert `resolve`, `findPluginFor`, `listAll`, multi-server plugins, the `extensionToLanguage → fileExtensions` rename, and that `transport`/`initializationOptions`/`settings`/`maxRestarts` are carried through verbatim.
- **adapters**: per-adapter **round-trip** (read→write→read) over fixtures, asserting the preserved-but-unused fields survive intact; Copilot JSON; Claude Code settings.json toggle read + surgical write (assert unrelated keys preserved + `.bak` created); Codex TOML read + surgical write; VS Code detect + empty-read notice.
- **commands**: integration tests over temp config files for `list`/`import`/`export`/`diff`, `--user`/`--project` scoping, `--json` shape, and lossy-export skip reporting.

## Future (designed-for, not in v1)

- `lsproxy config sync` — declarative reconcile of all platforms to `lsp.json` (needs conflict/merge/drift rules).
- **Consume** the already-preserved `initializationOptions`/`settings`/`transport`/`maxRestarts` at runtime (e.g. `RefactorSession` honoring `initializationOptions`) — the data is captured in v1; wiring it into behavior is the future step.
- Promote `apps/cli/src/config/` to a standalone `@lsproxy/config` package if another tool needs it.
- VS Code support once a faithful source is confirmed.
