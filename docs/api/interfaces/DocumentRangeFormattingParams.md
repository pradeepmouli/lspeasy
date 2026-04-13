[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentRangeFormattingParams

# Interface: DocumentRangeFormattingParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2880

The parameters of a [DocumentRangeFormattingRequest](../lspeasy/namespaces/DocumentRangeFormattingRequest/README.md).

## Extends

- [`WorkDoneProgressParams`](WorkDoneProgressParams.md)

## Properties

### options

> **options**: [`FormattingOptions`](FormattingOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2892

The format options

***

### range

> **range**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2888

The range to format

***

### textDocument

> **textDocument**: [`TextDocumentIdentifier`](TextDocumentIdentifier.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2884

The document to format.

***

### workDoneToken?

> `optional` **workDoneToken?**: [`ProgressToken`](../type-aliases/ProgressToken.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:227

An optional token that a server can use to report work done progress.

#### Inherited from

[`WorkDoneProgressParams`](WorkDoneProgressParams.md).[`workDoneToken`](WorkDoneProgressParams.md#workdonetoken)
