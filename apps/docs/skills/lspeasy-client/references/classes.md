# Classes

## Client

### `CapabilityGuard`
Validates outgoing client requests and notifications against the server's
declared capabilities.
```ts
constructor(capabilities: Partial<ServerCapabilities>, logger: Logger, strict: boolean): CapabilityGuard
```
**Methods:**
- `canSendRequest(method: string): boolean`
- `canSendNotification(method: string): boolean`
- `getServerCapabilities(): Partial<ServerCapabilities>`

### `ClientCapabilityGuard`
Validates that server-to-client handler registrations are backed by
client capabilities declared in the `initialize` request.
```ts
constructor(capabilities: Partial<ClientCapabilities>, logger: Logger, strict: boolean): ClientCapabilityGuard
```
**Methods:**
- `canRegisterHandler(method: string): boolean`
- `getClientCapabilities(): Partial<ClientCapabilities>`

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

## health

### `ConnectionHealthTracker`
Tracks connection state transitions and message activity timestamps.
*extends `DisposableEventEmitter<HealthEventMap>`*
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
- `on<K>(event: K, listener: Listener<HealthEventMap, K>): Disposable` — Register a listener and receive a disposable to unregister it.
- `once<K>(event: K, listener: Listener<HealthEventMap, K>): Disposable` — Register a one-time listener that automatically unregisters after first emission.
- `emit<K>(event: K, args: HealthEventMap[K]): void` — Emit an event to all registered listeners in registration order.
- `dispose(): void` — Dispose all listeners and prevent further registrations.

## heartbeat

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
