[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / getCapabilityForRequestMethod

# Function: getCapabilityForRequestMethod()

> **getCapabilityForRequestMethod**\<`M`, `D`\>(`method`, `_direction?`): `InternalPaths`\<`Required`\<[`ServerCapabilities`](../interfaces/ServerCapabilities.md)\<`any`\>\>, \{ `bracketNotation`: `false`; `depth`: `number`; `leavesOnly`: `false`; `maxRecursionDepth`: `5`; \}, `0`\> \| `"alwaysOn"`

Defined in: [packages/core/src/protocol/infer.ts:167](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/infer.ts#L167)

Get the capability key for a given method at runtime

## Type Parameters

### M

`M` *extends* `"client/registerCapability"` \| `"client/unregisterCapability"` \| `"initialize"` \| `"shutdown"` \| `"window/showMessageRequest"` \| `"textDocument/willSaveWaitUntil"` \| `"textDocument/completion"` \| `"completionItem/resolve"` \| `"textDocument/hover"` \| `"textDocument/signatureHelp"` \| `"textDocument/definition"` \| `"textDocument/references"` \| `"textDocument/documentHighlight"` \| `"textDocument/documentSymbol"` \| `"textDocument/codeAction"` \| `"codeAction/resolve"` \| `"workspace/symbol"` \| `"workspaceSymbol/resolve"` \| `"textDocument/codeLens"` \| `"codeLens/resolve"` \| `"workspace/codeLens/refresh"` \| `"textDocument/documentLink"` \| `"documentLink/resolve"` \| `"textDocument/formatting"` \| `"textDocument/rangeFormatting"` \| `"textDocument/onTypeFormatting"` \| `"textDocument/rename"` \| `"textDocument/prepareRename"` \| `"workspace/executeCommand"` \| `"workspace/applyEdit"` \| `"callHierarchy/incomingCalls"` \| `"callHierarchy/outgoingCalls"` \| `"inlayHint/resolve"` \| `"textDocument/inlayHint"` \| `"textDocument/implementation"` \| `"textDocument/typeDefinition"` \| `"textDocument/documentColor"` \| `"textDocument/colorPresentation"` \| `"textDocument/foldingRange"` \| `"textDocument/declaration"` \| `"textDocument/selectionRange"` \| `"textDocument/prepareCallHierarchy"` \| `"textDocument/semanticTokens/full"` \| `"textDocument/semanticTokens/full/delta"` \| `"textDocument/semanticTokens/range"` \| `"textDocument/linkedEditingRange"` \| `"textDocument/moniker"` \| `"textDocument/prepareTypeHierarchy"` \| `"textDocument/inlineValue"` \| `"textDocument/diagnostic"` \| `"typeHierarchy/supertypes"` \| `"typeHierarchy/subtypes"` \| `"window/workDoneProgress/create"` \| `"window/showDocument"` \| `"workspace/willCreateFiles"` \| `"workspace/willRenameFiles"` \| `"workspace/willDeleteFiles"` \| `"workspace/diagnostic"` \| `"workspace/workspaceFolders"` \| `"workspace/configuration"` \| `"workspace/semanticTokens/refresh"` \| `"workspace/inlineValue/refresh"` \| `"workspace/inlayHint/refresh"` \| `"workspace/diagnostic/refresh"`

### D

`D` *extends* `"both"` \| `"clientToServer"` \| `"serverToClient"` = `"both"`

## Parameters

### method

`M`

### \_direction?

`D` = `...`

## Returns

`InternalPaths`\<`Required`\<[`ServerCapabilities`](../interfaces/ServerCapabilities.md)\<`any`\>\>, \{ `bracketNotation`: `false`; `depth`: `number`; `leavesOnly`: `false`; `maxRecursionDepth`: `5`; \}, `0`\> \| `"alwaysOn"`
