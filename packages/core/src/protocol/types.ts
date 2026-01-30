/**
 * Re-export LSP protocol types from vscode-languageserver-protocol
 * Type-only imports to avoid runtime dependencies
 */

// Core types
export type {
  Position,
  Range,
  Location,
  LocationLink,
  DiagnosticSeverity,
  DiagnosticTag,
  Diagnostic,
  Command,
  TextEdit,
  TextDocumentIdentifier,
  TextDocumentItem,
  VersionedTextDocumentIdentifier,
  TextDocumentPositionParams,
  DocumentUri
} from 'vscode-languageserver-protocol';

// Hover
export type {
  HoverParams,
  Hover,
  HoverClientCapabilities,
  HoverOptions
} from 'vscode-languageserver-protocol';

// Completion
export type {
  CompletionParams,
  CompletionItem,
  CompletionList,
  CompletionItemKind,
  InsertTextFormat,
  CompletionClientCapabilities,
  CompletionOptions
} from 'vscode-languageserver-protocol';

// Definition
export type {
  DefinitionParams,
  Definition,
  DefinitionLink,
  DefinitionClientCapabilities,
  DefinitionOptions
} from 'vscode-languageserver-protocol';

// References
export type {
  ReferenceParams,
  ReferenceClientCapabilities,
  ReferenceOptions
} from 'vscode-languageserver-protocol';

// Document Symbol
export type {
  DocumentSymbolParams,
  DocumentSymbol,
  SymbolInformation,
  SymbolKind,
  SymbolTag,
  DocumentSymbolClientCapabilities,
  DocumentSymbolOptions
} from 'vscode-languageserver-protocol';

// Workspace Symbol
export type {
  WorkspaceSymbolParams,
  WorkspaceSymbol,
  WorkspaceSymbolClientCapabilities,
  WorkspaceSymbolOptions
} from 'vscode-languageserver-protocol';

// Code Action
export type {
  CodeActionParams,
  CodeAction,
  CodeActionKind,
  CodeActionContext,
  CodeActionClientCapabilities,
  CodeActionOptions
} from 'vscode-languageserver-protocol';

// Formatting
export type {
  DocumentFormattingParams,
  DocumentRangeFormattingParams,
  DocumentOnTypeFormattingParams,
  FormattingOptions,
  DocumentFormattingClientCapabilities,
  DocumentFormattingOptions
} from 'vscode-languageserver-protocol';

// Rename
export type {
  RenameParams,
  PrepareRenameParams,
  WorkspaceEdit,
  RenameClientCapabilities,
  RenameOptions
} from 'vscode-languageserver-protocol';

// Initialization
export type {
  InitializeParams,
  InitializeResult,
  InitializeError,
  InitializedParams,
  ServerCapabilities,
  ClientCapabilities,
  TextDocumentSyncKind,
  TextDocumentSyncOptions
} from 'vscode-languageserver-protocol';

// Workspace
export type {
  WorkspaceFolder,
  WorkspaceFoldersChangeEvent,
  DidChangeWorkspaceFoldersParams,
  DidChangeConfigurationParams,
  ConfigurationParams,
  ConfigurationItem
} from 'vscode-languageserver-protocol';

// Text Document Sync
export type {
  DidOpenTextDocumentParams,
  DidChangeTextDocumentParams,
  TextDocumentContentChangeEvent,
  DidCloseTextDocumentParams,
  DidSaveTextDocumentParams,
  WillSaveTextDocumentParams,
  TextDocumentSaveReason
} from 'vscode-languageserver-protocol';

// Diagnostics
export type {
  PublishDiagnosticsParams,
  DiagnosticClientCapabilities
} from 'vscode-languageserver-protocol';

// Progress
export type {
  WorkDoneProgressParams,
  WorkDoneProgressOptions,
  WorkDoneProgressBegin,
  WorkDoneProgressReport,
  WorkDoneProgressEnd,
  PartialResultParams
} from 'vscode-languageserver-protocol';

// File watching
export type {
  DidChangeWatchedFilesParams,
  FileEvent,
  FileChangeType,
  DidChangeWatchedFilesClientCapabilities
} from 'vscode-languageserver-protocol';

// Execute command
export type {
  ExecuteCommandParams,
  ExecuteCommandClientCapabilities,
  ExecuteCommandOptions
} from 'vscode-languageserver-protocol';

// Window types
export type {
  ShowMessageParams,
  ShowMessageRequestParams,
  MessageType,
  MessageActionItem,
  LogMessageParams
} from 'vscode-languageserver-protocol';
