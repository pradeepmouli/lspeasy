[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / InlineValueParams

# Type Alias: InlineValueParams

> **InlineValueParams** = [`WorkDoneProgressParams`](../interfaces/WorkDoneProgressParams.md) & `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.inlineValue.d.ts:50

A parameter literal used in inline value requests.

## Type Declaration

### context

> **context**: [`InlineValueContext`](InlineValueContext.md)

Additional information about the context in which inline values were
requested.

### range

> **range**: [`Range`](../interfaces/Range.md)

The document range for which inline values should be computed.

### textDocument

> **textDocument**: [`TextDocumentIdentifier`](../interfaces/TextDocumentIdentifier.md)

The text document.

## Since

3.17.0
