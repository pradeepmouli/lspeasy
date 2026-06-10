# Functions

## protocol

### `createWorkspaceFolder`
Helper to create a WorkspaceFolder.
```ts
createWorkspaceFolder(uri: string, name: string): WorkspaceFolder
```
**Parameters:**
- `uri: string` — The URI of the workspace folder (e.g. `'file:///home/user/project'`).
- `name: string` — Human-readable name displayed in the editor.
**Returns:** `WorkspaceFolder` — A `WorkspaceFolder` object.
