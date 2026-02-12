/**
 * WebSocket Transport implementation for LSP
 */

import type { Transport } from './transport.js';
import type { Message } from '../jsonrpc/messages.js';
import type { Disposable } from '../utils/disposable.js';
import { createRequire } from 'node:module';

type CloseLikeEvent = { type: 'close' };
type ErrorLikeEvent = { error?: unknown };
type MessageLikeEvent = { data: unknown };

type WebSocketLike = {
  readonly readyState: number;
  send(data: string, callback?: (error?: Error) => void): void;
  close(): void;
  on?(event: 'open', handler: () => void): void;
  on?(event: 'message', handler: (data: Buffer | string) => void): void;
  on?(event: 'error', handler: (error: Error) => void): void;
  on?(event: 'close', handler: () => void): void;
  once?(event: 'close', handler: () => void): void;
  addEventListener?(event: 'open', handler: () => void): void;
  addEventListener?(event: 'message', handler: (event: MessageLikeEvent) => void): void;
  addEventListener?(event: 'error', handler: (event: ErrorLikeEvent) => void): void;
  addEventListener?(event: 'close', handler: (event: CloseLikeEvent) => void): void;
};

const READY_STATE_CONNECTING = 0;
const READY_STATE_OPEN = 1;

export interface WebSocketTransportOptions {
  /**
   * WebSocket URL for client mode (e.g., 'ws://localhost:3000')
   */
  url?: string;

  /**
   * Existing WebSocket instance for server mode
   */
  socket?: WebSocketLike;

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

function hasEventEmitterAPI(socket: WebSocketLike): boolean {
  return typeof socket.on === 'function';
}

function getNativeWebSocketCtor(): ((url: string) => WebSocketLike) | undefined {
  if (typeof globalThis.WebSocket === 'undefined') {
    return undefined;
  }

  const ctor = globalThis.WebSocket;
  return (url: string) => new ctor(url) as unknown as WebSocketLike;
}

function getWsWebSocketCtor(): ((url: string) => WebSocketLike) | undefined {
  try {
    const require = createRequire(import.meta.url);
    const moduleValue = require('ws') as
      | { WebSocket?: new (url: string) => WebSocketLike }
      | (new (url: string) => WebSocketLike);

    if (typeof moduleValue === 'function') {
      return (url: string) => new moduleValue(url);
    }

    if (moduleValue.WebSocket) {
      return (url: string) => new moduleValue.WebSocket!(url);
    }

    return undefined;
  } catch {
    return undefined;
  }
}

export function createWebSocketClient(url: string): WebSocketLike {
  const nativeCtor = getNativeWebSocketCtor();
  if (nativeCtor) {
    return nativeCtor(url);
  }

  const wsCtor = getWsWebSocketCtor();
  if (wsCtor) {
    return wsCtor(url);
  }

  throw new Error(
    'WebSocket client unavailable. Use Node.js >= 22.4 for native globalThis.WebSocket, or install "ws" as an optional peer dependency.'
  );
}

function parseIncomingMessage(data: unknown): Message {
  if (typeof data === 'string') {
    return JSON.parse(data) as Message;
  }

  if (data instanceof Uint8Array) {
    return JSON.parse(Buffer.from(data).toString('utf8')) as Message;
  }

  if (data instanceof ArrayBuffer) {
    return JSON.parse(Buffer.from(data).toString('utf8')) as Message;
  }

  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(data)) {
    return JSON.parse(data.toString('utf8')) as Message;
  }

  throw new Error('Unsupported WebSocket message payload type');
}

/**
 * WebSocket-based transport for LSP communication
 *
 * Supports both client and server modes:
 * - Client mode: Connects to a WebSocket server URL
 * - Server mode: Wraps an existing WebSocket connection
 */
export class WebSocketTransport implements Transport {
  private socket: WebSocketLike;
  private connected: boolean = false;
  private messageHandlers: Set<(message: Message) => void> = new Set();
  private errorHandlers: Set<(error: Error) => void> = new Set();
  private closeHandlers: Set<() => void> = new Set();

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
      this.socket = options.socket;
    } else {
      this.socket = createWebSocketClient(this.url!);
    }

    this.setupSocket();
  }

  /**
   * Setup event handlers for the WebSocket
   */
  private setupSocket(): void {
    if (hasEventEmitterAPI(this.socket)) {
      this.socket.on!('open', () => this.handleOpen());
      this.socket.on!('message', (data: Buffer | string) => this.handleMessageData(data));
      this.socket.on!('error', (error: Error) => this.notifyError(error));
      this.socket.on!('close', () => this.handleClose());
      return;
    }

    this.socket.addEventListener?.('open', () => this.handleOpen());
    this.socket.addEventListener?.('message', (event: MessageLikeEvent) => {
      this.handleMessageData(event.data);
    });
    this.socket.addEventListener?.('error', (event: ErrorLikeEvent) => {
      const error = event.error instanceof Error ? event.error : new Error('WebSocket error');
      this.notifyError(error);
    });
    this.socket.addEventListener?.('close', () => this.handleClose());
  }

  private handleOpen(): void {
    this.connected = true;
    this.reconnectAttempts = 0;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
  }

  private handleMessageData(data: unknown): void {
    try {
      const message = parseIncomingMessage(data);
      for (const handler of this.messageHandlers) {
        try {
          handler(message);
        } catch {
          // Ignore message-handler failures to avoid breaking the transport loop.
        }
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.notifyError(new Error(`Failed to parse message: ${err.message}`));
    }
  }

  private handleClose(): void {
    const wasConnected = this.connected;
    this.connected = false;

    for (const handler of this.closeHandlers) {
      try {
        handler();
      } catch {
        // Ignore close-handler failures.
      }
    }

    if (
      this.mode === 'client' &&
      this.enableReconnect &&
      !this.intentionallyClosed &&
      wasConnected &&
      this.reconnectAttempts < this.maxReconnectAttempts
    ) {
      this.scheduleReconnect();
    }
  }

  /**
   * Schedule a reconnection attempt with exponential backoff
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      return;
    }

    this.reconnectAttempts++;
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
      this.socket = createWebSocketClient(this.url);
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
      } catch {
        // Ignore error-handler failures.
      }
    }
  }

  /**
   * Send a message through the WebSocket
   */
  async send(message: Message): Promise<void> {
    if (!this.connected || this.socket.readyState !== READY_STATE_OPEN) {
      throw new Error('WebSocket is not connected');
    }

    return new Promise((resolve, reject) => {
      const data = JSON.stringify(message);

      if (hasEventEmitterAPI(this.socket)) {
        this.socket.send(data, (error?: Error) => {
          if (error) {
            reject(new Error(`Failed to send message: ${error.message}`));
            return;
          }
          resolve();
        });
        return;
      }

      try {
        this.socket.send(data);
        resolve();
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        reject(new Error(`Failed to send message: ${err.message}`));
      }
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
      this.socket.readyState === READY_STATE_OPEN ||
      this.socket.readyState === READY_STATE_CONNECTING
    ) {
      return new Promise((resolve) => {
        const cleanup = () => {
          resolve();
        };

        if (hasEventEmitterAPI(this.socket) && this.socket.once) {
          this.socket.once('close', cleanup);
        } else {
          this.socket.addEventListener?.('close', cleanup as () => void);
        }

        setTimeout(cleanup, 5000);

        this.socket.close();
      });
    }
  }

  /**
   * Check if the transport is currently connected
   */
  isConnected(): boolean {
    return this.connected && this.socket.readyState === READY_STATE_OPEN;
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
