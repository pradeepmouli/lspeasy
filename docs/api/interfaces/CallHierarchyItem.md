[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CallHierarchyItem

# Interface: CallHierarchyItem

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2432

Represents programming constructs like functions or constructors in the context
of call hierarchy.

## Since

3.16.0

## Properties

### data?

> `optional` **data?**: `any`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2466

A data entry field that is preserved between a call hierarchy prepare and
incoming calls or outgoing calls requests.

***

### detail?

> `optional` **detail?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2448

More detail for this item, e.g. the signature of a function.

***

### kind

> **kind**: [`SymbolKind`](../type-aliases/SymbolKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2440

The kind of this item.

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2436

The name of this item.

***

### range

> **range**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2456

The range enclosing this symbol not including leading/trailing whitespace but everything else, e.g. comments and code.

***

### selectionRange

> **selectionRange**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2461

The range that should be selected and revealed when this symbol is being picked, e.g. the name of a function.
Must be contained by the [\`range\`](#range).

***

### tags?

> `optional` **tags?**: `1`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2444

Tags for this item.

***

### uri

> **uri**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2452

The resource identifier of this item.
