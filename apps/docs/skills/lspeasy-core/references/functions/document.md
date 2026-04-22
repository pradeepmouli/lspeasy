# Functions

## Document

### `createFullDidChangeParams`
Builds `DidChangeTextDocumentParams` for a full-document text replacement.

Use when the server only supports full-text synchronisation
(`textDocumentSync.change = Full`) or when tracking individual edits is
impractical (e.g. clipboard paste of a large file).
```ts
createFullDidChangeParams(uri: string, text: string, source: VersionSource): DidChangeTextDocumentParams
```
**Parameters:**
- `uri: string` — The document URI.
- `text: string` — The complete new document text.
- `source: VersionSource` — Either an explicit `version` number or a `tracker` instance.
**Returns:** `DidChangeTextDocumentParams` — A `DidChangeTextDocumentParams` ready to send.
**Throws:** If neither `version` nor `tracker` is provided.

### `createIncrementalDidChangeParams`
Builds `DidChangeTextDocumentParams` for an incremental (range-based)
document change notification.

Use when the client tracks individual edits (e.g. single-character
insertions, deletions) rather than sending the full document text on each
change. Requires the server to have `textDocumentSync.change = Incremental`.
```ts
createIncrementalDidChangeParams(uri: string, changes: IncrementalChange[], source: VersionSource): DidChangeTextDocumentParams
```
**Parameters:**
- `uri: string` — The document URI.
- `changes: IncrementalChange[]` — One or more range-based text changes.
- `source: VersionSource` — Either an explicit `version` number or a `tracker` instance.
**Returns:** `DidChangeTextDocumentParams` — A `DidChangeTextDocumentParams` ready to send.
**Throws:** If neither `version` nor `tracker` is provided.
