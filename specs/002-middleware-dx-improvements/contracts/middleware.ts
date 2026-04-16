/**
 * Middleware System Contracts
 *
 * Type definitions for composable JSON-RPC message interception.
 *
 * @package @lspeasy/core/middleware
 */

/**
 * JSON-RPC message types for middleware inspection
 */
export type JSONRPCMessage = JSONRPCRequest | JSONRPCResponse | JSONRPCNotification | JSONRPCError;

export interface JSONRPCRequest {
  jsonrpc: '2.0';
  readonly id: string | number; // IMMUTABLE - middleware cannot modify
  method: string;
  params?: unknown;
}

export interface JSONRPCResponse {
  jsonrpc: '2.0';
  readonly id: string | number; // IMMUTABLE - middleware cannot modify
  result?: unknown;
}

export interface JSONRPCNotification {
  jsonrpc: '2.0';
  method: string;
  params?: unknown;
}

export interface JSONRPCError {
  jsonrpc: '2.0';
  readonly id: string | number | null; // IMMUTABLE - middleware cannot modify
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
}

/**
 * Middleware context passed to each middleware function
 *
 * Contains message metadata and allows middleware to pass data
 * to subsequent middleware via the `metadata` field.
 */
export interface MiddlewareContext {
  /**
   * Message flow direction
   *
   * - clientToServer: Messages from client to server (e.g., textDocument/hover request)
   * - serverToClient: Messages from server to client (e.g., textDocument/publishDiagnostics notification)
   */
  direction: 'clientToServer' | 'serverToClient';

  /**
   * JSON-RPC message type
   */
  messageType: 'request' | 'response' | 'notification' | 'error';

  /**
   * LSP method name (e.g., 'textDocument/hover')
   *
   * For responses and errors, this is the originating request method.
   */
  method: string;

  /**
   * The full JSON-RPC message
   *
   * Note: The `id` field is readonly and cannot be modified.
   */
  message: JSONRPCMessage;

  /**
   * Arbitrary metadata for middleware communication
   *
   * Middleware can write to this object to pass data to subsequent middleware.
   * Example: `{ startTime: Date.now() }` for timing middleware.
   */
  metadata: Record<string, unknown>;

  /**
   * Transport identifier
   *
   * Example: 'websocket:ws://localhost:3000', 'stdio', 'ipc'
   */
  transport: string;
}

/**
 * Callback to invoke the next middleware in the chain
 *
 * If this is the last middleware, invokes the actual message handler.
 */
export type MiddlewareNext = () => Promise<void | MiddlewareResult>;

/**
 * Optional return value from middleware
 *
 * Allows middleware to short-circuit the pipeline or override responses.
 */
export interface MiddlewareResult {
  /**
   * If true, stop executing remaining middleware and return early
   */
  shortCircuit?: boolean;

  /**
   * Override response (for caching, mocking, etc.)
   *
   * If provided, this response is sent directly without invoking the handler.
   */
  response?: JSONRPCMessage;

  /**
   * Return error without invoking handler
   *
   * Useful for validation middleware that rejects requests early.
   */
  error?: JSONRPCError;
}

/**
 * Middleware function signature
 *
 * Middleware executes in registration order for outbound messages,
 * and in reverse order for inbound messages (onion model).
 *
 * @example
 * ```typescript
 * const loggingMiddleware: Middleware = async (context, next) => {
 *   console.log(`-> ${context.method}`);
 *   await next();
 *   console.log(`<- ${context.method}`);
 * };
 * ```
 *
 * @example Short-circuit example
 * ```typescript
 * const cacheMiddleware: Middleware = async (context, next) => {
 *   if (context.direction === 'outbound' && cache.has(context.method)) {
 *     return {
 *       shortCircuit: true,
 *       response: cache.get(context.method)
 *     };
 *   }
 *   return next();
 * };
 * ```
 */
export type Middleware = (
  context: MiddlewareContext,
  next: MiddlewareNext
) => Promise<void | MiddlewareResult>;

/**
 * Method filter configuration for scoped middleware
 *
 * Allows middleware to apply only to specific methods or patterns.
 */
