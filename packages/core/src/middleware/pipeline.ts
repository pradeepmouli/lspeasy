import type { Middleware, MiddlewareContext, MiddlewareResult, ScopedMiddleware } from './types.js';
import { isScopedMiddleware, matchesFilter } from './scoped.js';

type MiddlewareRegistration = Middleware | ScopedMiddleware;

function getMessageId(message: MiddlewareContext['message']): string | number | null | undefined {
  if ('id' in message) {
    return message.id;
  }
  return undefined;
}

function assertMessageIdUnchanged(
  before: string | number | null | undefined,
  context: MiddlewareContext
): void {
  const after = getMessageId(context.message);
  if (before !== after) {
    throw new Error('Middleware cannot modify JSON-RPC message id');
  }
}

function getMiddleware(registration: MiddlewareRegistration): Middleware {
  if (isScopedMiddleware(registration)) {
    return registration.middleware;
  }
  return registration;
}

function shouldRun(registration: MiddlewareRegistration, context: MiddlewareContext): boolean {
  if (!isScopedMiddleware(registration)) {
    return true;
  }

  return matchesFilter(registration.filter, {
    method: context.method,
    direction: context.direction,
    messageType: context.messageType
  });
}

/**
 * Runs the registered middleware chain for a single JSON-RPC message, then
 * calls `finalHandler` if no middleware short-circuits.
 *
 * @remarks
 * This is the core dispatch loop used by `LSPClient` and `LSPServer`. Each
 * middleware receives `context` and a `next` callback; calling `next()` hands
 * control to the following middleware. If a middleware returns a result with
 * `shortCircuit: true` the remaining middleware and `finalHandler` are skipped.
 *
 * Scoped middleware (created with `createScopedMiddleware`) is automatically
 * filtered: it only executes when `matchesFilter` returns `true` for the
 * current message.
 *
 * @param registrations - The list of middleware or scoped-middleware to run.
 * @param context - The shared context for the current message.
 * @param finalHandler - The handler to call after all middleware have run.
 * @returns The result of the first short-circuiting middleware, or the result
 *   of `finalHandler`.
 *
 * @category Middleware
 */
export async function executeMiddlewarePipeline(
  registrations: MiddlewareRegistration[] | undefined,
  context: MiddlewareContext,
  finalHandler: () => Promise<void | MiddlewareResult>
): Promise<void | MiddlewareResult> {
  const entries = registrations ?? [];
  if (entries.length === 0) {
    return finalHandler();
  }

  const dispatch = async (index: number): Promise<void | MiddlewareResult> => {
    if (index >= entries.length) {
      return finalHandler();
    }

    const registration = entries[index];
    if (!registration || !shouldRun(registration, context)) {
      return dispatch(index + 1);
    }

    const middleware = getMiddleware(registration);
    const messageIdBefore = getMessageId(context.message);
    const result = await middleware(context, () => dispatch(index + 1));
    assertMessageIdUnchanged(messageIdBefore, context);

    if (result?.shortCircuit) {
      return result;
    }

    return result;
  };

  return dispatch(0);
}
