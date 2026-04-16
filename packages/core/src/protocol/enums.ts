/**
 * LSP Protocol Enums
 *
 * Auto-generated from metaModel.json
 * DO NOT EDIT MANUALLY
 */
/* oxlint-disable typescript-eslint/no-duplicate-enum-values */
export enum ApplyKind {
  Replace = 1,
  Merge = 2
}

export enum CodeActionKind {
  Empty = '',
  QuickFix = 'quickfix',
  Refactor = 'refactor',
  RefactorExtract = 'refactor.extract',
  RefactorInline = 'refactor.inline',
  RefactorMove = 'refactor.move',
  RefactorRewrite = 'refactor.rewrite',
  Source = 'source',
  SourceOrganizeImports = 'source.organizeImports',
  SourceFixAll = 'source.fixAll',
  Notebook = 'notebook'
}

export enum CodeActionTag {
  LLMGenerated = 1
}

export enum CodeActionTriggerKind {
  Invoked = 1,
  Automatic = 2
}

export enum CompletionItemKind {
  Text = 1,
  Method = 2,
  Function = 3,
  Constructor = 4,
  Field = 5,
  Variable = 6,
  Class = 7,
  Interface = 8,
  Module = 9,
  Property = 10,
  Unit = 11,
  Value = 12,
  Enum = 13,
  Keyword = 14,
  Snippet = 15,
  Color = 16,
  File = 17,
  Reference = 18,
  Folder = 19,
  EnumMember = 20,
  Constant = 21,
  Struct = 22,
  Event = 23,
  Operator = 24,
  TypeParameter = 25
}

export enum CompletionItemTag {
  Deprecated = 1
}

export enum CompletionTriggerKind {
  Invoked = 1,
  TriggerCharacter = 2,
  TriggerForIncompleteCompletions = 3
}

export enum DiagnosticSeverity {
  Error = 1,
  Warning = 2,
  Information = 3,
  Hint = 4
}

export enum DiagnosticTag {
  Unnecessary = 1,
  Deprecated = 2
}

export enum DocumentDiagnosticReportKind {
  Full = 'full',
  Unchanged = 'unchanged'
}

export enum DocumentHighlightKind {
  Text = 1,
  Read = 2,
  Write = 3
}

export enum ErrorCodes {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
  ServerNotInitialized = -32002,
  UnknownErrorCode = -32001
}

export enum FailureHandlingKind {
  Abort = 'abort',
  Transactional = 'transactional',
  TextOnlyTransactional = 'textOnlyTransactional',
  Undo = 'undo'
}

export enum FileChangeType {
  Created = 1,
  Changed = 2,
  Deleted = 3
}

export enum FileOperationPatternKind {
  file = 'file',
  folder = 'folder'
}

export enum FoldingRangeKind {
  Comment = 'comment',
  Imports = 'imports',
  Region = 'region'
}

export enum InlayHintKind {
  Type = 1,
  Parameter = 2
}

export enum InlineCompletionTriggerKind {
  Invoked = 1,
  Automatic = 2
}

export enum InsertTextFormat {
  PlainText = 1,
  Snippet = 2
}

export enum InsertTextMode {
  asIs = 1,
  adjustIndentation = 2
}

export enum LanguageKind {
  ABAP = 'abap',
  WindowsBat = 'bat',
  BibTeX = 'bibtex',
  Clojure = 'clojure',
  Coffeescript = 'coffeescript',
  C = 'c',
  CPP = 'cpp',
  CSharp = 'csharp',
  CSS = 'css',
  D = 'd',
  Delphi = 'pascal',
  Diff = 'diff',
  Dart = 'dart',
  Dockerfile = 'dockerfile',
  Elixir = 'elixir',
  Erlang = 'erlang',
  FSharp = 'fsharp',
  GitCommit = 'git-commit',
  GitRebase = 'rebase',
  Go = 'go',
  Groovy = 'groovy',
  Handlebars = 'handlebars',
  Haskell = 'haskell',
  HTML = 'html',
  Ini = 'ini',
  Java = 'java',
  JavaScript = 'javascript',
  JavaScriptReact = 'javascriptreact',
  JSON = 'json',
  LaTeX = 'latex',
  Less = 'less',
  Lua = 'lua',
  Makefile = 'makefile',
  Markdown = 'markdown',
  ObjectiveC = 'objective-c',
  ObjectiveCPP = 'objective-cpp',
  Pascal = 'pascal',
  Perl = 'perl',
  Perl6 = 'perl6',
  PHP = 'php',
  Powershell = 'powershell',
  Pug = 'jade',
  Python = 'python',
  R = 'r',
  Razor = 'razor',
  Ruby = 'ruby',
  Rust = 'rust',
  SCSS = 'scss',
  SASS = 'sass',
  Scala = 'scala',
  ShaderLab = 'shaderlab',
  ShellScript = 'shellscript',
  SQL = 'sql',
  Swift = 'swift',
  TypeScript = 'typescript',
  TypeScriptReact = 'typescriptreact',
  TeX = 'tex',
  VisualBasic = 'vb',
  XML = 'xml',
  XSL = 'xsl',
  YAML = 'yaml'
}

