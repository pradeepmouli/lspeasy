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
