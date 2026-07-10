# Proxy daemon

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