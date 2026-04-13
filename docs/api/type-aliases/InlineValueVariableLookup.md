[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / InlineValueVariableLookup

# Type Alias: InlineValueVariableLookup

> **InlineValueVariableLookup** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2698

Provide inline value through a variable lookup.
If only a range is specified, the variable name will be extracted from the underlying document.
An optional variable name can be used to override the extracted name.

## Since

3.17.0

## Properties

### caseSensitiveLookup

> **caseSensitiveLookup**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2711

How to perform the lookup.

***

### range

> **range**: [`Range`](../interfaces/Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2703

The document range for which the inline value applies.
The range is used to extract the variable name from the underlying document.

***

### variableName?

> `optional` **variableName?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2707

If specified the name of the variable to look up.
