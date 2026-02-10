export type * from 'vscode-languageserver-protocol';
export {
  CodeActionKind,
  CompletionItemKind,
  CompletionItemTag,
  DiagnosticSeverity,
  DiagnosticTag,
  DocumentHighlightKind,
  FileChangeType,
  FoldingRangeKind,
  InsertTextFormat,
  MessageType,
  SymbolKind,
  SymbolTag,
  TextDocumentSaveReason,
  TextDocumentSyncKind,
  TokenFormat
} from 'vscode-languageserver-protocol';
export type TextDocumentContentParams = unknown;
export type TextDocumentContent = unknown;

export type TextDocumentContentResult = unknown;

export type TextDocumentContentRegistrationOptions = unknown;

export type TextDocumentContentRefreshParams = unknown;

export type CancelParams = { id: number | string };

export type ProgressParams = {
  token: string | number;
};
