/**
 * Handler registry with method-based lookup and cleanup support.
 */

import type { Disposable } from './disposable.js';

/**
 * Handler function type.
 */
export type Handler<TRequest, TResponse, TRest extends unknown[] = []> = (
  params: TRequest,
  ...rest: TRest
) => Promise<TResponse> | TResponse;

/**
 * Registry for request/notification handlers keyed by method.
 */
export class HandlerRegistry<TRequest, TResponse, TRest extends unknown[] = []> {
  private handlers = new Map<string, Handler<TRequest, TResponse, TRest>>();
  private categories = new Map<string, Set<string>>();

  /**
   * Register a handler for the given method.
   */
  register(method: string, handler: Handler<TRequest, TResponse, TRest>): Disposable {
    this.handlers.set(method, handler);
    this.addCategory(method);

    return {
      dispose: () => {
        this.unregister(method);
      }
    };
  }

  /**
   * Unregister a handler.
   */
  unregister(method: string): void {
    if (this.handlers.delete(method)) {
      this.removeCategory(method);
    }
  }

  /**
   * Get a handler by method.
   */
  get(method: string): Handler<TRequest, TResponse, TRest> | undefined {
    return this.handlers.get(method);
  }

  /**
   * Clear all handlers.
   */
  clear(): void {
    this.handlers.clear();
    this.categories.clear();
  }

  private addCategory(method: string): void {
    const prefix = this.getPrefix(method);
    let methods = this.categories.get(prefix);
    if (!methods) {
      methods = new Set();
      this.categories.set(prefix, methods);
    }
    methods.add(method);
  }

  private removeCategory(method: string): void {
    const prefix = this.getPrefix(method);
    const methods = this.categories.get(prefix);
    if (!methods) {
      return;
    }
    methods.delete(method);
    if (methods.size === 0) {
      this.categories.delete(prefix);
    }
  }

  private getPrefix(method: string): string {
    const index = method.indexOf('/');
    return index === -1 ? method : method.slice(0, index);
  }
}
