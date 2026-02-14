/**
 * Cancellation token implementation
 * Pattern: MCP SDK's CancellationToken and CancellationTokenSource
 */

import { DisposableEventEmitter } from './disposable-event-emitter.js';
import type { Disposable } from './disposable.js';

/**
 * Token that can be used to signal cancellation
 */
export interface CancellationToken {
  /**
   * Check if cancellation has been requested
   */
  readonly isCancellationRequested: boolean;

  /**
   * Register callback to be called when cancellation is requested
   * @returns Disposable to unregister the callback
   */
  onCancellationRequested(callback: () => void): Disposable;
}

type CancellationEventMap = {
  cancelled: [];
};

/**
 * Source that controls a CancellationToken
 */
export class CancellationTokenSource {
  private emitter: DisposableEventEmitter<CancellationEventMap>;
  private cancelled: boolean;
  private readonly _token: CancellationToken;

  constructor() {
    this.emitter = new DisposableEventEmitter();
    this.cancelled = false;

    // Create token with proper arrow function binding
    this._token = {
      isCancellationRequested: false,
      onCancellationRequested: (callback: () => void): Disposable => {
        if (this.cancelled) {
          // Already cancelled, call immediately
          callback();
          return { dispose: () => {} };
        } else {
          // Use the disposable returned by DisposableEventEmitter (once-only)
          return this.emitter.once('cancelled', callback);
        }
      }
    };

    // Use Object.defineProperty for the getter to maintain proper this binding
    Object.defineProperty(this._token, 'isCancellationRequested', {
      get: () => this.cancelled,
      enumerable: true,
      configurable: false
    });
  }

  /**
   * Get the token
   */
  get token(): CancellationToken {
    return this._token;
  }

  /**
   * Signal cancellation
   */
  cancel(): void {
    if (this.cancelled) {
      return;
    }

    this.cancelled = true;
    this.emitter.emit('cancelled');
  }

  /**
   * Dispose the source
   */
  dispose(): void {
    this.emitter.dispose();
  }
}

/**
 * Singleton token that is never cancelled
 */
export const CancellationToken = {
  None: {
    isCancellationRequested: false,
    onCancellationRequested: (): Disposable => {
      // No-op, never cancels
      return { dispose: () => {} };
    }
  } as CancellationToken
};
