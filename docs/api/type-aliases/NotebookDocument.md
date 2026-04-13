[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / NotebookDocument

# Type Alias: NotebookDocument

> **NotebookDocument** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:98

A notebook document.

## Since

3.17.0

## Properties

### cells

> **cells**: [`NotebookCell`](NotebookCell.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:122

The cells of a notebook.

***

### metadata?

> `optional` **metadata?**: [`LSPObject`](LSPObject.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:118

Additional metadata stored with the notebook
document.

Note: should always be an object literal (e.g. LSPObject)

***

### notebookType

> **notebookType**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:106

The type of the notebook.

***

### uri

> **uri**: [`URI`](URI.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:102

The notebook document's uri.

***

### version

> **version**: [`integer`](integer.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:111

The version number of this document (it will increase after each
change, including undo/redo).
