/**
 * MessageWriter class for serializing JSON-RPC messages with framing
 * Pattern: MCP SDK's message serialization
 */

import { EventEmitter } from 'node:events';
import type { Writable } from 'node:stream';
import { serializeMessage } from './framing.js';
import type { Message } from './messages.js';

/**
 * MessageWriter writes JSON-RPC messages to a stream
 */
export class MessageWriter extends EventEmitter {
  private closed: boolean;
  private writing: boolean;
  private queue: Buffer[];

  // Bound references to *this instance's own* listeners — see the matching
  // comment in MessageReader for why `close()` must remove exactly these
  // instead of every listener on the stream.
  private readonly onErrorBound: (error: Error) => void;
  private readonly onCloseBound: () => void;

  constructor(private readonly stream: Writable) {
    super();
    this.closed = false;
    this.writing = false;
    this.queue = [];

    this.onErrorBound = this.onError.bind(this);
    this.onCloseBound = this.onClose.bind(this);

    // Set up stream event handlers
    this.stream.on('error', this.onErrorBound);
    this.stream.on('close', this.onCloseBound);
  }

  /**
   * Write a message to the stream
   */
  async write(message: Message): Promise<void> {
    if (this.closed) {
      throw new Error('MessageWriter is closed');
    }

    const buffer = serializeMessage(message);
    this.queue.push(buffer);

    if (!this.writing) {
      await this.flush();
    }
  }

  /**
   * Flush all queued messages
   */
  private async flush(): Promise<void> {
    if (this.writing || this.queue.length === 0) {
      return;
    }

    this.writing = true;

    while (this.queue.length > 0 && !this.closed) {
      const buffer = this.queue.shift()!;

      try {
        await this.writeBuffer(buffer);
      } catch (error) {
        this.emit('error', error instanceof Error ? error : new Error(String(error)));
        break;
      }
    }

    this.writing = false;
  }

  /**
   * Write a buffer to the stream
   */
  private writeBuffer(buffer: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stream.write(buffer, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Handle stream error
   */
  private onError(error: Error): void {
    if (!this.closed) {
      this.emit('error', error);
    }
  }

  /**
   * Handle stream close
   */
  private onClose(): void {
    if (!this.closed) {
      this.close();
    }
  }

  /**
   * Close the writer
   */
  close(): void {
    if (this.closed) {
      return;
    }

    this.closed = true;
    this.queue = [];

    // Remove only the listeners *this* writer attached (see MessageReader's
    // close() for why removeAllListeners() would be wrong here).
    this.stream.removeListener('error', this.onErrorBound);
    this.stream.removeListener('close', this.onCloseBound);

    // Emit close event
    this.emit('close');
  }

  /**
   * Check if writer is closed
   */
  isClosed(): boolean {
    return this.closed;
  }
}
