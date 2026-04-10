[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WebSocketTransport

# Class: WebSocketTransport

Defined in: [packages/core/src/transport/websocket.ts:150](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/websocket.ts#L150)

WebSocket-based transport for LSP communication

Supports both client and server modes:
- Client mode: Connects to a WebSocket server URL
- Server mode: Wraps an existing WebSocket connection

## Implements

- [`Transport`](../interfaces/Transport.md)

## Constructors

### Constructor

> **new WebSocketTransport**(`options`): `WebSocketTransport`

Defined in: [packages/core/src/transport/websocket.ts:169](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/websocket.ts#L169)

#### Parameters

##### options

[`WebSocketTransportOptions`](../interfaces/WebSocketTransportOptions.md)

#### Returns

`WebSocketTransport`

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/core/src/transport/websocket.ts:395](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/websocket.ts#L395)

Close the WebSocket connection

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`close`](../interfaces/Transport.md#close)

***

### getReconnectAttempts()

> **getReconnectAttempts**(): `number`

Defined in: [packages/core/src/transport/websocket.ts:435](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/websocket.ts#L435)

Get the current reconnection attempt count

#### Returns

`number`

***

### isConnected()

> **isConnected**(): `boolean`

Defined in: [packages/core/src/transport/websocket.ts:428](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/websocket.ts#L428)

Check if the transport is currently connected

#### Returns

`boolean`

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`isConnected`](../interfaces/Transport.md#isconnected)

***

### isReconnectEnabled()

> **isReconnectEnabled**(): `boolean`

Defined in: [packages/core/src/transport/websocket.ts:442](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/websocket.ts#L442)

Check if reconnection is enabled

#### Returns

`boolean`

***

### onClose()

> **onClose**(`handler`): [`Disposable`](../interfaces/Disposable.md)

Defined in: [packages/core/src/transport/websocket.ts:382](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/websocket.ts#L382)

Register a handler for transport closure

#### Parameters

##### handler

() => `void`

#### Returns

[`Disposable`](../interfaces/Disposable.md)

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`onClose`](../interfaces/Transport.md#onclose)

***

### onError()

> **onError**(`handler`): [`Disposable`](../interfaces/Disposable.md)

Defined in: [packages/core/src/transport/websocket.ts:369](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/websocket.ts#L369)

Register a handler for transport errors

#### Parameters

##### handler

(`error`) => `void`

#### Returns

[`Disposable`](../interfaces/Disposable.md)

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`onError`](../interfaces/Transport.md#onerror)

***

### onMessage()

> **onMessage**(`handler`): [`Disposable`](../interfaces/Disposable.md)

Defined in: [packages/core/src/transport/websocket.ts:356](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/websocket.ts#L356)

Register a handler for incoming messages

#### Parameters

##### handler

(`message`) => `void`

#### Returns

[`Disposable`](../interfaces/Disposable.md)

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`onMessage`](../interfaces/Transport.md#onmessage)

***

### send()

> **send**(`message`): `Promise`\<`void`\>

Defined in: [packages/core/src/transport/websocket.ts:324](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/websocket.ts#L324)

Send a message through the WebSocket

#### Parameters

##### message

[`Message`](../type-aliases/Message.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`send`](../interfaces/Transport.md#send)
