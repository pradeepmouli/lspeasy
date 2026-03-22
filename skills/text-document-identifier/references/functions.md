# Functions

## `create`
Creates a new TextDocumentIdentifier literal.
```ts
create(uri: string): TextDocumentIdentifier
```
**Parameters:**
- `uri: string` — The document's uri.
**Returns:** `TextDocumentIdentifier`

## `is`
Checks whether the given literal conforms to the TextDocumentIdentifier interface.
```ts
is(value: any): value is TextDocumentIdentifier
```
**Parameters:**
- `value: any` — 
**Returns:** `value is TextDocumentIdentifier`
