[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CancellationTokenSource

# Class: CancellationTokenSource

Defined in: [packages/core/src/utils/cancellation.ts:32](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/utils/cancellation.ts#L32)

Source that controls a CancellationToken

## Constructors

### Constructor

> **new CancellationTokenSource**(): `CancellationTokenSource`

Defined in: [packages/core/src/utils/cancellation.ts:37](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/utils/cancellation.ts#L37)

#### Returns

`CancellationTokenSource`

## Accessors

### token

#### Get Signature

> **get** **token**(): [`CancellationToken`](../type-aliases/CancellationToken.md)

Defined in: [packages/core/src/utils/cancellation.ts:67](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/utils/cancellation.ts#L67)

Get the token

##### Returns

[`CancellationToken`](../type-aliases/CancellationToken.md)

## Methods

### cancel()

> **cancel**(): `void`

Defined in: [packages/core/src/utils/cancellation.ts:74](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/utils/cancellation.ts#L74)

Signal cancellation

#### Returns

`void`

***

### dispose()

> **dispose**(): `void`

Defined in: [packages/core/src/utils/cancellation.ts:86](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/utils/cancellation.ts#L86)

Dispose the source

#### Returns

`void`
