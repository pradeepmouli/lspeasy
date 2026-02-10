/**
 * Capability validation for client requests
 *
 * Ensures clients only send requests/notifications that the server supports
 */

import type { ServerCapabilities } from '@lspeasy/core';
import type { Logger } from '@lspeasy/core';
import {
  hasCapability,
  getCapabilityForNotificationMethod,
  getCapabilityForRequestMethod
} from '@lspeasy/core';

/**
 * Validates that a request/notification can be sent based on
 * declared server capabilities
 */
export class CapabilityGuard {
  constructor(
    private readonly capabilities: Partial<ServerCapabilities>,
    private readonly logger: Logger,
    private readonly strict: boolean = false
  ) {}

  /**
   * Check if a request can be sent to the server
   *
   * @param method - LSP method name
   * @returns true if allowed, false otherwise
   * @throws Error if strict mode enabled and server capability not declared
   */
  canSendRequest(method: string): boolean {
    // Methods that don't require server capabilities
    const alwaysAllowed = [
      'initialize',
      'initialized',
      'shutdown',
      'exit',
      '$/cancelRequest',
      '$/logTrace'
    ];

    if (alwaysAllowed.includes(method)) {
      return true;
    }

    // Check if server supports this request method
    const capabilityKey = getCapabilityForRequestMethod(method as any);

    if (!capabilityKey) {
      // Unknown method - allow in non-strict mode with warning
      if (!this.strict) {
        this.logger.debug(`Unknown request method ${method}, allowing in non-strict mode`);
        return true;
      }

      const error = `Cannot send request for unknown method: ${method}`;
      this.logger.error(error);
      throw new Error(error);
    }

    // Methods marked as 'alwaysOn' don't require explicit capabilities
    if (capabilityKey === 'alwaysOn') {
      return true;
    }

    // Check if server declared this capability
    if (!hasCapability(this.capabilities, capabilityKey)) {
      const error = `Cannot send request ${method}: server capability '${capabilityKey}' not declared`;
      this.logger.warn(error);

      if (this.strict) {
        throw new Error(error);
      }
      return false;
    }

    return true;
  }

  /**
   * Check if a notification can be sent to the server
   *
   * @param method - LSP method name
   * @returns true if allowed, false otherwise
   * @throws Error if strict mode enabled and server capability not declared
   */
  canSendNotification(method: string): boolean {
    // Notifications that don't require server capabilities
    const alwaysAllowed = [
      'initialized',
      'exit',
      '$/cancelRequest',
      '$/logTrace',
      'textDocument/didOpen',
      'textDocument/didChange',
      'textDocument/didClose',
      'textDocument/didSave',
      'textDocument/willSave',
      'workspace/didChangeConfiguration',
      'workspace/didChangeWatchedFiles',
      'workspace/didChangeWorkspaceFolders',
      'notebookDocument/didOpen',
      'notebookDocument/didChange',
      'notebookDocument/didSave',
      'notebookDocument/didClose'
    ];

    if (alwaysAllowed.includes(method)) {
      return true;
    }

    // Check if server supports this notification method
    const capabilityKey = getCapabilityForNotificationMethod(method as any);

    if (!capabilityKey) {
      // Unknown method - allow in non-strict mode with warning
      if (!this.strict) {
        this.logger.debug(`Unknown notification method ${method}, allowing in non-strict mode`);
        return true;
      }

      const error = `Cannot send notification for unknown method: ${method}`;
      this.logger.error(error);
      throw new Error(error);
    }

    // Methods marked as 'alwaysOn' don't require explicit capabilities
    if (capabilityKey === 'alwaysOn') {
      return true;
    }

    // Check if server declared this capability
    if (!hasCapability(this.capabilities, capabilityKey)) {
      const error = `Cannot send notification ${method}: server capability '${capabilityKey}' not declared`;
      this.logger.warn(error);

      if (this.strict) {
        throw new Error(error);
      }
      return false;
    }

    return true;
  }

  /**
   * Get list of capabilities the server declared
   */
  getServerCapabilities(): Partial<ServerCapabilities> {
    return { ...this.capabilities };
  }
}
