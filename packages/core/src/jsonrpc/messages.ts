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
  /** JSON-RPC protocol version discriminant — always `"2.0"`. */
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
 * @never
 * NEVER assume JSON-RPC IDs are integers. The spec permits strings, and some
 * LSP clients (e.g. VS Code extensions) use string IDs. Always use `String(id)`
 * when keying pending-request maps.
 *
 * @category JSON-RPC
 */
export interface RequestMessage extends BaseMessage {
  /** Unique identifier correlating this request to its eventual response. */
  id: string | number;
  /** LSP method string, e.g. `'textDocument/hover'`. */
  method: string;
  /** JSON-RPC protocol version — always `"2.0"` (inherited). */
  jsonrpc: '2.0';
  /** Optional request parameters (method-specific shape). */
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
 * @never
 * NEVER send a notification before the `initialize` response has been sent
 * by the server. The LSP spec requires the server to respond to `initialize`
 * before any other message is exchanged; clients discard early notifications.
 *
 * @category JSON-RPC
 */
export interface NotificationMessage extends BaseMessage {
  /** LSP method string, e.g. `'textDocument/didOpen'`. */
  method: string;
  /** JSON-RPC protocol version — always `"2.0"` (inherited). */
  jsonrpc: '2.0';
  /** Optional notification parameters (method-specific shape). */
  params?: unknown;
}

/**
 * JSON-RPC 2.0 error object embedded in an error response.
 *
 * @category JSON-RPC
 */
export interface ResponseError {
  /** Numeric JSON-RPC error code (see {@link JSONRPCErrorCode} for standard values). */
  code: number;
  /** Human-readable error description. */
  message: string;
  /** Optional machine-readable error details for the caller. */
  data?: unknown;
}

/**
 * JSON-RPC 2.0 success response to a prior request.
 *
 * @category JSON-RPC
 */
export interface SuccessResponseMessage extends BaseMessage {
  /** Identifier matching the originating request's `id`. */
  id: string | number;
  /** JSON-RPC protocol version — always `"2.0"` (inherited). */
  jsonrpc: '2.0';
  /** The request result payload. */
  result: unknown;
}

/**
 * JSON-RPC 2.0 error response to a prior request.
 *
 * @category JSON-RPC
 */
export interface ErrorResponseMessage extends BaseMessage {
  /** Identifier matching the originating request's `id`. */
  id: string | number;
  /** JSON-RPC protocol version — always `"2.0"` (inherited). */
  jsonrpc: '2.0';
  /** Structured error payload. */
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
 * @param message - The message to test.
 * @returns `true` when `message` is a {@link RequestMessage}.
 * @category JSON-RPC
 */
export function isRequestMessage(message: Message): message is RequestMessage {
  return 'id' in message && 'method' in message;
}

/**
 * Returns `true` when `message` is a JSON-RPC notification (has `method`,
 * no `id`).
 *
 * @param message - The message to test.
 * @returns `true` when `message` is a {@link NotificationMessage}.
 * @category JSON-RPC
 */
export function isNotificationMessage(message: Message): message is NotificationMessage {
  return 'method' in message && !('id' in message);
}

/**
 * Returns `true` when `message` is a JSON-RPC response (has `id`, no `method`).
 *
 * @param message - The message to test.
 * @returns `true` when `message` is a {@link ResponseMessage}.
 * @category JSON-RPC
 */
export function isResponseMessage(message: Message): message is ResponseMessage {
  return 'id' in message && !('method' in message);
}

/**
 * Returns `true` when `response` carries a `result` (success case).
 *
 * @param message - The response message to test.
 * @returns `true` when `message` is a {@link SuccessResponseMessage}.
 * @category JSON-RPC
 */
export function isSuccessResponse(message: ResponseMessage): message is SuccessResponseMessage {
  return 'result' in message;
}

/**
 * Returns `true` when `response` carries an `error` (error case).
 *
 * @param message - The response message to test.
 * @returns `true` when `message` is an {@link ErrorResponseMessage}.
 * @category JSON-RPC
 */
export function isErrorResponse(message: ResponseMessage): message is ErrorResponseMessage {
  return 'error' in message;
}
