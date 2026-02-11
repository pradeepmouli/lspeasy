# Utilities Contract

## DisposableEventEmitter
- Provides `on`, `emit`, and `dispose` with deterministic cleanup semantics.

## HandlerRegistry
- Provides `register`, `unregister`, `get`, `clear` for method handlers.
- Optional category grouping derives from method prefix.

## TransportAttachment
- Provides `attach`, `detach`, `isAttached` for transport lifecycle.

## PendingRequestTracker
- Provides `create`, `resolve`, `reject`, `clear` for in-flight requests.
- Request ID format is string (UUID). Timeout defaults are configurable via options.
