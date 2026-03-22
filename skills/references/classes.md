# Classes

## `WorkspaceChange`
A workspace change helps constructing changes to a workspace.
```ts
constructor(workspaceEdit?: WorkspaceEdit): WorkspaceChange
```
**Methods:**
- `getTextEditChange(textDocument: OptionalVersionedTextDocumentIdentifier): TextEditChange` — Returns the TextEditChange to manage text edits
for resources.
- `createFile(uri: string, options?: CreateFileOptions): void` — 
- `renameFile(oldUri: string, newUri: string, options?: RenameFileOptions): void` — 
- `deleteFile(uri: string, options?: DeleteFileOptions): void` — 

## `RegistrationType`
```ts
constructor<RO>(method: string): RegistrationType<RO>
```
**Properties:**
- `____: [RO, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 

## `ProtocolRequestType0`
Classes to type request response pairs
```ts
constructor<R, PR, E, RO>(method: string): ProtocolRequestType0<R, PR, E, RO>
```
**Properties:**
- `__: [PR, _EM] | undefined` — Clients must not use these properties. They are here to ensure correct typing.
in TypeScript
- `___: [PR, RO, _EM] | undefined` — 
- `____: [RO, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `_pr: PR | undefined` — 
- `_: [R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `ProtocolRequestType`
```ts
constructor<P, R, PR, E, RO>(method: string): ProtocolRequestType<P, R, PR, E, RO>
```
**Properties:**
- `__: [PR, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `___: [PR, RO, _EM] | undefined` — 
- `____: [RO, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `_pr: PR | undefined` — 
- `_: [P, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `ProtocolNotificationType0`
```ts
constructor<RO>(method: string): ProtocolNotificationType0<RO>
```
**Properties:**
- `___: [RO, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `____: [RO, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `_: [_EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `ProtocolNotificationType`
```ts
constructor<P, RO>(method: string): ProtocolNotificationType<P, RO>
```
**Properties:**
- `___: [RO, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `____: [RO, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `_: [P, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `DedicatedWorkerTransport`
JSON-RPC transport backed by a Dedicated Worker instance.
```ts
constructor(options: DedicatedWorkerTransportOptions): DedicatedWorkerTransport
```
**Methods:**
- `send(message: Message): Promise<void>` — Send a message to the remote peer
- `onMessage(handler: (message: Message) => void): Disposable` — Subscribe to incoming messages
- `onError(handler: (error: Error) => void): Disposable` — Subscribe to transport errors
- `onClose(handler: () => void): Disposable` — Subscribe to connection close
- `close(): Promise<void>` — Close the transport connection
- `isConnected(): boolean` — Check if transport is connected

## `SharedWorkerTransport`
JSON-RPC transport for Shared Worker environments with per-client envelope routing.
```ts
constructor(options: SharedWorkerTransportOptions): SharedWorkerTransport
```
**Methods:**
- `send(message: Message): Promise<void>` — Send a message to the remote peer
- `onMessage(handler: (message: Message) => void): Disposable` — Subscribe to incoming messages
- `onError(handler: (error: Error) => void): Disposable` — Subscribe to transport errors
- `onClose(handler: () => void): Disposable` — Subscribe to connection close
- `close(): Promise<void>` — Close the transport connection
- `isConnected(): boolean` — Check if transport is connected

## `WebSocketTransport`
WebSocket-based transport for LSP communication

Supports both client and server modes:
- Client mode: Connects to a WebSocket server URL
- Server mode: Wraps an existing WebSocket connection
```ts
constructor(options: WebSocketTransportOptions): WebSocketTransport
```
**Methods:**
- `send(message: Message): Promise<void>` — Send a message through the WebSocket
- `onMessage(handler: (message: Message) => void): Disposable` — Register a handler for incoming messages
- `onError(handler: (error: Error) => void): Disposable` — Register a handler for transport errors
- `onClose(handler: () => void): Disposable` — Register a handler for transport closure
- `close(): Promise<void>` — Close the WebSocket connection
- `isConnected(): boolean` — Check if the transport is currently connected
- `getReconnectAttempts(): number` — Get the current reconnection attempt count
- `isReconnectEnabled(): boolean` — Check if reconnection is enabled

## `TransportEventEmitter`
Transport event emitter
```ts
constructor(): TransportEventEmitter
```
**Methods:**
- `emitConnect(): void` — Emit connect event
- `emitDisconnect(): void` — Emit disconnect event
- `emitError(error: Error): void` — Emit error event
- `emitMessage(message: Message): void` — Emit message event
- `on<K>(event: K, listener: Listener<TransportEventMap, K>): Disposable` — Register a listener and receive a disposable to unregister it.
- `once<K>(event: K, listener: Listener<TransportEventMap, K>): Disposable` — Register a one-time listener that automatically unregisters after first emission.
- `emit<K>(event: K, args: TransportEventMap[K]): void` — Emit an event to all registered listeners in registration order.
- `dispose(): void` — Dispose all listeners and prevent further registrations.

## `DisposableStore`
Store for managing multiple disposables
```ts
constructor(): DisposableStore
```
**Methods:**
- `add<T>(disposable: T): T` — Add a disposable to the store
- `dispose(): void` — Dispose all resources in the store
- `isDisposed(): boolean` — Check if store is disposed
- `clear(): void` — Clear all disposables without disposing them

## `DisposableEventEmitter`
Event emitter that returns disposables and can dispose all listeners at once.
```ts
constructor<TEvents>(): DisposableEventEmitter<TEvents>
```
**Methods:**
- `on<K>(event: K, listener: Listener<TEvents, K>): Disposable` — Register a listener and receive a disposable to unregister it.
- `once<K>(event: K, listener: Listener<TEvents, K>): Disposable` — Register a one-time listener that automatically unregisters after first emission.
- `emit<K>(event: K, args: TEvents[K]): void` — Emit an event to all registered listeners in registration order.
- `dispose(): void` — Dispose all listeners and prevent further registrations.

## `CancellationTokenSource`
Source that controls a CancellationToken
```ts
constructor(): CancellationTokenSource
```
**Methods:**
- `cancel(): void` — Signal cancellation
- `dispose(): void` — Dispose the source

## `ConsoleLogger`
Console logger implementation
```ts
constructor(level: LogLevel): ConsoleLogger
```
**Methods:**
- `error(message: string, args: unknown[]): void` — 
- `warn(message: string, args: unknown[]): void` — 
- `info(message: string, args: unknown[]): void` — 
- `debug(message: string, args: unknown[]): void` — 
- `trace(message: string, args: unknown[]): void` — 

## `NullLogger`
No-op logger that discards all messages
```ts
constructor(): NullLogger
```
**Methods:**
- `error(): void` — 
- `warn(): void` — 
- `info(): void` — 
- `debug(): void` — 
- `trace(): void` — 

## `ResponseError`
LSP Response Error
```ts
constructor(code: number, message: string, data?: unknown): ResponseError
```
**Properties:**
- `stackTraceLimit: number` — The `Error.stackTraceLimit` property specifies the number of stack frames
collected by a stack trace (whether generated by `new Error().stack` or
`Error.captureStackTrace(obj)`).

The default value is `10` but may be set to any valid JavaScript number. Changes
will affect any stack trace captured _after_ the value has been changed.

If set to a non-number value, or set to a negative number, stack traces will
not capture any frames.
- `code: number` — 
- `data: unknown` (optional) — 
- `name: string` — 
- `message: string` — 
- `stack: string` (optional) — 
- `cause: unknown` (optional) — 
**Methods:**
- `parseError(message?: string, data?: unknown): ResponseError` — Create a parse error
- `invalidRequest(message?: string, data?: unknown): ResponseError` — Create an invalid request error
- `methodNotFound(method: string, data?: unknown): ResponseError` — Create a method not found error
- `invalidParams(message?: string, data?: unknown): ResponseError` — Create an invalid params error
- `internalError(message?: string, data?: unknown): ResponseError` — Create an internal error
- `serverNotInitialized(data?: unknown): ResponseError` — Create a server not initialized error
- `requestCancelled(data?: unknown): ResponseError` — Create a request cancelled error
- `captureStackTrace(targetObject: object, constructorOpt?: Function): void` — Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```
- `prepareStackTrace(err: Error, stackTraces: CallSite[]): any` — 
- `toJSON(): { code: number; message: string; data: unknown }` — Convert to JSON-RPC error object

## `DocumentVersionTracker`
Tracks per-document versions for change notifications.
```ts
constructor(): DocumentVersionTracker
```
**Methods:**
- `open(uri: string, initialVersion: number): void` — Starts tracking a document URI with an optional initial version.
- `nextVersion(uri: string): number` — Increments and returns the next document version.
- `currentVersion(uri: string): number | undefined` — Returns the current tracked version, if any.
- `close(uri: string): void` — Stops tracking a document URI.

## `RequestType`
```ts
constructor<P, R, E>(method: string, _parameterStructures?: ParameterStructures): RequestType<P, R, E>
```
**Properties:**
- `_: [P, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `RequestType0`
Classes to type request response pairs
```ts
constructor<R, E>(method: string): RequestType0<R, E>
```
**Properties:**
- `_: [R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `RequestType1`
```ts
constructor<P1, R, E>(method: string, _parameterStructures?: ParameterStructures): RequestType1<P1, R, E>
```
**Properties:**
- `_: [P1, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `RequestType2`
```ts
constructor<P1, P2, R, E>(method: string): RequestType2<P1, P2, R, E>
```
**Properties:**
- `_: [P1, P2, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `RequestType3`
```ts
constructor<P1, P2, P3, R, E>(method: string): RequestType3<P1, P2, P3, R, E>
```
**Properties:**
- `_: [P1, P2, P3, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `RequestType4`
```ts
constructor<P1, P2, P3, P4, R, E>(method: string): RequestType4<P1, P2, P3, P4, R, E>
```
**Properties:**
- `_: [P1, P2, P3, P4, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `RequestType5`
```ts
constructor<P1, P2, P3, P4, P5, R, E>(method: string): RequestType5<P1, P2, P3, P4, P5, R, E>
```
**Properties:**
- `_: [P1, P2, P3, P4, P5, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `RequestType6`
```ts
constructor<P1, P2, P3, P4, P5, P6, R, E>(method: string): RequestType6<P1, P2, P3, P4, P5, P6, R, E>
```
**Properties:**
- `_: [P1, P2, P3, P4, P5, P6, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `RequestType7`
```ts
constructor<P1, P2, P3, P4, P5, P6, P7, R, E>(method: string): RequestType7<P1, P2, P3, P4, P5, P6, P7, R, E>
```
**Properties:**
- `_: [P1, P2, P3, P4, P5, P6, P7, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `RequestType8`
```ts
constructor<P1, P2, P3, P4, P5, P6, P7, P8, R, E>(method: string): RequestType8<P1, P2, P3, P4, P5, P6, P7, P8, R, E>
```
**Properties:**
- `_: [P1, P2, P3, P4, P5, P6, P7, P8, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `RequestType9`
```ts
constructor<P1, P2, P3, P4, P5, P6, P7, P8, P9, R, E>(method: string): RequestType9<P1, P2, P3, P4, P5, P6, P7, P8, P9, R, E>
```
**Properties:**
- `_: [P1, P2, P3, P4, P5, P6, P7, P8, P9, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `NotificationType`
```ts
constructor<P>(method: string, _parameterStructures?: ParameterStructures): NotificationType<P>
```
**Properties:**
- `_: [P, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `NotificationType0`
```ts
constructor(method: string): NotificationType0
```
**Properties:**
- `_: [_EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `NotificationType1`
```ts
constructor<P1>(method: string, _parameterStructures?: ParameterStructures): NotificationType1<P1>
```
**Properties:**
- `_: [P1, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `NotificationType2`
```ts
constructor<P1, P2>(method: string): NotificationType2<P1, P2>
```
**Properties:**
- `_: [P1, P2, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string` — 
- `numberOfParams: number` — 

## `NotificationType3`
```ts
constructor<P1, P2, P3>(method: string): NotificationType3<P1, P2, P3>
```
**Properties:**

<!-- truncated -->
