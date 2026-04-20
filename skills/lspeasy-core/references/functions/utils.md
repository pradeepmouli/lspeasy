# Functions

## utils

### `checkMethod`
Shared validation logic for checking if a method is allowed based on capabilities.

Returns true if allowed, false if disallowed (non-strict), or throws (strict).
```ts
checkMethod(opts: CheckMethodOptions): boolean
```
**Parameters:**
- `opts: CheckMethodOptions`
**Returns:** `boolean`
