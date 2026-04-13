[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CodeActionRegistrationOptions

# Interface: CodeActionRegistrationOptions

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2567

Registration options for a [CodeActionRequest](../lspeasy/namespaces/CodeActionRequest/README.md).

## Extends

- [`TextDocumentRegistrationOptions`](TextDocumentRegistrationOptions.md).[`CodeActionOptions`](CodeActionOptions.md)

## Properties

### codeActionKinds?

> `optional` **codeActionKinds?**: `string`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2555

CodeActionKinds that this server may return.

The list of kinds may be generic, such as `CodeActionKind.Refactor`, or the server
may list out every specific kind they provide.

#### Inherited from

[`CodeActionOptions`](CodeActionOptions.md).[`codeActionKinds`](CodeActionOptions.md#codeactionkinds)

***

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

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2562

The server provides support to resolve additional
information for a code action.

#### Since

3.16.0

#### Inherited from

[`CodeActionOptions`](CodeActionOptions.md).[`resolveProvider`](CodeActionOptions.md#resolveprovider)

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:793

#### Inherited from

[`CodeActionOptions`](CodeActionOptions.md).[`workDoneProgress`](CodeActionOptions.md#workdoneprogress)
