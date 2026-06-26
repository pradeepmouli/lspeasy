/**
 * Type-compatibility verification between @lspeasy/core and vscode-languageserver-protocol.
 *
 * Every struct in COMPAT_CHECK_TYPES and every enum in COMPAT_CHECK_ENUMS is
 * checked bidirectionally against its VSCode counterpart:
 *   _fromVscode  — every VSCode value is accepted by our type  (not too narrow)
 *   _toVscode    — our value is accepted by VSCode's type       (not too wide)
 *
 * Our enums are emitted as const objects + union type aliases (matching the
 * vscode-languageserver-protocol pattern), so checks are direct _Extends assertions
 * — no normalization helper needed.
 *
 * Auto-generated — DO NOT EDIT MANUALLY
 */

import type {
  ServerCapabilities as VscodeServerCapabilities,
  ClientCapabilities as VscodeClientCapabilities,
  InitializeParams as VscodeInitializeParams,
  CompletionItem as VscodeCompletionItem,
  Diagnostic as VscodeDiagnostic,
  TextEdit as VscodeTextEdit,
  Location as VscodeLocation,
  Position as VscodePosition,
  Range as VscodeRange,
  Hover as VscodeHover,
  DocumentSymbol as VscodeDocumentSymbol,
  WorkspaceFolder as VscodeWorkspaceFolder,
  ProgressToken as VscodeProgressToken,
  WorkDoneProgressBegin as VscodeWorkDoneProgressBegin,
  WorkDoneProgressReport as VscodeWorkDoneProgressReport,
  WorkDoneProgressEnd as VscodeWorkDoneProgressEnd,
  TextDocumentContentChangeEvent as VscodeTextDocumentContentChangeEvent,
  VersionedTextDocumentIdentifier as VscodeVersionedTextDocumentIdentifier,
  DidChangeTextDocumentParams as VscodeDidChangeTextDocumentParams,
  DidOpenTextDocumentParams as VscodeDidOpenTextDocumentParams,
  DidCloseTextDocumentParams as VscodeDidCloseTextDocumentParams,
  DidSaveTextDocumentParams as VscodeDidSaveTextDocumentParams,
  ApplyKind as VscodeApplyKind,
  CodeActionKind as VscodeCodeActionKind,
  CodeActionTag as VscodeCodeActionTag,
  CodeActionTriggerKind as VscodeCodeActionTriggerKind,
  CompletionItemKind as VscodeCompletionItemKind,
  CompletionItemTag as VscodeCompletionItemTag,
  CompletionTriggerKind as VscodeCompletionTriggerKind,
  DiagnosticSeverity as VscodeDiagnosticSeverity,
  DiagnosticTag as VscodeDiagnosticTag,
  DocumentDiagnosticReportKind as VscodeDocumentDiagnosticReportKind,
  DocumentHighlightKind as VscodeDocumentHighlightKind,
  FailureHandlingKind as VscodeFailureHandlingKind,
  FileChangeType as VscodeFileChangeType,
  FileOperationPatternKind as VscodeFileOperationPatternKind,
  FoldingRangeKind as VscodeFoldingRangeKind,
  InlayHintKind as VscodeInlayHintKind,
  InlineCompletionTriggerKind as VscodeInlineCompletionTriggerKind,
  InsertTextFormat as VscodeInsertTextFormat,
  InsertTextMode as VscodeInsertTextMode,
  LanguageKind as VscodeLanguageKind,
  MarkupKind as VscodeMarkupKind,
  MessageType as VscodeMessageType,
  MonikerKind as VscodeMonikerKind,
  NotebookCellKind as VscodeNotebookCellKind,
  PrepareSupportDefaultBehavior as VscodePrepareSupportDefaultBehavior,
  ResourceOperationKind as VscodeResourceOperationKind,
  SignatureHelpTriggerKind as VscodeSignatureHelpTriggerKind,
  SymbolKind as VscodeSymbolKind,
  SymbolTag as VscodeSymbolTag,
  TextDocumentSaveReason as VscodeTextDocumentSaveReason,
  TextDocumentSyncKind as VscodeTextDocumentSyncKind,
  TokenFormat as VscodeTokenFormat,
  TraceValue as VscodeTraceValue,
  UniquenessLevel as VscodeUniquenessLevel
} from 'vscode-languageserver-protocol';

