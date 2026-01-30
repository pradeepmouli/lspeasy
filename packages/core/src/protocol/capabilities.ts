/**
 * Capability-aware type utilities for LSP protocol
 *
 * @module protocol/capabilities
 */

import type {
  ServerCapabilities,
  ClientCapabilities,
  TextDocumentSyncKind
} from 'vscode-languageserver-protocol';
import type { LSPRequest } from './namespaces.js';

// Re-export capability types
export type { ServerCapabilities, ClientCapabilities };

/**
 * Extract all request definition types from the namespace structure
 */
type AllRequestDefinitions =
  | LSPRequest['TextDocument'][keyof LSPRequest['TextDocument']]
  | LSPRequest['Workspace'][keyof LSPRequest['Workspace']]
  | LSPRequest['Initialize']
  | LSPRequest['Shutdown'];

/**
 * Filter request definitions that have a ServerCapability field
 */
type RequestsWithCapabilities = Extract<AllRequestDefinitions, { ServerCapability: string }>;

/**
 * Map a method to its server capability provider key
 */
export type MethodToCapability<M extends string> = RequestsWithCapabilities extends infer R
  ? R extends { Method: M; ServerCapability: infer Cap }
    ? Cap
    : never
  : never;

/**
 * Check if a capability value indicates the feature is enabled
 */
type IsCapabilityEnabled<T> = T extends true | object ? true : false;

/**
 * Extract supported request methods based on server capabilities
 *
 * This type automatically traverses the LSP namespace structure to determine
 * which methods are available based on the provided server capabilities.
 */
export type MethodsForCapabilities<Caps extends ServerCapabilities> = {
  [K in RequestsWithCapabilities as K['Method']]: K extends { ServerCapability: infer CapKey }
    ? CapKey extends keyof Caps
      ? IsCapabilityEnabled<Caps[CapKey]> extends true
        ? K['Method']
        : never
      : never
    : never;
}[RequestsWithCapabilities['Method']];

/**
 * Get the capability key for a given method
 */
export type CapabilityForMethod<M extends RequestsWithCapabilities['Method']> = Extract<
  RequestsWithCapabilities,
  { Method: M }
>['ServerCapability'];

/**
 * Map of LSP methods to their corresponding server capability keys
 * This is derived from the namespace structure
 */
const METHOD_TO_CAPABILITY_MAP: Record<string, keyof ServerCapabilities> = {
  'textDocument/hover': 'hoverProvider',
  'textDocument/completion': 'completionProvider',
  'textDocument/definition': 'definitionProvider',
  'textDocument/references': 'referencesProvider',
  'textDocument/documentSymbol': 'documentSymbolProvider',
  'textDocument/codeAction': 'codeActionProvider',
  'textDocument/formatting': 'documentFormattingProvider',
  'textDocument/rename': 'renameProvider',
  'workspace/symbol': 'workspaceSymbolProvider',
  'workspace/executeCommand': 'executeCommandProvider'
} as const;

/**
 * Get the capability key for a given method at runtime
 */
export function getCapabilityForMethod(method: string): keyof ServerCapabilities | undefined {
  return METHOD_TO_CAPABILITY_MAP[method];
}

/**
 * Check if a method is supported by the given server capabilities
 */
export function supportsMethod<M extends string>(
  method: M,
  capabilities: ServerCapabilities
): capabilities is ServerCapabilities &
  Record<
    MethodToCapability<M>,
    NonNullable<ServerCapabilities[MethodToCapability<M> & keyof ServerCapabilities]>
  > {
  const capabilityKey = getCapabilityForMethod(method);
  if (!capabilityKey) {
    return false;
  }

  const value = capabilities[capabilityKey];
  return value !== null && value !== undefined && value !== false;
}

/**
 * Check if a server capability is enabled
 */
export function hasCapability<K extends keyof ServerCapabilities>(
  capabilities: ServerCapabilities,
  capability: K
): capabilities is ServerCapabilities & Record<K, NonNullable<ServerCapabilities[K]>> {
  const value = capabilities[capability];
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
  return hasCapability(capabilities, 'hoverProvider');
}

/**
 * Helper to check if completion is supported
 */
export function supportsCompletion(
  capabilities: ServerCapabilities
): capabilities is ServerCapabilities & {
  completionProvider: NonNullable<ServerCapabilities['completionProvider']>;
} {
  return hasCapability(capabilities, 'completionProvider');
}

/**
 * Helper to check if definition is supported
 */
export function supportsDefinition(
  capabilities: ServerCapabilities
): capabilities is ServerCapabilities & {
  definitionProvider: NonNullable<ServerCapabilities['definitionProvider']>;
} {
  return hasCapability(capabilities, 'definitionProvider');
}

/**
 * Helper to check if references are supported
 */
export function supportsReferences(
  capabilities: ServerCapabilities
): capabilities is ServerCapabilities & {
  referencesProvider: NonNullable<ServerCapabilities['referencesProvider']>;
} {
  return hasCapability(capabilities, 'referencesProvider');
}

/**
 * Helper to check if document symbols are supported
 */
export function supportsDocumentSymbol(
  capabilities: ServerCapabilities
): capabilities is ServerCapabilities & {
  documentSymbolProvider: NonNullable<ServerCapabilities['documentSymbolProvider']>;
} {
  return hasCapability(capabilities, 'documentSymbolProvider');
}

/**
 * Helper to check if workspace folders are supported
 */
export function supportsWorkspaceFolders(
  capabilities: ServerCapabilities
): capabilities is ServerCapabilities & { workspace: { workspaceFolders: { supported: true } } } {
  return capabilities.workspace?.workspaceFolders?.supported === true;
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

/**
 * Text document sync kind enum for convenience
 */
export const TextDocumentSyncKinds = {
  None: 0 as TextDocumentSyncKind,
  Full: 1 as TextDocumentSyncKind,
  Incremental: 2 as TextDocumentSyncKind
} as const;
