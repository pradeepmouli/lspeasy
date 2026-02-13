import type { ChildProcess } from 'node:child_process';
import type { Message } from '../jsonrpc/messages.js';
import type { Disposable } from '../utils/disposable.js';
import type { Transport } from './transport.js';

export interface IpcParentProcessLike {
  send(message: unknown): boolean;
  on(event: 'message', listener: (message: unknown) => void): this;
  on(event: 'exit', listener: () => void): this;
  on(event: 'error', listener: (error: Error) => void): this;
  off(event: 'message', listener: (message: unknown) => void): this;
  off(event: 'exit', listener: () => void): this;
  off(event: 'error', listener: (error: Error) => void): this;
  disconnect?(): void;
}

export interface IpcChildProcessLike {
  send?(message: unknown): boolean;
  on(event: 'message', listener: (message: unknown) => void): this;
  on(event: 'disconnect', listener: () => void): this;
  on(event: 'error', listener: (error: Error) => void): this;
  off(event: 'message', listener: (message: unknown) => void): this;
  off(event: 'disconnect', listener: () => void): this;
  off(event: 'error', listener: (error: Error) => void): this;
  disconnect?(): void;
  connected?: boolean;
}

/** Options for creating an IPC transport bound to parent or child process role. */
export interface IpcTransportOptions {
  role: 'parent' | 'child';
  process?: ChildProcess | IpcParentProcessLike | IpcChildProcessLike;
}

function isMessage(candidate: unknown): candidate is Message {
  return (
    typeof candidate === 'object' &&
    candidate !== null &&
    (candidate as Record<string, unknown>)['jsonrpc'] === '2.0'
  );
}

/** JSON-RPC transport over Node.js process IPC channels. */
export class IpcTransport implements Transport {
  private readonly endpoint: IpcParentProcessLike | IpcChildProcessLike;
  private connected = true;
  private readonly messageHandlers = new Set<(message: Message) => void>();
  private readonly errorHandlers = new Set<(error: Error) => void>();
  private readonly closeHandlers = new Set<() => void>();

  private readonly onEndpointMessage = (message: unknown): void => {
    if (!this.connected || !isMessage(message)) {
      return;
    }

    for (const handler of this.messageHandlers) {
      handler(message);
    }
  };

  private readonly onEndpointError = (error: Error): void => {
    for (const handler of this.errorHandlers) {
      handler(error);
    }
  };

  private readonly onEndpointClose = (): void => {
    this.connected = false;
    for (const handler of this.closeHandlers) {
      handler();
    }
  };

  constructor(options: IpcTransportOptions) {
    this.endpoint =
      options.process ?? (options.role === 'child' ? (process as IpcChildProcessLike) : undefined!);

    if (!this.endpoint) {
      throw new Error('IpcTransport requires a process endpoint');
    }

    this.endpoint.on('message', this.onEndpointMessage);
    this.endpoint.on('error', this.onEndpointError);

    if (options.role === 'parent') {
      (this.endpoint as IpcParentProcessLike).on('exit', this.onEndpointClose);
    } else {
      (this.endpoint as IpcChildProcessLike).on('disconnect', this.onEndpointClose);
    }
  }

  async send(message: Message): Promise<void> {
    if (!this.connected) {
      throw new Error('Transport is not connected');
    }

    if (typeof this.endpoint.send !== 'function') {
      throw new Error('IPC endpoint cannot send messages');
    }

    const ok = this.endpoint.send(message);
    if (!ok) {
      throw new Error('IPC send failed');
    }
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
    if (!this.connected) {
      return;
    }

    this.connected = false;
    this.endpoint.off('message', this.onEndpointMessage);
    this.endpoint.off('error', this.onEndpointError);

    (this.endpoint as IpcParentProcessLike).off('exit', this.onEndpointClose);
    (this.endpoint as IpcChildProcessLike).off('disconnect', this.onEndpointClose);

    this.endpoint.disconnect?.();

    for (const handler of this.closeHandlers) {
      handler();
    }

    this.messageHandlers.clear();
    this.errorHandlers.clear();
    this.closeHandlers.clear();
  }

  isConnected(): boolean {
    return this.connected;
  }
}
