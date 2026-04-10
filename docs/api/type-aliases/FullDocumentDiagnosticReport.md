[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / FullDocumentDiagnosticReport

# Type Alias: FullDocumentDiagnosticReport

> **FullDocumentDiagnosticReport** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:127

A diagnostic report with a full set of problems.

## Since

3.17.0

## Properties

### items

> **items**: [`Diagnostic`](../interfaces/Diagnostic.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:141

The actual items.

***

### kind

> **kind**: *typeof* [`Full`](../lspeasy/namespaces/DocumentDiagnosticReportKind/variables/Full.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:131

A full document diagnostic report.

***

### resultId?

> `optional` **resultId?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:137

An optional result id. If provided it will
be sent on the next diagnostic request for the
same document.
