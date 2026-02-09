/**
 * Progress reporting types for LSP protocol
 *
 * @module protocol/progress
 */

import type {
  ProgressToken,
  WorkDoneProgressBegin,
  WorkDoneProgressReport,
  WorkDoneProgressEnd,
  WorkDoneProgressParams,
  WorkDoneProgressOptions,
  WorkDoneProgressCreateParams
} from 'vscode-languageserver-protocol';

// Re-export progress types
export type {
  ProgressToken,
  WorkDoneProgressBegin,
  WorkDoneProgressReport,
  WorkDoneProgressEnd,
  WorkDoneProgressParams,
  WorkDoneProgressOptions,
  WorkDoneProgressCreateParams
};

/**
 * WorkDoneProgress value types
 */
export type WorkDoneProgressValue =
  | WorkDoneProgressBegin
  | WorkDoneProgressReport
  | WorkDoneProgressEnd;

/**
 * Helper to create a progress begin notification
 */
export function createProgressBegin(
  title: string,
  cancellable?: boolean,
  message?: string,
  percentage?: number
): WorkDoneProgressBegin {
  const result: WorkDoneProgressBegin = { kind: 'begin', title };
  if (cancellable !== undefined) {
    result.cancellable = cancellable;
  }
  if (message !== undefined) {
    result.message = message;
  }
  if (percentage !== undefined) {
    result.percentage = percentage;
  }
  return result;
}

/**
 * Helper to create a progress report notification
 */
export function createProgressReport(
  message?: string,
  percentage?: number,
  cancellable?: boolean
): WorkDoneProgressReport {
  const result: WorkDoneProgressReport = { kind: 'report' };
  if (message !== undefined) {
    result.message = message;
  }
  if (percentage !== undefined) {
    result.percentage = percentage;
  }
  if (cancellable !== undefined) {
    result.cancellable = cancellable;
  }
  return result;
}

/**
 * Helper to create a progress end notification
 */
export function createProgressEnd(message?: string): WorkDoneProgressEnd {
  const result: WorkDoneProgressEnd = { kind: 'end' };
  if (message !== undefined) {
    result.message = message;
  }
  return result;
}

/**
 * Helper to create progress create params
 */
export function createProgressCreateParams(token: ProgressToken): WorkDoneProgressCreateParams {
  return { token };
}

/**
 * Helper to create a unique progress token
 * Returns a numeric token based on current timestamp and random value
 */
export function createProgressToken(): ProgressToken {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}
