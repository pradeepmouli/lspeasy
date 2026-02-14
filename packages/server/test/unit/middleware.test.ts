import { describe, expect, it } from 'vitest';
import type { Disposable, Message, Transport } from '@lspeasy/core';
import { LSPServer } from '../../src/server.js';

class MockTransport implements Transport {
  private readonly messageHandlers = new Set<(message: Message) => void>();
  sent: Message[] = [];

  async send(message: Message): Promise<void> {
    this.sent.push(message);
  }

  onMessage(handler: (message: Message) => void): Disposable {
    this.messageHandlers.add(handler);
    return { dispose: () => this.messageHandlers.delete(handler) };
  }

  onError(): Disposable {
    return { dispose: () => undefined };
  }

  onClose(): Disposable {
    return { dispose: () => undefined };
  }

  async close(): Promise<void> {}

  isConnected(): boolean {
    return true;
  }

  emit(message: Message): void {
    for (const handler of this.messageHandlers) {
      handler(message);
    }
  }
}

describe('server middleware', () => {
  it('observes inbound client request during initialize', async () => {
    const calls: string[] = [];
    const transport = new MockTransport();

    const server = new LSPServer({
      middleware: [
        async (context, next) => {
          calls.push(`${context.direction}:${context.method}`);
          return next();
        }
      ]
    });

    server.setCapabilities({});
    await server.listen(transport);

    transport.emit({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        processId: null,
        clientInfo: { name: 'test-client' },
        capabilities: {},
        rootUri: null
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(calls.some((entry) => entry === 'clientToServer:initialize')).toBe(true);
    expect(transport.sent.some((message) => 'id' in message && message.id === 1)).toBe(true);

    await server.close();
  });
});
