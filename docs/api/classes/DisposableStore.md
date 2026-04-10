[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DisposableStore

# Class: DisposableStore

Defined in: [packages/core/src/utils/disposable.ts:16](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/utils/disposable.ts#L16)

Store for managing multiple disposables

## Implements

- [`Disposable`](../interfaces/Disposable.md)

## Constructors

### Constructor

> **new DisposableStore**(): `DisposableStore`

#### Returns

`DisposableStore`

## Methods

### add()

> **add**\<`T`\>(`disposable`): `T`

Defined in: [packages/core/src/utils/disposable.ts:23](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/utils/disposable.ts#L23)

Add a disposable to the store

#### Type Parameters

##### T

`T` *extends* [`Disposable`](../interfaces/Disposable.md)

#### Parameters

##### disposable

`T`

#### Returns

`T`

***

### clear()

> **clear**(): `void`

Defined in: [packages/core/src/utils/disposable.ts:63](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/utils/disposable.ts#L63)

Clear all disposables without disposing them

#### Returns

`void`

***

### dispose()

> **dispose**(): `void`

Defined in: [packages/core/src/utils/disposable.ts:35](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/utils/disposable.ts#L35)

Dispose all resources in the store

#### Returns

`void`

#### Implementation of

[`Disposable`](../interfaces/Disposable.md).[`dispose`](../interfaces/Disposable.md#dispose)

***

### isDisposed()

> **isDisposed**(): `boolean`

Defined in: [packages/core/src/utils/disposable.ts:56](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/utils/disposable.ts#L56)

Check if store is disposed

#### Returns

`boolean`
