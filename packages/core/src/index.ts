/**
 * @lspy/core - Core types, transports, and utilities for LSP SDK
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
export type {
  LSPRequestMethod,
  LSPNotificationMethod,
  InferRequestParams,
  InferRequestResult,
  InferNotificationParams
} from './protocol/infer.js';

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
