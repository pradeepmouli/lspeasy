# Functions

## protocol

### `getClientCapabilityForNotificationMethod`
Get the client capability key for a given notification method at runtime
```ts
getClientCapabilityForNotificationMethod<M, D>(method: M, _direction: D): "alwaysOn" | InternalPaths<Required<ClientCapabilities>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0>
```
**Parameters:**
- `method: M`
- `_direction: D` — default: `...`
**Returns:** `"alwaysOn" | InternalPaths<Required<ClientCapabilities>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0>`
