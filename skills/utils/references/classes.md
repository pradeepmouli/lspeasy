# Classes

## `HandlerRegistry`
Registry for request/notification handlers keyed by method.
```ts
constructor<TRequest, TResponse, TRest>(): HandlerRegistry<TRequest, TResponse, TRest>
```
**Methods:**
- `register(method: string, handler: Handler<TRequest, TResponse, TRest>): Disposable` — Register a handler for the given method.
- `unregister(method: string): void` — Unregister a handler.
- `get(method: string): Handler<TRequest, TResponse, TRest> | undefined` — Get a handler by method.
- `clear(): void` — Clear all handlers.
