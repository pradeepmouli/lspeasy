# Data Model

## DisposableEventEmitter<TEvents>
- Fields: listeners (map event -> set of listeners), disposables[]
- Behavior: attach/remove listeners, emit events, dispose all.

## HandlerRegistry<TRequest, TResponse>
- Fields: handlers (map method -> handler), categories (map prefix -> methods)
- Behavior: register/unregister/get handlers, clear all.

## TransportAttachment
- Fields: transport?, disposables[]
- Behavior: attach handlers, track transport lifecycle, detach/cleanup.

## PendingRequestTracker<TResponse>
- Fields: nextId?, pending (map id -> { resolve, reject, timeoutId?, method? })
- Behavior: create request with optional timeout, resolve/reject, clear.

## ClientState
- Fields: connected, initialized, capabilities, serverCapabilities, pending requests
- Behavior: connects to transport, sends/receives messages, disposes resources.

## ServerState
- Fields: state, capabilities, clientCapabilities, dispatcher, lifecycle manager
- Behavior: registers handlers, validates params, handles transport lifecycle.
