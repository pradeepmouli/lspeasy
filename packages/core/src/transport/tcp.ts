import { createServer, Socket, connect as connectTcp } from 'node:net';
import type { Server as NetServer } from 'node:net';
import type { Message } from '../jsonrpc/messages.js';
import { MessageReader } from '../jsonrpc/reader.js';
import { MessageWriter } from '../jsonrpc/writer.js';
import { messageSchema } from '../jsonrpc/schemas.js';
import type { Disposable } from '../utils/disposable.js';
import type { Transport } from './transport.js';

export interface TcpReconnectOptions {
  enabled?: boolean;
  initialDelayMs?: number;
  maxDelayMs?: number;
  multiplier?: number;
  maxAttempts?: number;
}

/** Options for TCP transport in client or server mode. */
export interface TcpTransportOptions {
  mode: 'client' | 'server';
  host?: string;
  port: number;
  reconnect?: TcpReconnectOptions;
}

/** JSON-RPC transport over Node.js TCP sockets. */
export class TcpTransport implements Transport {
  private readonly options: TcpTransportOptions;
  private socket: Socket | undefined;
  private listener: NetServer | undefined;
  private reader: MessageReader | undefined;
  private writer: MessageWriter | undefined;
  private connected = false;
  private reconnectTimer: NodeJS.Timeout | undefined;
  private reconnectAttempts = 0;
  private intentionallyClosed = false;

  private readonly messageHandlers = new Set<(message: Message) => void>();
  private readonly errorHandlers = new Set<(error: Error) => void>();
  private readonly closeHandlers = new Set<() => void>();

  constructor(options: TcpTransportOptions) {
    this.options = {
      ...options,
      host: options.host ?? '127.0.0.1'
    };

    if (this.options.mode === 'client') {
      this.connectClient();
    } else {
      this.listenServer();
    }
  }

  private connectClient(): void {
    const socket = connectTcp({ host: this.options.host, port: this.options.port });
    this.attachSocket(socket);
  }

  private listenServer(): void {
    this.listener = createServer((socket) => {
      if (this.socket && this.connected) {
        this.emitError(new Error('TCP transport already has an active connection'));
        socket.destroy();
        return;
      }

      this.attachSocket(socket);
    });

    this.listener.on('error', (error) => this.emitError(error));
    this.listener.listen(this.options.port, this.options.host);
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

      if (
        this.options.mode === 'client' &&
        wasConnected &&
        !this.intentionallyClosed &&
        this.options.reconnect?.enabled
      ) {
        this.scheduleReconnect();
      }

      this.emitClose();
    });

    socket.on('error', (error) => this.emitError(error));

    this.reader.on('message', (message) => {
      const validated = messageSchema.safeParse(message);
      if (!validated.success) {
        this.emitError(new Error('Invalid JSON-RPC message received on TCP transport'));
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
      this.connectClient();
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

    if (this.listener) {
      if (this.listener.listening) {
        await new Promise<void>((resolve) => {
          this.listener!.close(() => resolve());
        });
      }
    }

    this.emitClose();
  }

  isConnected(): boolean {
    return this.connected;
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
