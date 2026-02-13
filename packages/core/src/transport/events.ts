/**
 * Transport lifecycle events
 */

import { DisposableEventEmitter } from '../utils/disposable-event-emitter.js';
import type { Message } from '../jsonrpc/messages.js';

type TransportEventMap = {
  connect: [];
  disconnect: [];
  error: [Error];
  message: [Message];
};

/**
 * Transport event emitter
 */
export class TransportEventEmitter extends DisposableEventEmitter<TransportEventMap> {
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
