# Functions

## utils

### `checkMethod`
Shared validation logic for checking if a method is allowed based on capabilities.

Returns `true` if allowed, `false` if disallowed in non-strict mode, or throws in strict mode.
```ts
checkMethod(opts: CheckMethodOptions): boolean
```
**Parameters:**
- `opts: CheckMethodOptions` — Validation options including the method, capability lookup helpers, and logger.
**Returns:** `boolean` — `true` when the method is allowed; `false` when disallowed in non-strict mode.
**Throws:** When the method is disallowed and `opts.strict` is `true`.
