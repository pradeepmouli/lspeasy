# Functions

## protocol

### `clientSupportsRequest`
Check if a method is supported by the given client capabilities
```ts
clientSupportsRequest<M, T>(method: M, capabilities: T): capabilities is T & { [KeyType in string | number | symbol]: UnionToIntersection<{ [P in "window.workDoneProgress" | "window.showDocument.support" | "window.showMessage" | "workspace.workspaceFolders" | "workspace.configuration" | "workspace.semanticTokens.refreshSupport" | "workspace.inlineValue.refreshSupport" | "workspace.inlayHint.refreshSupport" | "workspace.diagnostics.refreshSupport" | "workspace.codeLens" | "workspace.applyEdit"]: { [KeyType in string | number | symbol]: PickDeepObject<ClientCapabilities, P>[KeyType] } }[ClientCapabilityForRequest<M>]>[KeyType] }
```
**Parameters:**
- `method: M`
- `capabilities: T`
**Returns:** `capabilities is T & { [KeyType in string | number | symbol]: UnionToIntersection<{ [P in "window.workDoneProgress" | "window.showDocument.support" | "window.showMessage" | "workspace.workspaceFolders" | "workspace.configuration" | "workspace.semanticTokens.refreshSupport" | "workspace.inlineValue.refreshSupport" | "workspace.inlayHint.refreshSupport" | "workspace.diagnostics.refreshSupport" | "workspace.codeLens" | "workspace.applyEdit"]: { [KeyType in string | number | symbol]: PickDeepObject<ClientCapabilities, P>[KeyType] } }[ClientCapabilityForRequest<M>]>[KeyType] }`
