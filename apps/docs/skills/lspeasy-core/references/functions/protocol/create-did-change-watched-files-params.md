# Functions

## protocol

### `createDidChangeWatchedFilesParams`
Helper to create DidChangeWatchedFilesParams.
```ts
createDidChangeWatchedFilesParams(changes: FileEvent[]): DidChangeWatchedFilesParams
```
**Parameters:**
- `changes: FileEvent[]` — Array of file events describing each changed file.
**Returns:** `DidChangeWatchedFilesParams` — A `DidChangeWatchedFilesParams` ready to send.