import type {
  ServerCapabilities,
  ClientCapabilities,
  InitializeParams,
  CompletionItem,
  Diagnostic,
  TextEdit,
  Location,
  Position,
  Range,
  Hover,
  DocumentSymbol,
  WorkspaceFolder,
  ProgressToken,
  WorkDoneProgressBegin,
  WorkDoneProgressReport,
  WorkDoneProgressEnd,
  TextDocumentContentChangeEvent,
  VersionedTextDocumentIdentifier,
  DidChangeTextDocumentParams,
  DidOpenTextDocumentParams,
  DidCloseTextDocumentParams,
  DidSaveTextDocumentParams,
  ApplyKind,
  CodeActionKind,
  CodeActionTag,
  CodeActionTriggerKind,
  CompletionItemKind,
  CompletionItemTag,
  CompletionTriggerKind,
  DiagnosticSeverity,
  DiagnosticTag,
  DocumentDiagnosticReportKind,
  DocumentHighlightKind,
  FailureHandlingKind,
  FileChangeType,
  FileOperationPatternKind,
  FoldingRangeKind,
  InlayHintKind,
  InlineCompletionTriggerKind,
  InsertTextFormat,
  InsertTextMode,
  LanguageKind,
  MarkupKind,
  MessageType,
  MonikerKind,
  NotebookCellKind,
  PrepareSupportDefaultBehavior,
  ResourceOperationKind,
  SignatureHelpTriggerKind,
  SymbolKind,
  SymbolTag,
  TextDocumentSaveReason,
  TextDocumentSyncKind,
  TokenFormat,
  TraceValue,
  UniquenessLevel
} from '@lspeasy/core';

// Structural assertion helper.
type _Extends<Sub extends Sup, Sup> = void;

// ── Structs: not-too-narrow ──────────────────────────────────────────────────
type _ServerCapabilities_fromVscode = _Extends<VscodeServerCapabilities, ServerCapabilities>;
type _ClientCapabilities_fromVscode = _Extends<VscodeClientCapabilities, ClientCapabilities>;
type _InitializeParams_fromVscode = _Extends<VscodeInitializeParams, InitializeParams>;
type _CompletionItem_fromVscode = _Extends<VscodeCompletionItem, CompletionItem>;
type _Diagnostic_fromVscode = _Extends<VscodeDiagnostic, Diagnostic>;
type _TextEdit_fromVscode = _Extends<VscodeTextEdit, TextEdit>;
type _Location_fromVscode = _Extends<VscodeLocation, Location>;
type _Position_fromVscode = _Extends<VscodePosition, Position>;
type _Range_fromVscode = _Extends<VscodeRange, Range>;
type _Hover_fromVscode = _Extends<VscodeHover, Hover>;
type _DocumentSymbol_fromVscode = _Extends<VscodeDocumentSymbol, DocumentSymbol>;
type _WorkspaceFolder_fromVscode = _Extends<VscodeWorkspaceFolder, WorkspaceFolder>;
type _ProgressToken_fromVscode = _Extends<VscodeProgressToken, ProgressToken>;
type _WorkDoneProgressBegin_fromVscode = _Extends<
  VscodeWorkDoneProgressBegin,
  WorkDoneProgressBegin
>;
type _WorkDoneProgressReport_fromVscode = _Extends<
  VscodeWorkDoneProgressReport,
  WorkDoneProgressReport
>;
type _WorkDoneProgressEnd_fromVscode = _Extends<VscodeWorkDoneProgressEnd, WorkDoneProgressEnd>;
type _TextDocumentContentChangeEvent_fromVscode = _Extends<
  VscodeTextDocumentContentChangeEvent,
  TextDocumentContentChangeEvent
>;
type _VersionedTextDocumentIdentifier_fromVscode = _Extends<
  VscodeVersionedTextDocumentIdentifier,
  VersionedTextDocumentIdentifier
>;
type _DidChangeTextDocumentParams_fromVscode = _Extends<
  VscodeDidChangeTextDocumentParams,
  DidChangeTextDocumentParams
