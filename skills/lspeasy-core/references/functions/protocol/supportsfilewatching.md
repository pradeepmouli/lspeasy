# Functions

## protocol

### `supportsFileWatching`
Helper to check if file watching is supported
```ts
supportsFileWatching(capabilities: ClientCapabilities): capabilities is ClientCapabilities & { workspace: { didChangeWatchedFiles: { dynamicRegistration: true } } }
```
**Parameters:**
- `capabilities: ClientCapabilities`
**Returns:** `capabilities is ClientCapabilities & { workspace: { didChangeWatchedFiles: { dynamicRegistration: true } } }`
