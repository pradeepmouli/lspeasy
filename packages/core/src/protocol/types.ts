/**
 * Re-export LSP protocol types from vscode-languageserver-protocol
 * Defines enums for all *Kind types and augments them before re-export
 */

// ============================================================================
// Enums for LSP Kind Types
// ============================================================================

/**
 * Completion item kinds
 */

import { LiteralUnion, OverrideProperties } from 'type-fest';

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

/**
 * Symbol kinds
 */
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

/**
 * Text document sync kind
 */
export enum TextDocumentSyncKind {
  None = 0,
  Full = 1,
  Incremental = 2
}

/**
 * Diagnostic severity
 */
export enum DiagnosticSeverity {
  Error = 1,
  Warning = 2,
  Information = 3,
  Hint = 4
}

/**
 * Insert text format
 */
export enum InsertTextFormat {
  PlainText = 1,
  Snippet = 2
}

/**
 * Message type for window/showMessage
 */
export enum MessageType {
  Error = 1,
  Warning = 2,
  Info = 3,
  Log = 4
}

/**
 * File change type for file watching
 */
export enum FileChangeType {
  Created = 1,
  Changed = 2,
  Deleted = 3
}

/**
 * Document highlight kind
 */
export enum DocumentHighlightKind {
  Text = 1,
  Read = 2,
  Write = 3
}

/**
 * Code action kind
 * Note: LSP spec allows custom kinds (e.g., 'refactor.extract.function')
 * Use string literals for custom kinds if needed
 */
export enum CodeActionKind {
  Empty = '',
  QuickFix = 'quickfix',
  Refactor = 'refactor',
  RefactorExtract = 'refactor.extract',
  RefactorInline = 'refactor.inline',
  RefactorRewrite = 'refactor.rewrite',
  Source = 'source',
  SourceOrganizeImports = 'source.organizeImports',
  SourceFixAll = 'source.fixAll'
}

/**
 * Completion item tag
 */
export enum CompletionItemTag {
  Deprecated = 1
}

/**
 * Symbol tag
 */
export enum SymbolTag {
  Deprecated = 1
}

/**
 * Diagnostic tag
 */
export enum DiagnosticTag {
  Unnecessary = 1,
  Deprecated = 2
}

/**
 * Text document save reason
 */
export enum TextDocumentSaveReason {
  Manual = 1,
  AfterDelay = 2,
  FocusOut = 3
}

/**
 * Folding range kind
 */
export enum FoldingRangeKind {
  Comment = 'comment',
  Imports = 'imports',
  Region = 'region'
}

/**
 * Token format
 */
export enum TokenFormat {
  Relative = 'relative'
}

// ============================================================================
// Re-export Core Types
// ============================================================================

// Core types
export type {
  Position,
  Range,
  Location,
  LocationLink,
  Diagnostic,
  DiagnosticRelatedInformation,
  Command,
  TextEdit,
  AnnotatedTextEdit,
  ChangeAnnotation,
  ChangeAnnotationIdentifier,
  TextEditChange,
  TextDocumentEdit,
  CreateFile,
  CreateFileOptions,
  RenameFile,
  RenameFileOptions,
  DeleteFile,
  DeleteFileOptions,
  TextDocumentIdentifier,
  TextDocumentItem,
  VersionedTextDocumentIdentifier,
  OptionalVersionedTextDocumentIdentifier,
  TextDocumentPositionParams,
  DocumentUri,
  URI,
  MarkupContent,
  MarkupKind,
  MarkedString,
  ParameterInformation,
  SignatureInformation,
  SignatureHelp,
  ReferenceContext,
  CodeDescription,
  integer,
  uinteger,
  decimal,
  LSPAny,
  LSPObject,
  LSPArray
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
  CompletionItemLabelDetails,
  CompletionList,
  CompletionClientCapabilities,
  CompletionOptions,
  InsertReplaceEdit,
  InsertTextMode
} from 'vscode-languageserver-protocol';

