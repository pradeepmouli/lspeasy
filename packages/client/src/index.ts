/**
 * LSP client package for connecting to language servers.
 *
 * @remarks
 * Use `@lspeasy/client` when you need to build the **consumer** side of the
 * Language Server Protocol — an editor extension, a CLI analysis tool, a test
 * harness, or any process that speaks to a language server process.
 *
 * The primary entry point is {@link LSPClient}. Construct it with
 * {@link ClientOptions}, call `connect(transport)` to complete the LSP
 * handshake, then use `expect<ServerCaps>()` to get typed access to
 * capability-aware namespaces (e.g. `client.textDocument.hover(params)`).
 *
 * ### Choosing a transport
 * | Environment | Transport |
 * |---|---|
 * | Node.js stdio/pipe | `StdioTransport` from `@lspeasy/core/node` |
 * | Node.js TCP | `TcpTransport` from `@lspeasy/core/node` |
 * | Browser / WebSocket | `WebSocketTransport` from `@lspeasy/core` |
 * | Web Workers | `DedicatedWorkerTransport` from `@lspeasy/core` |
 *
 * ### Connection health
 * Use {@link ConnectionHealthTracker} and {@link HeartbeatMonitor} to detect
 * silent transport failures. Subscribe to state-change events via
 * {@link ConnectionState}.
 *
 * ### Dynamic registration
 * The client handles `client/registerCapability` and
 * `client/unregisterCapability` requests from the server automatically,
 * updating the typed namespaces at runtime.
 *
 * @packageDocumentation
 */

export { LSPClient } from './client.js';
export { CapabilityGuard, ClientCapabilityGuard } from './capability-guard.js';
export type {
  ClientOptions,
  InitializeResult,
  CancellableRequest,
  NotebookDocumentNamespace,
  PartialRequestOptions,
  PartialRequestResult
} from './types.js';
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
