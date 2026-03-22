# Functions

## `create`
Creates a new InlineValueContext literal.
```ts
create(frameId: number, stoppedLocation: Range): InlineValueContext
```
**Parameters:**
- `frameId: number` — 
- `stoppedLocation: Range` — 
**Returns:** `InlineValueContext`

## `is`
Checks whether the given literal conforms to the InlineValueContext interface.
```ts
is(value: any): value is InlineValueContext
```
**Parameters:**
- `value: any` — 
**Returns:** `value is InlineValueContext`
