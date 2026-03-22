# Functions

## `replace`
Creates a replace text edit.
```ts
replace(range: Range, newText: string): TextEdit
```
**Parameters:**
- `range: Range` — The range of text to be replaced.
- `newText: string` — The new text.
**Returns:** `TextEdit`

## `insert`
Creates an insert text edit.
```ts
insert(position: Position, newText: string): TextEdit
```
**Parameters:**
- `position: Position` — The position to insert the text at.
- `newText: string` — The text to be inserted.
**Returns:** `TextEdit`

## `del`
Creates a delete text edit.
```ts
del(range: Range): TextEdit
```
**Parameters:**
- `range: Range` — The range of text to be deleted.
**Returns:** `TextEdit`

## `is`
```ts
is(value: any): value is TextEdit
```
**Parameters:**
- `value: any` — 
**Returns:** `value is TextEdit`
