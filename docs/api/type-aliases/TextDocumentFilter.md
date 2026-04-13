[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TextDocumentFilter

# Type Alias: TextDocumentFilter

> **TextDocumentFilter** = \{ `language`: `string`; `pattern?`: `string`; `scheme?`: `string`; \} \| \{ `language?`: `string`; `pattern?`: `string`; `scheme`: `string`; \} \| \{ `language?`: `string`; `pattern`: `string`; `scheme?`: `string`; \}

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:43

A document filter denotes a document by different properties like
the [language](../interfaces/TextDocument.md#languageid), the Uri.scheme scheme of
its resource, or a glob-pattern that is applied to the TextDocument.fileName path.

Glob patterns can have the following syntax:
- `*` to match one or more characters in a path segment
- `?` to match on one character in a path segment
- `**` to match any number of path segments, including none
- `{}` to group sub patterns into an OR expression. (e.g. `**​/*.{ts,js}` matches all TypeScript and JavaScript files)
- `[]` to declare a range of characters to match in a path segment (e.g., `example.[0-9]` to match on `example.0`, `example.1`, …)
- `[!...]` to negate a range of characters to match in a path segment (e.g., `example.[!0-9]` to match on `example.a`, `example.b`, but not `example.0`)

## Union Members

### Type Literal

\{ `language`: `string`; `pattern?`: `string`; `scheme?`: `string`; \}

#### language

> **language**: `string`

A language id, like `typescript`.

#### pattern?

> `optional` **pattern?**: `string`

A glob pattern, like **​/*.{ts,js}. See TextDocumentFilter for examples.

#### scheme?

> `optional` **scheme?**: `string`

A Uri Uri.scheme scheme, like `file` or `untitled`.

***

### Type Literal

\{ `language?`: `string`; `pattern?`: `string`; `scheme`: `string`; \}

#### language?

> `optional` **language?**: `string`

A language id, like `typescript`.

#### pattern?

> `optional` **pattern?**: `string`

A glob pattern, like **​/*.{ts,js}. See TextDocumentFilter for examples.

#### scheme

> **scheme**: `string`

A Uri Uri.scheme scheme, like `file` or `untitled`.

***

### Type Literal

\{ `language?`: `string`; `pattern`: `string`; `scheme?`: `string`; \}

#### language?

> `optional` **language?**: `string`

A language id, like `typescript`.

#### pattern

> **pattern**: `string`

A glob pattern, like **​/*.{ts,js}. See TextDocumentFilter for examples.

#### scheme?

> `optional` **scheme?**: `string`

A Uri Uri.scheme scheme, like `file` or `untitled`.

## Sample

A language filter that applies to typescript files on disk: `{ language: 'typescript', scheme: 'file' }`

## Sample

A language filter that applies to all package.json paths: `{ language: 'json', pattern: '**package.json' }`

## Since

3.17.0
