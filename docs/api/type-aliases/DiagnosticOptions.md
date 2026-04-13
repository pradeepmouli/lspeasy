[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DiagnosticOptions

# Type Alias: DiagnosticOptions

> **DiagnosticOptions** = [`WorkDoneProgressOptions`](../interfaces/WorkDoneProgressOptions.md) & `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:44

Diagnostic options.

## Type Declaration

### identifier?

> `optional` **identifier?**: `string`

An optional identifier under which the diagnostics are
managed by the client.

### interFileDependencies

> **interFileDependencies**: `boolean`

Whether the language has inter file dependencies meaning that
editing code in one file can result in a different diagnostic
set in another file. Inter file dependencies are common for
most programming languages and typically uncommon for linters.

### workspaceDiagnostics

> **workspaceDiagnostics**: `boolean`

The server provides support for workspace diagnostics as well.

## Since

3.17.0
