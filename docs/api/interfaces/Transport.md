[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / Transport

# Interface: Transport

Defined in: [packages/core/src/transport/transport.ts:11](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/transport/transport.ts#L11)

Transport interface for sending/receiving JSON-RPC messages

## Methods

### close()

> **close**(): `Promise`\<`void`\>

Defined in: [packages/core/src/transport/transport.ts:38](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/transport/transport.ts#L38)

Close the transport connection

#### Returns

`Promise`\<`void`\>

***

### isConnected()

> **isConnected**(): `boolean`

Defined in: [packages/core/src/transport/transport.ts:43](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/transport/transport.ts#L43)

Check if transport is connected

#### Returns

`boolean`

***

### onClose()

> **onClose**(`handler`): [`Disposable`](Disposable.md)

Defined in: [packages/core/src/transport/transport.ts:33](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/transport/transport.ts#L33)

Subscribe to connection close

#### Parameters

##### handler

() => `void`

#### Returns

[`Disposable`](Disposable.md)

Disposable to unsubscribe

***

### onError()

> **onError**(`handler`): [`Disposable`](Disposable.md)

Defined in: [packages/core/src/transport/transport.ts:27](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/transport/transport.ts#L27)

Subscribe to transport errors

#### Parameters

##### handler

(`error`) => `void`

#### Returns

[`Disposable`](Disposable.md)

Disposable to unsubscribe

***

### onMessage()

> **onMessage**(`handler`): [`Disposable`](Disposable.md)

Defined in: [packages/core/src/transport/transport.ts:21](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/transport/transport.ts#L21)

Subscribe to incoming messages

#### Parameters

##### handler

(`message`) => `void`

#### Returns

[`Disposable`](Disposable.md)

Disposable to unsubscribe

***

### send()

> **send**(`message`): `Promise`\<`void`\>

Defined in: [packages/core/src/transport/transport.ts:15](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/transport/transport.ts#L15)

Send a message to the remote peer

#### Parameters

##### message

[`Message`](../type-aliases/Message.md)

#### Returns

`Promise`\<`void`\>
