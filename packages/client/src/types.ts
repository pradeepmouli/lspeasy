/**
 * Type definitions for LSP Client
 */

import type {
  Client,
  ClientCapabilities,
  DynamicRegistrationBehavior,
  DidOpenNotebookDocumentParams,
  DidChangeNotebookDocumentParams,
  DidSaveNotebookDocumentParams,
  DidCloseNotebookDocumentParams,
  PartialRequestOutcome,
  Logger,
  LogLevel,
  Middleware,
  ScopedMiddleware
} from '@lspeasy/core';
import type { ZodError } from 'zod';
import type { ResponseMessage } from '@lspeasy/core';
import type { HeartbeatConfig } from './connection/types.js';

/**
 * Re-export Client type for convenience
 */
export type { Client } from '@lspeasy/core';

/**
 * Configuration for an `LSPClient` instance.
 *
 * @remarks
 * Passed to the `LSPClient` constructor. All fields are optional; the client
 * works with zero configuration.
 *
 * @config
 * @category Client
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
   * Strict capability checking mode
   * When true, throws error if handler registered or request sent for unsupported capability
   * When false, logs warning and allows registration/sending (default: false)
   */
  strictCapabilities?: boolean;

  /**
   * Optional middleware chain for clientToServer/serverToClient messages.
   */
  middleware?: Array<Middleware | ScopedMiddleware>;

  /**
   * Optional heartbeat configuration (disabled by default).
   */
  heartbeat?: HeartbeatConfig;

  /**
   * Behavior controls for server-driven dynamic registration.
   */
  dynamicRegistration?: DynamicRegistrationBehavior;

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
 * Return value of `LSPClient.sendCancellableRequest`.
 *
 * @remarks
 * `promise` rejects with a cancellation error when `cancel()` is called.
 * Always attach a `.catch()` handler to `promise` before calling `cancel()`
 * to avoid unhandled promise rejections.
 *
 * @typeParam T - The expected response result type.
 * @category Client
 */
export interface CancellableRequest<T> {
  /**
   * Promise that resolves with the request result or rejects on cancellation.
   */
  promise: Promise<T>;

  /**
   * Cancels the in-flight request and sends `$/cancelRequest` to the server.
   */
  cancel: () => void;
}

/**
 * Options for `LSPClient.sendRequestWithPartialResults`.
 *
 * @config
 * @typeParam TPartial - The partial result element type.
 * @category Client
 */
export interface PartialRequestOptions<TPartial> {
  /**
   * Custom `partialResultToken` value; auto-generated when omitted.
   */
  token?: string | number;
  /**
   * Called for each `$/progress` notification carrying a partial result.
   */
  onPartial: (partial: TPartial) => void;
}

/**
 * Result returned by partial-result enabled requests.
 */
export type PartialRequestResult<TPartial, TResult> = PartialRequestOutcome<TPartial, TResult>;

/**
 * Namespace for sending notebook-document lifecycle notifications to a server.
 *
 * @remarks
 * Available on `client.notebookDocument` after `connect()`. Mirrors the
 * standard LSP `notebookDocument/*` notification methods for clients that
 * declare `notebookDocumentSync` capability.
 *
 * @category Client
 */
export interface NotebookDocumentNamespace {
  /** Notify the server that a notebook document was opened. */
  didOpen(params: DidOpenNotebookDocumentParams): Promise<void>;
  /** Notify the server that a notebook document changed. */
  didChange(params: DidChangeNotebookDocumentParams): Promise<void>;
  /** Notify the server that a notebook document was saved. */
  didSave(params: DidSaveNotebookDocumentParams): Promise<void>;
  /** Notify the server that a notebook document was closed. */
  didClose(params: DidCloseNotebookDocumentParams): Promise<void>;
}
