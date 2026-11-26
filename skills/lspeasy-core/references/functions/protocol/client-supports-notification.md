# Functions

## protocol

### `clientSupportsNotification`
Type-guarding predicate that narrows `capabilities` to include the specific client capability key required for the given server-to-client notification method.
```ts
clientSupportsNotification<M, T>(method: M, capabilities: T): capabilities is T & ConditionalSimplifyDeep<UnionToIntersection<{ [Path in "window.showMessage" | "textDocument.publishDiagnostics"]: PickDeepObjectKey<ClientCapabilities, FirstKey<Path>, UnwrapPathBrand<ClientCapabilityForNotification<M>>> }[UnwrapPathBrand<ClientCapabilityForNotification<M>>]>, NonRecursiveType | UnknownMap | UnknownSet | WeakMap<WeakKey, unknown> | WeakSet<WeakKey>, object>
```
**Parameters:**
- `method: M` — The LSP notification method string (e.g. `'window/logMessage'`).
- `capabilities: T` — The `ClientCapabilities` object to test.
**Returns:** `capabilities is T & ConditionalSimplifyDeep<UnionToIntersection<{ [Path in "window.showMessage" | "textDocument.publishDiagnostics"]: PickDeepObjectKey<ClientCapabilities, FirstKey<Path>, UnwrapPathBrand<ClientCapabilityForNotification<M>>> }[UnwrapPathBrand<ClientCapabilityForNotification<M>>]>, NonRecursiveType | UnknownMap | UnknownSet | WeakMap<WeakKey, unknown> | WeakSet<WeakKey>, object>` — `true` when the client has declared support for the method.
