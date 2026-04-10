[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SignatureHelpParams

# Interface: SignatureHelpParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2237

Parameters for a [SignatureHelpRequest](../lspeasy/namespaces/SignatureHelpRequest/README.md).

## Extends

- [`TextDocumentPositionParams`](TextDocumentPositionParams.md).[`WorkDoneProgressParams`](WorkDoneProgressParams.md)

## Properties

### context?

> `optional` **context?**: [`SignatureHelpContext`](SignatureHelpContext.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2244

The signature help context. This is only available if the client specifies
to send this using the client capability `textDocument.signatureHelp.contextSupport === true`

#### Since

3.15.0

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
