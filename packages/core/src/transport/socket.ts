import { connect as connectNet, type Socket } from 'node:net';
import type { Message } from '../jsonrpc/messages.js';
import { MessageReader } from '../jsonrpc/reader.js';
import { MessageWriter } from '../jsonrpc/writer.js';
import { messageSchema } from '../jsonrpc/schemas.js';
import type { Disposable } from '../utils/disposable.js';
import type { Transport } from './transport.js';
import type { TcpReconnectOptions } from './tcp.js';

/** Options for SocketTransport — either a Unix domain socket path or a TCP host:port. */
export type SocketTransportOptions =
  | { path: string; reconnect?: TcpReconnectOptions }
  | { host: string; port: number; reconnect?: TcpReconnectOptions };

/** JSON-RPC transport over a Node.js socket — supports both Unix domain sockets and TCP. */
export class SocketTransport implements Transport {
  private readonly options: SocketTransportOptions;
  private socket: Socket | undefined;
  private reader: MessageReader | undefined;
  private writer: MessageWriter | undefined;
  private connected = false;
  private reconnectTimer: NodeJS.Timeout | undefined;
  private reconnectAttempts = 0;
  private intentionallyClosed = false;

  private readonly messageHandlers = new Set<(message: Message) => void>();
  private readonly errorHandlers = new Set<(error: Error) => void>();
  private readonly closeHandlers = new Set<() => void>();

  constructor(options: SocketTransportOptions) {
    this.options = options;
    this.connectSocket();
  }

  private connectSocket(): void {
    // Clean up old socket and listeners before reconnecting
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.destroy();
    }
    if (this.reader) {
      this.reader.removeAllListeners();
      this.reader.close();
    }
    if (this.writer) {
      this.writer.removeAllListeners();
      this.writer.close();
    }

    const socket =
      'path' in this.options
        ? connectNet({ path: this.options.path })
        : connectNet({ host: this.options.host, port: this.options.port });

    this.attachSocket(socket);
  }

  private attachSocket(socket: Socket): void {
    this.socket = socket;
    this.reader = new MessageReader(socket);
    this.writer = new MessageWriter(socket);

    if (!socket.connecting) {
      this.connected = true;
      this.reconnectAttempts = 0;
    }

    socket.on('connect', () => {
      this.connected = true;
      this.reconnectAttempts = 0;
    });

    socket.on('close', () => {
      const wasConnected = this.connected;
      this.connected = false;

      this.reader?.close();
      this.writer?.close();

      if (wasConnected && !this.intentionallyClosed && this.options.reconnect?.enabled) {
        this.scheduleReconnect();
      }

      if (!this.intentionallyClosed) {
        this.emitClose();
      }
    });

    socket.on('error', (error) => this.emitError(error));

    this.reader.on('message', (message) => {
      const validated = messageSchema.safeParse(message);
      if (!validated.success) {
        this.emitError(new Error('Invalid JSON-RPC message received on socket transport'));
        return;
      }

      for (const handler of this.messageHandlers) {
        handler(validated.data as Message);
      }
    });

    this.reader.on('error', (error) => this.emitError(error));
    this.writer.on('error', (error) => this.emitError(error));
  }

  private scheduleReconnect(): void {
    const reconnect = this.options.reconnect;
    if (!reconnect?.enabled) {
      return;
    }

    const maxAttempts = reconnect.maxAttempts ?? 5;
    if (this.reconnectAttempts >= maxAttempts) {
      return;
    }

    const initial = reconnect.initialDelayMs ?? 250;
    const max = reconnect.maxDelayMs ?? 5000;
    const multiplier = reconnect.multiplier ?? 2;

    const delay = Math.min(initial * multiplier ** this.reconnectAttempts, max);
    this.reconnectAttempts += 1;

    this.reconnectTimer = setTimeout(() => {
      this.connectSocket();
    }, delay);
  }

  async send(message: Message): Promise<void> {
    if (!this.connected || !this.writer) {
      throw new Error('Transport is not connected');
    }

    await this.writer.write(message);
  }

  onMessage(handler: (message: Message) => void): Disposable {
    this.messageHandlers.add(handler);
    return { dispose: () => this.messageHandlers.delete(handler) };
  }

  onError(handler: (error: Error) => void): Disposable {
    this.errorHandlers.add(handler);
    return { dispose: () => this.errorHandlers.delete(handler) };
  }

  onClose(handler: () => void): Disposable {
    this.closeHandlers.add(handler);
    return { dispose: () => this.closeHandlers.delete(handler) };
  }

  async close(): Promise<void> {
    if (this.intentionallyClosed) {
      return;
    }

    this.intentionallyClosed = true;
    this.connected = false;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }

    this.socket?.destroy();
    this.reader?.close();
    this.writer?.close();

    this.emitClose();
  }

  isConnected(): boolean {
    return this.connected;
  }

  /** Resolves once the underlying socket fires `connect`, or immediately if already connected. */
  waitForConnect(): Promise<void> {
    if (this.connected) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const socket = this.socket;
      if (!socket) {
        reject(new Error('SocketTransport: no socket'));
        return;
      }
      const onConnect = () => {
        socket.off('error', onError);
        resolve();
      };
      const onError = (err: Error) => {
        socket.off('connect', onConnect);
        reject(err);
      };
      socket.once('connect', onConnect);
      socket.once('error', onError);
    });
  }

  private emitError(error: Error): void {
    for (const handler of this.errorHandlers) {
      handler(error);
    }
  }

  private emitClose(): void {
    for (const handler of this.closeHandlers) {
      handler();
    }
  }
}

