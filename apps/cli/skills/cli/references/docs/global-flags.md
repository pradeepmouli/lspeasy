# Global flags

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