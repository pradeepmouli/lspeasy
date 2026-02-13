/**
 * @lspeasy/core - Core types, transports, and utilities for LSP SDK
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
export { MessageReader } from './jsonrpc/reader.js';
export { MessageWriter } from './jsonrpc/writer.js';

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
export type { Transport } from './transport/transport.js';
export { StdioTransport } from './transport/stdio.js';
export type { StdioTransportOptions } from './transport/stdio.js';
export { TcpTransport } from './transport/tcp.js';
export type { TcpTransportOptions, TcpReconnectOptions } from './transport/tcp.js';
export { IpcTransport } from './transport/ipc.js';
export type {
  IpcTransportOptions,
  IpcParentProcessLike,
  IpcChildProcessLike
} from './transport/ipc.js';
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

export * from './protocol/capabilities.js';
