[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WorkerLike

# Interface: WorkerLike

Defined in: [packages/core/src/transport/worker-types.ts:9](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/worker-types.ts#L9)

Minimal worker contract required by dedicated worker transport.

## Methods

### addEventListener()

#### Call Signature

> **addEventListener**(`event`, `handler`): `void`

Defined in: [packages/core/src/transport/worker-types.ts:11](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/worker-types.ts#L11)

##### Parameters

###### event

`"message"`

###### handler

(`event`) => `void`

##### Returns

`void`

#### Call Signature

> **addEventListener**(`event`, `handler`): `void`

Defined in: [packages/core/src/transport/worker-types.ts:12](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/worker-types.ts#L12)

##### Parameters

###### event

`"error"`

###### handler

(`event`) => `void`

##### Returns

`void`

***

### postMessage()

> **postMessage**(`message`): `void`

Defined in: [packages/core/src/transport/worker-types.ts:10](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/worker-types.ts#L10)

#### Parameters

##### message

[`Message`](../type-aliases/Message.md)

#### Returns

`void`

***

### removeEventListener()

#### Call Signature

> **removeEventListener**(`event`, `handler`): `void`

Defined in: [packages/core/src/transport/worker-types.ts:13](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/worker-types.ts#L13)

##### Parameters

###### event

`"message"`

###### handler

(`event`) => `void`

##### Returns

`void`

#### Call Signature

> **removeEventListener**(`event`, `handler`): `void`

Defined in: [packages/core/src/transport/worker-types.ts:14](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/worker-types.ts#L14)

##### Parameters

###### event

`"error"`

###### handler

(`event`) => `void`

##### Returns

`void`

***

### terminate()?

> `optional` **terminate**(): `void`

Defined in: [packages/core/src/transport/worker-types.ts:15](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/worker-types.ts#L15)

#### Returns

`void`
