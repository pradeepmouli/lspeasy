[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentRangeFormattingOptions

# Interface: DocumentRangeFormattingOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2917

Provider options for a [DocumentRangeFormattingRequest](../lspeasy/namespaces/DocumentRangeFormattingRequest/README.md).

## Extends

- [`WorkDoneProgressOptions`](WorkDoneProgressOptions.md)

## Extended by

- [`DocumentRangeFormattingRegistrationOptions`](DocumentRangeFormattingRegistrationOptions.md)

## Properties

### rangesSupport?

> `optional` **rangesSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2924

Whether the server supports formatting multiple ranges at once.

#### Since

3.18.0

#### Proposed

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`WorkDoneProgressOptions`](WorkDoneProgressOptions.md).[`workDoneProgress`](WorkDoneProgressOptions.md#workdoneprogress)
