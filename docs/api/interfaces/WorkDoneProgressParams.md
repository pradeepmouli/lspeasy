[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WorkDoneProgressParams

# Interface: WorkDoneProgressParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:223

## Extended by

- [`_InitializeParams`](InitializeParams.md)
- [`CompletionParams`](CompletionParams.md)
- [`HoverParams`](HoverParams.md)
- [`SignatureHelpParams`](SignatureHelpParams.md)
- [`DefinitionParams`](DefinitionParams.md)
- [`ReferenceParams`](ReferenceParams.md)
- [`DocumentHighlightParams`](DocumentHighlightParams.md)
- [`DocumentSymbolParams`](DocumentSymbolParams.md)
- [`CodeActionParams`](CodeActionParams.md)
- [`WorkspaceSymbolParams`](WorkspaceSymbolParams.md)
- [`CodeLensParams`](CodeLensParams.md)
- [`DocumentLinkParams`](DocumentLinkParams.md)
- [`DocumentFormattingParams`](DocumentFormattingParams.md)
- [`DocumentRangeFormattingParams`](DocumentRangeFormattingParams.md)
- [`DocumentRangesFormattingParams`](DocumentRangesFormattingParams.md)
- [`RenameParams`](RenameParams.md)
- [`PrepareRenameParams`](PrepareRenameParams.md)
- [`ExecuteCommandParams`](ExecuteCommandParams.md)
- [`ImplementationParams`](ImplementationParams.md)
- [`TypeDefinitionParams`](TypeDefinitionParams.md)
- [`DocumentColorParams`](DocumentColorParams.md)
- [`ColorPresentationParams`](ColorPresentationParams.md)
- [`FoldingRangeParams`](FoldingRangeParams.md)
- [`DeclarationParams`](DeclarationParams.md)
- [`SelectionRangeParams`](SelectionRangeParams.md)
- [`CallHierarchyIncomingCallsParams`](CallHierarchyIncomingCallsParams.md)
- [`CallHierarchyOutgoingCallsParams`](CallHierarchyOutgoingCallsParams.md)
- [`CallHierarchyPrepareParams`](CallHierarchyPrepareParams.md)
- [`SemanticTokensParams`](SemanticTokensParams.md)
- [`SemanticTokensDeltaParams`](SemanticTokensDeltaParams.md)
- [`SemanticTokensRangeParams`](SemanticTokensRangeParams.md)
- [`LinkedEditingRangeParams`](LinkedEditingRangeParams.md)
- [`MonikerParams`](MonikerParams.md)

## Properties

### workDoneToken?

> `optional` **workDoneToken?**: [`ProgressToken`](../type-aliases/ProgressToken.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:227

An optional token that a server can use to report work done progress.
