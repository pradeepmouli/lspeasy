[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / BaseSymbolInformation

# Interface: BaseSymbolInformation

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1870

A base for all symbol information.

## Extended by

- [`SymbolInformation`](SymbolInformation.md)
- [`WorkspaceSymbol`](WorkspaceSymbol.md)

## Properties

### containerName?

> `optional` **containerName?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1891

The name of the symbol containing this symbol. This information is for
user interface purposes (e.g. to render a qualifier in the user interface
if necessary). It can't be used to re-infer a hierarchy for the document
symbols.

***

### kind

> **kind**: [`SymbolKind`](../type-aliases/SymbolKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1878

The kind of this symbol.

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1874

The name of this symbol.

***

### tags?

> `optional` **tags?**: `1`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1884

Tags for this symbol.

#### Since

3.16.0
