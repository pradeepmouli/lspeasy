# @lsproxy/cli

LSP-driven CLI that connects to any Language Server Protocol server and exposes
its capabilities as typed subcommands — hover, rename, format, find-references,
code actions, and more. The command surface is built at runtime from the server's
advertised capabilities, so it works with any LSP server out of the box.

## Install

```bash
npx @lsproxy/cli textDocument hover src/foo.ts 12:7   # zero-install
pnpm add -g @lsproxy/cli                               # or install globally
```

## Usage

```
lspeasy <namespace> <command> [args] [flags]
lspeasy call <method> --params <json>
```

Commands are built from the server's capabilities at startup:

```bash
lspeasy textDocument hover       src/foo.ts 12:7
lspeasy textDocument rename      src/foo.ts 12:7 newName
lspeasy textDocument references  src/foo.ts 12:7
lspeasy textDocument definition  src/foo.ts 12:7
lspeasy textDocument formatting  src/foo.ts
lspeasy textDocument rangeFormatting src/foo.ts 1:1-50:1
lspeasy textDocument codeAction  src/foo.ts 12:1-12:20
lspeasy textDocument onTypeFormatting src/foo.ts 12:7 --ch ";" --on-type-formatting-tab-size 2 --on-type-formatting-insert-spaces true
lspeasy workspace   symbol       MyClass
lspeasy call        textDocument/semanticTokens/full --params '{"textDocument":{"uri":"file:///…"}}'
```

Positions are **1-based** (`line:col`, editor-style).  
Write-side commands (`rename`, `formatting`, code actions that produce edits)
apply changes to disk automatically. Pass `--dry-run` to preview instead.

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
lspeasy textDocument hover src/foo.ts 1:1

# Subsequent invocations — reconnects via Unix socket (<100ms)
lspeasy textDocument hover src/foo.ts 2:5

# Bypass the daemon entirely
lspeasy --no-proxy textDocument hover src/foo.ts 1:1
```

Socket path: `~/.lsproxy/<hash(root)>.sock`

## Programmatic use

```ts
import { RefactorSession, applyWorkspaceEdit, planWorkspaceEdit } from '@lsproxy/cli';
```

## License

MIT
