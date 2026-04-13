[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / UnchangedDocumentDiagnosticReport

# Type Alias: UnchangedDocumentDiagnosticReport

> **UnchangedDocumentDiagnosticReport** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:168

A diagnostic report indicating that the last returned
report is still accurate.

## Since

3.17.0

## Properties

### kind

> **kind**: *typeof* [`Unchanged`](../lspeasy/namespaces/DocumentDiagnosticReportKind/variables/Unchanged.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:175

A document diagnostic report indicating
no changes to the last result. A server can
only return `unchanged` if result ids are
provided.

***

### resultId

> **resultId**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:180

A result id which will be sent on the next
diagnostic request for the same document.
