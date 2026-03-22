# Types & Enums

## Enums

### `ApplyKind`
LSP Protocol Enums

Auto-generated from metaModel.json
DO NOT EDIT MANUALLY
- `Replace` = `1` — 
- `Merge` = `2` — 

### `CodeActionKind`
- `Empty` = `""` — 
- `QuickFix` = `"quickfix"` — 
- `Refactor` = `"refactor"` — 
- `RefactorExtract` = `"refactor.extract"` — 
- `RefactorInline` = `"refactor.inline"` — 
- `RefactorMove` = `"refactor.move"` — 
- `RefactorRewrite` = `"refactor.rewrite"` — 
- `Source` = `"source"` — 
- `SourceOrganizeImports` = `"source.organizeImports"` — 
- `SourceFixAll` = `"source.fixAll"` — 
- `Notebook` = `"notebook"` — 

### `CodeActionTag`
- `LLMGenerated` = `1` — 

### `CodeActionTriggerKind`
- `Invoked` = `1` — 
- `Automatic` = `2` — 

### `CompletionItemKind`
- `Text` = `1` — 
- `Method` = `2` — 
- `Function` = `3` — 
- `Constructor` = `4` — 
- `Field` = `5` — 
- `Variable` = `6` — 
- `Class` = `7` — 
- `Interface` = `8` — 
- `Module` = `9` — 
- `Property` = `10` — 
- `Unit` = `11` — 
- `Value` = `12` — 
- `Enum` = `13` — 
- `Keyword` = `14` — 
- `Snippet` = `15` — 
- `Color` = `16` — 
- `File` = `17` — 
- `Reference` = `18` — 
- `Folder` = `19` — 
- `EnumMember` = `20` — 
- `Constant` = `21` — 
- `Struct` = `22` — 
- `Event` = `23` — 
- `Operator` = `24` — 
- `TypeParameter` = `25` — 

### `CompletionItemTag`
- `Deprecated` = `1` — 

### `CompletionTriggerKind`
- `Invoked` = `1` — 
- `TriggerCharacter` = `2` — 
- `TriggerForIncompleteCompletions` = `3` — 

### `DiagnosticSeverity`
- `Error` = `1` — 
- `Warning` = `2` — 
- `Information` = `3` — 
- `Hint` = `4` — 

### `DiagnosticTag`
- `Unnecessary` = `1` — 
- `Deprecated` = `2` — 

### `DocumentDiagnosticReportKind`
- `Full` = `"full"` — 
- `Unchanged` = `"unchanged"` — 

### `DocumentHighlightKind`
- `Text` = `1` — 
- `Read` = `2` — 
- `Write` = `3` — 

### `ErrorCodes`
- `ParseError` = `-32700` — 
- `InvalidRequest` = `-32600` — 
- `MethodNotFound` = `-32601` — 
- `InvalidParams` = `-32602` — 
- `InternalError` = `-32603` — 
- `ServerNotInitialized` = `-32002` — 
- `UnknownErrorCode` = `-32001` — 

### `FailureHandlingKind`
- `Abort` = `"abort"` — 
- `Transactional` = `"transactional"` — 
- `TextOnlyTransactional` = `"textOnlyTransactional"` — 
- `Undo` = `"undo"` — 

### `FileChangeType`
- `Created` = `1` — 
- `Changed` = `2` — 
- `Deleted` = `3` — 

### `FileOperationPatternKind`
- `file` = `"file"` — 
- `folder` = `"folder"` — 

### `FoldingRangeKind`
- `Comment` = `"comment"` — 
- `Imports` = `"imports"` — 
- `Region` = `"region"` — 

### `InlayHintKind`
- `Type` = `1` — 
- `Parameter` = `2` — 

### `InlineCompletionTriggerKind`
- `Invoked` = `1` — 
- `Automatic` = `2` — 

### `InsertTextFormat`
- `PlainText` = `1` — 
- `Snippet` = `2` — 

### `InsertTextMode`
- `asIs` = `1` — 
- `adjustIndentation` = `2` — 

### `LanguageKind`
- `ABAP` = `"abap"` — 
- `WindowsBat` = `"bat"` — 
- `BibTeX` = `"bibtex"` — 
- `Clojure` = `"clojure"` — 
- `Coffeescript` = `"coffeescript"` — 
- `C` = `"c"` — 
- `CPP` = `"cpp"` — 
- `CSharp` = `"csharp"` — 
- `CSS` = `"css"` — 
- `D` = `"d"` — 
- `Delphi` = `"pascal"` — 
- `Diff` = `"diff"` — 
- `Dart` = `"dart"` — 
- `Dockerfile` = `"dockerfile"` — 
- `Elixir` = `"elixir"` — 
- `Erlang` = `"erlang"` — 
- `FSharp` = `"fsharp"` — 
- `GitCommit` = `"git-commit"` — 
- `GitRebase` = `"rebase"` — 
- `Go` = `"go"` — 
- `Groovy` = `"groovy"` — 
- `Handlebars` = `"handlebars"` — 
- `Haskell` = `"haskell"` — 
- `HTML` = `"html"` — 
- `Ini` = `"ini"` — 
- `Java` = `"java"` — 
- `JavaScript` = `"javascript"` — 
- `JavaScriptReact` = `"javascriptreact"` — 
- `JSON` = `"json"` — 
- `LaTeX` = `"latex"` — 
- `Less` = `"less"` — 
- `Lua` = `"lua"` — 
- `Makefile` = `"makefile"` — 
- `Markdown` = `"markdown"` — 
- `ObjectiveC` = `"objective-c"` — 
- `ObjectiveCPP` = `"objective-cpp"` — 
- `Pascal` = `"pascal"` — 
- `Perl` = `"perl"` — 
- `Perl6` = `"perl6"` — 
- `PHP` = `"php"` — 
- `Powershell` = `"powershell"` — 
- `Pug` = `"jade"` — 
- `Python` = `"python"` — 
- `R` = `"r"` — 
- `Razor` = `"razor"` — 
- `Ruby` = `"ruby"` — 
- `Rust` = `"rust"` — 
- `SCSS` = `"scss"` — 
- `SASS` = `"sass"` — 
- `Scala` = `"scala"` — 
- `ShaderLab` = `"shaderlab"` — 
- `ShellScript` = `"shellscript"` — 
- `SQL` = `"sql"` — 
- `Swift` = `"swift"` — 
- `TypeScript` = `"typescript"` — 
- `TypeScriptReact` = `"typescriptreact"` — 
- `TeX` = `"tex"` — 
- `VisualBasic` = `"vb"` — 
- `XML` = `"xml"` — 
- `XSL` = `"xsl"` — 
- `YAML` = `"yaml"` — 

