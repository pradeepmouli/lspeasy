/**
 * Shared capability validation logic used by both client and server packages
 */

import type { Logger } from './logger.js';
import { LSPRequest, LSPNotification } from '../protocol/namespaces.js';

type CapabilityKey = 'ServerCapability' | 'ClientCapability';

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

export const SERVER_METHODS = buildMethodSets('ServerCapability');
export const CLIENT_METHODS = buildMethodSets('ClientCapability');

export interface CheckMethodOptions {
  method: string;
  methodSets: { all: Set<string>; alwaysAllowed: Set<string> };
  getCapabilityKey: (method: string) => string | null;
  hasCapability: (key: string) => boolean;
  actionLabel: string;
  capabilityLabel: string;
  logger: Logger;
  strict: boolean;
}

/**
 * Shared validation logic for checking if a method is allowed based on capabilities.
 *
 * Returns true if allowed, false if disallowed (non-strict), or throws (strict).
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
