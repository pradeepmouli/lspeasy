/**
 * Capability-aware proxy for client methods
 *
 * Dynamically exposes/hides methods based on server capabilities
 */

import type { ServerCapabilities, LSPRequest } from '@lspeasy/core';
import type { LSPClient } from './client.js';

/**
 * Check if a server capability is enabled
 */
function isCapabilityEnabled(
  capabilities: Partial<ServerCapabilities> | undefined,
  capabilityKey: string
): boolean {
  if (!capabilities) return false;

  const value = (capabilities as any)[capabilityKey];
  return value !== undefined && value !== false && value !== null;
}

/**
 * Creates a namespace proxy that checks capabilities before allowing method calls
 */
function createNamespaceProxy<T extends object>(
  client: LSPClient,
  namespace: keyof typeof LSPRequest,
  methods: Record<string, { method: string; serverCapability: string | null }>
): T {
  return new Proxy({} as T, {
    get(_target, prop: string) {
      const methodInfo = methods[prop];
      if (!methodInfo) {
        return undefined;
      }

      const serverCaps = (client as any).serverCapabilities as ServerCapabilities | undefined;

      // If serverCapability is null, method is always available (e.g., notifications)
      const isAvailable =
        methodInfo.serverCapability === null ||
        isCapabilityEnabled(serverCaps, methodInfo.serverCapability);

      if (!isAvailable) {
        // Return undefined for disabled capabilities (method doesn't exist)
        return undefined;
      }

      // Determine if this is a notification (sendNotification) or request (sendRequest)
      const isNotification =
        methodInfo.method.startsWith('textDocument/did') ||
        methodInfo.method.startsWith('workspace/did');

      // Return bound method that calls sendRequest or sendNotification
      return async (params: any) => {
        if (isNotification) {
          return (client as any).sendNotification(methodInfo.method, params);
        } else {
          return (client as any).sendRequest(methodInfo.method, params);
        }
      };
    },

    has(_target, prop: string) {
      const methodInfo = methods[prop];
      if (!methodInfo) return false;

      // If serverCapability is null, method is always available
      if (methodInfo.serverCapability === null) return true;

      const serverCaps = (client as any).serverCapabilities as ServerCapabilities | undefined;
      return isCapabilityEnabled(serverCaps, methodInfo.serverCapability);
    },

    ownKeys(_target) {
      const serverCaps = (client as any).serverCapabilities as ServerCapabilities | undefined;
      if (!serverCaps) return [];
      return Object.keys(methods).filter((key) => {
        const methodInfo = methods[key]!;
        // Always include methods with null serverCapability
        return (
          methodInfo.serverCapability === null ||
          isCapabilityEnabled(serverCaps, methodInfo.serverCapability)
        );
      });
    },

    getOwnPropertyDescriptor(_target, prop: string) {
      const methodInfo = methods[prop];
      if (!methodInfo) return undefined;

      // If serverCapability is null, always return descriptor
      if (methodInfo.serverCapability === null) {
        return {
          enumerable: true,
          configurable: true,
          writable: false
        };
      }

      const serverCaps = (client as any).serverCapabilities as ServerCapabilities | undefined;
      if (!isCapabilityEnabled(serverCaps, methodInfo.serverCapability)) {
        return undefined;
      }

      return {
        enumerable: true,
        configurable: true,
        writable: false
      };
    }
  });
}

/**
 * Create capability-aware textDocument methods
 */
