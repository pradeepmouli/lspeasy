# Variables & Constants

## api.d

### `lspReservedErrorRangeStart`
This is the start range of LSP reserved error codes.
It doesn't denote a real error code.
```ts
const lspReservedErrorRangeStart: integer
```

### `RequestFailed`
A request failed but it was syntactically correct, e.g the
method name was known and the parameters were valid. The error
message should contain human readable information about why
the request failed.
```ts
const RequestFailed: integer
```

### `ServerCancelled`
The server cancelled the request. This error code should
only be used for requests that explicitly support being
server cancellable.
```ts
const ServerCancelled: integer
```

### `ContentModified`
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

### `RequestCancelled`
The client has canceled a request and a server as detected
the cancel.
```ts
const RequestCancelled: integer
```

### `lspReservedErrorRangeEnd`
This is the end range of LSP reserved error codes.
It doesn't denote a real error code.
```ts
const lspReservedErrorRangeEnd: integer
```

## main.d

### `MIN_VALUE`
```ts
const MIN_VALUE: -2147483648
```

### `MAX_VALUE`
```ts
const MAX_VALUE: 2147483647
```

### `MIN_VALUE`
```ts
const MIN_VALUE: 0
```

### `MAX_VALUE`
```ts
const MAX_VALUE: 2147483647
```

### `Comment`
Folding range for a comment
```ts
const Comment: "comment"
```

### `Imports`
Folding range for an import or include
```ts
const Imports: "imports"
```

### `Region`
Folding range for a region (e.g. `#region`)
```ts
const Region: "region"
```

### `Error`
Reports an error.
```ts
const Error: 1
```

### `Warning`
Reports a warning.
```ts
const Warning: 2
```

### `Information`
Reports an information.
```ts
const Information: 3
```

### `Hint`
Reports a hint.
```ts
const Hint: 4
```

### `Unnecessary`
Unused or unnecessary code.

Clients are allowed to render diagnostics with this tag faded out instead of having
an error squiggle.
```ts
const Unnecessary: 1
```

### `Deprecated`
Deprecated or obsolete code.

Clients are allowed to rendered diagnostics with this tag strike through.
```ts
const Deprecated: 2
```

### `PlainText`
Plain text is supported as a content format
```ts
const PlainText: "plaintext"
```

### `Markdown`
Markdown is supported as a content format
```ts
const Markdown: "markdown"
```

### `Text`
```ts
const Text: 1
```

### `Method`
```ts
const Method: 2
```

### `Function`
```ts
const Function: 3
```

### `Constructor`
```ts
const Constructor: 4
```

### `Field`
```ts
const Field: 5
```

### `Variable`
```ts
const Variable: 6
```

### `Class`
```ts
const Class: 7
```

### `Interface`
```ts
const Interface: 8
```

### `Module`
```ts
const Module: 9
```

### `Property`
```ts
const Property: 10
```

### `Unit`
```ts
const Unit: 11
```

### `Value`
```ts
const Value: 12
```

### `Enum`
```ts
const Enum: 13
```

### `Keyword`
```ts
const Keyword: 14
```

### `Snippet`
```ts
const Snippet: 15
```

### `Color`
```ts
const Color: 16
```

### `File`
```ts
const File: 17
```

### `Reference`
```ts
const Reference: 18
```

### `Folder`
```ts
const Folder: 19
```

### `EnumMember`
```ts
const EnumMember: 20
```

### `Constant`
```ts
const Constant: 21
```

### `Struct`
```ts
const Struct: 22
```

### `Event`
```ts
const Event: 23
```

### `Operator`
```ts
const Operator: 24
```

### `TypeParameter`
```ts
const TypeParameter: 25
```

### `PlainText`
The primary text to be inserted is treated as a plain string.
```ts
const PlainText: 1
```

### `Snippet`
The primary text to be inserted is treated as a snippet.

A snippet can define tab stops and placeholders with `$1`, `$2`
and `${3:foo}`. `$0` defines the final tab stop, it defaults to
the end of the snippet. Placeholders with equal identifiers are linked,
that is typing in one will update others too.

See also: https://microsoft.github.io/language-server-protocol/specifications/specification-current/#snippet_syntax
```ts
const Snippet: 2
```

### `Deprecated`
Render a completion as obsolete, usually using a strike-out.
```ts
const Deprecated: 1
```

### `asIs`
The insertion or replace strings is taken as it is. If the
value is multi line the lines below the cursor will be
inserted using the indentation defined in the string value.
The client will not apply any kind of adjustments to the
string.
```ts
const asIs: 1
```

### `adjustIndentation`
The editor adjusts leading whitespace of new lines so that
they match the indentation up to the cursor of the line for
which the item is accepted.

