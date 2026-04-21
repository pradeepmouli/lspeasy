# Functions

## protocol

### `hasServerCapability`
Type-guarding predicate that narrows `capabilities` to confirm a specific server capability
is enabled at a deep dot-notation path.
```ts
hasServerCapability<K, T>(capabilities: T, capability: K): capabilities is T & ConditionalSimplifyDeep<UnionToIntersection<{ [P in InternalPaths<Required<ServerCapabilities<any>>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0>]: { [KeyType in string | number | symbol]: PickDeepObject<ServerCapabilities<any>, P>[KeyType] } }[K]>, NonRecursiveType | ReadonlyMap<unknown, unknown> | WeakMap<WeakKey, unknown> | ReadonlySet<unknown> | WeakSet<WeakKey>, object>
```
**Parameters:**
- `capabilities: T` — The server capabilities to check.
- `capability: K` — Dot-notation path of the capability (e.g. `'hoverProvider'`).
**Returns:** `capabilities is T & ConditionalSimplifyDeep<UnionToIntersection<{ [P in InternalPaths<Required<ServerCapabilities<any>>, { maxRecursionDepth: 5; bracketNotation: false; leavesOnly: false; depth: number }, 0>]: { [KeyType in string | number | symbol]: PickDeepObject<ServerCapabilities<any>, P>[KeyType] } }[K]>, NonRecursiveType | ReadonlyMap<unknown, unknown> | WeakMap<WeakKey, unknown> | ReadonlySet<unknown> | WeakSet<WeakKey>, object>` — `true` when the capability at the given path is truthy.
