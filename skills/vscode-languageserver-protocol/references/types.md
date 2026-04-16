# Types & Enums

## protocol.d

### `HandlerSignature`
```ts
RequestHandler<RegistrationParams, void, void>
```

### `HandlerSignature`
```ts
RequestHandler<UnregistrationParams, void, void>
```

## protocol.implementation.d

### `HandlerSignature`
```ts
RequestHandler<ImplementationParams, Definition | DefinitionLink[] | null, void>
```

## protocol.typeDefinition.d

### `HandlerSignature`
```ts
RequestHandler<TypeDefinitionParams, Definition | DefinitionLink[] | null, void>
```

## protocol.workspaceFolder.d

### `HandlerSignature`
```ts
RequestHandler0<WorkspaceFolder[] | null, void>
```

### `MiddlewareSignature`
```ts
(token: CancellationToken, next: HandlerSignature) => HandlerResult<WorkspaceFolder[] | null, void>
```

### `HandlerSignature`
```ts
NotificationHandler<DidChangeWorkspaceFoldersParams>
```

### `MiddlewareSignature`
```ts
(params: DidChangeWorkspaceFoldersParams, next: HandlerSignature) => void
```

## protocol.configuration.d

### `HandlerSignature`
```ts
RequestHandler<ConfigurationParams, LSPAny[], void>
```

### `MiddlewareSignature`
```ts
(params: ConfigurationParams, token: CancellationToken, next: HandlerSignature) => HandlerResult<LSPAny[], void>
```

## protocol.colorProvider.d

### `HandlerSignature`
```ts
RequestHandler<DocumentColorParams, ColorInformation[], void>
```

### `HandlerSignature`
```ts
RequestHandler<ColorPresentationParams, ColorPresentation[], void>
```

## protocol.foldingRange.d

### `HandlerSignature`
```ts
RequestHandler<FoldingRangeParams, FoldingRange[] | null, void>
```

### `HandlerSignature`
```ts
RequestHandler0<void, void>
```

## protocol.declaration.d

### `HandlerSignature`
```ts
RequestHandler<DeclarationParams, Declaration | DeclarationLink[] | null, void>
```

## protocol.selectionRange.d

### `HandlerSignature`
```ts
RequestHandler<SelectionRangeParams, SelectionRange[] | null, void>
```

## protocol.progress.d

### `HandlerSignature`
```ts
RequestHandler<WorkDoneProgressCreateParams, void, void>
```

### `HandlerSignature`
```ts
NotificationHandler<WorkDoneProgressCancelParams>
```

## protocol.callHierarchy.d

### `HandlerSignature`
```ts
RequestHandler<CallHierarchyIncomingCallsParams, CallHierarchyIncomingCall[] | null, void>
```

### `HandlerSignature`
```ts
RequestHandler<CallHierarchyOutgoingCallsParams, CallHierarchyOutgoingCall[] | null, void>
```

### `HandlerSignature`
```ts
RequestHandler<CallHierarchyPrepareParams, CallHierarchyItem[] | null, void>
```

## protocol.semanticTokens.d

### `HandlerSignature`
```ts
RequestHandler<SemanticTokensDeltaParams, SemanticTokens | null, void>
```

### `HandlerSignature`
```ts
RequestHandler<SemanticTokensDeltaParams, SemanticTokens | SemanticTokensDelta | null, void>
```

### `HandlerSignature`
```ts
RequestHandler<SemanticTokensRangeParams, SemanticTokens | null, void>
```

### `HandlerSignature`
```ts
RequestHandler0<void, void>
```

## protocol.showDocument.d

### `HandlerSignature`
```ts
RequestHandler<ShowDocumentParams, ShowDocumentResult, void>
```

### `MiddlewareSignature`
```ts
(params: ShowDocumentParams, next: HandlerSignature) => HandlerResult<ShowDocumentResult, void>
```

## protocol.linkedEditingRange.d

### `HandlerSignature`
```ts
RequestHandler<LinkedEditingRangeParams, LinkedEditingRanges | null, void>
```

## protocol.fileOperations.d

### `HandlerSignature`
```ts
NotificationHandler<CreateFilesParams>
```

### `HandlerSignature`
```ts
RequestHandler<CreateFilesParams, WorkspaceEdit | undefined | null, void>
```

### `HandlerSignature`
```ts
NotificationHandler<RenameFilesParams>
```

### `HandlerSignature`
```ts
RequestHandler<RenameFilesParams, WorkspaceEdit | undefined | null, void>
```

### `HandlerSignature`
```ts
NotificationHandler<DeleteFilesParams>
```

### `HandlerSignature`
```ts
RequestHandler<DeleteFilesParams, WorkspaceEdit | undefined | null, void>
```

## protocol.typeHierarchy.d

### `HandlerSignature`
```ts
RequestHandler<TypeHierarchyPrepareParams, TypeHierarchyItem[] | null, void>
```

### `HandlerSignature`
```ts
RequestHandler<TypeHierarchySubtypesParams, TypeHierarchyItem[] | null, void>
```

### `HandlerSignature`
```ts
RequestHandler<TypeHierarchySupertypesParams, TypeHierarchyItem[] | null, void>
```

## protocol.inlineValue.d

### `HandlerSignature`
```ts
RequestHandler<InlineValueParams, InlineValue[] | null, void>
```

### `HandlerSignature`
```ts
RequestHandler0<void, void>
```

## protocol.inlayHint.d

### `HandlerSignature`
```ts
RequestHandler<InlayHintParams, InlayHint[] | null, void>
```

### `HandlerSignature`
```ts
RequestHandler<InlayHint, InlayHint, void>
```

### `HandlerSignature`
```ts
RequestHandler0<void, void>
```

## protocol.diagnostic.d

### `HandlerSignature`
```ts
RequestHandler<DocumentDiagnosticParams, DocumentDiagnosticReport, void>
```

### `HandlerSignature`
```ts
RequestHandler<WorkspaceDiagnosticParams, WorkspaceDiagnosticReport | null, void>
```

### `HandlerSignature`
```ts
RequestHandler0<void, void>
```

## protocol.inlineCompletion.d

### `HandlerSignature`
```ts
RequestHandler<InlineCompletionParams, InlineCompletionList | InlineCompletionItem[] | null, void>
```
