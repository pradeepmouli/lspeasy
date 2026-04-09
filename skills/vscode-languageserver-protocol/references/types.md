# Types & Enums

## Types

### `HandlerSignature`
```ts
RequestHandler<RegistrationParams, void, void>
```

### `HandlerSignature`
```ts
RequestHandler<UnregistrationParams, void, void>
```

### `HandlerSignature`
```ts
RequestHandler<ImplementationParams, Definition | DefinitionLink[] | null, void>
```

### `HandlerSignature`
```ts
RequestHandler<TypeDefinitionParams, Definition | DefinitionLink[] | null, void>
```

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

### `HandlerSignature`
```ts
RequestHandler<ConfigurationParams, LSPAny[], void>
```

### `MiddlewareSignature`
```ts
(params: ConfigurationParams, token: CancellationToken, next: HandlerSignature) => HandlerResult<LSPAny[], void>
```

### `HandlerSignature`
```ts
RequestHandler<DocumentColorParams, ColorInformation[], void>
```

### `HandlerSignature`
```ts
RequestHandler<ColorPresentationParams, ColorPresentation[], void>
```

### `HandlerSignature`
```ts
RequestHandler<FoldingRangeParams, FoldingRange[] | null, void>
```

### `HandlerSignature`
```ts
RequestHandler0<void, void>
```

### `HandlerSignature`
```ts
RequestHandler<DeclarationParams, Declaration | DeclarationLink[] | null, void>
```

### `HandlerSignature`
```ts
RequestHandler<SelectionRangeParams, SelectionRange[] | null, void>
```

### `HandlerSignature`
```ts
RequestHandler<WorkDoneProgressCreateParams, void, void>
```

### `HandlerSignature`
```ts
NotificationHandler<WorkDoneProgressCancelParams>
```

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

### `HandlerSignature`
```ts
RequestHandler<ShowDocumentParams, ShowDocumentResult, void>
```

### `MiddlewareSignature`
```ts
(params: ShowDocumentParams, next: HandlerSignature) => HandlerResult<ShowDocumentResult, void>
```

### `HandlerSignature`
```ts
RequestHandler<LinkedEditingRangeParams, LinkedEditingRanges | null, void>
```

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

### `HandlerSignature`
```ts
RequestHandler<InlineValueParams, InlineValue[] | null, void>
```

### `HandlerSignature`
```ts
RequestHandler0<void, void>
```

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

### `HandlerSignature`
```ts
RequestHandler<InlineCompletionParams, InlineCompletionList | InlineCompletionItem[] | null, void>
```
