# Functions

## protocol

### `supportsWorkspaceFolders`
Returns `true` when the server supports workspace folders.
```ts
supportsWorkspaceFolders(capabilities: ServerCapabilities): capabilities is ServerCapabilities<any> & { workspace: { workspaceFolders: { supported: true } } }
```
**Parameters:**
- `capabilities: ServerCapabilities` — The server capabilities to check.
**Returns:** `capabilities is ServerCapabilities<any> & { workspace: { workspaceFolders: { supported: true } } }` — `true` when `workspace.workspaceFolders.supported` is `true`.
