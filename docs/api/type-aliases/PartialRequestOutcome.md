[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / PartialRequestOutcome

# Type Alias: PartialRequestOutcome\<TPartial, TResult\>

> **PartialRequestOutcome**\<`TPartial`, `TResult`\> = [`CancelledPartialResult`](../interfaces/CancelledPartialResult.md)\<`TPartial`\> \| [`CompletedPartialResult`](../interfaces/CompletedPartialResult.md)\<`TPartial`, `TResult`\>

Defined in: [packages/core/src/protocol/partial-results.ts:16](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/protocol/partial-results.ts#L16)

Union return type for partial-enabled client requests.

## Type Parameters

### TPartial

`TPartial` = `unknown`

### TResult

`TResult` = `unknown`
