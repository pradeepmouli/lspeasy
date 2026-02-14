import { describe, expect, it } from 'vitest';
import type { IpcChildProcessLike, IpcParentProcessLike } from '../../../src/transport/ipc.js';
import { IpcTransport } from '../../../src/transport/ipc.js';

type Listener = (...args: unknown[]) => void;

class FakeIpcEndpoint {
  private readonly listeners = new Map<string, Set<Listener>>();
  readonly sent: unknown[] = [];
  connected = true;

  send(message: unknown): boolean {
    this.sent.push(message);
    return true;
  }

  on(event: string, listener: Listener): this {
    const set = this.listeners.get(event) ?? new Set();
    set.add(listener);
    this.listeners.set(event, set);
    return this;
  }

  off(event: string, listener: Listener): this {
    this.listeners.get(event)?.delete(listener);
    return this;
  }

  disconnect(): void {
    this.connected = false;
  }

  emit(event: string, ...args: unknown[]): void {
    for (const listener of this.listeners.get(event) ?? []) {
      listener(...args);
    }
  }
}

describe('IpcTransport', () => {
  it('handles parent-side message flow', async () => {
    const endpoint = new FakeIpcEndpoint() as unknown as IpcParentProcessLike;
    const transport = new IpcTransport({ role: 'parent', process: endpoint });

    const incoming = new Promise((resolve) => {
      transport.onMessage((message) => resolve(message));
    });

    (endpoint as unknown as FakeIpcEndpoint).emit('message', {
      jsonrpc: '2.0',
      method: 'window/logMessage',
      params: { message: 'hello' }
    });

    await expect(incoming).resolves.toMatchObject({ method: 'window/logMessage' });

    await transport.send({ jsonrpc: '2.0', id: 1, method: 'workspace/symbol' });
    expect((endpoint as unknown as FakeIpcEndpoint).sent).toHaveLength(1);

    await transport.close();
  });

  it('handles child-side message flow and disconnect close event', async () => {
    const endpoint = new FakeIpcEndpoint() as unknown as IpcChildProcessLike;
    const transport = new IpcTransport({ role: 'child', process: endpoint });

    const closeEvent = new Promise<void>((resolve) => {
      transport.onClose(() => resolve());
    });

    (endpoint as unknown as FakeIpcEndpoint).emit('disconnect');
    await closeEvent;
    expect(transport.isConnected()).toBe(false);
  });

  it('emits close on parent exit', async () => {
    const endpoint = new FakeIpcEndpoint() as unknown as IpcParentProcessLike;
    const transport = new IpcTransport({ role: 'parent', process: endpoint });

    const closeEvent = new Promise<void>((resolve) => {
      transport.onClose(() => resolve());
    });

    (endpoint as unknown as FakeIpcEndpoint).emit('exit');
    await closeEvent;
    expect(transport.isConnected()).toBe(false);
  });

  it('releases resources on explicit close', async () => {
    const endpoint = new FakeIpcEndpoint() as unknown as IpcParentProcessLike;
    const transport = new IpcTransport({ role: 'parent', process: endpoint });

    await transport.close();
    expect((endpoint as unknown as FakeIpcEndpoint).connected).toBe(false);
    expect(transport.isConnected()).toBe(false);
  });
});
