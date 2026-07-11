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

  // Bound references to *this instance's own* listeners, so `close()` can
  // remove exactly these (see below) instead of nuking every listener on the
  // stream — a shared socket (e.g. SocketTransport/TcpTransport, where the
  // same socket backs both the MessageReader and the MessageWriter, plus the
  // transport's own 'close'/'error' handlers) would otherwise have every
  // OTHER consumer's listeners silently wiped out too.
  private readonly onDataBound: (chunk: Buffer) => void;
  private readonly onErrorBound: (error: Error) => void;
  private readonly onEndBound: () => void;
  private readonly onCloseBound: () => void;

  constructor(private readonly stream: Readable) {
    super();
    this.buffer = Buffer.alloc(0);
    this.closed = false;

    this.onDataBound = this.onData.bind(this);
    this.onErrorBound = this.onError.bind(this);
    this.onEndBound = this.onEnd.bind(this);
    this.onCloseBound = this.onClose.bind(this);

    // Set up stream event handlers
    this.stream.on('data', this.onDataBound);
    this.stream.on('error', this.onErrorBound);
    this.stream.on('end', this.onEndBound);
    this.stream.on('close', this.onCloseBound);
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

    // Remove only the listeners *this* reader attached. `removeAllListeners()`
    // would also strip listeners other consumers put directly on the same
    // stream (e.g. SocketTransport/TcpTransport share one socket between
    // MessageReader, MessageWriter, and the transport's own 'close'/'error'
    // handlers) — and since 'end' fires before 'close' on a stream, wiping
    // everything here would delete the transport's 'close' handler before
    // 'close' is ever emitted, so it silently never runs and callers never
    // learn the connection died (pending requests hang forever instead of
    // being rejected).
    this.stream.removeListener('data', this.onDataBound);
    this.stream.removeListener('error', this.onErrorBound);
    this.stream.removeListener('end', this.onEndBound);
    this.stream.removeListener('close', this.onCloseBound);

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
