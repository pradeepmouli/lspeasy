import { describe, expect, it } from 'vitest';
import { SharedWorkerTransport } from '../packages/core/src/transport/shared-worker.js';
import type { MessagePortLike } from '../packages/core/src/transport/worker-types.js';

class FakePort implements MessagePortLike {
  private readonly listeners = new Map<string, Set<(event: any) => void>>();
  readonly sent: unknown[] = [];

  postMessage(message: unknown): void {
    this.sent.push(message);
  }

  addEventListener(
    event: 'message' | 'messageerror' | 'error',
    handler: (event: any) => void
  ): void {
    const set = this.listeners.get(event) ?? new Set();
    set.add(handler);
    this.listeners.set(event, set);
  }

  removeEventListener(
    event: 'message' | 'messageerror' | 'error',
    handler: (event: any) => void
  ): void {
    this.listeners.get(event)?.delete(handler);
  }

  start(): void {
    return;
  }

  close(): void {
    return;
  }

  emit(event: 'message' | 'messageerror' | 'error', data: unknown): void {
    for (const handler of this.listeners.get(event) ?? []) {
      handler({ data });
    }
  }
}

describe('Shared Worker Transport Integration', () => {
  it('isolates incoming envelopes by client id', async () => {
    const port = new FakePort();
    const transport = new SharedWorkerTransport({ port, clientId: 'client-1' });

    const received: unknown[] = [];
    transport.onMessage((message) => received.push(message));

    port.emit('message', {
      clientId: 'client-2',
      message: { jsonrpc: '2.0', method: 'window/logMessage', params: { message: 'ignored' } }
    });

    port.emit('message', {
      clientId: 'client-1',
      message: { jsonrpc: '2.0', method: 'window/logMessage', params: { message: 'accepted' } }
    });

    expect(received).toHaveLength(1);
    await transport.close();
  });
});
