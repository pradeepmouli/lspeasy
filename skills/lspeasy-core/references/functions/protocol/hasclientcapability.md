# Functions

## protocol

### `hasClientCapability`
Type-guarding predicate that narrows `capabilities` to confirm a specific client capability
is enabled at a deep dot-notation path.
```ts
hasClientCapability<K, T>(capabilities: T, capability: K): capabilities is T & { [KeyType in string | number | symbol]: UnionToIntersection<{ [P in InternalPaths<Required<ClientCapabilities>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0>]: { [KeyType in string | number | symbol]: PickDeepObject<ClientCapabilities, P>[KeyType] } }[K]>[KeyType] }
```
**Parameters:**
- `capabilities: T` — The client capabilities to check.
- `capability: K` — Dot-notation path of the capability (e.g. `'window.workDoneProgress'`).
**Returns:** `capabilities is T & { [KeyType in string | number | symbol]: UnionToIntersection<{ [P in InternalPaths<Required<ClientCapabilities>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0>]: { [KeyType in string | number | symbol]: PickDeepObject<ClientCapabilities, P>[KeyType] } }[K]>[KeyType] }` — `true` when the capability at the given path is truthy.
