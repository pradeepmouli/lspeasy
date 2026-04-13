[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SelectionRangeRegistrationOptions

# Interface: SelectionRangeRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.selectionRange.d.ts:15

General text document registration options.

## Extends

- [`SelectionRangeOptions`](SelectionRangeOptions.md).[`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`StaticRegistrationOptions`](StaticRegistrationOptions.md)

## Properties

### documentSelector

> **documentSelector**: [`DocumentSelector`](../type-aliases/DocumentSelector.md) \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:774

A document selector to identify the scope of the registration. If set to null
the document selector provided on the client side will be used.

#### Inherited from

[`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`documentSelector`](TextDocumentRegistrationOptions.md#documentselector)

***

### id?

> `optional` **id?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:755

The id used to register the request. The id can be used to deregister
the request again. See also Registration#id.

#### Inherited from

[`StaticRegistrationOptions`](StaticRegistrationOptions.md).[`id`](StaticRegistrationOptions.md#id)

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`SelectionRangeOptions`](SelectionRangeOptions.md).[`workDoneProgress`](SelectionRangeOptions.md#workdoneprogress)
