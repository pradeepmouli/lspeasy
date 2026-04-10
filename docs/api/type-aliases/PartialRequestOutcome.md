[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / PartialRequestOutcome

# Type Alias: PartialRequestOutcome\<TPartial, TResult\>

> **PartialRequestOutcome**\<`TPartial`, `TResult`\> = [`CancelledPartialResult`](../interfaces/CancelledPartialResult.md)\<`TPartial`\> \| [`CompletedPartialResult`](../interfaces/CompletedPartialResult.md)\<`TPartial`, `TResult`\>

Defined in: [packages/core/src/protocol/partial-results.ts:16](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/partial-results.ts#L16)

Union return type for partial-enabled client requests.

## Type Parameters

### TPartial

`TPartial` = `unknown`

### TResult

`TResult` = `unknown`
