# protocol

| Class | Description |
|-------|-------------|
| [getCapabilityForRequestMethod](getcapabilityforrequestmethod.md) | Get the server capability key for a given request method at runtime. |
| [getClientCapabilityForRequestMethod](getclientcapabilityforrequestmethod.md) | Get the client capability key for a given request method at runtime. |
| [getCapabilityForNotificationMethod](getcapabilityfornotificationmethod.md) | Get the server capability key for a given notification method at runtime. |
| [getClientCapabilityForNotificationMethod](getclientcapabilityfornotificationmethod.md) | Get the client capability key for a given notification method at runtime. |
| [getDefinitionForRequest](getdefinitionforrequest.md) | Retrieves the full definition object for a given LSP request method by
namespace and method key. |
| [getDefinitionForNotification](getdefinitionfornotification.md) | Retrieves the full definition object for a given LSP notification method by
namespace and method key. |
| [serverSupportsRequest](serversupportsrequest.md) | Type-guarding predicate that narrows `capabilities` to include the specific
server capability key required for the given client-to-server request method. |
| [serverSupportsNotification](serversupportsnotification.md) | Type-guarding predicate that narrows `capabilities` to include the specific
server capability key required for the given client-to-server notification method. |
| [clientSupportsRequest](clientsupportsrequest.md) | Type-guarding predicate that narrows `capabilities` to include the specific
client capability key required for the given server-to-client request method. |
| [clientSupportsNotification](clientsupportsnotification.md) | Type-guarding predicate that narrows `capabilities` to include the specific
client capability key required for the given server-to-client notification method. |
| [hasServerCapability](hasservercapability.md) | Type-guarding predicate that narrows `capabilities` to confirm a specific server capability
is enabled at a deep dot-notation path. |
| [hasClientCapability](hasclientcapability.md) | Type-guarding predicate that narrows `capabilities` to confirm a specific client capability
is enabled at a deep dot-notation path. |
| [supportsHover](supportshover.md) | Returns `true` when `hoverProvider` is declared in the server capabilities. |
| [supportsCompletion](supportscompletion.md) | Returns `true` when `completionProvider` is declared in the server capabilities. |
| [supportsDefinition](supportsdefinition.md) | Returns `true` when `definitionProvider` is declared in the server capabilities. |
| [supportsReferences](supportsreferences.md) | Returns `true` when `referencesProvider` is declared in the server capabilities. |
| [supportsDocumentSymbol](supportsdocumentsymbol.md) | Returns `true` when `documentSymbolProvider` is declared in the server capabilities. |
| [supportsWorkspaceFolders](supportsworkspacefolders.md) | Returns `true` when the server supports workspace folders. |
| [supportsNotebookDocumentSync](supportsnotebookdocumentsync.md) | Helper to check if notebook document sync is supported by the server. |
| [supportsFileWatching](supportsfilewatching.md) | Returns `true` when the client supports dynamic file watching registration. |
| [supportsWorkDoneProgress](supportsworkdoneprogress.md) | Returns `true` when the client supports work done progress notifications. |
| [getSchemaForMethod](getschemaformethod.md) | Looks up the Zod validation schema for a given LSP method. |
| [createWorkspaceFolder](createworkspacefolder.md) | Helper to create a WorkspaceFolder. |
| [createWorkspaceFoldersChangeEvent](createworkspacefolderschangeevent.md) | Helper to create a WorkspaceFoldersChangeEvent. |
| [createFileEvent](createfileevent.md) | Helper to create a FileEvent. |
| [createFileSystemWatcher](createfilesystemwatcher.md) | Helper to create a FileSystemWatcher. |
| [createDidChangeWatchedFilesParams](createdidchangewatchedfilesparams.md) | Helper to create DidChangeWatchedFilesParams. |
| [createProgressBegin](createprogressbegin.md) | Creates a `WorkDoneProgressBegin` payload to start a work-done progress notification. |
| [createProgressReport](createprogressreport.md) | Creates a `WorkDoneProgressReport` payload to update an in-progress work-done notification. |
| [createProgressEnd](createprogressend.md) | Creates a `WorkDoneProgressEnd` payload to close a work-done progress notification. |
| [createProgressCreateParams](createprogresscreateparams.md) | Creates `WorkDoneProgressCreateParams` for a `window/workDoneProgress/create` request. |
| [createProgressToken](createprogresstoken.md) | Generate a unique progress token |
| [createPartialResultParams](createpartialresultparams.md) | Creates `PartialResultParams` with the given partial result token. |
| [hasPartialResultToken](haspartialresulttoken.md) | Type guard to check if params support partial results. |
| [getPartialResultToken](getpartialresulttoken.md) | Extracts the partial result token from params. |
| [isRegisterCapabilityParams](isregistercapabilityparams.md) | Runtime guard for register-capability params. |
| [isUnregisterCapabilityParams](isunregistercapabilityparams.md) | Runtime guard for unregister-capability params. |