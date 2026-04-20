# Functions

## protocol

### `getClientCapabilityForRequestMethod`
Get the client capability key for a given request method at runtime
```ts
getClientCapabilityForRequestMethod<M, D>(method: M, _direction: D): "alwaysOn" | InternalPaths<Required<ClientCapabilities>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0>
```
**Parameters:**
- `method: M`
- `_direction: D` — default: `...`
**Returns:** `"alwaysOn" | InternalPaths<Required<ClientCapabilities>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0>`
