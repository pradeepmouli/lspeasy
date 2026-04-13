[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DidChangeTextDocumentParams

# Interface: DidChangeTextDocumentParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1465

The change text document notification's parameters.

## Properties

### contentChanges

> **contentChanges**: [`TextDocumentContentChangeEvent`](../type-aliases/TextDocumentContentChangeEvent.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1485

The actual content changes. The content changes describe single state changes
to the document. So if there are two content changes c1 (at array index 0) and
c2 (at array index 1) for a document in state S then c1 moves the document from
S to S' and c2 from S' to S''. So c1 is computed on the state S and c2 is computed
on the state S'.

To mirror the content of a document using change events use the following approach:
- start with the same initial content
- apply the 'textDocument/didChange' notifications in the order you receive them.
- apply the `TextDocumentContentChangeEvent`s in a single notification in the order
  you receive them.

***

### textDocument

> **textDocument**: [`VersionedTextDocumentIdentifier`](VersionedTextDocumentIdentifier.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1471

The document that did change. The version number points
to the version after all provided content changes have
been applied.
