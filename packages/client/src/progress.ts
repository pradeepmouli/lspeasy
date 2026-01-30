/**
 * Progress reporting support for LSP clients
 *
 * @module client/progress
 */

import type { ProgressToken, WorkDoneProgressValue } from '@lspy/core';

/**
 * Progress notification parameters
 */
export interface ProgressParams<T = WorkDoneProgressValue> {
  /**
   * The progress token provided by the client or server.
   */
  token: ProgressToken;

  /**
   * The progress data.
   */
  value: T;
}

/**
 * Handler for progress notifications
 */
export type ProgressHandler<T = WorkDoneProgressValue> = (
  params: ProgressParams<T>
) => void | Promise<void>;

/**
 * Progress listener registration
 */
export interface ProgressRegistration {
  /**
   * Unregister this progress listener
   */
  dispose(): void;
}

/**
 * Progress manager for tracking progress notifications
 * @internal
 */
export class ProgressManager {
  private handlers = new Map<ProgressToken, ProgressHandler>();
  private globalHandlers: ProgressHandler[] = [];

  /**
   * Register a handler for a specific progress token
   */
  onProgress(token: ProgressToken, handler: ProgressHandler): ProgressRegistration {
    this.handlers.set(token, handler);
    return {
      dispose: () => {
        this.handlers.delete(token);
      }
    };
  }

  /**
   * Register a handler for all progress notifications
   */
  onAnyProgress(handler: ProgressHandler): ProgressRegistration {
    this.globalHandlers.push(handler);
    return {
      dispose: () => {
        const index = this.globalHandlers.indexOf(handler);
        if (index !== -1) {
          this.globalHandlers.splice(index, 1);
        }
      }
    };
  }

  /**
   * Handle an incoming progress notification
   * @internal
   */
  async handleProgress(params: ProgressParams): Promise<void> {
    // Call specific handler for this token
    const handler = this.handlers.get(params.token);
    if (handler) {
      await handler(params);
    }

    // Call all global handlers
    await Promise.all(this.globalHandlers.map((h) => h(params)));
  }
}
