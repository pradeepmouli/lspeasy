[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DidCloseNotebookDocumentParams

# Type Alias: DidCloseNotebookDocumentParams

> **DidCloseNotebookDocumentParams** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:379

The params sent in a close notebook document notification.

## Since

3.17.0

## Properties

### cellTextDocuments

> **cellTextDocuments**: [`TextDocumentIdentifier`](../interfaces/TextDocumentIdentifier.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:388

The text documents that represent the content
of a notebook cell that got closed.

***

### notebookDocument

> **notebookDocument**: [`NotebookDocumentIdentifier`](NotebookDocumentIdentifier.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:383

The notebook document that got closed.
