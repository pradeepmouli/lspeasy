# Functions

## protocol

### `supportsWorkDoneProgress`
Helper to check if work done progress is supported
```ts
supportsWorkDoneProgress(capabilities: ClientCapabilities): capabilities is ClientCapabilities & { window: { workDoneProgress: true } }
```
**Parameters:**
- `capabilities: ClientCapabilities`
**Returns:** `capabilities is ClientCapabilities & { window: { workDoneProgress: true } }`
