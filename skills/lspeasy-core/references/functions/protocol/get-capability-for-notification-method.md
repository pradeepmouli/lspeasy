# Functions

## protocol

### `getCapabilityForNotificationMethod`
Get the server capability key for a given notification method at runtime.
```ts
getCapabilityForNotificationMethod<M, D>(method: M, _direction: D): InternalPaths<ServerCapabilities, { maxRecursionDepth: 5; maxCircularDepth: number; bracketNotation: false; leavesOnly: false; depth: number; recurseIntoArrays: true; requiredOnly: false; valueType: unknown }, 0, [], never> | "alwaysOn"
```
**Parameters:**
- `method: M` — The LSP notification method string to look up.
- `_direction: D` — default: `...` — Optional direction filter (currently unused).
**Returns:** `InternalPaths<ServerCapabilities, { maxRecursionDepth: 5; maxCircularDepth: number; bracketNotation: false; leavesOnly: false; depth: number; recurseIntoArrays: true; requiredOnly: false; valueType: unknown }, 0, [], never> | "alwaysOn"` — The dot-notation capability path, or `'alwaysOn'` if no capability gate exists.
