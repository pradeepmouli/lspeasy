# Functions

## protocol

### `createWorkspaceFoldersChangeEvent`
Helper to create a WorkspaceFoldersChangeEvent.
```ts
createWorkspaceFoldersChangeEvent(added: WorkspaceFolder[], removed: WorkspaceFolder[]): WorkspaceFoldersChangeEvent
```
**Parameters:**
- `added: WorkspaceFolder[]` — Workspace folders that were added.
- `removed: WorkspaceFolder[]` — Workspace folders that were removed.
**Returns:** `WorkspaceFoldersChangeEvent` — A `WorkspaceFoldersChangeEvent` ready to send.
