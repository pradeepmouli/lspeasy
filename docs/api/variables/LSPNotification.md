[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / LSPNotification

# ~~Variable: LSPNotification~~

> **LSPNotification**: `object`

Defined in: [packages/core/src/protocol/namespaces.ts:673](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/protocol/namespaces.ts#L673)

LSP Notification methods organized by namespace

## Type Declaration

### ~~General~~

> `readonly` **General**: `object`

#### General.Cancel

> `readonly` **Cancel**: `object`

#### General.Cancel.Direction

> `readonly` **Direction**: `"both"` = `'both'`

#### General.Cancel.Method

> `readonly` **Method**: `"$/cancelRequest"` = `'$/cancelRequest'`

#### General.LogTrace

> `readonly` **LogTrace**: `object`

#### General.LogTrace.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### General.LogTrace.Method

> `readonly` **Method**: `"$/logTrace"` = `'$/logTrace'`

#### General.Progress

> `readonly` **Progress**: `object`

#### General.Progress.Direction

> `readonly` **Direction**: `"both"` = `'both'`

#### General.Progress.Method

> `readonly` **Method**: `"$/progress"` = `'$/progress'`

#### General.SetTrace

> `readonly` **SetTrace**: `object`

#### General.SetTrace.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### General.SetTrace.Method

> `readonly` **Method**: `"$/setTrace"` = `'$/setTrace'`

### ~~Lifecycle~~

> `readonly` **Lifecycle**: `object`

#### Lifecycle.Exit

> `readonly` **Exit**: `object`

#### Lifecycle.Exit.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Lifecycle.Exit.Method

> `readonly` **Method**: `"exit"` = `'exit'`

#### Lifecycle.Initialized

> `readonly` **Initialized**: `object`

#### Lifecycle.Initialized.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Lifecycle.Initialized.Method

> `readonly` **Method**: `"initialized"` = `'initialized'`

### ~~NotebookDocument~~

> `readonly` **NotebookDocument**: `object`

#### NotebookDocument.DidChangeNotebookDocument

> `readonly` **DidChangeNotebookDocument**: `object`

#### NotebookDocument.DidChangeNotebookDocument.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### NotebookDocument.DidChangeNotebookDocument.Method

> `readonly` **Method**: `"notebookDocument/didChange"` = `'notebookDocument/didChange'`

#### NotebookDocument.DidChangeNotebookDocument.RegistrationMethod

> `readonly` **RegistrationMethod**: `"notebookDocument/sync"` = `'notebookDocument/sync'`

#### NotebookDocument.DidCloseNotebookDocument

> `readonly` **DidCloseNotebookDocument**: `object`

#### NotebookDocument.DidCloseNotebookDocument.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### NotebookDocument.DidCloseNotebookDocument.Method

> `readonly` **Method**: `"notebookDocument/didClose"` = `'notebookDocument/didClose'`

#### NotebookDocument.DidCloseNotebookDocument.RegistrationMethod

> `readonly` **RegistrationMethod**: `"notebookDocument/sync"` = `'notebookDocument/sync'`

#### NotebookDocument.DidOpenNotebookDocument

> `readonly` **DidOpenNotebookDocument**: `object`

#### NotebookDocument.DidOpenNotebookDocument.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### NotebookDocument.DidOpenNotebookDocument.Method

> `readonly` **Method**: `"notebookDocument/didOpen"` = `'notebookDocument/didOpen'`

#### NotebookDocument.DidOpenNotebookDocument.RegistrationMethod

> `readonly` **RegistrationMethod**: `"notebookDocument/sync"` = `'notebookDocument/sync'`

#### NotebookDocument.DidSaveNotebookDocument

> `readonly` **DidSaveNotebookDocument**: `object`

#### NotebookDocument.DidSaveNotebookDocument.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### NotebookDocument.DidSaveNotebookDocument.Method

> `readonly` **Method**: `"notebookDocument/didSave"` = `'notebookDocument/didSave'`

#### NotebookDocument.DidSaveNotebookDocument.RegistrationMethod

> `readonly` **RegistrationMethod**: `"notebookDocument/sync"` = `'notebookDocument/sync'`

### ~~Telemetry~~

> `readonly` **Telemetry**: `object`

#### Telemetry.Event

> `readonly` **Event**: `object`

#### Telemetry.Event.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Telemetry.Event.Method

> `readonly` **Method**: `"telemetry/event"` = `'telemetry/event'`

### ~~TextDocument~~

> `readonly` **TextDocument**: `object`

#### TextDocument.DidChangeTextDocument

> `readonly` **DidChangeTextDocument**: `object`

#### TextDocument.DidChangeTextDocument.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.synchronization"` = `'textDocument.synchronization'`

#### TextDocument.DidChangeTextDocument.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.DidChangeTextDocument.Method

> `readonly` **Method**: `"textDocument/didChange"` = `'textDocument/didChange'`

#### TextDocument.DidChangeTextDocument.ServerCapability

> `readonly` **ServerCapability**: `"textDocumentSync"` = `'textDocumentSync'`

#### TextDocument.DidCloseTextDocument

> `readonly` **DidCloseTextDocument**: `object`

#### TextDocument.DidCloseTextDocument.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.synchronization"` = `'textDocument.synchronization'`

#### TextDocument.DidCloseTextDocument.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.DidCloseTextDocument.Method

> `readonly` **Method**: `"textDocument/didClose"` = `'textDocument/didClose'`

#### TextDocument.DidCloseTextDocument.ServerCapability

> `readonly` **ServerCapability**: `"textDocumentSync.openClose"` = `'textDocumentSync.openClose'`

#### TextDocument.DidOpenTextDocument

> `readonly` **DidOpenTextDocument**: `object`

#### TextDocument.DidOpenTextDocument.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.synchronization"` = `'textDocument.synchronization'`

#### TextDocument.DidOpenTextDocument.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.DidOpenTextDocument.Method

> `readonly` **Method**: `"textDocument/didOpen"` = `'textDocument/didOpen'`

#### TextDocument.DidOpenTextDocument.ServerCapability

> `readonly` **ServerCapability**: `"textDocumentSync.openClose"` = `'textDocumentSync.openClose'`

#### TextDocument.DidSaveTextDocument

> `readonly` **DidSaveTextDocument**: `object`

#### TextDocument.DidSaveTextDocument.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.synchronization.didSave"` = `'textDocument.synchronization.didSave'`

#### TextDocument.DidSaveTextDocument.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.DidSaveTextDocument.Method

> `readonly` **Method**: `"textDocument/didSave"` = `'textDocument/didSave'`

#### TextDocument.DidSaveTextDocument.ServerCapability

> `readonly` **ServerCapability**: `"textDocumentSync.save"` = `'textDocumentSync.save'`

#### TextDocument.PublishDiagnostics

> `readonly` **PublishDiagnostics**: `object`

#### TextDocument.PublishDiagnostics.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.publishDiagnostics"` = `'textDocument.publishDiagnostics'`

#### TextDocument.PublishDiagnostics.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### TextDocument.PublishDiagnostics.Method

> `readonly` **Method**: `"textDocument/publishDiagnostics"` = `'textDocument/publishDiagnostics'`

#### TextDocument.WillSaveTextDocument

> `readonly` **WillSaveTextDocument**: `object`

#### TextDocument.WillSaveTextDocument.ClientCapability

> `readonly` **ClientCapability**: `"textDocument.synchronization.willSave"` = `'textDocument.synchronization.willSave'`

#### TextDocument.WillSaveTextDocument.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### TextDocument.WillSaveTextDocument.Method

> `readonly` **Method**: `"textDocument/willSave"` = `'textDocument/willSave'`

#### TextDocument.WillSaveTextDocument.ServerCapability

> `readonly` **ServerCapability**: `"textDocumentSync.willSave"` = `'textDocumentSync.willSave'`

### ~~Window~~

> `readonly` **Window**: `object`

#### Window.LogMessage

> `readonly` **LogMessage**: `object`

#### Window.LogMessage.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Window.LogMessage.Method

> `readonly` **Method**: `"window/logMessage"` = `'window/logMessage'`

#### Window.ShowMessage

> `readonly` **ShowMessage**: `object`

#### Window.ShowMessage.ClientCapability

> `readonly` **ClientCapability**: `"window.showMessage"` = `'window.showMessage'`

#### Window.ShowMessage.Direction

> `readonly` **Direction**: `"serverToClient"` = `'serverToClient'`

#### Window.ShowMessage.Method

> `readonly` **Method**: `"window/showMessage"` = `'window/showMessage'`

#### Window.WorkDoneProgressCancel

> `readonly` **WorkDoneProgressCancel**: `object`

#### Window.WorkDoneProgressCancel.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Window.WorkDoneProgressCancel.Method

> `readonly` **Method**: `"window/workDoneProgress/cancel"` = `'window/workDoneProgress/cancel'`

### ~~Workspace~~

> `readonly` **Workspace**: `object`

#### Workspace.DidChangeConfiguration

> `readonly` **DidChangeConfiguration**: `object`

#### Workspace.DidChangeConfiguration.ClientCapability

> `readonly` **ClientCapability**: `"workspace.didChangeConfiguration"` = `'workspace.didChangeConfiguration'`

#### Workspace.DidChangeConfiguration.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Workspace.DidChangeConfiguration.Method

> `readonly` **Method**: `"workspace/didChangeConfiguration"` = `'workspace/didChangeConfiguration'`

#### Workspace.DidChangeWatchedFiles

> `readonly` **DidChangeWatchedFiles**: `object`

#### Workspace.DidChangeWatchedFiles.ClientCapability

> `readonly` **ClientCapability**: `"workspace.didChangeWatchedFiles"` = `'workspace.didChangeWatchedFiles'`

#### Workspace.DidChangeWatchedFiles.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Workspace.DidChangeWatchedFiles.Method

> `readonly` **Method**: `"workspace/didChangeWatchedFiles"` = `'workspace/didChangeWatchedFiles'`

#### Workspace.DidChangeWorkspaceFolders

> `readonly` **DidChangeWorkspaceFolders**: `object`

#### Workspace.DidChangeWorkspaceFolders.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Workspace.DidChangeWorkspaceFolders.Method

> `readonly` **Method**: `"workspace/didChangeWorkspaceFolders"` = `'workspace/didChangeWorkspaceFolders'`

#### Workspace.DidChangeWorkspaceFolders.ServerCapability

> `readonly` **ServerCapability**: `"workspace.workspaceFolders.changeNotifications"` = `'workspace.workspaceFolders.changeNotifications'`

#### Workspace.DidCreateFiles

> `readonly` **DidCreateFiles**: `object`

#### Workspace.DidCreateFiles.ClientCapability

> `readonly` **ClientCapability**: `"workspace.fileOperations.didCreate"` = `'workspace.fileOperations.didCreate'`

#### Workspace.DidCreateFiles.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Workspace.DidCreateFiles.Method

> `readonly` **Method**: `"workspace/didCreateFiles"` = `'workspace/didCreateFiles'`

#### Workspace.DidCreateFiles.ServerCapability

> `readonly` **ServerCapability**: `"workspace.fileOperations.didCreate"` = `'workspace.fileOperations.didCreate'`

#### Workspace.DidDeleteFiles

> `readonly` **DidDeleteFiles**: `object`

#### Workspace.DidDeleteFiles.ClientCapability

> `readonly` **ClientCapability**: `"workspace.fileOperations.didDelete"` = `'workspace.fileOperations.didDelete'`

#### Workspace.DidDeleteFiles.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Workspace.DidDeleteFiles.Method

> `readonly` **Method**: `"workspace/didDeleteFiles"` = `'workspace/didDeleteFiles'`

#### Workspace.DidDeleteFiles.ServerCapability

> `readonly` **ServerCapability**: `"workspace.fileOperations.didDelete"` = `'workspace.fileOperations.didDelete'`

#### Workspace.DidRenameFiles

> `readonly` **DidRenameFiles**: `object`

#### Workspace.DidRenameFiles.ClientCapability

> `readonly` **ClientCapability**: `"workspace.fileOperations.didRename"` = `'workspace.fileOperations.didRename'`

#### Workspace.DidRenameFiles.Direction

> `readonly` **Direction**: `"clientToServer"` = `'clientToServer'`

#### Workspace.DidRenameFiles.Method

> `readonly` **Method**: `"workspace/didRenameFiles"` = `'workspace/didRenameFiles'`

#### Workspace.DidRenameFiles.ServerCapability

> `readonly` **ServerCapability**: `"workspace.fileOperations.didRename"` = `'workspace.fileOperations.didRename'`

## Deprecated

Use individual namespace exports instead
