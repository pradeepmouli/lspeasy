[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ReferenceParams

# Interface: ReferenceParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2309

Parameters for a [ReferencesRequest](../lspeasy/namespaces/ReferencesRequest/README.md).

## Extends

- [`TextDocumentPositionParams`](TextDocumentPositionParams.md).[`WorkDoneProgressParams`](WorkDoneProgressParams.md).`PartialResultParams`

## Properties

### context

> **context**: [`ReferenceContext`](ReferenceContext.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2310

***

### partialResultToken?

> `optional` **partialResultToken?**: [`ProgressToken`](../type-aliases/ProgressToken.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:234

An optional token that a server can use to report partial results (e.g. streaming) to
the client.

#### Inherited from

`PartialResultParams.partialResultToken`

***

### position

> **position**: [`Position`](Position.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:248

The position inside the text document.

#### Inherited from

[`TextDocumentPositionParams`](TextDocumentPositionParams.md).[`position`](TextDocumentPositionParams.md#position)

***

### textDocument

> **textDocument**: [`TextDocumentIdentifier`](TextDocumentIdentifier.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:244

The text document.

#### Inherited from

[`TextDocumentPositionParams`](TextDocumentPositionParams.md).[`textDocument`](TextDocumentPositionParams.md#textdocument)

***

### workDoneToken?

> `optional` **workDoneToken?**: [`ProgressToken`](../type-aliases/ProgressToken.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:227

An optional token that a server can use to report work done progress.

#### Inherited from

[`WorkDoneProgressParams`](WorkDoneProgressParams.md).[`workDoneToken`](WorkDoneProgressParams.md#workdonetoken)
