/**
 * JSON-RPC 2.0 message framing with Content-Length headers
 * Pattern: MCP SDK's parseMessage with header parsing
 */

import type { Message } from './messages.js';

/**
 * Header constants
 */
export const CONTENT_LENGTH_HEADER = 'Content-Length';
export const CONTENT_TYPE_HEADER = 'Content-Type';
export const DEFAULT_CONTENT_TYPE = 'application/vscode-jsonrpc; charset=utf-8';

/**
 * Parse headers from buffer
 * Format: "Header-Name: value\r\n"
 */
export function parseHeaders(
  buffer: Buffer
): { headers: Map<string, string>; bodyStart: number } | null {
  const headers = new Map<string, string>();
  let offset = 0;

  while (offset < buffer.length) {
    // Look for \r\n\r\n (end of headers)
    const lineEnd = buffer.indexOf('\r\n', offset);
    if (lineEnd === -1) {
      return null; // Incomplete headers
    }

    // Empty line signals end of headers
    if (lineEnd === offset) {
      return { headers, bodyStart: offset + 2 }; // Skip \r\n
    }

    // Parse header line
    const line = buffer.toString('utf8', offset, lineEnd);
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) {
      throw new Error(`Invalid header line: ${line}`);
    }

    const name = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();
    headers.set(name, value);

    offset = lineEnd + 2; // Skip \r\n
  }

  return null; // Incomplete headers
}

/**
 * Parses a single framed JSON-RPC 2.0 message from a raw byte buffer.
 *
 * @remarks
 * This is the low-level framing parser used internally by Node.js transports
 * (`StdioTransport`, `TcpTransport`). The buffer may contain partial data;
 * `null` is returned when more bytes are needed.
 *
 * The framing format is the LSP base protocol:
 * `Content-Length: <n>\r\n\r\n<json-body>`.
 *
 * @param buffer - Raw byte buffer that may contain one or more framed messages.
 * @returns An object with the parsed `message` and `bytesRead`, or `null` if
 *   the buffer does not yet contain a complete framed message.
 * @throws If `Content-Length` is missing or the JSON body cannot be parsed.
 *
 * @category JSON-RPC
 */
export function parseMessage(buffer: Buffer): { message: Message; bytesRead: number } | null {
  // Parse headers
  const headerResult = parseHeaders(buffer);
  if (!headerResult) {
    return null; // Incomplete headers
  }

  const { headers, bodyStart } = headerResult;

  // Extract Content-Length
  const contentLengthStr = headers.get(CONTENT_LENGTH_HEADER);
  if (!contentLengthStr) {
    throw new Error('Missing Content-Length header');
  }

  const contentLength = parseInt(contentLengthStr, 10);
  if (Number.isNaN(contentLength) || contentLength < 0) {
    throw new Error(`Invalid Content-Length: ${contentLengthStr}`);
  }

  // Check if we have the full body
  const totalLength = bodyStart + contentLength;
  if (buffer.length < totalLength) {
    return null; // Incomplete body
  }

  // Extract and parse JSON body
  const bodyBuffer = buffer.subarray(bodyStart, totalLength);
  const bodyStr = bodyBuffer.toString('utf8');

  let message: Message;
  try {
    message = JSON.parse(bodyStr) as Message;
  } catch (error) {
    throw new Error(
      `Failed to parse JSON-RPC message: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  return { message, bytesRead: totalLength };
}

/**
 * Serializes a JSON-RPC 2.0 message into a framed byte buffer with
 * `Content-Length` and `Content-Type` headers.
 *
 * @remarks
 * Counterpart of `parseMessage`. Used internally by Node.js transports.
 * The output format is:
 * `Content-Length: <n>\r\nContent-Type: application/vscode-jsonrpc; charset=utf-8\r\n\r\n<json>`.
 *
 * @param message - The JSON-RPC message to serialize.
 * @returns A `Buffer` containing the complete framed message ready for I/O.
 *
 * @category JSON-RPC
 */
export function serializeMessage(message: Message): Buffer {
  // Serialize JSON body
  const bodyStr = JSON.stringify(message);
  const bodyBuffer = Buffer.from(bodyStr, 'utf8');

  // Build headers
  const headers = [
    `${CONTENT_LENGTH_HEADER}: ${bodyBuffer.length}`,
    `${CONTENT_TYPE_HEADER}: ${DEFAULT_CONTENT_TYPE}`,
    '',
    ''
  ].join('\r\n');

  const headerBuffer = Buffer.from(headers, 'utf8');

  // Combine headers + body
  return Buffer.concat([headerBuffer, bodyBuffer]);
}
