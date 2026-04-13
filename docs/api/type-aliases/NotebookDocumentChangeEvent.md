[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / NotebookDocumentChangeEvent

# Type Alias: NotebookDocumentChangeEvent

> **NotebookDocumentChangeEvent** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:273

A change event for a notebook document.

## Since

3.17.0

## Properties

### cells?

> `optional` **cells?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:283

Changes to cells

#### data?

> `optional` **data?**: [`NotebookCell`](NotebookCell.md)[]

Changes to notebook cells properties like its
kind, execution summary or metadata.

#### structure?

> `optional` **structure?**: `object`

Changes to the cell structure to add or
remove cells.

##### structure.array

> **array**: [`NotebookCellArrayChange`](NotebookCellArrayChange.md)

The change to the cell array.

##### structure.didClose?

> `optional` **didClose?**: [`TextDocumentIdentifier`](../interfaces/TextDocumentIdentifier.md)[]

Additional closed cell text documents.

##### structure.didOpen?

> `optional` **didOpen?**: [`TextDocumentItem`](../interfaces/TextDocumentItem.md)[]

Additional opened cell text documents.

#### textContent?

> `optional` **textContent?**: `object`[]

Changes to the text content of notebook cells.

***

### metadata?

> `optional` **metadata?**: [`LSPObject`](LSPObject.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:279

The changed meta data if any.

Note: should always be an object literal (e.g. LSPObject)
