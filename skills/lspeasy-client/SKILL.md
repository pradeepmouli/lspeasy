---
name: lspeasy-client
description: "TypeScript SDK for building Language Server Protocol clients and servers LSP client package for connecting to language servers. Use when: You are implementing a custom client layer and need the same validation; behaviour that `LSPClient` uses. Otherwise this is an internal detail.; You need to monitor connection liveness — for example, to show a status."
license: MIT
---

# @lspeasy/client

TypeScript SDK for building Language Server Protocol clients and servers

Use `@lspeasy/client` when you need to build the **consumer** side of the
Language Server Protocol — an editor extension, a CLI analysis tool, a test
harness, or any process that speaks to a language server process.

The primary entry point is LSPClient. Construct it with
ClientOptions, call `connect(transport)` to complete the LSP
handshake, then use `expect<ServerCaps>()` to get typed access to
capability-aware namespaces (e.g. `client.textDocument.hover(params)`).

### Choosing a transport
| Environment | Transport |
|---|---|
| Node.js stdio/pipe | `StdioTransport` from `@lspeasy/core/node` |
| Node.js TCP | `TcpTransport` from `@lspeasy/core/node` |
| Browser / WebSocket | `WebSocketTransport` from `@lspeasy/core` |
| Web Workers | `DedicatedWorkerTransport` from `@lspeasy/core` |

### Connection health
Use ConnectionHealthTracker and HeartbeatMonitor to detect
silent transport failures. Subscribe to state-change events via
ConnectionState.

### Dynamic registration
The client handles `client/registerCapability` and
`client/unregisterCapability` requests from the server automatically,
updating the typed namespaces at runtime.

## Features

- **Capability-aware handler registration** — `server.textDocument.onHover(...)` is only callable after `registerCapabilities({ hoverProvider: true })`; mismatches are caught at both compile time and at the dispatcher.
- **Full JSON-RPC 2.0 core** — schemas, framing, request/notification/response types, and typed error codes, all validated with Zod.
- **Swappable transports** — `StdioTransport`, `TcpTransport`, `IpcTransport`, `WebSocketTransport`, `DedicatedWorkerTransport`, `SharedWorkerTransport`; write your own against the `Transport` interface.
- **Runs anywhere** — Node.js-specific transports live under `@lspeasy/core/node`; the root export is browser-safe so the same code ships to a VS Code extension and a web playground.
- **Typed client API** — `client.textDocument.hover(...)`, `client.workspace.symbol(...)`, and the full request surface with request/response types pulled from the LSP spec.
- **Composable middleware** — `composeMiddleware(...)` plus `createScopedMiddleware({ methods, direction })` for logging, tracing, metrics, or request mutation without touching the core dispatcher.
- **Lifecycle + progress + cancellation** — initialize/initialized/shutdown/exit are handled for you, with built-in partial-result and work-done progress senders and `CancellationToken` support.
- **Zod-validated messages** — every inbound message is parsed against a schema, so malformed peers surface as typed errors instead of runtime crashes.
- **Tree-shakeable, ESM-only** — pay for what you import; no CommonJS compatibility shims dragging extra code into browser bundles.

## Quick Start

### Writing a client

```typescript
import { LSPClient } from '@lspeasy/client';
import { StdioTransport } from '@lspeasy/core/node';
import { spawn } from 'node:child_process';

const proc = spawn('my-language-server', ['--stdio']);
const transport = new StdioTransport({ input: proc.stdout, output: proc.stdin });

const client = new LSPClient({ name: 'my-client', version: '1.0.0' });
await client.connect(transport);

const hover = await client.textDocument.hover({
  textDocument: { uri: 'file:///example.ts' },
  position: { line: 0, character: 6 }
});

await client.disconnect();
```

### Transports

`@lspeasy/core` ships several built-in transports. Import Node-only transports from the `/node` subpath so browser bundles stay clean.

| Transport | Import | Notes |
|-----------|--------|-------|
| `StdioTransport` | `@lspeasy/core/node` | stdin/stdout, child processes |
| `TcpTransport` | `@lspeasy/core/node` | TCP client/server with optional reconnect |
| `IpcTransport` | `@lspeasy/core/node` | Node parent/child IPC |
| `WebSocketTransport` | `@lspeasy/core` | Native `globalThis.WebSocket` (Node ≥22.4 or browsers) |
| `DedicatedWorkerTransport` | `@lspeasy/core` | Browser dedicated worker |
| `SharedWorkerTransport` | `@lspeasy/core` | Browser shared worker |

### Middleware

`@lspeasy/core/middleware` provides a composable pipeline for logging, tracing, or mutating requests on the fly:

```typescript
import { composeMiddleware, createScopedMiddleware } from '@lspeasy/core/middleware';
import type { Middleware } from '@lspeasy/core/middleware';

const logging: Middleware = async (ctx, next) => {
  console.log(`${ctx.direction} ${ctx.method}`);
  await next();
};

const textDocOnly = createScopedMiddleware(
  { methods: /^textDocument\//, direction: 'clientToServer' },
  async (ctx, next) => {
    ctx.metadata.startedAt = Date.now();
    await next();
  }
);

const middleware = composeMiddleware(logging, textDocOnly);
```

