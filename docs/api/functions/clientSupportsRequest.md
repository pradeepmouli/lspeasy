[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / clientSupportsRequest

# Function: clientSupportsRequest()

> **clientSupportsRequest**\<`M`, `T`\>(`method`, `capabilities`): capabilities is T & \{ \[KeyType in string \| number \| symbol\]: UnionToIntersection\<\{ \[P in "window.showMessage" \| "workspace.codeLens" \| "workspace.applyEdit" \| "window.workDoneProgress" \| "window.showDocument.support" \| "workspace.workspaceFolders" \| "workspace.configuration" \| "workspace.semanticTokens.refreshSupport" \| "workspace.inlineValue.refreshSupport" \| "workspace.inlayHint.refreshSupport" \| "workspace.diagnostics.refreshSupport"\]: \{ \[KeyType in string \| number \| symbol\]: PickDeepObject\<ClientCapabilities, P\>\[KeyType\] \} \}\[ClientCapabilityForRequest\<M\>\]\>\[KeyType\] \}

Defined in: [packages/core/src/protocol/capabilities.ts:102](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/capabilities.ts#L102)

Check if a method is supported by the given client capabilities

## Type Parameters

### M

`M` *extends* `"client/registerCapability"` \| `"client/unregisterCapability"` \| `"window/showMessageRequest"` \| `"workspace/codeLens/refresh"` \| `"workspace/applyEdit"` \| `"window/workDoneProgress/create"` \| `"window/showDocument"` \| `"workspace/workspaceFolders"` \| `"workspace/configuration"` \| `"workspace/semanticTokens/refresh"` \| `"workspace/inlineValue/refresh"` \| `"workspace/inlayHint/refresh"` \| `"workspace/diagnostic/refresh"`

### T

`T` *extends* `Partial`\<[`ClientCapabilities`](../interfaces/ClientCapabilities.md)\>

## Parameters

### method

`M`

### capabilities

`T`

## Returns

capabilities is T & \{ \[KeyType in string \| number \| symbol\]: UnionToIntersection\<\{ \[P in "window.showMessage" \| "workspace.codeLens" \| "workspace.applyEdit" \| "window.workDoneProgress" \| "window.showDocument.support" \| "workspace.workspaceFolders" \| "workspace.configuration" \| "workspace.semanticTokens.refreshSupport" \| "workspace.inlineValue.refreshSupport" \| "workspace.inlayHint.refreshSupport" \| "workspace.diagnostics.refreshSupport"\]: \{ \[KeyType in string \| number \| symbol\]: PickDeepObject\<ClientCapabilities, P\>\[KeyType\] \} \}\[ClientCapabilityForRequest\<M\>\]\>\[KeyType\] \}
