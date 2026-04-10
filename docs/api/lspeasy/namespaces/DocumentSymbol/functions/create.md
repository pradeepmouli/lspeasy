[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [DocumentSymbol](../README.md) / create

# Function: create()

> **create**(`name`, `detail`, `kind`, `range`, `selectionRange`, `children?`): [`DocumentSymbol`](../../../../interfaces/DocumentSymbol.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2024

Creates a new symbol information literal.

## Parameters

### name

`string`

The name of the symbol.

### detail

`string` \| `undefined`

The detail of the symbol.

### kind

[`SymbolKind`](../../../../type-aliases/SymbolKind.md)

The kind of the symbol.

### range

[`Range`](../../../../interfaces/Range.md)

The range of the symbol.

### selectionRange

[`Range`](../../../../interfaces/Range.md)

The selectionRange of the symbol.

### children?

[`DocumentSymbol`](../../../../interfaces/DocumentSymbol.md)[]

Children of the symbol.

## Returns

[`DocumentSymbol`](../../../../interfaces/DocumentSymbol.md)
