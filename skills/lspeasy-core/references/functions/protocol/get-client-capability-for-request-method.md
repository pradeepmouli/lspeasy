# Functions

## protocol

### `getClientCapabilityForRequestMethod`
Get the client capability key for a given request method at runtime.
```ts
getClientCapabilityForRequestMethod<M, D>(method: M, _direction: D): "alwaysOn" | InternalPaths<ClientCapabilities, { maxRecursionDepth: 5; maxCircularDepth: number; bracketNotation: false; leavesOnly: false; depth: number; recurseIntoArrays: true; requiredOnly: false; valueType: unknown }, 0, [], never>
```
**Parameters:**
- `method: M` — The LSP request method string to look up.
- `_direction: D` — default: `...` — Optional direction filter (currently unused).
**Returns:** `"alwaysOn" | InternalPaths<ClientCapabilities, { maxRecursionDepth: 5; maxCircularDepth: number; bracketNotation: false; leavesOnly: false; depth: number; recurseIntoArrays: true; requiredOnly: false; valueType: unknown }, 0, [], never>` — The dot-notation capability path, or `'alwaysOn'` if no capability gate exists.
