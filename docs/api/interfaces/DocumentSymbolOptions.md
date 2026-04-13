[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentSymbolOptions

# Interface: DocumentSymbolOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2430

Provider options for a [DocumentSymbolRequest](../lspeasy/namespaces/DocumentSymbolRequest/README.md).

## Extends

- [`WorkDoneProgressOptions`](WorkDoneProgressOptions.md)

## Extended by

- [`DocumentSymbolRegistrationOptions`](DocumentSymbolRegistrationOptions.md)

## Properties

### label?

> `optional` **label?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2437

A human-readable string that is shown when multiple outlines trees
are shown for the same document.

#### Since

3.16.0

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`WorkDoneProgressOptions`](WorkDoneProgressOptions.md).[`workDoneProgress`](WorkDoneProgressOptions.md#workdoneprogress)
