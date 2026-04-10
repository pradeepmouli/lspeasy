[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DedicatedWorkerTransport

# Class: DedicatedWorkerTransport

Defined in: [packages/core/src/transport/dedicated-worker.ts:13](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/transport/dedicated-worker.ts#L13)

JSON-RPC transport backed by a Dedicated Worker instance.

## Implements

- [`Transport`](../interfaces/Transport.md)

## Constructors

### Constructor

> **new DedicatedWorkerTransport**(`options`): `DedicatedWorkerTransport`

Defined in: [packages/core/src/transport/dedicated-worker.ts:38](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/transport/dedicated-worker.ts#L38)

#### Parameters

##### options

[`DedicatedWorkerTransportOptions`](../interfaces/DedicatedWorkerTransportOptions.md)

#### Returns

`DedicatedWorkerTransport`

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/core/src/transport/dedicated-worker.ts:81](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/transport/dedicated-worker.ts#L81)

Close the transport connection

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`close`](../interfaces/Transport.md#close)

***

### isConnected()

> **isConnected**(): `boolean`

Defined in: [packages/core/src/transport/dedicated-worker.ts:103](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/transport/dedicated-worker.ts#L103)

Check if transport is connected

#### Returns

`boolean`

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`isConnected`](../interfaces/Transport.md#isconnected)

***

### onClose()

> **onClose**(`handler`): [`Disposable`](../interfaces/Disposable.md)

Defined in: [packages/core/src/transport/dedicated-worker.ts:72](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/transport/dedicated-worker.ts#L72)

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

Defined in: [packages/core/src/transport/dedicated-worker.ts:63](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/transport/dedicated-worker.ts#L63)

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

Defined in: [packages/core/src/transport/dedicated-worker.ts:54](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/transport/dedicated-worker.ts#L54)

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

Defined in: [packages/core/src/transport/dedicated-worker.ts:46](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/transport/dedicated-worker.ts#L46)

Send a message to the remote peer

#### Parameters

##### message

[`Message`](../type-aliases/Message.md)

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`Transport`](../interfaces/Transport.md).[`send`](../interfaces/Transport.md#send)
