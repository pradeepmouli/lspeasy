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
