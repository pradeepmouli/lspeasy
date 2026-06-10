# Functions

## protocol

### `hasPartialResultToken`
Type guard to check if params support partial results.
```ts
hasPartialResultToken(params: unknown): params is PartialResultParams
```
**Parameters:**
- `params: unknown` — The unknown value to test.
**Returns:** `params is PartialResultParams` — `true` when `params` contains a `partialResultToken` property.
