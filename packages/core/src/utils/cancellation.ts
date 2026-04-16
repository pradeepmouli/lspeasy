/**
 * Cancellation token implementation
 * Pattern: MCP SDK's CancellationToken and CancellationTokenSource
 */

import { DisposableEventEmitter } from './disposable-event-emitter.js';
import type { Disposable } from './disposable.js';

/**
 * Read-only handle for observing cancellation state.
 *
 * @remarks
 * Pass a `CancellationToken` to long-running request handlers so they can
 * honour client-initiated cancellation (`$/cancelRequest` notification).
 * The token's `isCancellationRequested` property changes from `false` to
 * `true` exactly once; it never resets.
 *
 * Use `CancellationTokenNone` (exported as a constant) when no cancellation
 * support is needed — it is a singleton that is never cancelled.
 *
 * @useWhen
 * You are implementing a `RequestHandler` that performs async work (file I/O,
 * database queries, tree-sitter parsing) and want to stop early when the
 * client cancels.
 *
 * @avoidWhen
 * The handler is synchronous and returns in less than a few milliseconds.
 * Polling `isCancellationRequested` in a tight loop has negligible benefit.
 *
 * @pitfalls
 * NEVER ignore the cancellation token on long-running requests. If a client
 * sends `$/cancelRequest` and the server does not stop processing, the client
 * times out and receives no usable feedback. Always check
 * `token.isCancellationRequested` at async yield points.
 *
 * @example
 * ```ts
 * import { LSPServer } from '@lspeasy/server';
 *
 * const server = new LSPServer();
 * server.onRequest('textDocument/hover', async (params, token) => {
 *   const lines = await readLargeFile(params.textDocument.uri);
 *   if (token.isCancellationRequested) return null;
 *
 *   // ... compute hover
 *   return { contents: { kind: 'plaintext', value: 'info' } };
 * });
 * ```
 *
 * @category Lifecycle
 */
export interface CancellationToken {
  /**
   * `true` once cancellation has been requested; never resets to `false`.
   */
  readonly isCancellationRequested: boolean;

  /**
   * Registers a callback invoked when (or immediately if already) cancelled.
   *
   * @param callback - Called when cancellation is requested.
   * @returns A `Disposable` to unregister the callback.
   */
  onCancellationRequested(callback: () => void): Disposable;
}

type CancellationEventMap = {
  cancelled: [];
};

/**
 * Controller that creates and manages a `CancellationToken`.
 *
 * @remarks
 * Holds the mutable end of the cancellation pair: call `.cancel()` to signal
 * cancellation; pass `.token` (read-only) to handlers and async operations.
 * Always call `.dispose()` when the operation completes to free internal
 * event-emitter resources, regardless of whether cancellation was requested.
 *
 * @example
 * ```ts
 * import { CancellationTokenSource } from '@lspeasy/core';
 * import { LSPClient } from '@lspeasy/client';
 *
 * const source = new CancellationTokenSource();
 * const promise = client.sendRequest('textDocument/hover', params, source.token);
 *
 * // Cancel from user interaction
 * cancelButton.addEventListener('click', () => source.cancel());
 *
 * try {
 *   const result = await promise;
 * } catch {
 *   // Cancelled
 * } finally {
 *   source.dispose();
 * }
 * ```
 *
 * @category Lifecycle
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
