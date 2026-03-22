# Functions

## `create`
Creates a new FoldingRange literal.
```ts
create(startLine: number, endLine: number, startCharacter?: number, endCharacter?: number, kind?: string, collapsedText?: string): FoldingRange
```
**Parameters:**
- `startLine: number` — 
- `endLine: number` — 
- `startCharacter: number` (optional) — 
- `endCharacter: number` (optional) — 
- `kind: string` (optional) — 
- `collapsedText: string` (optional) — 
**Returns:** `FoldingRange`

## `is`
Checks whether the given literal conforms to the FoldingRange interface.
```ts
is(value: any): value is FoldingRange
```
**Parameters:**
- `value: any` — 
**Returns:** `value is FoldingRange`