>;
type _DidOpenTextDocumentParams_fromVscode = _Extends<
  VscodeDidOpenTextDocumentParams,
  DidOpenTextDocumentParams
>;
type _DidCloseTextDocumentParams_fromVscode = _Extends<
  VscodeDidCloseTextDocumentParams,
  DidCloseTextDocumentParams
>;
type _DidSaveTextDocumentParams_fromVscode = _Extends<
  VscodeDidSaveTextDocumentParams,
  DidSaveTextDocumentParams
>;

// ── Structs: not-too-wide ────────────────────────────────────────────────────
type _ServerCapabilities_toVscode = _Extends<ServerCapabilities, VscodeServerCapabilities>;
type _ClientCapabilities_toVscode = _Extends<ClientCapabilities, VscodeClientCapabilities>;
type _InitializeParams_toVscode = _Extends<InitializeParams, VscodeInitializeParams>;
type _CompletionItem_toVscode = _Extends<CompletionItem, VscodeCompletionItem>;
type _Diagnostic_toVscode = _Extends<Diagnostic, VscodeDiagnostic>;
type _TextEdit_toVscode = _Extends<TextEdit, VscodeTextEdit>;
type _Location_toVscode = _Extends<Location, VscodeLocation>;
type _Position_toVscode = _Extends<Position, VscodePosition>;
type _Range_toVscode = _Extends<Range, VscodeRange>;
type _Hover_toVscode = _Extends<Hover, VscodeHover>;
type _DocumentSymbol_toVscode = _Extends<DocumentSymbol, VscodeDocumentSymbol>;
type _WorkspaceFolder_toVscode = _Extends<WorkspaceFolder, VscodeWorkspaceFolder>;
type _ProgressToken_toVscode = _Extends<ProgressToken, VscodeProgressToken>;
type _WorkDoneProgressBegin_toVscode = _Extends<WorkDoneProgressBegin, VscodeWorkDoneProgressBegin>;
type _WorkDoneProgressReport_toVscode = _Extends<
  WorkDoneProgressReport,
  VscodeWorkDoneProgressReport
>;
type _WorkDoneProgressEnd_toVscode = _Extends<WorkDoneProgressEnd, VscodeWorkDoneProgressEnd>;
type _TextDocumentContentChangeEvent_toVscode = _Extends<
  TextDocumentContentChangeEvent,
  VscodeTextDocumentContentChangeEvent
>;
type _VersionedTextDocumentIdentifier_toVscode = _Extends<
  VersionedTextDocumentIdentifier,
  VscodeVersionedTextDocumentIdentifier
>;
type _DidChangeTextDocumentParams_toVscode = _Extends<
  DidChangeTextDocumentParams,
  VscodeDidChangeTextDocumentParams
>;
type _DidOpenTextDocumentParams_toVscode = _Extends<
  DidOpenTextDocumentParams,
  VscodeDidOpenTextDocumentParams
>;
type _DidCloseTextDocumentParams_toVscode = _Extends<
  DidCloseTextDocumentParams,
  VscodeDidCloseTextDocumentParams
>;
type _DidSaveTextDocumentParams_toVscode = _Extends<
  DidSaveTextDocumentParams,
  VscodeDidSaveTextDocumentParams
>;

// ── Enums: not-too-narrow ────────────────────────────────────────────────────
type _ApplyKind_fromVscode = _Extends<VscodeApplyKind, ApplyKind>;
type _CodeActionKind_fromVscode = _Extends<VscodeCodeActionKind, CodeActionKind>;
type _CodeActionTag_fromVscode = _Extends<VscodeCodeActionTag, CodeActionTag>;
type _CodeActionTriggerKind_fromVscode = _Extends<
  VscodeCodeActionTriggerKind,
  CodeActionTriggerKind
>;
type _CompletionItemKind_fromVscode = _Extends<VscodeCompletionItemKind, CompletionItemKind>;
type _CompletionItemTag_fromVscode = _Extends<VscodeCompletionItemTag, CompletionItemTag>;
type _CompletionTriggerKind_fromVscode = _Extends<
  VscodeCompletionTriggerKind,
  CompletionTriggerKind
