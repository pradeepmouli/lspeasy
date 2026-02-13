/**
 * Capability-aware type utilities for LSP protocol
 *
 * @module protocol/capabilities
 */

import type { ServerCapabilities, ClientCapabilities } from 'vscode-languageserver-protocol';
import type { Paths, PickDeep } from 'type-fest';
import {
  getClientCapabilityForNotificationMethod,
  getClientCapabilityForRequestMethod,
  getCapabilityForNotificationMethod,
  getCapabilityForRequestMethod,
  type LSPNotificationMethod,
  type LSPRequestMethod,
  type ClientCapabilityForNotification,
  type ClientCapabilityForRequest,
  type ServerCapabilityForNotification,
  type ServerCapabilityForRequest
} from './infer.js';

// Re-export capability types
export type { ServerCapabilities, ClientCapabilities };

/**
 * Extract all request definition types from the namespace structure
 */

/**
 * Filter request definitions that have a ServerCapability field
 */

/**
 * Map a method to its server capability provider key
 */

/**
 * Check if a capability value indicates the feature is enabled
 */

/**
 * Extract supported request methods based on server capabilities
 *
 * This type automatically traverses the LSP namespace structure to determine
 * which methods are available based on the provided server capabilities.
 */

function getProperty<T, K extends Paths<T> & string>(obj: T, key: K): any {
  const keys = key.split('.') as Array<keyof T>;
  let result: any = obj;
  for (const k of keys) {
    if (result == null) {
      return undefined;
    }
    result = result[k];
  }
  return result;
}
/**
 * Map of LSP methods to their corresponding server capability keys
 * This is derived from the namespace structure
 */

/**
 * Get the capability key for a given method at runtime
 */

/**
 * Check if a method is supported by the given server capabilities
 */
export function serverSupportsRequest<M extends LSPRequestMethod<'clientToServer'>>(
  method: M,
  capabilities: ServerCapabilities
): capabilities is ServerCapabilities &
  PickDeep<ServerCapabilities, ServerCapabilityForRequest<M>> {
  const capabilityKey = getCapabilityForRequestMethod(method);
  if (capabilityKey === 'alwaysOn' || capabilityKey === null) {
    return true;
  }
  const value = getProperty(capabilities, capabilityKey);
  return value !== null && value !== undefined && value !== false;
}

export function serverSupportsNotification<
  M extends LSPNotificationMethod<'clientToServer'>,
  T extends Partial<ServerCapabilities>
>(
  method: M,
  capabilities: T
): capabilities is T & PickDeep<ServerCapabilities, ServerCapabilityForNotification<M>> {
  const capabilityKey = getCapabilityForNotificationMethod(method);
  if (capabilityKey === 'alwaysOn' || capabilityKey === null) {
    return true;
  }
  const value = getProperty(capabilities, capabilityKey as any);
  return value !== null && value !== undefined && value !== false;
}

/**
 * Check if a method is supported by the given client capabilities
 */
export function clientSupportsRequest<
  M extends LSPRequestMethod<'serverToClient'>,
  T extends Partial<ClientCapabilities>
>(
  method: M,
  capabilities: T
): capabilities is T & PickDeep<ClientCapabilities, ClientCapabilityForRequest<M>> {
  const capabilityKey = getClientCapabilityForRequestMethod(method);
  if (capabilityKey === 'alwaysOn' || capabilityKey === null) {
    return true;
  }
  const value = getProperty(capabilities, capabilityKey as any);
  return value !== null && value !== undefined && value !== false;
}

export function clientSupportsNotification<
  M extends LSPNotificationMethod<'serverToClient'>,
  T extends Partial<ClientCapabilities>
>(
  method: M,
  capabilities: T
): capabilities is T & PickDeep<ClientCapabilities, ClientCapabilityForNotification<M>> {
  const capabilityKey = getClientCapabilityForNotificationMethod(method);
  if (capabilityKey === 'alwaysOn' || capabilityKey === null) {
    return true;
  }
  const value = getProperty(capabilities, capabilityKey as any);
  return value !== null && value !== undefined && value !== false;
}

