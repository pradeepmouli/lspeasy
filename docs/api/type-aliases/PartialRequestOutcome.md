[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / PartialRequestOutcome

# Type Alias: PartialRequestOutcome\<TPartial, TResult\>

> **PartialRequestOutcome**\<`TPartial`, `TResult`\> = [`CancelledPartialResult`](../interfaces/CancelledPartialResult.md)\<`TPartial`\> \| [`CompletedPartialResult`](../interfaces/CompletedPartialResult.md)\<`TPartial`, `TResult`\>

Defined in: [packages/core/src/protocol/partial-results.ts:16](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/partial-results.ts#L16)

Union return type for partial-enabled client requests.

## Type Parameters

### TPartial

`TPartial` = `unknown`

### TResult

`TResult` = `unknown`
