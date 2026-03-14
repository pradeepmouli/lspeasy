/**
 * Capability validation for server handlers
 *
 * Ensures handlers can only be registered for declared server capabilities,
 * and that server-to-client messages respect declared client capabilities.
 */

import type { ClientCapabilities, ServerCapabilities } from '@lspeasy/core';
import type { Logger } from '@lspeasy/core';
import {
  SERVER_METHODS,
  CLIENT_METHODS,
  checkMethod,
  getClientCapabilityForNotificationMethod,
  getClientCapabilityForRequestMethod,
  hasServerCapability,
  hasClientCapability,
  getCapabilityForNotificationMethod,
  getCapabilityForRequestMethod
} from '@lspeasy/core';

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

  canRegisterHandler(method: string): boolean {
    return checkMethod({
      method,
      methodSets: SERVER_METHODS,
      getCapabilityKey: (m) => {
        return (
          getCapabilityForRequestMethod(m as any) ?? getCapabilityForNotificationMethod(m as any)
        );
      },
      hasCapability: (key) => hasServerCapability(this.capabilities, key as any),
      actionLabel: 'register handler',
      capabilityLabel: 'server capability',
      logger: this.logger,
      strict: this.strict
    });
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

  canSendRequest(method: string): boolean {
    return checkMethod({
      method,
      methodSets: CLIENT_METHODS,
      getCapabilityKey: (m) => getClientCapabilityForRequestMethod(m as any),
      hasCapability: (key) => hasClientCapability(this.capabilities, key as any),
      actionLabel: 'send request',
      capabilityLabel: 'client capability',
      logger: this.logger,
      strict: this.strict
    });
  }

  canSendNotification(method: string): boolean {
    return checkMethod({
      method,
      methodSets: CLIENT_METHODS,
      getCapabilityKey: (m) => getClientCapabilityForNotificationMethod(m as any),
      hasCapability: (key) => hasClientCapability(this.capabilities, key as any),
      actionLabel: 'send notification',
      capabilityLabel: 'client capability',
      logger: this.logger,
      strict: this.strict
    });
  }

  getClientCapabilities(): Partial<ClientCapabilities> {
    return { ...this.capabilities };
  }
}
