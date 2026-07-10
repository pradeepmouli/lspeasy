# @lsproxy/cli

LSP-driven CLI that connects to any Language Server Protocol server and exposes
its capabilities as typed subcommands — hover, rename, format, find-references,
code actions, and more. The command surface is built at runtime from the server's
advertised capabilities, so it works with any LSP server out of the box.

## Features

- **Semantic refactoring** — project-wide rename, move-file with importer updates, extract symbol
- **Reference tracking** — find all references, call hierarchy, workspace symbol search
- **Code actions** — list and apply quick-fixes and refactors at any range; filter by kind with `--code-action-only` or trigger-kind with `--code-action-trigger-kind` instead of writing raw `--params` JSON
- **Any LSP server** — TypeScript, Rust, Python, Go, or any LSP-compliant server via `lsp.json`
- **Proxy daemon** — warm server connections for sub-100ms subsequent invocations
- **Dry-run preview** — `--dry-run` prints diffs without writing; safe to inspect before committing
- **Multi-platform config interop** — `lsproxy config import/export/diff/list` bridges `lsp.json` with Copilot CLI, Claude Code, and Codex; `--user` targets `~/.claude/lsp.json` for user-level scope
- **Self-describing discovery** — bare `lsproxy` lists configured languages with live daemon status; `lsproxy --help <language> <namespace> <request>` shows parameter schema, flag list, and illustrative example input/output; add `--json` for machine-readable output for agents
- **Server visibility** — `lsproxy status` groups every configured server by process, showing its resolved binary location, config source (lsp.json, Claude Code, Codex, Copilot CLI), live connection status/uptime, and which languages it serves

## Install

```bash
npx @lsproxy/cli src/foo.ts textDocument hover 12:7   # zero-install
pnpm add -g @lsproxy/cli                               # or install globally
```

## Breaking changes (0.11 → 0.12)

