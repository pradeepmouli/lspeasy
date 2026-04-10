[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SelectionRange

# Interface: SelectionRange

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2403

A selection range represents a part of a selection hierarchy. A selection range
may have a parent selection range that contains it.

## Properties

### parent?

> `optional` **parent?**: `SelectionRange`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2411

The parent selection range containing this range. Therefore `parent.range` must contain `this.range`.

***

### range

> **range**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2407

The [range](Range.md) of this selection range.
