# Functions

## protocol

### `hasServerCapability`
Check if a server capability is enabled
```ts
hasServerCapability<K, T>(capabilities: T, capability: K): capabilities is T & { [KeyType in string | number | symbol]: UnionToIntersection<{ [P in InternalPaths<Required<ServerCapabilities<any>>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0>]: { [KeyType in string | number | symbol]: PickDeepObject<ServerCapabilities<any>, P>[KeyType] } }[K]>[KeyType] }
```
**Parameters:**
- `capabilities: T`
- `capability: K`
**Returns:** `capabilities is T & { [KeyType in string | number | symbol]: UnionToIntersection<{ [P in InternalPaths<Required<ServerCapabilities<any>>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0>]: { [KeyType in string | number | symbol]: PickDeepObject<ServerCapabilities<any>, P>[KeyType] } }[K]>[KeyType] }`
