[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SharedWorkerTransport

# Class: SharedWorkerTransport

Defined in: [packages/core/src/transport/shared-worker.ts:20](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/shared-worker.ts#L20)

JSON-RPC transport for Shared Worker environments with per-client envelope routing.

## Implements

- [`Transport`](../interfaces/Transport.md)

## Constructors

### Constructor

> **new SharedWorkerTransport**(`options`): `SharedWorkerTransport`

Defined in: [packages/core/src/transport/shared-worker.ts:73](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/shared-worker.ts#L73)

#### Parameters

##### options

[`SharedWorkerTransportOptions`](../interfaces/SharedWorkerTransportOptions.md)

#### Returns

`SharedWorkerTransport`

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/core/src/transport/shared-worker.ts:128](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/shared-worker.ts#L128)

Close the transport connection

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`close`](../interfaces/Transport.md#close)

***

### isConnected()

> **isConnected**(): `boolean`

Defined in: [packages/core/src/transport/shared-worker.ts:148](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/shared-worker.ts#L148)

Check if transport is connected

#### Returns

`boolean`

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`isConnected`](../interfaces/Transport.md#isconnected)

***

### onClose()

> **onClose**(`handler`): [`Disposable`](../interfaces/Disposable.md)

Defined in: [packages/core/src/transport/shared-worker.ts:119](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/shared-worker.ts#L119)

Subscribe to connection close

#### Parameters

##### handler

() => `void`

#### Returns

[`Disposable`](../interfaces/Disposable.md)

Disposable to unsubscribe

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`onClose`](../interfaces/Transport.md#onclose)

***

### onError()

> **onError**(`handler`): [`Disposable`](../interfaces/Disposable.md)

Defined in: [packages/core/src/transport/shared-worker.ts:110](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/shared-worker.ts#L110)

Subscribe to transport errors

#### Parameters

##### handler

(`error`) => `void`

#### Returns

[`Disposable`](../interfaces/Disposable.md)

Disposable to unsubscribe

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`onError`](../interfaces/Transport.md#onerror)

***

### onMessage()

> **onMessage**(`handler`): [`Disposable`](../interfaces/Disposable.md)

Defined in: [packages/core/src/transport/shared-worker.ts:101](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/shared-worker.ts#L101)

Subscribe to incoming messages

#### Parameters

##### handler

(`message`) => `void`

#### Returns

[`Disposable`](../interfaces/Disposable.md)

Disposable to unsubscribe

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`onMessage`](../interfaces/Transport.md#onmessage)

***

### send()

> **send**(`message`): `Promise`\<`void`\>

Defined in: [packages/core/src/transport/shared-worker.ts:88](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/shared-worker.ts#L88)

Send a message to the remote peer

#### Parameters

##### message

[`Message`](../type-aliases/Message.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`send`](../interfaces/Transport.md#send)
