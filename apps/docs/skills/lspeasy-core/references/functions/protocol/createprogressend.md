# Functions

## protocol

### `createProgressEnd`
Creates a `WorkDoneProgressEnd` payload to close a work-done progress notification.
```ts
createProgressEnd(message?: string): WorkDoneProgressEnd
```
**Parameters:**
- `message: string` (optional) — Optional final status message displayed when progress ends.
**Returns:** `WorkDoneProgressEnd` — A `WorkDoneProgressEnd` object ready to send as `$/progress`.
