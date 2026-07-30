# Classes

## Client

### `CapabilityGuard`
Validates outgoing client requests and notifications against the server's
declared capabilities.
```ts
constructor(capabilities: ServerCapabilities, logger: Logger, strict: boolean): CapabilityGuard
```
**Methods:**
- `canSendRequest(method: string): boolean` — Returns `true` if the server capability for `method` is declared.
- `canSendNotification(method: string): boolean` — Returns `true` if the server capability for `method` is declared.
- `getServerCapabilities(): ServerCapabilities` — Returns a defensive copy of the server capabilities this guard was built from.

### `ClientCapabilityGuard`
Validates that server-to-client handler registrations are backed by
client capabilities declared in the `initialize` request.
```ts
constructor(capabilities: ClientCapabilities, logger: Logger, strict: boolean): ClientCapabilityGuard
```
**Methods:**
- `canRegisterHandler(method: string): boolean` — Returns `true` if the client has declared the capability required to handle `method`.
- `getClientCapabilities(): ClientCapabilities` — Returns a defensive copy of the client capabilities this guard was built from.

### `ConnectionHealthTracker`
Tracks connection state transitions and message activity timestamps.
*extends `Transport<HealthEventMap>`*
```ts
constructor(): ConnectionHealthTracker
```
**Methods:**
- `getHealth(): ConnectionHealth` — Returns a defensive copy of the current health snapshot.
- `setState(next: ConnectionState, reason?: string): void` — Updates connection state and emits state/health change events.
- `markMessageSent(): void` — Records outbound message activity.
- `markMessageReceived(): void` — Records inbound message activity.
- `setHeartbeat(status: HeartbeatStatus): void` — Updates the heartbeat subsection of the current health snapshot.
- `onStateChange(handler: (event: StateChangeEvent) => void): () => void` — Subscribes to connection state transitions.
- `onHealthChange(handler: (health: ConnectionHealth) => void): () => void` — Subscribes to health snapshot updates.

### `HeartbeatMonitor`
Runs interval-based heartbeat checks for active transports.
```ts
constructor(options: HeartbeatMonitorOptions): HeartbeatMonitor
```
**Methods:**
- `start(): void` — Starts heartbeat interval checks.
- `stop(): void` — Stops heartbeat interval checks.
- `markPong(): void` — Marks a successful heartbeat response.
- `getStatus(): HeartbeatStatus` — Returns the latest heartbeat status snapshot.

### `NotificationWaiter`
Tracks a single wait-for-notification operation and its timeout lifecycle.
```ts
constructor<TParams>(method: string, options: NotificationWaitOptions<TParams>, resolve: (params: TParams) => void, reject: (error: Error) => void, onCleanup: () => void): NotificationWaiter<TParams>
```
**Methods:**
- `start(): void` — Starts timeout tracking for the wait operation.
- `matches(method: string, params: TParams): boolean` — Returns whether an incoming notification satisfies this waiter.
- `resolve(params: TParams): void` — Resolves the waiter and performs cleanup.
- `reject(error: Error): void` — Rejects the waiter and performs cleanup.
- `cleanup(): void` — Clears timeout state and detaches waiter resources.
```ts
// Wait for diagnostics after saving
const diags = await client.waitForNotification(
  'textDocument/publishDiagnostics',
  {
    timeout: 5000,
    filter: (params) => params.uri === 'file:///src/main.ts',
  }
);
console.log(diags.diagnostics);
```
