# Functions

## protocol

### `getPartialResultToken`
Extracts the partial result token from params.
```ts
getPartialResultToken(params: PartialResultParams): ProgressToken | undefined
```
**Parameters:**
- `params: PartialResultParams` — The request params that may carry a `partialResultToken`.
**Returns:** `ProgressToken | undefined` — The `ProgressToken`, or `undefined` if none was set.