>;
type _DiagnosticSeverity_fromVscode = _Extends<VscodeDiagnosticSeverity, DiagnosticSeverity>;
type _DiagnosticTag_fromVscode = _Extends<VscodeDiagnosticTag, DiagnosticTag>;
type _DocumentDiagnosticReportKind_fromVscode = _Extends<
  VscodeDocumentDiagnosticReportKind,
  DocumentDiagnosticReportKind
>;
type _DocumentHighlightKind_fromVscode = _Extends<
  VscodeDocumentHighlightKind,
  DocumentHighlightKind
>;
type _FailureHandlingKind_fromVscode = _Extends<VscodeFailureHandlingKind, FailureHandlingKind>;
type _FileChangeType_fromVscode = _Extends<VscodeFileChangeType, FileChangeType>;
type _FileOperationPatternKind_fromVscode = _Extends<
  VscodeFileOperationPatternKind,
  FileOperationPatternKind
>;
type _FoldingRangeKind_fromVscode = _Extends<VscodeFoldingRangeKind, FoldingRangeKind>;
type _InlayHintKind_fromVscode = _Extends<VscodeInlayHintKind, InlayHintKind>;
type _InlineCompletionTriggerKind_fromVscode = _Extends<
  VscodeInlineCompletionTriggerKind,
  InlineCompletionTriggerKind
>;
type _InsertTextFormat_fromVscode = _Extends<VscodeInsertTextFormat, InsertTextFormat>;
type _InsertTextMode_fromVscode = _Extends<VscodeInsertTextMode, InsertTextMode>;
type _LanguageKind_fromVscode = _Extends<VscodeLanguageKind, LanguageKind>;
type _MarkupKind_fromVscode = _Extends<VscodeMarkupKind, MarkupKind>;
type _MessageType_fromVscode = _Extends<VscodeMessageType, MessageType>;
type _MonikerKind_fromVscode = _Extends<VscodeMonikerKind, MonikerKind>;
type _NotebookCellKind_fromVscode = _Extends<VscodeNotebookCellKind, NotebookCellKind>;
type _PrepareSupportDefaultBehavior_fromVscode = _Extends<
  VscodePrepareSupportDefaultBehavior,
  PrepareSupportDefaultBehavior
>;
type _ResourceOperationKind_fromVscode = _Extends<
  VscodeResourceOperationKind,
  ResourceOperationKind
>;
type _SignatureHelpTriggerKind_fromVscode = _Extends<
  VscodeSignatureHelpTriggerKind,
  SignatureHelpTriggerKind
>;
type _SymbolKind_fromVscode = _Extends<VscodeSymbolKind, SymbolKind>;
type _SymbolTag_fromVscode = _Extends<VscodeSymbolTag, SymbolTag>;
type _TextDocumentSaveReason_fromVscode = _Extends<
  VscodeTextDocumentSaveReason,
  TextDocumentSaveReason
>;
type _TextDocumentSyncKind_fromVscode = _Extends<VscodeTextDocumentSyncKind, TextDocumentSyncKind>;
type _TokenFormat_fromVscode = _Extends<VscodeTokenFormat, TokenFormat>;
type _TraceValue_fromVscode = _Extends<VscodeTraceValue, TraceValue>;
type _UniquenessLevel_fromVscode = _Extends<VscodeUniquenessLevel, UniquenessLevel>;

// ── Enums: not-too-wide ──────────────────────────────────────────────────────
type _ApplyKind_toVscode = _Extends<ApplyKind, VscodeApplyKind>;
type _CodeActionKind_toVscode = _Extends<CodeActionKind, VscodeCodeActionKind>;
type _CodeActionTag_toVscode = _Extends<CodeActionTag, VscodeCodeActionTag>;
type _CodeActionTriggerKind_toVscode = _Extends<CodeActionTriggerKind, VscodeCodeActionTriggerKind>;
type _CompletionItemKind_toVscode = _Extends<CompletionItemKind, VscodeCompletionItemKind>;
type _CompletionItemTag_toVscode = _Extends<CompletionItemTag, VscodeCompletionItemTag>;
type _CompletionTriggerKind_toVscode = _Extends<CompletionTriggerKind, VscodeCompletionTriggerKind>;
type _DiagnosticSeverity_toVscode = _Extends<DiagnosticSeverity, VscodeDiagnosticSeverity>;
type _DiagnosticTag_toVscode = _Extends<DiagnosticTag, VscodeDiagnosticTag>;
type _DocumentDiagnosticReportKind_toVscode = _Extends<
  DocumentDiagnosticReportKind,
  VscodeDocumentDiagnosticReportKind
