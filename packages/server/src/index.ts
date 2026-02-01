/**
 * @lspeasy/server - Build LSP servers with simple, typed API
 */

// Main server class
export { LSPServer } from './server.js';

// Types
export type {
  ServerOptions,
  RequestHandler,
  NotificationHandler,
  RequestContext,
  NotificationContext
} from './types.js';

export { ServerState } from './types.js';

// Internal exports for testing
export { MessageDispatcher } from './dispatcher.js';

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
  InferRequestParams,
  InferRequestResult,
  InferNotificationParams
} from '@lspeasy/core';

export {
  ResponseError,
  JSONRPCErrorCode,
  StdioTransport,
  ConsoleLogger,
  LogLevel
} from '@lspeasy/core';
