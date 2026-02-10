/**
 * Type definitions for LSP Client
 */

import type { ClientCapabilities, Logger, LogLevel, Client } from '@lspeasy/core';
import type { ZodError } from 'zod';
import type { ResponseMessage } from '@lspeasy/core';

/**
 * Re-export Client type for convenience
 */
export type { Client } from '@lspeasy/core';

/**
 * LSP Client options
 */
export interface ClientOptions<
  ClientCaps extends Partial<ClientCapabilities> = ClientCapabilities
> {
  /**
   * Client identification (sent in initialize request)
   */
  name?: string;

  /**
   * Client version
   */
  version?: string;

  /**
   * Client capabilities to advertise
   */
  capabilities?: ClientCaps;

  /**
   * Logger instance for client logging
   */
  logger?: Logger;

  /**
   * Log level for built-in console logger
   */
  logLevel?: LogLevel;

  /**
   * Default request timeout in milliseconds for outgoing requests
   */
  requestTimeout?: number;

  /**
   * Callback for response validation errors
   */
  onValidationError?: (error: ZodError, response: ResponseMessage) => void;
}

/**
 * Initialize result from server
 */
export interface InitializeResult {
  capabilities: import('vscode-languageserver-protocol').ServerCapabilities;
  serverInfo?: {
    name: string;
    version?: string;
  };
}

/**
 * Cancellable request result
 */
export interface CancellableRequest<T> {
  /**
   * Promise that resolves with the request result
   */
  promise: Promise<T>;

  /**
   * Function to cancel the request
   */
  cancel: () => void;
}
