# Functions

## protocol

### `getCapabilityForRequestMethod`
Get the server capability key for a given request method at runtime.
```ts
getCapabilityForRequestMethod<M, D>(method: M, _direction: D): InternalPaths<ServerCapabilities, { maxRecursionDepth: 5; maxCircularDepth: number; bracketNotation: false; leavesOnly: false; depth: number; recurseIntoArrays: true; requiredOnly: false; valueType: unknown }, 0, [], never> | "alwaysOn"
```
**Parameters:**
- `method: M` — The LSP request method string to look up.
- `_direction: D` — default: `...` — Optional direction filter (currently unused).
**Returns:** `InternalPaths<ServerCapabilities, { maxRecursionDepth: 5; maxCircularDepth: number; bracketNotation: false; leavesOnly: false; depth: number; recurseIntoArrays: true; requiredOnly: false; valueType: unknown }, 0, [], never> | "alwaysOn"` — The dot-notation capability path, or `'alwaysOn'` if no capability gate exists.
