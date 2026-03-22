# Functions

## `create`
Creates a new TextDocumentItem literal.
```ts
create(uri: string, languageId: string, version: number, text: string): TextDocumentItem
```
**Parameters:**
- `uri: string` — The document's uri.
- `languageId: string` — The document's language identifier.
- `version: number` — The document's version number.
- `text: string` — The document's text.
**Returns:** `TextDocumentItem`

## `is`
Checks whether the given literal conforms to the TextDocumentItem interface.
```ts
is(value: any): value is TextDocumentItem
```
**Parameters:**
- `value: any` — 
**Returns:** `value is TextDocumentItem`
