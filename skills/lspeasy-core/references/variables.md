# Variables & Constants

## protocol

### `ApplyKind`
LSP Protocol Enums

Emitted as const objects + union type aliases for structural compatibility
with vscode-languageserver-protocol, which uses the same pattern.

Auto-generated from metaModel.json
DO NOT EDIT MANUALLY
```ts
const ApplyKind: { Replace: 1; Merge: 2 }
```

### `CodeActionKind`
```ts
const CodeActionKind: { Empty: ""; QuickFix: "quickfix"; Refactor: "refactor"; RefactorExtract: "refactor.extract"; RefactorInline: "refactor.inline"; RefactorMove: "refactor.move"; RefactorRewrite: "refactor.rewrite"; Source: "source"; SourceOrganizeImports: "source.organizeImports"; SourceFixAll: "source.fixAll"; Notebook: "notebook" }
```

### `CodeActionTag`
```ts
const CodeActionTag: { LLMGenerated: 1 }
```

### `CodeActionTriggerKind`
```ts
const CodeActionTriggerKind: { Invoked: 1; Automatic: 2 }
```

### `CompletionItemKind`
```ts
const CompletionItemKind: { Text: 1; Method: 2; Function: 3; Constructor: 4; Field: 5; Variable: 6; Class: 7; Interface: 8; Module: 9; Property: 10; Unit: 11; Value: 12; Enum: 13; Keyword: 14; Snippet: 15; Color: 16; File: 17; Reference: 18; Folder: 19; EnumMember: 20; Constant: 21; Struct: 22; Event: 23; Operator: 24; TypeParameter: 25 }
```

### `CompletionItemTag`
```ts
const CompletionItemTag: { Deprecated: 1 }
```

### `CompletionTriggerKind`
```ts
const CompletionTriggerKind: { Invoked: 1; TriggerCharacter: 2; TriggerForIncompleteCompletions: 3 }
```

### `DiagnosticSeverity`
```ts
const DiagnosticSeverity: { Error: 1; Warning: 2; Information: 3; Hint: 4 }
```

### `DiagnosticTag`
```ts
const DiagnosticTag: { Unnecessary: 1; Deprecated: 2 }
```

### `DocumentDiagnosticReportKind`
```ts
const DocumentDiagnosticReportKind: { Full: "full"; Unchanged: "unchanged" }
```

### `DocumentHighlightKind`
```ts
const DocumentHighlightKind: { Text: 1; Read: 2; Write: 3 }
```

### `ErrorCodes`
```ts
const ErrorCodes: { ParseError: -32700; InvalidRequest: -32600; MethodNotFound: -32601; InvalidParams: -32602; InternalError: -32603; ServerNotInitialized: -32002; UnknownErrorCode: -32001 }
```

### `FailureHandlingKind`
```ts
const FailureHandlingKind: { Abort: "abort"; Transactional: "transactional"; TextOnlyTransactional: "textOnlyTransactional"; Undo: "undo" }
```

### `FileOperationPatternKind`
```ts
const FileOperationPatternKind: { file: "file"; folder: "folder" }
```

### `FoldingRangeKind`
```ts
const FoldingRangeKind: { Comment: "comment"; Imports: "imports"; Region: "region" }
```

### `InlayHintKind`
```ts
const InlayHintKind: { Type: 1; Parameter: 2 }
```

### `InlineCompletionTriggerKind`
```ts
const InlineCompletionTriggerKind: { Invoked: 1; Automatic: 2 }
```

### `InsertTextFormat`
```ts
const InsertTextFormat: { PlainText: 1; Snippet: 2 }
```

### `InsertTextMode`
```ts
const InsertTextMode: { asIs: 1; adjustIndentation: 2 }
```

### `LanguageKind`
```ts
const LanguageKind: { ABAP: "abap"; WindowsBat: "bat"; BibTeX: "bibtex"; Clojure: "clojure"; Coffeescript: "coffeescript"; C: "c"; CPP: "cpp"; CSharp: "csharp"; CSS: "css"; D: "d"; Delphi: "pascal"; Diff: "diff"; Dart: "dart"; Dockerfile: "dockerfile"; Elixir: "elixir"; Erlang: "erlang"; FSharp: "fsharp"; GitCommit: "git-commit"; GitRebase: "git-rebase"; Go: "go"; Groovy: "groovy"; Handlebars: "handlebars"; Haskell: "haskell"; HTML: "html"; Ini: "ini"; Java: "java"; JavaScript: "javascript"; JavaScriptReact: "javascriptreact"; JSON: "json"; LaTeX: "latex"; Less: "less"; Lua: "lua"; Makefile: "makefile"; Markdown: "markdown"; ObjectiveC: "objective-c"; ObjectiveCPP: "objective-cpp"; Pascal: "pascal"; Perl: "perl"; Perl6: "perl6"; PHP: "php"; Plaintext: "plaintext"; Powershell: "powershell"; Pug: "jade"; Python: "python"; R: "r"; Razor: "razor"; Ruby: "ruby"; Rust: "rust"; SCSS: "scss"; SASS: "sass"; Scala: "scala"; ShaderLab: "shaderlab"; ShellScript: "shellscript"; SQL: "sql"; Swift: "swift"; TypeScript: "typescript"; TypeScriptReact: "typescriptreact"; TeX: "tex"; VisualBasic: "vb"; XML: "xml"; XSL: "xsl"; YAML: "yaml" }
```

