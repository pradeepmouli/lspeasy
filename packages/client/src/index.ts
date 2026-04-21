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
 * ### Transport Decision Tree
 *
 * **Stdio** (`StdioTransport` from `@lspeasy/core/node`)
 * — Use when: spawning the language server as a child process (the canonical
 *   editor extension pattern). Zero network overhead; server and client share
 *   a lifespan. Failure mode: server process dies silently → stdout EOF fires
 *   `onClose`; pair with `HeartbeatMonitor` on long-lived processes.
 *
 * **WebSocket** (`WebSocketTransport` from `@lspeasy/core`)
 * — Use when: the language server runs remotely (CI, container, cloud dev env)
 *   or must be browser-accessible. Supports reconnect with exponential back-off.
 *   Failure mode: network partition → `onError` fires without `onClose`;
 *   enable `enableReconnect` and subscribe to `ConnectionHealthTracker` events.
 *
 * **TCP** (`TcpTransport` from `@lspeasy/core/node`)
 * — Use when: you need a persistent local socket and control both ends
 *   (e.g. a test harness or a daemon that outlives the client process).
 *   Failure mode: port conflict at startup; use `mode: 'client'` only after
 *   confirming the server is listening, or wrap in a retry loop.
 *
 * **DedicatedWorkerTransport** (`DedicatedWorkerTransport` from `@lspeasy/core`)
 * — Use when: running the language server in a Web Worker for browser isolation.
 *   Zero latency (shared memory), no WebSocket overhead. Failure mode: worker
 *   uncaught exception terminates silently; subscribe to `worker.onerror`.
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
