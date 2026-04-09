# Variables & Constants

## `lspReservedErrorRangeStart`
This is the start range of LSP reserved error codes.
It doesn't denote a real error code.
```ts
const lspReservedErrorRangeStart: integer
```

## `RequestFailed`
A request failed but it was syntactically correct, e.g the
method name was known and the parameters were valid. The error
message should contain human readable information about why
the request failed.
```ts
const RequestFailed: integer
```

## `ServerCancelled`
The server cancelled the request. This error code should
only be used for requests that explicitly support being
server cancellable.
```ts
const ServerCancelled: integer
```

## `ContentModified`
The server detected that the content of a document got
modified outside normal conditions. A server should
NOT send this error code if it detects a content change
in it unprocessed messages. The result even computed
on an older state might still be useful for the client.

If a client decides that a result is not of any use anymore
the client should cancel the request.
```ts
const ContentModified: integer
```

## `RequestCancelled`
The client has canceled a request and a server as detected
the cancel.
```ts
const RequestCancelled: integer
```

## `lspReservedErrorRangeEnd`
This is the end range of LSP reserved error codes.
It doesn't denote a real error code.
```ts
const lspReservedErrorRangeEnd: integer
```

## `method`
```ts
const method: "client/registerCapability"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<RegistrationParams, void, never, void, void>
```

## `method`
```ts
const method: "client/unregisterCapability"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<UnregistrationParams, void, never, void, void>
```

## `Create`
Supports creating new files and folders.
```ts
const Create: ResourceOperationKind
```

## `Rename`
Supports renaming existing files and folders.
```ts
const Rename: ResourceOperationKind
```

## `Delete`
Supports deleting existing files and folders.
```ts
const Delete: ResourceOperationKind
```

## `Abort`
Applying the workspace change is simply aborted if one of the changes provided
fails. All operations executed before the failing operation stay executed.
```ts
const Abort: FailureHandlingKind
```

## `Transactional`
All operations are executed transactional. That means they either all
succeed or no changes at all are applied to the workspace.
```ts
const Transactional: FailureHandlingKind
```

## `TextOnlyTransactional`
If the workspace edit contains only textual file changes they are executed transactional.
If resource changes (create, rename or delete file) are part of the change the failure
handling strategy is abort.
```ts
const TextOnlyTransactional: FailureHandlingKind
```

## `Undo`
The client tries to undo the operations already executed. But there is no
guarantee that this is succeeding.
```ts
const Undo: FailureHandlingKind
```

## `UTF8`
Character offsets count UTF-8 code units (e.g. bytes).
```ts
const UTF8: PositionEncodingKind
```

## `UTF16`
Character offsets count UTF-16 code units.

This is the default and must always be supported
by servers
```ts
const UTF16: PositionEncodingKind
```

## `UTF32`
Character offsets count UTF-32 code units.

Implementation note: these are the same as Unicode codepoints,
so this `PositionEncodingKind` may also be used for an
encoding-agnostic representation of character offsets.
```ts
const UTF32: PositionEncodingKind
```

## `method`
```ts
const method: "initialize"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<InitializeParams, InitializeResult<any>, never, InitializeError, void>
```

## `unknownProtocolVersion`
If the protocol version provided by the client can't be handled by the server.
```ts
const unknownProtocolVersion: 1
```

## `method`
```ts
const method: "initialized"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolNotificationType<InitializedParams, void>
```

## `method`
```ts
const method: "shutdown"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType0<void, never, void, void>
```

## `method`
```ts
const method: "exit"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolNotificationType0<void>
```

## `method`
```ts
const method: "workspace/didChangeConfiguration"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolNotificationType<DidChangeConfigurationParams, DidChangeConfigurationRegistrationOptions>
```

## `Error`
An error message.
```ts
const Error: 1
```

## `Warning`
A warning message.
```ts
const Warning: 2
```

## `Info`
An information message.
```ts
const Info: 3
```

## `Log`
A log message.
```ts
const Log: 4
```

## `Debug`
A debug message.
```ts
const Debug: 5
```

## `method`
```ts
const method: "window/showMessage"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolNotificationType<ShowMessageParams, void>
```

## `method`
```ts
const method: "window/showMessageRequest"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<ShowMessageRequestParams, MessageActionItem | null, never, void, void>
```

## `method`
```ts
const method: "window/logMessage"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolNotificationType<LogMessageParams, void>
```

## `method`
```ts
const method: "telemetry/event"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolNotificationType<any, void>
```

## `None`
Documents should not be synced at all.
```ts
const None: 0
```

## `Full`
Documents are synced by always sending the full content
of the document.
```ts
const Full: 1
```

## `Incremental`
Documents are synced by sending the full content on open.
After that only incremental updates to the document are
send.
```ts
const Incremental: 2
```

## `method`
```ts
const method: "textDocument/didOpen"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolNotificationType<DidOpenTextDocumentParams, TextDocumentRegistrationOptions>
```

## `method`
```ts
const method: "textDocument/didChange"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolNotificationType<DidChangeTextDocumentParams, TextDocumentChangeRegistrationOptions>
```

## `method`
```ts
const method: "textDocument/didClose"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolNotificationType<DidCloseTextDocumentParams, TextDocumentRegistrationOptions>
```

## `method`
```ts
const method: "textDocument/didSave"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolNotificationType<DidSaveTextDocumentParams, TextDocumentSaveRegistrationOptions>
```

## `Manual`
Manually triggered, e.g. by the user pressing save, by starting debugging,
or by an API call.
```ts
const Manual: 1
```

## `AfterDelay`
Automatic after a delay.
```ts
const AfterDelay: 2
```

## `FocusOut`
When the editor lost focus.
```ts
const FocusOut: 3
```

