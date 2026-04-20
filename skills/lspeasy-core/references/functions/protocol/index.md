# protocol

| Class | Description |
|-------|-------------|
| [getCapabilityForRequestMethod](getcapabilityforrequestmethod.md) | Get the capability key for a given method at runtime |
| [getClientCapabilityForRequestMethod](getclientcapabilityforrequestmethod.md) | Get the client capability key for a given request method at runtime |
| [getCapabilityForNotificationMethod](getcapabilityfornotificationmethod.md) | Get the capability key for a given notification method at runtime |
| [getClientCapabilityForNotificationMethod](getclientcapabilityfornotificationmethod.md) | Get the client capability key for a given notification method at runtime |
| [getDefinitionForRequest](getdefinitionforrequest.md) | Retrieves the full definition object for a given LSP request method by
namespace and method key. |
| [getDefinitionForNotification](getdefinitionfornotification.md) | Retrieves the full definition object for a given LSP notification method by
namespace and method key. |
| [serverSupportsRequest](serversupportsrequest.md) | Check if a method is supported by the given server capabilities |
| [serverSupportsNotification](serversupportsnotification.md) | Type-guarding predicate that narrows `capabilities` to include the specific
server capability key required for the given client-to-server notification method. |
| [clientSupportsRequest](clientsupportsrequest.md) | Check if a method is supported by the given client capabilities |
| [clientSupportsNotification](clientsupportsnotification.md) | Type-guarding predicate that narrows `capabilities` to include the specific
client capability key required for the given server-to-client notification method. |
| [hasServerCapability](hasservercapability.md) | Check if a server capability is enabled |
| [hasClientCapability](hasclientcapability.md) | Check if a client capability is enabled |
| [supportsHover](supportshover.md) | Helper to check if hover is supported |
| [supportsCompletion](supportscompletion.md) | Helper to check if completion is supported |
| [supportsDefinition](supportsdefinition.md) | Helper to check if definition is supported |
| [supportsReferences](supportsreferences.md) | Helper to check if references are supported |
| [supportsDocumentSymbol](supportsdocumentsymbol.md) | Helper to check if document symbols are supported |
| [supportsWorkspaceFolders](supportsworkspacefolders.md) | Helper to check if workspace folders are supported |
| [supportsNotebookDocumentSync](supportsnotebookdocumentsync.md) | Helper to check if notebook document sync is supported by the server. |
| [supportsFileWatching](supportsfilewatching.md) | Helper to check if file watching is supported |
| [supportsWorkDoneProgress](supportsworkdoneprogress.md) | Helper to check if work done progress is supported |
| [getSchemaForMethod](getschemaformethod.md) | Get schema for a given method |
| [createWorkspaceFolder](createworkspacefolder.md) | Helper to create a WorkspaceFolder |
| [createWorkspaceFoldersChangeEvent](createworkspacefolderschangeevent.md) | Helper to create a WorkspaceFoldersChangeEvent |
| [createFileEvent](createfileevent.md) | Helper to create a FileEvent |
| [createFileSystemWatcher](createfilesystemwatcher.md) | Helper to create a FileSystemWatcher |
| [createDidChangeWatchedFilesParams](createdidchangewatchedfilesparams.md) | Helper to create DidChangeWatchedFilesParams |
| [createProgressBegin](createprogressbegin.md) | Creates a `WorkDoneProgressBegin` payload to start a work-done progress notification. |
| [createProgressReport](createprogressreport.md) | Creates a `WorkDoneProgressReport` payload to update an in-progress work-done notification. |
| [createProgressEnd](createprogressend.md) | Helper to create a progress end notification |
| [createProgressCreateParams](createprogresscreateparams.md) | Helper to create progress create params |
| [createProgressToken](createprogresstoken.md) | Generate a unique progress token |
| [createPartialResultParams](createpartialresultparams.md) | Helper to create partial result params |
| [hasPartialResultToken](haspartialresulttoken.md) | Type guard to check if params support partial results |
| [getPartialResultToken](getpartialresulttoken.md) | Helper to extract partial result token from params |
| [isRegisterCapabilityParams](isregistercapabilityparams.md) | Runtime guard for register-capability params. |
| [isUnregisterCapabilityParams](isunregistercapabilityparams.md) | Runtime guard for unregister-capability params. |