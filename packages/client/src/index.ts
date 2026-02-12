/**
 * @lspeasy/client - LSP Client for connecting to language servers
 */

export { LSPClient } from './client.js';
export { CapabilityGuard, ClientCapabilityGuard } from './capability-guard.js';
export type { ClientOptions, InitializeResult, CancellableRequest } from './types.js';
export { ConnectionState, ConnectionHealthTracker, HeartbeatMonitor } from './connection/index.js';
export type {
  ConnectionHealth,
  HeartbeatConfig,
  HeartbeatStatus,
  StateChangeEvent
} from './connection/index.js';
export { NotificationWaiter } from './notifications/index.js';
export type { NotificationWaitOptions } from './notifications/index.js';

// Re-export commonly used types from core
export type { Transport, Logger, LogLevel, Disposable } from '@lspeasy/core';
