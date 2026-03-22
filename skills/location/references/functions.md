# Functions

## `create`
Creates a Location literal.
```ts
create(uri: string, range: Range): Location
```
**Parameters:**
- `uri: string` — The location's uri.
- `range: Range` — The location's range.
**Returns:** `Location`

## `is`
Checks whether the given literal conforms to the Location interface.
```ts
is(value: any): value is Location
```
**Parameters:**
- `value: any` — 
**Returns:** `value is Location`
