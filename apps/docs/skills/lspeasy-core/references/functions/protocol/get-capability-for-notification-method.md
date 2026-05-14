# Functions

## protocol

### `getCapabilityForNotificationMethod`
Get the server capability key for a given notification method at runtime.
```ts
getCapabilityForNotificationMethod<M, D>(method: M, _direction: D): InternalPaths<Required<ServerCapabilities<any>>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0> | "alwaysOn"
```
**Parameters:**
- `method: M` — The LSP notification method string to look up.
- `_direction: D` — default: `...` — Optional direction filter (currently unused).
**Returns:** `InternalPaths<Required<ServerCapabilities<any>>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0> | "alwaysOn"` — The dot-notation capability path, or `'alwaysOn'` if no capability gate exists.
