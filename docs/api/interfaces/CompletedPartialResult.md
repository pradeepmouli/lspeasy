[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CompletedPartialResult

# Interface: CompletedPartialResult\<TPartial, TResult\>

Defined in: [packages/core/src/protocol/partial-results.ts:9](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/protocol/partial-results.ts#L9)

Structured response when a partial-enabled request completes successfully.

## Type Parameters

### TPartial

`TPartial` = `unknown`

### TResult

`TResult` = `unknown`

## Properties

### cancelled

> **cancelled**: `false`

Defined in: [packages/core/src/protocol/partial-results.ts:10](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/protocol/partial-results.ts#L10)

***

### finalResult

> **finalResult**: `TResult`

Defined in: [packages/core/src/protocol/partial-results.ts:12](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/protocol/partial-results.ts#L12)

***

### partialResults

> **partialResults**: `TPartial`[]

Defined in: [packages/core/src/protocol/partial-results.ts:11](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/protocol/partial-results.ts#L11)
