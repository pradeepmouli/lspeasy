# Functions

## `create`
Creates a new InlineValueText literal.
```ts
create(range: Range, variableName: string | undefined, caseSensitiveLookup: boolean): InlineValueVariableLookup
```
**Parameters:**
- `range: Range` — 
- `variableName: string | undefined` — 
- `caseSensitiveLookup: boolean` — 
**Returns:** `InlineValueVariableLookup`

## `is`
```ts
is(value: InlineValue | null | undefined): value is InlineValueVariableLookup
```
**Parameters:**
- `value: InlineValue | null | undefined` — 
**Returns:** `value is InlineValueVariableLookup`
