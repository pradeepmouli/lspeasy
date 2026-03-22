# Functions

## `create`
Create a new workspace symbol.
```ts
create(name: string, kind: SymbolKind, uri: string, range?: Range): WorkspaceSymbol
```
**Parameters:**
- `name: string` — The name of the symbol.
- `kind: SymbolKind` — The kind of the symbol.
- `uri: string` — The resource of the location of the symbol.
- `range: Range` (optional) — An options range of the location.
**Returns:** `WorkspaceSymbol`
