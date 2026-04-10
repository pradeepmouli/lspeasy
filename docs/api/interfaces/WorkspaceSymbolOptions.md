[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WorkspaceSymbolOptions

# Interface: WorkspaceSymbolOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2651

Server capabilities for a [WorkspaceSymbolRequest](../lspeasy/namespaces/WorkspaceSymbolRequest/README.md).

## Extends

- [`WorkDoneProgressOptions`](WorkDoneProgressOptions.md)

## Extended by

- [`WorkspaceSymbolRegistrationOptions`](WorkspaceSymbolRegistrationOptions.md)

## Properties

### resolveProvider?

> `optional` **resolveProvider?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2658

The server provides support to resolve additional
information for a workspace symbol.

#### Since

3.17.0

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`WorkDoneProgressOptions`](WorkDoneProgressOptions.md).[`workDoneProgress`](WorkDoneProgressOptions.md#workdoneprogress)
