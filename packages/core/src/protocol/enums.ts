/**
 * LSP Protocol Enums
 *
 * Emitted as const objects + union type aliases for structural compatibility
 * with vscode-languageserver-protocol, which uses the same pattern.
 *
 * Auto-generated from metaModel.json
 * DO NOT EDIT MANUALLY
 */

export const ApplyKind = {
  Replace: 1,
  Merge: 2
} as const;

export type ApplyKind = 1 | 2;

export const CodeActionKind = {
  Empty: '',
  QuickFix: 'quickfix',
  Refactor: 'refactor',
  RefactorExtract: 'refactor.extract',
  RefactorInline: 'refactor.inline',
  RefactorMove: 'refactor.move',
  RefactorRewrite: 'refactor.rewrite',
  Source: 'source',
  SourceOrganizeImports: 'source.organizeImports',
  SourceFixAll: 'source.fixAll',
  Notebook: 'notebook'
} as const;

export type CodeActionKind =
  | ''
  | 'quickfix'
  | 'refactor'
  | 'refactor.extract'
  | 'refactor.inline'
  | 'refactor.move'
  | 'refactor.rewrite'
  | 'source'
  | 'source.organizeImports'
  | 'source.fixAll'
  | 'notebook'
  | string;

export const CodeActionTag = {
  LLMGenerated: 1
} as const;

export type CodeActionTag = 1;

export const CodeActionTriggerKind = {
  Invoked: 1,
  Automatic: 2
} as const;

export type CodeActionTriggerKind = 1 | 2;

export const CompletionItemKind = {
  Text: 1,
  Method: 2,
  Function: 3,
  Constructor: 4,
  Field: 5,
  Variable: 6,
  Class: 7,
  Interface: 8,
  Module: 9,
  Property: 10,
  Unit: 11,
  Value: 12,
  Enum: 13,
  Keyword: 14,
  Snippet: 15,
  Color: 16,
  File: 17,
  Reference: 18,
  Folder: 19,
  EnumMember: 20,
  Constant: 21,
  Struct: 22,
  Event: 23,
  Operator: 24,
  TypeParameter: 25
} as const;

export type CompletionItemKind =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25;

export const CompletionItemTag = {
  Deprecated: 1
} as const;

export type CompletionItemTag = 1;

export const CompletionTriggerKind = {
  Invoked: 1,
  TriggerCharacter: 2,
  TriggerForIncompleteCompletions: 3
} as const;

export type CompletionTriggerKind = 1 | 2 | 3;

export const DiagnosticSeverity = {
  Error: 1,
  Warning: 2,
  Information: 3,
  Hint: 4
} as const;

export type DiagnosticSeverity = 1 | 2 | 3 | 4;

export const DiagnosticTag = {
  Unnecessary: 1,
  Deprecated: 2
} as const;

export type DiagnosticTag = 1 | 2;

export const DocumentDiagnosticReportKind = {
  Full: 'full',
  Unchanged: 'unchanged'
} as const;

export type DocumentDiagnosticReportKind = 'full' | 'unchanged';

export const DocumentHighlightKind = {
  Text: 1,
  Read: 2,
  Write: 3
} as const;

export type DocumentHighlightKind = 1 | 2 | 3;

export const ErrorCodes = {
  ParseError: -32700,
  InvalidRequest: -32600,
  MethodNotFound: -32601,
  InvalidParams: -32602,
  InternalError: -32603,
  ServerNotInitialized: -32002,
  UnknownErrorCode: -32001
} as const;

export type ErrorCodes = -32700 | -32600 | -32601 | -32602 | -32603 | -32002 | -32001 | number;

export const FailureHandlingKind = {
  Abort: 'abort',
  Transactional: 'transactional',
  TextOnlyTransactional: 'textOnlyTransactional',
  Undo: 'undo'
} as const;

export type FailureHandlingKind = 'abort' | 'transactional' | 'textOnlyTransactional' | 'undo';

export const FileChangeType = {
  Created: 1,
  Changed: 2,
  Deleted: 3
} as const;

export type FileChangeType = 1 | 2 | 3;

export const FileOperationPatternKind = {
  file: 'file',
  folder: 'folder'
} as const;

export type FileOperationPatternKind = 'file' | 'folder';

export const FoldingRangeKind = {
  Comment: 'comment',
  Imports: 'imports',
  Region: 'region'
} as const;

export type FoldingRangeKind = 'comment' | 'imports' | 'region' | string;

export const InlayHintKind = {
  Type: 1,
  Parameter: 2
} as const;

export type InlayHintKind = 1 | 2;

