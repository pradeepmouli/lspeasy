import type { Message } from '../jsonrpc/messages.js';
import { messageSchema } from '../jsonrpc/schemas.js';
import type { Disposable } from '../utils/disposable.js';
import type { Transport } from './transport.js';
import type {
  MessagePortLike,
  SharedWorkerLike,
  WorkerMessageEventLike,
  WorkerTransportEnvelope
} from './worker-types.js';
import { isMessage, isWorkerTransportEnvelope } from './worker-types.js';

export interface SharedWorkerTransportOptions {
  port?: MessagePortLike;
  worker?: SharedWorkerLike;
  clientId: string;
}

/** JSON-RPC transport for Shared Worker environments with per-client envelope routing. */
export class SharedWorkerTransport implements Transport {
  private readonly port: MessagePortLike;
  private readonly clientId: string;
  private readonly messageHandlers = new Set<(message: Message) => void>();
  private readonly errorHandlers = new Set<(error: Error) => void>();
  private readonly closeHandlers = new Set<() => void>();
  private connected = true;

  private readonly onPortMessage = (event: WorkerMessageEventLike): void => {
    if (!this.connected) {
      return;
    }

    const data = event.data;

    if (isMessage(data)) {
      const validated = messageSchema.safeParse(data);
      if (!validated.success) {
        this.onPortError(new Error('Invalid JSON-RPC message received on SharedWorker transport'));
        return;
      }

      for (const handler of this.messageHandlers) {
        handler(validated.data as Message);
      }
      return;
    }

    if (isWorkerTransportEnvelope(data)) {
      if (data.clientId !== this.clientId) {
        return;
      }

      const validated = messageSchema.safeParse(data.message);
      if (!validated.success) {
        this.onPortError(new Error('Invalid JSON-RPC envelope message on SharedWorker transport'));
        return;
      }

      for (const handler of this.messageHandlers) {
        handler(validated.data as Message);
      }
    }
  };

  private readonly onPortError = (event: unknown): void => {
    const error = event instanceof Error ? event : new Error('Shared worker transport error');

    for (const handler of this.errorHandlers) {
      handler(error);
    }
  };

  constructor(options: SharedWorkerTransportOptions) {
    this.clientId = options.clientId;
    this.port =
      options.port ??
      options.worker?.port ??
      (() => {
        throw new Error('SharedWorkerTransport requires a MessagePort or SharedWorker');
      })();

    this.port.start?.();
    this.port.addEventListener('message', this.onPortMessage);
    this.port.addEventListener('messageerror', this.onPortError);
    this.port.addEventListener('error', this.onPortError);
  }

  async send(message: Message): Promise<void> {
    if (!this.connected) {
      throw new Error('Transport is not connected');
    }

    const payload: WorkerTransportEnvelope = {
      clientId: this.clientId,
      message
    };

    this.port.postMessage(payload);
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
    this.port.removeEventListener('message', this.onPortMessage);
    this.port.removeEventListener('messageerror', this.onPortError);
    this.port.removeEventListener('error', this.onPortError);
    this.port.close?.();

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
