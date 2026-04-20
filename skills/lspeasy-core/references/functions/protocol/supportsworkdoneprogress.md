# Functions

## protocol

### `supportsWorkDoneProgress`
Returns `true` when the client supports work done progress notifications.
```ts
supportsWorkDoneProgress(capabilities: ClientCapabilities): capabilities is ClientCapabilities & { window: { workDoneProgress: true } }
```
**Parameters:**
- `capabilities: ClientCapabilities` — The client capabilities to check.
**Returns:** `capabilities is ClientCapabilities & { window: { workDoneProgress: true } }` — `true` when `window.workDoneProgress` is `true`.
