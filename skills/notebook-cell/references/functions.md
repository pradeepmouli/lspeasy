# Functions

## `create`
```ts
create(kind: NotebookCellKind, document: string): NotebookCell
```
**Parameters:**
- `kind: NotebookCellKind` — 
- `document: string` — 
**Returns:** `NotebookCell`

## `is`
```ts
is(value: any): value is NotebookCell
```
**Parameters:**
- `value: any` — 
**Returns:** `value is NotebookCell`

## `diff`
```ts
diff(one: NotebookCell, two: NotebookCell): Set<keyof NotebookCell>
```
**Parameters:**
- `one: NotebookCell` — 
- `two: NotebookCell` — 
**Returns:** `Set<keyof NotebookCell>`
