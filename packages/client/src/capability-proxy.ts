/**
 * Capability-aware dynamic method injection for client
 *
 * Dynamically adds methods/namespaces to the client object based on server capabilities
 */

import {
  LSPRequest,
  LSPNotification,
  getDefinitionForRequest,
  getDefinitionForNotification,
  hasServerCapability
} from '@lspeasy/core';
import type { LSPClient } from './client.js';
import camelCase from 'camelcase';

function deriveNotificationMethodKey(namespaceName: string, notificationKey: string): string {
  if (notificationKey.endsWith(namespaceName)) {
    return notificationKey.slice(0, -namespaceName.length);
  }
  return notificationKey;
}

function getRuntimeRegisteredMethods<
  ClientCaps extends Partial<import('@lspeasy/core').ClientCapabilities>
>(client: LSPClient<ClientCaps>): Set<string> {
  const runtime = client.getRuntimeCapabilities();
  return new Set(runtime.dynamicRegistrations.map((registration) => registration.method));
}

/**
 * Initializes capability-aware methods on the client object based on LSPRequest definitions
 */
export function initializeCapabilityMethods<
  ClientCaps extends Partial<import('@lspeasy/core').ClientCapabilities>
>(client: LSPClient<ClientCaps>): void {
  const runtimeRegisteredMethods = getRuntimeRegisteredMethods(client);

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
      if (
        !d.ServerCapability ||
        hasServerCapability(client.serverCapabilities, d.ServerCapability) ||
        runtimeRegisteredMethods.has(d.Method)
      ) {
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
      if (
        !d.ServerCapability ||
        hasServerCapability(client.serverCapabilities, d.ServerCapability) ||
        runtimeRegisteredMethods.has(d.Method)
      ) {
        const methodKey = deriveNotificationMethodKey(namespaceName, notification);
        (client as any)[clientPropertyName][camelCase(methodKey)] = (a: any) =>
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
  ClientCaps extends Partial<import('@lspeasy/core').ClientCapabilities>
>(client: LSPClient<ClientCaps>): void {
  // Re-run initialization to update methods based on new capabilities
  initializeCapabilityMethods(client);
}
