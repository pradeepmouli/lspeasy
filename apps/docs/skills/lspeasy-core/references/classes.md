# Classes

## main.d

### `WorkspaceChange`
A workspace change helps constructing changes to a workspace.
```ts
constructor(workspaceEdit?: WorkspaceEdit): WorkspaceChange
```
**Methods:**
- `getTextEditChange(textDocument: OptionalVersionedTextDocumentIdentifier): TextEditChange` — Returns the TextEditChange to manage text edits
for resources.
- `createFile(uri: string, options?: CreateFileOptions): void`
- `renameFile(oldUri: string, newUri: string, options?: RenameFileOptions): void`
- `deleteFile(uri: string, options?: DeleteFileOptions): void`

## messages.d

### `RegistrationType`
```ts
constructor<RO>(method: string): RegistrationType<RO>
```
**Properties:**
- `____: [RO, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`

### `ProtocolRequestType0`
Classes to type request response pairs
*extends `RequestType0<R, E>`*
*implements `ProgressType<PR>`, `RegistrationType<RO>`*
```ts
constructor<R, PR, E, RO>(method: string): ProtocolRequestType0<R, PR, E, RO>
```
**Properties:**
- `__: [PR, _EM] | undefined` — Clients must not use these properties. They are here to ensure correct typing.
in TypeScript
- `___: [PR, RO, _EM] | undefined`
- `____: [RO, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `_pr: PR | undefined`
- `_: [R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `ProtocolRequestType`
*extends `RequestType<P, R, E>`*
*implements `ProgressType<PR>`, `RegistrationType<RO>`*
```ts
constructor<P, R, PR, E, RO>(method: string): ProtocolRequestType<P, R, PR, E, RO>
```
**Properties:**
- `__: [PR, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `___: [PR, RO, _EM] | undefined`
- `____: [RO, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `_pr: PR | undefined`
- `_: [P, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `ProtocolNotificationType0`
*extends `NotificationType0`*
*implements `RegistrationType<RO>`*
```ts
constructor<RO>(method: string): ProtocolNotificationType0<RO>
```
**Properties:**
- `___: [RO, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `____: [RO, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `_: [_EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `ProtocolNotificationType`
*extends `NotificationType<P>`*
*implements `RegistrationType<RO>`*
```ts
constructor<P, RO>(method: string): ProtocolNotificationType<P, RO>
```
**Properties:**
- `___: [RO, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `____: [RO, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `_: [P, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `RequestType`
*extends `AbstractMessageSignature`*
```ts
constructor<P, R, E>(method: string, _parameterStructures?: ParameterStructures): RequestType<P, R, E>
```
**Properties:**
- `_: [P, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `RequestType0`
Classes to type request response pairs
*extends `AbstractMessageSignature`*
```ts
constructor<R, E>(method: string): RequestType0<R, E>
```
**Properties:**
- `_: [R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `RequestType1`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, R, E>(method: string, _parameterStructures?: ParameterStructures): RequestType1<P1, R, E>
```
**Properties:**
- `_: [P1, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `RequestType2`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, P2, R, E>(method: string): RequestType2<P1, P2, R, E>
```
**Properties:**
- `_: [P1, P2, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `RequestType3`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, P2, P3, R, E>(method: string): RequestType3<P1, P2, P3, R, E>
```
**Properties:**
- `_: [P1, P2, P3, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `RequestType4`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, P2, P3, P4, R, E>(method: string): RequestType4<P1, P2, P3, P4, R, E>
```
**Properties:**
- `_: [P1, P2, P3, P4, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `RequestType5`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, P2, P3, P4, P5, R, E>(method: string): RequestType5<P1, P2, P3, P4, P5, R, E>
```
**Properties:**
- `_: [P1, P2, P3, P4, P5, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `RequestType6`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, P2, P3, P4, P5, P6, R, E>(method: string): RequestType6<P1, P2, P3, P4, P5, P6, R, E>
```
**Properties:**
- `_: [P1, P2, P3, P4, P5, P6, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `RequestType7`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, P2, P3, P4, P5, P6, P7, R, E>(method: string): RequestType7<P1, P2, P3, P4, P5, P6, P7, R, E>
```
**Properties:**
- `_: [P1, P2, P3, P4, P5, P6, P7, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `RequestType8`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, P2, P3, P4, P5, P6, P7, P8, R, E>(method: string): RequestType8<P1, P2, P3, P4, P5, P6, P7, P8, R, E>
```
**Properties:**
- `_: [P1, P2, P3, P4, P5, P6, P7, P8, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `RequestType9`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, P2, P3, P4, P5, P6, P7, P8, P9, R, E>(method: string): RequestType9<P1, P2, P3, P4, P5, P6, P7, P8, P9, R, E>
```
**Properties:**
- `_: [P1, P2, P3, P4, P5, P6, P7, P8, P9, R, E, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `NotificationType`
*extends `AbstractMessageSignature`*
```ts
constructor<P>(method: string, _parameterStructures?: ParameterStructures): NotificationType<P>
```
**Properties:**
- `_: [P, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `NotificationType0`
*extends `AbstractMessageSignature`*
```ts
constructor(method: string): NotificationType0
```
**Properties:**
- `_: [_EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `NotificationType1`
*extends `AbstractMessageSignature`*
```ts
constructor<P1>(method: string, _parameterStructures?: ParameterStructures): NotificationType1<P1>
```
**Properties:**
- `_: [P1, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `NotificationType2`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, P2>(method: string): NotificationType2<P1, P2>
```
**Properties:**
- `_: [P1, P2, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `NotificationType3`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, P2, P3>(method: string): NotificationType3<P1, P2, P3>
```
**Properties:**
- `_: [P1, P2, P3, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `NotificationType4`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, P2, P3, P4>(method: string): NotificationType4<P1, P2, P3, P4>
```
**Properties:**
- `_: [P1, P2, P3, P4, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `NotificationType5`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, P2, P3, P4, P5>(method: string): NotificationType5<P1, P2, P3, P4, P5>
```
**Properties:**
- `_: [P1, P2, P3, P4, P5, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `NotificationType6`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, P2, P3, P4, P5, P6>(method: string): NotificationType6<P1, P2, P3, P4, P5, P6>
```
**Properties:**
- `_: [P1, P2, P3, P4, P5, P6, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `NotificationType7`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, P2, P3, P4, P5, P6, P7>(method: string): NotificationType7<P1, P2, P3, P4, P5, P6, P7>
```
**Properties:**
- `_: [P1, P2, P3, P4, P5, P6, P7, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `NotificationType8`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, P2, P3, P4, P5, P6, P7, P8>(method: string): NotificationType8<P1, P2, P3, P4, P5, P6, P7, P8>
```
**Properties:**
- `_: [P1, P2, P3, P4, P5, P6, P7, P8, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `NotificationType9`
*extends `AbstractMessageSignature`*
```ts
constructor<P1, P2, P3, P4, P5, P6, P7, P8, P9>(method: string): NotificationType9<P1, P2, P3, P4, P5, P6, P7, P8, P9>
```
**Properties:**
- `_: [P1, P2, P3, P4, P5, P6, P7, P8, P9, _EM] | undefined` — Clients must not use this property. It is here to ensure correct typing.
- `method: string`
- `numberOfParams: number`

### `ParameterStructures`
**Properties:**
- `auto: ParameterStructures` — The parameter structure is automatically inferred on the number of parameters
and the parameter type in case of a single param.
- `byPosition: ParameterStructures` — Forces `byPosition` parameter structure. This is useful if you have a single
parameter which has a literal type.
- `byName: ParameterStructures` — Forces `byName` parameter structure. This is only useful when having a single
parameter. The library will report errors if used with a different number of
parameters.
**Methods:**
- `is(value: any): value is ParameterStructures`
- `toString(): string`

## dedicated-worker

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

## shared-worker

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

## events

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

<!-- truncated -->
