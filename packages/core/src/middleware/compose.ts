import type { Middleware, MiddlewareResult } from './types.js';

/**
 * Combines multiple middleware functions into a single middleware that runs
 * them left-to-right, each delegating to the next via `next()`.
 *
 * @remarks
 * Use `composeMiddleware` when you have a set of independent middleware that
 * you want to treat as a single unit — for example, bundling a logger and a
 * tracer into one reusable package middleware.
 *
 * @param middlewares - The middleware functions to compose, in execution order.
 * @returns A single middleware that chains all provided middlewares.
 *
 * @example
 * ```ts
 * import { composeMiddleware } from '@lspeasy/core';
 *
 * const bundled = composeMiddleware(loggerMiddleware, tracingMiddleware);
 * const server = new LSPServer({ middleware: [bundled] });
 * ```
 *
 * @category Middleware
 */
export function composeMiddleware(...middlewares: Middleware[]): Middleware {
  return async (context, next): Promise<void | MiddlewareResult> => {
    const dispatch = async (index: number): Promise<void | MiddlewareResult> => {
      if (index >= middlewares.length) {
        return next();
      }

      const middleware = middlewares[index];
      if (!middleware) {
        return next();
      }

      return middleware(context, () => dispatch(index + 1));
    };

    return dispatch(0);
  };
}
