import type { MethodFilter, Middleware, MiddlewareMessageType, ScopedMiddleware } from './types.js';

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
