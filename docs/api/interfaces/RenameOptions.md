[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / RenameOptions

# Interface: RenameOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3073

Provider options for a [RenameRequest](../lspeasy/namespaces/RenameRequest/README.md).

## Extends

- [`WorkDoneProgressOptions`](WorkDoneProgressOptions.md)

## Extended by

- [`RenameRegistrationOptions`](RenameRegistrationOptions.md)

## Properties

### prepareProvider?

> `optional` **prepareProvider?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3079

Renames should be checked and tested before being executed.

#### Since

version 3.12.0

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`WorkDoneProgressOptions`](WorkDoneProgressOptions.md).[`workDoneProgress`](WorkDoneProgressOptions.md#workdoneprogress)
