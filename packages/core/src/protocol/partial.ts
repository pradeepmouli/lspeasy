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
 * Helper to create partial result params
 */
export function createPartialResultParams(token: ProgressToken): PartialResultParams {
  return { partialResultToken: token };
}

/**
 * Type guard to check if params support partial results
 */
export function hasPartialResultToken(params: unknown): params is PartialResultParams {
  return typeof params === 'object' && params !== null && 'partialResultToken' in params;
}

/**
 * Helper to extract partial result token from params
 */
export function getPartialResultToken(params: PartialResultParams): ProgressToken | undefined {
  return params.partialResultToken;
}
