[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / getDefinitionForRequest

# Function: getDefinitionForRequest()

> **getDefinitionForRequest**\<`N`, `M`\>(`namespace`, `methodKey`): `object`\[`N`\]\[`M`\]

Defined in: [packages/core/src/protocol/infer.ts:210](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/protocol/infer.ts#L210)

## Type Parameters

### N

`N` *extends* `"CallHierarchy"` \| `"Client"` \| `"CodeAction"` \| `"CodeLens"` \| `"CompletionItem"` \| `"DocumentLink"` \| `"InlayHint"` \| `"Lifecycle"` \| `"TextDocument"` \| `"TypeHierarchy"` \| `"Window"` \| `"Workspace"` \| `"WorkspaceSymbol"`

### M

`M` *extends* `string` \| `number` \| `symbol`

## Parameters

### namespace

`N`

### methodKey

`M`

## Returns

`object`\[`N`\]\[`M`\]
