[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TextDocumentEdit

# Interface: TextDocumentEdit

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:729

Describes textual changes on a text document. A TextDocumentEdit describes all changes
on a document version Si and after they are applied move the document to version Si+1.
So the creator of a TextDocumentEdit doesn't need to sort the array of edits or do any
kind of ordering. However the edits must be non overlapping.

## Properties

### edits

> **edits**: ([`TextEdit`](TextEdit.md) \| [`AnnotatedTextEdit`](AnnotatedTextEdit.md))[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:740

The edits to be applied.

#### Since

3.16.0 - support for AnnotatedTextEdit. This is guarded using a
client capability.

***

### textDocument

> **textDocument**: [`OptionalVersionedTextDocumentIdentifier`](OptionalVersionedTextDocumentIdentifier.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:733

The text document to change.
