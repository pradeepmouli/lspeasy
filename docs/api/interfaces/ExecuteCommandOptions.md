[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ExecuteCommandOptions

# Interface: ExecuteCommandOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3137

The server capabilities of a [ExecuteCommandRequest](../lspeasy/namespaces/ExecuteCommandRequest/README.md).

## Extends

- [`WorkDoneProgressOptions`](WorkDoneProgressOptions.md)

## Extended by

- [`ExecuteCommandRegistrationOptions`](ExecuteCommandRegistrationOptions.md)

## Properties

### commands

> **commands**: `string`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3141

The commands to be executed on the server

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`WorkDoneProgressOptions`](WorkDoneProgressOptions.md).[`workDoneProgress`](WorkDoneProgressOptions.md#workdoneprogress)
