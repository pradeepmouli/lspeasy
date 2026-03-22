# Functions

## `create`
Creates a new code action.
```ts
create(title: string, kind?: string): CodeAction
```
**Parameters:**
- `title: string` — The title of the code action.
- `kind: string` (optional) — The kind of the code action.
**Returns:** `CodeAction`

## `is`
```ts
is(value: any): value is CodeAction
```
**Parameters:**
- `value: any` — 
**Returns:** `value is CodeAction`
