[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WorkspaceSymbolParams

# Interface: WorkspaceSymbolParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2641

The parameters of a [WorkspaceSymbolRequest](../lspeasy/namespaces/WorkspaceSymbolRequest/README.md).

## Extends

- [`WorkDoneProgressParams`](WorkDoneProgressParams.md).`PartialResultParams`

## Properties

### partialResultToken?

> `optional` **partialResultToken?**: [`ProgressToken`](../type-aliases/ProgressToken.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:234

An optional token that a server can use to report partial results (e.g. streaming) to
the client.

#### Inherited from

`PartialResultParams.partialResultToken`

***

### query

> **query**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2646

A query string to filter symbols by. Clients may send an empty
string here to request all symbols.

***

### workDoneToken?

> `optional` **workDoneToken?**: [`ProgressToken`](../type-aliases/ProgressToken.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:227

An optional token that a server can use to report work done progress.

#### Inherited from

[`WorkDoneProgressParams`](WorkDoneProgressParams.md).[`workDoneToken`](WorkDoneProgressParams.md#workdonetoken)
