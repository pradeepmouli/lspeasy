# @lsproxy/cli

LSP-driven CLI that connects to any Language Server Protocol server and exposes
its capabilities as typed subcommands — hover, rename, format, find-references,
code actions, and more. The command surface is built at runtime from the server's
advertised capabilities, so it works with any LSP server out of the box.

## Features

- **Semantic refactoring** — project-wide rename, move-file with importer updates, extract symbol
- **Reference tracking** — find all references, call hierarchy, workspace symbol search
- **Code actions** — list and apply quick-fixes and refactors at any range
- **Any LSP server** — TypeScript, Rust, Python, Go, or any LSP-compliant server via `lsp.json`
- **Proxy daemon** — warm server connections for sub-100ms subsequent invocations
- **Dry-run preview** — `--dry-run` prints diffs without writing; safe to inspect before committing

## Install

```bash
npx @lsproxy/cli textDocument hover src/foo.ts 12:7   # zero-install
pnpm add -g @lsproxy/cli                               # or install globally
```

## Quick Start

```bash
# Preview a rename before writing (always do this first)
lsproxy textDocument rename --dry-run src/auth/login.ts 42:15 "signIn"

# Find all references to a symbol
lsproxy textDocument references src/auth/login.ts 42:15

# List available code actions at a range, then apply the chosen one
lsproxy textDocument codeAction src/foo.ts 12:1-12:20

# Send any LSP method directly (useful for probing capabilities)
lsproxy call workspace/executeCommand --params '{"command":"typescript.reloadProjects"}'
```

Positions are **1-based** (`line:col`, editor-style).
Write-side commands apply changes to disk automatically — use `--dry-run` to preview first.

## Usage

```
lsproxy <namespace> <command> [args] [flags]
lsproxy call <method> --params <json>
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
```

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

## Help output

```
lsproxy — LSP-driven CLI

Usage:
  lsproxy <namespace> <command> [args]
  lsproxy call <method> --params <json>

Available commands depend on the connected server's advertised capabilities.
Run with a file argument to see available commands for that language:
  lsproxy textDocument hover --help src/foo.ts

Global flags:
  --server <cmd>        LSP server launch command (overrides lsp.json discovery)
  --root <dir>          Project root (default: cwd)
  --dry-run             Print changes; do not write
  --json                Machine-readable JSON on stdout; diagnostics to stderr
  --wait <ms>           Server index wait in ms (default: 15000)
  --verbose             Progress logging to stderr
  --allow-outside-root  Allow file paths outside --root
  --no-proxy            Bypass proxy daemon; connect directly to language server
  -h, --help            Show this help
```

## Server discovery — `lsp.json`

Without `--server`, the CLI discovers which server to launch by looking for an
`lsp.json` file, walking up from `--root` (default: cwd) to the filesystem root,
then falling back to `~/.claude/lsp.json`.

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

### Path resolution

Relative paths are resolved against `--root`, not cwd. Any path resolving
outside `--root` is rejected unless `--allow-outside-root` is set.

## Proxy daemon

By default the CLI connects through `@lsproxy/proxy` — a background daemon that holds
warm LSP server connections. The daemon is started automatically on first use and exits
after 30 minutes of idle time.

```bash
# First invocation — daemon spawns, performs the initialize handshake (~1-3s)
lsproxy textDocument hover src/foo.ts 1:1

# Subsequent invocations — reconnects via Unix socket (<100ms)
lsproxy textDocument hover src/foo.ts 2:5

# Bypass the daemon entirely
lsproxy --no-proxy textDocument hover src/foo.ts 1:1
```

Socket path: `~/.lsproxy/<hash(root)>.sock`

## Programmatic use

```ts
import { RefactorSession, applyWorkspaceEdit, planWorkspaceEdit } from '@lsproxy/cli';
```

## License

MIT
