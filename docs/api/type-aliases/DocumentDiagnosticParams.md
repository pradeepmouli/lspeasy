[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentDiagnosticParams

# Type Alias: DocumentDiagnosticParams

> **DocumentDiagnosticParams** = [`WorkDoneProgressParams`](../interfaces/WorkDoneProgressParams.md) & `PartialResultParams` & `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:90

Parameters of the document diagnostic request.

## Type Declaration

### identifier?

> `optional` **identifier?**: `string`

The additional identifier  provided during registration.

### previousResultId?

> `optional` **previousResultId?**: `string`

The result id of a previous response if provided.

### textDocument

> **textDocument**: [`TextDocumentIdentifier`](../interfaces/TextDocumentIdentifier.md)

The text document.

## Since

3.17.0
