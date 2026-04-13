[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CodeLensRegistrationOptions

# Interface: CodeLensRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2737

Registration options for a [CodeLensRequest](../lspeasy/namespaces/CodeLensRequest/README.md).

## Extends

- [`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`CodeLensOptions`](CodeLensOptions.md)

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

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2732

Code lens has a resolve provider as well.

#### Inherited from

[`CodeLensOptions`](CodeLensOptions.md).[`resolveProvider`](CodeLensOptions.md#resolveprovider)

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`CodeLensOptions`](CodeLensOptions.md).[`workDoneProgress`](CodeLensOptions.md#workdoneprogress)
