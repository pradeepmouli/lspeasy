[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [Diagnostic](../README.md) / create

# Function: create()

> **create**(`range`, `message`, `severity?`, `code?`, `source?`, `relatedInformation?`): [`Diagnostic`](../../../../interfaces/Diagnostic.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:573

Creates a new Diagnostic literal.

## Parameters

### range

[`Range`](../../../../interfaces/Range.md)

### message

`string`

### severity?

[`DiagnosticSeverity`](../../../../type-aliases/DiagnosticSeverity.md)

### code?

`string` \| `number`

### source?

`string`

### relatedInformation?

[`DiagnosticRelatedInformation`](../../../../interfaces/DiagnosticRelatedInformation.md)[]

## Returns

[`Diagnostic`](../../../../interfaces/Diagnostic.md)
