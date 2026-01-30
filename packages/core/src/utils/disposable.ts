/**
 * Disposable interface for resource cleanup
 * Pattern: MCP SDK's disposable pattern
 */

/**
 * Represents a disposable resource that can be cleaned up
 */
export interface Disposable {
  dispose(): void;
}

/**
 * Store for managing multiple disposables
 */
export class DisposableStore implements Disposable {
  private disposables: Disposable[] = [];
  private disposed = false;

  /**
   * Add a disposable to the store
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
