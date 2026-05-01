# Functions

## protocol

### `supportsFileWatching`
Returns `true` when the client supports dynamic file watching registration.
```ts
supportsFileWatching(capabilities: ClientCapabilities): capabilities is ClientCapabilities & { workspace: { didChangeWatchedFiles: { dynamicRegistration: true } } }
```
**Parameters:**
- `capabilities: ClientCapabilities` — The client capabilities to check.
**Returns:** `capabilities is ClientCapabilities & { workspace: { didChangeWatchedFiles: { dynamicRegistration: true } } }` — `true` when `workspace.didChangeWatchedFiles.dynamicRegistration` is `true`.
