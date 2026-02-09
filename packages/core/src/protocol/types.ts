// Re-export all types and runtime values (enums, constants) from vscode-languageserver-protocol
export * from 'vscode-languageserver-protocol';

export type TextDocumentContentParams = unknown;
export type TextDocumentContent = unknown;

export type TextDocumentContentResult = unknown;

export type TextDocumentContentRegistrationOptions = unknown;

export type TextDocumentContentRefreshParams = unknown;

export type CancelParams = { id: number | string };

export type ProgressParams = {
  token: string | number;
};
