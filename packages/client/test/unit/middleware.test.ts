import { describe, expect, it } from 'vitest';
import type { Disposable, Message, Transport } from '@lspeasy/core';
import { LSPClient } from '../../src/client.js';

class MockTransport implements Transport {
  private messageHandlers = new Set<(message: Message) => void>();
  private closeHandlers = new Set<() => void>();
  private errorHandlers = new Set<(error: Error) => void>();

  async send(message: Message): Promise<void> {
    if ('id' in message && 'method' in message) {
      if (message.method === 'initialize') {
        this.emitMessage({
          jsonrpc: '2.0',
          id: message.id,
          result: { capabilities: {} }
        });
      }
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
    for (const handler of this.closeHandlers) {
      handler();
    }
  }

  isConnected(): boolean {
    return true;
  }

  emitMessage(message: Message): void {
    for (const handler of this.messageHandlers) {
      handler(message);
    }
  }
}

describe('client middleware', () => {
  it('observes initialize request/response flow', async () => {
    const calls: Array<{ direction: string; type: string; method: string }> = [];

    const client = new LSPClient({
      middleware: [
        async (context, next) => {
          calls.push({
            direction: context.direction,
            type: context.messageType,
            method: context.method
          });
          return next();
        }
      ]
    });

    await client.connect(new MockTransport());

    expect(calls.some((entry) => entry.direction === 'clientToServer')).toBe(true);
    expect(calls.some((entry) => entry.direction === 'serverToClient')).toBe(true);
  });
});
