[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentOnTypeFormattingRegistrationOptions

# Interface: DocumentOnTypeFormattingRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3001

Registration options for a [DocumentOnTypeFormattingRequest](../lspeasy/namespaces/DocumentOnTypeFormattingRequest/README.md).

## Extends

- [`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`DocumentOnTypeFormattingOptions`](DocumentOnTypeFormattingOptions.md)

## Properties

### documentSelector

> **documentSelector**: [`DocumentSelector`](../type-aliases/DocumentSelector.md) \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:774

A document selector to identify the scope of the registration. If set to null
the document selector provided on the client side will be used.

#### Inherited from

[`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`documentSelector`](TextDocumentRegistrationOptions.md#documentselector)

***

### firstTriggerCharacter

> **firstTriggerCharacter**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2992

A character on which formatting should be triggered, like `{`.

#### Inherited from

[`DocumentOnTypeFormattingOptions`](DocumentOnTypeFormattingOptions.md).[`firstTriggerCharacter`](DocumentOnTypeFormattingOptions.md#firsttriggercharacter)

***

### moreTriggerCharacter?

> `optional` **moreTriggerCharacter?**: `string`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2996

More trigger characters.

#### Inherited from

[`DocumentOnTypeFormattingOptions`](DocumentOnTypeFormattingOptions.md).[`moreTriggerCharacter`](DocumentOnTypeFormattingOptions.md#moretriggercharacter)
