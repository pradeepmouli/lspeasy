# Functions

## `create`
Creates a new InlineValueEvaluatableExpression literal.
```ts
create(range: Range, expression: string | undefined): InlineValueEvaluatableExpression
```
**Parameters:**
- `range: Range` — 
- `expression: string | undefined` — 
**Returns:** `InlineValueEvaluatableExpression`

## `is`
```ts
is(value: InlineValue | null | undefined): value is InlineValueEvaluatableExpression
```
**Parameters:**
- `value: InlineValue | null | undefined` — 
**Returns:** `value is InlineValueEvaluatableExpression`
