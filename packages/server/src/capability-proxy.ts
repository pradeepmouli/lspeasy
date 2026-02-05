/**
 * Capability-aware dynamic method injection for server
 *
 * Dynamically adds handler registration methods and send methods to the server
 * based on declared capabilities
 */

import type { LSPServer } from './server.js';
import type { ServerCapabilities } from '@lspeasy/core';
import {
  LSPRequest,
  LSPNotification,
  getDefinitionForRequest,
  getDefinitionForNotification
} from '@lspeasy/core';
import camelCase from 'camelcase';

/**
 * Initialize capability-aware handler registration methods on the server
 * Creates namespace.onMethod() style methods for registering handlers
 */
export function initializeServerHandlerMethods<Capabilities extends Partial<ServerCapabilities>>(
  server: LSPServer<Capabilities>
): void {
  const capabilities = server.getCapabilities();

  // Add handler registration methods for requests
  for (const [namespaceName, namespaceDefinitions] of Object.entries(LSPRequest)) {
    const clientPropertyName = camelCase(namespaceName);
    const namespace = {} as any;

    for (const [methodKey, definition] of Object.entries(namespaceDefinitions)) {
      const def = definition as any;

      // Only add methods for clientToServer or both directions
      if (def.Direction !== 'clientToServer' && def.Direction !== 'both') {
        continue;
      }

      // Check if capability is satisfied
      if (def.ServerCapability) {
        // Skip if capability is not set
        if (!hasCapability(capabilities, def.ServerCapability)) {
          continue;
        }
      }

      // Create handler registration method: onMethod
      const handlerMethodName = `on${methodKey}`;
      namespace[handlerMethodName] = function (handler: any) {
        return (server as any).onRequest(def.Method, handler);
      };
    }

    // Only add namespace if it has at least one method
    if (Object.keys(namespace).length > 0) {
      if (!(server as any)[clientPropertyName]) {
        (server as any)[clientPropertyName] = {};
      }
      Object.assign((server as any)[clientPropertyName], namespace);
    }
  }

  // Add handler registration methods for notifications
  for (const [namespaceName, namespaceDefinitions] of Object.entries(LSPNotification)) {
    const clientPropertyName = camelCase(namespaceName);
    const namespace = {} as any;

    for (const [methodKey, definition] of Object.entries(namespaceDefinitions)) {
      const def = definition as any;

      // Only add methods for clientToServer or both directions
      if (def.Direction !== 'clientToServer' && def.Direction !== 'both') {
        continue;
      }

      // Check if notification requires capability
      if (def.ServerCapability && !hasCapability(capabilities, def.ServerCapability)) {
        continue;
      }

      // Create handler registration method: onMethod
      const handlerMethodName = `on${methodKey}`;
      namespace[handlerMethodName] = function (handler: any) {
        return (server as any).onNotification(def.Method, handler);
      };
    }

    // Only add namespace if it has at least one method
    if (Object.keys(namespace).length > 0) {
      if (!(server as any)[clientPropertyName]) {
        (server as any)[clientPropertyName] = {};
      }
      Object.assign((server as any)[clientPropertyName], namespace);
    }
  }
}

/**
 * Initialize capability-aware send methods on the server
 * Creates namespace.method() style methods for sending requests/notifications to client
 */
export function initializeServerSendMethods<Capabilities extends Partial<ServerCapabilities>>(
  server: LSPServer<Capabilities>
): void {
  // Add send methods for server-to-client requests
  for (const [namespaceName, namespaceDefinitions] of Object.entries(LSPRequest)) {
    const clientPropertyName = camelCase(namespaceName);

    if (!(server as any)[clientPropertyName]) {
      (server as any)[clientPropertyName] = {};
    }

    const namespace = (server as any)[clientPropertyName];

    for (const [methodKey, definition] of Object.entries(namespaceDefinitions)) {
      const def = definition as any;

      // Only add methods for serverToClient or both directions
      if (def.Direction !== 'serverToClient' && def.Direction !== 'both') {
        continue;
      }

      // Create send method
      const sendMethodName = camelCase(methodKey);
      namespace[sendMethodName] = async function (params: any) {
        // Note: Server needs to implement sendRequest method for server-to-client requests
        // This would require extending the server implementation
        throw new Error('Server-to-client requests not yet implemented in LSPServer');
      };
    }
  }

  // Add send methods for server-to-client notifications
  for (const [namespaceName, namespaceDefinitions] of Object.entries(LSPNotification)) {
    const clientPropertyName = camelCase(namespaceName);

    if (!(server as any)[clientPropertyName]) {
      (server as any)[clientPropertyName] = {};
    }

    const namespace = (server as any)[clientPropertyName];

    for (const [methodKey, definition] of Object.entries(namespaceDefinitions)) {
      const def = definition as any;

      // Only add methods for serverToClient or both directions
      if (def.Direction !== 'serverToClient' && def.Direction !== 'both') {
        continue;
      }

      // Create send method
      const sendMethodName = camelCase(methodKey);
      namespace[sendMethodName] = async function (params: any) {
        // Note: Server needs to implement sendNotification method for server-to-client notifications
        // This would require extending the server implementation
        throw new Error('Server-to-client notifications not yet implemented in LSPServer');
      };
    }
  }
}

/**
 * Check if a capability is present in the capabilities object
 */
function hasCapability(
  capabilities: Partial<ServerCapabilities> | undefined,
  capabilityPath: string
): boolean {
  if (!capabilities) return false;

  const parts = capabilityPath.split('.');
  let current: any = capabilities;

  for (const part of parts) {
    if (current === undefined || current === null) return false;
    current = current[part];
  }

  return current !== undefined && current !== false && current !== null;
}
