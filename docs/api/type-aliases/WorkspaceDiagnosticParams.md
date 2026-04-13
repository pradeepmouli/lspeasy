[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WorkspaceDiagnosticParams

# Type Alias: WorkspaceDiagnosticParams

> **WorkspaceDiagnosticParams** = [`WorkDoneProgressParams`](../interfaces/WorkDoneProgressParams.md) & `PartialResultParams` & `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:254

Parameters of the workspace diagnostic request.

## Type Declaration

### identifier?

> `optional` **identifier?**: `string`

The additional identifier provided during registration.

### previousResultIds

> **previousResultIds**: [`PreviousResultId`](PreviousResultId.md)[]

The currently known diagnostic reports with their
previous result ids.

## Since

3.17.0
