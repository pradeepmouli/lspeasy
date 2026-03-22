# Functions

## `create`
Creates a new CodeActionContext literal.
```ts
create(diagnostics: Diagnostic[], only?: string[], triggerKind?: CodeActionTriggerKind): CodeActionContext
```
**Parameters:**
- `diagnostics: Diagnostic[]` — 
- `only: string[]` (optional) — 
- `triggerKind: CodeActionTriggerKind` (optional) — 
**Returns:** `CodeActionContext`

## `is`
Checks whether the given literal conforms to the CodeActionContext interface.
```ts
is(value: any): value is CodeActionContext
```
**Parameters:**
- `value: any` — 
**Returns:** `value is CodeActionContext`
