[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ColorPresentation

# Interface: ColorPresentation

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:312

## Properties

### additionalTextEdits?

> `optional` **additionalTextEdits?**: [`TextEdit`](TextEdit.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:329

An optional array of additional [text edits](TextEdit.md) that are applied when
selecting this color presentation. Edits must not overlap with the main [edit](#textedit) nor with themselves.

***

### label

> **label**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:318

The label of this color presentation. It will be shown on the color
picker header. By default this is also the text that is inserted when selecting
this color presentation.

***

### textEdit?

> `optional` **textEdit?**: [`TextEdit`](TextEdit.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:324

An [edit](TextEdit.md) which is applied to a document when selecting
this presentation for the color.  When `falsy` the [label](#label)
is used.
