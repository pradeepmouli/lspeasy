# Functions

## protocol

### `createProgressReport`
Creates a `WorkDoneProgressReport` payload to update an in-progress work-done notification.

All parameters are optional. Omit `message` to keep the last displayed message;
omit `percentage` when the operation does not have a measurable completion ratio.
If `cancellable` changes between reports, the client will update the cancel
button accordingly.
```ts
createProgressReport(message?: string, percentage?: number, cancellable?: boolean): WorkDoneProgressReport
```
**Parameters:**
- `message: string` (optional) — Updated status text; omit to keep the previous message.
- `percentage: number` (optional) — Updated progress percentage (0–100); omit for indeterminate.
- `cancellable: boolean` (optional) — Whether the cancel button should be shown/hidden.
**Returns:** `WorkDoneProgressReport` — A `WorkDoneProgressReport` object ready to send as `$/progress`.
