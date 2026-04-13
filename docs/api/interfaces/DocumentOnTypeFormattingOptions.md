[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentOnTypeFormattingOptions

# Interface: DocumentOnTypeFormattingOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2988

Provider options for a [DocumentOnTypeFormattingRequest](../lspeasy/namespaces/DocumentOnTypeFormattingRequest/README.md).

## Extended by

- [`DocumentOnTypeFormattingRegistrationOptions`](DocumentOnTypeFormattingRegistrationOptions.md)

## Properties

### firstTriggerCharacter

> **firstTriggerCharacter**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2992

A character on which formatting should be triggered, like `{`.

***

### moreTriggerCharacter?

> `optional` **moreTriggerCharacter?**: `string`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2996

More trigger characters.
