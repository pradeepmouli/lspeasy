[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentSymbolRegistrationOptions

# Interface: DocumentSymbolRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2442

Registration options for a [DocumentSymbolRequest](../lspeasy/namespaces/DocumentSymbolRequest/README.md).

## Extends

- [`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`DocumentSymbolOptions`](DocumentSymbolOptions.md)

## Properties

### documentSelector

> **documentSelector**: [`DocumentSelector`](../type-aliases/DocumentSelector.md) \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:774

A document selector to identify the scope of the registration. If set to null
the document selector provided on the client side will be used.

#### Inherited from

[`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`documentSelector`](TextDocumentRegistrationOptions.md#documentselector)

***

### label?

> `optional` **label?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2437

A human-readable string that is shown when multiple outlines trees
are shown for the same document.

#### Since

3.16.0

#### Inherited from

[`DocumentSymbolOptions`](DocumentSymbolOptions.md).[`label`](DocumentSymbolOptions.md#label)

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`DocumentSymbolOptions`](DocumentSymbolOptions.md).[`workDoneProgress`](DocumentSymbolOptions.md#workdoneprogress)
