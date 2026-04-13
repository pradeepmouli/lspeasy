[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / InlayHint

# Type Alias: InlayHint

> **InlayHint** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2860

Inlay hint information.

## Since

3.17.0

## Properties

### data?

> `optional` **data?**: [`LSPAny`](LSPAny.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2909

A data entry field that is preserved on an inlay hint between
a `textDocument/inlayHint` and a `inlayHint/resolve` request.

***

### kind?

> `optional` **kind?**: [`InlayHintKind`](InlayHintKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2876

The kind of this hint. Can be omitted in which case the client
should fall back to a reasonable default.

***

### label

> **label**: `string` \| [`InlayHintLabelPart`](InlayHintLabelPart.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2871

The label of this hint. A human readable string or an array of
InlayHintLabelPart label parts.

*Note* that neither the string nor the label part can be empty.

***

### paddingLeft?

> `optional` **paddingLeft?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2896

Render padding before the hint.

Note: Padding should use the editor's background color, not the
background color of the hint itself. That means padding can be used
to visually align/separate an inlay hint.

***

### paddingRight?

> `optional` **paddingRight?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2904

Render padding after the hint.

Note: Padding should use the editor's background color, not the
background color of the hint itself. That means padding can be used
to visually align/separate an inlay hint.

***

### position

> **position**: [`Position`](../interfaces/Position.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2864

The position of this hint.

***

### textEdits?

> `optional` **textEdits?**: [`TextEdit`](../interfaces/TextEdit.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2884

Optional text edits that are performed when accepting this inlay hint.

*Note* that edits are expected to change the document so that the inlay
hint (or its nearest variant) is now part of the document and the inlay
hint itself is now obsolete.

***

### tooltip?

> `optional` **tooltip?**: `string` \| [`MarkupContent`](../interfaces/MarkupContent.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2888

The tooltip text when you hover over this item.
