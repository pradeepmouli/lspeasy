[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / FoldingRange

# Interface: FoldingRange

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:372

Represents a folding range. To be valid, start and end line must be bigger than zero and smaller
than the number of lines in the document. Clients are free to ignore invalid ranges.

## Properties

### collapsedText?

> `optional` **collapsedText?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:404

The text that the client should show when the specified range is
collapsed. If not defined or not supported by the client, a default
will be chosen by the client.

#### Since

3.17.0

***

### endCharacter?

> `optional` **endCharacter?**: `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:390

The zero-based character offset before the folded range ends. If not defined, defaults to the length of the end line.

***

### endLine

> **endLine**: `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:386

The zero-based end line of the range to fold. The folded area ends with the line's last character.
To be valid, the end must be zero or larger and smaller than the number of lines in the document.

***

### kind?

> `optional` **kind?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:396

Describes the kind of the folding range such as `comment' or 'region'. The kind
is used to categorize folding ranges and used by commands like 'Fold all comments'.
See [FoldingRangeKind](../type-aliases/FoldingRangeKind.md) for an enumeration of standardized kinds.

***

### startCharacter?

> `optional` **startCharacter?**: `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:381

The zero-based character offset from where the folded range starts. If not defined, defaults to the length of the start line.

***

### startLine

> **startLine**: `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:377

The zero-based start line of the range to fold. The folded area starts after the line's last character.
To be valid, the end must be zero or larger and smaller than the number of lines in the document.
