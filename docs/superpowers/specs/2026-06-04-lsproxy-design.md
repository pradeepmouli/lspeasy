# lsproxy Design

> **For agentic workers:** This spec describes a multi-package feature spanning `@lspeasy/core`, `@lsproxy/cli`, and `@lsproxy/proxy`. Use superpowers:writing-plans to produce the implementation plan before starting work.

**Goal:** A language-agnostic LSP proxy daemon that eliminates per-invocation server startup cost for the `@lsproxy/cli` tool, while keeping the CLI architecture unchanged below the connection layer.

**Architecture:** A per-root Unix domain socket daemon (`@lsproxy/proxy`) holds warm connections to one or more language servers. The CLI auto-starts the daemon on first use and connects via a generic `SocketTransport`. All routing, document-state deduplication, and idle lifecycle management happen inside the proxy — the CLI's request/response path is unchanged.

**Tech Stack:** TypeScript, Node.js `net` module (Unix domain sockets), `@lspeasy/core` transports and client, pnpm workspaces monorepo.

---

## Monorepo structure

```
packages/
  core/          → @lspeasy/core      (gains SocketTransport, LspJsonDiscovery)
  client/        → @lspeasy/client
  server/        → @lspeasy/server
  middleware/    → @lspeasy/middleware

apps/
  cli/           → @lsproxy/cli       (moved from packages/cli, proxy-aware connect)
  proxy/         → @lsproxy/proxy     (new daemon)
```

`packages/` contains SDK pieces consumed as libraries. `apps/` contains executables with `bin` entries — neither CLI nor proxy is a reusable library. `@lsproxy/proxy` depends on `@lspeasy/core` and `@lspeasy/client` via pnpm workspace links.

`discover.ts` (the `lsp.json` config reader) moves from `apps/cli/` into `@lspeasy/core` so both `@lsproxy/cli` and `@lsproxy/proxy` can import it without a circular dependency (`@lsproxy/cli` depends on `@lsproxy/proxy` for `ensureDaemonRunning`; if proxy imported from cli that would be a cycle).

---

## 1. SocketTransport (`@lspeasy/core`)

Replace (or extend) the existing `TcpTransport` with a unified `SocketTransport` that accepts either a TCP address or a Unix domain socket path:

```typescript
type SocketTransportOptions =
  | { path: string }           // Unix domain socket
  | { host: string; port: number };  // TCP
```

Internally both cases use `net.Socket` / `net.createConnection` — Node accepts both option shapes identically. This replaces `TcpTransport` with no behaviour change for existing TCP consumers.

**Why not `IpcTransport`?** The existing `IpcTransport` uses Node's process IPC channel (`process.send` / `process.on('message')`), which is a parent-child pipe established at fork time — point-to-point, not a server socket. Unix domain sockets via `net` are a different API: a server accepts multiple unrelated client connections. The two happen to share the same kernel mechanism on macOS/Linux but are not interchangeable at the Node.js API level.

---

## 2. ProxyServer (`@lsproxy/proxy`)

### Socket path

```
~/.lsproxy/{sha1(absoluteRoot).slice(0, 12)}.sock
~/.lsproxy/{sha1(absoluteRoot).slice(0, 12)}.pid
```

One proxy process per project root. The hash makes paths stable and collision-resistant without needing directory escaping.

### Components

**`ProxyServer`**
Top-level daemon entry point. Creates a `net.Server` listening on the socket path, writes PID file on start, removes it on clean exit. Tracks `lastActivityAt`; shuts down gracefully after `idleTimeoutMs` (default: 30 min) with no connected clients.

**`ClientSession`**
One instance per connected CLI process. Speaks LSP-as-server to the CLI over the socket. On receiving `initialize`, extracts `initializationOptions.languageId`, calls `BackendPool.ensureBackend(languageId)`, and forwards the backend's `InitializeResult` verbatim to the CLI — so the CLI sees real server capabilities, not synthesized ones. Forwards all subsequent requests to the appropriate backend (routed by `textDocument.uri` extension) and passes responses straight back. On disconnect, notifies `DocumentStateManager`.

**`BackendPool`**
Map of `languageId → LSPClient`. Lazily starts each backend on first request using the `lsp.json` discovery logic (reused from `@lsproxy/cli`). Reuses the warm connection for all `ClientSession`s. Per-backend idle timer (default: 10 min): shuts down and removes the backend if no requests arrive; restarts on next use.

**`DocumentStateManager`**
Tracks `{ uri → { content: string, contentHash: string, openSessions: Set<sessionId> } }`.

On `textDocument/didOpen` from a session:
- URI already open, same content → no-op (skip forward to backend)
- URI already open, different content → forward `textDocument/didChange` to backend, update stored content
- URI not open → forward `didOpen` to backend, record state

