import { describe, expect, it } from 'vitest';
import { DedicatedWorkerTransport } from '../packages/core/src/transport/dedicated-worker.js';
import type { Message } from '../packages/core/src/jsonrpc/messages.js';
import type { WorkerLike } from '../packages/core/src/transport/worker-types.js';

class LinkedWorker implements WorkerLike {
  peer?: LinkedWorker;
  private readonly messageHandlers = new Set<(event: { data: unknown }) => void>();
  private readonly errorHandlers = new Set<(event: unknown) => void>();

  postMessage(message: Message): void {
    this.peer?.emitMessage(message);
  }

  addEventListener(event: 'message' | 'error', handler: (event: any) => void): void {
    if (event === 'message') {
      this.messageHandlers.add(handler);
      return;
    }
    this.errorHandlers.add(handler);
  }

  removeEventListener(event: 'message' | 'error', handler: (event: any) => void): void {
    if (event === 'message') {
      this.messageHandlers.delete(handler);
      return;
    }
    this.errorHandlers.delete(handler);
  }

  private emitMessage(message: Message): void {
    for (const handler of this.messageHandlers) {
      handler({ data: message });
    }
  }
}

describe('Dedicated Worker Transport Integration', () => {
  it('exchanges json-rpc payloads between linked worker peers', async () => {
    const left = new LinkedWorker();
    const right = new LinkedWorker();
    left.peer = right;
    right.peer = left;

    const a = new DedicatedWorkerTransport({ worker: left });
    const b = new DedicatedWorkerTransport({ worker: right });

    const received = new Promise<Message>((resolve) => {
      b.onMessage((message) => resolve(message));
    });

    await a.send({ jsonrpc: '2.0', method: 'window/logMessage', params: { message: 'hello' } });

    await expect(received).resolves.toMatchObject({ method: 'window/logMessage' });

    await a.close();
    await b.close();
  });
});
