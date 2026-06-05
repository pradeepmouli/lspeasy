# @lsproxy/proxy

Per-root Unix domain socket daemon that holds warm LSP server connections for
`@lsproxy/cli`. Each project root gets its own daemon process; the CLI connects
to it instead of spawning a fresh language server on every invocation.

## Why

An LSP server's `initialize` handshake and project indexing typically take 1–15
seconds. Paying that cost on every `lsproxy` call makes scripting impractical.
`@lsproxy/proxy` keeps the server alive between calls so subsequent invocations
attach in under 100ms.

## How it works

```
lsproxy textDocument hover src/foo.ts 12:7
   │
   ├─ checks ~/.lsproxy/<hash(root)>.sock
   │
   ├─ (first call) spawns lsps daemon, awaits socket
   │
   └─ connects via SocketTransport ──► ClientSession
                                           │
                              BackendPool ◄┤ (one LSPClient per languageId)
                                           │
                              LSP server ◄─┘ (warm, already initialized)
```

**`BackendPool`** — one `LSPClient` per `languageId`, lazy-initialised on first
use, with a configurable idle timeout (default 10 min) after which the server
process is killed and restarted on the next request.

**`DocumentStateManager`** — deduplicates `textDocument/didOpen` across
concurrent CLI sessions pointing at the same file, and fires `textDocument/didClose`
lazily (default 5 min after the last session referencing a URI disconnects).

**`ClientSession`** — intercepts `initialize` (responds with the server's
capabilities from the pool), `shutdown`/`exit` (no-op so the daemon stays up),
and routes `textDocument/*` to the correct backend by URI extension.

## Daemon lifecycle

| Event | Action |
|---|---|
| First CLI connection for a root | Daemon spawned automatically by the CLI |
| All CLI sessions disconnected | Idle timer starts (default 30 min) |
| Idle timeout fires | Daemon exits cleanly |
| Language server idle (no requests) | Backend killed after `--backend-idle-timeout` (default 10 min) |

## Socket paths

```
~/.lsproxy/<sha1(absoluteRoot).slice(0,12)>.sock   # daemon socket
~/.lsproxy/<sha1(absoluteRoot).slice(0,12)>.pid    # PID file
```

## Running directly

The daemon is normally spawned by the CLI. To run it manually:

```bash
node dist/main.js --root /path/to/project

# Optional flags:
#   --socket <path>              override socket path
#   --idle-timeout <ms>          daemon idle shutdown (default 1800000 = 30min)
#   --backend-idle-timeout <ms>  per-server idle kill (default 600000 = 10min)
#   --lazy-close-delay <ms>      didClose debounce (default 300000 = 5min)
```

## License

MIT
