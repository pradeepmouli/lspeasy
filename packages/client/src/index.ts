/**
 * @lspeasy/client - LSP Client for connecting to language servers
 */

export { LSPClient } from './client.js';
export type { ClientOptions, InitializeResult, CancellableRequest } from './types.js';
export {
  hasServerCapability,
  hasHoverCapability,
  hasCompletionCapability,
  hasDefinitionCapability,
  hasReferencesCapability,
  hasDocumentHighlightCapability,
  hasDocumentSymbolCapability,
  hasCodeActionCapability,
  hasWorkspaceSymbolCapability,
  hasMethod,
  supportsMethod
} from './type-guards.js';

// Re-export commonly used types from core
export type { Transport, Logger, LogLevel, Disposable } from '@lspeasy/core';
