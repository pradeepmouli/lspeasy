[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SignatureHelpContext

# Interface: SignatureHelpContext

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2208

Additional information about the context in which a signature help request was triggered.

## Since

3.15.0

## Properties

### activeSignatureHelp?

> `optional` **activeSignatureHelp?**: [`SignatureHelp`](SignatureHelp.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2232

The currently active `SignatureHelp`.

The `activeSignatureHelp` has its `SignatureHelp.activeSignature` field updated based on
the user navigating through available signatures.

***

### isRetrigger

> **isRetrigger**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2225

`true` if signature help was already showing when it was triggered.

Retriggers occurs when the signature help is already active and can be caused by actions such as
typing a trigger character, a cursor move, or document content changes.

***

### triggerCharacter?

> `optional` **triggerCharacter?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2218

Character that caused signature help to be triggered.

This is undefined when `triggerKind !== SignatureHelpTriggerKind.TriggerCharacter`

***

### triggerKind

> **triggerKind**: [`SignatureHelpTriggerKind`](../type-aliases/SignatureHelpTriggerKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2212

Action that caused signature help to be triggered.
