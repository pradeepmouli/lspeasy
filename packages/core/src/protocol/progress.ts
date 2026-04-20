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
 * Creates a `WorkDoneProgressBegin` payload to start a work-done progress notification.
 *
 * @remarks
 * Send this as the value of a `$/progress` notification after creating a progress
 * token with `window/workDoneProgress/create`. The `title` is always displayed;
 * `message` overrides the title for the first intermediate status text.
 * Set `cancellable: true` only when the server can honour a `$/cancelRequest`
 * for the underlying operation — clients use this to show a cancel button.
 *
 * @param title - Short, human-readable title for the progress operation (required).
 * @param cancellable - Whether the client should offer a cancel button.
 * @param message - Optional initial status message shown below the title.
 * @param percentage - Optional initial progress percentage (0–100).
 * @returns A `WorkDoneProgressBegin` object ready to send as `$/progress`.
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
 * Creates a `WorkDoneProgressReport` payload to update an in-progress work-done notification.
 *
 * @remarks
 * All parameters are optional. Omit `message` to keep the last displayed message;
 * omit `percentage` when the operation does not have a measurable completion ratio.
 * If `cancellable` changes between reports, the client will update the cancel
 * button accordingly.
 *
 * @param message - Updated status text; omit to keep the previous message.
 * @param percentage - Updated progress percentage (0–100); omit for indeterminate.
 * @param cancellable - Whether the cancel button should be shown/hidden.
 * @returns A `WorkDoneProgressReport` object ready to send as `$/progress`.
 */
export function createProgressReport(
  message?: string,
  percentage?: number,
  cancellable?: boolean
): WorkDoneProgressReport {
  const result: WorkDoneProgressReport = { kind: 'report' };
  if (message) {
    result.message = message;
  }
  if (percentage) {
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
  if (message) {
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
 * Generate a unique progress token
 */
export function createProgressToken(): ProgressToken {
  return `progress-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
