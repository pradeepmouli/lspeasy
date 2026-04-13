[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CompletionItemLabelDetails

# Interface: CompletionItemLabelDetails

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1317

Additional details for a completion item label.

## Since

3.17.0

## Properties

### description?

> `optional` **description?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1327

An optional string which is rendered less prominently after [CompletionItem.detail](CompletionItem.md#detail). Should be used
for fully qualified names and file paths.

***

### detail?

> `optional` **detail?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1322

An optional string which is rendered less prominently directly after [label](CompletionItem.md#label),
without any spacing. Should be used for function signatures and type annotations.
