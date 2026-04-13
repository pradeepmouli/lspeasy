[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ExecutionSummary

# Type Alias: ExecutionSummary

> **ExecutionSummary** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:39

## Properties

### executionOrder

> **executionOrder**: [`uinteger`](uinteger.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:45

A strict monotonically increasing value
indicating the execution order of a cell
inside a notebook.

***

### success?

> `optional` **success?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:50

Whether the execution was successful or
not if known by the client.
