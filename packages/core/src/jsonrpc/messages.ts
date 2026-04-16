/**
 * JSON-RPC 2.0 message types following MCP SDK patterns
 * Custom implementation without vscode-jsonrpc dependency
 */

/**
 * Base JSON-RPC 2.0 message discriminant.
 *
 * @remarks
 * All JSON-RPC 2.0 messages carry `"jsonrpc": "2.0"`. Use this as a base
 * when building custom message types or narrowing message unions.
 *
 * @category JSON-RPC
 */
export interface BaseMessage {
  jsonrpc: '2.0';
}

/**
 * JSON-RPC 2.0 Request message — expects a response from the peer.
 *
 * @remarks
 * The `id` field uniquely identifies the request within a connection session.
 * Per the JSON-RPC 2.0 spec, `id` may be a `string` or `number` — never
 * assume integers only.
 *
 * @pitfalls
 * NEVER assume JSON-RPC IDs are integers. The spec permits strings, and some
 * LSP clients (e.g. VS Code extensions) use string IDs. Always use `String(id)`
 * when keying pending-request maps.
 *
 * @category JSON-RPC
 */
export interface RequestMessage extends BaseMessage {
  id: string | number;
  method: string;
  params?: unknown;
}

/**
 * JSON-RPC 2.0 Notification message — no response is expected or sent.
 *
 * @remarks
 * Notifications are fire-and-forget. Sending an error response to a
 * notification violates the JSON-RPC 2.0 spec and will be silently dropped
 * by compliant clients.
 *
 * @pitfalls
 * NEVER send a notification before the `initialize` response has been sent
 * by the server. The LSP spec requires the server to respond to `initialize`
 * before any other message is exchanged; clients discard early notifications.
 *
 * @category JSON-RPC
 */
export interface NotificationMessage extends BaseMessage {
  method: string;
  params?: unknown;
}

/**
 * JSON-RPC 2.0 error object embedded in an error response.
 *
 * @category JSON-RPC
 */
export interface ResponseError {
  code: number;
  message: string;
  data?: unknown;
}

/**
 * JSON-RPC 2.0 success response to a prior request.
 *
 * @category JSON-RPC
 */
export interface SuccessResponseMessage extends BaseMessage {
  id: string | number;
  result: unknown;
}

/**
 * JSON-RPC 2.0 error response to a prior request.
 *
 * @category JSON-RPC
 */
export interface ErrorResponseMessage extends BaseMessage {
  id: string | number;
  error: ResponseError;
}

/**
 * JSON-RPC 2.0 Response message — either a success result or an error.
 *
 * @category JSON-RPC
 */
export type ResponseMessage = SuccessResponseMessage | ErrorResponseMessage;

/**
 * Union of all JSON-RPC 2.0 message types sent over a transport.
 *
 * @category JSON-RPC
 */
export type Message = RequestMessage | NotificationMessage | ResponseMessage;

/**
 * Type guards for message discrimination
 */

/**
 * Returns `true` when `message` is a JSON-RPC request (has `id` + `method`).
 *
 * @category JSON-RPC
 */
export function isRequestMessage(message: Message): message is RequestMessage {
  return 'id' in message && 'method' in message;
}

/**
 * Returns `true` when `message` is a JSON-RPC notification (has `method`,
 * no `id`).
 *
 * @category JSON-RPC
 */
export function isNotificationMessage(message: Message): message is NotificationMessage {
  return 'method' in message && !('id' in message);
}

/**
 * Returns `true` when `message` is a JSON-RPC response (has `id`, no `method`).
 *
 * @category JSON-RPC
 */
export function isResponseMessage(message: Message): message is ResponseMessage {
  return 'id' in message && !('method' in message);
}

/**
 * Returns `true` when `response` carries a `result` (success case).
 *
 * @category JSON-RPC
 */
export function isSuccessResponse(message: ResponseMessage): message is SuccessResponseMessage {
  return 'result' in message;
}

/**
 * Returns `true` when `response` carries an `error` (error case).
 *
 * @category JSON-RPC
 */
export function isErrorResponse(message: ResponseMessage): message is ErrorResponseMessage {
  return 'error' in message;
}
