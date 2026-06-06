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

// Every VSCode-typed value must be assignable to our type.
// Fails to compile if our type is narrower than vscode's (i.e. we'd reject valid LSP data).
type AssertExtends<A extends B, B> = [A, B];

type _ServerCaps = AssertExtends<VscodeServerCapabilities, ServerCapabilities>;
type _ClientCaps = AssertExtends<VscodeClientCapabilities, ClientCapabilities>;
type _InitParams = AssertExtends<VscodeInitializeParams, InitializeParams>;
type _CompletionItem = AssertExtends<VscodeCompletionItem, CompletionItem>;
type _Diagnostic = AssertExtends<VscodeDiagnostic, Diagnostic>;
type _TextEdit = AssertExtends<VscodeTextEdit, TextEdit>;
type _Location = AssertExtends<VscodeLocation, Location>;
type _Position = AssertExtends<VscodePosition, Position>;
type _Range = AssertExtends<VscodeRange, Range>;
type _Hover = AssertExtends<VscodeHover, Hover>;
type _DocumentSymbol = AssertExtends<VscodeDocumentSymbol, DocumentSymbol>;
type _WorkspaceFolder = AssertExtends<VscodeWorkspaceFolder, WorkspaceFolder>;
type _ProgressToken = AssertExtends<VscodeProgressToken, ProgressToken>;
type _ProgressBegin = AssertExtends<VscodeWorkDoneProgressBegin, WorkDoneProgressBegin>;
type _ProgressReport = AssertExtends<VscodeWorkDoneProgressReport, WorkDoneProgressReport>;
type _ProgressEnd = AssertExtends<VscodeWorkDoneProgressEnd, WorkDoneProgressEnd>;
type _ContentChange = AssertExtends<
  VscodeTextDocumentContentChangeEvent,
  TextDocumentContentChangeEvent
>;
type _VersionedId = AssertExtends<
  VscodeVersionedTextDocumentIdentifier,
  VersionedTextDocumentIdentifier
>;
type _DidChange = AssertExtends<VscodeDidChangeTextDocumentParams, DidChangeTextDocumentParams>;
type _DidOpen = AssertExtends<VscodeDidOpenTextDocumentParams, DidOpenTextDocumentParams>;
type _DidClose = AssertExtends<VscodeDidCloseTextDocumentParams, DidCloseTextDocumentParams>;
type _DidSave = AssertExtends<VscodeDidSaveTextDocumentParams, DidSaveTextDocumentParams>;

export type {
  _ServerCaps,
  _ClientCaps,
  _InitParams,
  _CompletionItem,
  _Diagnostic,
  _TextEdit,
  _Location,
  _Position,
  _Range,
  _Hover,
  _DocumentSymbol,
  _WorkspaceFolder,
  _ProgressToken,
  _ProgressBegin,
  _ProgressReport,
  _ProgressEnd,
  _ContentChange,
  _VersionedId,
  _DidChange,
  _DidOpen,
  _DidClose,
  _DidSave
};
