import type { Message } from '../jsonrpc/messages.js';
import type { Disposable } from '../utils/disposable.js';
import type { Transport } from './transport.js';
import type { WorkerLike, WorkerMessageEventLike } from './worker-types.js';
import { isMessage } from './worker-types.js';

export interface DedicatedWorkerTransportOptions {
  worker: WorkerLike;
  terminateOnClose?: boolean;
}

/** JSON-RPC transport backed by a Dedicated Worker instance. */
export class DedicatedWorkerTransport implements Transport {
  private readonly worker: WorkerLike;
  private readonly terminateOnClose: boolean;
  private readonly messageHandlers = new Set<(message: Message) => void>();
  private readonly errorHandlers = new Set<(error: Error) => void>();
  private readonly closeHandlers = new Set<() => void>();
  private connected = true;

  private readonly onWorkerMessage = (event: WorkerMessageEventLike): void => {
    if (!this.connected || !isMessage(event.data)) {
      return;
    }

    for (const handler of this.messageHandlers) {
      handler(event.data);
    }
  };

  private readonly onWorkerError = (event: unknown): void => {
    const error = event instanceof Error ? event : new Error('Worker transport error');
    for (const handler of this.errorHandlers) {
      handler(error);
    }
  };

  constructor(options: DedicatedWorkerTransportOptions) {
    this.worker = options.worker;
    this.terminateOnClose = options.terminateOnClose ?? false;

    this.worker.addEventListener('message', this.onWorkerMessage);
    this.worker.addEventListener('error', this.onWorkerError);
  }

  async send(message: Message): Promise<void> {
    if (!this.connected) {
      throw new Error('Transport is not connected');
    }

    this.worker.postMessage(message);
  }

  onMessage(handler: (message: Message) => void): Disposable {
    this.messageHandlers.add(handler);
    return {
      dispose: () => {
        this.messageHandlers.delete(handler);
      }
    };
  }

  onError(handler: (error: Error) => void): Disposable {
    this.errorHandlers.add(handler);
    return {
      dispose: () => {
        this.errorHandlers.delete(handler);
      }
    };
  }

  onClose(handler: () => void): Disposable {
    this.closeHandlers.add(handler);
    return {
      dispose: () => {
        this.closeHandlers.delete(handler);
      }
    };
  }

  async close(): Promise<void> {
    if (!this.connected) {
      return;
    }

    this.connected = false;
    this.worker.removeEventListener('message', this.onWorkerMessage);
    this.worker.removeEventListener('error', this.onWorkerError);

    if (this.terminateOnClose) {
      this.worker.terminate?.();
    }

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
