[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / NotebookCellArrayChange

# Type Alias: NotebookCellArrayChange

> **NotebookCellArrayChange** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:250

A change describing how to move a `NotebookCell`
array from state S to S'.

## Since

3.17.0

## Properties

### cells?

> `optional` **cells?**: [`NotebookCell`](NotebookCell.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:262

The new cells, if any

***

### deleteCount

> **deleteCount**: [`uinteger`](uinteger.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:258

The deleted cells

***

### start

> **start**: [`uinteger`](uinteger.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:254

The start oftest of the cell that changed.
