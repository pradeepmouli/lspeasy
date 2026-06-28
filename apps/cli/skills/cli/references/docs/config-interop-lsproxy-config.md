# Config interop (lsproxy config)

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

`import` stamps provenance so a subsequent `export` round-trips correctly.
`export` skips servers that the target platform cannot represent (e.g. servers
with unsupported fields) and reports them in the `skipped` array.