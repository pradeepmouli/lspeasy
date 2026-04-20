import type { MethodFilter, Middleware, MiddlewareMessageType, ScopedMiddleware } from './types.js';

/**
 * Wraps a middleware with a filter so it only runs for matching LSP messages.
 *
 * @remarks
 * Prefer this over putting an `if (context.method === '...')` guard inside
 * your middleware — scoped middleware is skipped before the function is even
 * called, which keeps the pipeline overhead low.
 *
 * @param filter - A {@link MethodFilter} describing which messages to intercept.
 * @param middleware - The middleware function to run when the filter matches.
 * @returns A {@link ScopedMiddleware} object ready to pass to `ServerOptions.middleware`
 *   or `ClientOptions.middleware`.
 *
 * @example
 * ```ts
 * import { createScopedMiddleware } from '@lspeasy/core';
 *
 * const hoverLogger = createScopedMiddleware(
 *   { methods: ['textDocument/hover'], direction: 'clientToServer' },
 *   async (ctx, next) => {
 *     console.log('hover params:', ctx.message);
 *     return next();
 *   }
 * );
 * ```
 *
 * @category Middleware
 */
export function createScopedMiddleware(
  filter: MethodFilter,
  middleware: Middleware
): ScopedMiddleware {
  return { filter, middleware };
}

export function isScopedMiddleware(
  value: Middleware | ScopedMiddleware
): value is ScopedMiddleware {
  return typeof value === 'object' && value !== null && 'middleware' in value && 'filter' in value;
}

export function matchesFilter(
  filter: MethodFilter,
  context: {
    method: string;
    direction: 'clientToServer' | 'serverToClient';
    messageType: MiddlewareMessageType;
  }
): boolean {
  const direction = filter.direction ?? 'both';
  if (direction !== 'both' && direction !== context.direction) {
    return false;
  }

  if (filter.messageType && !filter.messageType.includes(context.messageType)) {
    return false;
  }

  if (Array.isArray(filter.methods)) {
    return filter.methods.includes(context.method);
  }

  return filter.methods.test(context.method);
}
