/**
 * Shared capability validation logic used by both client and server packages
 */

import type { Logger } from './logger.js';
import { LSPRequest, LSPNotification } from '../protocol/namespaces.js';

type CapabilityKey = 'ServerCapability' | 'ClientCapability';

/**
 * Builds the full set of LSP methods and the subset that are always allowed
 * (not gated by a capability) for a given capability key.
 *
 * @remarks
 * Iterates every entry in {@link LSPRequest} and {@link LSPNotification} to
 * collect method strings, then marks those without a corresponding capability
 * entry as always-allowed (e.g. `initialize`, `shutdown`, `$/cancelRequest`).
 *
 * @param capabilityKey - Whether to index by `'ServerCapability'` or `'ClientCapability'`.
 * @returns An object with `all` (every known method) and `alwaysAllowed`
 *   (methods that do not require a capability declaration).
 *
 * @category Utilities
 */
export function buildMethodSets(capabilityKey: CapabilityKey): {
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

/**
 * Pre-built method sets indexed by server capability.
 * Used by `CapabilityGuard` in `@lspeasy/client` and `@lspeasy/server`.
 *
 * @category Utilities
 */
export const SERVER_METHODS = buildMethodSets('ServerCapability');

/**
 * Pre-built method sets indexed by client capability.
 * Used by `ClientCapabilityGuard` in `@lspeasy/client` and `@lspeasy/server`.
 *
 * @category Utilities
 */
export const CLIENT_METHODS = buildMethodSets('ClientCapability');

export interface CheckMethodOptions {
  method: string;
  methodSets: { all: Set<string>; alwaysAllowed: Set<string> };
  getCapabilityKey: (method: string) => string | null | undefined;
  hasCapability: (key: string) => boolean;
  actionLabel: string;
  capabilityLabel: string;
  logger: Logger;
  strict: boolean;
}

/**
 * Shared validation logic for checking if a method is allowed based on capabilities.
 *
 * Returns `true` if allowed, `false` if disallowed in non-strict mode, or throws in strict mode.
 *
 * @param opts - Validation options including the method, capability lookup helpers, and logger.
 * @returns `true` when the method is allowed; `false` when disallowed in non-strict mode.
 * @throws When the method is disallowed and `opts.strict` is `true`.
 */
export function checkMethod(opts: CheckMethodOptions): boolean {
  const {
    method,
    methodSets,
    getCapabilityKey,
    hasCapability,
    actionLabel,
    capabilityLabel,
    logger,
    strict
  } = opts;

  if (!methodSets.all.has(method)) {
    if (!strict) {
      logger.debug(`Unknown method ${method}, allowing in non-strict mode`);
      return true;
    }
    const error = `Cannot ${actionLabel} for unknown method: ${method}`;
    logger.error(error);
    throw new Error(error);
  }

  if (methodSets.alwaysAllowed.has(method)) {
    return true;
  }

  const capabilityKey = getCapabilityKey(method);

  if (!capabilityKey) {
    if (!strict) {
      logger.debug(`Unknown method ${method}, allowing in non-strict mode`);
      return true;
    }
    const error = `Cannot ${actionLabel} for unknown method: ${method}`;
    logger.error(error);
    throw new Error(error);
  }

  if (capabilityKey === 'alwaysOn') {
    return true;
  }

  if (!hasCapability(capabilityKey)) {
    const error = `Cannot ${actionLabel} ${method}: ${capabilityLabel} '${capabilityKey}' not declared`;
    logger.warn(error);
    if (strict) {
      throw new Error(error);
    }
    return false;
  }

  return true;
}
