[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TransportEventEmitter

# Class: TransportEventEmitter

Defined in: [packages/core/src/transport/events.ts:18](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/events.ts#L18)

Transport event emitter

## Extends

- [`DisposableEventEmitter`](DisposableEventEmitter.md)\<`TransportEventMap`\>

## Constructors

### Constructor

> **new TransportEventEmitter**(): `TransportEventEmitter`

#### Returns

`TransportEventEmitter`

#### Inherited from

[`DisposableEventEmitter`](DisposableEventEmitter.md).[`constructor`](DisposableEventEmitter.md#constructor)

## Methods

### dispose()

> **dispose**(): `void`

Defined in: [packages/core/src/utils/disposable-event-emitter.ts:103](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/utils/disposable-event-emitter.ts#L103)

Dispose all listeners and prevent further registrations.

#### Returns

`void`

#### Inherited from

[`DisposableEventEmitter`](DisposableEventEmitter.md).[`dispose`](DisposableEventEmitter.md#dispose)

***

### emit()

> **emit**\<`K`\>(`event`, ...`args`): `void`

Defined in: [packages/core/src/utils/disposable-event-emitter.ts:85](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/utils/disposable-event-emitter.ts#L85)

Emit an event to all registered listeners in registration order.

#### Type Parameters

##### K

`K` *extends* keyof `TransportEventMap`

#### Parameters

##### event

`K`

##### args

...`TransportEventMap`\[`K`\]

#### Returns

`void`

#### Inherited from

[`DisposableEventEmitter`](DisposableEventEmitter.md).[`emit`](DisposableEventEmitter.md#emit)

***

### emitConnect()

> **emitConnect**(): `void`

Defined in: [packages/core/src/transport/events.ts:22](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/events.ts#L22)

Emit connect event

#### Returns

`void`

***

### emitDisconnect()

> **emitDisconnect**(): `void`

Defined in: [packages/core/src/transport/events.ts:29](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/events.ts#L29)

Emit disconnect event

#### Returns

`void`

***

### emitError()

> **emitError**(`error`): `void`

Defined in: [packages/core/src/transport/events.ts:36](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/events.ts#L36)

Emit error event

#### Parameters

##### error

`Error`

#### Returns

`void`

***

### emitMessage()

> **emitMessage**(`message`): `void`

Defined in: [packages/core/src/transport/events.ts:43](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/transport/events.ts#L43)

Emit message event

#### Parameters

##### message

[`Message`](../type-aliases/Message.md)

#### Returns

`void`

***

### on()

> **on**\<`K`\>(`event`, `listener`): [`Disposable`](../interfaces/Disposable.md)

Defined in: [packages/core/src/utils/disposable-event-emitter.ts:24](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/utils/disposable-event-emitter.ts#L24)

Register a listener and receive a disposable to unregister it.

#### Type Parameters

##### K

`K` *extends* keyof `TransportEventMap`

#### Parameters

##### event

`K`

##### listener

`Listener`\<`TransportEventMap`, `K`\>

#### Returns

[`Disposable`](../interfaces/Disposable.md)

#### Inherited from

[`DisposableEventEmitter`](DisposableEventEmitter.md).[`on`](DisposableEventEmitter.md#on)

***

### once()

> **once**\<`K`\>(`event`, `listener`): [`Disposable`](../interfaces/Disposable.md)

Defined in: [packages/core/src/utils/disposable-event-emitter.ts:54](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/utils/disposable-event-emitter.ts#L54)

Register a one-time listener that automatically unregisters after first emission.

#### Type Parameters

##### K

`K` *extends* keyof `TransportEventMap`

#### Parameters

##### event

`K`

##### listener

`Listener`\<`TransportEventMap`, `K`\>

#### Returns

[`Disposable`](../interfaces/Disposable.md)

#### Inherited from

[`DisposableEventEmitter`](DisposableEventEmitter.md).[`once`](DisposableEventEmitter.md#once)
