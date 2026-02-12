import type {
  LSPMethod,
  ScopedMiddleware,
  TypedMiddleware,
  TypedMiddlewareContext,
  TypedParams,
  TypedResult
} from './types.js';
import { createScopedMiddleware } from './scoped.js';

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
