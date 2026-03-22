# Functions

## `create`
Creates a new symbol information literal.
```ts
create(name: string, kind: SymbolKind, range: Range, uri: string, containerName?: string): SymbolInformation
```
**Parameters:**
- `name: string` — The name of the symbol.
- `kind: SymbolKind` — The kind of the symbol.
- `range: Range` — The range of the location of the symbol.
- `uri: string` — The resource of the location of symbol.
- `containerName: string` (optional) — The name of the symbol containing the symbol.
**Returns:** `SymbolInformation`
