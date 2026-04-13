[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DidOpenNotebookDocumentParams

# Type Alias: DidOpenNotebookDocumentParams

> **DidOpenNotebookDocumentParams** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:222

The params sent in an open notebook document notification.

## Since

3.17.0

## Properties

### cellTextDocuments

> **cellTextDocuments**: [`TextDocumentItem`](../interfaces/TextDocumentItem.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:231

The text documents that represent the content
of a notebook cell.

***

### notebookDocument

> **notebookDocument**: [`NotebookDocument`](NotebookDocument.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:226

The notebook document that got opened.
