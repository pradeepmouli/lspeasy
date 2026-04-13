[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / LocationLink

# Interface: LocationLink

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:208

Represents the connection of two locations. Provides additional metadata over normal [locations](Location.md),
including an origin range.

## Properties

### originSelectionRange?

> `optional` **originSelectionRange?**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:215

Span of the origin of this link.

Used as the underlined span for mouse interaction. Defaults to the word range at
the definition position.

***

### targetRange

> **targetRange**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:225

The full target range of this link. If the target for example is a symbol then target range is the
range enclosing this symbol not including leading/trailing whitespace but everything else
like comments. This information is typically used to highlight the range in the editor.

***

### targetSelectionRange

> **targetSelectionRange**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:230

The range that should be selected and revealed when this link is being followed, e.g the name of a function.
Must be contained by the `targetRange`. See also `DocumentSymbol#range`

***

### targetUri

> **targetUri**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:219

The target resource identifier of this link.
