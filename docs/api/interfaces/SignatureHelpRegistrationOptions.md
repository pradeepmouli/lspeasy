[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SignatureHelpRegistrationOptions

# Interface: SignatureHelpRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2249

Registration options for a [SignatureHelpRequest](../lspeasy/namespaces/SignatureHelpRequest/README.md).

## Extends

- [`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`SignatureHelpOptions`](SignatureHelpOptions.md)

## Properties

### documentSelector

> **documentSelector**: [`DocumentSelector`](../type-aliases/DocumentSelector.md) \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:774

A document selector to identify the scope of the registration. If set to null
the document selector provided on the client side will be used.

#### Inherited from

[`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`documentSelector`](TextDocumentRegistrationOptions.md#documentselector)

***

### retriggerCharacters?

> `optional` **retriggerCharacters?**: `string`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2181

List of characters that re-trigger signature help.

These trigger characters are only active when signature help is already showing. All trigger characters
are also counted as re-trigger characters.

#### Since

3.15.0

#### Inherited from

[`SignatureHelpOptions`](SignatureHelpOptions.md).[`retriggerCharacters`](SignatureHelpOptions.md#retriggercharacters)

***

### triggerCharacters?

> `optional` **triggerCharacters?**: `string`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2172

List of characters that trigger signature help automatically.

#### Inherited from

[`SignatureHelpOptions`](SignatureHelpOptions.md).[`triggerCharacters`](SignatureHelpOptions.md#triggercharacters)

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`SignatureHelpOptions`](SignatureHelpOptions.md).[`workDoneProgress`](SignatureHelpOptions.md#workdoneprogress)
