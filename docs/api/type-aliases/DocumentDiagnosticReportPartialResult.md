[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentDiagnosticReportPartialResult

# Type Alias: DocumentDiagnosticReportPartialResult

> **DocumentDiagnosticReportPartialResult** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:216

A partial result for a document diagnostic report.

## Since

3.17.0

## Properties

### relatedDocuments

> **relatedDocuments**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:217

#### Index Signature

\[`uri`: `string`\]: [`FullDocumentDiagnosticReport`](FullDocumentDiagnosticReport.md) \| [`UnchangedDocumentDiagnosticReport`](UnchangedDocumentDiagnosticReport.md)
