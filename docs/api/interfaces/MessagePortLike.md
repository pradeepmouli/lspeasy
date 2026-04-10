[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / MessagePortLike

# Interface: MessagePortLike

Defined in: [packages/core/src/transport/worker-types.ts:19](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/worker-types.ts#L19)

Minimal message port contract required by shared worker transport.

## Methods

### addEventListener()

#### Call Signature

> **addEventListener**(`event`, `handler`): `void`

Defined in: [packages/core/src/transport/worker-types.ts:21](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/worker-types.ts#L21)

##### Parameters

###### event

`"message"`

###### handler

(`event`) => `void`

##### Returns

`void`

#### Call Signature

> **addEventListener**(`event`, `handler`): `void`

Defined in: [packages/core/src/transport/worker-types.ts:22](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/worker-types.ts#L22)

##### Parameters

###### event

`"messageerror"`

###### handler

(`event`) => `void`

##### Returns

`void`

#### Call Signature

> **addEventListener**(`event`, `handler`): `void`

Defined in: [packages/core/src/transport/worker-types.ts:23](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/worker-types.ts#L23)

##### Parameters

###### event

`"error"`

###### handler

(`event`) => `void`

##### Returns

`void`

***

### close()?

> `optional` **close**(): `void`

Defined in: [packages/core/src/transport/worker-types.ts:28](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/worker-types.ts#L28)

#### Returns

`void`

***

### postMessage()

> **postMessage**(`message`): `void`

Defined in: [packages/core/src/transport/worker-types.ts:20](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/worker-types.ts#L20)

#### Parameters

##### message

`unknown`

#### Returns

`void`

***

### removeEventListener()

#### Call Signature

> **removeEventListener**(`event`, `handler`): `void`

Defined in: [packages/core/src/transport/worker-types.ts:24](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/worker-types.ts#L24)

##### Parameters

###### event

`"message"`

###### handler

(`event`) => `void`

##### Returns

`void`

#### Call Signature

> **removeEventListener**(`event`, `handler`): `void`

Defined in: [packages/core/src/transport/worker-types.ts:25](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/worker-types.ts#L25)

##### Parameters

###### event

`"messageerror"`

###### handler

(`event`) => `void`

##### Returns

`void`

#### Call Signature

> **removeEventListener**(`event`, `handler`): `void`

Defined in: [packages/core/src/transport/worker-types.ts:26](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/worker-types.ts#L26)

##### Parameters

###### event

`"error"`

###### handler

(`event`) => `void`

##### Returns

`void`

***

### start()?

> `optional` **start**(): `void`

Defined in: [packages/core/src/transport/worker-types.ts:27](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/transport/worker-types.ts#L27)

#### Returns

`void`
