# Classes

## `TransportAttachment`
Manages transport event listeners and disposal.
```ts
constructor(): TransportAttachment
```
**Methods:**
- `attach(transport: Transport, handlers: TransportHandlers): Disposable` — Attach to a transport and wire handlers. Returns a disposable to detach.
- `detach(): void` — Detach from the transport and dispose all listeners.
- `isAttached(): boolean` — Check if a transport is attached.

## `PendingRequestTracker`
Tracks pending requests with timeouts and cleanup.
```ts
constructor<TResponse, TMeta>(defaultTimeout?: number): PendingRequestTracker<TResponse, TMeta>
```
**Methods:**
- `create(timeout?: number, metadata?: TMeta): { id: string; promise: Promise<TResponse> }` — Create a new pending request.
- `resolve(id: string, response: TResponse): void` — Resolve a pending request.
- `reject(id: string, error: Error): void` — Reject a pending request.
- `clear(error: Error): void` — Clear all pending requests.
- `getMetadata(id: string): TMeta | undefined` — Get metadata associated with a pending request.
