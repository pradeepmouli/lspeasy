import type {
  ErrorResponseMessage,
  Message,
  NotificationMessage,
  RequestMessage,
  ResponseMessage
} from '../jsonrpc/messages.js';
import type {
  LSPNotificationMethod,
  LSPRequestMethod,
  ParamsForNotification,
  ParamsForRequest,
  ResultForRequest
} from '../protocol/infer.js';

/**
 * Direction of a JSON-RPC message in the middleware pipeline.
 *
 * @category Middleware
 */
export type MiddlewareDirection = 'clientToServer' | 'serverToClient';

/**
 * Kind of JSON-RPC message flowing through middleware.
 *
 * @category Middleware
 */
export type MiddlewareMessageType = 'request' | 'response' | 'notification' | 'error';

type ImmutableId<T> = T extends { id: infer I } ? Omit<T, 'id'> & { readonly id: I } : T;

/**
 * The JSON-RPC message exposed to middleware, with `id` made read-only to
 * prevent accidental mutation that would break response correlation.
 *
 * @category Middleware
 */
export type MiddlewareMessage = ImmutableId<Message>;

/**
 * Execution context passed to every middleware function in the pipeline.
 *
 * @remarks
 * `metadata` is a mutable bag-of-properties that middleware can use to pass
 * data to downstream middleware or to the final handler. It is scoped to a
 * single message and discarded after the pipeline completes.
 *
 * @category Middleware
 */
export interface MiddlewareContext {
  /** Whether this message travels from client-to-server or server-to-client. */
  direction: MiddlewareDirection;
  /** The kind of JSON-RPC message. */
  messageType: MiddlewareMessageType;
  /** The LSP method string, e.g. `'textDocument/hover'`. */
  method: string;
  /** The raw JSON-RPC message (id is read-only). */
  message: MiddlewareMessage;
  /** Arbitrary key-value pairs for cross-middleware communication. */
  metadata: Record<string, unknown>;
  /** Constructor name of the active transport, e.g. `'StdioTransport'`. */
  transport: string;
}

/**
 * Union of all LSP request and notification method strings.
 *
 * @category Middleware
 */
export type LSPMethod = LSPRequestMethod | LSPNotificationMethod;

/**
 * Infers the params type for a given LSP method.
 *
 * @typeParam M - An LSP request or notification method string.
 * @category Middleware
 */
export type TypedParams<M extends LSPMethod> = M extends LSPRequestMethod
  ? ParamsForRequest<M>
  : M extends LSPNotificationMethod
    ? ParamsForNotification<M>
    : never;

/**
 * Infers the result type for a given LSP method (void for notifications).
 *
 * @typeParam M - An LSP request or notification method string.
 * @category Middleware
 */
export type TypedResult<M extends LSPMethod> = M extends LSPRequestMethod
  ? ResultForRequest<M>
  : void;

/**
 * Typed middleware context narrowed to a specific LSP method.
 * Use with `createTypedMiddleware` for full type inference.
 *
 * @typeParam M - The specific LSP method this middleware handles.
 * @category Middleware
 */
export interface TypedMiddlewareContext<M extends LSPMethod> extends MiddlewareContext {
  method: M;
  params: TypedParams<M>;
  result?: TypedResult<M>;
}

/**
 * The return value from a middleware function.
 *
 * @remarks
 * Return `undefined` or `void` to continue the pipeline normally.
 * Set `shortCircuit: true` (plus `response` or `error`) to bypass all
 * remaining middleware and the final handler.
 *
 * @never
 * NEVER short-circuit a request without providing a valid `response` or
 * `error` — the pending request will never resolve and the client will time
 * out with no recourse.
 *
 * @category Middleware
 */
export interface MiddlewareResult {
  shortCircuit?: boolean;
  response?: ResponseMessage | RequestMessage | NotificationMessage;
  error?: ErrorResponseMessage;
}

/**
 * Calls the next middleware (or final handler) in the pipeline.
 *
 * @category Middleware
 */
export type MiddlewareNext = () => Promise<void | MiddlewareResult>;

/**
 * A function that intercepts JSON-RPC messages flowing through `LSPServer`
 * or `LSPClient`.
 *
 * @remarks
 * Middleware follows the `async (context, next) => result` pattern familiar
 * from Express / Koa. Call `next()` to continue the pipeline; return a
 * `MiddlewareResult` with `shortCircuit: true` to bypass remaining handlers.
 *
 * @useWhen
 * You need cross-cutting behavior across all (or a subset of) LSP messages:
 * logging, tracing, authentication, rate-limiting, schema validation, or
 * request mocking in tests.
 *
 * @avoidWhen
 * You need to handle only a single method — register a dedicated
 * `onRequest` / `onNotification` handler instead. Middleware adds overhead
 * for every message regardless of method.
 *
 * @never
 * NEVER mutate `context.message.id` — it is read-only by design. Response
 * correlation depends on the ID remaining stable through the pipeline.
 *
 * NEVER `await next()` more than once per middleware invocation. The pipeline
 * is not re-entrant; calling `next()` twice dispatches the underlying handler
 * twice, producing duplicate responses or side effects.
 *
 * @example
 * ```ts
 * import type { Middleware } from '@lspeasy/core';
 *
 * const timingMiddleware: Middleware = async (context, next) => {
 *   const start = Date.now();
 *   const result = await next();
 *   console.log(`${context.method} took ${Date.now() - start}ms`);
 *   return result;
 * };
 *
 * const server = new LSPServer({ middleware: [timingMiddleware] });
 * ```
 *
 * @category Middleware
 */
export type Middleware = (
  context: MiddlewareContext,
  next: MiddlewareNext
) => Promise<void | MiddlewareResult>;

/**
 * A middleware function narrowed to a specific LSP method with full type
 * inference for `params` and `result`.
 *
 * @remarks
 * Create with `createTypedMiddleware` to avoid manual generic parameters.
 *
 * @typeParam M - The LSP method string this middleware is scoped to.
 * @category Middleware
 */
export type TypedMiddleware<M extends LSPMethod> = (
  context: TypedMiddlewareContext<M>,
  next: MiddlewareNext
) => Promise<void | MiddlewareResult>;

/**
 * Filter predicate used by `ScopedMiddleware` to select which messages
 * a middleware should intercept.
 *
 * @category Middleware
 */
export interface MethodFilter {
  /** Method names or a regex to match against `context.method`. */
  methods: string[] | RegExp;
  /** Limit to a specific direction, or `'both'` (default). */
  direction?: MiddlewareDirection | 'both';
  /** Limit to specific message kinds. */
  messageType?: MiddlewareMessageType[];
}

/**
 * A `Middleware` paired with a `MethodFilter` so it only runs for matching
 * messages.
 *
 * @remarks
 * Create with `createScopedMiddleware` for a more ergonomic API.
 *
 * @useWhen
 * You want a middleware that only fires for a specific method (e.g. only
 * `textDocument/completion`) without writing the guard inside the middleware
 * body itself.
 *
 * @example
 * ```ts
 * import { createScopedMiddleware } from '@lspeasy/core';
 *
 * const completionLogger = createScopedMiddleware(
 *   { methods: ['textDocument/completion'], direction: 'clientToServer' },
 *   async (ctx, next) => {
 *     console.log('completion request params:', ctx.message);
 *     return next();
 *   }
 * );
 * ```
 *
 * @category Middleware
 */
export interface ScopedMiddleware {
  filter: MethodFilter;
  middleware: Middleware;
}
