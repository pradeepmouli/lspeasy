# Functions

## protocol

### `getClientCapabilityForNotificationMethod`
Get the client capability key for a given notification method at runtime.
```ts
getClientCapabilityForNotificationMethod<M, D>(method: M, _direction: D): "alwaysOn" | InternalPaths<Required<ClientCapabilities>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0>
```
**Parameters:**
- `method: M` — The LSP notification method string to look up.
- `_direction: D` — default: `...` — Optional direction filter (currently unused).
**Returns:** `"alwaysOn" | InternalPaths<Required<ClientCapabilities>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0>` — The dot-notation capability path, or `'alwaysOn'` if no capability gate exists.
