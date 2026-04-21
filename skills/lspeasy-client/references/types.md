# Types & Enums

## Client

### `LSPClient`
Typed LSP client that connects to a language server, manages the LSP
handshake, and exposes capability-aware request namespaces.
```ts
BaseLSPClient<ClientCaps> & Client<ClientCaps, ServerCapabilities>
```

### `InitializeResult`
Initialize result from server.
**Properties:**
- `capabilities: ServerCapabilities<any>` — Server capabilities advertised in the `initialize` response.
- `serverInfo: { name: string; version?: string }` (optional) — Optional server identification returned by the language server.

### `CancellableRequest`
Return value of `LSPClient.sendCancellableRequest`.
**Properties:**
- `promise: Promise<T>` — Promise that resolves with the request result or rejects on cancellation.
- `cancel: () => void` — Cancels the in-flight request and sends `$/cancelRequest` to the server.

### `NotebookDocumentNamespace`
Namespace for sending notebook-document lifecycle notifications to a server.

### `ConnectionHealth`
Aggregated connection health snapshot returned by
`LSPClient.getConnectionHealth()`.
**Properties:**
- `state: ConnectionState` — Current lifecycle state of the connection.
- `lastMessageSent: Date | null` — Timestamp of the last outgoing message, or `null` if none has been sent.
- `lastMessageReceived: Date | null` — Timestamp of the last incoming message, or `null` if none has been received.
- `heartbeat: HeartbeatStatus` (optional) — Heartbeat monitoring snapshot, present only when heartbeat is configured.

### `HeartbeatStatus`
Snapshot of the current heartbeat monitoring status.
**Properties:**
- `enabled: boolean` — Whether heartbeat monitoring is active.
- `interval: number` — Interval between pings in milliseconds.
- `timeout: number` — Timeout in milliseconds before a ping is considered unanswered.
- `lastPing: Date | null` — Timestamp of the last outgoing ping, or `null` if no ping has been sent.
- `lastPong: Date | null` — Timestamp of the last received pong, or `null` if no pong has been received.
- `isResponsive: boolean` — Whether the server responded to the most recent ping within the timeout window.

### `StateChangeEvent`
Payload emitted when the connection state changes.
Subscribe via `LSPClient.onConnectionStateChange()`.
**Properties:**
- `previous: ConnectionState` — The state the connection was in before this transition.
- `current: ConnectionState` — The state the connection has transitioned into.
- `timestamp: Date` — Wall-clock time at which the state transition occurred.
- `reason: string` (optional) — Optional human-readable description of why the state changed.

### `ConnectionState`
Lifecycle state of an `LSPClient` connection.
- `Connecting` = `"connecting"`
- `Connected` = `"connected"`
- `Disconnecting` = `"disconnecting"`
- `Disconnected` = `"disconnected"`

## types

### `PartialRequestResult`
Result returned by partial-result enabled requests.
```ts
PartialRequestOutcome<TPartial, TResult>
```

## Transport

### `Transport`
Pluggable communication layer for JSON-RPC message exchange.

## Logging

### `Logger`
Structured logging interface used throughout lspeasy.

### `LogLevel`
Numeric severity levels for filtering log output.
- `Error` = `0`
- `Warn` = `1`
- `Info` = `2`
- `Debug` = `3`
- `Trace` = `4`

## Lifecycle

### `Disposable`
Represents a resource that can be explicitly released.
