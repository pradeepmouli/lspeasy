[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / \_InitializeParams

# Interface: \_InitializeParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1018

The initialize parameters

## Extends

- [`WorkDoneProgressParams`](WorkDoneProgressParams.md)

## Properties

### capabilities

> **capabilities**: [`ClientCapabilities`](ClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1071

The capabilities provided by the client (editor or tool)

***

### clientInfo?

> `optional` **clientInfo?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1032

Information about the client

#### name

> **name**: `string`

The name of the client as defined by the client.

#### version?

> `optional` **version?**: `string`

The client's version as defined by the client.

#### Since

3.15.0

***

### initializationOptions?

> `optional` **initializationOptions?**: `any`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1075

User provided initialization options.

***

### locale?

> `optional` **locale?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1052

The locale the client is currently showing the user interface
in. This must not necessarily be the locale of the operating
system.

Uses IETF language tags as the value's syntax
(See https://en.wikipedia.org/wiki/IETF_language_tag)

#### Since

3.16.0

***

### processId

> **processId**: `number` \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1026

The process Id of the parent process that started
the server.

Is `null` if the process has not been started by another process.
If the parent process is not alive then the server should exit.

***

### ~~rootPath?~~

> `optional` **rootPath?**: `string` \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1059

The rootPath of the workspace. Is null
if no folder is open.

#### Deprecated

in favour of rootUri.

***

### ~~rootUri~~

> **rootUri**: `string` \| `null`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1067

The rootUri of the workspace. Is null if no
folder is open. If both `rootPath` and `rootUri` are set
`rootUri` wins.

#### Deprecated

in favour of workspaceFolders.

***

### trace?

> `optional` **trace?**: [`TraceValues`](../type-aliases/TraceValues.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1079

The initial trace setting. If omitted trace is disabled ('off').

***

### workDoneToken?

> `optional` **workDoneToken?**: [`ProgressToken`](../type-aliases/ProgressToken.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:227

An optional token that a server can use to report work done progress.

#### Inherited from

[`WorkDoneProgressParams`](WorkDoneProgressParams.md).[`workDoneToken`](WorkDoneProgressParams.md#workdonetoken)
