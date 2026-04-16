import { describe, expect, it } from 'vitest';
import { IpcTransport } from '../packages/core/src/transport/ipc.js';

type Listener = (...args: unknown[]) => void;

class LinkedIpcEndpoint {
  peer?: LinkedIpcEndpoint;
  private readonly listeners = new Map<string, Set<Listener>>();

  send(message: unknown): boolean {
    this.peer?.emit('message', message);
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
    this.emit('disconnect');
  }

  emit(event: string, ...args: unknown[]): void {
    for (const listener of this.listeners.get(event) ?? []) {
      listener(...args);
    }
  }
}

describe('IPC Transport Integration', () => {
  it('exchanges request/response style payloads across linked endpoints', async () => {
    const left = new LinkedIpcEndpoint();
    const right = new LinkedIpcEndpoint();
    left.peer = right;
    right.peer = left;

    const parent = new IpcTransport({ role: 'parent', process: left as never });
    const child = new IpcTransport({ role: 'child', process: right as never });

    const incoming = new Promise((resolve) => {
      child.onMessage((message) => resolve(message));
    });

    await parent.send({ jsonrpc: '2.0', id: 1, method: 'workspace/symbol' });
    await expect(incoming).resolves.toMatchObject({ method: 'workspace/symbol' });

    await parent.close();
    await child.close();
  });
});
