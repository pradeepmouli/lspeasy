[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / serverSupportsNotification

# Function: serverSupportsNotification()

> **serverSupportsNotification**\<`M`, `T`\>(`method`, `capabilities`): capabilities is T & \{ \[KeyType in string \| number \| symbol\]: UnionToIntersection\<\{ \[P in "textDocumentSync" \| "textDocumentSync.openClose" \| "textDocumentSync.willSave" \| "textDocumentSync.save" \| "workspace.workspaceFolders.changeNotifications" \| "workspace.fileOperations.didCreate" \| "workspace.fileOperations.didRename" \| "workspace.fileOperations.didDelete"\]: \{ \[KeyType in string \| number \| symbol\]: PickDeepObject\<ServerCapabilities\<any\>, P\>\[KeyType\] \} \}\[ServerCapabilityForNotification\<M\>\]\>\[KeyType\] \}

Defined in: [packages/core/src/protocol/capabilities.ts:84](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/protocol/capabilities.ts#L84)

## Type Parameters

### M

`M` *extends* `"initialized"` \| `"exit"` \| `"workspace/didChangeConfiguration"` \| `"textDocument/didOpen"` \| `"textDocument/didChange"` \| `"textDocument/didClose"` \| `"textDocument/didSave"` \| `"textDocument/willSave"` \| `"workspace/didChangeWatchedFiles"` \| `"window/workDoneProgress/cancel"` \| `"workspace/didChangeWorkspaceFolders"` \| `"workspace/didCreateFiles"` \| `"workspace/didRenameFiles"` \| `"workspace/didDeleteFiles"` \| `"$/cancelRequest"` \| `"$/progress"` \| `"$/setTrace"` \| `"notebookDocument/didOpen"` \| `"notebookDocument/didChange"` \| `"notebookDocument/didSave"` \| `"notebookDocument/didClose"`

### T

`T` *extends* `Partial`\<[`ServerCapabilities`](../interfaces/ServerCapabilities.md)\<`any`\>\>

## Parameters

### method

`M`

### capabilities

`T`

## Returns

capabilities is T & \{ \[KeyType in string \| number \| symbol\]: UnionToIntersection\<\{ \[P in "textDocumentSync" \| "textDocumentSync.openClose" \| "textDocumentSync.willSave" \| "textDocumentSync.save" \| "workspace.workspaceFolders.changeNotifications" \| "workspace.fileOperations.didCreate" \| "workspace.fileOperations.didRename" \| "workspace.fileOperations.didDelete"\]: \{ \[KeyType in string \| number \| symbol\]: PickDeepObject\<ServerCapabilities\<any\>, P\>\[KeyType\] \} \}\[ServerCapabilityForNotification\<M\>\]\>\[KeyType\] \}
