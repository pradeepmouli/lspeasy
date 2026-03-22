# Functions

## `create`
Create a new Range literal.
```ts
create(start: Position, end: Position): Range
```
**Parameters:**
- `start: Position` — The range's start position.
- `end: Position` — The range's end position.
**Returns:** `Range`

## `is`
Checks whether the given literal conforms to the Range interface.
```ts
is(value: any): value is Range
```
**Parameters:**
- `value: any` — 
**Returns:** `value is Range`
