[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TypeHierarchyItem

# Type Alias: TypeHierarchyItem

> **TypeHierarchyItem** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2624

## Since

3.17.0

## Properties

### data?

> `optional` **data?**: [`LSPAny`](LSPAny.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2662

A data entry field that is preserved between a type hierarchy prepare and
supertypes or subtypes requests. It could also be used to identify the
type hierarchy in the server, helping improve the performance on
resolving supertypes and subtypes.

***

### detail?

> `optional` **detail?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2640

More detail for this item, e.g. the signature of a function.

***

### kind

> **kind**: [`SymbolKind`](SymbolKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2632

The kind of this item.

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2628

The name of this item.

***

### range

> **range**: [`Range`](../interfaces/Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2649

The range enclosing this symbol not including leading/trailing whitespace
but everything else, e.g. comments and code.

***

### selectionRange

> **selectionRange**: [`Range`](../interfaces/Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2655

The range that should be selected and revealed when this symbol is being
picked, e.g. the name of a function. Must be contained by the
[\`range\`](#range).

***

### tags?

> `optional` **tags?**: [`SymbolTag`](SymbolTag.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2636

Tags for this item.

***

### uri

> **uri**: [`DocumentUri`](DocumentUri.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2644

The resource identifier of this item.
