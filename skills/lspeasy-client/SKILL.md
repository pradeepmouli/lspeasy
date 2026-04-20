---
name: lspeasy-client
description: "Typed LSP client with capability-aware namespaces, connection health monitoring, and heartbeat detection. Use when building editor extensions, CLI analysis tools, or test harnesses that connect to a language server — and need the lspeasy SDK (LSPClient, CapabilityGuard, ConnectionHealthTracker, HeartbeatMonitor, NotificationWaiter). Keywords: lsp, language-server-protocol, lsp-client, language-client, lspeasy."
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

**Use this skill when:**
- You need the same outbound capability validation that `LSPClient` uses internally — for a custom client layer that wraps or replaces `LSPClient`. → use `CapabilityGuard` (normally internal; only reach for it when building a custom client pipeline)
- You need to monitor connection liveness → use `ConnectionHealthTracker` — e.g. show a status indicator, trigger reconnection logic, or surface transport errors to users. Subscribe to `stateChanged` / `healthChanged` events rather than polling.
- The server process can die without closing the socket (common with stdio servers that crash silently) → use `HeartbeatMonitor` — without it, the client hangs indefinitely on pending requests with no feedback.
- You need a one-shot wait for a specific server-to-client notification after triggering a server-side operation → use `NotificationWaiter` — e.g. waiting for `textDocument/publishDiagnostics` after `textDocument/didSave`.

**Do NOT use when:**
- The transport already provides its own keep-alive (e.g. WebSocket ping frames) — `HeartbeatMonitor` on top creates redundant round-trips and may trigger spurious `onUnresponsive` callbacks that race with the transport's own timeout.
- You need ongoing notification subscriptions — use `LSPClient.onNotification` for persistent listeners. `NotificationWaiter` is one-shot and leaks if not given a timeout.

API surface: 5 classes, 11 types, 2 enums, 1 constants

## NEVER

- NEVER call `sendRequest` before `connect()` completes — the transport is not attached yet and the call throws immediately with no pending promise to catch.
- NEVER send requests after `disconnect()` — the transport is closed; pending promises reject with "Connection closed". Reconnect requires a new `connect()` call.
- NEVER share one `LSPClient` across two separate language server processes — each process is an independent JSON-RPC peer with its own ID sequence and lifecycle state; cross-process ID collisions cause silent response misrouting.
- NEVER construct `CapabilityGuard` before the `initialize` handshake completes — server capabilities are only known after `InitializeResult` is received; an early guard treats all methods as unsupported.
- NEVER register server-to-client handlers for capabilities not declared in the original `initialize` request — the server may send the requests but without the capability declaration there is no contract to handle them, producing silent failures.
- NEVER mutate the object returned by `getHealth()` — it is a defensive copy; stored references that are then modified will diverge from the live state.
- NEVER call `setState` from outside `LSPClient` internals — external callers have no knowledge of the full state-transition graph; direct mutation desyncs the tracker's reported state from the client's bookkeeping.
- NEVER set `HeartbeatMonitor.interval` shorter than the typical round-trip latency for your transport — this causes constant `onUnresponsive` callbacks on any non-local transport, triggering spurious reconnects.
- NEVER create a `NotificationWaiter` without a timeout — an indefinite wait leaks the waiter permanently if the notification never arrives (e.g. the server suppresses `publishDiagnostics` for certain file types).
- NEVER use `NotificationWaiter` to await notifications that arrive before `start()` is called — earlier notifications are silently missed; register the waiter before triggering the server-side operation.

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