// Definition
export type {
  DefinitionParams,
  Definition,
  DefinitionLink,
  Declaration,
  DeclarationLink,
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
  BaseSymbolInformation,
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
export type { CodeActionParams, CodeActionContext } from 'vscode-languageserver-protocol';

import type {
  CodeAction as CodeActionBase,
  CodeActionClientCapabilities as CodeActionClientCapabilitiesBase,
  CodeActionOptions as CodeActionOptionsBase,
  FoldingRange as FoldingRangeBase,
  FoldingRangeClientCapabilities as FoldingRangeClientCapabilitiesBase
} from 'vscode-languageserver-protocol';

import type { SemanticTokensClientCapabilities as SemanticTokensClientCapabilitiesBase } from 'vscode-languageserver-protocol';

/**
 * CodeAction with enhanced kind type supporting both predefined and custom kinds
 */
export type CodeAction = OverrideProperties<
  CodeActionBase,
  {
    kind?: LiteralUnion<CodeActionKind, string>;
  }
>;

/**
 * CodeActionClientCapabilities with enhanced valueSet type for better autocomplete
 */
export type CodeActionClientCapabilities = OverrideProperties<
  CodeActionClientCapabilitiesBase,
  {
    codeActionLiteralSupport?: {
      codeActionKind: {
        valueSet: Array<LiteralUnion<CodeActionKind, string>>;
      };
    };
  }
>;

/**
 * CodeActionOptions with enhanced codeActionKinds type for better autocomplete
 */
export type CodeActionOptions = OverrideProperties<
  CodeActionOptionsBase,
  {
    codeActionKinds?: Array<LiteralUnion<CodeActionKind, string>>;
  }
>;

/**
 * FoldingRange with enhanced kind type supporting both predefined and custom kinds
 */
export type FoldingRange = OverrideProperties<
  FoldingRangeBase,
  {
    kind?: LiteralUnion<FoldingRangeKind, string>;
  }
>;

/**
 * FoldingRangeClientCapabilities with enhanced valueSet type for better autocomplete
 */
export type FoldingRangeClientCapabilities = OverrideProperties<
  FoldingRangeClientCapabilitiesBase,
  {
    foldingRangeKind?: {
      valueSet?: Array<LiteralUnion<FoldingRangeKind, string>>;
    };
  }
>;

/**
 * SemanticTokensClientCapabilities with enhanced formats type for better autocomplete
 */
export type SemanticTokensClientCapabilities = OverrideProperties<
  SemanticTokensClientCapabilitiesBase,
  {
    formats: Array<LiteralUnion<TokenFormat, string>>;
  }
>;

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
  TextDocumentSyncOptions
} from 'vscode-languageserver-protocol';

// Workspace
export type {
  WorkspaceFolder,
  WorkspaceFoldersChangeEvent,
  DidChangeWorkspaceFoldersParams,
  DidChangeConfigurationParams,
  ConfigurationParams
} from 'vscode-languageserver-protocol';

// Text Document Sync
export type {
  DidOpenTextDocumentParams,
  DidChangeTextDocumentParams,
  TextDocumentContentChangeEvent,
  DidCloseTextDocumentParams,
  DidSaveTextDocumentParams,
  WillSaveTextDocumentParams
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
  MessageActionItem,
  LogMessageParams
} from 'vscode-languageserver-protocol';

// Code Lens
export type { CodeLens } from 'vscode-languageserver-protocol';

// Document Link
export type { DocumentLink } from 'vscode-languageserver-protocol';

// Document Highlight
export type { DocumentHighlight } from 'vscode-languageserver-protocol';

// Selection Range
export type { SelectionRange } from 'vscode-languageserver-protocol';

// Semantic Tokens
export type {
  SemanticTokens,
  SemanticTokensLegend,
  SemanticTokensEdit,
  SemanticTokensDelta,
  SemanticTokenTypes,
  SemanticTokenModifiers
} from 'vscode-languageserver-protocol';

// Inlay Hint
export type { InlayHint, InlayHintLabelPart, InlayHintKind } from 'vscode-languageserver-protocol';

// Inline Completion
export type {
  InlineCompletionItem,
  InlineCompletionList,
  InlineCompletionContext,
  InlineCompletionTriggerKind
} from 'vscode-languageserver-protocol';

// Inline Value
export type {
  InlineValue,
  InlineValueContext,
  InlineValueText,
  InlineValueVariableLookup,
  InlineValueEvaluatableExpression
} from 'vscode-languageserver-protocol';

// Call Hierarchy
export type {
  CallHierarchyItem,
  CallHierarchyIncomingCall,
  CallHierarchyOutgoingCall
} from 'vscode-languageserver-protocol';

// Type Hierarchy
export type { TypeHierarchyItem } from 'vscode-languageserver-protocol';

// Color
export type { Color, ColorInformation, ColorPresentation } from 'vscode-languageserver-protocol';

// Other enums and constants
export type {
  CodeActionTriggerKind,
  EOL,
  LSPErrorCodes,
  TextDocument
} from 'vscode-languageserver-protocol';
