export type * from 'vscode-languageserver-protocol';

export type TextDocumentContentParams = any;
export type TextDocumentContent = any;

export type TextDocumentContentResult = any;

export type TextDocumentContentRegistrationOptions = any;

export type TextDocumentContentRefreshParams = any;

export type CancelParams = { id: number | string };

export type ProgressParams = {
  token: string | number;
};
