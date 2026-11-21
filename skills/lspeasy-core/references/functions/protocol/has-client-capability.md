# Functions

## protocol

### `hasClientCapability`
Type-guarding predicate that narrows `capabilities` to confirm a specific client capability is enabled at a deep dot-notation path.
```ts
hasClientCapability<K, T>(capabilities: T, capability: K): capabilities is T & ConditionalSimplifyDeep<UnionToIntersection<{ [Path in InternalPaths<ClientCapabilities, { maxRecursionDepth: 5; maxCircularDepth: number; bracketNotation: false; leavesOnly: false; depth: number; recurseIntoArrays: true; requiredOnly: false; valueType: unknown }, 0, [], never>]: PickDeepObjectKey<ClientCapabilities, FirstKey<Path>, UnwrapPathBrand<K>> }[UnwrapPathBrand<K>]>, NonRecursiveType | UnknownMap | UnknownSet | WeakMap<WeakKey, unknown> | WeakSet<WeakKey>, object>
```
**Parameters:**
- `capabilities: T` — The client capabilities to check.
- `capability: K` — Dot-notation path of the capability (e.g. `'window.workDoneProgress'`).
**Returns:** `capabilities is T & ConditionalSimplifyDeep<UnionToIntersection<{ [Path in InternalPaths<ClientCapabilities, { maxRecursionDepth: 5; maxCircularDepth: number; bracketNotation: false; leavesOnly: false; depth: number; recurseIntoArrays: true; requiredOnly: false; valueType: unknown }, 0, [], never>]: PickDeepObjectKey<ClientCapabilities, FirstKey<Path>, UnwrapPathBrand<K>> }[UnwrapPathBrand<K>]>, NonRecursiveType | UnknownMap | UnknownSet | WeakMap<WeakKey, unknown> | WeakSet<WeakKey>, object>` — `true` when the capability at the given path is truthy.