## When to Use


| Task | Use | Why |
|------|-----|-----|
| You are implementing a custom client layer and need the same validation | `CapabilityGuard` | — |
| behaviour that `LSPClient` uses. Otherwise this is an internal detail. | `CapabilityGuard` | — |
| You need to monitor connection liveness | `ConnectionHealthTracker` | for example, to show a status |
| indicator, trigger reconnection logic, or surface transport errors to users. | `ConnectionHealthTracker` | — |
| You need to detect silent transport failures | `HeartbeatMonitor` | for example, when the server |
| process dies without closing the socket, leaving the client hanging | `HeartbeatMonitor` | — |
| indefinitely on pending requests. | `HeartbeatMonitor` | — |
| You need to await a specific server-to-client notification after triggering | `NotificationWaiter` | — |
| a server-side operation | `NotificationWaiter` | for example, waiting for |
| `textDocument/publishDiagnostics` after saving a document. | `NotificationWaiter` | — |

**Avoid when:**

| Don't Use | When | Use Instead |
|-----------|------|-------------|
| `HeartbeatMonitor` | The transport already provides its own keep-alive mechanism (e.g. WebSocket | — |
| `HeartbeatMonitor` | ping frames) | adding a heartbeat on top creates redundant round-trips and |
| `HeartbeatMonitor` | may interfere with the transport's own timeout logic. | — |
| `NotificationWaiter` | You need to listen for ongoing notifications (not a one-shot wait) | use |
| `NotificationWaiter` | `LSPClient.onNotification` for persistent subscriptions instead. | — |
- API surface: 5 classes, 11 types, 2 enums, 1 constants

**NEVER:**

- NEVER construct `CapabilityGuard` before the `initialize` handshake completes.
- Server capabilities are only known after the `InitializeResult` is received;
- instantiating the guard too early will treat all methods as unsupported.
- NEVER register server-to-client handlers for capabilities not declared in
- the original `initialize` request — the server may send the corresponding
- requests, but without the capability declaration the client has no contract
- to handle them, leading to silent failures or unexpected errors.
- NEVER mutate the object returned by `getHealth()` — it is a defensive copy
- but consumers that store a reference and then modify it will see stale state.
- NEVER call `setState` from outside `LSPClient` internals. External callers
- have no knowledge of the full state-transition graph; setting state directly
- can desync the client's internal bookkeeping from the tracker's reported state.
- NEVER set `interval` shorter than the typical round-trip latency for your
- transport — doing so causes constant `onUnresponsive` callbacks on any
- non-local transport, triggering spurious reconnects.
- NEVER rely on heartbeat for authentication or access control. The heartbeat
- only confirms the transport is alive; it carries no identity information.
- NEVER create a `NotificationWaiter` without setting a timeout — an
- indefinite wait will leak the waiter permanently if the notification never
- arrives (e.g. the server suppresses it for certain file types).
- NEVER use `NotificationWaiter` to wait for notifications that arrive before
- the waiter is registered. The waiter only sees notifications emitted after
- `start()` is called; earlier notifications are silently missed.

## Configuration

4 configuration interfaces — see references/config.md for details.

## Quick Reference

**Client:** `CapabilityGuard` (Validates outgoing client requests and notifications against the server's
declared capabilities), `ClientCapabilityGuard` (Validates that server-to-client handler registrations are backed by
client capabilities declared in the `initialize` request), `ConnectionHealthTracker` (Tracks connection state transitions and message activity timestamps), `HeartbeatMonitor` (Runs interval-based heartbeat checks for active transports), `NotificationWaiter` (Tracks a single wait-for-notification operation and its timeout lifecycle), `LSPClient` (Typed LSP client that connects to a language server, manages the LSP
handshake, and exposes capability-aware request namespaces), `CancellableRequest` (Return value of `LSPClient), `NotebookDocumentNamespace` (Namespace for sending notebook-document lifecycle notifications to a server), `ConnectionHealth` (Aggregated connection health snapshot returned by
`LSPClient), `HeartbeatStatus` (Snapshot of the current heartbeat monitoring status), `StateChangeEvent` (Payload emitted when the connection state changes), `ConnectionState` (Lifecycle state of an `LSPClient` connection), `LSPClient` (Constructs an LSPClient instance)
**types:** `InitializeResult` (Initialize result from server), `PartialRequestResult` (Result returned by partial-result enabled requests)
**Transport:** `Transport` (Pluggable communication layer for JSON-RPC message exchange)
**Logging:** `Logger` (Structured logging interface used throughout lspeasy), `LogLevel` (Numeric severity levels for filtering log output)
**Lifecycle:** `Disposable` (Represents a resource that can be explicitly released)

## References

Load these on demand — do NOT read all at once:

- When using a class → read `references/classes/` for properties, methods, and inheritance
- When defining typed variables or function parameters → read `references/types.md`
- When using enum values → read `references/enums.md`
- When using exported constants → read `references/variables.md`
- When configuring options → read `references/config.md` for all settings and defaults

## Links

- [Repository](https://github.com/pradeepmouli/lspeasy)
- Author: Pradeep Mouli <pmouli@mac.com> (https://github.com/pradeepmouli)