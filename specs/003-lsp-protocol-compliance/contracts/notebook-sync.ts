/**
 * Notebook document sync contracts.
 */

export interface NotebookDocumentNamespace {
  didOpen(params: unknown): Promise<void>;
  didChange(params: unknown): Promise<void>;
  didSave(params: unknown): Promise<void>;
  didClose(params: unknown): Promise<void>;
}

export interface NotebookServerHandlers {
  onDidOpen(handler: (params: unknown) => void): { dispose(): void };
  onDidChange(handler: (params: unknown) => void): { dispose(): void };
  onDidSave(handler: (params: unknown) => void): { dispose(): void };
  onDidClose(handler: (params: unknown) => void): { dispose(): void };
}

export interface NotebookCapabilityDeclaration {
  notebookDocumentSync: unknown;
}
