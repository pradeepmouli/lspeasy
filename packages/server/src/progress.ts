/**
 * Progress reporting support for LSP servers
 *
 * @module server/progress
 */

import type { ProgressToken } from 'vscode-languageserver-protocol';
import { createProgressBegin, createProgressReport, createProgressEnd } from '@lspy/core';

/**
 * Progress reporter for work done progress
 */
export interface ProgressReporter {
  /**
   * Begin progress reporting
   */
  begin(title: string, cancellable?: boolean, message?: string, percentage?: number): Promise<void>;

  /**
   * Report progress
   */
  report(message?: string, percentage?: number): Promise<void>;

  /**
   * End progress reporting
   */
  end(message?: string): Promise<void>;
}

/**
 * Internal interface for sending progress notifications
 */
interface ProgressSender {
  sendNotification(method: string, params: unknown): Promise<void>;
}

/**
 * Implementation of ProgressReporter
 */
class ProgressReporterImpl implements ProgressReporter {
  constructor(
    private token: ProgressToken,
    private sender: ProgressSender
  ) {}

  async begin(
    title: string,
    cancellable?: boolean,
    message?: string,
    percentage?: number
  ): Promise<void> {
    const value = createProgressBegin(title, cancellable, message, percentage);
    await this.sender.sendNotification('$/progress', {
      token: this.token,
      value
    });
  }

  async report(message?: string, percentage?: number): Promise<void> {
    const value = createProgressReport(message, percentage);
    await this.sender.sendNotification('$/progress', {
      token: this.token,
      value
    });
  }

  async end(message?: string): Promise<void> {
    const value = createProgressEnd(message);
    await this.sender.sendNotification('$/progress', {
      token: this.token,
      value
    });
  }
}

/**
 * Create a progress reporter for a given token
 * @internal
 */
export function createProgressReporter(
  token: ProgressToken,
  sender: ProgressSender
): ProgressReporter {
  return new ProgressReporterImpl(token, sender);
}

/**
 * Generate a unique progress token
 */
export function createProgressToken(): ProgressToken {
  return `progress-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
