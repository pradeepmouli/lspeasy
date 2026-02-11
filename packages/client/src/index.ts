/**
 * @lspeasy/client - LSP Client for connecting to language servers
 */

export { LSPClient } from './client.js';
export { CapabilityGuard, ClientCapabilityGuard } from './capability-guard.js';
export type { ClientOptions, InitializeResult, CancellableRequest } from './types.js';

// Re-export commonly used types from core
export type { Transport, Logger, LogLevel, Disposable } from '@lspeasy/core';
