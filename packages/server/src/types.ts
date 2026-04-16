/**
 * Type definitions for @lspeasy/server
 */

import type {
  CancellationToken,
  Logger,
  ClientCapabilities,
  Server,
  DidOpenNotebookDocumentParams,
  DidChangeNotebookDocumentParams,
  DidSaveNotebookDocumentParams,
  DidCloseNotebookDocumentParams,
  LogLevel,
  ServerCapabilities,
  Middleware,
  ScopedMiddleware
} from '@lspeasy/core';
import type { ZodError } from 'zod';
import type { ResponseErrorInterface } from '@lspeasy/core';

/**
 * Re-export Server type for convenience
 */
export type { Server } from '@lspeasy/core';

/**
 * Configuration for an `LSPServer` instance.
 *
 * @remarks
 * Passed to the `LSPServer` constructor. All fields are optional; the server
 * works with zero configuration and sensible defaults.
 *
 * @config
 * @category Server
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
   * Default request timeout in milliseconds for server-initiated requests
   */
  requestTimeout?: number;

  /**
   * Custom validation error handler
   */
  onValidationError?: (
    error: ZodError,
    message: RequestContext | NotificationContext
  ) => ResponseErrorInterface | void;

  /**
   * Enable parameter validation for requests and notifications
   * Defaults to true
   */
  validateParams?: boolean;

  /**
   * Capabilities to declare during initialization
   */

  capabilities?: Capabilities;
  /**
   * Strict capability checking mode
   * When true, throws error if handler registered for unsupported capability
   * When false, logs warning and allows registration (default: false)
   */
  strictCapabilities?: boolean;

  /**
   * Optional middleware chain for clientToServer/serverToClient messages.
   */
  middleware?: Array<Middleware | ScopedMiddleware>;
}

/**
 * Context provided to request handlers alongside params and the cancellation token.
 *
 * @remarks
 * Use `id` for correlating log entries to specific requests, and
 * `clientCapabilities` to conditionally include capability-dependent data in
 * the response (e.g. include `commitCharacters` only when the client supports
 * `completionItem.commitCharactersSupport`).
 *
 * @category Handler
 */
export interface RequestContext {
  /**
   * JSON-RPC request ID for correlation.
   *
   * @remarks
   * May be a `string` or a `number` — never coerce to integer.
   */
  id: number | string;

  /**
   * LSP method string, e.g. `'textDocument/hover'`.
   */
  method: string;

  /**
   * Client capabilities received during `initialize`.
   * Available after the first `initialize` request.
   */
  clientCapabilities?: ClientCapabilities | undefined;
}

/**
 * Context provided to notification handlers alongside params.
 *
 * @category Handler
 */
export interface NotificationContext {
  /**
   * LSP method string, e.g. `'textDocument/didOpen'`.
   */
  method: string;

  /**
   * Client capabilities received during `initialize`.
   * Available after the `initialize` handshake.
   */
  clientCapabilities?: ClientCapabilities | undefined;
}

/**
 * Signature for LSP request handlers registered via `LSPServer.onRequest`.
 *
 * @remarks
 * Handlers are async by default — returning `Promise<Result>` is fine.
 * Throw a `ResponseError` to send a structured JSON-RPC error response.
 * Throw any other `Error` to send a generic `-32603 InternalError` response.
 *
 * Check `token.isCancellationRequested` at async yield points to stop
 * early when the client sends `$/cancelRequest`.
 *
 * @pitfalls
 * NEVER call `server.close()` or `server.shutdown()` from inside a handler —
 * the server is processing messages on the transport at that point, and
 * closing the transport from within a handler causes a deadlock: the handler
 * awaits the close, but the close waits for all handlers to finish.
 *
 * NEVER mutate server capabilities inside a handler. Capabilities are
 * negotiated once during `initialize`; changing them at runtime has no effect
 * on the client, which cached the `InitializeResult` at startup.
 *
 * @typeParam Params - The request params type, inferred from the method name.
 * @typeParam Result - The response result type, inferred from the method name.
 * @category Handler
 */
export type RequestHandler<Params = unknown, Result = unknown> = (
  params: Params,
  token: CancellationToken,
  context: RequestContext
) => Promise<Result> | Result;

/**
 * Signature for LSP notification handlers registered via
 * `LSPServer.onNotification`.
 *
 * @remarks
 * Notifications are fire-and-forget — the framework does not wait for the
 * returned promise in any protocol-observable way, but unhandled rejections
 * are forwarded to `server.onError()`.
 *
 * @pitfalls
 * NEVER send a server-to-client notification inside a handler for the LSP
 * `initialize` request. The `initialize` response has not yet been sent at
 * that point; notifications sent before the response are discarded by clients.
 * Use the `initialized` notification handler for post-handshake setup instead.
 *
 * @typeParam Params - The notification params type, inferred from method name.
 * @category Handler
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
 * Lifecycle state of an `LSPServer` instance.
 *
 * @remarks
 * State transitions:
 * `Created` → `Initializing` (on `initialize` request)
 * → `Initialized` (after `initialize` response sent)
 * → `ShuttingDown` (on `shutdown` request)
 * → `Shutdown` (transport closed).
 *
 * Non-lifecycle requests received before `Initialized` are automatically
 * rejected with `ServerNotInitialized (-32002)`.
 *
 * @category Lifecycle
 */
export enum ServerState {
  Created = 'created',
  Initializing = 'initializing',
  Initialized = 'initialized',
  ShuttingDown = 'shutting_down',
  Shutdown = 'shutdown'
}

export interface NotebookDocumentHandlerNamespace {
  onDidOpen(handler: NotificationHandler<DidOpenNotebookDocumentParams>): { dispose(): void };
  onDidChange(handler: NotificationHandler<DidChangeNotebookDocumentParams>): { dispose(): void };
  onDidSave(handler: NotificationHandler<DidSaveNotebookDocumentParams>): { dispose(): void };
  onDidClose(handler: NotificationHandler<DidCloseNotebookDocumentParams>): { dispose(): void };
}
