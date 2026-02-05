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
export { WebSocketTransport } from './transport/websocket.js';
export type { WebSocketTransportOptions } from './transport/websocket.js';
export { TransportEventEmitter } from './transport/events.js';

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

// Protocol types (re-exported from vscode-languageserver-protocol)
export * from './protocol/types.js';

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
  createProgressCreateParams
} from './protocol/progress.js';

export type { PartialResultParams } from './protocol/partial.js';

export {
  createPartialResultParams,
  hasPartialResultToken,
  getPartialResultToken
} from './protocol/partial.js';

export * from './protocol/capabilities.js';

export * from './protocol/capability-methods.js';
