# Functions

## `create`
Creates a new ColorInformation literal.
```ts
create(label: string, textEdit?: TextEdit, additionalTextEdits?: TextEdit[]): ColorPresentation
```
**Parameters:**
- `label: string` — 
- `textEdit: TextEdit` (optional) — 
- `additionalTextEdits: TextEdit[]` (optional) — 
**Returns:** `ColorPresentation`

## `is`
Checks whether the given literal conforms to the ColorInformation interface.
```ts
is(value: any): value is ColorPresentation
```
**Parameters:**
- `value: any` — 
**Returns:** `value is ColorPresentation`
