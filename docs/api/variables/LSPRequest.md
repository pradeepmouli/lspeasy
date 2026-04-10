[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / LSPRequest

# ~~Variable: LSPRequest~~

> **LSPRequest**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:10](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/protocol/namespaces.ts#L10)

LSP Request methods organized by namespace

## Type Declaration

### ~~CallHierarchy~~

> `readonly` **CallHierarchy**: `object`

#### CallHierarchy.IncomingCalls

> `readonly` **IncomingCalls**: `object`

#### CallHierarchy.IncomingCalls.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### CallHierarchy.IncomingCalls.Method

> `readonly` **Method**: `"callHierarchy/incomingCalls"` = `'callHierarchy/incomingCalls'`

#### CallHierarchy.OutgoingCalls

> `readonly` **OutgoingCalls**: `object`

#### CallHierarchy.OutgoingCalls.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### CallHierarchy.OutgoingCalls.Method

> `readonly` **Method**: `"callHierarchy/outgoingCalls"` = `'callHierarchy/outgoingCalls'`

### ~~Client~~

> `readonly` **Client**: `object`

#### Client.Registration

> `readonly` **Registration**: `object`

#### Client.Registration.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Client.Registration.Method

> `readonly` **Method**: `"client/registerCapability"` = `'client/registerCapability'`

#### Client.Unregistration

> `readonly` **Unregistration**: `object`

#### Client.Unregistration.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Client.Unregistration.Method

> `readonly` **Method**: `"client/unregisterCapability"` = `'client/unregisterCapability'`

### ~~CodeAction~~

> `readonly` **CodeAction**: `object`

#### CodeAction.Resolve

> `readonly` **Resolve**: `object`

#### CodeAction.Resolve.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.codeAction.resolveSupport"` = `'textDocument.codeAction.resolveSupport'`

#### CodeAction.Resolve.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### CodeAction.Resolve.Method

> `readonly` **Method**: `"codeAction/resolve"` = `'codeAction/resolve'`

#### CodeAction.Resolve.ServerCapability

> `readonly` **ServerCapability**: `"codeActionProvider.resolveProvider"` = `'codeActionProvider.resolveProvider'`

### ~~CodeLens~~

> `readonly` **CodeLens**: `object`

#### CodeLens.Resolve

> `readonly` **Resolve**: `object`

#### CodeLens.Resolve.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.codeLens.resolveSupport"` = `'textDocument.codeLens.resolveSupport'`

#### CodeLens.Resolve.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### CodeLens.Resolve.Method

> `readonly` **Method**: `"codeLens/resolve"` = `'codeLens/resolve'`

#### CodeLens.Resolve.ServerCapability

> `readonly` **ServerCapability**: `"codeLensProvider.resolveProvider"` = `'codeLensProvider.resolveProvider'`

### ~~CompletionItem~~

> `readonly` **CompletionItem**: `object`

#### CompletionItem.CompletionResolve

> `readonly` **CompletionResolve**: `object`

#### CompletionItem.CompletionResolve.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.completion.completionItem.resolveSupport"` = `'textDocument.completion.completionItem.resolveSupport'`

#### CompletionItem.CompletionResolve.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### CompletionItem.CompletionResolve.Method

> `readonly` **Method**: `"completionItem/resolve"` = `'completionItem/resolve'`

#### CompletionItem.CompletionResolve.ServerCapability

> `readonly` **ServerCapability**: `"completionProvider.resolveProvider"` = `'completionProvider.resolveProvider'`

### ~~DocumentLink~~

> `readonly` **DocumentLink**: `object`

#### DocumentLink.Resolve

> `readonly` **Resolve**: `object`

#### DocumentLink.Resolve.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.documentLink"` = `'textDocument.documentLink'`

#### DocumentLink.Resolve.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### DocumentLink.Resolve.Method

> `readonly` **Method**: `"documentLink/resolve"` = `'documentLink/resolve'`

#### DocumentLink.Resolve.ServerCapability

> `readonly` **ServerCapability**: `"documentLinkProvider.resolveProvider"` = `'documentLinkProvider.resolveProvider'`

### ~~InlayHint~~

> `readonly` **InlayHint**: `object`

#### InlayHint.Resolve

> `readonly` **Resolve**: `object`

#### InlayHint.Resolve.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.inlayHint.resolveSupport"` = `'textDocument.inlayHint.resolveSupport'`

#### InlayHint.Resolve.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### InlayHint.Resolve.Method

> `readonly` **Method**: `"inlayHint/resolve"` = `'inlayHint/resolve'`

#### InlayHint.Resolve.ServerCapability

> `readonly` **ServerCapability**: `"inlayHintProvider.resolveProvider"` = `'inlayHintProvider.resolveProvider'`

### ~~Lifecycle~~

> `readonly` **Lifecycle**: `object`

#### Lifecycle.Initialize

> `readonly` **Initialize**: `object`

#### Lifecycle.Initialize.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Lifecycle.Initialize.Method

> `readonly` **Method**: `"initialize"` = `'initialize'`

#### Lifecycle.Shutdown

> `readonly` **Shutdown**: `object`

#### Lifecycle.Shutdown.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Lifecycle.Shutdown.Method

> `readonly` **Method**: `"shutdown"` = `'shutdown'`

### ~~TextDocument~~

> `readonly` **TextDocument**: `object`

#### TextDocument.CallHierarchyPrepare

> `readonly` **CallHierarchyPrepare**: `object`

#### TextDocument.CallHierarchyPrepare.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.callHierarchy"` = `'textDocument.callHierarchy'`

#### TextDocument.CallHierarchyPrepare.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.CallHierarchyPrepare.Method

> `readonly` **Method**: `"textDocument/prepareCallHierarchy"` = `'textDocument/prepareCallHierarchy'`

#### TextDocument.CallHierarchyPrepare.ServerCapability

> `readonly` **ServerCapability**: `"callHierarchyProvider"` = `'callHierarchyProvider'`

#### TextDocument.CodeAction

> `readonly` **CodeAction**: `object`

#### TextDocument.CodeAction.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.codeAction"` = `'textDocument.codeAction'`

#### TextDocument.CodeAction.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.CodeAction.Method

> `readonly` **Method**: `"textDocument/codeAction"` = `'textDocument/codeAction'`

#### TextDocument.CodeAction.ServerCapability

> `readonly` **ServerCapability**: `"codeActionProvider"` = `'codeActionProvider'`

#### TextDocument.CodeLens

> `readonly` **CodeLens**: `object`

#### TextDocument.CodeLens.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.codeLens"` = `'textDocument.codeLens'`

#### TextDocument.CodeLens.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.CodeLens.Method

> `readonly` **Method**: `"textDocument/codeLens"` = `'textDocument/codeLens'`

#### TextDocument.CodeLens.ServerCapability

> `readonly` **ServerCapability**: `"codeLensProvider"` = `'codeLensProvider'`

#### TextDocument.ColorPresentation

> `readonly` **ColorPresentation**: `object`

#### TextDocument.ColorPresentation.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.colorProvider"` = `'textDocument.colorProvider'`

#### TextDocument.ColorPresentation.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.ColorPresentation.Method

> `readonly` **Method**: `"textDocument/colorPresentation"` = `'textDocument/colorPresentation'`

#### TextDocument.ColorPresentation.ServerCapability

> `readonly` **ServerCapability**: `"colorProvider"` = `'colorProvider'`

#### TextDocument.Completion

> `readonly` **Completion**: `object`

#### TextDocument.Completion.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.completion"` = `'textDocument.completion'`

#### TextDocument.Completion.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.Completion.Method

> `readonly` **Method**: `"textDocument/completion"` = `'textDocument/completion'`

#### TextDocument.Completion.ServerCapability

> `readonly` **ServerCapability**: `"completionProvider"` = `'completionProvider'`

#### TextDocument.Declaration

> `readonly` **Declaration**: `object`

#### TextDocument.Declaration.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.declaration"` = `'textDocument.declaration'`

#### TextDocument.Declaration.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.Declaration.Method

> `readonly` **Method**: `"textDocument/declaration"` = `'textDocument/declaration'`

#### TextDocument.Declaration.ServerCapability

> `readonly` **ServerCapability**: `"declarationProvider"` = `'declarationProvider'`

#### TextDocument.Definition

> `readonly` **Definition**: `object`

#### TextDocument.Definition.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.definition"` = `'textDocument.definition'`

#### TextDocument.Definition.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.Definition.Method

> `readonly` **Method**: `"textDocument/definition"` = `'textDocument/definition'`

#### TextDocument.Definition.ServerCapability

> `readonly` **ServerCapability**: `"definitionProvider"` = `'definitionProvider'`

#### TextDocument.DocumentColor

> `readonly` **DocumentColor**: `object`

#### TextDocument.DocumentColor.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.colorProvider"` = `'textDocument.colorProvider'`

#### TextDocument.DocumentColor.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.DocumentColor.Method

> `readonly` **Method**: `"textDocument/documentColor"` = `'textDocument/documentColor'`

#### TextDocument.DocumentColor.ServerCapability

> `readonly` **ServerCapability**: `"colorProvider"` = `'colorProvider'`

#### TextDocument.DocumentDiagnostic

> `readonly` **DocumentDiagnostic**: `object`

#### TextDocument.DocumentDiagnostic.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.diagnostic"` = `'textDocument.diagnostic'`

#### TextDocument.DocumentDiagnostic.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.DocumentDiagnostic.Method

> `readonly` **Method**: `"textDocument/diagnostic"` = `'textDocument/diagnostic'`

#### TextDocument.DocumentDiagnostic.ServerCapability

> `readonly` **ServerCapability**: `"diagnosticProvider"` = `'diagnosticProvider'`

#### TextDocument.DocumentFormatting

> `readonly` **DocumentFormatting**: `object`

#### TextDocument.DocumentFormatting.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.formatting"` = `'textDocument.formatting'`

#### TextDocument.DocumentFormatting.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.DocumentFormatting.Method

> `readonly` **Method**: `"textDocument/formatting"` = `'textDocument/formatting'`

#### TextDocument.DocumentFormatting.ServerCapability

> `readonly` **ServerCapability**: `"documentFormattingProvider"` = `'documentFormattingProvider'`

#### TextDocument.DocumentHighlight

> `readonly` **DocumentHighlight**: `object`

#### TextDocument.DocumentHighlight.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.documentHighlight"` = `'textDocument.documentHighlight'`

#### TextDocument.DocumentHighlight.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.DocumentHighlight.Method

> `readonly` **Method**: `"textDocument/documentHighlight"` = `'textDocument/documentHighlight'`

#### TextDocument.DocumentHighlight.ServerCapability

> `readonly` **ServerCapability**: `"documentHighlightProvider"` = `'documentHighlightProvider'`

#### TextDocument.DocumentLink

> `readonly` **DocumentLink**: `object`

#### TextDocument.DocumentLink.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.documentLink"` = `'textDocument.documentLink'`

#### TextDocument.DocumentLink.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.DocumentLink.Method

> `readonly` **Method**: `"textDocument/documentLink"` = `'textDocument/documentLink'`

#### TextDocument.DocumentLink.ServerCapability

> `readonly` **ServerCapability**: `"documentLinkProvider"` = `'documentLinkProvider'`

#### TextDocument.DocumentOnTypeFormatting

> `readonly` **DocumentOnTypeFormatting**: `object`

#### TextDocument.DocumentOnTypeFormatting.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.onTypeFormatting"` = `'textDocument.onTypeFormatting'`

#### TextDocument.DocumentOnTypeFormatting.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.DocumentOnTypeFormatting.Method

> `readonly` **Method**: `"textDocument/onTypeFormatting"` = `'textDocument/onTypeFormatting'`

#### TextDocument.DocumentOnTypeFormatting.ServerCapability

> `readonly` **ServerCapability**: `"documentOnTypeFormattingProvider"` = `'documentOnTypeFormattingProvider'`

#### TextDocument.DocumentRangeFormatting

> `readonly` **DocumentRangeFormatting**: `object`

#### TextDocument.DocumentRangeFormatting.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.rangeFormatting"` = `'textDocument.rangeFormatting'`

#### TextDocument.DocumentRangeFormatting.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.DocumentRangeFormatting.Method

> `readonly` **Method**: `"textDocument/rangeFormatting"` = `'textDocument/rangeFormatting'`

#### TextDocument.DocumentRangeFormatting.ServerCapability

> `readonly` **ServerCapability**: `"documentRangeFormattingProvider"` = `'documentRangeFormattingProvider'`

#### TextDocument.DocumentRangesFormatting

> `readonly` **DocumentRangesFormatting**: `object`

#### TextDocument.DocumentRangesFormatting.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.rangeFormatting.rangesSupport"` = `'textDocument.rangeFormatting.rangesSupport'`

#### TextDocument.DocumentRangesFormatting.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.DocumentRangesFormatting.Method

> `readonly` **Method**: `"textDocument/rangesFormatting"` = `'textDocument/rangesFormatting'`

#### TextDocument.DocumentRangesFormatting.ServerCapability

> `readonly` **ServerCapability**: `"documentRangeFormattingProvider.rangesSupport"` = `'documentRangeFormattingProvider.rangesSupport'`

#### TextDocument.DocumentSymbol

> `readonly` **DocumentSymbol**: `object`

#### TextDocument.DocumentSymbol.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.documentSymbol"` = `'textDocument.documentSymbol'`

#### TextDocument.DocumentSymbol.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.DocumentSymbol.Method

> `readonly` **Method**: `"textDocument/documentSymbol"` = `'textDocument/documentSymbol'`

#### TextDocument.DocumentSymbol.ServerCapability

> `readonly` **ServerCapability**: `"documentSymbolProvider"` = `'documentSymbolProvider'`

#### TextDocument.FoldingRange

> `readonly` **FoldingRange**: `object`

#### TextDocument.FoldingRange.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.foldingRange"` = `'textDocument.foldingRange'`

#### TextDocument.FoldingRange.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.FoldingRange.Method

> `readonly` **Method**: `"textDocument/foldingRange"` = `'textDocument/foldingRange'`

#### TextDocument.FoldingRange.ServerCapability

> `readonly` **ServerCapability**: `"foldingRangeProvider"` = `'foldingRangeProvider'`

#### TextDocument.Hover

> `readonly` **Hover**: `object`

#### TextDocument.Hover.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.hover"` = `'textDocument.hover'`

#### TextDocument.Hover.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.Hover.Method

> `readonly` **Method**: `"textDocument/hover"` = `'textDocument/hover'`

#### TextDocument.Hover.ServerCapability

> `readonly` **ServerCapability**: `"hoverProvider"` = `'hoverProvider'`

#### TextDocument.Implementation

> `readonly` **Implementation**: `object`

#### TextDocument.Implementation.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.implementation"` = `'textDocument.implementation'`

#### TextDocument.Implementation.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.Implementation.Method

> `readonly` **Method**: `"textDocument/implementation"` = `'textDocument/implementation'`

#### TextDocument.Implementation.ServerCapability

> `readonly` **ServerCapability**: `"implementationProvider"` = `'implementationProvider'`

#### TextDocument.InlayHint

> `readonly` **InlayHint**: `object`

#### TextDocument.InlayHint.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.inlayHint"` = `'textDocument.inlayHint'`

#### TextDocument.InlayHint.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.InlayHint.Method

> `readonly` **Method**: `"textDocument/inlayHint"` = `'textDocument/inlayHint'`

#### TextDocument.InlayHint.ServerCapability

> `readonly` **ServerCapability**: `"inlayHintProvider"` = `'inlayHintProvider'`

#### TextDocument.InlineCompletion

> `readonly` **InlineCompletion**: `object`

#### TextDocument.InlineCompletion.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.inlineCompletion"` = `'textDocument.inlineCompletion'`

#### TextDocument.InlineCompletion.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.InlineCompletion.Method

> `readonly` **Method**: `"textDocument/inlineCompletion"` = `'textDocument/inlineCompletion'`

#### TextDocument.InlineCompletion.ServerCapability

> `readonly` **ServerCapability**: `"inlineCompletionProvider"` = `'inlineCompletionProvider'`

#### TextDocument.InlineValue

> `readonly` **InlineValue**: `object`

#### TextDocument.InlineValue.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.inlineValue"` = `'textDocument.inlineValue'`

#### TextDocument.InlineValue.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.InlineValue.Method

> `readonly` **Method**: `"textDocument/inlineValue"` = `'textDocument/inlineValue'`

#### TextDocument.InlineValue.ServerCapability

> `readonly` **ServerCapability**: `"inlineValueProvider"` = `'inlineValueProvider'`

#### TextDocument.LinkedEditingRange

> `readonly` **LinkedEditingRange**: `object`

#### TextDocument.LinkedEditingRange.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.linkedEditingRange"` = `'textDocument.linkedEditingRange'`

#### TextDocument.LinkedEditingRange.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.LinkedEditingRange.Method

> `readonly` **Method**: `"textDocument/linkedEditingRange"` = `'textDocument/linkedEditingRange'`

#### TextDocument.LinkedEditingRange.ServerCapability

> `readonly` **ServerCapability**: `"linkedEditingRangeProvider"` = `'linkedEditingRangeProvider'`

#### TextDocument.Moniker

> `readonly` **Moniker**: `object`

#### TextDocument.Moniker.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.moniker"` = `'textDocument.moniker'`

#### TextDocument.Moniker.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.Moniker.Method

> `readonly` **Method**: `"textDocument/moniker"` = `'textDocument/moniker'`

#### TextDocument.Moniker.ServerCapability

> `readonly` **ServerCapability**: `"monikerProvider"` = `'monikerProvider'`

#### TextDocument.PrepareRename

> `readonly` **PrepareRename**: `object`

#### TextDocument.PrepareRename.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.rename.prepareSupport"` = `'textDocument.rename.prepareSupport'`

#### TextDocument.PrepareRename.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.PrepareRename.Method

> `readonly` **Method**: `"textDocument/prepareRename"` = `'textDocument/prepareRename'`

#### TextDocument.PrepareRename.ServerCapability

> `readonly` **ServerCapability**: `"renameProvider.prepareProvider"` = `'renameProvider.prepareProvider'`

#### TextDocument.References

> `readonly` **References**: `object`

#### TextDocument.References.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.references"` = `'textDocument.references'`

#### TextDocument.References.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.References.Method

> `readonly` **Method**: `"textDocument/references"` = `'textDocument/references'`

#### TextDocument.References.ServerCapability

> `readonly` **ServerCapability**: `"referencesProvider"` = `'referencesProvider'`

#### TextDocument.Rename

> `readonly` **Rename**: `object`

#### TextDocument.Rename.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.rename"` = `'textDocument.rename'`

#### TextDocument.Rename.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.Rename.Method

> `readonly` **Method**: `"textDocument/rename"` = `'textDocument/rename'`

#### TextDocument.Rename.ServerCapability

> `readonly` **ServerCapability**: `"renameProvider"` = `'renameProvider'`

#### TextDocument.SelectionRange

> `readonly` **SelectionRange**: `object`

#### TextDocument.SelectionRange.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.selectionRange"` = `'textDocument.selectionRange'`

#### TextDocument.SelectionRange.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.SelectionRange.Method

> `readonly` **Method**: `"textDocument/selectionRange"` = `'textDocument/selectionRange'`

#### TextDocument.SelectionRange.ServerCapability

> `readonly` **ServerCapability**: `"selectionRangeProvider"` = `'selectionRangeProvider'`

#### TextDocument.SemanticTokens

> `readonly` **SemanticTokens**: `object`

#### TextDocument.SemanticTokens.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.semanticTokens"` = `'textDocument.semanticTokens'`

#### TextDocument.SemanticTokens.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.SemanticTokens.Method

> `readonly` **Method**: `"textDocument/semanticTokens/full"` = `'textDocument/semanticTokens/full'`

#### TextDocument.SemanticTokens.RegistrationMethod

> `readonly` **RegistrationMethod**: `"textDocument/semanticTokens"` = `'textDocument/semanticTokens'`

#### TextDocument.SemanticTokens.ServerCapability

> `readonly` **ServerCapability**: `"semanticTokensProvider"` = `'semanticTokensProvider'`

#### TextDocument.SemanticTokensDelta

> `readonly` **SemanticTokensDelta**: `object`

#### TextDocument.SemanticTokensDelta.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.semanticTokens.requests.full.delta"` = `'textDocument.semanticTokens.requests.full.delta'`

#### TextDocument.SemanticTokensDelta.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.SemanticTokensDelta.Method

> `readonly` **Method**: `"textDocument/semanticTokens/full/delta"` = `'textDocument/semanticTokens/full/delta'`

#### TextDocument.SemanticTokensDelta.RegistrationMethod

> `readonly` **RegistrationMethod**: `"textDocument/semanticTokens"` = `'textDocument/semanticTokens'`

#### TextDocument.SemanticTokensDelta.ServerCapability

> `readonly` **ServerCapability**: `"semanticTokensProvider.full.delta"` = `'semanticTokensProvider.full.delta'`

#### TextDocument.SemanticTokensRange

> `readonly` **SemanticTokensRange**: `object`

#### TextDocument.SemanticTokensRange.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.semanticTokens.requests.range"` = `'textDocument.semanticTokens.requests.range'`

#### TextDocument.SemanticTokensRange.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.SemanticTokensRange.Method

> `readonly` **Method**: `"textDocument/semanticTokens/range"` = `'textDocument/semanticTokens/range'`

#### TextDocument.SemanticTokensRange.RegistrationMethod

> `readonly` **RegistrationMethod**: `"textDocument/semanticTokens"` = `'textDocument/semanticTokens'`

#### TextDocument.SemanticTokensRange.ServerCapability

> `readonly` **ServerCapability**: `"semanticTokensProvider.range"` = `'semanticTokensProvider.range'`

#### TextDocument.SignatureHelp

> `readonly` **SignatureHelp**: `object`

#### TextDocument.SignatureHelp.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.signatureHelp"` = `'textDocument.signatureHelp'`

#### TextDocument.SignatureHelp.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.SignatureHelp.Method

> `readonly` **Method**: `"textDocument/signatureHelp"` = `'textDocument/signatureHelp'`

#### TextDocument.SignatureHelp.ServerCapability

> `readonly` **ServerCapability**: `"signatureHelpProvider"` = `'signatureHelpProvider'`

#### TextDocument.TypeDefinition

> `readonly` **TypeDefinition**: `object`

#### TextDocument.TypeDefinition.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.typeDefinition"` = `'textDocument.typeDefinition'`

#### TextDocument.TypeDefinition.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.TypeDefinition.Method

> `readonly` **Method**: `"textDocument/typeDefinition"` = `'textDocument/typeDefinition'`

#### TextDocument.TypeDefinition.ServerCapability

> `readonly` **ServerCapability**: `"typeDefinitionProvider"` = `'typeDefinitionProvider'`

#### TextDocument.TypeHierarchyPrepare

> `readonly` **TypeHierarchyPrepare**: `object`

#### TextDocument.TypeHierarchyPrepare.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.typeHierarchy"` = `'textDocument.typeHierarchy'`

#### TextDocument.TypeHierarchyPrepare.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.TypeHierarchyPrepare.Method

> `readonly` **Method**: `"textDocument/prepareTypeHierarchy"` = `'textDocument/prepareTypeHierarchy'`

#### TextDocument.TypeHierarchyPrepare.ServerCapability

> `readonly` **ServerCapability**: `"typeHierarchyProvider"` = `'typeHierarchyProvider'`

#### TextDocument.WillSaveTextDocumentWaitUntil

> `readonly` **WillSaveTextDocumentWaitUntil**: `object`

#### TextDocument.WillSaveTextDocumentWaitUntil.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.synchronization.willSaveWaitUntil"` = `'textDocument.synchronization.willSaveWaitUntil'`

#### TextDocument.WillSaveTextDocumentWaitUntil.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.WillSaveTextDocumentWaitUntil.Method

> `readonly` **Method**: `"textDocument/willSaveWaitUntil"` = `'textDocument/willSaveWaitUntil'`

#### TextDocument.WillSaveTextDocumentWaitUntil.ServerCapability

> `readonly` **ServerCapability**: `"textDocumentSync.willSaveWaitUntil"` = `'textDocumentSync.willSaveWaitUntil'`

### ~~TypeHierarchy~~

> `readonly` **TypeHierarchy**: `object`

#### TypeHierarchy.Subtypes

> `readonly` **Subtypes**: `object`

#### TypeHierarchy.Subtypes.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TypeHierarchy.Subtypes.Method

> `readonly` **Method**: `"typeHierarchy/subtypes"` = `'typeHierarchy/subtypes'`

#### TypeHierarchy.Supertypes

> `readonly` **Supertypes**: `object`

#### TypeHierarchy.Supertypes.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TypeHierarchy.Supertypes.Method

> `readonly` **Method**: `"typeHierarchy/supertypes"` = `'typeHierarchy/supertypes'`

### ~~Window~~

> `readonly` **Window**: `object`

#### Window.ShowDocument

> `readonly` **ShowDocument**: `object`

#### Window.ShowDocument.ClientCapability

> `readonly` **ClientCapability**: `"window.showDocument.support"` = `'window.showDocument.support'`

#### Window.ShowDocument.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Window.ShowDocument.Method

> `readonly` **Method**: `"window/showDocument"` = `'window/showDocument'`

#### Window.ShowMessage

> `readonly` **ShowMessage**: `object`

#### Window.ShowMessage.ClientCapability

> `readonly` **ClientCapability**: `"window.showMessage"` = `'window.showMessage'`

#### Window.ShowMessage.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Window.ShowMessage.Method

> `readonly` **Method**: `"window/showMessageRequest"` = `'window/showMessageRequest'`

#### Window.WorkDoneProgressCreate

> `readonly` **WorkDoneProgressCreate**: `object`

#### Window.WorkDoneProgressCreate.ClientCapability

> `readonly` **ClientCapability**: `"window.workDoneProgress"` = `'window.workDoneProgress'`

#### Window.WorkDoneProgressCreate.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Window.WorkDoneProgressCreate.Method

> `readonly` **Method**: `"window/workDoneProgress/create"` = `'window/workDoneProgress/create'`

### ~~Workspace~~

> `readonly` **Workspace**: `object`

#### Workspace.ApplyWorkspaceEdit

> `readonly` **ApplyWorkspaceEdit**: `object`

#### Workspace.ApplyWorkspaceEdit.ClientCapability

> `readonly` **ClientCapability**: `"workspace.applyEdit"` = `'workspace.applyEdit'`

#### Workspace.ApplyWorkspaceEdit.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Workspace.ApplyWorkspaceEdit.Method

> `readonly` **Method**: `"workspace/applyEdit"` = `'workspace/applyEdit'`

#### Workspace.CodeLensRefresh

> `readonly` **CodeLensRefresh**: `object`

#### Workspace.CodeLensRefresh.ClientCapability

> `readonly` **ClientCapability**: `"workspace.codeLens"` = `'workspace.codeLens'`

#### Workspace.CodeLensRefresh.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Workspace.CodeLensRefresh.Method

> `readonly` **Method**: `"workspace/codeLens/refresh"` = `'workspace/codeLens/refresh'`

#### Workspace.Configuration

> `readonly` **Configuration**: `object`

#### Workspace.Configuration.ClientCapability

> `readonly` **ClientCapability**: `"workspace.configuration"` = `'workspace.configuration'`

#### Workspace.Configuration.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Workspace.Configuration.Method

> `readonly` **Method**: `"workspace/configuration"` = `'workspace/configuration'`

#### Workspace.Diagnostic

> `readonly` **Diagnostic**: `object`

#### Workspace.Diagnostic.ClientCapability

> `readonly` **ClientCapability**: `"workspace.diagnostics"` = `'workspace.diagnostics'`

#### Workspace.Diagnostic.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Workspace.Diagnostic.Method

> `readonly` **Method**: `"workspace/diagnostic"` = `'workspace/diagnostic'`

#### Workspace.Diagnostic.ServerCapability

> `readonly` **ServerCapability**: `"diagnosticProvider.workspaceDiagnostics"` = `'diagnosticProvider.workspaceDiagnostics'`

#### Workspace.DiagnosticRefresh

> `readonly` **DiagnosticRefresh**: `object`

#### Workspace.DiagnosticRefresh.ClientCapability

> `readonly` **ClientCapability**: `"workspace.diagnostics.refreshSupport"` = `'workspace.diagnostics.refreshSupport'`

#### Workspace.DiagnosticRefresh.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Workspace.DiagnosticRefresh.Method

> `readonly` **Method**: `"workspace/diagnostic/refresh"` = `'workspace/diagnostic/refresh'`

#### Workspace.ExecuteCommand

> `readonly` **ExecuteCommand**: `object`

#### Workspace.ExecuteCommand.ClientCapability

> `readonly` **ClientCapability**: `"workspace.executeCommand"` = `'workspace.executeCommand'`

#### Workspace.ExecuteCommand.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Workspace.ExecuteCommand.Method

> `readonly` **Method**: `"workspace/executeCommand"` = `'workspace/executeCommand'`

#### Workspace.ExecuteCommand.ServerCapability

> `readonly` **ServerCapability**: `"executeCommandProvider"` = `'executeCommandProvider'`

#### Workspace.Folders

> `readonly` **Folders**: `object`

#### Workspace.Folders.ClientCapability

> `readonly` **ClientCapability**: `"workspace.workspaceFolders"` = `'workspace.workspaceFolders'`

#### Workspace.Folders.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Workspace.Folders.Method

> `readonly` **Method**: `"workspace/workspaceFolders"` = `'workspace/workspaceFolders'`

#### Workspace.Folders.ServerCapability

> `readonly` **ServerCapability**: `"workspace.workspaceFolders"` = `'workspace.workspaceFolders'`

#### Workspace.FoldingRangeRefresh

> `readonly` **FoldingRangeRefresh**: `object`

#### Workspace.FoldingRangeRefresh.ClientCapability

> `readonly` **ClientCapability**: `"workspace.foldingRange.refreshSupport"` = `'workspace.foldingRange.refreshSupport'`

#### Workspace.FoldingRangeRefresh.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Workspace.FoldingRangeRefresh.Method

> `readonly` **Method**: `"workspace/foldingRange/refresh"` = `'workspace/foldingRange/refresh'`

#### Workspace.InlayHintRefresh

> `readonly` **InlayHintRefresh**: `object`

#### Workspace.InlayHintRefresh.ClientCapability

> `readonly` **ClientCapability**: `"workspace.inlayHint.refreshSupport"` = `'workspace.inlayHint.refreshSupport'`

#### Workspace.InlayHintRefresh.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Workspace.InlayHintRefresh.Method

> `readonly` **Method**: `"workspace/inlayHint/refresh"` = `'workspace/inlayHint/refresh'`

#### Workspace.InlineValueRefresh

> `readonly` **InlineValueRefresh**: `object`

#### Workspace.InlineValueRefresh.ClientCapability

> `readonly` **ClientCapability**: `"workspace.inlineValue.refreshSupport"` = `'workspace.inlineValue.refreshSupport'`

#### Workspace.InlineValueRefresh.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Workspace.InlineValueRefresh.Method

> `readonly` **Method**: `"workspace/inlineValue/refresh"` = `'workspace/inlineValue/refresh'`

#### Workspace.SemanticTokensRefresh

> `readonly` **SemanticTokensRefresh**: `object`

#### Workspace.SemanticTokensRefresh.ClientCapability

> `readonly` **ClientCapability**: `"workspace.semanticTokens.refreshSupport"` = `'workspace.semanticTokens.refreshSupport'`

#### Workspace.SemanticTokensRefresh.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Workspace.SemanticTokensRefresh.Method

> `readonly` **Method**: `"workspace/semanticTokens/refresh"` = `'workspace/semanticTokens/refresh'`

#### Workspace.Symbol

> `readonly` **Symbol**: `object`

#### Workspace.Symbol.ClientCapability

> `readonly` **ClientCapability**: `"workspace.symbol"` = `'workspace.symbol'`

#### Workspace.Symbol.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Workspace.Symbol.Method

> `readonly` **Method**: `"workspace/symbol"` = `'workspace/symbol'`

#### Workspace.Symbol.ServerCapability

> `readonly` **ServerCapability**: `"workspaceSymbolProvider"` = `'workspaceSymbolProvider'`

#### Workspace.TextDocumentContent

> `readonly` **TextDocumentContent**: `object`

#### Workspace.TextDocumentContent.ClientCapability

> `readonly` **ClientCapability**: `"workspace.textDocumentContent"` = `'workspace.textDocumentContent'`

#### Workspace.TextDocumentContent.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Workspace.TextDocumentContent.Method

> `readonly` **Method**: `"workspace/textDocumentContent"` = `'workspace/textDocumentContent'`

#### Workspace.TextDocumentContent.ServerCapability

> `readonly` **ServerCapability**: `"workspace.textDocumentContent"` = `'workspace.textDocumentContent'`

#### Workspace.TextDocumentContentRefresh

> `readonly` **TextDocumentContentRefresh**: `object`

#### Workspace.TextDocumentContentRefresh.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Workspace.TextDocumentContentRefresh.Method

> `readonly` **Method**: `"workspace/textDocumentContent/refresh"` = `'workspace/textDocumentContent/refresh'`

#### Workspace.WillCreateFiles

> `readonly` **WillCreateFiles**: `object`

#### Workspace.WillCreateFiles.ClientCapability

> `readonly` **ClientCapability**: `"workspace.fileOperations.willCreate"` = `'workspace.fileOperations.willCreate'`

#### Workspace.WillCreateFiles.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Workspace.WillCreateFiles.Method

> `readonly` **Method**: `"workspace/willCreateFiles"` = `'workspace/willCreateFiles'`

#### Workspace.WillCreateFiles.ServerCapability

> `readonly` **ServerCapability**: `"workspace.fileOperations.willCreate"` = `'workspace.fileOperations.willCreate'`

#### Workspace.WillDeleteFiles

> `readonly` **WillDeleteFiles**: `object`

#### Workspace.WillDeleteFiles.ClientCapability

> `readonly` **ClientCapability**: `"workspace.fileOperations.willDelete"` = `'workspace.fileOperations.willDelete'`

#### Workspace.WillDeleteFiles.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Workspace.WillDeleteFiles.Method

> `readonly` **Method**: `"workspace/willDeleteFiles"` = `'workspace/willDeleteFiles'`

#### Workspace.WillDeleteFiles.ServerCapability

> `readonly` **ServerCapability**: `"workspace.fileOperations.willDelete"` = `'workspace.fileOperations.willDelete'`

#### Workspace.WillRenameFiles

> `readonly` **WillRenameFiles**: `object`

#### Workspace.WillRenameFiles.ClientCapability

> `readonly` **ClientCapability**: `"workspace.fileOperations.willRename"` = `'workspace.fileOperations.willRename'`

#### Workspace.WillRenameFiles.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Workspace.WillRenameFiles.Method

> `readonly` **Method**: `"workspace/willRenameFiles"` = `'workspace/willRenameFiles'`

#### Workspace.WillRenameFiles.ServerCapability

> `readonly` **ServerCapability**: `"workspace.fileOperations.willRename"` = `'workspace.fileOperations.willRename'`

### ~~WorkspaceSymbol~~

> `readonly` **WorkspaceSymbol**: `object`

#### WorkspaceSymbol.Resolve

> `readonly` **Resolve**: `object`

#### WorkspaceSymbol.Resolve.ClientCapability

> `readonly` **ClientCapability**: `"workspace.symbol.resolveSupport"` = `'workspace.symbol.resolveSupport'`

#### WorkspaceSymbol.Resolve.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### WorkspaceSymbol.Resolve.Method

> `readonly` **Method**: `"workspaceSymbol/resolve"` = `'workspaceSymbol/resolve'`

#### WorkspaceSymbol.Resolve.ServerCapability

> `readonly` **ServerCapability**: `"workspaceSymbolProvider.resolveProvider"` = `'workspaceSymbolProvider.resolveProvider'`

## Deprecated

Use individual namespace exports instead
