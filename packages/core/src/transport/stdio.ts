/**
 * StdioTransport - Transport implementation using stdin/stdout
 */

import type { Readable, Writable } from 'node:stream';
import { MessageReader } from '../jsonrpc/reader.js';
import { MessageWriter } from '../jsonrpc/writer.js';
import type { Message } from '../jsonrpc/messages.js';
import type { Disposable } from '../utils/disposable.js';
import type { Transport } from './transport.js';

/**
 * StdioTransport options
 */
export interface StdioTransportOptions {
  input?: Readable;
  output?: Writable;
}

/**
 * Transport implementation using stdin/stdout streams
 */
export class StdioTransport implements Transport {
  private readonly reader: MessageReader;
  private readonly writer: MessageWriter;
  private connected: boolean;
  private readonly messageHandlers: Set<(message: Message) => void>;
  private readonly errorHandlers: Set<(error: Error) => void>;
  private readonly closeHandlers: Set<() => void>;

  constructor(options: StdioTransportOptions = {}) {
    const input = options.input ?? process.stdin;
    const output = options.output ?? process.stdout;

    this.reader = new MessageReader(input);
    this.writer = new MessageWriter(output);
    this.connected = true;
    this.messageHandlers = new Set();
    this.errorHandlers = new Set();
    this.closeHandlers = new Set();

    // Set up reader event handlers
    this.reader.on('message', (message) => {
      this.messageHandlers.forEach((handler) => {
        try {
          handler(message);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      });
    });

    this.reader.on('error', (error) => {
      this.errorHandlers.forEach((handler) => {
        try {
          handler(error);
        } catch (err) {
          console.error('Error in error handler:', err);
        }
      });
    });

    this.reader.on('close', () => {
      this.handleClose();
    });

    // Set up writer event handlers
    this.writer.on('error', (error) => {
      this.errorHandlers.forEach((handler) => {
        try {
          handler(error);
        } catch (err) {
          console.error('Error in error handler:', err);
        }
      });
    });

    this.writer.on('close', () => {
      this.handleClose();
    });
  }

  /**
   * Send a message
   */
  async send(message: Message): Promise<void> {
    if (!this.connected) {
      throw new Error('Transport is not connected');
    }
    await this.writer.write(message);
  }

  /**
   * Subscribe to incoming messages
   */
  onMessage(handler: (message: Message) => void): Disposable {
    this.messageHandlers.add(handler);
    return {
      dispose: () => {
        this.messageHandlers.delete(handler);
      }
    };
  }

  /**
   * Subscribe to errors
   */
  onError(handler: (error: Error) => void): Disposable {
    this.errorHandlers.add(handler);
    return {
      dispose: () => {
        this.errorHandlers.delete(handler);
      }
    };
  }

  /**
   * Subscribe to close events
   */
  onClose(handler: () => void): Disposable {
    this.closeHandlers.add(handler);
    return {
      dispose: () => {
        this.closeHandlers.delete(handler);
      }
    };
  }

  /**
   * Close the transport
   */
  async close(): Promise<void> {
    if (!this.connected) {
      return;
    }

    this.connected = false;
    this.reader.close();
    this.writer.close();

    // Don't close stdin/stdout as they're shared resources
    // Just clean up our handlers
    this.handleClose();
  }

  /**
   * Check if transport is connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Handle connection close
   */
  private handleClose(): void {
    if (!this.connected) {
      return;
    }

    this.connected = false;

    this.closeHandlers.forEach((handler) => {
      try {
        handler();
      } catch (error) {
        console.error('Error in close handler:', error);
      }
    });

    // Clear all handlers
    this.messageHandlers.clear();
    this.errorHandlers.clear();
    this.closeHandlers.clear();
  }
}
