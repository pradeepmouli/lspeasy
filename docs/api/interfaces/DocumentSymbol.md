[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DocumentSymbol

# Interface: DocumentSymbol

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1971

Represents programming constructs like variables, classes, interfaces etc.
that appear in a document. Document symbols can be hierarchical and they
have two ranges: one that encloses its definition and one that points to
its most interesting range, e.g. the range of an identifier.

## Properties

### children?

> `optional` **children?**: `DocumentSymbol`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2011

Children of this symbol, e.g. properties of a class.

***

### ~~deprecated?~~

> `optional` **deprecated?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1996

Indicates if this symbol is deprecated.

#### Deprecated

Use tags instead

***

### detail?

> `optional` **detail?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1980

More detail for this symbol, e.g the signature of a function.

***

### kind

> **kind**: [`SymbolKind`](../type-aliases/SymbolKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1984

The kind of this symbol.

***

### name

> **name**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1976

The name of this symbol. Will be displayed in the user interface and therefore must not be
an empty string or a string only consisting of white spaces.

***

### range

> **range**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2002

The range enclosing this symbol not including leading/trailing whitespace but everything else
like comments. This information is typically used to determine if the clients cursor is
inside the symbol to reveal in the symbol in the UI.

***

### selectionRange

> **selectionRange**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2007

The range that should be selected and revealed when this symbol is being picked, e.g the name of a function.
Must be contained by the `range`.

***

### tags?

> `optional` **tags?**: `1`[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1990

Tags for this document symbol.

#### Since

3.16.0
