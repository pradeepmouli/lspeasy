[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SymbolInformation

# Interface: SymbolInformation

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1897

Represents information about programming constructs like variables, classes,
interfaces etc.

## Extends

- [`BaseSymbolInformation`](BaseSymbolInformation.md)

## Properties

### containerName?

> `optional` **containerName?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1891

The name of the symbol containing this symbol. This information is for
user interface purposes (e.g. to render a qualifier in the user interface
if necessary). It can't be used to re-infer a hierarchy for the document
symbols.

#### Inherited from

[`BaseSymbolInformation`](BaseSymbolInformation.md).[`containerName`](BaseSymbolInformation.md#containername)

***

### ~~deprecated?~~

> `optional` **deprecated?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1903

Indicates if this symbol is deprecated.

#### Deprecated

Use tags instead

***

### kind

> **kind**: [`SymbolKind`](../type-aliases/SymbolKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1878

The kind of this symbol.

#### Inherited from

[`BaseSymbolInformation`](BaseSymbolInformation.md).[`kind`](BaseSymbolInformation.md#kind)

***

### location

> **location**: [`Location`](Location.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1915

The location of this symbol. The location's range is used by a tool
to reveal the location in the editor. If the symbol is selected in the
tool the range's start information is used to position the cursor. So
the range usually spans more than the actual symbol's name and does
normally include things like visibility modifiers.

The range doesn't have to denote a node range in the sense of an abstract
syntax tree. It can therefore not be used to re-construct a hierarchy of
the symbols.

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1874

The name of this symbol.

#### Inherited from

[`BaseSymbolInformation`](BaseSymbolInformation.md).[`name`](BaseSymbolInformation.md#name)

***

### tags?

> `optional` **tags?**: `1`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1884

Tags for this symbol.

#### Since

3.16.0

#### Inherited from

[`BaseSymbolInformation`](BaseSymbolInformation.md).[`tags`](BaseSymbolInformation.md#tags)