export enum LSPErrorCodes {
  RequestFailed = -32803,
  ServerCancelled = -32802,
  ContentModified = -32801,
  RequestCancelled = -32800
}

export enum MarkupKind {
  PlainText = 'plaintext',
  Markdown = 'markdown'
}

export enum MessageType {
  Error = 1,
  Warning = 2,
  Info = 3,
  Log = 4,
  Debug = 5
}

export enum MonikerKind {
  'import' = 'import',
  'export' = 'export',
  local = 'local'
}

export enum NotebookCellKind {
  Markup = 1,
  Code = 2
}

export enum PositionEncodingKind {
  UTF8 = 'utf-8',
  UTF16 = 'utf-16',
  UTF32 = 'utf-32'
}

export enum PrepareSupportDefaultBehavior {
  Identifier = 1
}

export enum ResourceOperationKind {
  Create = 'create',
  Rename = 'rename',
  Delete = 'delete'
}

export enum SemanticTokenModifiers {
  declaration = 'declaration',
  definition = 'definition',
  readonly = 'readonly',
  'static' = 'static',
  deprecated = 'deprecated',
  abstract = 'abstract',
  async = 'async',
  modification = 'modification',
  documentation = 'documentation',
  defaultLibrary = 'defaultLibrary'
}

export enum SemanticTokenTypes {
  namespace = 'namespace',
  type = 'type',
  'class' = 'class',
  'enum' = 'enum',
  'interface' = 'interface',
  struct = 'struct',
  typeParameter = 'typeParameter',
  parameter = 'parameter',
  variable = 'variable',
  property = 'property',
  enumMember = 'enumMember',
  event = 'event',
  'function' = 'function',
  method = 'method',
  macro = 'macro',
  keyword = 'keyword',
  modifier = 'modifier',
  comment = 'comment',
  string = 'string',
  number = 'number',
  regexp = 'regexp',
  operator = 'operator',
  decorator = 'decorator',
  label = 'label'
}

export enum SignatureHelpTriggerKind {
  Invoked = 1,
  TriggerCharacter = 2,
  ContentChange = 3
}

export enum SymbolKind {
  File = 1,
  Module = 2,
  Namespace = 3,
  Package = 4,
  Class = 5,
  Method = 6,
  Property = 7,
  Field = 8,
  Constructor = 9,
  Enum = 10,
  Interface = 11,
  Function = 12,
  Variable = 13,
  Constant = 14,
  String = 15,
  Number = 16,
  Boolean = 17,
  Array = 18,
  Object = 19,
  Key = 20,
  Null = 21,
  EnumMember = 22,
  Struct = 23,
  Event = 24,
  Operator = 25,
  TypeParameter = 26
}

export enum SymbolTag {
  Deprecated = 1
}

export enum TextDocumentSaveReason {
  Manual = 1,
  AfterDelay = 2,
  FocusOut = 3
}

export enum TextDocumentSyncKind {
  None = 0,
  Full = 1,
  Incremental = 2
}

export enum TokenFormat {
  Relative = 'relative'
}

export enum TraceValue {
  Off = 'off',
  Messages = 'messages',
  Verbose = 'verbose'
}

export enum UniquenessLevel {
  document = 'document',
  project = 'project',
  group = 'group',
  scheme = 'scheme',
  global = 'global'
}

export enum WatchKind {
  Create = 1,
  Change = 2,
  Delete = 4
}
