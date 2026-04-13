[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / NotebookDocumentFilter

# Type Alias: NotebookDocumentFilter

> **NotebookDocumentFilter** = \{ `notebookType`: `string`; `pattern?`: `string`; `scheme?`: `string`; \} \| \{ `notebookType?`: `string`; `pattern?`: `string`; `scheme`: `string`; \} \| \{ `notebookType?`: `string`; `pattern`: `string`; `scheme?`: `string`; \}

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:81

A notebook document filter denotes a notebook document by
different properties. The properties will be match
against the notebook's URI (same as with documents)

## Union Members

### Type Literal

\{ `notebookType`: `string`; `pattern?`: `string`; `scheme?`: `string`; \}

#### notebookType

> **notebookType**: `string`

The type of the enclosing notebook.

#### pattern?

> `optional` **pattern?**: `string`

A glob pattern.

#### scheme?

> `optional` **scheme?**: `string`

A Uri Uri.scheme scheme, like `file` or `untitled`.

***

### Type Literal

\{ `notebookType?`: `string`; `pattern?`: `string`; `scheme`: `string`; \}

#### notebookType?

> `optional` **notebookType?**: `string`

The type of the enclosing notebook.

#### pattern?

> `optional` **pattern?**: `string`

A glob pattern.

#### scheme

> **scheme**: `string`

A Uri Uri.scheme scheme, like `file` or `untitled`.

***

### Type Literal

\{ `notebookType?`: `string`; `pattern`: `string`; `scheme?`: `string`; \}

#### notebookType?

> `optional` **notebookType?**: `string`

The type of the enclosing notebook.

#### pattern

> **pattern**: `string`

A glob pattern.

#### scheme?

> `optional` **scheme?**: `string`

A Uri Uri.scheme scheme, like `file` or `untitled`.

## Since

3.17.0
