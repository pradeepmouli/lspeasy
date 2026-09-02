/**
 * Core types, transports, and utilities shared by all lspeasy packages.
 *
 * @remarks
 * `@lspeasy/core` is the shared foundation for the lspeasy SDK. It contains
 * everything needed to build custom LSP integrations, and re-exports the
 * most-used pieces from `@lspeasy/client` and `@lspeasy/server`.
 *
 * ### Key areas
 *
 * **JSON-RPC 2.0** — Message types ({@link RequestMessage}, {@link NotificationMessage},
 * {@link ResponseMessage}) and framing ({@link parseMessage},
 * {@link serializeMessage}). Zod schemas for validating them live in
 * `@lspeasy/core/schemas`.
 *
 * **Transports** — The {@link Transport} interface is exported here; the
 * implementations are not. Browser transports (`WebSocketTransport`,
 * `DedicatedWorkerTransport`, `SharedWorkerTransport`) are in
 * `@lspeasy/core/transport`; Node.js transports (`StdioTransport`,
 * `TcpTransport`, `IpcTransport`, `SocketTransport`) are in
 * `@lspeasy/core/node`, so browser bundles never pull `node:` builtins.
 *
 * This barrel deliberately contains no runtime zod. See
 * `barrel-purity.test.ts` and the design note in
 * docs/superpowers/specs/2026-09-02-zod-off-the-runtime-path-design.md.
 *
 * ### Transport Selection Guide
 *
 * | Need | Transport | Critical Gotcha |
 * |------|-----------|-----------------|
 * | Spawn server as child process | `StdioTransport` | `ConsoleLogger` corrupts stdout — use `NullLogger` |
 * | Browser or remote server | `WebSocketTransport` | Call `send()` only after `isConnected()` is `true` |
 * | Persistent local daemon | `TcpTransport` | Create a new server instance per client reconnect |
 * | In-process browser isolation | `DedicatedWorkerTransport` | Monitor `worker.onerror`; crashes are silent |
 * | Shared worker, multiple tabs | `SharedWorkerTransport` | One worker handles all port connections |
 *
 * **Middleware** — The {@link Middleware} pipeline runs on every
 * client-to-server and server-to-client message. Use {@link createScopedMiddleware}
 * to limit a middleware to specific methods, and {@link createTypedMiddleware}
 * for full param/result type inference.
 *
 * **LSP protocol** — {@link LSPRequest} and {@link LSPNotification} namespaces
 * expose every standard LSP method with its params and result types.
 * {@link LSPRequestMethod} / {@link LSPNotificationMethod} are the union types
 * for string-literal method names.
 *
 * **Utilities** — {@link CancellationTokenSource} for request cancellation,
 * {@link DisposableStore} for lifecycle management, {@link ResponseError} for
 * structured JSON-RPC errors, {@link DocumentVersionTracker} for document sync.
 *
 * @packageDocumentation
 */

// JSON-RPC 2.0 types and utilities
export type {
  BaseMessage,
  RequestMessage,
  NotificationMessage,
  SuccessResponseMessage,
  ErrorResponseMessage,
  ResponseMessage,
  Message
} from './jsonrpc/messages.js';

// ResponseError interface from messages (different from ResponseError class in errors)
export type { ResponseError as ResponseErrorInterface } from './jsonrpc/messages.js';

export {
  isRequestMessage,
  isNotificationMessage,
  isResponseMessage,
  isSuccessResponse,
  isErrorResponse
} from './jsonrpc/messages.js';

export { parseMessage, serializeMessage } from './jsonrpc/framing.js';

// The JSON-RPC message schemas are exported from '@lspeasy/core/schemas', not
// here — they import zod, and this barrel must stay zod-free (see schemas.ts).

// Transport implementations are NOT exported from this barrel. One rule:
//
//   types            → '@lspeasy/core'
//   browser transports → '@lspeasy/core/transport'   (Worker, SharedWorker, WebSocket)
//   Node transports    → '@lspeasy/core/node'        (Stdio, Tcp, Ipc, Socket)
//   runtime validation → '@lspeasy/core/schemas'
//
// Keeping them out is what lets this barrel stay zod-free: SharedWorkerTransport
// validates incoming postMessage data with `messageSchema`, so re-exporting it
// here would pull zod into every consumer's graph (see barrel-purity.test.ts).
// The `Transport` interface and the per-transport options types stay — types
// erase at compile time and cost nothing at runtime.
export type { Transport } from './transport/transport.js';
export type { DedicatedWorkerTransportOptions } from './transport/dedicated-worker.js';
export type { SharedWorkerTransportOptions } from './transport/shared-worker.js';
export type { WebSocketTransportOptions } from './transport/websocket.js';

// Middleware
export type {
  Middleware,
  MiddlewareContext,
  MiddlewareDirection,
  MiddlewareMessage,
  MiddlewareMessageType,
  MiddlewareNext,
  MiddlewareResult,
  MethodFilter,
  ScopedMiddleware,
  TypedMiddleware,
  TypedMiddlewareContext,
  TypedParams,
  TypedResult,
  LSPMethod
} from './middleware/index.js';
export {
  composeMiddleware,
  executeMiddlewarePipeline,
  createScopedMiddleware,
  createTypedMiddleware
} from './middleware/index.js';

// Utilities
export type { Disposable } from './utils/disposable.js';
export { DisposableStore } from './utils/disposable.js';
export { DisposableEventEmitter } from './utils/disposable-event-emitter.js';

