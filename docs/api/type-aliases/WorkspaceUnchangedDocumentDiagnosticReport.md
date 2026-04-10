[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WorkspaceUnchangedDocumentDiagnosticReport

# Type Alias: WorkspaceUnchangedDocumentDiagnosticReport

> **WorkspaceUnchangedDocumentDiagnosticReport** = [`UnchangedDocumentDiagnosticReport`](UnchangedDocumentDiagnosticReport.md) & `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:286

An unchanged document diagnostic report for a workspace diagnostic result.

## Type Declaration

### uri

> **uri**: [`DocumentUri`](DocumentUri.md)

The URI for which diagnostic information is reported.

### version

> **version**: [`integer`](integer.md) \| `null`

The version number for which the diagnostics are reported.
If the document is not marked as open `null` can be provided.

## Since

3.17.0
