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
  private chunks: Buffer[];
  private totalLength: number;
  private closed: boolean;

  constructor(private readonly stream: Readable) {
    super();
    this.chunks = [];
    this.totalLength = 0;
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

    // Add chunk to array instead of concatenating
    this.chunks.push(chunk);
    this.totalLength += chunk.length;

    // Try to parse messages
    this.parseMessages();
  }

  /**
   * Parse all complete messages from buffer
   */
  private parseMessages(): void {
    while (this.totalLength > 0 && !this.closed) {
      try {
        // Concatenate chunks only when parsing
        const buffer =
          this.chunks.length === 1 ? this.chunks[0]! : Buffer.concat(this.chunks, this.totalLength);
        const result = parseMessage(buffer);

        if (!result) {
          // Incomplete message, wait for more data
          // Optimize by combining chunks if we have multiple
          if (this.chunks.length > 1) {
            this.chunks = [buffer];
          }
          break;
        }

        const { message, bytesRead } = result;

        // Emit message
        this.emit('message', message);

        // Remove parsed bytes from buffer efficiently
        if (bytesRead === this.totalLength) {
          // Consumed all data
          this.chunks = [];
          this.totalLength = 0;
        } else {
          // Create new buffer with remaining data
          const remaining = buffer.subarray(bytesRead);
          this.chunks = [remaining];
          this.totalLength = remaining.length;
        }
      } catch (error) {
        this.emit('error', error instanceof Error ? error : new Error(String(error)));
        // Clear buffer on parse error
        this.chunks = [];
        this.totalLength = 0;
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
    this.chunks = [];
    this.totalLength = 0;

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
