/**
 * Type definitions for LSP Client
 */

import type { Logger, LogLevel } from '@lspy/core';
import type { ZodError } from 'zod';
import type { ResponseMessage } from '@lspy/core';

/**
 * LSP Client options
 */
export interface ClientOptions {
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
  capabilities?: import('vscode-languageserver-protocol').ClientCapabilities;

  /**
   * Logger instance for client logging
   */
  logger?: Logger;

  /**
   * Log level for built-in console logger
   */
  logLevel?: LogLevel;

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
