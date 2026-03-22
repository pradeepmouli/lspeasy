# Functions

## `create`
Creates a new Command literal.
```ts
create(title: string, command: string, args: any[]): Command
```
**Parameters:**
- `title: string` — 
- `command: string` — 
- `args: any[]` — 
**Returns:** `Command`

## `is`
Checks whether the given literal conforms to the Command interface.
```ts
is(value: any): value is Command
```
**Parameters:**
- `value: any` — 
**Returns:** `value is Command`