export type { CancellationToken } from './utils/cancellation.js';
export {
  CancellationTokenSource,
  CancellationToken as CancellationTokenNone
} from './utils/cancellation.js';

export type { Logger } from './utils/logger.js';
export { LogLevel, ConsoleLogger, NullLogger } from './utils/logger.js';

export { JSONRPCErrorCode, ErrorMessage, ResponseError } from './utils/errors.js';
export {
  DocumentVersionTracker,
  createFullDidChangeParams,
  createIncrementalDidChangeParams
} from './utils/document.js';
export type { IncrementalChange, VersionSource } from './utils/document.js';

// Protocol types (z.infer aliases derived from the generated Zod schemas)
export type * from './protocol/types.js';

// LSP protocol types and constants (overloaded with same name - type and const)
// Note: Single export statement exports both the type and const with same name
export { LSPRequest, LSPNotification } from './protocol/namespaces.js';
export * from './protocol/infer.js';

// Capability-conditional method interfaces (hand-written type transformations)
export * from './protocol/capability-methods.js';
export type { Client, Server } from './protocol/capability-methods.js';

// LSP protocol schemas
// The protocol schemas (Position, Range, TextEdit, WorkspaceEdit, CodeAction,
// LSPSchemas, getSchemaForMethod, …) are exported from '@lspeasy/core/schemas'.
// They are zod values; this barrel stays zod-free. Their TYPES remain exported
// below — `z.infer` types erase at compile time and cost nothing at runtime.

// Advanced protocol features
export type {
  WorkspaceFolder,
  WorkspaceFoldersChangeEvent,
  WorkspaceEdit,
  ApplyWorkspaceEditParams,
  ApplyWorkspaceEditResult,
  DidChangeWorkspaceFoldersParams
} from './protocol/workspace.js';
export {
  createWorkspaceFolder,
  createWorkspaceFoldersChangeEvent,
  FileChangeTypes as WorkspaceFileChangeTypes
} from './protocol/workspace.js';

export type {
  DidChangeWatchedFilesParams,
  FileEvent,
  FileChangeType,
  FileSystemWatcher,
  WatchKind
} from './protocol/watching.js';
export {
  WatchKinds,
  createFileEvent,
  createFileSystemWatcher,
  createDidChangeWatchedFilesParams
} from './protocol/watching.js';

export type {
  ProgressToken,
  WorkDoneProgressBegin,
  WorkDoneProgressReport,
  WorkDoneProgressEnd,
  WorkDoneProgressParams,
  WorkDoneProgressOptions,
  WorkDoneProgressCreateParams,
  WorkDoneProgressValue
} from './protocol/progress.js';
export {
  createProgressBegin,
  createProgressReport,
  createProgressEnd,
  createProgressCreateParams,
  createProgressToken
} from './protocol/progress.js';

export type { PartialResultParams } from './protocol/partial.js';

export {
  createPartialResultParams,
  hasPartialResultToken,
  getPartialResultToken
} from './protocol/partial.js';
export type {
  DynamicRegistration,
  DynamicRegistrationBehavior,
  RegisterCapabilityParams,
  UnregisterCapability,
  UnregisterCapabilityParams
} from './protocol/dynamic-registration.js';
// The dynamic-registration schemas and their zod-backed type guards
// (isRegisterCapabilityParams / isUnregisterCapabilityParams) are exported from
// '@lspeasy/core/schemas'. The types above stay here.
export type {
  CancelledPartialResult,
  CompletedPartialResult,
  PartialRequestOutcome
} from './protocol/partial-results.js';

export type {
  WorkerLike,
  MessagePortLike,
  SharedWorkerLike,
  WorkerMessageEventLike,
  WorkerTransportEnvelope
} from './transport/worker-types.js';
export { isMessage, isWorkerTransportEnvelope } from './transport/worker-types.js';

export * from './protocol/capabilities.js';

// Capability guard utilities (shared by client and server)
export {
  buildMethodSets,
  SERVER_METHODS,
  CLIENT_METHODS,
  checkMethod
} from './utils/capability-guard.js';
export type { CheckMethodOptions } from './utils/capability-guard.js';

// Discovery — lsp.json config reader (shared with proxy)
export type { LspServerEntry, LspJson, ResolvedServer, ConfiguredServer } from './discover.js';
export {
  selectServer,
  selectServerByLanguageId,
  selectExtensionMap,
  discoverServer,
  discoverServerByLanguageId,
  discoverExtensionMap,
  discoverServers,
  buildServerCommand,
  readLspJsonFile,
  writeLspJsonFile,
  mergeServers
} from './discover.js';

// Language extensions — languageId to default extensions table
export { DEFAULT_EXTENSIONS, extensionsForLanguage } from './language-extensions.js';

// Command tokenizer
export { tokenizeCommand } from './utils/tokenize-command.js';

// `exampleFromZod` (illustrative required-only samples) and `unwrapZodType`
// (Zod 4 wrapper peeling) are exported from '@lspeasy/core/schemas' — both take
// zod values, so they cannot live in this zod-free barrel.

// Local plugin resolver — reads installed .lsp.json files under ~/.claude/plugins/marketplaces
export {
  defaultPluginsRoot,
  listInstalledPluginServers,
  resolvePlugin,
  findPluginFor
} from './plugin-resolver.js';
