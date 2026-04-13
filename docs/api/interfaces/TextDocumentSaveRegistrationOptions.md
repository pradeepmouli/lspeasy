[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TextDocumentSaveRegistrationOptions

# Interface: TextDocumentSaveRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1545

Save registration options.

## Extends

- [`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`SaveOptions`](SaveOptions.md)

## Properties

### documentSelector

> **documentSelector**: [`DocumentSelector`](../type-aliases/DocumentSelector.md) \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:774

A document selector to identify the scope of the registration. If set to null
the document selector provided on the client side will be used.

#### Inherited from

[`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`documentSelector`](TextDocumentRegistrationOptions.md#documentselector)

***

### includeText?

> `optional` **includeText?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:790

The client is supposed to include the content on save.

#### Inherited from

[`SaveOptions`](SaveOptions.md).[`includeText`](SaveOptions.md#includetext)
