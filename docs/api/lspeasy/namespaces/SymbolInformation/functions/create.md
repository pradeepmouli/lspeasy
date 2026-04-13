[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [SymbolInformation](../README.md) / create

# Function: create()

> **create**(`name`, `kind`, `range`, `uri`, `containerName?`): [`SymbolInformation`](../../../../interfaces/SymbolInformation.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1927

Creates a new symbol information literal.

## Parameters

### name

`string`

The name of the symbol.

### kind

[`SymbolKind`](../../../../type-aliases/SymbolKind.md)

The kind of the symbol.

### range

[`Range`](../../../../interfaces/Range.md)

The range of the location of the symbol.

### uri

`string`

The resource of the location of symbol.

### containerName?

`string`

The name of the symbol containing the symbol.

## Returns

[`SymbolInformation`](../../../../interfaces/SymbolInformation.md)
