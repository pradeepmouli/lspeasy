# Functions

## `create`
Creates a new VersionedTextDocumentIdentifier literal.
```ts
create(uri: string, version: number): VersionedTextDocumentIdentifier
```
**Parameters:**
- `uri: string` — The document's uri.
- `version: number` — The document's version.
**Returns:** `VersionedTextDocumentIdentifier`

## `is`
Checks whether the given literal conforms to the VersionedTextDocumentIdentifier interface.
```ts
is(value: any): value is VersionedTextDocumentIdentifier
```
**Parameters:**
- `value: any` — 
**Returns:** `value is VersionedTextDocumentIdentifier`
