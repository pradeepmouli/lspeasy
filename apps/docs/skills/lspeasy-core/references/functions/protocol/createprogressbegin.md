# Functions

## protocol

### `createProgressBegin`
Creates a `WorkDoneProgressBegin` payload to start a work-done progress notification.

Send this as the value of a `$/progress` notification after creating a progress
token with `window/workDoneProgress/create`. The `title` is always displayed;
`message` overrides the title for the first intermediate status text.
Set `cancellable: true` only when the server can honour a `$/cancelRequest`
for the underlying operation — clients use this to show a cancel button.
```ts
createProgressBegin(title: string, cancellable?: boolean, message?: string, percentage?: number): WorkDoneProgressBegin
```
**Parameters:**
- `title: string` — Short, human-readable title for the progress operation (required).
- `cancellable: boolean` (optional) — Whether the client should offer a cancel button.
- `message: string` (optional) — Optional initial status message shown below the title.
- `percentage: number` (optional) — Optional initial progress percentage (0–100).
**Returns:** `WorkDoneProgressBegin` — A `WorkDoneProgressBegin` object ready to send as `$/progress`.
