# Functions

## `create`
Creates a LocationLink literal.
```ts
create(targetUri: string, targetRange: Range, targetSelectionRange: Range, originSelectionRange?: Range): LocationLink
```
**Parameters:**
- `targetUri: string` — The definition's uri.
- `targetRange: Range` — The full range of the definition.
- `targetSelectionRange: Range` — The span of the symbol definition at the target.
- `originSelectionRange: Range` (optional) — The span of the symbol being defined in the originating source file.
**Returns:** `LocationLink`

## `is`
Checks whether the given literal conforms to the LocationLink interface.
```ts
is(value: any): value is LocationLink
```
**Parameters:**
- `value: any` — 
**Returns:** `value is LocationLink`
