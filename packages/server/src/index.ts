/**
 * LSP server package for hosting Language Server Protocol (LSP) servers.
 *
 * @remarks
 * Use `@lspeasy/server` when you need to build the **provider** side of the
 * Language Server Protocol — a daemon that editors and language-client tooling
 * connect to in order to get diagnostics, completions, hover, go-to-definition,
 * and other language intelligence features.
 *
 * The primary entry point is {@link LSPServer}. Construct it with
 * {@link ServerOptions}, call `registerCapabilities(caps)` to declare what
 * the server supports, register handlers with `onRequest` / `onNotification`,
 * then call `listen(transport)` to accept the first client connection.
 *
 * ### Transport Decision Tree
 *
 * **Stdio** (`StdioTransport` from `@lspeasy/core/node`)
 * — Use when: the client spawns your server as a child process (the canonical
 *   VS Code extension pattern). No network, no port management. Failure mode:
 *   `ConsoleLogger` writes to stdout and corrupts the LSP stream — always use
 *   `NullLogger` or a file-based logger with stdio.
 *
 * **WebSocket** (`WebSocketTransport` from `@lspeasy/core`)
 * — Use when: multiple clients connect over a network, or the server must be
 *   browser-accessible. Each accepted WebSocket connection needs its own
 *   `LSPServer` instance. Failure mode: one client crash should not affect
 *   others — wrap each `wss.on('connection')` callback in try/catch and
 *   create a fresh `LSPServer` per socket.
 *
 * **TCP** (`TcpTransport` from `@lspeasy/core/node`)
 * — Use when: building a persistent local daemon (e.g. a formatting server
 *   shared across editor sessions). Failure mode: client disconnect fires
 *   `close()` on the server instance — use `mode: 'server'` and create a new
 *   `LSPServer` on each reconnect.
 *
 * **DedicatedWorkerTransport** (`DedicatedWorkerTransport` from `@lspeasy/core`)
 * — Use when: running the server logic in a Web Worker for in-process browser
 *   isolation. Zero serialization overhead. Failure mode: worker crash is
 *   silent from the server side — monitor the worker's `onerror` in the host.
 *
 * ### Typed capability namespaces
 * After `registerCapabilities({ hoverProvider: true })`, TypeScript exposes
 * `server.textDocument.onHover(handler)` — methods that are absent unless the
 * corresponding capability is declared. This prevents accidentally registering
 * handlers for capabilities the server never advertised.
 *
 * ### Handler conventions
 * - {@link RequestHandler} — async, throws {@link ResponseError} for
 *   structured errors, checks `token.isCancellationRequested` for early exit.
 * - {@link NotificationHandler} — fire-and-forget; unhandled rejections
 *   surface via `server.onError()`.
 *
 * @packageDocumentation
 */

// Main server class
export { LSPServer } from './server.js';

// Types
export type {
  ServerOptions,
  RequestHandler,
  NotificationHandler,
  NotebookDocumentHandlerNamespace,
  RequestContext,
  NotificationContext,
  Server
} from './types.js';

export { ServerState } from './types.js';

// Internal exports for testing
export { MessageDispatcher } from './dispatcher.js';
export { PartialResultSender } from './progress/partial-result-sender.js';

// Re-export commonly used types from @lspeasy/core
export type {
  Transport,
  CancellationToken,
  Logger,
  ServerCapabilities,
  ClientCapabilities,
  InitializeParams,
  InitializeResult,
  HoverParams,
  Hover,
  CompletionParams,
  CompletionList,
  CompletionItem,
  DefinitionParams,
  Definition,
  // Type inference utilities
  LSPRequestMethod,
  LSPNotificationMethod,
  ParamsForRequest,
  ResultForRequest,
  ParamsForNotification
} from '@lspeasy/core';

export { ResponseError, JSONRPCErrorCode, ConsoleLogger, LogLevel } from '@lspeasy/core';

// Note: For Node.js-specific transports like StdioTransport, import directly from '@lspeasy/core/node'
// This keeps @lspeasy/server browser-compatible
