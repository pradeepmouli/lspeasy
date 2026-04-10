[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / NotebookDocumentSyncClientCapabilities

# Type Alias: NotebookDocumentSyncClientCapabilities

> **NotebookDocumentSyncClientCapabilities** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:9

Notebook specific client capabilities.

## Since

3.17.0

## Properties

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:16

Whether implementation supports dynamic registration. If this is
set to `true` the client supports the new
`(TextDocumentRegistrationOptions & StaticRegistrationOptions)`
return value for the corresponding server capability as well.

***

### executionSummarySupport?

> `optional` **executionSummarySupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.notebook.d.ts:20

The client supports sending execution summary data per cell.
