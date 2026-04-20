# Classes

## transport

### `DedicatedWorkerTransport`
JSON-RPC transport backed by a Dedicated Worker instance.
*implements `Transport`*
```ts
constructor(options: DedicatedWorkerTransportOptions): DedicatedWorkerTransport
```
**Methods:**
- `send(message: Message): Promise<void>` — Send a message to the remote peer.
- `onMessage(handler: (message: Message) => void): Disposable` — Subscribe to incoming messages.
- `onError(handler: (error: Error) => void): Disposable` — Subscribe to transport errors.
- `onClose(handler: () => void): Disposable` — Subscribe to connection close.
- `close(): Promise<void>` — Close the transport connection and release resources.
- `isConnected(): boolean` — Returns `true` if the transport is currently connected and able to
send messages.

### `SharedWorkerTransport`
JSON-RPC transport for Shared Worker environments with per-client envelope routing.
*implements `Transport`*
```ts
constructor(options: SharedWorkerTransportOptions): SharedWorkerTransport
```
**Methods:**
- `send(message: Message): Promise<void>` — Send a message to the remote peer.
- `onMessage(handler: (message: Message) => void): Disposable` — Subscribe to incoming messages.
- `onError(handler: (error: Error) => void): Disposable` — Subscribe to transport errors.
- `onClose(handler: () => void): Disposable` — Subscribe to connection close.
- `close(): Promise<void>` — Close the transport connection and release resources.
- `isConnected(): boolean` — Returns `true` if the transport is currently connected and able to
send messages.

### `TransportEventEmitter`
Transport event emitter
*extends `DisposableEventEmitter<TransportEventMap>`*
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

## Transport

### `WebSocketTransport`
WebSocket-based transport for LSP communication.
*implements `Transport`*
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
```ts
// Client mode — connect to a running WebSocket LSP server
import { LSPClient } from '@lspeasy/server';
import { WebSocketTransport } from '@lspeasy/core';

const transport = new WebSocketTransport({ url: 'ws://localhost:2087' });
const client = new LSPClient();
await client.connect(transport);
```
```ts
// Server mode — wrap an accepted WebSocket (e.g. inside a ws upgrade handler)
import { LSPServer } from '@lspeasy/server';
import { WebSocketTransport } from '@lspeasy/core';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 2087 });
wss.on('connection', (socket) => {
  const transport = new WebSocketTransport({ socket });
  const server = new LSPServer();
  void server.listen(transport);
});
```

## Lifecycle

### `DisposableStore`
Collects multiple `Disposable` instances and releases them together.
*implements `Disposable`*
```ts
constructor(): DisposableStore
```
**Methods:**
- `add<T>(disposable: T): T` — Add a disposable to the store
- `dispose(): void` — Dispose all resources in the store
- `isDisposed(): boolean` — Check if store is disposed
- `clear(): void` — Clear all disposables without disposing them
```ts
import { DisposableStore } from '@lspeasy/core';
import { LSPServer } from '@lspeasy/server';

const server = new LSPServer();
const disposables = new DisposableStore();

disposables.add(server.onRequest('textDocument/hover', handleHover));
disposables.add(server.onRequest('textDocument/completion', handleCompletion));

// Later — unregister all handlers at once
disposables.dispose();
```

### `CancellationTokenSource`
Controller that creates and manages a `CancellationToken`.
```ts
constructor(): CancellationTokenSource
```
**Methods:**
- `cancel(): void` — Signal cancellation
- `dispose(): void` — Dispose the source
```ts
import { CancellationTokenSource } from '@lspeasy/core';
import { LSPClient } from '@lspeasy/client';

const source = new CancellationTokenSource();
const promise = client.sendRequest('textDocument/hover', params, source.token);

// Cancel from user interaction
cancelButton.addEventListener('click', () => source.cancel());

try {
  const result = await promise;
} catch {
  // Cancelled
} finally {
  source.dispose();
}
```

## utils

### `DisposableEventEmitter`
Event emitter that returns disposables and can dispose all listeners at once.
```ts
constructor<TEvents>(): DisposableEventEmitter<TEvents>
```
**Methods:**
- `on<K>(event: K, listener: Listener<TEvents, K>): Disposable` — Register a listener and receive a disposable to unregister it.
- `once<K>(event: K, listener: Listener<TEvents, K>): Disposable` — Register a one-time listener that automatically unregisters after first emission.
- `emit<K>(event: K, args: TEvents[K]): void` — Emit an event to all registered listeners in registration order.
- `dispose(): void` — Dispose all listeners and prevent further registrations.

## Logging

### `ConsoleLogger`
Logger implementation that writes to the process console with level filtering.
*implements `Logger`*
```ts
constructor(level: LogLevel): ConsoleLogger
```
**Methods:**
- `error(message: string, args: unknown[]): void`
- `warn(message: string, args: unknown[]): void`
- `info(message: string, args: unknown[]): void`
- `debug(message: string, args: unknown[]): void`
- `trace(message: string, args: unknown[]): void`
```ts
import { ConsoleLogger, LogLevel } from '@lspeasy/core';
import { LSPServer } from '@lspeasy/server';

// Only emit errors and warnings
const server = new LSPServer({
  logger: new ConsoleLogger(LogLevel.Warn),
});
```

### `NullLogger`
No-op logger that silently discards all messages.
*implements `Logger`*
```ts
constructor(): NullLogger
```
**Methods:**
- `error(): void`
- `warn(): void`
- `info(): void`
- `debug(): void`
- `trace(): void`

## Errors

### `ResponseError`
An `Error` subclass that maps to a JSON-RPC 2.0 error response.
*extends `Error`*
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
- `code: number`
- `data: unknown` (optional)
- `name: string`
- `message: string`
- `stack: string` (optional)
- `cause: unknown` (optional)
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
- `prepareStackTrace(err: Error, stackTraces: CallSite[]): any`
- `toJSON(): { code: number; message: string; data: unknown }` — Serializes to the JSON-RPC wire format (`{ code, message, data? }`).
```ts
import { ResponseError, JSONRPCErrorCode } from '@lspeasy/core';
import { LSPServer } from '@lspeasy/server';

const server = new LSPServer();
server.onRequest('textDocument/hover', async (params) => {
  const doc = getDocument(params.textDocument.uri);
  if (!doc) {
    throw ResponseError.invalidParams(`Unknown document: ${params.textDocument.uri}`);
  }
  return computeHover(doc, params.position);
});
```

## Document

### `DocumentVersionTracker`
Tracks monotonically increasing version numbers for open text documents.
```ts
constructor(): DocumentVersionTracker
```
**Methods:**
- `open(uri: string, initialVersion: number): void` — Starts tracking a document URI with an optional initial version.
- `nextVersion(uri: string): number` — Increments and returns the next document version.
- `currentVersion(uri: string): number | undefined` — Returns the current tracked version, if any.
- `close(uri: string): void` — Stops tracking a document URI.
```ts
import { DocumentVersionTracker, createIncrementalDidChangeParams } from '@lspeasy/core';

const tracker = new DocumentVersionTracker();
tracker.open('file:///src/main.ts');

const params = createIncrementalDidChangeParams(
  'file:///src/main.ts',
  [{ range: { start: { line: 0, character: 0 }, end: { line: 0, character: 5 } }, text: 'hello' }],
  { tracker }
);
await client.sendNotification('textDocument/didChange', params);
```
