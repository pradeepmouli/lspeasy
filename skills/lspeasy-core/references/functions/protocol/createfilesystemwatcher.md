# Functions

## protocol

### `createFileSystemWatcher`
Helper to create a FileSystemWatcher.
```ts
createFileSystemWatcher(globPattern: string, kind?: number): FileSystemWatcher
```
**Parameters:**
- `globPattern: string` — Glob pattern to watch (e.g. "**/*.ts").
- `kind: number` (optional) — The watch kinds to subscribe to; defaults to all (create, change, delete).
**Returns:** `FileSystemWatcher` — A `FileSystemWatcher` object.
