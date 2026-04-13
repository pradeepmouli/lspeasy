[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / InlineValueEvaluatableExpression

# Type Alias: InlineValueEvaluatableExpression

> **InlineValueEvaluatableExpression** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2732

Provide an inline value through an expression evaluation.
If only a range is specified, the expression will be extracted from the underlying document.
An optional expression can be used to override the extracted expression.

## Since

3.17.0

## Properties

### expression?

> `optional` **expression?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2741

If specified the expression overrides the extracted expression.

***

### range

> **range**: [`Range`](../interfaces/Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2737

The document range for which the inline value applies.
The range is used to extract the evaluatable expression from the underlying document.
