# Types & Enums

## Client

### `LSPClient`
Typed LSP client that connects to a language server, manages the LSP
handshake, and exposes capability-aware request namespaces.
```ts
BaseLSPClient<ClientCaps> & Client<ClientCaps, ServerCapabilities>
```

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
- `state: ConnectionState`
- `lastMessageSent: Date | null`
- `lastMessageReceived: Date | null`
- `heartbeat: HeartbeatStatus` (optional)

### `HeartbeatStatus`
Snapshot of the current heartbeat monitoring status.
**Properties:**
- `enabled: boolean`
- `interval: number`
- `timeout: number`
- `lastPing: Date | null`
- `lastPong: Date | null`
- `isResponsive: boolean`

### `StateChangeEvent`
Payload emitted when the connection state changes.
Subscribe via `LSPClient.onConnectionStateChange()`.
**Properties:**
- `previous: ConnectionState`
- `current: ConnectionState`
- `timestamp: Date`
- `reason: string` (optional)

### `ConnectionState`
Lifecycle state of an `LSPClient` connection.
- `Connecting` = `"connecting"`
- `Connected` = `"connected"`
- `Disconnecting` = `"disconnecting"`
- `Disconnected` = `"disconnected"`

## types

### `InitializeResult`
Initialize result from server
**Properties:**
- `capabilities: ServerCapabilities<any>`
- `serverInfo: { name: string; version?: string }` (optional)

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
