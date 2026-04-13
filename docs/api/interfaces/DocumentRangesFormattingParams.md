[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentRangesFormattingParams

# Interface: DocumentRangesFormattingParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2900

The parameters of a [DocumentRangesFormattingRequest](../lspeasy/namespaces/DocumentRangesFormattingRequest/README.md).

## Since

3.18.0

## Proposed

## Extends

- [`WorkDoneProgressParams`](WorkDoneProgressParams.md)

## Properties

### options

> **options**: [`FormattingOptions`](FormattingOptions.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2912

The format options

***

### ranges

> **ranges**: [`Range`](Range.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2908

The ranges to format

***

### textDocument

> **textDocument**: [`TextDocumentIdentifier`](TextDocumentIdentifier.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2904

The document to format.

***

### workDoneToken?

> `optional` **workDoneToken?**: [`ProgressToken`](../type-aliases/ProgressToken.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:227

An optional token that a server can use to report work done progress.

#### Inherited from

[`WorkDoneProgressParams`](WorkDoneProgressParams.md).[`workDoneToken`](WorkDoneProgressParams.md#workdonetoken)
