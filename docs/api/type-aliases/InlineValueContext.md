[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / InlineValueContext

# Type Alias: InlineValueContext

> **InlineValueContext** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2768

## Since

3.17.0

## Properties

### frameId

> **frameId**: [`integer`](integer.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2772

The stack frame (as a DAP Id) where the execution has stopped.

***

### stoppedLocation

> **stoppedLocation**: [`Range`](../interfaces/Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2777

The document range where execution has stopped.
Typically the end position of the range denotes the line where the inline values are shown.
