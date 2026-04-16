/**
 * Transport interface for pluggable communication layers
 */

import type { Message } from '../jsonrpc/messages.js';
import type { Disposable } from '../utils/disposable.js';

/**
 * Pluggable communication layer for JSON-RPC message exchange.
 *
 * @remarks
 * `Transport` is the lowest-level abstraction in lspeasy. Every `LSPServer`
 * and `LSPClient` operates over a single `Transport` instance. Built-in
 * implementations include `WebSocketTransport` (browser + Node), and the
 * Node-only `StdioTransport`, `TcpTransport`, and `IpcTransport` from
 * `@lspeasy/core/node`.
 *
 * Implement this interface when you need a custom channel (e.g. in-process
 * message passing for tests, or a custom binary framing layer).
 *
 * @useWhen
 * You need a custom channel not covered by built-in transports — for example,
 * a web worker bridge, an in-process pipe for unit tests, or a proprietary
 * framing protocol.
 *
 * @avoidWhen
 * A built-in transport already satisfies your environment. Prefer
 * `WebSocketTransport`, `StdioTransport` (`@lspeasy/core/node`),
 * `TcpTransport` (`@lspeasy/core/node`), or `IpcTransport` (`@lspeasy/core/node`).
 *
 * @pitfalls
 * NEVER share one `Transport` instance between two `LSPServer` or `LSPClient`
 * instances — each connection maintains independent protocol state (pending
 * request IDs, lifecycle phase) and sharing causes ID collisions and state
 * desync.
 *
 * NEVER mix message framing styles on the same transport. `StdioTransport`
 * uses `Content-Length` framing; `WebSocketTransport` uses raw JSON over
 * WebSocket frames. Using a stdio-framing reader on a WebSocket connection
 * will corrupt the message stream.
 *
 * @example
 * ```ts
 * // Minimal in-process test transport
 * import type { Transport, Message, Disposable } from '@lspeasy/core';
 *
 * class InProcessTransport implements Transport {
 *   private peer?: InProcessTransport;
 *   private messageHandlers = new Set<(msg: Message) => void>();
 *   private errorHandlers = new Set<(err: Error) => void>();
 *   private closeHandlers = new Set<() => void>();
 *   private open = true;
 *
 *   link(other: InProcessTransport) { this.peer = other; }
 *
 *   async send(message: Message): Promise<void> {
 *     if (!this.open) throw new Error('Transport closed');
 *     this.peer?.messageHandlers.forEach(h => h(message));
 *   }
 *   onMessage(handler: (msg: Message) => void): Disposable {
 *     this.messageHandlers.add(handler);
 *     return { dispose: () => this.messageHandlers.delete(handler) };
 *   }
 *   onError(handler: (err: Error) => void): Disposable {
 *     this.errorHandlers.add(handler);
 *     return { dispose: () => this.errorHandlers.delete(handler) };
 *   }
 *   onClose(handler: () => void): Disposable {
 *     this.closeHandlers.add(handler);
 *     return { dispose: () => this.closeHandlers.delete(handler) };
 *   }
 *   async close(): Promise<void> {
 *     this.open = false;
 *     this.closeHandlers.forEach(h => h());
 *   }
 *   isConnected(): boolean { return this.open; }
 * }
 * ```
 *
 * @category Transport
 */
export interface Transport {
  /**
   * Send a message to the remote peer.
   *
   * @param message - The JSON-RPC message to send.
   * @throws If the transport is not connected or an I/O error occurs.
   */
  send(message: Message): Promise<void>;

  /**
   * Subscribe to incoming messages.
   *
   * @param handler - Callback invoked for each received message.
   * @returns A `Disposable` that unsubscribes the handler when disposed.
   */
  onMessage(handler: (message: Message) => void): Disposable;

  /**
   * Subscribe to transport errors.
   *
   * @param handler - Callback invoked when a transport-level error occurs.
   * @returns A `Disposable` that unsubscribes the handler when disposed.
   */
  onError(handler: (error: Error) => void): Disposable;

  /**
   * Subscribe to connection close.
   *
   * @param handler - Callback invoked when the transport is closed.
   * @returns A `Disposable` that unsubscribes the handler when disposed.
   */
  onClose(handler: () => void): Disposable;

  /**
   * Close the transport connection and release resources.
   */
  close(): Promise<void>;

  /**
   * Returns `true` if the transport is currently connected and able to
   * send messages.
   */
  isConnected(): boolean;
}
