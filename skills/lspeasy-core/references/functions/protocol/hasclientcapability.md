# Functions

## protocol

### `hasClientCapability`
Check if a client capability is enabled
```ts
hasClientCapability<K, T>(capabilities: T, capability: K): capabilities is T & { [KeyType in string | number | symbol]: UnionToIntersection<{ [P in InternalPaths<Required<ClientCapabilities>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0>]: { [KeyType in string | number | symbol]: PickDeepObject<ClientCapabilities, P>[KeyType] } }[K]>[KeyType] }
```
**Parameters:**
- `capabilities: T`
- `capability: K`
**Returns:** `capabilities is T & { [KeyType in string | number | symbol]: UnionToIntersection<{ [P in InternalPaths<Required<ClientCapabilities>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0>]: { [KeyType in string | number | symbol]: PickDeepObject<ClientCapabilities, P>[KeyType] } }[K]>[KeyType] }`
