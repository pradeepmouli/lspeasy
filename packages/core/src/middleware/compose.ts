import type { Middleware, MiddlewareResult } from './types.js';

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
