import { describe, expect, it } from 'vitest';
import type { Message } from '../../../src/jsonrpc/messages.js';
import { DedicatedWorkerTransport } from '../../../src/transport/dedicated-worker.js';
import { SharedWorkerTransport } from '../../../src/transport/shared-worker.js';
import type {
  MessagePortLike,
  SharedWorkerLike,
  WorkerLike,
  WorkerMessageEventLike
} from '../../../src/transport/worker-types.js';

class FakeWorker implements WorkerLike {
  private readonly listeners = new Map<string, Set<(event: any) => void>>();
  readonly sent: Message[] = [];
  terminated = false;

  postMessage(message: Message): void {
    this.sent.push(message);
  }

  addEventListener(event: 'message' | 'error', handler: (event: any) => void): void {
    const set = this.listeners.get(event) ?? new Set();
    set.add(handler);
    this.listeners.set(event, set);
  }

  removeEventListener(event: 'message' | 'error', handler: (event: any) => void): void {
    this.listeners.get(event)?.delete(handler);
  }

  emit(event: 'message' | 'error', data: unknown): void {
    const payload: WorkerMessageEventLike = { data };
    for (const handler of this.listeners.get(event) ?? []) {
      handler(event === 'message' ? payload : data);
    }
  }

  terminate(): void {
    this.terminated = true;
  }
}

class FakePort implements MessagePortLike {
  private readonly listeners = new Map<string, Set<(event: any) => void>>();
  readonly sent: unknown[] = [];
  started = 0;
  closed = 0;

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
    this.started += 1;
  }

  close(): void {
    this.closed += 1;
  }

  emit(event: 'message' | 'messageerror' | 'error', data: unknown): void {
    const payload: WorkerMessageEventLike = { data };
    for (const handler of this.listeners.get(event) ?? []) {
      handler(event === 'message' ? payload : data);
    }
  }
}

class FakeSharedWorker implements SharedWorkerLike {
  constructor(readonly port: FakePort) {}
}

describe('Worker transports', () => {
  it('delivers dedicated worker messages in order', async () => {
    const worker = new FakeWorker();
    const transport = new DedicatedWorkerTransport({ worker });

    const received: Message[] = [];
    transport.onMessage((message) => received.push(message));

    worker.emit('message', {
      jsonrpc: '2.0',
      method: 'window/logMessage',
      params: { message: 'a' }
    });
    worker.emit('message', {
      jsonrpc: '2.0',
      method: 'window/logMessage',
      params: { message: 'b' }
    });

    expect(
      received.map((entry) => (entry as { params?: { message?: string } }).params?.message)
    ).toEqual(['a', 'b']);

    await transport.close();
  });

  it('ignores invalid dedicated-worker messages and supports disposables', async () => {
    const worker = new FakeWorker();
    const transport = new DedicatedWorkerTransport({ worker });
    const received: Message[] = [];

    const disposable = transport.onMessage((message) => received.push(message));
    worker.emit('message', { not: 'jsonrpc-message' });
    expect(received).toHaveLength(0);

    disposable.dispose();
    worker.emit('message', {
      jsonrpc: '2.0',
      method: 'window/logMessage',
      params: { message: 'ignored-after-dispose' }
    });
    expect(received).toHaveLength(0);

    await transport.close();
  });

  it('routes shared worker envelopes by client id', async () => {
    const port = new FakePort();
    const transport = new SharedWorkerTransport({ port, clientId: 'client-a' });

    const received: Message[] = [];
    transport.onMessage((message) => received.push(message));

    port.emit('message', {
      clientId: 'client-b',
      message: { jsonrpc: '2.0', method: 'window/logMessage', params: { message: 'ignore' } }
    });

    port.emit('message', {
      clientId: 'client-a',
      message: { jsonrpc: '2.0', method: 'window/logMessage', params: { message: 'accept' } }
    });

    expect(received).toHaveLength(1);
    expect((received[0] as { params?: { message?: string } }).params?.message).toBe('accept');

    await transport.close();
  });

  it('supports shared-worker constructor fallback via worker.port', async () => {
    const port = new FakePort();
    const worker = new FakeSharedWorker(port);
    const transport = new SharedWorkerTransport({ worker, clientId: 'client-a' });

    const received: Message[] = [];
    transport.onMessage((message) => received.push(message));

    port.emit('message', {
      clientId: 'client-a',
      message: { jsonrpc: '2.0', method: 'window/logMessage', params: { message: 'ok' } }
    });

    expect(received).toHaveLength(1);
    await transport.close();
    expect(port.closed).toBe(1);
  });

  it('fails fast when shared worker activation info is missing', () => {
    expect(() => new SharedWorkerTransport({ clientId: 'missing' } as never)).toThrow(
      /requires a MessagePort or SharedWorker/
    );
  });

  it('emits shared-worker errors for invalid payloads and native events', async () => {
    const port = new FakePort();
    const transport = new SharedWorkerTransport({ port, clientId: 'client-a' });
    const errors: Error[] = [];

    transport.onError((error) => errors.push(error));

    port.emit('message', { jsonrpc: '2.0', method: 42 });
    port.emit('message', {
      clientId: 'client-a',
      message: { jsonrpc: '2.0', method: 42 }
    });
    port.emit('error', 'native-error');

    expect(errors.length).toBeGreaterThanOrEqual(3);
    expect(errors[0]?.message).toContain('Invalid JSON-RPC');

    await transport.close();
    expect(port.started).toBe(1);
    expect(port.closed).toBe(1);
  });

  it('normalizes shared-worker Error events and ignores post-close messages', async () => {
    const port = new FakePort();
    const transport = new SharedWorkerTransport({ port, clientId: 'client-a' });
    const errors: Error[] = [];
    const messages: Message[] = [];

    const onError = transport.onError((error) => errors.push(error));
    const onMessage = transport.onMessage((message) => messages.push(message));

    port.emit('error', new Error('boom'));
    expect(errors[0]?.message).toBe('boom');

    await transport.close();
    port.emit('message', {
      clientId: 'client-a',
      message: { jsonrpc: '2.0', method: 'window/logMessage', params: { message: 'late' } }
    });

    expect(messages).toHaveLength(0);
    onError.dispose();
    onMessage.dispose();
  });

  it('throws on send when shared worker transport is closed', async () => {
    const port = new FakePort();
    const transport = new SharedWorkerTransport({ port, clientId: 'client-a' });
    await transport.close();

    await expect(
      transport.send({ jsonrpc: '2.0', method: 'window/logMessage', params: {} })
    ).rejects.toThrow(/not connected/);
  });

  it('handles dedicated-worker close paths and terminateOnClose option', async () => {
    const worker = new FakeWorker();
    const transport = new DedicatedWorkerTransport({ worker, terminateOnClose: true });
    const errors: Error[] = [];

    transport.onError((error) => errors.push(error));
    worker.emit('error', 'non-error');

    expect(errors[0]?.message).toContain('Worker transport error');

    await transport.close();
    await transport.close();

    expect(worker.terminated).toBe(true);
    await expect(
      transport.send({ jsonrpc: '2.0', method: 'window/logMessage', params: {} })
    ).rejects.toThrow(/not connected/);
  });
});
