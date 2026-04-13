[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / LSPNotification

# Type Alias: LSPNotification

> **LSPNotification** = `object`

Defined in: [packages/core/src/protocol/namespaces.ts:673](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/namespaces.ts#L673)

LSP Notification type definitions organized by namespace

## Properties

### General

> **General**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:674](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/namespaces.ts#L674)

#### Cancel

> **Cancel**: `object`

##### Cancel.Direction

> **Direction**: `"both"`

##### Cancel.Method

> **Method**: `"$/cancelRequest"`

##### Cancel.Params

> **Params**: [`CancelParams`](CancelParams.md)

#### LogTrace

> **LogTrace**: `object`

##### LogTrace.Direction

> **Direction**: `"serverToClient"`

##### LogTrace.Method

> **Method**: `"$/logTrace"`

##### LogTrace.Params

> **Params**: [`LogTraceParams`](../interfaces/LogTraceParams.md)

#### Progress

> **Progress**: `object`

##### Progress.Direction

> **Direction**: `"both"`

##### Progress.Method

> **Method**: `"$/progress"`

##### Progress.Params

> **Params**: [`ProgressParams`](ProgressParams.md)

#### SetTrace

> **SetTrace**: `object`

##### SetTrace.Direction

> **Direction**: `"clientToServer"`

##### SetTrace.Method

> **Method**: `"$/setTrace"`

##### SetTrace.Params

> **Params**: [`SetTraceParams`](../interfaces/SetTraceParams.md)

***

### Lifecycle

> **Lifecycle**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:696](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/namespaces.ts#L696)

#### Exit

> **Exit**: `object`

##### Exit.Direction

> **Direction**: `"clientToServer"`

##### Exit.Method

> **Method**: `"exit"`

##### Exit.Params

> **Params**: `undefined`

#### Initialized

> **Initialized**: `object`

##### Initialized.Direction

> **Direction**: `"clientToServer"`

##### Initialized.Method

> **Method**: `"initialized"`

##### Initialized.Params

> **Params**: [`InitializedParams`](../interfaces/InitializedParams.md)

***

### NotebookDocument

> **NotebookDocument**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:708](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/namespaces.ts#L708)

#### DidChangeNotebookDocument

> **DidChangeNotebookDocument**: `object`

##### DidChangeNotebookDocument.Direction

> **Direction**: `"clientToServer"`

##### DidChangeNotebookDocument.Method

> **Method**: `"notebookDocument/didChange"`

##### DidChangeNotebookDocument.Params

> **Params**: [`DidChangeNotebookDocumentParams`](DidChangeNotebookDocumentParams.md)

##### DidChangeNotebookDocument.RegistrationMethod

> **RegistrationMethod**: `"notebookDocument/sync"`

##### DidChangeNotebookDocument.RegistrationOptions

> **RegistrationOptions**: [`NotebookDocumentSyncRegistrationOptions`](NotebookDocumentSyncRegistrationOptions.md)

#### DidCloseNotebookDocument

> **DidCloseNotebookDocument**: `object`

##### DidCloseNotebookDocument.Direction

> **Direction**: `"clientToServer"`

##### DidCloseNotebookDocument.Method

> **Method**: `"notebookDocument/didClose"`

##### DidCloseNotebookDocument.Params

> **Params**: [`DidCloseNotebookDocumentParams`](DidCloseNotebookDocumentParams.md)

##### DidCloseNotebookDocument.RegistrationMethod

> **RegistrationMethod**: `"notebookDocument/sync"`

##### DidCloseNotebookDocument.RegistrationOptions

> **RegistrationOptions**: [`NotebookDocumentSyncRegistrationOptions`](NotebookDocumentSyncRegistrationOptions.md)

##### DidCloseNotebookDocument.Since

> **Since**: `"3.17.0"`

#### DidOpenNotebookDocument

> **DidOpenNotebookDocument**: `object`

##### DidOpenNotebookDocument.Direction

> **Direction**: `"clientToServer"`

##### DidOpenNotebookDocument.Method

> **Method**: `"notebookDocument/didOpen"`

##### DidOpenNotebookDocument.Params

> **Params**: [`DidOpenNotebookDocumentParams`](DidOpenNotebookDocumentParams.md)

##### DidOpenNotebookDocument.RegistrationMethod

> **RegistrationMethod**: `"notebookDocument/sync"`

##### DidOpenNotebookDocument.RegistrationOptions

> **RegistrationOptions**: [`NotebookDocumentSyncRegistrationOptions`](NotebookDocumentSyncRegistrationOptions.md)

##### DidOpenNotebookDocument.Since

> **Since**: `"3.17.0"`

#### DidSaveNotebookDocument

> **DidSaveNotebookDocument**: `object`

##### DidSaveNotebookDocument.Direction

> **Direction**: `"clientToServer"`

##### DidSaveNotebookDocument.Method

> **Method**: `"notebookDocument/didSave"`

##### DidSaveNotebookDocument.Params

> **Params**: [`DidSaveNotebookDocumentParams`](DidSaveNotebookDocumentParams.md)

##### DidSaveNotebookDocument.RegistrationMethod

> **RegistrationMethod**: `"notebookDocument/sync"`

##### DidSaveNotebookDocument.RegistrationOptions

> **RegistrationOptions**: [`NotebookDocumentSyncRegistrationOptions`](NotebookDocumentSyncRegistrationOptions.md)

##### DidSaveNotebookDocument.Since

> **Since**: `"3.17.0"`

***

### Telemetry

> **Telemetry**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:741](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/namespaces.ts#L741)

#### Event

> **Event**: `object`

##### Event.Direction

> **Direction**: `"serverToClient"`

##### Event.Method

> **Method**: `"telemetry/event"`

##### Event.Params

> **Params**: [`LSPAny`](LSPAny.md)

***

### TextDocument

> **TextDocument**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:748](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/namespaces.ts#L748)

#### DidChangeTextDocument

> **DidChangeTextDocument**: `object`

##### DidChangeTextDocument.ClientCapability

> **ClientCapability**: `"textDocument.synchronization"`

##### DidChangeTextDocument.Direction

> **Direction**: `"clientToServer"`

##### DidChangeTextDocument.Method

> **Method**: `"textDocument/didChange"`

##### DidChangeTextDocument.Params

> **Params**: [`DidChangeTextDocumentParams`](../interfaces/DidChangeTextDocumentParams.md)

##### DidChangeTextDocument.RegistrationOptions

> **RegistrationOptions**: [`TextDocumentChangeRegistrationOptions`](../interfaces/TextDocumentChangeRegistrationOptions.md)

##### DidChangeTextDocument.ServerCapability

> **ServerCapability**: `"textDocumentSync"`

#### DidCloseTextDocument

> **DidCloseTextDocument**: `object`

##### DidCloseTextDocument.ClientCapability

> **ClientCapability**: `"textDocument.synchronization"`

##### DidCloseTextDocument.Direction

> **Direction**: `"clientToServer"`

##### DidCloseTextDocument.Method

> **Method**: `"textDocument/didClose"`

##### DidCloseTextDocument.Params

> **Params**: [`DidCloseTextDocumentParams`](../interfaces/DidCloseTextDocumentParams.md)

##### DidCloseTextDocument.RegistrationOptions

> **RegistrationOptions**: [`TextDocumentRegistrationOptions`](../interfaces/TextDocumentRegistrationOptions.md)

##### DidCloseTextDocument.ServerCapability

> **ServerCapability**: `"textDocumentSync.openClose"`

#### DidOpenTextDocument

> **DidOpenTextDocument**: `object`

##### DidOpenTextDocument.ClientCapability

> **ClientCapability**: `"textDocument.synchronization"`

##### DidOpenTextDocument.Direction

> **Direction**: `"clientToServer"`

##### DidOpenTextDocument.Method

> **Method**: `"textDocument/didOpen"`

##### DidOpenTextDocument.Params

> **Params**: [`DidOpenTextDocumentParams`](../interfaces/DidOpenTextDocumentParams.md)

##### DidOpenTextDocument.RegistrationOptions

> **RegistrationOptions**: [`TextDocumentRegistrationOptions`](../interfaces/TextDocumentRegistrationOptions.md)

##### DidOpenTextDocument.ServerCapability

> **ServerCapability**: `"textDocumentSync.openClose"`

#### DidSaveTextDocument

> **DidSaveTextDocument**: `object`

##### DidSaveTextDocument.ClientCapability

> **ClientCapability**: `"textDocument.synchronization.didSave"`

##### DidSaveTextDocument.Direction

> **Direction**: `"clientToServer"`

##### DidSaveTextDocument.Method

> **Method**: `"textDocument/didSave"`

##### DidSaveTextDocument.Params

> **Params**: [`DidSaveTextDocumentParams`](../interfaces/DidSaveTextDocumentParams.md)

##### DidSaveTextDocument.RegistrationOptions

> **RegistrationOptions**: [`TextDocumentSaveRegistrationOptions`](../interfaces/TextDocumentSaveRegistrationOptions.md)

##### DidSaveTextDocument.ServerCapability

> **ServerCapability**: `"textDocumentSync.save"`

#### PublishDiagnostics

> **PublishDiagnostics**: `object`

##### PublishDiagnostics.ClientCapability

> **ClientCapability**: `"textDocument.publishDiagnostics"`

##### PublishDiagnostics.Direction

> **Direction**: `"serverToClient"`

##### PublishDiagnostics.Method

> **Method**: `"textDocument/publishDiagnostics"`

##### PublishDiagnostics.Params

> **Params**: [`PublishDiagnosticsParams`](../interfaces/PublishDiagnosticsParams.md)

#### WillSaveTextDocument

> **WillSaveTextDocument**: `object`

##### WillSaveTextDocument.ClientCapability

> **ClientCapability**: `"textDocument.synchronization.willSave"`

##### WillSaveTextDocument.Direction

> **Direction**: `"clientToServer"`

##### WillSaveTextDocument.Method

> **Method**: `"textDocument/willSave"`

##### WillSaveTextDocument.Params

> **Params**: [`WillSaveTextDocumentParams`](../interfaces/WillSaveTextDocumentParams.md)

##### WillSaveTextDocument.RegistrationOptions

> **RegistrationOptions**: [`TextDocumentRegistrationOptions`](../interfaces/TextDocumentRegistrationOptions.md)

##### WillSaveTextDocument.ServerCapability

> **ServerCapability**: `"textDocumentSync.willSave"`

***

### Window

> **Window**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:796](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/namespaces.ts#L796)

#### LogMessage

> **LogMessage**: `object`

##### LogMessage.Direction

> **Direction**: `"serverToClient"`

##### LogMessage.Method

> **Method**: `"window/logMessage"`

##### LogMessage.Params

> **Params**: [`LogMessageParams`](../interfaces/LogMessageParams.md)

#### ShowMessage

> **ShowMessage**: `object`

##### ShowMessage.ClientCapability

> **ClientCapability**: `"window.showMessage"`

##### ShowMessage.Direction

> **Direction**: `"serverToClient"`

##### ShowMessage.Method

> **Method**: `"window/showMessage"`

##### ShowMessage.Params

> **Params**: [`ShowMessageParams`](../interfaces/ShowMessageParams.md)

#### WorkDoneProgressCancel

> **WorkDoneProgressCancel**: `object`

##### WorkDoneProgressCancel.Direction

> **Direction**: `"clientToServer"`

##### WorkDoneProgressCancel.Method

> **Method**: `"window/workDoneProgress/cancel"`

##### WorkDoneProgressCancel.Params

> **Params**: [`WorkDoneProgressCancelParams`](../interfaces/WorkDoneProgressCancelParams.md)

***

### Workspace

> **Workspace**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:814](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/namespaces.ts#L814)

#### DidChangeConfiguration

> **DidChangeConfiguration**: `object`

##### DidChangeConfiguration.ClientCapability

> **ClientCapability**: `"workspace.didChangeConfiguration"`

##### DidChangeConfiguration.Direction

> **Direction**: `"clientToServer"`

##### DidChangeConfiguration.Method

> **Method**: `"workspace/didChangeConfiguration"`

##### DidChangeConfiguration.Params

> **Params**: [`DidChangeConfigurationParams`](../interfaces/DidChangeConfigurationParams.md)

##### DidChangeConfiguration.RegistrationOptions

> **RegistrationOptions**: [`DidChangeConfigurationRegistrationOptions`](../interfaces/DidChangeConfigurationRegistrationOptions.md)

#### DidChangeWatchedFiles

> **DidChangeWatchedFiles**: `object`

##### DidChangeWatchedFiles.ClientCapability

> **ClientCapability**: `"workspace.didChangeWatchedFiles"`

##### DidChangeWatchedFiles.Direction

> **Direction**: `"clientToServer"`

##### DidChangeWatchedFiles.Method

> **Method**: `"workspace/didChangeWatchedFiles"`

##### DidChangeWatchedFiles.Params

> **Params**: [`DidChangeWatchedFilesParams`](../interfaces/DidChangeWatchedFilesParams.md)

##### DidChangeWatchedFiles.RegistrationOptions

> **RegistrationOptions**: [`DidChangeWatchedFilesRegistrationOptions`](../interfaces/DidChangeWatchedFilesRegistrationOptions.md)

#### DidChangeWorkspaceFolders

> **DidChangeWorkspaceFolders**: `object`

##### DidChangeWorkspaceFolders.Direction

> **Direction**: `"clientToServer"`

##### DidChangeWorkspaceFolders.Method

> **Method**: `"workspace/didChangeWorkspaceFolders"`

##### DidChangeWorkspaceFolders.Params

> **Params**: [`DidChangeWorkspaceFoldersParams`](../interfaces/DidChangeWorkspaceFoldersParams.md)

##### DidChangeWorkspaceFolders.ServerCapability

> **ServerCapability**: `"workspace.workspaceFolders.changeNotifications"`

#### DidCreateFiles

> **DidCreateFiles**: `object`

##### DidCreateFiles.ClientCapability

> **ClientCapability**: `"workspace.fileOperations.didCreate"`

##### DidCreateFiles.Direction

> **Direction**: `"clientToServer"`

##### DidCreateFiles.Method

> **Method**: `"workspace/didCreateFiles"`

##### DidCreateFiles.Params

> **Params**: [`CreateFilesParams`](../interfaces/CreateFilesParams.md)

##### DidCreateFiles.RegistrationOptions

> **RegistrationOptions**: [`FileOperationRegistrationOptions`](../interfaces/FileOperationRegistrationOptions.md)

##### DidCreateFiles.ServerCapability

> **ServerCapability**: `"workspace.fileOperations.didCreate"`

##### DidCreateFiles.Since

> **Since**: `"3.16.0"`

#### DidDeleteFiles

> **DidDeleteFiles**: `object`

##### DidDeleteFiles.ClientCapability

> **ClientCapability**: `"workspace.fileOperations.didDelete"`

##### DidDeleteFiles.Direction

> **Direction**: `"clientToServer"`

##### DidDeleteFiles.Method

> **Method**: `"workspace/didDeleteFiles"`

##### DidDeleteFiles.Params

> **Params**: [`DeleteFilesParams`](../interfaces/DeleteFilesParams.md)

##### DidDeleteFiles.RegistrationOptions

> **RegistrationOptions**: [`FileOperationRegistrationOptions`](../interfaces/FileOperationRegistrationOptions.md)

##### DidDeleteFiles.ServerCapability

> **ServerCapability**: `"workspace.fileOperations.didDelete"`

##### DidDeleteFiles.Since

> **Since**: `"3.16.0"`

#### DidRenameFiles

> **DidRenameFiles**: `object`

##### DidRenameFiles.ClientCapability

> **ClientCapability**: `"workspace.fileOperations.didRename"`

##### DidRenameFiles.Direction

> **Direction**: `"clientToServer"`

##### DidRenameFiles.Method

> **Method**: `"workspace/didRenameFiles"`

##### DidRenameFiles.Params

> **Params**: [`RenameFilesParams`](../interfaces/RenameFilesParams.md)

##### DidRenameFiles.RegistrationOptions

> **RegistrationOptions**: [`FileOperationRegistrationOptions`](../interfaces/FileOperationRegistrationOptions.md)

##### DidRenameFiles.ServerCapability

> **ServerCapability**: `"workspace.fileOperations.didRename"`

##### DidRenameFiles.Since

> **Since**: `"3.16.0"`