export const InlineCompletionTriggerKind = {
  Invoked: 1,
  Automatic: 2
} as const;

export type InlineCompletionTriggerKind = 1 | 2;

export const InsertTextFormat = {
  PlainText: 1,
  Snippet: 2
} as const;

export type InsertTextFormat = 1 | 2;

export const InsertTextMode = {
  asIs: 1,
  adjustIndentation: 2
} as const;

export type InsertTextMode = 1 | 2;

export const LanguageKind = {
  ABAP: 'abap',
  WindowsBat: 'bat',
  BibTeX: 'bibtex',
  Clojure: 'clojure',
  Coffeescript: 'coffeescript',
  C: 'c',
  CPP: 'cpp',
  CSharp: 'csharp',
  CSS: 'css',
  D: 'd',
  Delphi: 'pascal',
  Diff: 'diff',
  Dart: 'dart',
  Dockerfile: 'dockerfile',
  Elixir: 'elixir',
  Erlang: 'erlang',
  FSharp: 'fsharp',
  GitCommit: 'git-commit',
  GitRebase: 'git-rebase',
  Go: 'go',
  Groovy: 'groovy',
  Handlebars: 'handlebars',
  Haskell: 'haskell',
  HTML: 'html',
  Ini: 'ini',
  Java: 'java',
  JavaScript: 'javascript',
  JavaScriptReact: 'javascriptreact',
  JSON: 'json',
  LaTeX: 'latex',
  Less: 'less',
  Lua: 'lua',
  Makefile: 'makefile',
  Markdown: 'markdown',
  ObjectiveC: 'objective-c',
  ObjectiveCPP: 'objective-cpp',
  Pascal: 'pascal',
  Perl: 'perl',
  Perl6: 'perl6',
  PHP: 'php',
  Plaintext: 'plaintext',
  Powershell: 'powershell',
  Pug: 'jade',
  Python: 'python',
  R: 'r',
  Razor: 'razor',
  Ruby: 'ruby',
  Rust: 'rust',
  SCSS: 'scss',
  SASS: 'sass',
  Scala: 'scala',
  ShaderLab: 'shaderlab',
  ShellScript: 'shellscript',
  SQL: 'sql',
  Swift: 'swift',
  TypeScript: 'typescript',
  TypeScriptReact: 'typescriptreact',
  TeX: 'tex',
  VisualBasic: 'vb',
  XML: 'xml',
  XSL: 'xsl',
  YAML: 'yaml'
} as const;

export type LanguageKind =
  | 'abap'
  | 'bat'
  | 'bibtex'
  | 'clojure'
  | 'coffeescript'
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'css'
  | 'd'
  | 'pascal'
  | 'diff'
  | 'dart'
  | 'dockerfile'
  | 'elixir'
  | 'erlang'
  | 'fsharp'
  | 'git-commit'
  | 'git-rebase'
  | 'go'
  | 'groovy'
  | 'handlebars'
  | 'haskell'
  | 'html'
  | 'ini'
  | 'java'
  | 'javascript'
  | 'javascriptreact'
  | 'json'
  | 'latex'
  | 'less'
  | 'lua'
  | 'makefile'
  | 'markdown'
  | 'objective-c'
  | 'objective-cpp'
  | 'pascal'
  | 'perl'
  | 'perl6'
  | 'php'
  | 'plaintext'
  | 'powershell'
  | 'jade'
  | 'python'
  | 'r'
  | 'razor'
  | 'ruby'
  | 'rust'
  | 'scss'
  | 'sass'
  | 'scala'
  | 'shaderlab'
  | 'shellscript'
  | 'sql'
  | 'swift'
  | 'typescript'
  | 'typescriptreact'
  | 'tex'
  | 'vb'
  | 'xml'
  | 'xsl'
  | 'yaml'
  | string;

export const LSPErrorCodes = {
  RequestFailed: -32803,
  ServerCancelled: -32802,
  ContentModified: -32801,
  RequestCancelled: -32800
} as const;

export type LSPErrorCodes = -32803 | -32802 | -32801 | -32800 | number;

export const MarkupKind = {
  PlainText: 'plaintext',
  Markdown: 'markdown'
} as const;

export type MarkupKind = 'plaintext' | 'markdown';

export const MessageType = {
  Error: 1,
  Warning: 2,
  Info: 3,
  Log: 4,
  Debug: 5
} as const;

export type MessageType = 1 | 2 | 3 | 4 | 5;

export const MonikerKind = {
  import: 'import',
  export: 'export',
  local: 'local'
} as const;

export type MonikerKind = 'import' | 'export' | 'local';

