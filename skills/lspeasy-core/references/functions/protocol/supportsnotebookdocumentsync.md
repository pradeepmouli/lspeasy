# Functions

## protocol

### `supportsNotebookDocumentSync`
Helper to check if notebook document sync is supported by the server.
```ts
supportsNotebookDocumentSync(capabilities: ServerCapabilities): capabilities is ServerCapabilities<any> & { notebookDocumentSync: NonNullable<NotebookDocumentSyncOptions | NotebookDocumentSyncRegistrationOptions | undefined> }
```
**Parameters:**
- `capabilities: ServerCapabilities` — The server capabilities to check.
**Returns:** `capabilities is ServerCapabilities<any> & { notebookDocumentSync: NonNullable<NotebookDocumentSyncOptions | NotebookDocumentSyncRegistrationOptions | undefined> }` — `true` when `notebookDocumentSync` is declared (not null/undefined).
