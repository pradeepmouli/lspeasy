# protocol

| Function | Description |
|----------|-------------|
| [getCapabilityForRequestMethod](get-capability-for-request-method.md) | Get the server capability key for a given request method at runtime. |
| [getClientCapabilityForRequestMethod](get-client-capability-for-request-method.md) | Get the client capability key for a given request method at runtime. |
| [getCapabilityForNotificationMethod](get-capability-for-notification-method.md) | Get the server capability key for a given notification method at runtime. |
| [getClientCapabilityForNotificationMethod](get-client-capability-for-notification-method.md) | Get the client capability key for a given notification method at runtime. |
| [getDefinitionForRequest](get-definition-for-request.md) | Retrieves the full definition object for a given LSP request method by
namespace and method key. |
| [getDefinitionForNotification](get-definition-for-notification.md) | Retrieves the full definition object for a given LSP notification method by
namespace and method key. |
| [serverSupportsRequest](server-supports-request.md) | Type-guarding predicate that narrows `capabilities` to include the specific
server capability key required for the given client-to-server request method. |
| [serverSupportsNotification](server-supports-notification.md) | Type-guarding predicate that narrows `capabilities` to include the specific
server capability key required for the given client-to-server notification method. |
| [clientSupportsRequest](client-supports-request.md) | Type-guarding predicate that narrows `capabilities` to include the specific
client capability key required for the given server-to-client request method. |
| [clientSupportsNotification](client-supports-notification.md) | Type-guarding predicate that narrows `capabilities` to include the specific
client capability key required for the given server-to-client notification method. |
| [hasServerCapability](has-server-capability.md) | Type-guarding predicate that narrows `capabilities` to confirm a specific server capability
is enabled at a deep dot-notation path. |
| [hasClientCapability](has-client-capability.md) | Type-guarding predicate that narrows `capabilities` to confirm a specific client capability
is enabled at a deep dot-notation path. |
| [supportsHover](supports-hover.md) | Returns `true` when `hoverProvider` is declared in the server capabilities. |
| [supportsCompletion](supports-completion.md) | Returns `true` when `completionProvider` is declared in the server capabilities. |
| [supportsDefinition](supports-definition.md) | Returns `true` when `definitionProvider` is declared in the server capabilities. |
| [supportsReferences](supports-references.md) | Returns `true` when `referencesProvider` is declared in the server capabilities. |
| [supportsDocumentSymbol](supports-document-symbol.md) | Returns `true` when `documentSymbolProvider` is declared in the server capabilities. |
| [supportsWorkspaceFolders](supports-workspace-folders.md) | Returns `true` when the server supports workspace folders. |
| [supportsNotebookDocumentSync](supports-notebook-document-sync.md) | Helper to check if notebook document sync is supported by the server. |
| [supportsFileWatching](supports-file-watching.md) | Returns `true` when the client supports dynamic file watching registration. |
| [supportsWorkDoneProgress](supports-work-done-progress.md) | Returns `true` when the client supports work done progress notifications. |
| [getSchemaForMethod](get-schema-for-method.md) | Looks up the Zod validation schema for a given LSP method. |
| [getResultSchemaForMethod](get-result-schema-for-method.md) | Looks up the result schema for a request method.
Returns `undefined` for notifications or unknown methods. |
| [createWorkspaceFolder](create-workspace-folder.md) | Helper to create a WorkspaceFolder. |
| [createWorkspaceFoldersChangeEvent](create-workspace-folders-change-event.md) | Helper to create a WorkspaceFoldersChangeEvent. |
| [createFileEvent](create-file-event.md) | Helper to create a FileEvent. |
| [createFileSystemWatcher](create-file-system-watcher.md) | Helper to create a FileSystemWatcher. |
| [createDidChangeWatchedFilesParams](create-did-change-watched-files-params.md) | Helper to create DidChangeWatchedFilesParams. |
| [createProgressBegin](create-progress-begin.md) | Creates a `WorkDoneProgressBegin` payload to start a work-done progress notification. |
| [createProgressReport](create-progress-report.md) | Creates a `WorkDoneProgressReport` payload to update an in-progress work-done notification. |
| [createProgressEnd](create-progress-end.md) | Creates a `WorkDoneProgressEnd` payload to close a work-done progress notification. |
| [createProgressCreateParams](create-progress-create-params.md) | Creates `WorkDoneProgressCreateParams` for a `window/workDoneProgress/create` request. |
| [createProgressToken](create-progress-token.md) | Generate a unique progress token |
| [createPartialResultParams](create-partial-result-params.md) | Creates `PartialResultParams` with the given partial result token. |
| [hasPartialResultToken](has-partial-result-token.md) | Type guard to check if params support partial results. |
| [getPartialResultToken](get-partial-result-token.md) | Extracts the partial result token from params. |
| [isRegisterCapabilityParams](is-register-capability-params.md) | Runtime guard for register-capability params. |
| [isUnregisterCapabilityParams](is-unregister-capability-params.md) | Runtime guard for unregister-capability params. |