export const NotebookCellKind = {
  Markup: 1,
  Code: 2
} as const;

export type NotebookCellKind = 1 | 2;

export const PositionEncodingKind = {
  UTF8: 'utf-8',
  UTF16: 'utf-16',
  UTF32: 'utf-32'
} as const;

export type PositionEncodingKind = 'utf-8' | 'utf-16' | 'utf-32' | string;

export const PrepareSupportDefaultBehavior = {
  Identifier: 1
} as const;

export type PrepareSupportDefaultBehavior = 1;

export const ResourceOperationKind = {
  Create: 'create',
  Rename: 'rename',
  Delete: 'delete'
} as const;

export type ResourceOperationKind = 'create' | 'rename' | 'delete';

export const SemanticTokenModifiers = {
  declaration: 'declaration',
  definition: 'definition',
  readonly: 'readonly',
  static: 'static',
  deprecated: 'deprecated',
  abstract: 'abstract',
  async: 'async',
  modification: 'modification',
  documentation: 'documentation',
  defaultLibrary: 'defaultLibrary'
} as const;

export type SemanticTokenModifiers =
  | 'declaration'
  | 'definition'
  | 'readonly'
  | 'static'
  | 'deprecated'
  | 'abstract'
  | 'async'
  | 'modification'
  | 'documentation'
  | 'defaultLibrary'
  | string;

export const SemanticTokenTypes = {
  namespace: 'namespace',
  type: 'type',
  class: 'class',
  enum: 'enum',
  interface: 'interface',
  struct: 'struct',
  typeParameter: 'typeParameter',
  parameter: 'parameter',
  variable: 'variable',
  property: 'property',
  enumMember: 'enumMember',
  event: 'event',
  function: 'function',
  method: 'method',
  macro: 'macro',
  keyword: 'keyword',
  modifier: 'modifier',
  comment: 'comment',
  string: 'string',
  number: 'number',
  regexp: 'regexp',
  operator: 'operator',
  decorator: 'decorator',
  label: 'label'
} as const;

export type SemanticTokenTypes =
  | 'namespace'
  | 'type'
  | 'class'
  | 'enum'
  | 'interface'
  | 'struct'
  | 'typeParameter'
  | 'parameter'
  | 'variable'
  | 'property'
  | 'enumMember'
  | 'event'
  | 'function'
  | 'method'
  | 'macro'
  | 'keyword'
  | 'modifier'
  | 'comment'
  | 'string'
  | 'number'
  | 'regexp'
  | 'operator'
  | 'decorator'
  | 'label'
  | string;

export const SignatureHelpTriggerKind = {
  Invoked: 1,
  TriggerCharacter: 2,
  ContentChange: 3
} as const;

export type SignatureHelpTriggerKind = 1 | 2 | 3;

export const SymbolKind = {
  File: 1,
  Module: 2,
  Namespace: 3,
  Package: 4,
  Class: 5,
  Method: 6,
  Property: 7,
  Field: 8,
  Constructor: 9,
  Enum: 10,
  Interface: 11,
  Function: 12,
  Variable: 13,
  Constant: 14,
  String: 15,
  Number: 16,
  Boolean: 17,
  Array: 18,
  Object: 19,
  Key: 20,
  Null: 21,
  EnumMember: 22,
  Struct: 23,
  Event: 24,
  Operator: 25,
  TypeParameter: 26
} as const;

export type SymbolKind =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26;

export const SymbolTag = {
  Deprecated: 1
} as const;

export type SymbolTag = 1;

export const TextDocumentSaveReason = {
  Manual: 1,
  AfterDelay: 2,
  FocusOut: 3
} as const;

export type TextDocumentSaveReason = 1 | 2 | 3;

export const TextDocumentSyncKind = {
  None: 0,
  Full: 1,
  Incremental: 2
} as const;

export type TextDocumentSyncKind = 0 | 1 | 2;

export const TokenFormat = {
  Relative: 'relative'
} as const;

export type TokenFormat = 'relative';

export const TraceValue = {
  Off: 'off',
  Messages: 'messages',
  Compact: 'compact',
  Verbose: 'verbose'
} as const;

export type TraceValue = 'off' | 'messages' | 'compact' | 'verbose';

export const UniquenessLevel = {
  document: 'document',
  project: 'project',
  group: 'group',
  scheme: 'scheme',
  global: 'global'
} as const;

export type UniquenessLevel = 'document' | 'project' | 'group' | 'scheme' | 'global';

export const WatchKind = {
  Create: 1,
  Change: 2,
  Delete: 4
} as const;

export type WatchKind = 1 | 2 | 4 | number;
