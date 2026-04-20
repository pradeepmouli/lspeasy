# Functions

## protocol

### `clientSupportsRequest`
Type-guarding predicate that narrows `capabilities` to include the specific
client capability key required for the given server-to-client request method.
```ts
clientSupportsRequest<M, T>(method: M, capabilities: T): capabilities is T & { [KeyType in string | number | symbol]: UnionToIntersection<{ [P in "window.workDoneProgress" | "window.showDocument.support" | "window.showMessage" | "workspace.workspaceFolders" | "workspace.configuration" | "workspace.semanticTokens.refreshSupport" | "workspace.inlineValue.refreshSupport" | "workspace.inlayHint.refreshSupport" | "workspace.diagnostics.refreshSupport" | "workspace.codeLens" | "workspace.applyEdit"]: { [KeyType in string | number | symbol]: PickDeepObject<ClientCapabilities, P>[KeyType] } }[ClientCapabilityForRequest<M>]>[KeyType] }
```
**Parameters:**
- `method: M` — The LSP request method string (e.g. `'client/registerCapability'`).
- `capabilities: T` — The `ClientCapabilities` object to test.
**Returns:** `capabilities is T & { [KeyType in string | number | symbol]: UnionToIntersection<{ [P in "window.workDoneProgress" | "window.showDocument.support" | "window.showMessage" | "workspace.workspaceFolders" | "workspace.configuration" | "workspace.semanticTokens.refreshSupport" | "workspace.inlineValue.refreshSupport" | "workspace.inlayHint.refreshSupport" | "workspace.diagnostics.refreshSupport" | "workspace.codeLens" | "workspace.applyEdit"]: { [KeyType in string | number | symbol]: PickDeepObject<ClientCapabilities, P>[KeyType] } }[ClientCapabilityForRequest<M>]>[KeyType] }` — `true` when the client has declared support for the method.
