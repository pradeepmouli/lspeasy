# Functions

## `create`
Creates a new insert / replace edit
```ts
create(newText: string, insert: Range, replace: Range): InsertReplaceEdit
```
**Parameters:**
- `newText: string` — 
- `insert: Range` — 
- `replace: Range` — 
**Returns:** `InsertReplaceEdit`

## `is`
Checks whether the given literal conforms to the InsertReplaceEdit interface.
```ts
is(value: TextEdit | InsertReplaceEdit): value is InsertReplaceEdit
```
**Parameters:**
- `value: TextEdit | InsertReplaceEdit` — 
**Returns:** `value is InsertReplaceEdit`