Consider a line like this: <2tabs><cursor><3tabs>foo. Accepting a
multi line completion item is indented using 2 tabs and all
following lines inserted will be indented using 2 tabs as well.
```ts
const adjustIndentation: 2
```

### `Text`
A textual occurrence.
```ts
const Text: 1
```

### `Read`
Read-access of a symbol, like reading a variable.
```ts
const Read: 2
```

### `Write`
Write-access of a symbol, like writing to a variable.
```ts
const Write: 3
```

### `File`
```ts
const File: 1
```

### `Module`
```ts
const Module: 2
```

### `Namespace`
```ts
const Namespace: 3
```

### `Package`
```ts
const Package: 4
```

### `Class`
```ts
const Class: 5
```

### `Method`
```ts
const Method: 6
```

### `Property`
```ts
const Property: 7
```

### `Field`
```ts
const Field: 8
```

### `Constructor`
```ts
const Constructor: 9
```

### `Enum`
```ts
const Enum: 10
```

### `Interface`
```ts
const Interface: 11
```

### `Function`
```ts
const Function: 12
```

### `Variable`
```ts
const Variable: 13
```

### `Constant`
```ts
const Constant: 14
```

### `String`
```ts
const String: 15
```

### `Number`
```ts
const Number: 16
```

### `Boolean`
```ts
const Boolean: 17
```

### `Array`
```ts
const Array: 18
```

### `Object`
```ts
const Object: 19
```

### `Key`
```ts
const Key: 20
```

### `Null`
```ts
const Null: 21
```

### `EnumMember`
```ts
const EnumMember: 22
```

### `Struct`
```ts
const Struct: 23
```

### `Event`
```ts
const Event: 24
```

### `Operator`
```ts
const Operator: 25
```

### `TypeParameter`
```ts
const TypeParameter: 26
```

### `Deprecated`
Render a symbol as obsolete, usually using a strike-out.
```ts
const Deprecated: 1
```

### `Empty`
Empty kind.
```ts
const Empty: ""
```

### `QuickFix`
Base kind for quickfix actions: 'quickfix'
```ts
const QuickFix: "quickfix"
```

### `Refactor`
Base kind for refactoring actions: 'refactor'
```ts
const Refactor: "refactor"
```

### `RefactorExtract`
Base kind for refactoring extraction actions: 'refactor.extract'

Example extract actions:

- Extract method
- Extract function
- Extract variable
- Extract interface from class
- ...
```ts
const RefactorExtract: "refactor.extract"
```

### `RefactorInline`
Base kind for refactoring inline actions: 'refactor.inline'

Example inline actions:

- Inline function
- Inline variable
- Inline constant
- ...
```ts
const RefactorInline: "refactor.inline"
```

### `RefactorRewrite`
Base kind for refactoring rewrite actions: 'refactor.rewrite'

Example rewrite actions:

- Convert JavaScript function to class
- Add or remove parameter
- Encapsulate field
- Make method static
- Move method to base class
- ...
```ts
const RefactorRewrite: "refactor.rewrite"
```

### `Source`
Base kind for source actions: `source`

Source code actions apply to the entire file.
```ts
const Source: "source"
```

### `SourceOrganizeImports`
Base kind for an organize imports source action: `source.organizeImports`
```ts
const SourceOrganizeImports: "source.organizeImports"
```

### `SourceFixAll`
Base kind for auto-fix source actions: `source.fixAll`.

Fix all actions automatically fix errors that have a clear fix that do not require user input.
They should not suppress errors or perform unsafe fixes such as generating new types or classes.
```ts
const SourceFixAll: "source.fixAll"
```

### `Invoked`
Code actions were explicitly requested by the user or by an extension.
```ts
const Invoked: 1
```

### `Automatic`
Code actions were requested automatically.

This typically happens when current selection in a file changes, but can
also be triggered when file content changes.
```ts
const Automatic: 2
```

### `Type`
An inlay hint that for a type annotation.
```ts
const Type: 1
```

### `Parameter`
An inlay hint that is for a parameter.
```ts
const Parameter: 2
```

### `Invoked`
Completion was triggered explicitly by a user gesture.
```ts
const Invoked: 0
```

### `Automatic`
Completion was triggered automatically while editing.
```ts
const Automatic: 1
```

### `EOL`
```ts
const EOL: string[]
```

## protocol.d

### `method`
```ts
const method: "client/registerCapability"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolRequestType<RegistrationParams, void, never, void, void>
```

### `method`
```ts
const method: "client/unregisterCapability"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolRequestType<UnregistrationParams, void, never, void, void>
```

### `Create`
Supports creating new files and folders.
```ts
const Create: ResourceOperationKind
```

### `Rename`
Supports renaming existing files and folders.
```ts
const Rename: ResourceOperationKind
```

