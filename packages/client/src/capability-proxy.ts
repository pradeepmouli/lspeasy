/**
 * Capability-aware dynamic method injection for client
 *
 * Dynamically adds methods/namespaces to the client object based on server capabilities
 */

import type {
  ClientNotifications,
  ClientRequests,
  ClientRequestHandlers,
  ClientNotificationHandlers,
  ServerCapabilities
} from '@lspeasy/core';
import {
  LSPRequest,
  LSPNotification,
  getDefinitionForRequest,
  getDefinitionForNotification,
  hasCapability,
  serverSupportsRequest
} from '@lspeasy/core';
import type { LSPClient } from './client.js';
import camelCase from 'camelcase';
import { is } from 'zod/locales';
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
 * Extract the method string from a request/notification type definition
 */
function getMethodFromDefinition(def: any): string | undefined {
  return def?.Method;
}

/**
 * Extract the server capability key from a request/notification type definition
 */
function getServerCapabilityFromDefinition(def: any): string | null {
  return def?.ServerCapability ?? null;
}

/**
 * Adds capability-aware namespace methods directly to the client object
 */

/**
 * Initializes capability-aware methods on the client object based on LSPRequest definitions
 */
export function initializeCapabilityMethods<
  ClientCaps extends Partial<import('@lspeasy/core').ClientCapabilities>,
  ServerCaps extends Partial<ServerCapabilities>
>(client: LSPClient<ClientCaps, ServerCaps>): void {
  if (!client.serverCapabilities) {
    // Server capabilities not yet known; cannot initialize methods
    return;
  }
  // Attach all namespaces from LSPRequest
  for (const [namespaceName, namespaceDefinitions] of Object.entries(LSPRequest)) {
    // Convert namespace name to camelCase for the client property
    // e.g., "TextDocument" -> "textDocument", "Workspace" -> "workspace"
    const clientPropertyName = camelCase(namespaceName);
    const namespace = {} as any;
    for (const request in namespaceDefinitions) {
      const d = getDefinitionForRequest<any, any>(
        namespaceName as keyof typeof LSPRequest,
        request as any
      );
      // Only add methods if:
      // 1. No capability required (ServerCapability is undefined/null), OR
      // 2. Server has the required capability
      if (!d.ServerCapability || hasCapability(client.serverCapabilities, d.ServerCapability)) {
        namespace[camelCase(request)] = (a: any, b: any) => client.sendRequest(d.Method, a, b);
      }
      // If capability is missing, don't add the method at all (runtime matches types)
    }
    // Only add namespace if it has at least one method
    if (Object.keys(namespace).length > 0) {
      (client as any)[clientPropertyName] = namespace;
    }
  }

  // Also attach notification namespaces if needed
  for (const [namespaceName, namespaceDefinitions] of Object.entries(LSPNotification)) {
    const clientPropertyName = camelCase(namespaceName);
    if (!(client as any)[clientPropertyName]) {
      (client as any)[clientPropertyName] = {};
    }
    for (const notification in namespaceDefinitions) {
      const d = getDefinitionForNotification(namespaceName as any, notification);
      // Notifications typically don't require capabilities, but check anyway
      if (!d.ServerCapability || hasCapability(client.serverCapabilities, d.ServerCapability)) {
        (client as any)[clientPropertyName][camelCase(notification)] = (a: any) =>
          client.sendNotification(d.Method, a);
      }
    }
  }
}

/**
 * Updates capability-aware methods on the client after server capabilities are received
 * This should be called after initialization to add/remove methods based on actual capabilities
 */
export function updateCapabilityMethods<
  ClientCaps extends Partial<import('@lspeasy/core').ClientCapabilities>,
  ServerCaps extends Partial<ServerCapabilities>
>(client: LSPClient<ClientCaps, ServerCaps>): void {
  // Re-run initialization to update methods based on new capabilities
  initializeCapabilityMethods(client);
}
