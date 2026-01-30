/**
 * @lspy/server - Build LSP servers with simple, typed API
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

// Re-export commonly used types from @lspy/core
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
  Definition
} from '@lspy/core';

export { ResponseError, JSONRPCErrorCode, StdioTransport, ConsoleLogger } from '@lspy/core';
