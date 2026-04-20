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
 * @see {@link ClientCapabilityGuard} for the companion guard that validates
 * server-to-client handler registrations against client capabilities.
 *
 * @throws Error When `strict` is `true` and a method is not in the known
 * method set or the required server capability has not been declared.
 *
 * @never
 * NEVER construct `CapabilityGuard` before the `initialize` handshake completes.
 * Server capabilities are only known after the `InitializeResult` is received;
 * instantiating the guard too early will treat all methods as unsupported.
 *
 * @category Client
 */
export class CapabilityGuard {
  constructor(
    private readonly capabilities: Partial<ServerCapabilities>,
    private readonly logger: Logger,
    private readonly strict: boolean = false
  ) {}

  /**
   * Returns `true` if the server capability for `method` is declared.
   *
   * @param method - The LSP request method string to check (e.g. `'textDocument/hover'`).
   * @returns `true` if allowed; `false` (non-strict) if the required server capability
   *   is missing.
   *
   * @throws Error In strict mode, throws if `method` is unknown or its required
   *   server capability has not been declared.
   *
   * @see {@link CapabilityGuard} for full class documentation.
   */
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

  /**
   * Returns `true` if the server capability for `method` is declared.
   *
   * @param method - The LSP notification method string to check.
   * @returns `true` if allowed; `false` (or throws in strict mode) if the required
   *   server capability is missing.
   */
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

  /**
   * Returns a defensive copy of the server capabilities this guard was built from.
   *
   * @returns A shallow copy of the server capabilities object.
   */
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
 * @never
 * NEVER register server-to-client handlers for capabilities not declared in
 * the original `initialize` request — the server may send the corresponding
 * requests, but without the capability declaration the client has no contract
 * to handle them, leading to silent failures or unexpected errors.
 *
 * @category Client
 */
export class ClientCapabilityGuard {
  constructor(
    private readonly capabilities: Partial<ClientCapabilities>,
    private readonly logger: Logger,
    private readonly strict: boolean = false
  ) {}

  /**
   * Returns `true` if the client has declared the capability required to handle `method`.
   *
   * @param method - The LSP method string to validate against client capabilities.
   * @returns `true` if the client capability is declared; `false` (non-strict) if missing.
   *
   * @throws Error In strict mode, throws if `method` is unknown or the required
   *   client capability was not declared in the `initialize` request.
   *
   * @see {@link ClientCapabilityGuard} for full class documentation.
   */
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

  /**
   * Returns a defensive copy of the client capabilities this guard was built from.
   *
   * @returns A shallow copy of the client capabilities object.
   */
  getClientCapabilities(): Partial<ClientCapabilities> {
    return { ...this.capabilities };
  }
}
