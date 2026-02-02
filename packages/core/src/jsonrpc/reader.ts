/**
 * MessageReader class for parsing JSON-RPC messages with framing
 * Pattern: MCP SDK's JSONRPCMessage handling
 */

import { EventEmitter } from 'node:events';
import type { Readable } from 'node:stream';
import { parseMessage } from './framing.js';

/**
 * MessageReader reads JSON-RPC messages from a stream
 */
export class MessageReader extends EventEmitter {
  private buffer: Buffer;
  private closed: boolean;

  constructor(private readonly stream: Readable) {
    super();
    this.buffer = Buffer.alloc(0);
    this.closed = false;

    // Set up stream event handlers
    this.stream.on('data', this.onData.bind(this));
    this.stream.on('error', this.onError.bind(this));
    this.stream.on('end', this.onEnd.bind(this));
    this.stream.on('close', this.onClose.bind(this));
  }

  /**
   * Handle incoming data
   */
  private onData(chunk: Buffer): void {
    if (this.closed) {
      return;
    }

    // Append to buffer
    this.buffer = Buffer.concat([this.buffer, chunk]);

    // Try to parse messages
    this.parseMessages();
  }

  /**
   * Parse all complete messages from buffer
   */
  private parseMessages(): void {
    while (this.buffer.length > 0 && !this.closed) {
      try {
        const result = parseMessage(this.buffer);

        if (!result) {
          // Incomplete message, wait for more data
          break;
        }

        const { message, bytesRead } = result;

        // Emit message
        this.emit('message', message);

        // Remove parsed bytes from buffer
        this.buffer = this.buffer.subarray(bytesRead);
      } catch (error) {
        this.emit('error', error instanceof Error ? error : new Error(String(error)));
        // Clear buffer on parse error
        this.buffer = Buffer.alloc(0);
        break;
      }
    }
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
   * Handle stream end
   */
  private onEnd(): void {
    if (!this.closed) {
      this.close();
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
   * Close the reader
   */
  close(): void {
    if (this.closed) {
      return;
    }

    this.closed = true;
    this.buffer = Buffer.alloc(0);

    // Remove stream listeners
    this.stream.removeAllListeners();

    // Emit close event
    this.emit('close');
  }

  /**
   * Check if reader is closed
   */
  isClosed(): boolean {
    return this.closed;
  }
}
