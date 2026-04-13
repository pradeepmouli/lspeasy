[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CancellationToken

# Interface: CancellationToken

Defined in: [packages/core/src/utils/cancellation.ts:12](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/cancellation.ts#L12)

Token that can be used to signal cancellation

## Properties

### isCancellationRequested

> `readonly` **isCancellationRequested**: `boolean`

Defined in: [packages/core/src/utils/cancellation.ts:16](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/cancellation.ts#L16)

Check if cancellation has been requested

## Methods

### onCancellationRequested()

> **onCancellationRequested**(`callback`): [`Disposable`](Disposable.md)

Defined in: [packages/core/src/utils/cancellation.ts:22](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/cancellation.ts#L22)

Register callback to be called when cancellation is requested

#### Parameters

##### callback

() => `void`

#### Returns

[`Disposable`](Disposable.md)

Disposable to unregister the callback
