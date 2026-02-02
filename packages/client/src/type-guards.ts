/**
 * Type guards for capability-aware client usage
 *
 * Re-exports capability checking functions from @lspeasy/core, providing both
 * runtime checking and compile-time type safety for LSP operations.
 *
 * For detailed capability type utilities, see @lspeasy/core/protocol/capabilities
 */

import type { LSPClient } from './client.js';
import type { ServerCapabilities, ClientSendMethods } from '@lspeasy/core';
import { hasCapability as coreHasCapability } from '@lspeasy/core';

// Re-export core capability functions for convenience
export {
  supportsMethod,
  supportsHover,
  supportsCompletion,
  supportsDefinition,
  supportsReferences,
  supportsDocumentSymbol,
  supportsWorkspaceFolders,
  supportsFileWatching,
  supportsWorkDoneProgress
} from '@lspeasy/core';

/**
 * Check if client has a specific server capability
 *
 * Narrows the LSPClient type to include the methods available with that capability.
 *
 * @example
 * if (hasServerCapability(client, 'hoverProvider')) {
 *   // TypeScript narrows type and knows hover method exists
 *   // client now has ClientSendMethods<{ hoverProvider: true }> shape
 *   const result = await client.textDocument.hover(params);
 * }
 */
export function hasServerCapability<K extends keyof ServerCapabilities>(
  client: LSPClient,
  capability: K
): client is LSPClient &
  ClientSendMethods<Pick<ServerCapabilities, K>> & {
    serverCapabilities: Required<Pick<ServerCapabilities, K>>;
  } {
  const caps = client.serverCapabilities;
  if (!caps) return false;
  return coreHasCapability(caps, capability);
}

/**
 * Backward-compatible helpers for checking client capabilities
 * These delegate to the client-specific logic or core functions
 */

/**
 * Type guard to check if client has hover capability
 *
 * @deprecated Use supportsHover() from @lspeasy/core instead
 */
export function hasHoverCapability(client: LSPClient): client is LSPClient & {
  textDocument: ClientSendMethods<{ hoverProvider: true }>['textDocument'];
} {
  return 'hover' in client.textDocument && typeof client.textDocument.hover === 'function';
}

/**
 * Type guard to check if client has completion capability
 *
 * @deprecated Use supportsCompletion() from @lspeasy/core instead
 */
export function hasCompletionCapability(client: LSPClient): client is LSPClient & {
  textDocument: ClientSendMethods<{ completionProvider: {} }>['textDocument'];
} {
  return (
    'completion' in client.textDocument && typeof client.textDocument.completion === 'function'
  );
}

/**
 * Type guard to check if client has definition capability
 *
 * @deprecated Use supportsDefinition() from @lspeasy/core instead
 */
export function hasDefinitionCapability(client: LSPClient): client is LSPClient & {
  textDocument: ClientSendMethods<{ definitionProvider: true }>['textDocument'];
} {
  return (
    client.serverCapabilities?.definitionProvider === true &&
    'definition' in client.textDocument &&
    typeof client.textDocument.definition === 'function'
  );
}

/**
 * Type guard to check if client has references capability
 *
 * @deprecated Use supportsReferences() from @lspeasy/core instead
 */
export function hasReferencesCapability(client: LSPClient): client is LSPClient & {
  textDocument: ClientSendMethods<{ referencesProvider: true }>['textDocument'];
} {
  return (
    'references' in client.textDocument && typeof client.textDocument.references === 'function'
  );
}

/**
 * Type guard to check if client has document highlight capability
 *
 * @deprecated Use hasCapability() with 'documentHighlightProvider' from @lspeasy/core instead
 */
export function hasDocumentHighlightCapability(client: LSPClient): client is LSPClient & {
  textDocument: ClientSendMethods<{ documentHighlightProvider: true }>['textDocument'];
} {
  return (
    'documentHighlight' in client.textDocument &&
    typeof client.textDocument.documentHighlight === 'function'
  );
}

/**
 * Type guard to check if client has document symbol capability
 *
 * @deprecated Use supportsDocumentSymbol() from @lspeasy/core instead
 */
export function hasDocumentSymbolCapability(client: LSPClient): client is LSPClient & {
  textDocument: ClientSendMethods<{ documentSymbolProvider: true }>['textDocument'];
} {
  return (
    'documentSymbol' in client.textDocument &&
    typeof client.textDocument.documentSymbol === 'function'
  );
}

/**
 * Type guard to check if client has code action capability
 *
 * @deprecated Use hasCapability() with 'codeActionProvider' from @lspeasy/core instead
 */
export function hasCodeActionCapability(client: LSPClient): client is LSPClient & {
  textDocument: ClientSendMethods<{ codeActionProvider: true }>['textDocument'];
} {
  return (
    'codeAction' in client.textDocument && typeof client.textDocument.codeAction === 'function'
  );
}

/**
 * Type guard to check if client has workspace symbol capability
 *
 * @deprecated Use hasCapability() with 'workspaceSymbolProvider' from @lspeasy/core instead
 */
export function hasWorkspaceSymbolCapability(client: LSPClient): client is LSPClient & {
  workspace: ClientSendMethods<{ workspaceSymbolProvider: true }>['workspace'];
} {
  return 'symbol' in client.workspace && typeof client.workspace.symbol === 'function';
}

/**
 * Generic type guard for checking method availability
 *
 * @example
 * if (hasMethod(client.textDocument, 'hover')) {
 *   // TypeScript knows hover method exists
 *   await client.textDocument.hover(params);
 * }
 */
export function hasMethod<T extends object, K extends string>(
  obj: T,
  method: K
): obj is T & Record<K, Function> {
  return method in obj && typeof (obj as any)[method] === 'function';
}
