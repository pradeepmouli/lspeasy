[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / HoverRegistrationOptions

# Interface: HoverRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2105

Registration options for a [HoverRequest](../lspeasy/namespaces/HoverRequest/README.md).

## Extends

- [`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`HoverOptions`](HoverOptions.md)

## Properties

### documentSelector

> **documentSelector**: [`DocumentSelector`](../type-aliases/DocumentSelector.md) \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:774

A document selector to identify the scope of the registration. If set to null
the document selector provided on the client side will be used.

#### Inherited from

[`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`documentSelector`](TextDocumentRegistrationOptions.md#documentselector)

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`HoverOptions`](HoverOptions.md).[`workDoneProgress`](HoverOptions.md#workdoneprogress)