## `method`
```ts
const method: "textDocument/willSave"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolNotificationType<WillSaveTextDocumentParams, TextDocumentRegistrationOptions>
```

## `method`
```ts
const method: "textDocument/willSaveWaitUntil"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<WillSaveTextDocumentParams, TextEdit[] | null, never, void, TextDocumentRegistrationOptions>
```

## `method`
```ts
const method: "workspace/didChangeWatchedFiles"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolNotificationType<DidChangeWatchedFilesParams, DidChangeWatchedFilesRegistrationOptions>
```

## `method`
```ts
const method: "textDocument/publishDiagnostics"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolNotificationType<PublishDiagnosticsParams, void>
```

## `Invoked`
Completion was triggered by typing an identifier (24x7 code
complete), manual invocation (e.g Ctrl+Space) or via API.
```ts
const Invoked: 1
```

## `TriggerCharacter`
Completion was triggered by a trigger character specified by
the `triggerCharacters` properties of the `CompletionRegistrationOptions`.
```ts
const TriggerCharacter: 2
```

## `TriggerForIncompleteCompletions`
Completion was re-triggered as current completion list is incomplete
```ts
const TriggerForIncompleteCompletions: 3
```

## `method`
```ts
const method: "textDocument/completion"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<CompletionParams, CompletionList | CompletionItem[] | null, CompletionItem[], void, CompletionRegistrationOptions>
```

## `method`
```ts
const method: "completionItem/resolve"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<CompletionItem, CompletionItem, never, void, void>
```

## `method`
```ts
const method: "textDocument/hover"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<HoverParams, Hover | null, never, void, HoverRegistrationOptions>
```

## `Invoked`
Signature help was invoked manually by the user or by a command.
```ts
const Invoked: 1
```

## `TriggerCharacter`
Signature help was triggered by a trigger character.
```ts
const TriggerCharacter: 2
```

## `ContentChange`
Signature help was triggered by the cursor moving or by the document content changing.
```ts
const ContentChange: 3
```

## `method`
```ts
const method: "textDocument/signatureHelp"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<SignatureHelpParams, SignatureHelp | null, never, void, SignatureHelpRegistrationOptions>
```

## `method`
```ts
const method: "textDocument/definition"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<DefinitionParams, Definition | LocationLink[] | null, Location[] | LocationLink[], void, DefinitionRegistrationOptions>
```

## `method`
```ts
const method: "textDocument/references"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<ReferenceParams, Location[] | null, Location[], void, ReferenceRegistrationOptions>
```

## `method`
```ts
const method: "textDocument/documentHighlight"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<DocumentHighlightParams, DocumentHighlight[] | null, DocumentHighlight[], void, DocumentHighlightRegistrationOptions>
```

## `method`
```ts
const method: "textDocument/documentSymbol"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<DocumentSymbolParams, DocumentSymbol[] | SymbolInformation[] | null, DocumentSymbol[] | SymbolInformation[], void, DocumentSymbolRegistrationOptions>
```

## `method`
```ts
const method: "textDocument/codeAction"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<CodeActionParams, (Command | CodeAction)[] | null, (Command | CodeAction)[], void, CodeActionRegistrationOptions>
```

## `method`
```ts
const method: "codeAction/resolve"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<CodeAction, CodeAction, never, void, void>
```

## `method`
```ts
const method: "workspace/symbol"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<WorkspaceSymbolParams, SymbolInformation[] | WorkspaceSymbol[] | null, SymbolInformation[] | WorkspaceSymbol[], void, WorkspaceSymbolRegistrationOptions>
```

## `method`
```ts
const method: "workspaceSymbol/resolve"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<WorkspaceSymbol, WorkspaceSymbol, never, void, void>
```

## `method`
```ts
const method: "textDocument/codeLens"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<CodeLensParams, CodeLens[] | null, CodeLens[], void, CodeLensRegistrationOptions>
```

## `method`
```ts
const method: "codeLens/resolve"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<CodeLens, CodeLens, never, void, void>
```

## `method`
```ts
const method: "workspace/codeLens/refresh"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType0<void, void, void, void>
```

## `method`
```ts
const method: "textDocument/documentLink"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<DocumentLinkParams, DocumentLink[] | null, DocumentLink[], void, DocumentLinkRegistrationOptions>
```

## `method`
```ts
const method: "documentLink/resolve"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<DocumentLink, DocumentLink, never, void, void>
```

## `method`
```ts
const method: "textDocument/formatting"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<DocumentFormattingParams, TextEdit[] | null, never, void, DocumentFormattingRegistrationOptions>
```

## `method`
```ts
const method: "textDocument/rangeFormatting"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<DocumentRangeFormattingParams, TextEdit[] | null, never, void, DocumentRangeFormattingRegistrationOptions>
```

## `method`
```ts
const method: "textDocument/rangesFormatting"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<DocumentRangesFormattingParams, TextEdit[] | null, never, void, DocumentRangeFormattingRegistrationOptions>
```

## `method`
```ts
const method: "textDocument/onTypeFormatting"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<DocumentOnTypeFormattingParams, TextEdit[] | null, never, void, DocumentOnTypeFormattingRegistrationOptions>
```

## `Identifier`
The client's default behavior is to select the identifier
according the to language's syntax rule.
```ts
const Identifier: 1
```

## `method`
```ts
const method: "textDocument/rename"
```

## `messageDirection`
```ts
const messageDirection: MessageDirection
```

## `type`
```ts
const type: ProtocolRequestType<RenameParams, WorkspaceEdit | null, never, void, RenameRegistrationOptions>
```

## `method`
```ts
const method: "textDocument/prepareRename"
```

## `messageDirection`
```ts

<!-- truncated -->
