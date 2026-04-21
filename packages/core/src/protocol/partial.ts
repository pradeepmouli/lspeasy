/**
 * Partial result streaming types for LSP protocol
 *
 * @module protocol/partial
 */

import type { ProgressToken } from 'vscode-languageserver-protocol';

/**
 * A parameter literal used to pass a partial result token.
 */
export interface PartialResultParams {
  /**
   * An optional token that a server can use to report partial results
   * (e.g., streaming) to the client.
   */
  partialResultToken?: ProgressToken;
}

/**
 * Creates `PartialResultParams` with the given partial result token.
 *
 * @param token - The progress token the client will use to correlate `$/progress` notifications.
 * @returns A `PartialResultParams` object with `partialResultToken` set.
 */
export function createPartialResultParams(token: ProgressToken): PartialResultParams {
  return { partialResultToken: token };
}

/**
 * Type guard to check if params support partial results.
 *
 * @param params - The unknown value to test.
 * @returns `true` when `params` contains a `partialResultToken` property.
 */
export function hasPartialResultToken(params: unknown): params is PartialResultParams {
  return typeof params === 'object' && params !== null && 'partialResultToken' in params;
}

/**
 * Extracts the partial result token from params.
 *
 * @param params - The request params that may carry a `partialResultToken`.
 * @returns The `ProgressToken`, or `undefined` if none was set.
 */
export function getPartialResultToken(params: PartialResultParams): ProgressToken | undefined {
  return params.partialResultToken;
}
