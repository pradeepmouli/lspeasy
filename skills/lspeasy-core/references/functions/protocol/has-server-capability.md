# Functions

## protocol

### `hasServerCapability`
Type-guarding predicate that narrows `capabilities` to confirm a specific server capability is enabled at a deep dot-notation path.
```ts
hasServerCapability<K, T>(capabilities: T, capability: K): capabilities is T & ConditionalSimplifyDeep<UnionToIntersection<{ [Path in InternalPaths<ServerCapabilities, { maxRecursionDepth: 5; maxCircularDepth: number; bracketNotation: false; leavesOnly: false; depth: number; recurseIntoArrays: true; requiredOnly: false; valueType: unknown }, 0, [], never>]: PickDeepObjectKey<ServerCapabilities, FirstKey<Path>, UnwrapPathBrand<K>> }[UnwrapPathBrand<K>]>, NonRecursiveType | UnknownMap | UnknownSet | WeakMap<WeakKey, unknown> | WeakSet<WeakKey>, object>
```
**Parameters:**
- `capabilities: T` — The server capabilities to check.
- `capability: K` — Dot-notation path of the capability (e.g. `'hoverProvider'`).
**Returns:** `capabilities is T & ConditionalSimplifyDeep<UnionToIntersection<{ [Path in InternalPaths<ServerCapabilities, { maxRecursionDepth: 5; maxCircularDepth: number; bracketNotation: false; leavesOnly: false; depth: number; recurseIntoArrays: true; requiredOnly: false; valueType: unknown }, 0, [], never>]: PickDeepObjectKey<ServerCapabilities, FirstKey<Path>, UnwrapPathBrand<K>> }[UnwrapPathBrand<K>]>, NonRecursiveType | UnknownMap | UnknownSet | WeakMap<WeakKey, unknown> | WeakSet<WeakKey>, object>` — `true` when the capability at the given path is truthy.
