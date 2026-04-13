[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SemanticTokensParams

# Interface: SemanticTokensParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:137

## Since

3.16.0

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

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.semanticTokens.d.ts:141

The text document.

***

### workDoneToken?

> `optional` **workDoneToken?**: [`ProgressToken`](../type-aliases/ProgressToken.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:227

An optional token that a server can use to report work done progress.

#### Inherited from

[`WorkDoneProgressParams`](WorkDoneProgressParams.md).[`workDoneToken`](WorkDoneProgressParams.md#workdonetoken)