export interface MethodFilter {
  /**
   * LSP methods to match
   *
   * - String array: exact matches (e.g., ['textDocument/hover'])
   * - RegExp: pattern matches (e.g., /^textDocument\//)
   */
  methods: string[] | RegExp;

  /**
   * Optional direction filter
   *
   * - clientToServer: Only apply to messages from client to server
   * - serverToClient: Only apply to messages from server to client
   * - both: Apply to messages in either direction
   *
   * @default 'both'
   */
  direction?: 'clientToServer' | 'serverToClient' | 'both';

  /**
   * Optional message type filter
   *
   * If omitted, applies to all message types.
   */
  messageType?: ('request' | 'response' | 'notification' | 'error')[];
}

/**
 * Method-scoped middleware with filter
 */
export interface ScopedMiddleware {
  filter: MethodFilter;
  middleware: Middleware;
}

/**
 * Strongly-typed middleware context for method-specific middleware
 *
 * Provides type inference for params and result based on LSP method.
 */
export interface TypedMiddlewareContext<M extends string> extends MiddlewareContext {
  /**
   * Narrowed method type (literal type)
   */
  method: M;

  /**
   * Typed parameters (inferred from LSP method)
   *
   * For requests: request parameters
   * For notifications: notification parameters
   * For responses/errors: undefined
   */
  params?: unknown; // Will be properly typed in implementation

  /**
   * Typed result (inferred from LSP method)
   *
   * Only available for inbound responses.
   */
  result?: unknown; // Will be properly typed in implementation
}

/**
 * Typed middleware function for a specific LSP method
 *
 * @example
 * ```typescript
 * import type { HoverParams, Hover } from 'vscode-languageserver-protocol';
 *
 * const hoverMiddleware: TypedMiddleware<'textDocument/hover'> = async (context, next) => {
 *   // context.params is typed as HoverParams
 *   // context.result (in response) is typed as Hover | null
 *   console.log('Hover at position:', context.params?.position);
 *   await next();
 * };
 * ```
 */
export type TypedMiddleware<M extends string> = (
  context: TypedMiddlewareContext<M>,
  next: MiddlewareNext
) => Promise<void | MiddlewareResult>;

/**
 * Factory for creating typed middleware with method inference
 *
 * @example
 * ```typescript
 * const hoverMiddleware = createTypedMiddleware('textDocument/hover', async (context, next) => {
 *   // context.params is automatically typed as HoverParams
 *   console.log('Hover request:', context.params);
 *   await next();
 * });
 * ```
 */
export function createTypedMiddleware<M extends string>(
  method: M,
  handler: TypedMiddleware<M>
): ScopedMiddleware;

/**
 * Factory for creating method-scoped middleware with filter
 *
 * @example
 * ```typescript
 * const textDocumentMiddleware = createScopedMiddleware(
 *   { methods: /^textDocument\//, direction: 'outbound' },
 *   async (context, next) => {
 *     console.log('Text document method:', context.method);
 *     await next();
 *   }
 * );
 * ```
 */
export function createScopedMiddleware(
  filter: MethodFilter,
  middleware: Middleware
): ScopedMiddleware;

/**
 * Middleware options for client/server construction
 */
export interface MiddlewareOptions {
  /**
   * Array of middleware functions to apply
   *
   * Middleware executes in registration order for outbound messages,
   * and in reverse order for inbound messages.
   *
   * Can include:
   * - Global middleware (applies to all messages)
   * - Scoped middleware (applies to specific methods via filter)
   *
   * @default []
   *
   * @example
   * ```typescript
   * {
   *   middleware: [
   *     loggingMiddleware,  // Global
   *     createScopedMiddleware(
   *       { methods: /^textDocument\// },
   *       textDocumentTimingMiddleware
   *     ),  // Scoped to textDocument/* methods
   *   ]
   * }
   * ```
   */
  middleware?: (Middleware | ScopedMiddleware)[];
}

/**
 * Utility to compose multiple middleware into a single middleware
 *
 * @example
 * ```typescript
 * const combined = composeMiddleware(logging, timing, validation);
 * ```
 */
export function composeMiddleware(...middlewares: Middleware[]): Middleware;
