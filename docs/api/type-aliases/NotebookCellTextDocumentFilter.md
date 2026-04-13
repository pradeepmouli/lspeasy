[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / NotebookCellTextDocumentFilter

# Type Alias: NotebookCellTextDocumentFilter

> **NotebookCellTextDocumentFilter** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:118

A notebook cell text document filter denotes a cell text
document by different properties.

## Since

3.17.0

## Properties

### language?

> `optional` **language?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:132

A language id like `python`.

Will be matched against the language id of the
notebook cell document. '*' matches every language.

***

### notebook

> **notebook**: `string` \| [`NotebookDocumentFilter`](NotebookDocumentFilter.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:125

A filter that matches against the notebook
containing the notebook cell. If a string
value is provided it matches against the
notebook type. '*' matches every notebook.
