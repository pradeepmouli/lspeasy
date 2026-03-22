# Functions

## `create`
Creates a new symbol information literal.
```ts
create(name: string, detail: string | undefined, kind: SymbolKind, range: Range, selectionRange: Range, children?: DocumentSymbol[]): DocumentSymbol
```
**Parameters:**
- `name: string` — The name of the symbol.
- `detail: string | undefined` — The detail of the symbol.
- `kind: SymbolKind` — The kind of the symbol.
- `range: Range` — The range of the symbol.
- `selectionRange: Range` — The selectionRange of the symbol.
- `children: DocumentSymbol[]` (optional) — Children of the symbol.
**Returns:** `DocumentSymbol`

## `is`
Checks whether the given literal conforms to the DocumentSymbol interface.
```ts
is(value: any): value is DocumentSymbol
```
**Parameters:**
- `value: any` — 
**Returns:** `value is DocumentSymbol`
