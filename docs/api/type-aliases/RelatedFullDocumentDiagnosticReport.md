[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / RelatedFullDocumentDiagnosticReport

# Type Alias: RelatedFullDocumentDiagnosticReport

> **RelatedFullDocumentDiagnosticReport** = [`FullDocumentDiagnosticReport`](FullDocumentDiagnosticReport.md) & `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:148

A full diagnostic report with a set of related documents.

## Type Declaration

### relatedDocuments?

> `optional` **relatedDocuments?**: `object`

Diagnostics of related documents. This information is useful
in programming languages where code in a file A can generate
diagnostics in a file B which A depends on. An example of
such a language is C/C++ where marco definitions in a file
a.cpp and result in errors in a header file b.hpp.

#### Index Signature

\[`uri`: `string`\]: [`FullDocumentDiagnosticReport`](FullDocumentDiagnosticReport.md) \| [`UnchangedDocumentDiagnosticReport`](UnchangedDocumentDiagnosticReport.md)

#### Since

3.17.0

## Since

3.17.0
