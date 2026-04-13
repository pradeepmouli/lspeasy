[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / NotebookCell

# Type Alias: NotebookCell

> **NotebookCell** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:66

A notebook cell.

A cell's document URI must be unique across ALL notebook
cells and can therefore be used to uniquely identify a
notebook cell or the cell's text document.

## Since

3.17.0

## Properties

### document

> **document**: [`DocumentUri`](DocumentUri.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:75

The URI of the cell's text document
content.

***

### executionSummary?

> `optional` **executionSummary?**: [`ExecutionSummary`](ExecutionSummary.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:86

Additional execution summary information
if supported by the client.

***

### kind

> **kind**: [`NotebookCellKind`](NotebookCellKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:70

The cell's kind

***

### metadata?

> `optional` **metadata?**: [`LSPObject`](LSPObject.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:81

Additional metadata stored with the cell.

Note: should always be an object literal (e.g. LSPObject)