>;
type _DocumentHighlightKind_toVscode = _Extends<DocumentHighlightKind, VscodeDocumentHighlightKind>;
type _FailureHandlingKind_toVscode = _Extends<FailureHandlingKind, VscodeFailureHandlingKind>;
type _FileChangeType_toVscode = _Extends<FileChangeType, VscodeFileChangeType>;
type _FileOperationPatternKind_toVscode = _Extends<
  FileOperationPatternKind,
  VscodeFileOperationPatternKind
>;
type _FoldingRangeKind_toVscode = _Extends<FoldingRangeKind, VscodeFoldingRangeKind>;
type _InlayHintKind_toVscode = _Extends<InlayHintKind, VscodeInlayHintKind>;
type _InlineCompletionTriggerKind_toVscode = _Extends<
  InlineCompletionTriggerKind,
  VscodeInlineCompletionTriggerKind
>;
type _InsertTextFormat_toVscode = _Extends<InsertTextFormat, VscodeInsertTextFormat>;
type _InsertTextMode_toVscode = _Extends<InsertTextMode, VscodeInsertTextMode>;
type _LanguageKind_toVscode = _Extends<LanguageKind, VscodeLanguageKind>;
type _MarkupKind_toVscode = _Extends<MarkupKind, VscodeMarkupKind>;
type _MessageType_toVscode = _Extends<MessageType, VscodeMessageType>;
type _MonikerKind_toVscode = _Extends<MonikerKind, VscodeMonikerKind>;
type _NotebookCellKind_toVscode = _Extends<NotebookCellKind, VscodeNotebookCellKind>;
type _PrepareSupportDefaultBehavior_toVscode = _Extends<
  PrepareSupportDefaultBehavior,
  VscodePrepareSupportDefaultBehavior
>;
type _ResourceOperationKind_toVscode = _Extends<ResourceOperationKind, VscodeResourceOperationKind>;
type _SignatureHelpTriggerKind_toVscode = _Extends<
  SignatureHelpTriggerKind,
  VscodeSignatureHelpTriggerKind
>;
type _SymbolKind_toVscode = _Extends<SymbolKind, VscodeSymbolKind>;
type _SymbolTag_toVscode = _Extends<SymbolTag, VscodeSymbolTag>;
type _TextDocumentSaveReason_toVscode = _Extends<
  TextDocumentSaveReason,
  VscodeTextDocumentSaveReason
>;
type _TextDocumentSyncKind_toVscode = _Extends<TextDocumentSyncKind, VscodeTextDocumentSyncKind>;
type _TokenFormat_toVscode = _Extends<TokenFormat, VscodeTokenFormat>;
type _TraceValue_toVscode = _Extends<TraceValue, VscodeTraceValue>;
type _UniquenessLevel_toVscode = _Extends<UniquenessLevel, VscodeUniquenessLevel>;

