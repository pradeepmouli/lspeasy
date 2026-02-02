/**
 * Transport interface for pluggable communication layers
 */

import type { Message } from '../jsonrpc/messages.js';
import type { Disposable } from '../utils/disposable.js';

/**
 * Transport interface for sending/receiving JSON-RPC messages
 */
export interface Transport {
  /**
   * Send a message to the remote peer
   */
  send(message: Message): Promise<void>;

  /**
   * Subscribe to incoming messages
   * @returns Disposable to unsubscribe
   */
  onMessage(handler: (message: Message) => void): Disposable;

  /**
   * Subscribe to transport errors
   * @returns Disposable to unsubscribe
   */
  onError(handler: (error: Error) => void): Disposable;

  /**
   * Subscribe to connection close
   * @returns Disposable to unsubscribe
   */
  onClose(handler: () => void): Disposable;

  /**
   * Close the transport connection
   */
  close(): Promise<void>;

  /**
   * Check if transport is connected
   */
  isConnected(): boolean;
}
