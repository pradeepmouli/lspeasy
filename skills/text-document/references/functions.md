# Functions

## `create`
Creates a new ITextDocument literal from the given uri and content.
```ts
create(uri: string, languageId: string, version: number, content: string): TextDocument
```
**Parameters:**
- `uri: string` — The document's uri.
- `languageId: string` — The document's language Id.
- `version: number` — The document's version.
- `content: string` — The document's content.
**Returns:** `TextDocument`

## `is`
Checks whether the given literal conforms to the ITextDocument interface.
```ts
is(value: any): value is TextDocument
```
**Parameters:**
- `value: any` — 
**Returns:** `value is TextDocument`

## `applyEdits`
```ts
applyEdits(document: TextDocument, edits: TextEdit[]): string
```
**Parameters:**
- `document: TextDocument` — 
- `edits: TextEdit[]` — 
**Returns:** `string`