export type {
  // Structs — not-too-narrow
  _ServerCapabilities_fromVscode,
  _ClientCapabilities_fromVscode,
  _InitializeParams_fromVscode,
  _CompletionItem_fromVscode,
  _Diagnostic_fromVscode,
  _TextEdit_fromVscode,
  _Location_fromVscode,
  _Position_fromVscode,
  _Range_fromVscode,
  _Hover_fromVscode,
  _DocumentSymbol_fromVscode,
  _WorkspaceFolder_fromVscode,
  _ProgressToken_fromVscode,
  _WorkDoneProgressBegin_fromVscode,
  _WorkDoneProgressReport_fromVscode,
  _WorkDoneProgressEnd_fromVscode,
  _TextDocumentContentChangeEvent_fromVscode,
  _VersionedTextDocumentIdentifier_fromVscode,
  _DidChangeTextDocumentParams_fromVscode,
  _DidOpenTextDocumentParams_fromVscode,
  _DidCloseTextDocumentParams_fromVscode,
  _DidSaveTextDocumentParams_fromVscode,
  // Structs — not-too-wide
  _ServerCapabilities_toVscode,
  _ClientCapabilities_toVscode,
  _InitializeParams_toVscode,
  _CompletionItem_toVscode,
  _Diagnostic_toVscode,
  _TextEdit_toVscode,
  _Location_toVscode,
  _Position_toVscode,
  _Range_toVscode,
  _Hover_toVscode,
  _DocumentSymbol_toVscode,
  _WorkspaceFolder_toVscode,
  _ProgressToken_toVscode,
  _WorkDoneProgressBegin_toVscode,
  _WorkDoneProgressReport_toVscode,
  _WorkDoneProgressEnd_toVscode,
  _TextDocumentContentChangeEvent_toVscode,
  _VersionedTextDocumentIdentifier_toVscode,
  _DidChangeTextDocumentParams_toVscode,
  _DidOpenTextDocumentParams_toVscode,
  _DidCloseTextDocumentParams_toVscode,
  _DidSaveTextDocumentParams_toVscode,
  // Enums — not-too-narrow
  _ApplyKind_fromVscode,
  _CodeActionKind_fromVscode,
  _CodeActionTag_fromVscode,
  _CodeActionTriggerKind_fromVscode,
  _CompletionItemKind_fromVscode,
  _CompletionItemTag_fromVscode,
  _CompletionTriggerKind_fromVscode,
  _DiagnosticSeverity_fromVscode,
  _DiagnosticTag_fromVscode,
  _DocumentDiagnosticReportKind_fromVscode,
  _DocumentHighlightKind_fromVscode,
  _FailureHandlingKind_fromVscode,
  _FileChangeType_fromVscode,
  _FileOperationPatternKind_fromVscode,
  _FoldingRangeKind_fromVscode,
  _InlayHintKind_fromVscode,
  _InlineCompletionTriggerKind_fromVscode,
  _InsertTextFormat_fromVscode,
  _InsertTextMode_fromVscode,
  _LanguageKind_fromVscode,
  _MarkupKind_fromVscode,
  _MessageType_fromVscode,
  _MonikerKind_fromVscode,
  _NotebookCellKind_fromVscode,
  _PrepareSupportDefaultBehavior_fromVscode,
  _ResourceOperationKind_fromVscode,
  _SignatureHelpTriggerKind_fromVscode,
  _SymbolKind_fromVscode,
  _SymbolTag_fromVscode,
  _TextDocumentSaveReason_fromVscode,
  _TextDocumentSyncKind_fromVscode,
  _TokenFormat_fromVscode,
  _TraceValue_fromVscode,
  _UniquenessLevel_fromVscode,
  // Enums — not-too-wide
  _ApplyKind_toVscode,
  _CodeActionKind_toVscode,
  _CodeActionTag_toVscode,
  _CodeActionTriggerKind_toVscode,
  _CompletionItemKind_toVscode,
  _CompletionItemTag_toVscode,
  _CompletionTriggerKind_toVscode,
  _DiagnosticSeverity_toVscode,
  _DiagnosticTag_toVscode,
  _DocumentDiagnosticReportKind_toVscode,
  _DocumentHighlightKind_toVscode,
  _FailureHandlingKind_toVscode,
  _FileChangeType_toVscode,
  _FileOperationPatternKind_toVscode,
  _FoldingRangeKind_toVscode,
  _InlayHintKind_toVscode,
  _InlineCompletionTriggerKind_toVscode,
  _InsertTextFormat_toVscode,
  _InsertTextMode_toVscode,
  _LanguageKind_toVscode,
  _MarkupKind_toVscode,
  _MessageType_toVscode,
  _MonikerKind_toVscode,
  _NotebookCellKind_toVscode,
  _PrepareSupportDefaultBehavior_toVscode,
  _ResourceOperationKind_toVscode,
  _SignatureHelpTriggerKind_toVscode,
  _SymbolKind_toVscode,
  _SymbolTag_toVscode,
  _TextDocumentSaveReason_toVscode,
  _TextDocumentSyncKind_toVscode,
  _TokenFormat_toVscode,
  _TraceValue_toVscode,
  _UniquenessLevel_toVscode
};
