# Functions

## `create`
Creates a new Position literal from the given line and character.
```ts
create(line: number, character: number): Position
```
**Parameters:**
- `line: number` — The position's line.
- `character: number` — The position's character.
**Returns:** `Position`

## `is`
Checks whether the given literal conforms to the Position interface.
```ts
is(value: any): value is Position
```
**Parameters:**
- `value: any` — 
**Returns:** `value is Position`
