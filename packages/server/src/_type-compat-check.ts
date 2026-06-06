/**
 * Type-compatibility verification between @lspeasy/core and vscode-languageserver-protocol.
 *
 * Every type in COMPAT_CHECK_TYPES is checked bidirectionally against its VSCode counterpart:
 *   _fromVscode  — every VSCode value is accepted by our type  (not too narrow)
 *   _toVscode    — our value is accepted by VSCode's type       (not too wide)
 *
 * _toVscode uses Flexible<VscodeType> to relax string/number enum types to their backing
 * primitive. TypeScript string enums are nominal, so our generated literal unions
 * (e.g. "plaintext" | "markdown") are not directly assignable to `MarkupKind`. Flexible<>
 * widens those to `string`, which our unions satisfy. _fromVscode still verifies the values
 * are exactly right in the inbound direction, so bidirectional coverage is intact.
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

// Structural assertion helper.
type _Extends<Sub extends Sup, Sup> = void;

// Recursively replace string/number-backed types (including enums) with their primitive.
// This allows nominal TypeScript enum types on the VSCode side to be satisfied
// by our generated literal unions in the _toVscode direction.
type Flexible<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends null
        ? null
        : T extends undefined
          ? undefined
          : T extends readonly (infer U)[]
            ? Flexible<U>[]
            : T extends object
              ? { [K in keyof T]: Flexible<T[K]> }
              : T;

// ── Not-too-narrow: every VSCode value must be accepted by our type ──────────
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

// ── Not-too-wide: our value must be accepted by VSCode's type ────────────────
// (Flexible<> relaxes nominal enum types — see header comment)
type _ServerCapabilities_toVscode = _Extends<
  ServerCapabilities,
  Flexible<VscodeServerCapabilities>
>;
type _ClientCapabilities_toVscode = _Extends<
  ClientCapabilities,
  Flexible<VscodeClientCapabilities>
>;
type _InitializeParams_toVscode = _Extends<InitializeParams, Flexible<VscodeInitializeParams>>;
type _CompletionItem_toVscode = _Extends<CompletionItem, Flexible<VscodeCompletionItem>>;
type _Diagnostic_toVscode = _Extends<Diagnostic, Flexible<VscodeDiagnostic>>;
type _TextEdit_toVscode = _Extends<TextEdit, Flexible<VscodeTextEdit>>;
type _Location_toVscode = _Extends<Location, Flexible<VscodeLocation>>;
type _Position_toVscode = _Extends<Position, Flexible<VscodePosition>>;
type _Range_toVscode = _Extends<Range, Flexible<VscodeRange>>;
type _Hover_toVscode = _Extends<Hover, Flexible<VscodeHover>>;
type _DocumentSymbol_toVscode = _Extends<DocumentSymbol, Flexible<VscodeDocumentSymbol>>;
type _WorkspaceFolder_toVscode = _Extends<WorkspaceFolder, Flexible<VscodeWorkspaceFolder>>;
type _ProgressToken_toVscode = _Extends<ProgressToken, Flexible<VscodeProgressToken>>;
type _WorkDoneProgressBegin_toVscode = _Extends<
  WorkDoneProgressBegin,
  Flexible<VscodeWorkDoneProgressBegin>
>;
type _WorkDoneProgressReport_toVscode = _Extends<
  WorkDoneProgressReport,
  Flexible<VscodeWorkDoneProgressReport>
>;
type _WorkDoneProgressEnd_toVscode = _Extends<
  WorkDoneProgressEnd,
  Flexible<VscodeWorkDoneProgressEnd>
>;
type _TextDocumentContentChangeEvent_toVscode = _Extends<
  TextDocumentContentChangeEvent,
  Flexible<VscodeTextDocumentContentChangeEvent>
>;
type _VersionedTextDocumentIdentifier_toVscode = _Extends<
  VersionedTextDocumentIdentifier,
  Flexible<VscodeVersionedTextDocumentIdentifier>
>;
type _DidChangeTextDocumentParams_toVscode = _Extends<
  DidChangeTextDocumentParams,
  Flexible<VscodeDidChangeTextDocumentParams>
>;
type _DidOpenTextDocumentParams_toVscode = _Extends<
  DidOpenTextDocumentParams,
  Flexible<VscodeDidOpenTextDocumentParams>
>;
type _DidCloseTextDocumentParams_toVscode = _Extends<
  DidCloseTextDocumentParams,
  Flexible<VscodeDidCloseTextDocumentParams>
>;
type _DidSaveTextDocumentParams_toVscode = _Extends<
  DidSaveTextDocumentParams,
  Flexible<VscodeDidSaveTextDocumentParams>
>;

export type {
  // Not-too-narrow
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
  // Not-too-wide
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
  _DidSaveTextDocumentParams_toVscode
};
