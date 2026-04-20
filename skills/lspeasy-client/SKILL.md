---
name: lspeasy-client
description: "Connect to LSP servers with typed client API Use when: You are implementing a custom client layer and need the same validation; behaviour that `LSPClient` uses. Otherwise this is an internal detail.; You need to monitor connection liveness — for example, to show a status."
license: MIT
---

# @lspeasy/client

Connect to LSP servers with typed client API

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

## Quick Start

```typescript
import { LSPClient } from '@lspeasy/client';
import { StdioTransport } from '@lspeasy/core';
import { spawn } from 'child_process';

// Spawn language server
const serverProcess = spawn('typescript-language-server', ['--stdio']);

// Create transport
const transport = new StdioTransport({
  input: serverProcess.stdout,
  output: serverProcess.stdin
});

// Create client
const client = new LSPClient({
  name: 'My Client',
  version: '1.0.0',
  transport
});

// Connect to server (sends initialize + initialized)
await client.connect(transport);

// Use high-level API
const hover = await client.textDocument.hover({
  textDocument: { uri: 'file:///path/to/file.ts' },
  position: { line: 10, character: 5 }
});

console.log('Hover:', hover?.contents);

// Disconnect
await client.disconnect();
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
handshake, and exposes capability-aware request namespaces), `InitializeResult` (Initialize result from server), `CancellableRequest` (Return value of `LSPClient), `NotebookDocumentNamespace` (Namespace for sending notebook-document lifecycle notifications to a server), `ConnectionHealth` (Aggregated connection health snapshot returned by
`LSPClient), `HeartbeatStatus` (Snapshot of the current heartbeat monitoring status), `StateChangeEvent` (Payload emitted when the connection state changes), `ConnectionState` (Lifecycle state of an `LSPClient` connection), `LSPClient` (Constructs an LSPClient instance)
**types:** `PartialRequestResult` (Result returned by partial-result enabled requests)
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