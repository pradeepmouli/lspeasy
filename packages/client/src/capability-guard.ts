/**
 * Capability validation for client requests
 *
 * Ensures clients only send requests/notifications that the server supports,
 * and only register handlers for methods the client declared support for.
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
 * Validates outgoing client requests and notifications against the server's
 * declared capabilities.
 *
 * @remarks
 * Created internally by `LSPClient` after a successful `initialize` handshake.
 * In non-strict mode (default) violations are logged as warnings; in strict
 * mode they throw.
 *
 * @useWhen
 * You are implementing a custom client layer and need the same validation
 * behaviour that `LSPClient` uses. Otherwise this is an internal detail.
 *
 * @category Client
 */
export class CapabilityGuard {
  constructor(
    private readonly capabilities: Partial<ServerCapabilities>,
    private readonly logger: Logger,
    private readonly strict: boolean = false
  ) {}

  canSendRequest(method: string): boolean {
    return checkMethod({
      method,
      methodSets: SERVER_METHODS,
      getCapabilityKey: (m) => getCapabilityForRequestMethod(m as any),
      hasCapability: (key) => hasServerCapability(this.capabilities, key as any),
      actionLabel: 'send request',
      capabilityLabel: 'server capability',
      logger: this.logger,
      strict: this.strict
    });
  }

  canSendNotification(method: string): boolean {
    return checkMethod({
      method,
      methodSets: SERVER_METHODS,
      getCapabilityKey: (m) => getCapabilityForNotificationMethod(m as any),
      hasCapability: (key) => hasServerCapability(this.capabilities, key as any),
      actionLabel: 'send notification',
      capabilityLabel: 'server capability',
      logger: this.logger,
      strict: this.strict
    });
  }

  getServerCapabilities(): Partial<ServerCapabilities> {
    return { ...this.capabilities };
  }
}

/**
 * Validates that server-to-client handler registrations are backed by
 * client capabilities declared in the `initialize` request.
 *
 * @remarks
 * Created internally by `LSPClient`. In non-strict mode violations are logged
 * as warnings; in strict mode they throw.
 *
 * @category Client
 */
export class ClientCapabilityGuard {
  constructor(
    private readonly capabilities: Partial<ClientCapabilities>,
    private readonly logger: Logger,
    private readonly strict: boolean = false
  ) {}

  canRegisterHandler(method: string): boolean {
    return checkMethod({
      method,
      methodSets: CLIENT_METHODS,
      getCapabilityKey: (m) => {
        return (
          getClientCapabilityForRequestMethod(m as any) ??
          getClientCapabilityForNotificationMethod(m as any)
        );
      },
      hasCapability: (key) => hasClientCapability(this.capabilities, key as any),
      actionLabel: 'register handler',
      capabilityLabel: 'client capability',
      logger: this.logger,
      strict: this.strict
    });
  }

  getClientCapabilities(): Partial<ClientCapabilities> {
    return { ...this.capabilities };
  }
}
