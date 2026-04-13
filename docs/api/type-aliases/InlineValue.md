[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / InlineValue

# Type Alias: InlineValue

> **InlineValue** = [`InlineValueText`](InlineValueText.md) \| [`InlineValueVariableLookup`](InlineValueVariableLookup.md) \| [`InlineValueEvaluatableExpression`](InlineValueEvaluatableExpression.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2764

Inline value information can be provided by different means:
- directly as a text value (class InlineValueText).
- as a name to use for a variable lookup (class InlineValueVariableLookup)
- as an evaluatable expression (class InlineValueEvaluatableExpression)
The InlineValue types combines all inline value types into one type.

## Since

3.17.0
