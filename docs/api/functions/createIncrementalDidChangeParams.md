[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / createIncrementalDidChangeParams

# Function: createIncrementalDidChangeParams()

> **createIncrementalDidChangeParams**(`uri`, `changes`, `source`): [`DidChangeTextDocumentParams`](../interfaces/DidChangeTextDocumentParams.md)

Defined in: [packages/core/src/utils/document.ts:85](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/utils/document.ts#L85)

Creates incremental didChange params from one or more range edits.

## Parameters

### uri

`string`

### changes

[`IncrementalChange`](../interfaces/IncrementalChange.md)[]

### source

[`VersionSource`](../interfaces/VersionSource.md)

## Returns

[`DidChangeTextDocumentParams`](../interfaces/DidChangeTextDocumentParams.md)