### `Delete`
Supports deleting existing files and folders.
```ts
const Delete: ResourceOperationKind
```

### `Abort`
Applying the workspace change is simply aborted if one of the changes provided
fails. All operations executed before the failing operation stay executed.
```ts
const Abort: FailureHandlingKind
```

### `Transactional`
All operations are executed transactional. That means they either all
succeed or no changes at all are applied to the workspace.
```ts
const Transactional: FailureHandlingKind
```

### `TextOnlyTransactional`
If the workspace edit contains only textual file changes they are executed transactional.
If resource changes (create, rename or delete file) are part of the change the failure
handling strategy is abort.
```ts
const TextOnlyTransactional: FailureHandlingKind
```

### `Undo`
The client tries to undo the operations already executed. But there is no
guarantee that this is succeeding.
```ts
const Undo: FailureHandlingKind
```

### `UTF8`
Character offsets count UTF-8 code units (e.g. bytes).
```ts
const UTF8: PositionEncodingKind
```

### `UTF16`
Character offsets count UTF-16 code units.

This is the default and must always be supported
by servers
```ts
const UTF16: PositionEncodingKind
```

### `UTF32`
Character offsets count UTF-32 code units.

Implementation note: these are the same as Unicode codepoints,
so this `PositionEncodingKind` may also be used for an
encoding-agnostic representation of character offsets.
```ts
const UTF32: PositionEncodingKind
```

### `method`
```ts
const method: "initialize"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolRequestType<InitializeParams, InitializeResult<any>, never, InitializeError, void>
```

### `unknownProtocolVersion`
If the protocol version provided by the client can't be handled by the server.
```ts
const unknownProtocolVersion: 1
```

### `method`
```ts
const method: "initialized"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolNotificationType<InitializedParams, void>
```

### `method`
```ts
const method: "shutdown"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolRequestType0<void, never, void, void>
```

### `method`
```ts
const method: "exit"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolNotificationType0<void>
```

### `method`
```ts
const method: "workspace/didChangeConfiguration"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolNotificationType<DidChangeConfigurationParams, DidChangeConfigurationRegistrationOptions>
```

### `Error`
An error message.
```ts
const Error: 1
```

### `Warning`
A warning message.
```ts
const Warning: 2
```

### `Info`
An information message.
```ts
const Info: 3
```

### `Log`
A log message.
```ts
const Log: 4
```

### `Debug`
A debug message.
```ts
const Debug: 5
```

### `method`
```ts
const method: "window/showMessage"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolNotificationType<ShowMessageParams, void>
```

### `method`
```ts
const method: "window/showMessageRequest"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolRequestType<ShowMessageRequestParams, MessageActionItem | null, never, void, void>
```

### `method`
```ts
const method: "window/logMessage"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolNotificationType<LogMessageParams, void>
```

### `method`
```ts
const method: "telemetry/event"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolNotificationType<any, void>
```

### `None`
Documents should not be synced at all.
```ts
const None: 0
```

### `Full`
Documents are synced by always sending the full content
of the document.
```ts
const Full: 1
```

### `Incremental`
Documents are synced by sending the full content on open.
After that only incremental updates to the document are
send.
```ts
const Incremental: 2
```

### `method`
```ts
const method: "textDocument/didOpen"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolNotificationType<DidOpenTextDocumentParams, TextDocumentRegistrationOptions>
```

### `method`
```ts
const method: "textDocument/didChange"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolNotificationType<DidChangeTextDocumentParams, TextDocumentChangeRegistrationOptions>
```

### `method`
```ts
const method: "textDocument/didClose"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolNotificationType<DidCloseTextDocumentParams, TextDocumentRegistrationOptions>
```

### `method`
```ts
const method: "textDocument/didSave"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolNotificationType<DidSaveTextDocumentParams, TextDocumentSaveRegistrationOptions>
```

### `Manual`
Manually triggered, e.g. by the user pressing save, by starting debugging,
or by an API call.
```ts
const Manual: 1
```

### `AfterDelay`
Automatic after a delay.
```ts
const AfterDelay: 2
```

### `FocusOut`
When the editor lost focus.
```ts
const FocusOut: 3
```

### `method`
```ts
const method: "textDocument/willSave"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolNotificationType<WillSaveTextDocumentParams, TextDocumentRegistrationOptions>
```

### `method`
```ts
const method: "textDocument/willSaveWaitUntil"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts
const type: ProtocolRequestType<WillSaveTextDocumentParams, TextEdit[] | null, never, void, TextDocumentRegistrationOptions>
```

### `method`
```ts
const method: "workspace/didChangeWatchedFiles"
```

### `messageDirection`
```ts
const messageDirection: MessageDirection
```

### `type`
```ts

<!-- truncated -->
