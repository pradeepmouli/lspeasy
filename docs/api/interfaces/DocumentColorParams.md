[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentColorParams

# Interface: DocumentColorParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.colorProvider.d.ts:20

Parameters for a [DocumentColorRequest](../lspeasy/namespaces/DocumentColorRequest/README.md).

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

### textDocument

> **textDocument**: [`TextDocumentIdentifier`](TextDocumentIdentifier.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.colorProvider.d.ts:24

The text document.

***

### workDoneToken?

> `optional` **workDoneToken?**: [`ProgressToken`](../type-aliases/ProgressToken.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:227

An optional token that a server can use to report work done progress.

#### Inherited from

[`WorkDoneProgressParams`](WorkDoneProgressParams.md).[`workDoneToken`](WorkDoneProgressParams.md#workdonetoken)
