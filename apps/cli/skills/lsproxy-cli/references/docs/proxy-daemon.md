# Proxy daemon

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