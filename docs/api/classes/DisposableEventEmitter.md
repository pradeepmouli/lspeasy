[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DisposableEventEmitter

# Class: DisposableEventEmitter\<TEvents\>

Defined in: [packages/core/src/utils/disposable-event-emitter.ts:17](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/utils/disposable-event-emitter.ts#L17)

Event emitter that returns disposables and can dispose all listeners at once.

## Extended by

- [`TransportEventEmitter`](TransportEventEmitter.md)

## Type Parameters

### TEvents

`TEvents` *extends* `Record`\<`string`, `unknown`[]\>

## Constructors

### Constructor

> **new DisposableEventEmitter**\<`TEvents`\>(): `DisposableEventEmitter`\<`TEvents`\>

#### Returns

`DisposableEventEmitter`\<`TEvents`\>

## Methods

### dispose()

> **dispose**(): `void`

Defined in: [packages/core/src/utils/disposable-event-emitter.ts:103](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/utils/disposable-event-emitter.ts#L103)

Dispose all listeners and prevent further registrations.

#### Returns

`void`

***

### emit()

> **emit**\<`K`\>(`event`, ...`args`): `void`

Defined in: [packages/core/src/utils/disposable-event-emitter.ts:85](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/utils/disposable-event-emitter.ts#L85)

Emit an event to all registered listeners in registration order.

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### args

...`TEvents`\[`K`\]

#### Returns

`void`

***

### on()

> **on**\<`K`\>(`event`, `listener`): [`Disposable`](../interfaces/Disposable.md)

Defined in: [packages/core/src/utils/disposable-event-emitter.ts:24](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/utils/disposable-event-emitter.ts#L24)

Register a listener and receive a disposable to unregister it.

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### listener

`Listener`\<`TEvents`, `K`\>

#### Returns

[`Disposable`](../interfaces/Disposable.md)

***

### once()

> **once**\<`K`\>(`event`, `listener`): [`Disposable`](../interfaces/Disposable.md)

Defined in: [packages/core/src/utils/disposable-event-emitter.ts:54](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/utils/disposable-event-emitter.ts#L54)

Register a one-time listener that automatically unregisters after first emission.

#### Type Parameters

##### K

`K` *extends* `string` \| `number` \| `symbol`

#### Parameters

##### event

`K`

##### listener

`Listener`\<`TEvents`, `K`\>

#### Returns

[`Disposable`](../interfaces/Disposable.md)
