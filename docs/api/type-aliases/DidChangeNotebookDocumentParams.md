[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DidChangeNotebookDocumentParams

# Type Alias: DidChangeNotebookDocumentParams

> **DidChangeNotebookDocumentParams** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:321

The params sent in a change notebook document notification.

## Since

3.17.0

## Properties

### change

> **change**: [`NotebookDocumentChangeEvent`](NotebookDocumentChangeEvent.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:344

The actual changes to the notebook document.

The changes describe single state changes to the notebook document.
So if there are two changes c1 (at array index 0) and c2 (at array
index 1) for a notebook in state S then c1 moves the notebook from
S to S' and c2 from S' to S''. So c1 is computed on the state S and
c2 is computed on the state S'.

To mirror the content of a notebook using change events use the following approach:
- start with the same initial content
- apply the 'notebookDocument/didChange' notifications in the order you receive them.
- apply the `NotebookChangeEvent`s in a single notification in the order
  you receive them.

***

### notebookDocument

> **notebookDocument**: [`VersionedNotebookDocumentIdentifier`](VersionedNotebookDocumentIdentifier.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:328

The notebook document that did change. The version number points
to the version after all provided changes have been applied. If
only the text document content of a cell changes the notebook version
doesn't necessarily have to change.
