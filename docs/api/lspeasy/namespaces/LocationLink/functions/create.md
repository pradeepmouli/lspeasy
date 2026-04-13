[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [LocationLink](../README.md) / create

# Function: create()

> **create**(`targetUri`, `targetRange`, `targetSelectionRange`, `originSelectionRange?`): [`LocationLink`](../../../../interfaces/LocationLink.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:244

Creates a LocationLink literal.

## Parameters

### targetUri

`string`

The definition's uri.

### targetRange

[`Range`](../../../../interfaces/Range.md)

The full range of the definition.

### targetSelectionRange

[`Range`](../../../../interfaces/Range.md)

The span of the symbol definition at the target.

### originSelectionRange?

[`Range`](../../../../interfaces/Range.md)

The span of the symbol being defined in the originating source file.

## Returns

[`LocationLink`](../../../../interfaces/LocationLink.md)
