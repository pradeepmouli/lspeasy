[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentDiagnosticReport

# Type Alias: DocumentDiagnosticReport

> **DocumentDiagnosticReport** = [`RelatedFullDocumentDiagnosticReport`](RelatedFullDocumentDiagnosticReport.md) \| [`RelatedUnchangedDocumentDiagnosticReport`](RelatedUnchangedDocumentDiagnosticReport.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:210

The result of a document diagnostic pull request. A report can
either be a full report containing all diagnostics for the
requested document or an unchanged report indicating that nothing
has changed in terms of diagnostics in comparison to the last
pull request.

## Since

3.17.0
