/**
 * Transport lifecycle events
 */

import { EventEmitter } from 'node:events';
import type { Message } from '../jsonrpc/messages.js';

/**
 * Transport event emitter
 */
export class TransportEventEmitter extends EventEmitter {
  /**
   * Emit connect event
   */
  emitConnect(): void {
    this.emit('connect');
  }

  /**
   * Emit disconnect event
   */
  emitDisconnect(): void {
    this.emit('disconnect');
  }

  /**
   * Emit error event
   */
  emitError(error: Error): void {
    this.emit('error', error);
  }

  /**
   * Emit message event
   */
  emitMessage(message: Message): void {
    this.emit('message', message);
  }
}
