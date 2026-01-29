/**
 * Cancellation token implementation
 * Pattern: MCP SDK's CancellationToken and CancellationTokenSource
 */

import { EventEmitter } from 'node:events';

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
   */
  onCancellationRequested(callback: () => void): void;
}

/**
 * Source that controls a CancellationToken
 */
export class CancellationTokenSource {
  private emitter: EventEmitter;
  private cancelled: boolean;
  private readonly _token: CancellationToken;

  constructor() {
    this.emitter = new EventEmitter();
    this.cancelled = false;

    // Create token with proper binding
    const self = this;
    this._token = {
      get isCancellationRequested() {
        return self.cancelled;
      },

      onCancellationRequested: (callback: () => void) => {
        if (self.cancelled) {
          // Already cancelled, call immediately
          callback();
        } else {
          self.emitter.once('cancelled', callback);
        }
      }
    };
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
    this.emitter.removeAllListeners();
  }
}

/**
 * Singleton token that is never cancelled
 */
export const CancellationToken = {
  None: {
    isCancellationRequested: false,
    onCancellationRequested: () => {
      // No-op
    }
  } as CancellationToken
};
