# Types & Enums

## client

### `LSPClient`
@lspeasy/client - LSP Client for connecting to language servers
```ts
BaseLSPClient<ClientCaps> & Client<ClientCaps, ServerCapabilities>
```

## Client

### `ClientOptions`
Configuration for an `LSPClient` instance.
**Properties:**
- `name: string` (optional) — Client identification (sent in initialize request)
- `version: string` (optional) — Client version
- `capabilities: ClientCaps` (optional) — Client capabilities to advertise
- `logger: Logger` (optional) — Logger instance for client logging
- `logLevel: LogLevel` (optional) — Log level for built-in console logger
- `requestTimeout: number` (optional) — Default request timeout in milliseconds for outgoing requests
- `strictCapabilities: boolean` (optional) — Strict capability checking mode
When true, throws error if handler registered or request sent for unsupported capability
When false, logs warning and allows registration/sending (default: false)
- `middleware: (Middleware | ScopedMiddleware)[]` (optional) — Optional middleware chain for clientToServer/serverToClient messages.
- `heartbeat: HeartbeatConfig` (optional) — Optional heartbeat configuration (disabled by default).
- `dynamicRegistration: DynamicRegistrationBehavior` (optional) — Behavior controls for server-driven dynamic registration.
- `onValidationError: (error: ZodError, response: ResponseMessage) => void` (optional) — Callback for response validation errors

### `CancellableRequest`
Return value of `LSPClient.sendCancellableRequest`.
**Properties:**
- `promise: Promise<T>` — Promise that resolves with the request result or rejects on cancellation.
- `cancel: () => void` — Cancels the in-flight request and sends `$/cancelRequest` to the server.

### `PartialRequestOptions`
Options for `LSPClient.sendRequestWithPartialResults`.
**Properties:**
- `token: string | number` (optional) — Custom `partialResultToken` value; auto-generated when omitted.
- `onPartial: (partial: TPartial) => void` — Called for each `$/progress` notification carrying a partial result.

### `ConnectionHealth`
Aggregated connection health snapshot returned by
`LSPClient.getConnectionHealth()`.
**Properties:**
- `state: ConnectionState`
- `lastMessageSent: Date | null`
- `lastMessageReceived: Date | null`
- `heartbeat: HeartbeatStatus` (optional)

### `HeartbeatConfig`
Configuration for optional heartbeat monitoring.
**Properties:**
- `enabled: boolean` (optional) — Whether heartbeat monitoring is active.
- `interval: number` — Interval between pings in milliseconds.
- `timeout: number` — Time to wait for a pong response in milliseconds.

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

### `NotificationWaitOptions`
Options for `NotificationWaiter` and `LSPClient.waitForNotification`.
**Properties:**
- `timeout: number` — Maximum time to wait in milliseconds before rejecting with a timeout error.
- `filter: (params: TParams) => boolean` (optional) — Optional predicate to skip notifications that don't match the expected
content. The waiter continues listening until a matching notification
arrives or the timeout expires.

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

### `NotebookDocumentNamespace`

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