/**
 * Wraps an already-connected `Socket` (e.g. from a `net.Server` connection event)
 * as a `Transport`. Useful for the proxy server's incoming CLI connections.
 */
export function socketToTransport(socket: Socket): Transport {
  const reader = new MessageReader(socket);
  const writer = new MessageWriter(socket);

  const messageHandlers = new Set<(message: Message) => void>();
  const errorHandlers = new Set<(error: Error) => void>();
  const closeHandlers = new Set<() => void>();

  let closed = false;

  function emitError(error: Error): void {
    for (const handler of errorHandlers) {
      handler(error);
    }
  }

  function emitClose(): void {
    for (const handler of closeHandlers) {
      handler();
    }
  }

  reader.on('message', (message) => {
    const validated = messageSchema.safeParse(message);
    if (!validated.success) {
      emitError(new Error('Invalid JSON-RPC message received on socket transport'));
      return;
    }
    for (const handler of messageHandlers) {
      handler(validated.data as Message);
    }
  });

  reader.on('error', (error) => emitError(error as Error));
  writer.on('error', (error) => emitError(error as Error));

  socket.on('close', () => {
    if (closed) return;
    closed = true;
    reader.close();
    writer.close();
    emitClose();
  });

  socket.on('error', (error) => emitError(error));

  return {
    async send(message: Message): Promise<void> {
      if (closed || socket.destroyed) {
        throw new Error('Transport is not connected');
      }
      await writer.write(message);
    },

    onMessage(handler: (message: Message) => void): Disposable {
      messageHandlers.add(handler);
      return { dispose: () => messageHandlers.delete(handler) };
    },

    onError(handler: (error: Error) => void): Disposable {
      errorHandlers.add(handler);
      return { dispose: () => errorHandlers.delete(handler) };
    },

    onClose(handler: () => void): Disposable {
      closeHandlers.add(handler);
      return { dispose: () => closeHandlers.delete(handler) };
    },

    async close(): Promise<void> {
      if (closed) return;
      closed = true;
      reader.close();
      writer.close();
      socket.destroy();
      emitClose();
    },

    isConnected(): boolean {
      return !closed && !socket.destroyed;
    }
  };
}
