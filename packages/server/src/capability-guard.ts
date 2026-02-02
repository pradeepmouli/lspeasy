/**
 * Capability validation for server handlers
 *
 * Ensures handlers can only be registered for declared capabilities
 */

import type { ServerCapabilities } from '@lspeasy/core';
import type { Logger } from '@lspeasy/core';
import { getCapabilityForMethod, hasCapability } from '@lspeasy/core';

/**
 * Check if a capability is enabled in server capabilities
 */
function isCapabilityEnabled(
  capabilities: Partial<ServerCapabilities>,
  capabilityKey: keyof ServerCapabilities
): boolean {
  return hasCapability(capabilities as ServerCapabilities, capabilityKey);
}

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
    // Special methods that don't require capabilities
    const alwaysAllowed = [
      'initialize',
      'initialized',
      'shutdown',
      'exit',
      '$/cancelRequest',
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

    // Check if method requires a capability
    const capabilityKey = getCapabilityForMethod(method);
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

    // Check if capability is declared
    if (!isCapabilityEnabled(this.capabilities, capabilityKey)) {
      const error = `Cannot register handler for ${method}: server capability '${capabilityKey}' not declared`;
      this.logger.warn(error);

      if (this.strict) {
        throw new Error(error);
      }
      return false;
    }

    return true;
  }

  /**
   * Get the capability key for a method
   */
  getCapabilityKey(method: string): keyof ServerCapabilities | undefined {
    return getCapabilityForMethod(method);
  }

  /**
   * Get all methods that are allowed based on current capabilities
   */
  getAllowedMethods(): string[] {
    // This would require iterating through all LSP methods
    // For now, return an empty array - can be enhanced if needed
    this.logger.warn('getAllowedMethods not fully implemented - returns empty array');
    return [];
  }
}
