[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / RenameRegistrationOptions

# Interface: RenameRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3084

Registration options for a [RenameRequest](../lspeasy/namespaces/RenameRequest/README.md).

## Extends

- [`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`RenameOptions`](RenameOptions.md)

## Properties

### documentSelector

> **documentSelector**: [`DocumentSelector`](../type-aliases/DocumentSelector.md) \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:774

A document selector to identify the scope of the registration. If set to null
the document selector provided on the client side will be used.

#### Inherited from

[`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`documentSelector`](TextDocumentRegistrationOptions.md#documentselector)

***

### prepareProvider?

> `optional` **prepareProvider?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3079

Renames should be checked and tested before being executed.

#### Since

version 3.12.0

#### Inherited from

[`RenameOptions`](RenameOptions.md).[`prepareProvider`](RenameOptions.md#prepareprovider)

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`RenameOptions`](RenameOptions.md).[`workDoneProgress`](RenameOptions.md#workdoneprogress)