export function createTextDocumentProxy(client: LSPClient): any {
  const methods = {
    hover: { method: 'textDocument/hover', serverCapability: 'hoverProvider' },
    completion: { method: 'textDocument/completion', serverCapability: 'completionProvider' },
    definition: { method: 'textDocument/definition', serverCapability: 'definitionProvider' },
    references: { method: 'textDocument/references', serverCapability: 'referencesProvider' },
    documentHighlight: {
      method: 'textDocument/documentHighlight',
      serverCapability: 'documentHighlightProvider'
    },
    documentSymbol: {
      method: 'textDocument/documentSymbol',
      serverCapability: 'documentSymbolProvider'
    },
    codeAction: { method: 'textDocument/codeAction', serverCapability: 'codeActionProvider' },
    codeLens: { method: 'textDocument/codeLens', serverCapability: 'codeLensProvider' },
    documentLink: { method: 'textDocument/documentLink', serverCapability: 'documentLinkProvider' },
    formatting: {
      method: 'textDocument/formatting',
      serverCapability: 'documentFormattingProvider'
    },
    rangeFormatting: {
      method: 'textDocument/rangeFormatting',
      serverCapability: 'documentRangeFormattingProvider'
    },
    onTypeFormatting: {
      method: 'textDocument/onTypeFormatting',
      serverCapability: 'documentOnTypeFormattingProvider'
    },
    rename: { method: 'textDocument/rename', serverCapability: 'renameProvider' },
    prepareRename: { method: 'textDocument/prepareRename', serverCapability: 'renameProvider' },
    signatureHelp: {
      method: 'textDocument/signatureHelp',
      serverCapability: 'signatureHelpProvider'
    },
    declaration: { method: 'textDocument/declaration', serverCapability: 'declarationProvider' },
    typeDefinition: {
      method: 'textDocument/typeDefinition',
      serverCapability: 'typeDefinitionProvider'
    },
    implementation: {
      method: 'textDocument/implementation',
      serverCapability: 'implementationProvider'
    },
    foldingRange: { method: 'textDocument/foldingRange', serverCapability: 'foldingRangeProvider' },
    selectionRange: {
      method: 'textDocument/selectionRange',
      serverCapability: 'selectionRangeProvider'
    },
    semanticTokensFull: {
      method: 'textDocument/semanticTokens/full',
      serverCapability: 'semanticTokensProvider'
    },
    semanticTokensRange: {
      method: 'textDocument/semanticTokens/range',
      serverCapability: 'semanticTokensProvider'
    },
    linkedEditingRange: {
      method: 'textDocument/linkedEditingRange',
      serverCapability: 'linkedEditingRangeProvider'
    },
    moniker: { method: 'textDocument/moniker', serverCapability: 'monikerProvider' },
    inlayHint: { method: 'textDocument/inlayHint', serverCapability: 'inlayHintProvider' },
    inlineValue: { method: 'textDocument/inlineValue', serverCapability: 'inlineValueProvider' },
    documentColor: { method: 'textDocument/documentColor', serverCapability: 'colorProvider' },
    colorPresentation: {
      method: 'textDocument/colorPresentation',
      serverCapability: 'colorProvider'
    },
    prepareCallHierarchy: {
      method: 'textDocument/prepareCallHierarchy',
      serverCapability: 'callHierarchyProvider'
    },
    prepareTypeHierarchy: {
      method: 'textDocument/prepareTypeHierarchy',
      serverCapability: 'typeHierarchyProvider'
    },
    // Notification methods - always available regardless of capabilities
    didOpen: { method: 'textDocument/didOpen', serverCapability: null },
    didChange: { method: 'textDocument/didChange', serverCapability: null },
    didClose: { method: 'textDocument/didClose', serverCapability: null },
    didSave: { method: 'textDocument/didSave', serverCapability: null }
  };

  return createNamespaceProxy(client, 'TextDocument', methods);
}

/**
 * Create capability-aware workspace methods
 */
export function createWorkspaceProxy(client: LSPClient): any {
  const methods = {
    symbol: { method: 'workspace/symbol', serverCapability: 'workspaceSymbolProvider' },
    executeCommand: {
      method: 'workspace/executeCommand',
      serverCapability: 'executeCommandProvider'
    },
    willCreateFiles: { method: 'workspace/willCreateFiles', serverCapability: 'workspace' },
    willRenameFiles: { method: 'workspace/willRenameFiles', serverCapability: 'workspace' },
    willDeleteFiles: { method: 'workspace/willDeleteFiles', serverCapability: 'workspace' },
    // Notification methods - always available regardless of capabilities
    didChangeWorkspaceFolders: {
      method: 'workspace/didChangeWorkspaceFolders',
      serverCapability: null
    },
    didChangeConfiguration: {
      method: 'workspace/didChangeConfiguration',
      serverCapability: null
    },
    didChangeWatchedFiles: {
      method: 'workspace/didChangeWatchedFiles',
      serverCapability: null
    }
  };

  return createNamespaceProxy(client, 'Workspace', methods);
}
