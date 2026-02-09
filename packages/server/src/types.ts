/**
 * Type definitions for @lspeasy/server
 */

import type {
  CancellationToken,
  Logger,
  ClientCapabilities,
  ServerCapabilities,
  Server,
  LogLevel
} from '@lspeasy/core';
import type { ZodError } from 'zod';
import type { ResponseError as ResponseErrorInterface } from '@lspeasy/core';

/**
 * Re-export Server type for convenience
 */
export type { Server } from '@lspeasy/core';

/**
 * Server initialization options
 */
export interface ServerOptions<
  Capabilities extends Partial<ServerCapabilities> = ServerCapabilities
> {
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
  logLevel?: LogLevel;

  /**
   * Custom validation error handler
   */
  onValidationError?: (
    error: ZodError,
    message: RequestContext | NotificationContext
  ) => ResponseErrorInterface | void;

  /**
   * Strict capability checking mode
   * When true, throws error if handler registered for unsupported capability
   * When false, logs warning and allows registration (default: false)
   */
  strictCapabilities?: boolean;
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