### `LSPErrorCodes`
- `RequestFailed` = `-32803` — 
- `ServerCancelled` = `-32802` — 
- `ContentModified` = `-32801` — 
- `RequestCancelled` = `-32800` — 

### `MarkupKind`
- `PlainText` = `"plaintext"` — 
- `Markdown` = `"markdown"` — 

### `MessageType`
- `Error` = `1` — 
- `Warning` = `2` — 
- `Info` = `3` — 
- `Log` = `4` — 
- `Debug` = `5` — 

### `MonikerKind`
- `import` = `"import"` — 
- `export` = `"export"` — 
- `local` = `"local"` — 

### `NotebookCellKind`
- `Markup` = `1` — 
- `Code` = `2` — 

### `PositionEncodingKind`
- `UTF8` = `"utf-8"` — 
- `UTF16` = `"utf-16"` — 
- `UTF32` = `"utf-32"` — 

### `PrepareSupportDefaultBehavior`
- `Identifier` = `1` — 

### `ResourceOperationKind`
- `Create` = `"create"` — 
- `Rename` = `"rename"` — 
- `Delete` = `"delete"` — 

### `SemanticTokenModifiers`
- `declaration` = `"declaration"` — 
- `definition` = `"definition"` — 
- `readonly` = `"readonly"` — 
- `static` = `"static"` — 
- `deprecated` = `"deprecated"` — 
- `abstract` = `"abstract"` — 
- `async` = `"async"` — 
- `modification` = `"modification"` — 
- `documentation` = `"documentation"` — 
- `defaultLibrary` = `"defaultLibrary"` — 

### `SemanticTokenTypes`
- `namespace` = `"namespace"` — 
- `type` = `"type"` — 
- `class` = `"class"` — 
- `enum` = `"enum"` — 
- `interface` = `"interface"` — 
- `struct` = `"struct"` — 
- `typeParameter` = `"typeParameter"` — 
- `parameter` = `"parameter"` — 
- `variable` = `"variable"` — 
- `property` = `"property"` — 
- `enumMember` = `"enumMember"` — 
- `event` = `"event"` — 
- `function` = `"function"` — 
- `method` = `"method"` — 
- `macro` = `"macro"` — 
- `keyword` = `"keyword"` — 
- `modifier` = `"modifier"` — 
- `comment` = `"comment"` — 
- `string` = `"string"` — 
- `number` = `"number"` — 
- `regexp` = `"regexp"` — 
- `operator` = `"operator"` — 
- `decorator` = `"decorator"` — 
- `label` = `"label"` — 

### `SignatureHelpTriggerKind`
- `Invoked` = `1` — 
- `TriggerCharacter` = `2` — 
- `ContentChange` = `3` — 

### `SymbolKind`
- `File` = `1` — 
- `Module` = `2` — 
- `Namespace` = `3` — 
- `Package` = `4` — 
- `Class` = `5` — 
- `Method` = `6` — 
- `Property` = `7` — 
- `Field` = `8` — 
- `Constructor` = `9` — 
- `Enum` = `10` — 
- `Interface` = `11` — 
- `Function` = `12` — 
- `Variable` = `13` — 
- `Constant` = `14` — 
- `String` = `15` — 
- `Number` = `16` — 
- `Boolean` = `17` — 
- `Array` = `18` — 
- `Object` = `19` — 
- `Key` = `20` — 
- `Null` = `21` — 
- `EnumMember` = `22` — 
- `Struct` = `23` — 
- `Event` = `24` — 
- `Operator` = `25` — 
- `TypeParameter` = `26` — 

### `SymbolTag`
- `Deprecated` = `1` — 

### `TextDocumentSaveReason`
- `Manual` = `1` — 
- `AfterDelay` = `2` — 
- `FocusOut` = `3` — 

### `TextDocumentSyncKind`
- `None` = `0` — 
- `Full` = `1` — 
- `Incremental` = `2` — 

### `TokenFormat`
- `Relative` = `"relative"` — 

### `TraceValue`
- `Off` = `"off"` — 
- `Messages` = `"messages"` — 
- `Verbose` = `"verbose"` — 

### `UniquenessLevel`
- `document` = `"document"` — 
- `project` = `"project"` — 
- `group` = `"group"` — 
- `scheme` = `"scheme"` — 
- `global` = `"global"` — 

### `WatchKind`
- `Create` = `1` — 
- `Change` = `2` — 
- `Delete` = `4` — 
