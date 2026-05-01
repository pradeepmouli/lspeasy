# Functions

## protocol

### `createPartialResultParams`
Creates `PartialResultParams` with the given partial result token.
```ts
createPartialResultParams(token: ProgressToken): PartialResultParams
```
**Parameters:**
- `token: ProgressToken` — The progress token the client will use to correlate `$/progress` notifications.
**Returns:** `PartialResultParams` — A `PartialResultParams` object with `partialResultToken` set.
