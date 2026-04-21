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
 * {@link ResponseMessage}), framing ({@link parseMessage}, {@link serializeMessage}),
 * and Zod schemas for validation.
 *
 * **Transports** — The {@link Transport} interface plus browser-compatible
 * implementations: {@link WebSocketTransport}, {@link DedicatedWorkerTransport},
 * {@link SharedWorkerTransport}.
 * Node.js transports (`StdioTransport`, `TcpTransport`, `IpcTransport`) are
 * in `@lspeasy/core/node` to avoid importing Node.js builtins in browsers.
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

export {
  requestMessageSchema,
  notificationMessageSchema,
  responseErrorSchema,
  successResponseMessageSchema,
  errorResponseMessageSchema,
  responseMessageSchema,
  messageSchema
} from './jsonrpc/schemas.js';

// Transport interface and implementations
// Note: Node.js-specific transports (StdioTransport, TcpTransport, IpcTransport)
// and stream-based utilities (MessageReader, MessageWriter) are exported from
// '@lspeasy/core/node' to avoid importing Node.js modules in browser environments.
export type { Transport } from './transport/transport.js';
export { DedicatedWorkerTransport } from './transport/dedicated-worker.js';
export type { DedicatedWorkerTransportOptions } from './transport/dedicated-worker.js';
export { SharedWorkerTransport } from './transport/shared-worker.js';
export type { SharedWorkerTransportOptions } from './transport/shared-worker.js';
export { WebSocketTransport } from './transport/websocket.js';
export type { WebSocketTransportOptions } from './transport/websocket.js';
export { createWebSocketClient } from './transport/websocket.js';
export { TransportEventEmitter } from './transport/events.js';

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

// Protocol types (re-exported from vscode-languageserver-protocol)
export type * from './protocol/types.js';

// LSP protocol types and constants (overloaded with same name - type and const)
// Note: Single export statement exports both the type and const with same name
export { LSPRequest, LSPNotification } from './protocol/namespaces.js';
export * from './protocol/infer.js';

// Capability-conditional method interfaces (hand-written type transformations)
export * from './protocol/capability-methods.js';
export type { Client, Server } from './protocol/capability-methods.js';

// LSP protocol schemas
export {
  PositionSchema,
  RangeSchema,
  TextDocumentIdentifierSchema,
  HoverParamsSchema,
  HoverSchema,
  CompletionParamsSchema,
  CompletionItemSchema,
  CompletionListSchema,
  DefinitionParamsSchema,
  ReferenceParamsSchema,
  DocumentSymbolParamsSchema,
  DocumentSymbolSchema,
  InitializeParamsSchema,
  DidOpenTextDocumentParamsSchema,
  DidChangeTextDocumentParamsSchema,
  DidCloseTextDocumentParamsSchema,
  DidSaveTextDocumentParamsSchema,
  LSPSchemas,
  getSchemaForMethod
} from './protocol/schemas.js';

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
export {
  dynamicRegistrationSchema,
  registerCapabilityParamsSchema,
  unregisterCapabilitySchema,
  unregisterCapabilityParamsSchema,
  isRegisterCapabilityParams,
  isUnregisterCapabilityParams
} from './protocol/dynamic-registration.js';
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
