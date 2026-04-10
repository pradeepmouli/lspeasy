[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DiagnosticRelatedInformation

# Interface: DiagnosticRelatedInformation

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:425

Represents a related message and source code location for a diagnostic. This should be
used to point to code locations that cause or related to a diagnostics, e.g when duplicating
a symbol in a scope.

## Properties

### location

> **location**: [`Location`](Location.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:429

The location of this related diagnostic information.

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:433

The message of this related diagnostic information.
