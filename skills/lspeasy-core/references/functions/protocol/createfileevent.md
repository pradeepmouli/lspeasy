# Functions

## protocol

### `createFileEvent`
Helper to create a FileEvent.
```ts
createFileEvent(uri: string, type: FileChangeType): FileEvent
```
**Parameters:**
- `uri: string` — The URI of the changed file.
- `type: FileChangeType` — The type of file change (created, changed, or deleted).
**Returns:** `FileEvent` — A `FileEvent` object.
