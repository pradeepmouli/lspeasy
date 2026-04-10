[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentRangeFormattingRegistrationOptions

# Interface: DocumentRangeFormattingRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2929

Registration options for a [DocumentRangeFormattingRequest](../lspeasy/namespaces/DocumentRangeFormattingRequest/README.md).

## Extends

- [`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`DocumentRangeFormattingOptions`](DocumentRangeFormattingOptions.md)

## Properties

### documentSelector

> **documentSelector**: [`DocumentSelector`](../type-aliases/DocumentSelector.md) \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:774

A document selector to identify the scope of the registration. If set to null
the document selector provided on the client side will be used.

#### Inherited from

[`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`documentSelector`](TextDocumentRegistrationOptions.md#documentselector)

***

### rangesSupport?

> `optional` **rangesSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2924

Whether the server supports formatting multiple ranges at once.

#### Since

3.18.0

#### Proposed

#### Inherited from

[`DocumentRangeFormattingOptions`](DocumentRangeFormattingOptions.md).[`rangesSupport`](DocumentRangeFormattingOptions.md#rangessupport)

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`DocumentRangeFormattingOptions`](DocumentRangeFormattingOptions.md).[`workDoneProgress`](DocumentRangeFormattingOptions.md#workdoneprogress)
