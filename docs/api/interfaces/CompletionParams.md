[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CompletionParams

# Interface: CompletionParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1995

Completion parameters

## Extends

- [`TextDocumentPositionParams`](TextDocumentPositionParams.md).[`WorkDoneProgressParams`](WorkDoneProgressParams.md).`PartialResultParams`

## Properties

### context?

> `optional` **context?**: [`CompletionContext`](CompletionContext.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2000

The completion context. This is only available it the client specifies
to send this using the client capability `textDocument.completion.contextSupport === true`

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
