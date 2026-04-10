[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / getClientCapabilityForRequestMethod

# Function: getClientCapabilityForRequestMethod()

> **getClientCapabilityForRequestMethod**\<`M`, `D`\>(`method`, `_direction?`): `"alwaysOn"` \| `InternalPaths`\<`Required`\<[`ClientCapabilities`](../interfaces/ClientCapabilities.md)\>, \{ `bracketNotation`: `false`; `depth`: `number`; `leavesOnly`: `false`; `maxRecursionDepth`: `5`; \}, `0`\>

Defined in: [packages/core/src/protocol/infer.ts:178](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/protocol/infer.ts#L178)

Get the client capability key for a given request method at runtime

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

`"alwaysOn"` \| `InternalPaths`\<`Required`\<[`ClientCapabilities`](../interfaces/ClientCapabilities.md)\>, \{ `bracketNotation`: `false`; `depth`: `number`; `leavesOnly`: `false`; `maxRecursionDepth`: `5`; \}, `0`\>
