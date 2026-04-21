# Functions

## protocol

### `serverSupportsNotification`
Type-guarding predicate that narrows `capabilities` to include the specific
server capability key required for the given client-to-server notification method.
```ts
serverSupportsNotification<M, T>(method: M, capabilities: T): capabilities is T & { [KeyType in string | number | symbol]: UnionToIntersection<{ [P in "textDocumentSync" | "textDocumentSync.openClose" | "textDocumentSync.willSave" | "textDocumentSync.save" | "workspace.workspaceFolders.changeNotifications" | "workspace.fileOperations.didCreate" | "workspace.fileOperations.didRename" | "workspace.fileOperations.didDelete"]: { [KeyType in string | number | symbol]: PickDeepObject<ServerCapabilities<any>, P>[KeyType] } }[ServerCapabilityForNotification<M>]>[KeyType] }
```
**Parameters:**
- `method: M` — The LSP notification method string (e.g. `'textDocument/didOpen'`).
- `capabilities: T` — The `ServerCapabilities` object to test.
**Returns:** `capabilities is T & { [KeyType in string | number | symbol]: UnionToIntersection<{ [P in "textDocumentSync" | "textDocumentSync.openClose" | "textDocumentSync.willSave" | "textDocumentSync.save" | "workspace.workspaceFolders.changeNotifications" | "workspace.fileOperations.didCreate" | "workspace.fileOperations.didRename" | "workspace.fileOperations.didDelete"]: { [KeyType in string | number | symbol]: PickDeepObject<ServerCapabilities<any>, P>[KeyType] } }[ServerCapabilityForNotification<M>]>[KeyType] }` — `true` when the server has declared support for the method.
