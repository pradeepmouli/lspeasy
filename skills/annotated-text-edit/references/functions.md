# Functions

## `replace`
Creates an annotated replace text edit.
```ts
replace(range: Range, newText: string, annotation: string): AnnotatedTextEdit
```
**Parameters:**
- `range: Range` — The range of text to be replaced.
- `newText: string` — The new text.
- `annotation: string` — The annotation.
**Returns:** `AnnotatedTextEdit`

## `insert`
Creates an annotated insert text edit.
```ts
insert(position: Position, newText: string, annotation: string): AnnotatedTextEdit
```
**Parameters:**
- `position: Position` — The position to insert the text at.
- `newText: string` — The text to be inserted.
- `annotation: string` — The annotation.
**Returns:** `AnnotatedTextEdit`

## `del`
Creates an annotated delete text edit.
```ts
del(range: Range, annotation: string): AnnotatedTextEdit
```
**Parameters:**
- `range: Range` — The range of text to be deleted.
- `annotation: string` — The annotation.
**Returns:** `AnnotatedTextEdit`

## `is`
```ts
is(value: any): value is AnnotatedTextEdit
```
**Parameters:**
- `value: any` — 
**Returns:** `value is AnnotatedTextEdit`
