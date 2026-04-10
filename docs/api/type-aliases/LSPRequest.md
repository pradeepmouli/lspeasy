[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / LSPRequest

# Type Alias: LSPRequest

> **LSPRequest** = `object`

Defined in: [packages/core/src/protocol/namespaces.ts:10](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/namespaces.ts#L10)

LSP Request type definitions organized by namespace

## Properties

### CallHierarchy

> **CallHierarchy**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:11](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/namespaces.ts#L11)

#### IncomingCalls

> **IncomingCalls**: `object`

##### IncomingCalls.Direction

> **Direction**: `"clientToServer"`

##### IncomingCalls.Method

> **Method**: `"callHierarchy/incomingCalls"`

##### IncomingCalls.Params

> **Params**: [`CallHierarchyIncomingCallsParams`](../interfaces/CallHierarchyIncomingCallsParams.md)

##### IncomingCalls.PartialResult

> **PartialResult**: [`CallHierarchyIncomingCall`](../interfaces/CallHierarchyIncomingCall.md)[]

##### IncomingCalls.Result

> **Result**: [`CallHierarchyIncomingCall`](../interfaces/CallHierarchyIncomingCall.md)[] \| `null`

##### IncomingCalls.Since

> **Since**: `"3.16.0"`

#### OutgoingCalls

> **OutgoingCalls**: `object`

##### OutgoingCalls.Direction

> **Direction**: `"clientToServer"`

##### OutgoingCalls.Method

> **Method**: `"callHierarchy/outgoingCalls"`

##### OutgoingCalls.Params

> **Params**: [`CallHierarchyOutgoingCallsParams`](../interfaces/CallHierarchyOutgoingCallsParams.md)

##### OutgoingCalls.PartialResult

> **PartialResult**: [`CallHierarchyOutgoingCall`](../interfaces/CallHierarchyOutgoingCall.md)[]

##### OutgoingCalls.Result

> **Result**: [`CallHierarchyOutgoingCall`](../interfaces/CallHierarchyOutgoingCall.md)[] \| `null`

##### OutgoingCalls.Since

> **Since**: `"3.16.0"`

***

### Client

> **Client**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:29](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/namespaces.ts#L29)

#### Registration

> **Registration**: `object`

##### Registration.Direction

> **Direction**: `"serverToClient"`

##### Registration.Method

> **Method**: `"client/registerCapability"`

##### Registration.Params

> **Params**: [`RegistrationParams`](../interfaces/RegistrationParams.md)

##### Registration.Result

> **Result**: `null`

#### Unregistration

> **Unregistration**: `object`

##### Unregistration.Direction

> **Direction**: `"serverToClient"`

##### Unregistration.Method

> **Method**: `"client/unregisterCapability"`

##### Unregistration.Params

> **Params**: [`UnregistrationParams`](../interfaces/UnregistrationParams.md)

##### Unregistration.Result

> **Result**: `null`

***

### CodeAction

> **CodeAction**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:43](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/namespaces.ts#L43)

#### Resolve

> **Resolve**: `object`

##### Resolve.ClientCapability

> **ClientCapability**: `"textDocument.codeAction.resolveSupport"`

##### Resolve.Direction

> **Direction**: `"clientToServer"`

##### Resolve.Method

> **Method**: `"codeAction/resolve"`

##### Resolve.Params

> **Params**: [`CodeAction`](../interfaces/CodeAction.md)

##### Resolve.Result

> **Result**: [`CodeAction`](../interfaces/CodeAction.md)

##### Resolve.ServerCapability

> **ServerCapability**: `"codeActionProvider.resolveProvider"`

***

### CodeLens

> **CodeLens**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:53](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/namespaces.ts#L53)

#### Resolve

> **Resolve**: `object`

##### Resolve.ClientCapability

> **ClientCapability**: `"textDocument.codeLens.resolveSupport"`

##### Resolve.Direction

> **Direction**: `"clientToServer"`

##### Resolve.Method

> **Method**: `"codeLens/resolve"`

##### Resolve.Params

> **Params**: [`CodeLens`](../interfaces/CodeLens.md)

##### Resolve.Result

> **Result**: [`CodeLens`](../interfaces/CodeLens.md)

##### Resolve.ServerCapability

> **ServerCapability**: `"codeLensProvider.resolveProvider"`

***

### CompletionItem

> **CompletionItem**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:63](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/namespaces.ts#L63)

#### CompletionResolve

> **CompletionResolve**: `object`

##### CompletionResolve.ClientCapability

> **ClientCapability**: `"textDocument.completion.completionItem.resolveSupport"`

##### CompletionResolve.Direction

> **Direction**: `"clientToServer"`

##### CompletionResolve.Method

> **Method**: `"completionItem/resolve"`

##### CompletionResolve.Params

> **Params**: [`CompletionItem`](../interfaces/CompletionItem.md)

##### CompletionResolve.Result

> **Result**: [`CompletionItem`](../interfaces/CompletionItem.md)

##### CompletionResolve.ServerCapability

> **ServerCapability**: `"completionProvider.resolveProvider"`

***

### DocumentLink

> **DocumentLink**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:73](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/namespaces.ts#L73)

#### Resolve

> **Resolve**: `object`

##### Resolve.ClientCapability

> **ClientCapability**: `"textDocument.documentLink"`

##### Resolve.Direction

> **Direction**: `"clientToServer"`

##### Resolve.Method

> **Method**: `"documentLink/resolve"`

##### Resolve.Params

> **Params**: [`DocumentLink`](../interfaces/DocumentLink.md)

##### Resolve.Result

> **Result**: [`DocumentLink`](../interfaces/DocumentLink.md)

##### Resolve.ServerCapability

> **ServerCapability**: `"documentLinkProvider.resolveProvider"`

***

### InlayHint

> **InlayHint**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:83](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/namespaces.ts#L83)

#### Resolve

> **Resolve**: `object`

##### Resolve.ClientCapability

> **ClientCapability**: `"textDocument.inlayHint.resolveSupport"`

##### Resolve.Direction

> **Direction**: `"clientToServer"`

##### Resolve.Method

> **Method**: `"inlayHint/resolve"`

##### Resolve.Params

> **Params**: [`InlayHint`](InlayHint.md)

##### Resolve.Result

> **Result**: [`InlayHint`](InlayHint.md)

##### Resolve.ServerCapability

> **ServerCapability**: `"inlayHintProvider.resolveProvider"`

##### Resolve.Since

> **Since**: `"3.17.0"`

***

### Lifecycle

> **Lifecycle**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:94](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/namespaces.ts#L94)

#### Initialize

> **Initialize**: `object`

##### Initialize.Direction

> **Direction**: `"clientToServer"`

##### Initialize.ErrorData

> **ErrorData**: [`InitializeError`](../interfaces/InitializeError.md)

##### Initialize.Method

> **Method**: `"initialize"`

##### Initialize.Params

> **Params**: [`InitializeParams`](InitializeParams.md)

##### Initialize.Result

> **Result**: [`InitializeResult`](../interfaces/InitializeResult.md)

#### Shutdown

> **Shutdown**: `object`

##### Shutdown.Direction

> **Direction**: `"clientToServer"`

##### Shutdown.Method

> **Method**: `"shutdown"`

##### Shutdown.Params

> **Params**: `undefined`

##### Shutdown.Result

> **Result**: `null`

***

### TextDocument

> **TextDocument**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:109](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/namespaces.ts#L109)

#### CallHierarchyPrepare

> **CallHierarchyPrepare**: `object`

##### CallHierarchyPrepare.ClientCapability

> **ClientCapability**: `"textDocument.callHierarchy"`

##### CallHierarchyPrepare.Direction

> **Direction**: `"clientToServer"`

##### CallHierarchyPrepare.Method

> **Method**: `"textDocument/prepareCallHierarchy"`

##### CallHierarchyPrepare.Params

> **Params**: [`CallHierarchyPrepareParams`](../interfaces/CallHierarchyPrepareParams.md)

##### CallHierarchyPrepare.RegistrationOptions

> **RegistrationOptions**: [`CallHierarchyRegistrationOptions`](../interfaces/CallHierarchyRegistrationOptions.md)

##### CallHierarchyPrepare.Result

> **Result**: [`CallHierarchyItem`](../interfaces/CallHierarchyItem.md)[] \| `null`

##### CallHierarchyPrepare.ServerCapability

> **ServerCapability**: `"callHierarchyProvider"`

##### CallHierarchyPrepare.Since

> **Since**: `"3.16.0"`

#### CodeAction

> **CodeAction**: `object`

##### CodeAction.ClientCapability

> **ClientCapability**: `"textDocument.codeAction"`

##### CodeAction.Direction

> **Direction**: `"clientToServer"`

##### CodeAction.Method

> **Method**: `"textDocument/codeAction"`

##### CodeAction.Params

> **Params**: [`CodeActionParams`](../interfaces/CodeActionParams.md)

##### CodeAction.PartialResult

> **PartialResult**: [`Command`](../interfaces/Command.md) \| [`CodeAction`](../interfaces/CodeAction.md)[]

##### CodeAction.RegistrationOptions

> **RegistrationOptions**: [`CodeActionRegistrationOptions`](../interfaces/CodeActionRegistrationOptions.md)

##### CodeAction.Result

> **Result**: [`Command`](../interfaces/Command.md) \| [`CodeAction`](../interfaces/CodeAction.md)[] \| `null`

##### CodeAction.ServerCapability

> **ServerCapability**: `"codeActionProvider"`

#### CodeLens

> **CodeLens**: `object`

##### CodeLens.ClientCapability

> **ClientCapability**: `"textDocument.codeLens"`

##### CodeLens.Direction

> **Direction**: `"clientToServer"`

##### CodeLens.Method

> **Method**: `"textDocument/codeLens"`

##### CodeLens.Params

> **Params**: [`CodeLensParams`](../interfaces/CodeLensParams.md)

##### CodeLens.PartialResult

> **PartialResult**: [`CodeLens`](../interfaces/CodeLens.md)[]

##### CodeLens.RegistrationOptions

> **RegistrationOptions**: [`CodeLensRegistrationOptions`](../interfaces/CodeLensRegistrationOptions.md)

##### CodeLens.Result

> **Result**: [`CodeLens`](../interfaces/CodeLens.md)[] \| `null`

##### CodeLens.ServerCapability

> **ServerCapability**: `"codeLensProvider"`

#### ColorPresentation

> **ColorPresentation**: `object`

##### ColorPresentation.ClientCapability

> **ClientCapability**: `"textDocument.colorProvider"`

##### ColorPresentation.Direction

> **Direction**: `"clientToServer"`

##### ColorPresentation.Method

> **Method**: `"textDocument/colorPresentation"`

##### ColorPresentation.Params

> **Params**: [`ColorPresentationParams`](../interfaces/ColorPresentationParams.md)

##### ColorPresentation.PartialResult

> **PartialResult**: [`ColorPresentation`](../interfaces/ColorPresentation.md)[]

##### ColorPresentation.RegistrationOptions

> **RegistrationOptions**: [`WorkDoneProgressOptions`](../interfaces/WorkDoneProgressOptions.md) & [`TextDocumentRegistrationOptions`](../interfaces/TextDocumentRegistrationOptions.md)

##### ColorPresentation.Result

> **Result**: [`ColorPresentation`](../interfaces/ColorPresentation.md)[]

##### ColorPresentation.ServerCapability

> **ServerCapability**: `"colorProvider"`

#### Completion

> **Completion**: `object`

##### Completion.ClientCapability

> **ClientCapability**: `"textDocument.completion"`

##### Completion.Direction

> **Direction**: `"clientToServer"`

##### Completion.Method

> **Method**: `"textDocument/completion"`

##### Completion.Params

> **Params**: [`CompletionParams`](../interfaces/CompletionParams.md)

##### Completion.PartialResult

> **PartialResult**: [`CompletionItem`](../interfaces/CompletionItem.md)[]

##### Completion.RegistrationOptions

> **RegistrationOptions**: [`CompletionRegistrationOptions`](../interfaces/CompletionRegistrationOptions.md)

##### Completion.Result

> **Result**: [`CompletionItem`](../interfaces/CompletionItem.md)[] \| [`CompletionList`](../interfaces/CompletionList.md) \| `null`

##### Completion.ServerCapability

> **ServerCapability**: `"completionProvider"`

#### Declaration

> **Declaration**: `object`

##### Declaration.ClientCapability

> **ClientCapability**: `"textDocument.declaration"`

##### Declaration.Direction

> **Direction**: `"clientToServer"`

##### Declaration.Method

> **Method**: `"textDocument/declaration"`

##### Declaration.Params

> **Params**: [`DeclarationParams`](../interfaces/DeclarationParams.md)

##### Declaration.PartialResult

> **PartialResult**: [`Location`](../interfaces/Location.md)[] \| [`DeclarationLink`](DeclarationLink.md)[]

##### Declaration.RegistrationOptions

> **RegistrationOptions**: [`DeclarationRegistrationOptions`](../interfaces/DeclarationRegistrationOptions.md)

##### Declaration.Result

> **Result**: [`Declaration`](Declaration.md) \| [`DeclarationLink`](DeclarationLink.md)[] \| `null`

##### Declaration.ServerCapability

> **ServerCapability**: `"declarationProvider"`

#### Definition

> **Definition**: `object`

##### Definition.ClientCapability

> **ClientCapability**: `"textDocument.definition"`

##### Definition.Direction

> **Direction**: `"clientToServer"`

##### Definition.Method

> **Method**: `"textDocument/definition"`

##### Definition.Params

> **Params**: [`DefinitionParams`](../interfaces/DefinitionParams.md)

##### Definition.PartialResult

> **PartialResult**: [`Location`](../interfaces/Location.md)[] \| [`DefinitionLink`](DefinitionLink.md)[]

##### Definition.RegistrationOptions

> **RegistrationOptions**: [`DefinitionRegistrationOptions`](../interfaces/DefinitionRegistrationOptions.md)

##### Definition.Result

> **Result**: [`Definition`](Definition.md) \| [`DefinitionLink`](DefinitionLink.md)[] \| `null`

##### Definition.ServerCapability

> **ServerCapability**: `"definitionProvider"`

#### DocumentColor

> **DocumentColor**: `object`

##### DocumentColor.ClientCapability

> **ClientCapability**: `"textDocument.colorProvider"`

##### DocumentColor.Direction

> **Direction**: `"clientToServer"`

##### DocumentColor.Method

> **Method**: `"textDocument/documentColor"`

##### DocumentColor.Params

> **Params**: [`DocumentColorParams`](../interfaces/DocumentColorParams.md)

##### DocumentColor.PartialResult

> **PartialResult**: [`ColorInformation`](../interfaces/ColorInformation.md)[]

##### DocumentColor.RegistrationOptions

> **RegistrationOptions**: [`DocumentColorRegistrationOptions`](../interfaces/DocumentColorRegistrationOptions.md)

##### DocumentColor.Result

> **Result**: [`ColorInformation`](../interfaces/ColorInformation.md)[]

##### DocumentColor.ServerCapability

> **ServerCapability**: `"colorProvider"`

#### DocumentDiagnostic

> **DocumentDiagnostic**: `object`

##### DocumentDiagnostic.ClientCapability

> **ClientCapability**: `"textDocument.diagnostic"`

##### DocumentDiagnostic.Direction

> **Direction**: `"clientToServer"`

##### DocumentDiagnostic.ErrorData

> **ErrorData**: [`DiagnosticServerCancellationData`](DiagnosticServerCancellationData.md)

##### DocumentDiagnostic.Method

> **Method**: `"textDocument/diagnostic"`

##### DocumentDiagnostic.Params

> **Params**: [`DocumentDiagnosticParams`](DocumentDiagnosticParams.md)

##### DocumentDiagnostic.PartialResult

> **PartialResult**: [`DocumentDiagnosticReportPartialResult`](DocumentDiagnosticReportPartialResult.md)

##### DocumentDiagnostic.RegistrationOptions

> **RegistrationOptions**: [`DiagnosticRegistrationOptions`](DiagnosticRegistrationOptions.md)

##### DocumentDiagnostic.Result

> **Result**: [`DocumentDiagnosticReport`](DocumentDiagnosticReport.md)

##### DocumentDiagnostic.ServerCapability

> **ServerCapability**: `"diagnosticProvider"`

##### DocumentDiagnostic.Since

> **Since**: `"3.17.0"`

#### DocumentFormatting

> **DocumentFormatting**: `object`

##### DocumentFormatting.ClientCapability

> **ClientCapability**: `"textDocument.formatting"`

##### DocumentFormatting.Direction

> **Direction**: `"clientToServer"`

##### DocumentFormatting.Method

> **Method**: `"textDocument/formatting"`

##### DocumentFormatting.Params

> **Params**: [`DocumentFormattingParams`](../interfaces/DocumentFormattingParams.md)

##### DocumentFormatting.RegistrationOptions

> **RegistrationOptions**: [`DocumentFormattingRegistrationOptions`](../interfaces/DocumentFormattingRegistrationOptions.md)

##### DocumentFormatting.Result

> **Result**: [`TextEdit`](../interfaces/TextEdit.md)[] \| `null`

##### DocumentFormatting.ServerCapability

> **ServerCapability**: `"documentFormattingProvider"`

#### DocumentHighlight

> **DocumentHighlight**: `object`

##### DocumentHighlight.ClientCapability

> **ClientCapability**: `"textDocument.documentHighlight"`

##### DocumentHighlight.Direction

> **Direction**: `"clientToServer"`

##### DocumentHighlight.Method

> **Method**: `"textDocument/documentHighlight"`

##### DocumentHighlight.Params

> **Params**: [`DocumentHighlightParams`](../interfaces/DocumentHighlightParams.md)

##### DocumentHighlight.PartialResult

> **PartialResult**: [`DocumentHighlight`](../interfaces/DocumentHighlight.md)[]

##### DocumentHighlight.RegistrationOptions

> **RegistrationOptions**: [`DocumentHighlightRegistrationOptions`](../interfaces/DocumentHighlightRegistrationOptions.md)

##### DocumentHighlight.Result

> **Result**: [`DocumentHighlight`](../interfaces/DocumentHighlight.md)[] \| `null`

##### DocumentHighlight.ServerCapability

> **ServerCapability**: `"documentHighlightProvider"`

#### DocumentLink

> **DocumentLink**: `object`

##### DocumentLink.ClientCapability

> **ClientCapability**: `"textDocument.documentLink"`

##### DocumentLink.Direction

> **Direction**: `"clientToServer"`

##### DocumentLink.Method

> **Method**: `"textDocument/documentLink"`

##### DocumentLink.Params

> **Params**: [`DocumentLinkParams`](../interfaces/DocumentLinkParams.md)

##### DocumentLink.PartialResult

> **PartialResult**: [`DocumentLink`](../interfaces/DocumentLink.md)[]

##### DocumentLink.RegistrationOptions

> **RegistrationOptions**: [`DocumentLinkRegistrationOptions`](../interfaces/DocumentLinkRegistrationOptions.md)

##### DocumentLink.Result

> **Result**: [`DocumentLink`](../interfaces/DocumentLink.md)[] \| `null`

##### DocumentLink.ServerCapability

> **ServerCapability**: `"documentLinkProvider"`

#### DocumentOnTypeFormatting

> **DocumentOnTypeFormatting**: `object`

##### DocumentOnTypeFormatting.ClientCapability

> **ClientCapability**: `"textDocument.onTypeFormatting"`

##### DocumentOnTypeFormatting.Direction

> **Direction**: `"clientToServer"`

##### DocumentOnTypeFormatting.Method

> **Method**: `"textDocument/onTypeFormatting"`

##### DocumentOnTypeFormatting.Params

> **Params**: [`DocumentOnTypeFormattingParams`](../interfaces/DocumentOnTypeFormattingParams.md)

##### DocumentOnTypeFormatting.RegistrationOptions

> **RegistrationOptions**: [`DocumentOnTypeFormattingRegistrationOptions`](../interfaces/DocumentOnTypeFormattingRegistrationOptions.md)

##### DocumentOnTypeFormatting.Result

> **Result**: [`TextEdit`](../interfaces/TextEdit.md)[] \| `null`

##### DocumentOnTypeFormatting.ServerCapability

> **ServerCapability**: `"documentOnTypeFormattingProvider"`

#### DocumentRangeFormatting

> **DocumentRangeFormatting**: `object`

##### DocumentRangeFormatting.ClientCapability

> **ClientCapability**: `"textDocument.rangeFormatting"`

##### DocumentRangeFormatting.Direction

> **Direction**: `"clientToServer"`

##### DocumentRangeFormatting.Method

> **Method**: `"textDocument/rangeFormatting"`

##### DocumentRangeFormatting.Params

> **Params**: [`DocumentRangeFormattingParams`](../interfaces/DocumentRangeFormattingParams.md)

##### DocumentRangeFormatting.RegistrationOptions

> **RegistrationOptions**: [`DocumentRangeFormattingRegistrationOptions`](../interfaces/DocumentRangeFormattingRegistrationOptions.md)

##### DocumentRangeFormatting.Result

> **Result**: [`TextEdit`](../interfaces/TextEdit.md)[] \| `null`

##### DocumentRangeFormatting.ServerCapability

> **ServerCapability**: `"documentRangeFormattingProvider"`

#### DocumentRangesFormatting

> **DocumentRangesFormatting**: `object`

##### DocumentRangesFormatting.ClientCapability

> **ClientCapability**: `"textDocument.rangeFormatting.rangesSupport"`

##### DocumentRangesFormatting.Direction

> **Direction**: `"clientToServer"`

##### DocumentRangesFormatting.Method

> **Method**: `"textDocument/rangesFormatting"`

##### DocumentRangesFormatting.Params

> **Params**: [`DocumentRangesFormattingParams`](../interfaces/DocumentRangesFormattingParams.md)

##### DocumentRangesFormatting.Proposed

> **Proposed**: `true`

##### DocumentRangesFormatting.RegistrationOptions

> **RegistrationOptions**: [`DocumentRangeFormattingRegistrationOptions`](../interfaces/DocumentRangeFormattingRegistrationOptions.md)

##### DocumentRangesFormatting.Result

> **Result**: [`TextEdit`](../interfaces/TextEdit.md)[] \| `null`

##### DocumentRangesFormatting.ServerCapability

> **ServerCapability**: `"documentRangeFormattingProvider.rangesSupport"`

##### DocumentRangesFormatting.Since

> **Since**: `"3.18.0"`

#### DocumentSymbol

> **DocumentSymbol**: `object`

##### DocumentSymbol.ClientCapability

> **ClientCapability**: `"textDocument.documentSymbol"`

##### DocumentSymbol.Direction

> **Direction**: `"clientToServer"`

##### DocumentSymbol.Method

> **Method**: `"textDocument/documentSymbol"`

##### DocumentSymbol.Params

> **Params**: [`DocumentSymbolParams`](../interfaces/DocumentSymbolParams.md)

##### DocumentSymbol.PartialResult

> **PartialResult**: [`SymbolInformation`](../interfaces/SymbolInformation.md)[] \| [`DocumentSymbol`](../interfaces/DocumentSymbol.md)[]

##### DocumentSymbol.RegistrationOptions

> **RegistrationOptions**: [`DocumentSymbolRegistrationOptions`](../interfaces/DocumentSymbolRegistrationOptions.md)

##### DocumentSymbol.Result

> **Result**: [`SymbolInformation`](../interfaces/SymbolInformation.md)[] \| [`DocumentSymbol`](../interfaces/DocumentSymbol.md)[] \| `null`

##### DocumentSymbol.ServerCapability

> **ServerCapability**: `"documentSymbolProvider"`

#### FoldingRange

> **FoldingRange**: `object`

##### FoldingRange.ClientCapability

> **ClientCapability**: `"textDocument.foldingRange"`

##### FoldingRange.Direction

> **Direction**: `"clientToServer"`

##### FoldingRange.Method

> **Method**: `"textDocument/foldingRange"`

##### FoldingRange.Params

> **Params**: [`FoldingRangeParams`](../interfaces/FoldingRangeParams.md)

##### FoldingRange.PartialResult

> **PartialResult**: [`FoldingRange`](../interfaces/FoldingRange.md)[]

##### FoldingRange.RegistrationOptions

> **RegistrationOptions**: [`FoldingRangeRegistrationOptions`](../interfaces/FoldingRangeRegistrationOptions.md)

##### FoldingRange.Result

> **Result**: [`FoldingRange`](../interfaces/FoldingRange.md)[] \| `null`

##### FoldingRange.ServerCapability

> **ServerCapability**: `"foldingRangeProvider"`

#### Hover

> **Hover**: `object`

##### Hover.ClientCapability

> **ClientCapability**: `"textDocument.hover"`

##### Hover.Direction

> **Direction**: `"clientToServer"`

##### Hover.Method

> **Method**: `"textDocument/hover"`

##### Hover.Params

> **Params**: [`HoverParams`](../interfaces/HoverParams.md)

##### Hover.RegistrationOptions

> **RegistrationOptions**: [`HoverRegistrationOptions`](../interfaces/HoverRegistrationOptions.md)

##### Hover.Result

> **Result**: [`Hover`](../interfaces/Hover.md) \| `null`

##### Hover.ServerCapability

> **ServerCapability**: `"hoverProvider"`

#### Implementation

> **Implementation**: `object`

##### Implementation.ClientCapability

> **ClientCapability**: `"textDocument.implementation"`

##### Implementation.Direction

> **Direction**: `"clientToServer"`

##### Implementation.Method

> **Method**: `"textDocument/implementation"`

##### Implementation.Params

> **Params**: [`ImplementationParams`](../interfaces/ImplementationParams.md)

##### Implementation.PartialResult

> **PartialResult**: [`Location`](../interfaces/Location.md)[] \| [`DefinitionLink`](DefinitionLink.md)[]

##### Implementation.RegistrationOptions

> **RegistrationOptions**: [`ImplementationRegistrationOptions`](../interfaces/ImplementationRegistrationOptions.md)

##### Implementation.Result

> **Result**: [`Definition`](Definition.md) \| [`DefinitionLink`](DefinitionLink.md)[] \| `null`

##### Implementation.ServerCapability

> **ServerCapability**: `"implementationProvider"`

#### InlayHint

> **InlayHint**: `object`

##### InlayHint.ClientCapability

> **ClientCapability**: `"textDocument.inlayHint"`

##### InlayHint.Direction

> **Direction**: `"clientToServer"`

##### InlayHint.Method

> **Method**: `"textDocument/inlayHint"`

##### InlayHint.Params

> **Params**: [`InlayHintParams`](InlayHintParams.md)

##### InlayHint.PartialResult

> **PartialResult**: [`InlayHint`](InlayHint.md)[]

##### InlayHint.RegistrationOptions

> **RegistrationOptions**: [`InlayHintRegistrationOptions`](InlayHintRegistrationOptions.md)

##### InlayHint.Result

> **Result**: [`InlayHint`](InlayHint.md)[] \| `null`

##### InlayHint.ServerCapability

> **ServerCapability**: `"inlayHintProvider"`

##### InlayHint.Since

> **Since**: `"3.17.0"`

#### InlineCompletion

> **InlineCompletion**: `object`

##### InlineCompletion.ClientCapability

> **ClientCapability**: `"textDocument.inlineCompletion"`

##### InlineCompletion.Direction

> **Direction**: `"clientToServer"`

##### InlineCompletion.Method

> **Method**: `"textDocument/inlineCompletion"`

##### InlineCompletion.Params

> **Params**: [`InlineCompletionParams`](InlineCompletionParams.md)

##### InlineCompletion.PartialResult

> **PartialResult**: [`InlineCompletionItem`](../interfaces/InlineCompletionItem.md)[]

##### InlineCompletion.Proposed

> **Proposed**: `true`

##### InlineCompletion.RegistrationOptions

> **RegistrationOptions**: [`InlineCompletionRegistrationOptions`](InlineCompletionRegistrationOptions.md)

##### InlineCompletion.Result

> **Result**: [`InlineCompletionList`](../interfaces/InlineCompletionList.md) \| [`InlineCompletionItem`](../interfaces/InlineCompletionItem.md)[] \| `null`

##### InlineCompletion.ServerCapability

> **ServerCapability**: `"inlineCompletionProvider"`

##### InlineCompletion.Since

> **Since**: `"3.18.0"`

#### InlineValue

> **InlineValue**: `object`

##### InlineValue.ClientCapability

> **ClientCapability**: `"textDocument.inlineValue"`

##### InlineValue.Direction

> **Direction**: `"clientToServer"`

##### InlineValue.Method

> **Method**: `"textDocument/inlineValue"`

##### InlineValue.Params

> **Params**: [`InlineValueParams`](InlineValueParams.md)

##### InlineValue.PartialResult

> **PartialResult**: [`InlineValue`](InlineValue.md)[]

##### InlineValue.RegistrationOptions

> **RegistrationOptions**: [`InlineValueRegistrationOptions`](InlineValueRegistrationOptions.md)

##### InlineValue.Result

> **Result**: [`InlineValue`](InlineValue.md)[] \| `null`

##### InlineValue.ServerCapability

> **ServerCapability**: `"inlineValueProvider"`

##### InlineValue.Since

> **Since**: `"3.17.0"`

#### LinkedEditingRange

> **LinkedEditingRange**: `object`

##### LinkedEditingRange.ClientCapability

> **ClientCapability**: `"textDocument.linkedEditingRange"`

##### LinkedEditingRange.Direction

> **Direction**: `"clientToServer"`

##### LinkedEditingRange.Method

> **Method**: `"textDocument/linkedEditingRange"`

##### LinkedEditingRange.Params

> **Params**: [`LinkedEditingRangeParams`](../interfaces/LinkedEditingRangeParams.md)

##### LinkedEditingRange.RegistrationOptions

> **RegistrationOptions**: [`LinkedEditingRangeRegistrationOptions`](../interfaces/LinkedEditingRangeRegistrationOptions.md)

##### LinkedEditingRange.Result

> **Result**: [`LinkedEditingRanges`](../interfaces/LinkedEditingRanges.md) \| `null`

##### LinkedEditingRange.ServerCapability

> **ServerCapability**: `"linkedEditingRangeProvider"`

##### LinkedEditingRange.Since

> **Since**: `"3.16.0"`

#### Moniker

> **Moniker**: `object`

##### Moniker.ClientCapability

> **ClientCapability**: `"textDocument.moniker"`

##### Moniker.Direction

> **Direction**: `"clientToServer"`

##### Moniker.Method

> **Method**: `"textDocument/moniker"`

##### Moniker.Params

> **Params**: [`MonikerParams`](../interfaces/MonikerParams.md)

##### Moniker.PartialResult

> **PartialResult**: [`Moniker`](../interfaces/Moniker.md)[]

##### Moniker.RegistrationOptions

> **RegistrationOptions**: [`MonikerRegistrationOptions`](../interfaces/MonikerRegistrationOptions.md)

##### Moniker.Result

> **Result**: [`Moniker`](../interfaces/Moniker.md)[] \| `null`

##### Moniker.ServerCapability

> **ServerCapability**: `"monikerProvider"`

#### PrepareRename

> **PrepareRename**: `object`

##### PrepareRename.ClientCapability

> **ClientCapability**: `"textDocument.rename.prepareSupport"`

##### PrepareRename.Direction

> **Direction**: `"clientToServer"`

##### PrepareRename.Method

> **Method**: `"textDocument/prepareRename"`

##### PrepareRename.Params

> **Params**: [`PrepareRenameParams`](../interfaces/PrepareRenameParams.md)

##### PrepareRename.Result

> **Result**: [`PrepareRenameResult`](PrepareRenameResult.md) \| `null`

##### PrepareRename.ServerCapability

> **ServerCapability**: `"renameProvider.prepareProvider"`

##### PrepareRename.Since

> **Since**: `"3.16"`

#### References

> **References**: `object`

##### References.ClientCapability

> **ClientCapability**: `"textDocument.references"`

##### References.Direction

> **Direction**: `"clientToServer"`

##### References.Method

> **Method**: `"textDocument/references"`

##### References.Params

> **Params**: [`ReferenceParams`](../interfaces/ReferenceParams.md)

##### References.PartialResult

> **PartialResult**: [`Location`](../interfaces/Location.md)[]

##### References.RegistrationOptions

> **RegistrationOptions**: [`ReferenceRegistrationOptions`](../interfaces/ReferenceRegistrationOptions.md)

##### References.Result

> **Result**: [`Location`](../interfaces/Location.md)[] \| `null`

##### References.ServerCapability

> **ServerCapability**: `"referencesProvider"`

#### Rename

> **Rename**: `object`

##### Rename.ClientCapability

> **ClientCapability**: `"textDocument.rename"`

##### Rename.Direction

> **Direction**: `"clientToServer"`

##### Rename.Method

> **Method**: `"textDocument/rename"`

##### Rename.Params

> **Params**: [`RenameParams`](../interfaces/RenameParams.md)

##### Rename.RegistrationOptions

> **RegistrationOptions**: [`RenameRegistrationOptions`](../interfaces/RenameRegistrationOptions.md)

##### Rename.Result

> **Result**: [`WorkspaceEdit`](../interfaces/WorkspaceEdit.md) \| `null`

##### Rename.ServerCapability

> **ServerCapability**: `"renameProvider"`

#### SelectionRange

> **SelectionRange**: `object`

##### SelectionRange.ClientCapability

> **ClientCapability**: `"textDocument.selectionRange"`

##### SelectionRange.Direction

> **Direction**: `"clientToServer"`

##### SelectionRange.Method

> **Method**: `"textDocument/selectionRange"`

##### SelectionRange.Params

> **Params**: [`SelectionRangeParams`](../interfaces/SelectionRangeParams.md)

##### SelectionRange.PartialResult

> **PartialResult**: [`SelectionRange`](../interfaces/SelectionRange.md)[]

##### SelectionRange.RegistrationOptions

> **RegistrationOptions**: [`SelectionRangeRegistrationOptions`](../interfaces/SelectionRangeRegistrationOptions.md)

##### SelectionRange.Result

> **Result**: [`SelectionRange`](../interfaces/SelectionRange.md)[] \| `null`

##### SelectionRange.ServerCapability

> **ServerCapability**: `"selectionRangeProvider"`

#### SemanticTokens

> **SemanticTokens**: `object`

##### SemanticTokens.ClientCapability

> **ClientCapability**: `"textDocument.semanticTokens"`

##### SemanticTokens.Direction

> **Direction**: `"clientToServer"`

##### SemanticTokens.Method

> **Method**: `"textDocument/semanticTokens/full"`

##### SemanticTokens.Params

> **Params**: [`SemanticTokensParams`](../interfaces/SemanticTokensParams.md)

##### SemanticTokens.PartialResult

> **PartialResult**: [`SemanticTokensPartialResult`](../interfaces/SemanticTokensPartialResult.md)

##### SemanticTokens.RegistrationMethod

> **RegistrationMethod**: `"textDocument/semanticTokens"`

##### SemanticTokens.RegistrationOptions

> **RegistrationOptions**: [`SemanticTokensRegistrationOptions`](../interfaces/SemanticTokensRegistrationOptions.md)

##### SemanticTokens.Result

> **Result**: [`SemanticTokens`](../interfaces/SemanticTokens.md) \| `null`

##### SemanticTokens.ServerCapability

> **ServerCapability**: `"semanticTokensProvider"`

##### SemanticTokens.Since

> **Since**: `"3.16.0"`

#### SemanticTokensDelta

> **SemanticTokensDelta**: `object`

##### SemanticTokensDelta.ClientCapability

> **ClientCapability**: `"textDocument.semanticTokens.requests.full.delta"`

##### SemanticTokensDelta.Direction

> **Direction**: `"clientToServer"`

##### SemanticTokensDelta.Method

> **Method**: `"textDocument/semanticTokens/full/delta"`

##### SemanticTokensDelta.Params

> **Params**: [`SemanticTokensDeltaParams`](../interfaces/SemanticTokensDeltaParams.md)

##### SemanticTokensDelta.PartialResult

> **PartialResult**: [`SemanticTokensPartialResult`](../interfaces/SemanticTokensPartialResult.md) \| [`SemanticTokensDeltaPartialResult`](../interfaces/SemanticTokensDeltaPartialResult.md)

##### SemanticTokensDelta.RegistrationMethod

> **RegistrationMethod**: `"textDocument/semanticTokens"`

##### SemanticTokensDelta.RegistrationOptions

> **RegistrationOptions**: [`SemanticTokensRegistrationOptions`](../interfaces/SemanticTokensRegistrationOptions.md)

##### SemanticTokensDelta.Result

> **Result**: [`SemanticTokens`](../interfaces/SemanticTokens.md) \| [`SemanticTokensDelta`](../interfaces/SemanticTokensDelta.md) \| `null`

##### SemanticTokensDelta.ServerCapability

> **ServerCapability**: `"semanticTokensProvider.full.delta"`

##### SemanticTokensDelta.Since

> **Since**: `"3.16.0"`

#### SemanticTokensRange

> **SemanticTokensRange**: `object`

##### SemanticTokensRange.ClientCapability

> **ClientCapability**: `"textDocument.semanticTokens.requests.range"`

##### SemanticTokensRange.Direction

> **Direction**: `"clientToServer"`

##### SemanticTokensRange.Method

> **Method**: `"textDocument/semanticTokens/range"`

##### SemanticTokensRange.Params

> **Params**: [`SemanticTokensRangeParams`](../interfaces/SemanticTokensRangeParams.md)

##### SemanticTokensRange.PartialResult

> **PartialResult**: [`SemanticTokensPartialResult`](../interfaces/SemanticTokensPartialResult.md)

##### SemanticTokensRange.RegistrationMethod

> **RegistrationMethod**: `"textDocument/semanticTokens"`

##### SemanticTokensRange.Result

> **Result**: [`SemanticTokens`](../interfaces/SemanticTokens.md) \| `null`

##### SemanticTokensRange.ServerCapability

> **ServerCapability**: `"semanticTokensProvider.range"`

##### SemanticTokensRange.Since

> **Since**: `"3.16.0"`

#### SignatureHelp

> **SignatureHelp**: `object`

##### SignatureHelp.ClientCapability

> **ClientCapability**: `"textDocument.signatureHelp"`

##### SignatureHelp.Direction

> **Direction**: `"clientToServer"`

##### SignatureHelp.Method

> **Method**: `"textDocument/signatureHelp"`

##### SignatureHelp.Params

> **Params**: [`SignatureHelpParams`](../interfaces/SignatureHelpParams.md)

##### SignatureHelp.RegistrationOptions

> **RegistrationOptions**: [`SignatureHelpRegistrationOptions`](../interfaces/SignatureHelpRegistrationOptions.md)

##### SignatureHelp.Result

> **Result**: [`SignatureHelp`](../interfaces/SignatureHelp.md) \| `null`

##### SignatureHelp.ServerCapability

> **ServerCapability**: `"signatureHelpProvider"`

#### TypeDefinition

> **TypeDefinition**: `object`

##### TypeDefinition.ClientCapability

> **ClientCapability**: `"textDocument.typeDefinition"`

##### TypeDefinition.Direction

> **Direction**: `"clientToServer"`

##### TypeDefinition.Method

> **Method**: `"textDocument/typeDefinition"`

##### TypeDefinition.Params

> **Params**: [`TypeDefinitionParams`](../interfaces/TypeDefinitionParams.md)

##### TypeDefinition.PartialResult

> **PartialResult**: [`Location`](../interfaces/Location.md)[] \| [`DefinitionLink`](DefinitionLink.md)[]

##### TypeDefinition.RegistrationOptions

> **RegistrationOptions**: [`TypeDefinitionRegistrationOptions`](../interfaces/TypeDefinitionRegistrationOptions.md)

##### TypeDefinition.Result

> **Result**: [`Definition`](Definition.md) \| [`DefinitionLink`](DefinitionLink.md)[] \| `null`

##### TypeDefinition.ServerCapability

> **ServerCapability**: `"typeDefinitionProvider"`

#### TypeHierarchyPrepare

> **TypeHierarchyPrepare**: `object`

##### TypeHierarchyPrepare.ClientCapability

> **ClientCapability**: `"textDocument.typeHierarchy"`

##### TypeHierarchyPrepare.Direction

> **Direction**: `"clientToServer"`

##### TypeHierarchyPrepare.Method

> **Method**: `"textDocument/prepareTypeHierarchy"`

##### TypeHierarchyPrepare.Params

> **Params**: [`TypeHierarchyPrepareParams`](TypeHierarchyPrepareParams.md)

##### TypeHierarchyPrepare.RegistrationOptions

> **RegistrationOptions**: [`TypeHierarchyRegistrationOptions`](TypeHierarchyRegistrationOptions.md)

##### TypeHierarchyPrepare.Result

> **Result**: [`TypeHierarchyItem`](TypeHierarchyItem.md)[] \| `null`

##### TypeHierarchyPrepare.ServerCapability

> **ServerCapability**: `"typeHierarchyProvider"`

##### TypeHierarchyPrepare.Since

> **Since**: `"3.17.0"`

#### WillSaveTextDocumentWaitUntil

> **WillSaveTextDocumentWaitUntil**: `object`

##### WillSaveTextDocumentWaitUntil.ClientCapability

> **ClientCapability**: `"textDocument.synchronization.willSaveWaitUntil"`

##### WillSaveTextDocumentWaitUntil.Direction

> **Direction**: `"clientToServer"`

##### WillSaveTextDocumentWaitUntil.Method

> **Method**: `"textDocument/willSaveWaitUntil"`

##### WillSaveTextDocumentWaitUntil.Params

> **Params**: [`WillSaveTextDocumentParams`](../interfaces/WillSaveTextDocumentParams.md)

##### WillSaveTextDocumentWaitUntil.RegistrationOptions

> **RegistrationOptions**: [`TextDocumentRegistrationOptions`](../interfaces/TextDocumentRegistrationOptions.md)

##### WillSaveTextDocumentWaitUntil.Result

> **Result**: [`TextEdit`](../interfaces/TextEdit.md)[] \| `null`

##### WillSaveTextDocumentWaitUntil.ServerCapability

> **ServerCapability**: `"textDocumentSync.willSaveWaitUntil"`

***

### TypeHierarchy

> **TypeHierarchy**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:465](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/namespaces.ts#L465)

#### Subtypes

> **Subtypes**: `object`

##### Subtypes.Direction

> **Direction**: `"clientToServer"`

##### Subtypes.Method

> **Method**: `"typeHierarchy/subtypes"`

##### Subtypes.Params

> **Params**: [`TypeHierarchySubtypesParams`](TypeHierarchySubtypesParams.md)

##### Subtypes.PartialResult

> **PartialResult**: [`TypeHierarchyItem`](TypeHierarchyItem.md)[]

##### Subtypes.Result

> **Result**: [`TypeHierarchyItem`](TypeHierarchyItem.md)[] \| `null`

##### Subtypes.Since

> **Since**: `"3.17.0"`

#### Supertypes

> **Supertypes**: `object`

##### Supertypes.Direction

> **Direction**: `"clientToServer"`

##### Supertypes.Method

> **Method**: `"typeHierarchy/supertypes"`

##### Supertypes.Params

> **Params**: [`TypeHierarchySupertypesParams`](TypeHierarchySupertypesParams.md)

##### Supertypes.PartialResult

> **PartialResult**: [`TypeHierarchyItem`](TypeHierarchyItem.md)[]

##### Supertypes.Result

> **Result**: [`TypeHierarchyItem`](TypeHierarchyItem.md)[] \| `null`

##### Supertypes.Since

> **Since**: `"3.17.0"`

***

### Window

> **Window**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:483](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/namespaces.ts#L483)

#### ShowDocument

> **ShowDocument**: `object`

##### ShowDocument.ClientCapability

> **ClientCapability**: `"window.showDocument.support"`

##### ShowDocument.Direction

> **Direction**: `"serverToClient"`

##### ShowDocument.Method

> **Method**: `"window/showDocument"`

##### ShowDocument.Params

> **Params**: [`ShowDocumentParams`](../interfaces/ShowDocumentParams.md)

##### ShowDocument.Result

> **Result**: [`ShowDocumentResult`](../interfaces/ShowDocumentResult.md)

##### ShowDocument.Since

> **Since**: `"3.16.0"`

#### ShowMessage

> **ShowMessage**: `object`

##### ShowMessage.ClientCapability

> **ClientCapability**: `"window.showMessage"`

##### ShowMessage.Direction

> **Direction**: `"serverToClient"`

##### ShowMessage.Method

> **Method**: `"window/showMessageRequest"`

##### ShowMessage.Params

> **Params**: [`ShowMessageRequestParams`](../interfaces/ShowMessageRequestParams.md)

##### ShowMessage.Result

> **Result**: [`MessageActionItem`](../interfaces/MessageActionItem.md) \| `null`

#### WorkDoneProgressCreate

> **WorkDoneProgressCreate**: `object`

##### WorkDoneProgressCreate.ClientCapability

> **ClientCapability**: `"window.workDoneProgress"`

##### WorkDoneProgressCreate.Direction

> **Direction**: `"serverToClient"`

##### WorkDoneProgressCreate.Method

> **Method**: `"window/workDoneProgress/create"`

##### WorkDoneProgressCreate.Params

> **Params**: [`WorkDoneProgressCreateParams`](../interfaces/WorkDoneProgressCreateParams.md)

##### WorkDoneProgressCreate.Result

> **Result**: `null`

***

### Workspace

> **Workspace**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:507](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/namespaces.ts#L507)

#### ApplyWorkspaceEdit

> **ApplyWorkspaceEdit**: `object`

##### ApplyWorkspaceEdit.ClientCapability

> **ClientCapability**: `"workspace.applyEdit"`

##### ApplyWorkspaceEdit.Direction

> **Direction**: `"serverToClient"`

##### ApplyWorkspaceEdit.Method

> **Method**: `"workspace/applyEdit"`

##### ApplyWorkspaceEdit.Params

> **Params**: [`ApplyWorkspaceEditParams`](../interfaces/ApplyWorkspaceEditParams.md)

##### ApplyWorkspaceEdit.Result

> **Result**: [`ApplyWorkspaceEditResult`](../interfaces/ApplyWorkspaceEditResult.md)

#### CodeLensRefresh

> **CodeLensRefresh**: `object`

##### CodeLensRefresh.ClientCapability

> **ClientCapability**: `"workspace.codeLens"`

##### CodeLensRefresh.Direction

> **Direction**: `"serverToClient"`

##### CodeLensRefresh.Method

> **Method**: `"workspace/codeLens/refresh"`

##### CodeLensRefresh.Params

> **Params**: `undefined`

##### CodeLensRefresh.Result

> **Result**: `null`

##### CodeLensRefresh.Since

> **Since**: `"3.16.0"`

#### Configuration

> **Configuration**: `object`

##### Configuration.ClientCapability

> **ClientCapability**: `"workspace.configuration"`

##### Configuration.Direction

> **Direction**: `"serverToClient"`

##### Configuration.Method

> **Method**: `"workspace/configuration"`

##### Configuration.Params

> **Params**: [`ConfigurationParams`](../interfaces/ConfigurationParams.md)

##### Configuration.Result

> **Result**: [`LSPAny`](LSPAny.md)[]

#### Diagnostic

> **Diagnostic**: `object`

##### Diagnostic.ClientCapability

> **ClientCapability**: `"workspace.diagnostics"`

##### Diagnostic.Direction

> **Direction**: `"clientToServer"`

##### Diagnostic.ErrorData

> **ErrorData**: [`DiagnosticServerCancellationData`](DiagnosticServerCancellationData.md)

##### Diagnostic.Method

> **Method**: `"workspace/diagnostic"`

##### Diagnostic.Params

> **Params**: [`WorkspaceDiagnosticParams`](WorkspaceDiagnosticParams.md)

##### Diagnostic.PartialResult

> **PartialResult**: [`WorkspaceDiagnosticReportPartialResult`](WorkspaceDiagnosticReportPartialResult.md)

##### Diagnostic.Result

> **Result**: [`WorkspaceDiagnosticReport`](WorkspaceDiagnosticReport.md)

##### Diagnostic.ServerCapability

> **ServerCapability**: `"diagnosticProvider.workspaceDiagnostics"`

##### Diagnostic.Since

> **Since**: `"3.17.0"`

#### DiagnosticRefresh

> **DiagnosticRefresh**: `object`

##### DiagnosticRefresh.ClientCapability

> **ClientCapability**: `"workspace.diagnostics.refreshSupport"`

##### DiagnosticRefresh.Direction

> **Direction**: `"serverToClient"`

##### DiagnosticRefresh.Method

> **Method**: `"workspace/diagnostic/refresh"`

##### DiagnosticRefresh.Params

> **Params**: `undefined`

##### DiagnosticRefresh.Result

> **Result**: `null`

##### DiagnosticRefresh.Since

> **Since**: `"3.17.0"`

#### ExecuteCommand

> **ExecuteCommand**: `object`

##### ExecuteCommand.ClientCapability

> **ClientCapability**: `"workspace.executeCommand"`

##### ExecuteCommand.Direction

> **Direction**: `"clientToServer"`

##### ExecuteCommand.Method

> **Method**: `"workspace/executeCommand"`

##### ExecuteCommand.Params

> **Params**: [`ExecuteCommandParams`](../interfaces/ExecuteCommandParams.md)

##### ExecuteCommand.RegistrationOptions

> **RegistrationOptions**: [`ExecuteCommandRegistrationOptions`](../interfaces/ExecuteCommandRegistrationOptions.md)

##### ExecuteCommand.Result

> **Result**: [`LSPAny`](LSPAny.md) \| `null`

##### ExecuteCommand.ServerCapability

> **ServerCapability**: `"executeCommandProvider"`

#### Folders

> **Folders**: `object`

##### Folders.ClientCapability

> **ClientCapability**: `"workspace.workspaceFolders"`

##### Folders.Direction

> **Direction**: `"serverToClient"`

##### Folders.Method

> **Method**: `"workspace/workspaceFolders"`

##### Folders.Params

> **Params**: `undefined`

##### Folders.Result

> **Result**: [`WorkspaceFolder`](../interfaces/WorkspaceFolder.md)[] \| `null`

##### Folders.ServerCapability

> **ServerCapability**: `"workspace.workspaceFolders"`

#### FoldingRangeRefresh

> **FoldingRangeRefresh**: `object`

##### FoldingRangeRefresh.ClientCapability

> **ClientCapability**: `"workspace.foldingRange.refreshSupport"`

##### FoldingRangeRefresh.Direction

> **Direction**: `"serverToClient"`

##### FoldingRangeRefresh.Method

> **Method**: `"workspace/foldingRange/refresh"`

##### FoldingRangeRefresh.Params

> **Params**: `undefined`

##### FoldingRangeRefresh.Proposed

> **Proposed**: `true`

##### FoldingRangeRefresh.Result

> **Result**: `null`

##### FoldingRangeRefresh.Since

> **Since**: `"3.18.0"`

#### InlayHintRefresh

> **InlayHintRefresh**: `object`

##### InlayHintRefresh.ClientCapability

> **ClientCapability**: `"workspace.inlayHint.refreshSupport"`

##### InlayHintRefresh.Direction

> **Direction**: `"serverToClient"`

##### InlayHintRefresh.Method

> **Method**: `"workspace/inlayHint/refresh"`

##### InlayHintRefresh.Params

> **Params**: `undefined`

##### InlayHintRefresh.Result

> **Result**: `null`

##### InlayHintRefresh.Since

> **Since**: `"3.17.0"`

#### InlineValueRefresh

> **InlineValueRefresh**: `object`

##### InlineValueRefresh.ClientCapability

> **ClientCapability**: `"workspace.inlineValue.refreshSupport"`

##### InlineValueRefresh.Direction

> **Direction**: `"serverToClient"`

##### InlineValueRefresh.Method

> **Method**: `"workspace/inlineValue/refresh"`

##### InlineValueRefresh.Params

> **Params**: `undefined`

##### InlineValueRefresh.Result

> **Result**: `null`

##### InlineValueRefresh.Since

> **Since**: `"3.17.0"`

#### SemanticTokensRefresh

> **SemanticTokensRefresh**: `object`

##### SemanticTokensRefresh.ClientCapability

> **ClientCapability**: `"workspace.semanticTokens.refreshSupport"`

##### SemanticTokensRefresh.Direction

> **Direction**: `"serverToClient"`

##### SemanticTokensRefresh.Method

> **Method**: `"workspace/semanticTokens/refresh"`

##### SemanticTokensRefresh.Params

> **Params**: `undefined`

##### SemanticTokensRefresh.Result

> **Result**: `null`

##### SemanticTokensRefresh.Since

> **Since**: `"3.16.0"`

#### Symbol

> **Symbol**: `object`

##### Symbol.ClientCapability

> **ClientCapability**: `"workspace.symbol"`

##### Symbol.Direction

> **Direction**: `"clientToServer"`

##### Symbol.Method

> **Method**: `"workspace/symbol"`

##### Symbol.Params

> **Params**: [`WorkspaceSymbolParams`](../interfaces/WorkspaceSymbolParams.md)

##### Symbol.PartialResult

> **PartialResult**: [`SymbolInformation`](../interfaces/SymbolInformation.md)[] \| [`WorkspaceSymbol`](../interfaces/WorkspaceSymbol.md)[]

##### Symbol.RegistrationOptions

> **RegistrationOptions**: [`WorkspaceSymbolRegistrationOptions`](../interfaces/WorkspaceSymbolRegistrationOptions.md)

##### Symbol.Result

> **Result**: [`SymbolInformation`](../interfaces/SymbolInformation.md)[] \| [`WorkspaceSymbol`](../interfaces/WorkspaceSymbol.md)[] \| `null`

##### Symbol.ServerCapability

> **ServerCapability**: `"workspaceSymbolProvider"`

##### Symbol.Since

> **Since**: `"3.17.0"`

#### TextDocumentContent

> **TextDocumentContent**: `object`

##### TextDocumentContent.ClientCapability

> **ClientCapability**: `"workspace.textDocumentContent"`

##### TextDocumentContent.Direction

> **Direction**: `"clientToServer"`

##### TextDocumentContent.Method

> **Method**: `"workspace/textDocumentContent"`

##### TextDocumentContent.Params

> **Params**: [`TextDocumentContentParams`](TextDocumentContentParams.md)

##### TextDocumentContent.Proposed

> **Proposed**: `true`

##### TextDocumentContent.RegistrationOptions

> **RegistrationOptions**: [`TextDocumentContentRegistrationOptions`](TextDocumentContentRegistrationOptions.md)

##### TextDocumentContent.Result

> **Result**: [`TextDocumentContentResult`](TextDocumentContentResult.md)

##### TextDocumentContent.ServerCapability

> **ServerCapability**: `"workspace.textDocumentContent"`

##### TextDocumentContent.Since

> **Since**: `"3.18.0"`

#### TextDocumentContentRefresh

> **TextDocumentContentRefresh**: `object`

##### TextDocumentContentRefresh.Direction

> **Direction**: `"serverToClient"`

##### TextDocumentContentRefresh.Method

> **Method**: `"workspace/textDocumentContent/refresh"`

##### TextDocumentContentRefresh.Params

> **Params**: [`TextDocumentContentRefreshParams`](TextDocumentContentRefreshParams.md)

##### TextDocumentContentRefresh.Proposed

> **Proposed**: `true`

##### TextDocumentContentRefresh.Result

> **Result**: `null`

##### TextDocumentContentRefresh.Since

> **Since**: `"3.18.0"`

#### WillCreateFiles

> **WillCreateFiles**: `object`

##### WillCreateFiles.ClientCapability

> **ClientCapability**: `"workspace.fileOperations.willCreate"`

##### WillCreateFiles.Direction

> **Direction**: `"clientToServer"`

##### WillCreateFiles.Method

> **Method**: `"workspace/willCreateFiles"`

##### WillCreateFiles.Params

> **Params**: [`CreateFilesParams`](../interfaces/CreateFilesParams.md)

##### WillCreateFiles.RegistrationOptions

> **RegistrationOptions**: [`FileOperationRegistrationOptions`](../interfaces/FileOperationRegistrationOptions.md)

##### WillCreateFiles.Result

> **Result**: [`WorkspaceEdit`](../interfaces/WorkspaceEdit.md) \| `null`

##### WillCreateFiles.ServerCapability

> **ServerCapability**: `"workspace.fileOperations.willCreate"`

##### WillCreateFiles.Since

> **Since**: `"3.16.0"`

#### WillDeleteFiles

> **WillDeleteFiles**: `object`

##### WillDeleteFiles.ClientCapability

> **ClientCapability**: `"workspace.fileOperations.willDelete"`

##### WillDeleteFiles.Direction

> **Direction**: `"clientToServer"`

##### WillDeleteFiles.Method

> **Method**: `"workspace/willDeleteFiles"`

##### WillDeleteFiles.Params

> **Params**: [`DeleteFilesParams`](../interfaces/DeleteFilesParams.md)

##### WillDeleteFiles.RegistrationOptions

> **RegistrationOptions**: [`FileOperationRegistrationOptions`](../interfaces/FileOperationRegistrationOptions.md)

##### WillDeleteFiles.Result

> **Result**: [`WorkspaceEdit`](../interfaces/WorkspaceEdit.md) \| `null`

##### WillDeleteFiles.ServerCapability

> **ServerCapability**: `"workspace.fileOperations.willDelete"`

##### WillDeleteFiles.Since

> **Since**: `"3.16.0"`

#### WillRenameFiles

> **WillRenameFiles**: `object`

##### WillRenameFiles.ClientCapability

> **ClientCapability**: `"workspace.fileOperations.willRename"`

##### WillRenameFiles.Direction

> **Direction**: `"clientToServer"`

##### WillRenameFiles.Method

> **Method**: `"workspace/willRenameFiles"`

##### WillRenameFiles.Params

> **Params**: [`RenameFilesParams`](../interfaces/RenameFilesParams.md)

##### WillRenameFiles.RegistrationOptions

> **RegistrationOptions**: [`FileOperationRegistrationOptions`](../interfaces/FileOperationRegistrationOptions.md)

##### WillRenameFiles.Result

> **Result**: [`WorkspaceEdit`](../interfaces/WorkspaceEdit.md) \| `null`

##### WillRenameFiles.ServerCapability

> **ServerCapability**: `"workspace.fileOperations.willRename"`

##### WillRenameFiles.Since

> **Since**: `"3.16.0"`

***

### WorkspaceSymbol

> **WorkspaceSymbol**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:660](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/namespaces.ts#L660)

#### Resolve

> **Resolve**: `object`

##### Resolve.ClientCapability

> **ClientCapability**: `"workspace.symbol.resolveSupport"`

##### Resolve.Direction

> **Direction**: `"clientToServer"`

##### Resolve.Method

> **Method**: `"workspaceSymbol/resolve"`

##### Resolve.Params

> **Params**: [`WorkspaceSymbol`](../interfaces/WorkspaceSymbol.md)

##### Resolve.Result

> **Result**: [`WorkspaceSymbol`](../interfaces/WorkspaceSymbol.md)

##### Resolve.ServerCapability

> **ServerCapability**: `"workspaceSymbolProvider.resolveProvider"`

##### Resolve.Since

> **Since**: `"3.17.0"`
