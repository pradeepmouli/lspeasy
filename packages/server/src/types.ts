/**
 * Type definitions for @lspy/server
 */

import type { CancellationToken, Logger, ClientCapabilities } from '@lspy/core';
import type { ZodError } from 'zod';
import type { ResponseError as ResponseErrorInterface } from '@lspy/core';

/**
 * Server initialization options
 */
export interface ServerOptions {
  /**
   * Server name (sent in initialize response)
   */
  name?: string;

  /**
   * Server version (sent in initialize response)
   */
  version?: string;

  /**
   * Logger instance (defaults to ConsoleLogger)
   */
  logger?: Logger;

  /**
   * Log level (defaults to 'info')
   */
  logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error';

  /**
   * Custom validation error handler
   */
  onValidationError?: (
    error: ZodError,
    context: RequestContext | NotificationContext
  ) => ResponseErrorInterface;
}

/**
 * Context provided to request handlers
 */
export interface RequestContext {
  /**
   * Request ID for correlation
   */
  id: number | string;

  /**
   * Method name
   */
  method: string;

  /**
   * Client capabilities (available after initialization)
   */
  clientCapabilities?: ClientCapabilities | undefined;
}

/**
 * Context provided to notification handlers
 */
export interface NotificationContext {
  /**
   * Method name
   */
  method: string;

  /**
   * Client capabilities (available after initialization)
   */
  clientCapabilities?: ClientCapabilities | undefined;
}

/**
 * Request handler function type
 */
export type RequestHandler<Params = unknown, Result = unknown> = (
  params: Params,
  token: CancellationToken,
  context: RequestContext
) => Promise<Result> | Result;

/**
 * Notification handler function type
 */
export type NotificationHandler<Params = unknown> = (
  params: Params,
  context: NotificationContext
) => void | Promise<void>;

/**
 * Internal handler registry entry
 */
export interface HandlerRegistration {
  handler: RequestHandler<any, any> | NotificationHandler<any>;
  isRequest: boolean;
}

/**
 * Server state enum
 */
export enum ServerState {
  Created = 'created',
  Initializing = 'initializing',
  Initialized = 'initialized',
  ShuttingDown = 'shutting_down',
  Shutdown = 'shutdown'
}
