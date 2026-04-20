# Functions

## protocol

### `getCapabilityForRequestMethod`
Get the capability key for a given method at runtime
```ts
getCapabilityForRequestMethod<M, D>(method: M, _direction: D): InternalPaths<Required<ServerCapabilities<any>>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0> | "alwaysOn"
```
**Parameters:**
- `method: M`
- `_direction: D` — default: `...`
**Returns:** `InternalPaths<Required<ServerCapabilities<any>>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0> | "alwaysOn"`
