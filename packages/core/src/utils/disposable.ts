/**
 * Disposable interface for resource cleanup
 * Pattern: MCP SDK's disposable pattern
 */

/**
 * Represents a resource that can be explicitly released.
 *
 * @remarks
 * Every subscription, handler registration, and event listener in lspeasy
 * returns a `Disposable`. Call `.dispose()` to unsubscribe and free memory.
 * Use `DisposableStore` to collect and dispose multiple resources at once.
 *
 * @category Lifecycle
 */
export interface Disposable {
  dispose(): void;
}

/**
 * Collects multiple `Disposable` instances and releases them together.
 *
 * @remarks
 * Ideal for managing handler registrations on a server that should all be
 * torn down when a document is closed or a feature is disabled.
 * Once `dispose()` is called on the store, any further `add()` calls
 * immediately dispose the item rather than storing it.
 *
 * @useWhen
 * You register multiple handlers (hover, completion, definition) that share
 * the same lifetime — collect them all into one store and dispose the store
 * on shutdown or feature toggle.
 *
 * @example
 * ```ts
 * import { DisposableStore } from '@lspeasy/core';
 * import { LSPServer } from '@lspeasy/server';
 *
 * const server = new LSPServer();
 * const disposables = new DisposableStore();
 *
 * disposables.add(server.onRequest('textDocument/hover', handleHover));
 * disposables.add(server.onRequest('textDocument/completion', handleCompletion));
 *
 * // Later — unregister all handlers at once
 * disposables.dispose();
 * ```
 *
 * @category Lifecycle
 */
export class DisposableStore implements Disposable {
  private disposables: Disposable[] = [];
  private disposed = false;

  /**
   * Add a disposable to the store.
   *
   * @param disposable - The resource to track. If the store is already disposed,
   *   `disposable.dispose()` is called immediately.
   * @returns The same `disposable` passed in, for fluent chaining.
   */
  add<T extends Disposable>(disposable: T): T {
    if (this.disposed) {
      disposable.dispose();
    } else {
      this.disposables.push(disposable);
    }
    return disposable;
  }

  /**
   * Dispose all resources in the store
   */
  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;

    // Dispose in reverse order
    while (this.disposables.length > 0) {
      const disposable = this.disposables.pop()!;
      try {
        disposable.dispose();
      } catch (error) {
        console.error('Error disposing resource:', error);
      }
    }
  }

  /**
   * Check if store is disposed
   */
  isDisposed(): boolean {
    return this.disposed;
  }

  /**
   * Clear all disposables without disposing them
   */
  clear(): void {
    this.disposables = [];
  }
}