/**
 * Check if a server capability is enabled
 */
export function hasServerCapability<
  K extends Paths<ServerCapabilities>,
  T extends Partial<ServerCapabilities>
>(capabilities: T, capability: K): capabilities is T & PickDeep<ServerCapabilities, K> {
  const value = getProperty(capabilities, capability as any);
  return value !== null && value !== undefined && value !== false;
}

/**
 * Check if a client capability is enabled
 */
export function hasClientCapability<
  K extends Paths<ClientCapabilities>,
  T extends Partial<ClientCapabilities>
>(capabilities: T, capability: K): capabilities is T & PickDeep<ClientCapabilities, K> {
  const value = getProperty(capabilities, capability as any);
  return value !== null && value !== undefined && value !== false;
}

/**
 * Helper to check if hover is supported
 */
export function supportsHover(
  capabilities: ServerCapabilities
): capabilities is ServerCapabilities & {
  hoverProvider: NonNullable<ServerCapabilities['hoverProvider']>;
} {
  return serverSupportsRequest('textDocument/hover', capabilities);
}

/**
 * Helper to check if completion is supported
 */
export function supportsCompletion(
  capabilities: ServerCapabilities
): capabilities is ServerCapabilities & {
  completionProvider: NonNullable<ServerCapabilities['completionProvider']>;
} {
  return serverSupportsRequest('textDocument/completion', capabilities);
}

/**
 * Helper to check if definition is supported
 */
export function supportsDefinition(
  capabilities: ServerCapabilities
): capabilities is ServerCapabilities & {
  definitionProvider: NonNullable<ServerCapabilities['definitionProvider']>;
} {
  return serverSupportsRequest('textDocument/definition', capabilities);
}

/**
 * Helper to check if references are supported
 */
export function supportsReferences(
  capabilities: ServerCapabilities
): capabilities is ServerCapabilities & {
  referencesProvider: NonNullable<ServerCapabilities['referencesProvider']>;
} {
  return serverSupportsRequest('textDocument/references', capabilities);
}

/**
 * Helper to check if document symbols are supported
 */
export function supportsDocumentSymbol(
  capabilities: ServerCapabilities
): capabilities is ServerCapabilities & {
  documentSymbolProvider: NonNullable<ServerCapabilities['documentSymbolProvider']>;
} {
  return serverSupportsRequest('textDocument/documentSymbol', capabilities);
}

/**
 * Helper to check if workspace folders are supported
 */
export function supportsWorkspaceFolders(
  capabilities: ServerCapabilities
): capabilities is ServerCapabilities & { workspace: { workspaceFolders: { supported: true } } } {
  return capabilities.workspace?.workspaceFolders?.supported === true;
}

export function supportsNotebookDocumentSync(
  capabilities: ServerCapabilities
): capabilities is ServerCapabilities & {
  notebookDocumentSync: NonNullable<ServerCapabilities['notebookDocumentSync']>;
} {
  return (
    capabilities.notebookDocumentSync !== null && capabilities.notebookDocumentSync !== undefined
  );
}

/**
 * Helper to check if file watching is supported
 */
export function supportsFileWatching(
  capabilities: ClientCapabilities
): capabilities is ClientCapabilities & {
  workspace: { didChangeWatchedFiles: { dynamicRegistration: true } };
} {
  return capabilities.workspace?.didChangeWatchedFiles?.dynamicRegistration === true;
}

/**
 * Helper to check if work done progress is supported
 */
export function supportsWorkDoneProgress(
  capabilities: ClientCapabilities
): capabilities is ClientCapabilities & { window: { workDoneProgress: true } } {
  return capabilities.window?.workDoneProgress === true;
}
