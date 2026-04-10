[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / createIncrementalDidChangeParams

# Function: createIncrementalDidChangeParams()

> **createIncrementalDidChangeParams**(`uri`, `changes`, `source`): [`DidChangeTextDocumentParams`](../interfaces/DidChangeTextDocumentParams.md)

Defined in: [packages/core/src/utils/document.ts:85](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/utils/document.ts#L85)

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
