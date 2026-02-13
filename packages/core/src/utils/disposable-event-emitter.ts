/**
 * Disposable, typed event emitter with deterministic cleanup.
 */

import type { Disposable } from './disposable.js';
// Type-only import for API parity reference with Node EventEmitter
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Type reference only
import type { EventEmitter } from 'node:events';

type Listener<TEvents extends Record<string, unknown[]>, K extends keyof TEvents> = (
  ...args: TEvents[K]
) => void;

/**
 * Event emitter that returns disposables and can dispose all listeners at once.
 */
export class DisposableEventEmitter<TEvents extends Record<string, unknown[]>> {
  private listeners = new Map<keyof TEvents, Set<(...args: unknown[]) => void>>();
  private disposed = false;

  /**
   * Register a listener and receive a disposable to unregister it.
   */
  on<K extends keyof TEvents>(event: K, listener: Listener<TEvents, K>): Disposable {
    if (this.disposed) {
      return { dispose: () => undefined };
    }

    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }

    set.add(listener as (...args: unknown[]) => void);

    return {
      dispose: () => {
        const current = this.listeners.get(event);
        if (!current) {
          return;
        }
        current.delete(listener as (...args: unknown[]) => void);
        if (current.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  /**
   * Register a one-time listener that automatically unregisters after first emission.
   */
  once<K extends keyof TEvents>(event: K, listener: Listener<TEvents, K>): Disposable {
    if (this.disposed) {
      return { dispose: () => undefined };
    }

    let disposed = false;
    const wrappedListener = (...args: TEvents[K]) => {
      if (disposed) {
        return;
      }
      disposed = true;
      disposable.dispose();
      listener(...args);
    };

    const disposable = this.on(event, wrappedListener as Listener<TEvents, K>);

    return {
      dispose: () => {
        if (disposed) {
          return;
        }
        disposed = true;
        disposable.dispose();
      }
    };
  }

  /**
   * Emit an event to all registered listeners in registration order.
   */
  emit<K extends keyof TEvents>(event: K, ...args: TEvents[K]): void {
    if (this.disposed) {
      return;
    }

    const set = this.listeners.get(event);
    if (!set || set.size === 0) {
      return;
    }

    for (const listener of Array.from(set)) {
      (listener as Listener<TEvents, K>)(...args);
    }
  }

  /**
   * Dispose all listeners and prevent further registrations.
   */
  dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    this.listeners.clear();
  }
}