Argument parsing moved onto Commander and the CLI grammar changed. If you have
scripts using the old `lsproxy <namespace> <command> <file> [args] [flags]`
order (e.g. `lsproxy textDocument hover src/foo.ts 12:7`), they will now fail
with a `"<namespace>" is not a configured language or a file with a
recognized extension` error. Reorder to the new grammar instead: the file (or
language id) comes first — `lsproxy src/foo.ts textDocument hover 12:7` — see
[Usage](#usage) below.

## Quick Start

```bash
# Preview a rename before writing (always do this first)
lsproxy src/auth/login.ts textDocument rename --dry-run 42:15 "signIn"

# Find all references to a symbol
lsproxy src/auth/login.ts textDocument references 42:15

# List available code actions at a range, then apply the chosen one
lsproxy src/foo.ts textDocument codeAction 12:1-12:20

# Send any LSP method directly (useful for probing capabilities)
lsproxy typescript call workspace/executeCommand --params '{"command":"typescript.reloadProjects"}'
```

Positions are **1-based** (`line:col`, editor-style).
Write-side commands apply changes to disk automatically — use `--dry-run` to preview first.

## Usage

```
lsproxy <language-or-file> <namespace> <request> [args] [flags]
lsproxy <language-or-file> call <method> --params <json>
```

The first positional argument is either a language id (e.g. `typescript`) or a
file path — when it's a file, that file doubles as the request's target and
needn't be repeated in the args that follow. Commands are built from the
server's capabilities at startup. Available namespaces:
`callHierarchy`, `codeAction`, `codeLens`, `completionItem`, `documentLink`,
`inlayHint`, `textDocument`, `workspace`, `workspaceSymbol`.

```bash
lsproxy src/foo.ts textDocument hover           12:7
lsproxy src/foo.ts textDocument rename          12:7 newName
lsproxy src/foo.ts textDocument references      12:7
lsproxy src/foo.ts textDocument definition      12:7
lsproxy src/foo.ts textDocument formatting
lsproxy src/foo.ts textDocument rangeFormatting 1:1-50:1
lsproxy typescript workspace symbol MyClass
lsproxy typescript call     textDocument/semanticTokens/full --params '{"textDocument":{"uri":"file:///…"}}'
```

### Code actions

`codeAction` returns a JSON array of available fixes and refactors for a range.
When exactly one action carries an edit it is applied automatically; when zero or
multiple carry edits the array is printed and no files are changed.

```bash
lsproxy src/foo.ts textDocument codeAction --dry-run 12:1-12:20

# Filter by kind (comma-separated; valid: quickfix, refactor, refactor.extract, source, …)
lsproxy src/foo.ts textDocument codeAction --code-action-only quickfix,refactor 12:1-12:20

# Specify trigger kind: 1 = Invoked (user gesture), 2 = Automatic (on save / idle)
lsproxy src/foo.ts textDocument codeAction --code-action-trigger-kind 1 12:1-12:20
```

Run `lsproxy --help typescript textDocument codeAction` to see the full parameter schema
and an illustrative example input/output for the connected server. Add `--json` for a
machine-readable response including `paramsSchema` and `resultSchema`.

## Troubleshooting

**Commands missing from `--help`** — lsproxy only registers commands for capabilities the
server actually advertises. If `textDocument rename` doesn't appear, the server doesn't
support `renameProvider`. Use `lsproxy <language-or-file> call initialize --params '{}'`
to inspect the server's capability response.

**Wrong positions** — Positions must be 1-based (`line:col`). Most editors display
1-based positions; LSP protocol is 0-based internally but lsproxy converts for you.
Passing 0-based values shifts edits by one line/column.

**Server not found** — Without `--server`, lsproxy walks up from `--root` looking for
`lsp.json`. If it can't find one it will time out. Either add `lsp.json` to the project
root or pass `--server <cmd>` explicitly.

**Write commands applied unexpectedly** — `rename`, `formatting`, and code actions that
produce edits write to disk immediately. Always run with `--dry-run` first on an
unfamiliar codebase.

**`references` returns only the declaration (or nothing)** — In a multi-package TypeScript
monorepo (especially with a solution-style root `tsconfig.json` that has `references` but no
`include`), `textDocument references` can come back with only the symbol's own declaration —
or an empty result — even when cross-file callers exist. This happens when the language
server has not loaded the full workspace project. lsproxy flags this case as `partial:true`
with a `warning` (and a stderr note) instead of a bare `ok:true`. Do not treat a
partial/empty result as "no callers" for a deletion or a file move; verify with a
build/type-check, or re-run against a warmed proxy daemon so the project is fully indexed.

## Help output

The CLI uses a dynamic discovery model — the help surface is built from live
server capabilities and `lsp.json` config, not a static command list.

The same tree is used for real dispatch: `lsproxy <language-or-file> <namespace> <request>`
without enough args to actually run shows the same view as the equivalent
`--help` invocation below.

**Depth 0 — bare `lsproxy` (or `lsproxy --help`)**

Lists every configured language with live daemon status (pid, uptime, docs, reqs)
or cold status (configured but not yet started). Add `--json` for machine-readable
output suitable for agents.

**Depth 1 — `lsproxy --help <language>`**

Connects to that language's server and shows its advertised namespaces
(`textDocument`, `workspace`, etc.) filtered to what the server actually supports.

**Depth 2 — `lsproxy --help <language> <namespace>`**

Lists available requests within that namespace for the running server.

**Depth 3 — `lsproxy --help <language> <namespace> <request>`**

Shows the Commander help for that specific command (positional args + all
flag-mapped params), followed by illustrative **Example input** and **Example
output** generated from the Zod schemas. Add `--json` to receive a structured
response with `arguments`, `options`, `paramsSchema`, and `resultSchema` fields —
useful for building agent prompts or automation scripts.

```bash
# Text mode — human-readable
lsproxy --help typescript textDocument codeAction

# JSON mode — machine-readable (paramsSchema + resultSchema included)
lsproxy --help typescript textDocument codeAction --json
```

## Server discovery — `lsp.json`

Without `--server`, the CLI discovers which server to launch by looking for an
`lsp.json` file, walking up from `--root` (default: cwd) to the filesystem root,
then falling back to `~/.claude/lsp.json`.

If no `lsp.json` entry matches, discovery falls back to the detected config
platforms (`lsproxy config list`) — e.g. a Rust server configured via a Claude
Code plugin is served directly, no `config import` needed. `lsp.json` always
wins on overlap; the bare `lsproxy` view and `--help <language>` list both
sources.

**Search order within each directory:**
1. `lsp.json`
2. `.claude/lsp.json`
3. `.github/lsp.json`

### Format

```json
{
  "lspServers": {
    "<name>": {
      "command": "<binary>",
      "args": ["<arg>", "…"],
      "fileExtensions": {
        ".<ext>": "<languageId>"
      }
    }
  }
}
```

### Example — multi-language project

```json
{
  "lspServers": {
    "typescript": {
      "command": "typescript-language-server",
      "args": ["--stdio"],
      "fileExtensions": {
        ".ts":  "typescript",
        ".tsx": "typescriptreact",
        ".js":  "javascript",
        ".jsx": "javascriptreact"
      }
    },
    "rust": {
      "command": "rust-analyzer",
      "args": [],
      "fileExtensions": {
        ".rs": "rust"
      }
    },
    "python": {
      "command": "pylsp",
      "args": [],
      "fileExtensions": {
        ".py": "python"
      }
    },
    "tailwind": {
      "command": "tailwindcss-language-server",
      "args": ["--stdio"],
      "fileExtensions": {
        ".css":    "css",
        ".html":   "html",
        ".tsx":    "typescriptreact",
        ".jsx":    "javascriptreact",
        ".svelte": "svelte",
        ".vue":    "vue"
      }
    }
  }
}
```

> **Note:** install language servers separately — e.g.  
> `npm i -g typescript-language-server typescript`  
> `rustup component add rust-analyzer`  
> `pip install python-lsp-server`  
> `npm i -g @tailwindcss/language-server`

The first entry whose `fileExtensions` map contains the file's extension wins.
Use `--server <cmd>` to bypass discovery entirely.

## Config interop — `lsproxy config`

The `config` command family reads and writes LSP server configuration across
tools that each maintain their own native format. It uses `lsp.json` as the
canonical interchange format.

```bash
lsproxy config list                        # show all platforms + detected servers
lsproxy config import claude-code          # pull Claude Code MCP servers into lsp.json
lsproxy config export copilot             # push lsp.json servers to Copilot CLI config
lsproxy config diff codex                 # diff lsp.json against Codex config (read-only)
lsproxy config list --user                # user-level scope (~/.claude/lsp.json)
lsproxy config import claude-code --json  # machine-readable JSON output
```

**Supported platforms:**

| Platform | ID | Tier |
|---|---|---|
| `lsp.json` | `lspjson` | full (canonical) |
| Copilot CLI | `copilot` | full (read + write) |
| Claude Code | `claude-code` | plugin-resolved (read + write) |
| Codex | `codex` | read-only |
| VS Code | `vscode` | read-only (detected, export unsupported) |

**Scope flags:**

- `--user` — targets `~/.claude/lsp.json` (user-level); default is the project `lsp.json`
- `--json` — machine-readable output on stdout (`{ ok, platform, added, updated, ... }`)

Importing from a plugin platform (Claude Code, Codex) stamps `marketplacePlugin` provenance into `lsp.json`, so a later `export` toggles the exact source plugin. Explicit-command platforms (Copilot CLI) round-trip directly via their `command`/`args`.
`export` skips servers that the target platform cannot represent (e.g. servers
with unsupported fields) and reports them in the `skipped` array.

## Global flags

| Flag | Default | Meaning |
|---|---|---|
| `--server <cmd>` | — | LSP server launch command (overrides `lsp.json`) |
| `--root <dir>` | cwd | Project root used for server discovery and path resolution |
| `--dry-run` | off | Print changes; do not write to disk |
| `--json` | off | Machine-readable JSON on stdout; diagnostics to stderr |
| `--wait <ms>` | `15000` | Index wait before sending requests |
| `--verbose` | off | Progress logging to stderr |
| `--allow-outside-root` | off | Allow file-path args that resolve outside `--root` |
| `--no-proxy` | off | Bypass the proxy daemon and spawn the server directly |
| `--version`, `-V` | — | Print the CLI version and exit (`lsproxy version` also works) |

### Path resolution

Relative paths are resolved against `--root`, not cwd. Any path resolving
outside `--root` is rejected unless `--allow-outside-root` is set.

## Proxy daemon

By default the CLI connects through `@lsproxy/proxy` — a background daemon that holds
warm LSP server connections. The daemon is started automatically on first use and exits
after 30 minutes of idle time.

Manage it explicitly with `lsproxy daemon` (per `--root`):

```bash
lsproxy daemon start    # spawn the daemon now (no-op if already running)
lsproxy daemon status   # "daemon: up · pid … · N backend(s) · M session(s)" or "not started"
lsproxy daemon stop     # SIGTERM the daemon
lsproxy daemon status --json   # machine-readable
```

```bash
# First invocation — daemon spawns, performs the initialize handshake (~1-3s)
lsproxy src/foo.ts textDocument hover 1:1

# Subsequent invocations — reconnects via Unix socket (<100ms)
lsproxy src/foo.ts textDocument hover 2:5

# Bypass the daemon entirely
lsproxy --no-proxy src/foo.ts textDocument hover 1:1
```

Socket path: `~/.lsproxy/<hash(root)>.sock`

## Programmatic use

```ts
import { RefactorSession, applyWorkspaceEdit, planWorkspaceEdit } from '@lsproxy/cli';
```

## License

MIT
