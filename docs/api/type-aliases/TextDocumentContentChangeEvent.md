[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TextDocumentContentChangeEvent

# Type Alias: TextDocumentContentChangeEvent

> **TextDocumentContentChangeEvent** = \{ `range`: [`Range`](../interfaces/Range.md); `rangeLength?`: [`uinteger`](uinteger.md); `text`: `string`; \} \| \{ `text`: `string`; \}

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1425

An event describing a change to a text document. If only a text is provided
it is considered to be the full content of the document.

## Union Members

### Type Literal

\{ `range`: [`Range`](../interfaces/Range.md); `rangeLength?`: [`uinteger`](uinteger.md); `text`: `string`; \}

#### range

> **range**: [`Range`](../interfaces/Range.md)

The range of the document that changed.

#### ~~rangeLength?~~

> `optional` **rangeLength?**: [`uinteger`](uinteger.md)

The optional length of the range that got replaced.

##### Deprecated

use range instead.

#### text

> **text**: `string`

The new text for the provided range.

***

### Type Literal

\{ `text`: `string`; \}

#### text

> **text**: `string`

The new text of the whole document.
