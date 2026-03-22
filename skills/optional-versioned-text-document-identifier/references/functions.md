# Functions

## `create`
Creates a new OptionalVersionedTextDocumentIdentifier literal.
```ts
create(uri: string, version: number | null): OptionalVersionedTextDocumentIdentifier
```
**Parameters:**
- `uri: string` — The document's uri.
- `version: number | null` — The document's version.
**Returns:** `OptionalVersionedTextDocumentIdentifier`

## `is`
Checks whether the given literal conforms to the OptionalVersionedTextDocumentIdentifier interface.
```ts
is(value: any): value is OptionalVersionedTextDocumentIdentifier
```
**Parameters:**
- `value: any` — 
**Returns:** `value is OptionalVersionedTextDocumentIdentifier`
