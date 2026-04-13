[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentLinkRegistrationOptions

# Interface: DocumentLinkRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2801

Registration options for a [DocumentLinkRequest](../lspeasy/namespaces/DocumentLinkRequest/README.md).

## Extends

- [`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`DocumentLinkOptions`](DocumentLinkOptions.md)

## Properties

### documentSelector

> **documentSelector**: [`DocumentSelector`](../type-aliases/DocumentSelector.md) \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:774

A document selector to identify the scope of the registration. If set to null
the document selector provided on the client side will be used.

#### Inherited from

[`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`documentSelector`](TextDocumentRegistrationOptions.md#documentselector)

***

### resolveProvider?

> `optional` **resolveProvider?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2796

Document links have a resolve provider as well.

#### Inherited from

[`DocumentLinkOptions`](DocumentLinkOptions.md).[`resolveProvider`](DocumentLinkOptions.md#resolveprovider)

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`DocumentLinkOptions`](DocumentLinkOptions.md).[`workDoneProgress`](DocumentLinkOptions.md#workdoneprogress)
