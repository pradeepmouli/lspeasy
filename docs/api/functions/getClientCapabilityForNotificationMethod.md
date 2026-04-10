[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / getClientCapabilityForNotificationMethod

# Function: getClientCapabilityForNotificationMethod()

> **getClientCapabilityForNotificationMethod**\<`M`, `D`\>(`method`, `_direction?`): `"alwaysOn"` \| `InternalPaths`\<`Required`\<[`ClientCapabilities`](../interfaces/ClientCapabilities.md)\>, \{ `bracketNotation`: `false`; `depth`: `number`; `leavesOnly`: `false`; `maxRecursionDepth`: `5`; \}, `0`\>

Defined in: [packages/core/src/protocol/infer.ts:200](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/infer.ts#L200)

Get the client capability key for a given notification method at runtime

## Type Parameters

### M

`M` *extends* `"initialized"` \| `"exit"` \| `"workspace/didChangeConfiguration"` \| `"window/showMessage"` \| `"window/logMessage"` \| `"telemetry/event"` \| `"textDocument/didOpen"` \| `"textDocument/didChange"` \| `"textDocument/didClose"` \| `"textDocument/didSave"` \| `"textDocument/willSave"` \| `"workspace/didChangeWatchedFiles"` \| `"textDocument/publishDiagnostics"` \| `"window/workDoneProgress/cancel"` \| `"workspace/didChangeWorkspaceFolders"` \| `"workspace/didCreateFiles"` \| `"workspace/didRenameFiles"` \| `"workspace/didDeleteFiles"` \| `"$/cancelRequest"` \| `"$/progress"` \| `"$/setTrace"` \| `"$/logTrace"` \| `"notebookDocument/didOpen"` \| `"notebookDocument/didChange"` \| `"notebookDocument/didSave"` \| `"notebookDocument/didClose"`

### D

`D` *extends* `"both"` \| `"clientToServer"` \| `"serverToClient"` = `"both"`

## Parameters

### method

`M`

### \_direction?

`D` = `...`

## Returns

`"alwaysOn"` \| `InternalPaths`\<`Required`\<[`ClientCapabilities`](../interfaces/ClientCapabilities.md)\>, \{ `bracketNotation`: `false`; `depth`: `number`; `leavesOnly`: `false`; `maxRecursionDepth`: `5`; \}, `0`\>
