[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / serverSupportsRequest

# Function: serverSupportsRequest()

> **serverSupportsRequest**\<`M`\>(`method`, `capabilities`): capabilities is ServerCapabilities\<any\> & \{ \[KeyType in string \| number \| symbol\]: UnionToIntersection\<\{ \[P in "textDocumentSync.willSaveWaitUntil" \| "completionProvider" \| "completionProvider.resolveProvider" \| "hoverProvider" \| "signatureHelpProvider" \| "definitionProvider" \| "referencesProvider" \| "documentHighlightProvider" \| "documentSymbolProvider" \| "codeActionProvider" \| "codeActionProvider.resolveProvider" \| "workspaceSymbolProvider" \| "workspaceSymbolProvider.resolveProvider" \| "codeLensProvider" \| "codeLensProvider.resolveProvider" \| "documentLinkProvider" \| "documentLinkProvider.resolveProvider" \| "documentFormattingProvider" \| "documentRangeFormattingProvider" \| "documentOnTypeFormattingProvider" \| "renameProvider" \| "renameProvider.prepareProvider" \| "executeCommandProvider" \| "inlayHintProvider.resolveProvider" \| "inlayHintProvider" \| "implementationProvider" \| "typeDefinitionProvider" \| "colorProvider" \| "foldingRangeProvider" \| "declarationProvider" \| "selectionRangeProvider" \| "callHierarchyProvider" \| "semanticTokensProvider" \| "semanticTokensProvider.full.delta" \| "semanticTokensProvider.range" \| "linkedEditingRangeProvider" \| "monikerProvider" \| "typeHierarchyProvider" \| "inlineValueProvider" \| "diagnosticProvider" \| "workspace.fileOperations.willCreate" \| "workspace.fileOperations.willRename" \| "workspace.fileOperations.willDelete" \| "diagnosticProvider.workspaceDiagnostics"\]: \{ \[KeyType in string \| number \| symbol\]: PickDeepObject\<ServerCapabilities\<any\>, P\>\[KeyType\] \} \}\[ServerCapabilityForRequest\<M\>\]\>\[KeyType\] \}

Defined in: [packages/core/src/protocol/capabilities.ts:71](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/protocol/capabilities.ts#L71)

Check if a method is supported by the given server capabilities

## Type Parameters

### M

`M` *extends* `"initialize"` \| `"shutdown"` \| `"textDocument/willSaveWaitUntil"` \| `"textDocument/completion"` \| `"completionItem/resolve"` \| `"textDocument/hover"` \| `"textDocument/signatureHelp"` \| `"textDocument/definition"` \| `"textDocument/references"` \| `"textDocument/documentHighlight"` \| `"textDocument/documentSymbol"` \| `"textDocument/codeAction"` \| `"codeAction/resolve"` \| `"workspace/symbol"` \| `"workspaceSymbol/resolve"` \| `"textDocument/codeLens"` \| `"codeLens/resolve"` \| `"textDocument/documentLink"` \| `"documentLink/resolve"` \| `"textDocument/formatting"` \| `"textDocument/rangeFormatting"` \| `"textDocument/onTypeFormatting"` \| `"textDocument/rename"` \| `"textDocument/prepareRename"` \| `"workspace/executeCommand"` \| `"callHierarchy/incomingCalls"` \| `"callHierarchy/outgoingCalls"` \| `"inlayHint/resolve"` \| `"textDocument/inlayHint"` \| `"textDocument/implementation"` \| `"textDocument/typeDefinition"` \| `"textDocument/documentColor"` \| `"textDocument/colorPresentation"` \| `"textDocument/foldingRange"` \| `"textDocument/declaration"` \| `"textDocument/selectionRange"` \| `"textDocument/prepareCallHierarchy"` \| `"textDocument/semanticTokens/full"` \| `"textDocument/semanticTokens/full/delta"` \| `"textDocument/semanticTokens/range"` \| `"textDocument/linkedEditingRange"` \| `"textDocument/moniker"` \| `"textDocument/prepareTypeHierarchy"` \| `"textDocument/inlineValue"` \| `"textDocument/diagnostic"` \| `"typeHierarchy/supertypes"` \| `"typeHierarchy/subtypes"` \| `"workspace/willCreateFiles"` \| `"workspace/willRenameFiles"` \| `"workspace/willDeleteFiles"` \| `"workspace/diagnostic"`

## Parameters

### method

`M`

### capabilities

[`ServerCapabilities`](../interfaces/ServerCapabilities.md)

## Returns

capabilities is ServerCapabilities\<any\> & \{ \[KeyType in string \| number \| symbol\]: UnionToIntersection\<\{ \[P in "textDocumentSync.willSaveWaitUntil" \| "completionProvider" \| "completionProvider.resolveProvider" \| "hoverProvider" \| "signatureHelpProvider" \| "definitionProvider" \| "referencesProvider" \| "documentHighlightProvider" \| "documentSymbolProvider" \| "codeActionProvider" \| "codeActionProvider.resolveProvider" \| "workspaceSymbolProvider" \| "workspaceSymbolProvider.resolveProvider" \| "codeLensProvider" \| "codeLensProvider.resolveProvider" \| "documentLinkProvider" \| "documentLinkProvider.resolveProvider" \| "documentFormattingProvider" \| "documentRangeFormattingProvider" \| "documentOnTypeFormattingProvider" \| "renameProvider" \| "renameProvider.prepareProvider" \| "executeCommandProvider" \| "inlayHintProvider.resolveProvider" \| "inlayHintProvider" \| "implementationProvider" \| "typeDefinitionProvider" \| "colorProvider" \| "foldingRangeProvider" \| "declarationProvider" \| "selectionRangeProvider" \| "callHierarchyProvider" \| "semanticTokensProvider" \| "semanticTokensProvider.full.delta" \| "semanticTokensProvider.range" \| "linkedEditingRangeProvider" \| "monikerProvider" \| "typeHierarchyProvider" \| "inlineValueProvider" \| "diagnosticProvider" \| "workspace.fileOperations.willCreate" \| "workspace.fileOperations.willRename" \| "workspace.fileOperations.willDelete" \| "diagnosticProvider.workspaceDiagnostics"\]: \{ \[KeyType in string \| number \| symbol\]: PickDeepObject\<ServerCapabilities\<any\>, P\>\[KeyType\] \} \}\[ServerCapabilityForRequest\<M\>\]\>\[KeyType\] \}
