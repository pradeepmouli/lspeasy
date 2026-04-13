[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / Hover

# Interface: Hover

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1617

The result of a hover request.

## Properties

### contents

> **contents**: [`MarkupContent`](MarkupContent.md) \| [`MarkedString`](../type-aliases/MarkedString.md) \| [`MarkedString`](../type-aliases/MarkedString.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1621

The hover's content

***

### range?

> `optional` **range?**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1626

An optional range inside the text document that is used to
visualize the hover, e.g. by changing the background color.
