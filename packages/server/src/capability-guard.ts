/**
 * Capability validation for server handlers
 *
 * Ensures handlers can only be registered for declared capabilities
 */

import type { ClientCapabilities, ServerCapabilities } from '@lspeasy/core';
import type { Logger } from '@lspeasy/core';
import {
  LSPNotification,
  LSPRequest,
  getClientCapabilityForNotificationMethod,
  getClientCapabilityForRequestMethod,
  hasServerCapability,
  hasClientCapability,
  getCapabilityForNotificationMethod,
  getCapabilityForRequestMethod
} from '@lspeasy/core';

type CapabilityKey = 'ServerCapability' | 'ClientCapability';

function buildMethodSets(capabilityKey: CapabilityKey): {
  all: Set<string>;
  alwaysAllowed: Set<string>;
} {
  const all = new Set<string>();
  const alwaysAllowed = new Set<string>();

  for (const namespaceDefinitions of Object.values(LSPRequest)) {
    for (const definition of Object.values(namespaceDefinitions)) {
      const entry = definition as { Method: string } & Record<CapabilityKey, string | undefined>;
      all.add(entry.Method);
      if (!entry[capabilityKey]) {
        alwaysAllowed.add(entry.Method);
      }
    }
  }

  for (const namespaceDefinitions of Object.values(LSPNotification)) {
    for (const definition of Object.values(namespaceDefinitions)) {
      const entry = definition as { Method: string } & Record<CapabilityKey, string | undefined>;
      all.add(entry.Method);
      if (!entry[capabilityKey]) {
        alwaysAllowed.add(entry.Method);
      }
    }
  }

  return { all, alwaysAllowed };
}

const SERVER_METHODS = buildMethodSets('ServerCapability');
const CLIENT_METHODS = buildMethodSets('ClientCapability');

/**
 * Validates that a handler can be registered for a method
 * based on declared server capabilities
 */
export class CapabilityGuard {
  constructor(
    private readonly capabilities: Partial<ServerCapabilities>,
    private readonly logger: Logger,
    private readonly strict: boolean = false
  ) {}

  /**
   * Check if handler registration is allowed for this method
   *
   * @param method - LSP method name
   * @returns true if allowed, false otherwise
   * @throws Error if strict mode enabled and capability not declared
   */
  canRegisterHandler(method: string): boolean {
    if (!SERVER_METHODS.all.has(method)) {
      if (!this.strict) {
        this.logger.debug(`Unknown method ${method}, allowing in non-strict mode`);
        return true;
      }

      const error = `Cannot register handler for unknown method: ${method}`;
      this.logger.error(error);
      if (this.strict) {
        throw new Error(error);
      }
      return false;
    }

    if (SERVER_METHODS.alwaysAllowed.has(method)) {
      return true;
    }

    // Check if method requires a capability (try both request and notification)
    let capabilityKey = getCapabilityForRequestMethod(method as any);
    if (!capabilityKey) {
      capabilityKey = getCapabilityForNotificationMethod(method as any);
    }

    if (!capabilityKey) {
      // Unknown method - allow in non-strict mode
      if (!this.strict) {
        this.logger.debug(`Unknown method ${method}, allowing in non-strict mode`);
        return true;
      }

      const error = `Cannot register handler for unknown method: ${method}`;
      this.logger.error(error);
      if (this.strict) {
        throw new Error(error);
      }
      return false;
    }
    if (capabilityKey === 'alwaysOn') {
      return true;
    }

    // Check if capability is declared
    if (!hasServerCapability(this.capabilities, capabilityKey)) {
      const error = `Cannot register handler for ${method}: server capability '${capabilityKey}' not declared`;
      this.logger.warn(error);

      if (this.strict) {
        throw new Error(error);
      }
      return false;
    }

    return true;
  }

  getAllowedMethods(): string[] {
    // This would require iterating through all LSP methods
    // For now, return an empty array - can be enhanced if needed
    this.logger.warn('getAllowedMethods not fully implemented - returns empty array');
    return [];
  }
}

/**
 * Validates that server-to-client messages respect declared client capabilities
 */
export class ClientCapabilityGuard {
  constructor(
    private readonly capabilities: Partial<ClientCapabilities>,
    private readonly logger: Logger,
    private readonly strict: boolean = false
  ) {}

  /**
   * Check if a request can be sent to the client
   *
   * @param method - LSP method name
   * @returns true if allowed, false otherwise
   * @throws Error if strict mode enabled and client capability not declared
   */
  canSendRequest(method: string): boolean {
    if (!CLIENT_METHODS.all.has(method)) {
      if (!this.strict) {
        this.logger.debug(`Unknown request method ${method}, allowing in non-strict mode`);
        return true;
      }

      const error = `Cannot send request for unknown method: ${method}`;
      this.logger.error(error);
      throw new Error(error);
    }

    if (CLIENT_METHODS.alwaysAllowed.has(method)) {
      return true;
    }

    const capabilityKey = getClientCapabilityForRequestMethod(method as any);
    if (!capabilityKey) {
      if (!this.strict) {
        this.logger.debug(`Unknown request method ${method}, allowing in non-strict mode`);
        return true;
      }

      const error = `Cannot send request for unknown method: ${method}`;
      this.logger.error(error);
      throw new Error(error);
    }

    if (capabilityKey === 'alwaysOn') {
      return true;
    }

    if (!hasClientCapability(this.capabilities, capabilityKey as any)) {
      const error = `Cannot send request ${method}: client capability '${capabilityKey}' not declared`;
      this.logger.warn(error);

      if (this.strict) {
        throw new Error(error);
      }
      return false;
    }

    return true;
  }

  /**
   * Check if a notification can be sent to the client
   *
   * @param method - LSP method name
   * @returns true if allowed, false otherwise
   * @throws Error if strict mode enabled and client capability not declared
   */
  canSendNotification(method: string): boolean {
    if (!CLIENT_METHODS.all.has(method)) {
      if (!this.strict) {
        this.logger.debug(`Unknown notification method ${method}, allowing in non-strict mode`);
        return true;
      }

      const error = `Cannot send notification for unknown method: ${method}`;
      this.logger.error(error);
      throw new Error(error);
    }

    if (CLIENT_METHODS.alwaysAllowed.has(method)) {
      return true;
    }

    const capabilityKey = getClientCapabilityForNotificationMethod(method as any);
    if (!capabilityKey) {
      if (!this.strict) {
        this.logger.debug(`Unknown notification method ${method}, allowing in non-strict mode`);
        return true;
      }

      const error = `Cannot send notification for unknown method: ${method}`;
      this.logger.error(error);
      throw new Error(error);
    }

    if (capabilityKey === 'alwaysOn') {
      return true;
    }

    if (!hasClientCapability(this.capabilities, capabilityKey as any)) {
      const error = `Cannot send notification ${method}: client capability '${capabilityKey}' not declared`;
      this.logger.warn(error);

      if (this.strict) {
        throw new Error(error);
      }
      return false;
    }

    return true;
  }

  /**
   * Get list of capabilities the client declared
   */
  getClientCapabilities(): Partial<ClientCapabilities> {
    return { ...this.capabilities };
  }
}
