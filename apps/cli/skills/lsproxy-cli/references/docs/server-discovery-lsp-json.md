# Server discovery (lsp.json)

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
      },
      "initializationOptions": { "<key>": "<value>" }
    }
  }
}
```

`initializationOptions` is optional, arbitrary JSON passed verbatim into the
server's `initialize` request — for server-specific extension flags the LSP
spec itself has no standard slot for. lspeasy merges it on top of the
`languageId` it computes automatically for `textDocument/didOpen`; an
explicit `languageId` key here overrides that.

### Example — enabling a server-specific extension flag

`typescript-language-server` only offers its deterministic "Move to file"
refactor code action (as opposed to the default, which auto-generates a new
filename each call) if the client sets a non-standard
`supportsMoveToFileCodeAction` capability during `initialize`. There's no
dedicated `lsproxy` flag for this — it's exactly what `initializationOptions`
is for:

```json
{
  "lspServers": {
    "typescript": {
      "command": "typescript-language-server",
      "args": ["--stdio"],
      "fileExtensions": { ".ts": "typescript" },
      "initializationOptions": { "supportsMoveToFileCodeAction": true }
    }
  }
}
```

With this set, `textDocument codeAction` on a movable symbol returns a
`refactor.move.file` action (in addition to the always-present
`refactor.move.newFile`) that can be driven deterministically via
`workspace executeCommand` with an explicit
`interactiveRefactorArguments.targetFile` in its `arguments`.

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