/**
 * LSP and JSON-RPC error codes
 */

/**
 * JSON-RPC 2.0 error codes
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
 * LSP Response Error
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
   * Convert to JSON-RPC error object
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
