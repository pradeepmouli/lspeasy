import type {
  LSPMethod,
  ScopedMiddleware,
  TypedMiddleware,
  TypedMiddlewareContext,
  TypedParams,
  TypedResult
} from './types.js';
import { createScopedMiddleware } from './scoped.js';

/**
 * Creates a typed, method-scoped middleware with full TypeScript inference for
 * the message params and result.
 *
 * @remarks
 * `createTypedMiddleware` is the ergonomic alternative to `createScopedMiddleware`
 * when you want both method filtering and typed access to `context.params` and
 * `context.result`. The method literal is used at the type level to narrow the
 * context object, so no casting is required inside the middleware body.
 *
 * @param method - The exact LSP method string to intercept (e.g. `'textDocument/hover'`).
 * @param middleware - The typed middleware function to run for that method.
 * @returns A {@link ScopedMiddleware} filtered to the given method.
 *
 * @example
 * ```ts
 * import { createTypedMiddleware } from '@lspeasy/core';
 *
 * const hoverMiddleware = createTypedMiddleware(
 *   'textDocument/hover',
 *   async (ctx, next) => {
 *     // ctx.params is typed as HoverParams
 *     console.log('hover at', ctx.params.position);
 *     return next();
 *   }
 * );
 * ```
 *
 * @category Middleware
 */
export function createTypedMiddleware<M extends LSPMethod>(
  method: M,
  middleware: TypedMiddleware<M>
): ScopedMiddleware {
  return createScopedMiddleware({ methods: [method] }, async (context, next) => {
    const typedContextBase = {
      ...context,
      method,
      params: ('params' in context.message ? context.message.params : undefined) as TypedParams<M>
    };

    const typedContext: TypedMiddlewareContext<M> =
      'result' in context.message
        ? {
            ...typedContextBase,
            result: context.message.result as TypedResult<M>
          }
        : typedContextBase;

    return middleware(typedContext, next);
  });
}
