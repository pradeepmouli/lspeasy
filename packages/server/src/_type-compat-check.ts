/**
 * Temporary type-compatibility verification file — delete after running type-check.
 *
 * Verifies that Zod-inferred @lspeasy/core types are structurally compatible with
 * vscode-languageserver-protocol types: every valid VSCode-protocol value must be
 * assignable to our generated type. If any of these type aliases fail to compile,
 * the corresponding type has regressed.
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
  DidSaveTextDocumentParams as VscodeDidSaveTextDocumentParams
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
  DidSaveTextDocumentParams
} from '@lspeasy/core';

// Structural type equality: A must extend B (not too narrow) and B must extend A (not too wide).
// Two separate aliases per type pair keep error messages precise and actionable.
type _Extends<Sub extends Sup, Sup> = void;

// Bidirectionality note:
// "_fromVscode" checks our type isn't too narrow  (VSCode value must be usable as ours).
// "_toVscode"   checks our type isn't too wide    (our value must be usable as VSCode's).
//
// EOPT limitation: vscode-languageserver-protocol is compiled with exactOptionalPropertyTypes:true,
// so its optional properties have type `T` (not `T | undefined`) in the value position. Zod's
// .optional() always produces `T | undefined` regardless of EOPT. For any type with optional
// properties the _toVscode check produces false positives — those checks are omitted below and
// only the _fromVscode (not-too-narrow) direction is asserted.
//
// Simple types whose properties are all required can be checked in both directions.

// ── Not-too-narrow: every VSCode value must be accepted by our type ────────────────────────────
type _ServerCaps_fromVscode = _Extends<VscodeServerCapabilities, ServerCapabilities>;
type _ClientCaps_fromVscode = _Extends<VscodeClientCapabilities, ClientCapabilities>;
type _InitParams_fromVscode = _Extends<VscodeInitializeParams, InitializeParams>;
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
type _ProgressBegin_fromVscode = _Extends<VscodeWorkDoneProgressBegin, WorkDoneProgressBegin>;
type _ProgressReport_fromVscode = _Extends<VscodeWorkDoneProgressReport, WorkDoneProgressReport>;
type _ProgressEnd_fromVscode = _Extends<VscodeWorkDoneProgressEnd, WorkDoneProgressEnd>;
type _ContentChange_fromVscode = _Extends<
  VscodeTextDocumentContentChangeEvent,
  TextDocumentContentChangeEvent
>;
type _VersionedId_fromVscode = _Extends<
  VscodeVersionedTextDocumentIdentifier,
  VersionedTextDocumentIdentifier
>;
type _DidChange_fromVscode = _Extends<
  VscodeDidChangeTextDocumentParams,
  DidChangeTextDocumentParams
>;
type _DidOpen_fromVscode = _Extends<VscodeDidOpenTextDocumentParams, DidOpenTextDocumentParams>;
type _DidClose_fromVscode = _Extends<VscodeDidCloseTextDocumentParams, DidCloseTextDocumentParams>;
type _DidSave_fromVscode = _Extends<VscodeDidSaveTextDocumentParams, DidSaveTextDocumentParams>;

// ── Not-too-wide: our value must be usable as VSCode's (only for all-required-property types) ──
type _TextEdit_toVscode = _Extends<TextEdit, VscodeTextEdit>;
type _Location_toVscode = _Extends<Location, VscodeLocation>;
type _Position_toVscode = _Extends<Position, VscodePosition>;
type _Range_toVscode = _Extends<Range, VscodeRange>;
type _WorkspaceFolder_toVscode = _Extends<WorkspaceFolder, VscodeWorkspaceFolder>;
type _ProgressToken_toVscode = _Extends<ProgressToken, VscodeProgressToken>;
type _ContentChange_toVscode = _Extends<
  TextDocumentContentChangeEvent,
  VscodeTextDocumentContentChangeEvent
>;
type _VersionedId_toVscode = _Extends<
  VersionedTextDocumentIdentifier,
  VscodeVersionedTextDocumentIdentifier
>;
type _DidChange_toVscode = _Extends<DidChangeTextDocumentParams, VscodeDidChangeTextDocumentParams>;
type _DidOpen_toVscode = _Extends<DidOpenTextDocumentParams, VscodeDidOpenTextDocumentParams>;
type _DidClose_toVscode = _Extends<DidCloseTextDocumentParams, VscodeDidCloseTextDocumentParams>;

export type {
  // Not-too-narrow (all types)
  _ServerCaps_fromVscode,
  _ClientCaps_fromVscode,
  _InitParams_fromVscode,
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
  _ProgressBegin_fromVscode,
  _ProgressReport_fromVscode,
  _ProgressEnd_fromVscode,
  _ContentChange_fromVscode,
  _VersionedId_fromVscode,
  _DidChange_fromVscode,
  _DidOpen_fromVscode,
  _DidClose_fromVscode,
  _DidSave_fromVscode,
  // Not-too-wide (only all-required-property types — see EOPT note above)
  _TextEdit_toVscode,
  _Location_toVscode,
  _Position_toVscode,
  _Range_toVscode,
  _WorkspaceFolder_toVscode,
  _ProgressToken_toVscode,
  _ContentChange_toVscode,
  _VersionedId_toVscode,
  _DidChange_toVscode,
  _DidOpen_toVscode,
  _DidClose_toVscode
};
