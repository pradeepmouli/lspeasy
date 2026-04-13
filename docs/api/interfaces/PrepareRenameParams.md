[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / PrepareRenameParams

# Interface: PrepareRenameParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3094

A parameter literal used in requests to pass a text document and a position inside that
document.

## Extends

- [`TextDocumentPositionParams`](TextDocumentPositionParams.md).[`WorkDoneProgressParams`](WorkDoneProgressParams.md)

## Properties

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
