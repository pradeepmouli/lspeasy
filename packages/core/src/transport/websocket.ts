/**
 * WebSocket Transport implementation for LSP
 */

import type { Transport } from './transport.js';
import type { Message } from '../jsonrpc/messages.js';
import type { Disposable } from '../utils/disposable.js';
import { EventEmitter } from 'node:events';
import { WebSocket } from 'ws';

export interface WebSocketTransportOptions {
  /**
   * WebSocket URL for client mode (e.g., 'ws://localhost:3000')
   */
  url?: string;

  /**
   * Existing WebSocket instance for server mode
   */
  socket?: WebSocket;

  /**
   * Enable automatic reconnection (client mode only)
   */
  enableReconnect?: boolean;

  /**
   * Maximum number of reconnection attempts
   * @default 5
   */
  maxReconnectAttempts?: number;

  /**
   * Initial delay between reconnection attempts in milliseconds
   * @default 1000
   */
  reconnectDelay?: number;

  /**
   * Maximum delay between reconnection attempts in milliseconds
   * @default 30000
   */
  maxReconnectDelay?: number;

  /**
   * Multiplier for exponential backoff
   * @default 2
   */
  reconnectBackoffMultiplier?: number;
}

/**
 * WebSocket-based transport for LSP communication
 *
 * Supports both client and server modes:
 * - Client mode: Connects to a WebSocket server URL
 * - Server mode: Wraps an existing WebSocket connection
 */
export class WebSocketTransport implements Transport {
  private socket: WebSocket;
  private connected: boolean = false;
  private messageHandlers: Set<(message: Message) => void> = new Set();
  private errorHandlers: Set<(error: Error) => void> = new Set();
  private closeHandlers: Set<() => void> = new Set();
  private events: EventEmitter = new EventEmitter();

  // Reconnection state
  private readonly mode: 'client' | 'server';
  private readonly url: string | undefined;
  private readonly enableReconnect: boolean;
  private readonly maxReconnectAttempts: number;
  private readonly reconnectDelay: number;
  private readonly maxReconnectDelay: number;
  private readonly reconnectBackoffMultiplier: number;
  private reconnectAttempts: number = 0;
  private reconnectTimer: NodeJS.Timeout | undefined;
  private intentionallyClosed: boolean = false;

  constructor(options: WebSocketTransportOptions) {
    if (!options.url && !options.socket) {
      throw new Error('Either url or socket must be provided');
    }

    if (options.url && options.socket) {
      throw new Error('Cannot provide both url and socket');
    }

    this.mode = options.socket ? 'server' : 'client';
    this.url = options.url;
    this.enableReconnect = options.enableReconnect ?? false;
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 5;
    this.reconnectDelay = options.reconnectDelay ?? 1000;
    this.maxReconnectDelay = options.maxReconnectDelay ?? 30000;
    this.reconnectBackoffMultiplier = options.reconnectBackoffMultiplier ?? 2;

    if (options.socket) {
      // Server mode: use provided socket
      this.socket = options.socket;
      this.setupSocket();
    } else {
      // Client mode: create new connection
      this.socket = new WebSocket(this.url!);
      this.setupSocket();
    }
  }

  /**
   * Setup event handlers for the WebSocket
   */
  private setupSocket(): void {
    this.socket.on('open', () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = undefined;
      }
    });

    this.socket.on('message', (data: Buffer | string) => {
      try {
        const text = typeof data === 'string' ? data : data.toString('utf8');
        const message = JSON.parse(text) as Message;

        // Notify all message handlers
        for (const handler of this.messageHandlers) {
          try {
            handler(message);
          } catch (error) {
            // Handler errors shouldn't break other handlers
            console.error('Error in message handler:', error);
          }
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        this.notifyError(new Error(`Failed to parse message: ${err.message}`));
      }
    });

    this.socket.on('error', (error: Error) => {
      this.notifyError(error);
    });

    this.socket.on('close', () => {
      const wasConnected = this.connected;
      this.connected = false;

      // Notify close handlers
      for (const handler of this.closeHandlers) {
        try {
          handler();
        } catch (error) {
          console.error('Error in close handler:', error);
        }
      }

      // Attempt reconnection if enabled and not intentionally closed
      if (
        this.mode === 'client' &&
        this.enableReconnect &&
        !this.intentionallyClosed &&
        wasConnected &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.scheduleReconnect();
      }
    });
  }

  /**
   * Schedule a reconnection attempt with exponential backoff
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      return; // Already scheduled
    }

    this.reconnectAttempts++;

    // Calculate delay with exponential backoff
    const baseDelay =
      this.reconnectDelay * Math.pow(this.reconnectBackoffMultiplier, this.reconnectAttempts - 1);
    const delay = Math.min(baseDelay, this.maxReconnectDelay);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      this.attemptReconnect();
    }, delay);
  }

  /**
   * Attempt to reconnect to the server
   */
  private attemptReconnect(): void {
    if (this.intentionallyClosed || !this.url) {
      return;
    }

    try {
      this.socket = new WebSocket(this.url);
      this.setupSocket();
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.notifyError(
        new Error(`Reconnection attempt ${this.reconnectAttempts} failed: ${err.message}`)
      );

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect();
      }
    }
  }

  /**
   * Notify all error handlers
   */
  private notifyError(error: Error): void {
    for (const handler of this.errorHandlers) {
      try {
        handler(error);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    }
  }

  /**
   * Send a message through the WebSocket
   */
  async send(message: Message): Promise<void> {
    if (!this.connected || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    return new Promise((resolve, reject) => {
      const data = JSON.stringify(message);

      this.socket.send(data, (error) => {
        if (error) {
          reject(new Error(`Failed to send message: ${error.message}`));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Register a handler for incoming messages
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
   * Register a handler for transport errors
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
   * Register a handler for transport closure
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
   * Close the WebSocket connection
   */
  async close(): Promise<void> {
    this.intentionallyClosed = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }

    if (
      this.socket.readyState === WebSocket.OPEN ||
      this.socket.readyState === WebSocket.CONNECTING
    ) {
      return new Promise((resolve) => {
        const cleanup = () => {
          this.socket.removeAllListeners();
          resolve();
        };

        // Wait for close event or timeout
        this.socket.once('close', cleanup);
        setTimeout(cleanup, 5000); // 5 second timeout

        this.socket.close();
      });
    }
  }

  /**
   * Check if the transport is currently connected
   */
  isConnected(): boolean {
    return this.connected && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Get the current reconnection attempt count
   */
  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }

  /**
   * Check if reconnection is enabled
   */
  isReconnectEnabled(): boolean {
    return this.enableReconnect;
  }
}
