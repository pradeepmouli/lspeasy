/**
 * JSON-RPC 2.0 message types following MCP SDK patterns
 * Custom implementation without vscode-jsonrpc dependency
 */

/**
 * Base JSON-RPC 2.0 message
 */
export interface BaseMessage {
  jsonrpc: '2.0';
}

/**
 * JSON-RPC 2.0 Request Message
 */
export interface RequestMessage extends BaseMessage {
  id: string | number;
  method: string;
  params?: unknown;
}

/**
 * JSON-RPC 2.0 Notification Message (no response expected)
 */
export interface NotificationMessage extends BaseMessage {
  method: string;
  params?: unknown;
}

/**
 * JSON-RPC 2.0 Response Error
 */
export interface ResponseError {
  code: number;
  message: string;
  data?: unknown;
}

/**
 * JSON-RPC 2.0 Success Response Message
 */
export interface SuccessResponseMessage extends BaseMessage {
  id: string | number;
  result: unknown;
}

/**
 * JSON-RPC 2.0 Error Response Message
 */
export interface ErrorResponseMessage extends BaseMessage {
  id: string | number;
  error: ResponseError;
}

/**
 * JSON-RPC 2.0 Response Message (success or error)
 */
export type ResponseMessage = SuccessResponseMessage | ErrorResponseMessage;

/**
 * Union of all JSON-RPC message types
 */
export type Message = RequestMessage | NotificationMessage | ResponseMessage;

/**
 * Type guards for message discrimination
 */

export function isRequestMessage(message: Message): message is RequestMessage {
  return 'id' in message && 'method' in message;
}

export function isNotificationMessage(message: Message): message is NotificationMessage {
  return 'method' in message && !('id' in message);
}

export function isResponseMessage(message: Message): message is ResponseMessage {
  return 'id' in message && !('method' in message);
}

export function isSuccessResponse(message: ResponseMessage): message is SuccessResponseMessage {
  return 'result' in message;
}

export function isErrorResponse(message: ResponseMessage): message is ErrorResponseMessage {
  return 'error' in message;
}
