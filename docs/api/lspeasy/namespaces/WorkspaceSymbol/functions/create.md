[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [WorkspaceSymbol](../README.md) / create

# Function: create()

> **create**(`name`, `kind`, `uri`, `range?`): [`WorkspaceSymbol`](../../../../interfaces/WorkspaceSymbol.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1963

Create a new workspace symbol.

## Parameters

### name

`string`

The name of the symbol.

### kind

[`SymbolKind`](../../../../type-aliases/SymbolKind.md)

The kind of the symbol.

### uri

`string`

The resource of the location of the symbol.

### range?

[`Range`](../../../../interfaces/Range.md)

An options range of the location.

## Returns

[`WorkspaceSymbol`](../../../../interfaces/WorkspaceSymbol.md)

A WorkspaceSymbol.
