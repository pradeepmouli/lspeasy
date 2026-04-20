/**
 * LSP and JSON-RPC error codes
 */

/**
 * Numeric error codes defined by JSON-RPC 2.0 and the LSP specification.
 *
 * @remarks
 * Use these constants when throwing `ResponseError` from request handlers
 * so clients can programmatically distinguish error types.
 *
 * Ranges:
 * - `-32700` to `-32600`: JSON-RPC 2.0 standard errors
 * - `-32899` to `-32800`: LSP-reserved range
 * - `-32099` to `-32000`: Application-defined errors
 *
 * @category Errors
 */
export const JSONRPCErrorCode = {
  // Standard JSON-RPC 2.0 errors
  ParseError: -32700,
  InvalidRequest: -32600,
  MethodNotFound: -32601,
  InvalidParams: -32602,
  InternalError: -32603,

  // LSP-specific error codes (from -32899 to -32800)
  ServerNotInitialized: -32002,
  UnknownErrorCode: -32001,

  // Application-defined errors (from -32099 to -32000)
  ServerErrorStart: -32099,
  ServerErrorEnd: -32000,
  RequestCancelled: -32800,
  ContentModified: -32801,
  ServerCancelled: -32802
} as const;

/**
 * Error messages for each error code
 */
export const ErrorMessage: Record<number, string> = {
  [JSONRPCErrorCode.ParseError]: 'Parse error',
  [JSONRPCErrorCode.InvalidRequest]: 'Invalid request',
  [JSONRPCErrorCode.MethodNotFound]: 'Method not found',
  [JSONRPCErrorCode.InvalidParams]: 'Invalid params',
  [JSONRPCErrorCode.InternalError]: 'Internal error',
  [JSONRPCErrorCode.ServerNotInitialized]: 'Server not initialized, or server shut down',
  [JSONRPCErrorCode.UnknownErrorCode]: 'Unknown error',
  [JSONRPCErrorCode.RequestCancelled]: 'Request cancelled',
  [JSONRPCErrorCode.ContentModified]: 'Content modified',
  [JSONRPCErrorCode.ServerCancelled]: 'Server cancelled'
};

/**
 * An `Error` subclass that maps to a JSON-RPC 2.0 error response.
 *
 * @remarks
 * Throw a `ResponseError` from any request handler to send a structured error
 * response to the client. The framework catches it and converts it to the wire
 * format automatically.
 *
 * Use the static factory methods (`ResponseError.invalidParams()`, etc.) for
 * the standard JSON-RPC / LSP error codes rather than constructing raw codes.
 *
 * @useWhen
 * A request handler needs to reject with a machine-readable error code that
 * the client can act on (e.g. respond with `MethodNotFound` when a capability
 * was not declared, or `InvalidParams` when schema validation fails).
 *
 * @avoidWhen
 * You want to log a server-side error without sending an error to the client —
 * throw a plain `Error` and handle it via `server.onError()` instead.
 *
 * @never
 * NEVER throw `ResponseError` with a code outside the defined ranges without
 * documenting it. Undocumented codes are opaque to clients and tools.
 *
 * @example
 * ```ts
 * import { ResponseError, JSONRPCErrorCode } from '@lspeasy/core';
 * import { LSPServer } from '@lspeasy/server';
 *
 * const server = new LSPServer();
 * server.onRequest('textDocument/hover', async (params) => {
 *   const doc = getDocument(params.textDocument.uri);
 *   if (!doc) {
 *     throw ResponseError.invalidParams(`Unknown document: ${params.textDocument.uri}`);
 *   }
 *   return computeHover(doc, params.position);
 * });
 * ```
 *
 * @category Errors
 */
export class ResponseError extends Error {
  constructor(
    public readonly code: number,
    message: string,
    public readonly data?: unknown
  ) {
    super(message);
    this.name = 'ResponseError';
  }

  /**
   * Serializes to the JSON-RPC wire format (`{ code, message, data? }`).
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      data: this.data
    };
  }

  /**
   * Create a parse error
   */
  static parseError(message?: string, data?: unknown): ResponseError {
    return new ResponseError(
      JSONRPCErrorCode.ParseError,
      message ?? ErrorMessage[JSONRPCErrorCode.ParseError] ?? 'Parse error',
      data
    );
  }

  /**
   * Create an invalid request error
   */
  static invalidRequest(message?: string, data?: unknown): ResponseError {
    return new ResponseError(
      JSONRPCErrorCode.InvalidRequest,
      message ?? ErrorMessage[JSONRPCErrorCode.InvalidRequest] ?? 'Invalid request',
      data
    );
  }

  /**
   * Create a method not found error
   */
  static methodNotFound(method: string, data?: unknown): ResponseError {
    return new ResponseError(JSONRPCErrorCode.MethodNotFound, `Method not found: ${method}`, data);
  }

  /**
   * Create an invalid params error
   */
  static invalidParams(message?: string, data?: unknown): ResponseError {
    return new ResponseError(
      JSONRPCErrorCode.InvalidParams,
      message ?? ErrorMessage[JSONRPCErrorCode.InvalidParams] ?? 'Invalid params',
      data
    );
  }

  /**
   * Create an internal error
   */
  static internalError(message?: string, data?: unknown): ResponseError {
    return new ResponseError(
      JSONRPCErrorCode.InternalError,
      message ?? ErrorMessage[JSONRPCErrorCode.InternalError] ?? 'Internal error',
      data
    );
  }

  /**
   * Create a server not initialized error
   */
  static serverNotInitialized(data?: unknown): ResponseError {
    return new ResponseError(
      JSONRPCErrorCode.ServerNotInitialized,
      ErrorMessage[JSONRPCErrorCode.ServerNotInitialized] ?? 'Server not initialized',
      data
    );
  }

  /**
   * Create a request cancelled error
   */
  static requestCancelled(data?: unknown): ResponseError {
    return new ResponseError(
      JSONRPCErrorCode.RequestCancelled,
      ErrorMessage[JSONRPCErrorCode.RequestCancelled] ?? 'Request cancelled',
      data
    );
  }
}
