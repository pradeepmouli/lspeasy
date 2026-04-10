[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ExecuteCommandParams

# Interface: ExecuteCommandParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3124

The parameters of a [ExecuteCommandRequest](../lspeasy/namespaces/ExecuteCommandRequest/README.md).

## Extends

- [`WorkDoneProgressParams`](WorkDoneProgressParams.md)

## Properties

### arguments?

> `optional` **arguments?**: `any`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3132

Arguments that the command should be invoked with.

***

### command

> **command**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3128

The identifier of the actual command handler.

***

### workDoneToken?

> `optional` **workDoneToken?**: [`ProgressToken`](../type-aliases/ProgressToken.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:227

An optional token that a server can use to report work done progress.

#### Inherited from

[`WorkDoneProgressParams`](WorkDoneProgressParams.md).[`workDoneToken`](WorkDoneProgressParams.md#workdonetoken)