On session disconnect:
- Remove `sessionId` from `openSessions` for each URI the session had open
- When `openSessions.size === 0`: schedule `textDocument/didClose` to backend after lazy-close delay (default: 5 min)
- If another session opens the same URI before the timer fires: cancel the timer

This keeps documents warm across back-to-back CLI invocations on the same file.

### Request routing

For `textDocument/*` requests: extract `textDocument.uri`, derive language from file extension via the same `lsp.json` extension map, route to the matching backend.

For `workspace/symbol` and other non-file requests: route to the backend whose `languageId` was declared in `initialize`.

### Daemon lifecycle

`ProxyServer` is started by `lsproxy --root <path> --socket <socketPath>` with stdio closed (spawned detached by the CLI). It runs until:
- Idle timeout fires (no clients for `idleTimeoutMs`)
- `SIGTERM` received
- All backends have exited unexpectedly

On shutdown: send `shutdown` + `exit` to each live backend, close the socket, remove PID and socket files.

---

## 3. CLI auto-start (`@lsproxy/cli`)

A new `connectViaProxy` function wraps the existing direct-connect path:

```typescript
// cli.ts — before current direct-connect code
const session = flags.noProxy
  ? await connectDirect(flags, languageId, serverCommand)
  : await connectViaProxy(flags, languageId) ?? await connectDirect(flags, languageId, serverCommand);
```

`connectViaProxy`:
1. Compute `socketPath` from `flags.root`
2. Try `net.createConnection(socketPath)`
3. On `ENOENT` / `ECONNREFUSED`:
   - Spawn `lsproxy --root <root> --socket <socketPath>` detached, stdio ignored
   - Poll for socket file existence, max 5 s at 100 ms intervals
   - Connect and return session
4. Return a `RefactorSession` constructed with a `SocketTransport({ path: socketPath })` instead of spawning a language server process — no new interface needed, all downstream code (`build-commands.ts`, `zod-to-commander.ts`, retry loop) is unchanged

`--no-proxy` flag bypasses proxy entirely — useful for debugging or environments where a persistent daemon is unwanted.

Everything downstream (`build-commands.ts`, `zod-to-commander.ts`, the retry loop) is unchanged — the proxy is fully transparent to the request/response layer.

---

## 4. Key flows

### initialize
```
CLI → proxy:  initialize { initializationOptions: { languageId: 'typescript' } }
proxy:        BackendPool.ensureBackend('typescript')
              → spawn typescript-language-server if not running
              → initialize handshake with real server
proxy → CLI:  InitializeResult (verbatim from real server)
```

### didOpen (warm path)
```
CLI → proxy:  textDocument/didOpen { uri: 'file:///src/foo.ts', text: '...' }
proxy:        DocumentStateManager: uri already open, same content → no-op
proxy → CLI:  (no response needed for notifications)
```

### Request routing
```
CLI → proxy:  textDocument/hover { textDocument: { uri: 'file:///src/foo.ts' } }
proxy:        extname('.ts') → 'typescript' backend
proxy → ts:   textDocument/hover (forwarded)
ts → proxy:   Hover result
proxy → CLI:  Hover result (forwarded)
```

### Session disconnect + lazy close
```
CLI disconnects
proxy:  DocumentStateManager.onSessionEnd(sessionId)
        for each uri in session:
          openSessions.delete(sessionId)
          if openSessions.size === 0:
            setTimeout(() => backend.didClose(uri), lazyCloseMs)
```

---

## 5. Configuration

All timeouts configurable via flags on `lsproxy` and via `lsp.json`:

| Option | Default | Meaning |
|---|---|---|
| `--idle-timeout` | `1800000` (30 min) | Shut down proxy when no clients connected |
| `--backend-idle-timeout` | `600000` (10 min) | Shut down individual backend when unused |
| `--lazy-close-delay` | `300000` (5 min) | Delay before sending didClose after last session closes a doc |
| `--socket` | `~/.lsproxy/{hash}.sock` | Override socket path |

---

## 6. Out of scope (this iteration)

- **Editor connectivity** — editors expect stdio; the proxy only exposes a Unix socket. Adding stdio requires a thin adapter that re-sends `initialize` and acts as a second `ClientSession`. Deferred.
- **Single global proxy** — per-root is simpler and correct for now; a global proxy with multi-root multiplexing is a later evolution.
- **`workspace/applyEdit` fan-out** — the proxy forwards `workspace/applyEdit` pushes from backends to the correct `ClientSession`. Multi-session conflict resolution (two CLIs editing the same file simultaneously) is out of scope.
- **Windows named pipes** — the `SocketTransport` `{ path }` option works for Unix domain sockets. Named pipe support (`\\.\pipe\...`) requires a separate code path; deferred.