### `LSPErrorCodes`
```ts
const LSPErrorCodes: { RequestFailed: -32803; ServerCancelled: -32802; ContentModified: -32801; RequestCancelled: -32800 }
```

### `MarkupKind`
```ts
const MarkupKind: { PlainText: "plaintext"; Markdown: "markdown" }
```

### `MessageType`
```ts
const MessageType: { Error: 1; Warning: 2; Info: 3; Log: 4; Debug: 5 }
```

### `MonikerKind`
```ts
const MonikerKind: { import: "import"; export: "export"; local: "local" }
```

### `NotebookCellKind`
```ts
const NotebookCellKind: { Markup: 1; Code: 2 }
```

### `PositionEncodingKind`
```ts
const PositionEncodingKind: { UTF8: "utf-8"; UTF16: "utf-16"; UTF32: "utf-32" }
```

### `PrepareSupportDefaultBehavior`
```ts
const PrepareSupportDefaultBehavior: { Identifier: 1 }
```

### `ResourceOperationKind`
```ts
const ResourceOperationKind: { Create: "create"; Rename: "rename"; Delete: "delete" }
```

### `SemanticTokenModifiers`
```ts
const SemanticTokenModifiers: { declaration: "declaration"; definition: "definition"; readonly: "readonly"; static: "static"; deprecated: "deprecated"; abstract: "abstract"; async: "async"; modification: "modification"; documentation: "documentation"; defaultLibrary: "defaultLibrary" }
```

### `SemanticTokenTypes`
```ts
const SemanticTokenTypes: { namespace: "namespace"; type: "type"; class: "class"; enum: "enum"; interface: "interface"; struct: "struct"; typeParameter: "typeParameter"; parameter: "parameter"; variable: "variable"; property: "property"; enumMember: "enumMember"; event: "event"; function: "function"; method: "method"; macro: "macro"; keyword: "keyword"; modifier: "modifier"; comment: "comment"; string: "string"; number: "number"; regexp: "regexp"; operator: "operator"; decorator: "decorator"; label: "label" }
```

### `SignatureHelpTriggerKind`
```ts
const SignatureHelpTriggerKind: { Invoked: 1; TriggerCharacter: 2; ContentChange: 3 }
```

### `SymbolKind`
```ts
const SymbolKind: { File: 1; Module: 2; Namespace: 3; Package: 4; Class: 5; Method: 6; Property: 7; Field: 8; Constructor: 9; Enum: 10; Interface: 11; Function: 12; Variable: 13; Constant: 14; String: 15; Number: 16; Boolean: 17; Array: 18; Object: 19; Key: 20; Null: 21; EnumMember: 22; Struct: 23; Event: 24; Operator: 25; TypeParameter: 26 }
```

### `SymbolTag`
```ts
const SymbolTag: { Deprecated: 1 }
```

### `TextDocumentSaveReason`
```ts
const TextDocumentSaveReason: { Manual: 1; AfterDelay: 2; FocusOut: 3 }
```

### `TextDocumentSyncKind`
```ts
const TextDocumentSyncKind: { None: 0; Full: 1; Incremental: 2 }
```

### `TokenFormat`
```ts
const TokenFormat: { Relative: "relative" }
```

### `TraceValue`
```ts
const TraceValue: { Off: "off"; Messages: "messages"; Compact: "compact"; Verbose: "verbose" }
```

### `UniquenessLevel`
```ts
const UniquenessLevel: { document: "document"; project: "project"; group: "group"; scheme: "scheme"; global: "global" }
```

### `RequestMethodMap`
Runtime map from every LSP request method string to its metadata
(direction, server capability, client capability).
```ts
const RequestMethodMap: Map<LSPRequestMethod, { Direction: DirectionForRequest<LSPRequestMethod>; ServerCapability?: ServerCapabilityForRequest<LSPRequestMethod>; ClientCapability?: ClientCapabilityForRequest<LSPRequestMethod> }>
```

### `NotificationMethodMap`
Runtime map from every LSP notification method string to its metadata
(direction, server capability, client capability).
```ts
const NotificationMethodMap: Map<LSPNotificationMethod, { Direction: DirectionForNotification<LSPNotificationMethod>; ServerCapability?: ServerCapabilityForNotification<LSPNotificationMethod>; ClientCapability?: ClientCapabilityForNotification<LSPNotificationMethod> }>
```

### `ClientRequestMethodToCapabilityMap`
Runtime map from every LSP request method string to the corresponding
server capability key (or `undefined` for always-allowed methods).
```ts
const ClientRequestMethodToCapabilityMap: Map<string, string | undefined>
```

### `ClientNotificationMethodToCapabilityMap`
Runtime map from every LSP notification method string to the corresponding
server capability key (or `undefined` for always-allowed notifications).
```ts
const ClientNotificationMethodToCapabilityMap: Map<string, string | undefined>
```

### `LSPRequest`
LSP Request methods organized by namespace
```ts

<!-- truncated -->
