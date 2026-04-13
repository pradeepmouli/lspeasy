[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CodeActionOptions

# Interface: CodeActionOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2548

Provider options for a [CodeActionRequest](../lspeasy/namespaces/CodeActionRequest/README.md).

## Extends

- [`WorkDoneProgressOptions`](WorkDoneProgressOptions.md)

## Extended by

- [`CodeActionRegistrationOptions`](CodeActionRegistrationOptions.md)

## Properties

### codeActionKinds?

> `optional` **codeActionKinds?**: `string`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2555

CodeActionKinds that this server may return.

The list of kinds may be generic, such as `CodeActionKind.Refactor`, or the server
may list out every specific kind they provide.

***

### resolveProvider?

> `optional` **resolveProvider?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2562

The server provides support to resolve additional
information for a code action.

#### Since

3.16.0

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`WorkDoneProgressOptions`](WorkDoneProgressOptions.md).[`workDoneProgress`](WorkDoneProgressOptions.md#workdoneprogress)
