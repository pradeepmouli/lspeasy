# Functions

## protocol

### `supportsWorkspaceFolders`
Helper to check if workspace folders are supported
```ts
supportsWorkspaceFolders(capabilities: ServerCapabilities): capabilities is ServerCapabilities<any> & { workspace: { workspaceFolders: { supported: true } } }
```
**Parameters:**
- `capabilities: ServerCapabilities`
**Returns:** `capabilities is ServerCapabilities<any> & { workspace: { workspaceFolders: { supported: true } } }`
