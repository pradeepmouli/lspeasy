# Functions

## protocol

### `createProgressCreateParams`
Creates `WorkDoneProgressCreateParams` for a `window/workDoneProgress/create` request.
```ts
createProgressCreateParams(token: ProgressToken): WorkDoneProgressCreateParams
```
**Parameters:**
- `token: ProgressToken` — The progress token to associate with this progress notification.
**Returns:** `WorkDoneProgressCreateParams` — A `WorkDoneProgressCreateParams` ready to send.
