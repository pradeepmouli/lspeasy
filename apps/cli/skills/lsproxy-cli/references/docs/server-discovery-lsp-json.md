# Server discovery (lsp.json)

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