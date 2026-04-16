import { describe, expect, it } from 'vitest';
import type { Disposable, Message, Transport } from '@lspeasy/core';
import { LSPClient } from '../../src/client.js';

class MockTransport implements Transport {
  private messageHandlers = new Set<(message: Message) => void>();
  private closeHandlers = new Set<() => void>();
  sentMessages: Message[] = [];

  async send(message: Message): Promise<void> {
    this.sentMessages.push(message);
    if ('id' in message && 'method' in message && message.method === 'initialize') {
      this.emit({
        jsonrpc: '2.0',
        id: message.id,
        result: { capabilities: {} }
      });
    }
  }

  onMessage(handler: (message: Message) => void): Disposable {
    this.messageHandlers.add(handler);
    return { dispose: () => this.messageHandlers.delete(handler) };
  }

  onError(): Disposable {
    return { dispose: () => undefined };
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

  emit(message: Message): void {
    for (const handler of this.messageHandlers) {
      handler(message);
    }
  }
}

describe('server-to-client request handling', () => {
  it('supports typed request handlers and sends successful response', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    client.onRequest('workspace/applyEdit', async (params) => {
      expect(params.edit).toBeDefined();
      return { applied: true };
    });

    transport.emit({
      jsonrpc: '2.0',
      id: 'srv-1',
      method: 'workspace/applyEdit',
      params: {
        label: 'apply',
        edit: { changes: {} }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const response = transport.sentMessages.find(
      (message) => 'id' in message && message.id === 'srv-1' && 'result' in message
    );

    expect(response).toBeDefined();
    expect((response as { result: { applied: boolean } }).result.applied).toBe(true);
  });

  it('correlates responses using the original request id', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    client.onRequest('workspace/applyEdit', async () => ({ applied: true }));

    transport.emit({
      jsonrpc: '2.0',
      id: 77,
      method: 'workspace/applyEdit',
      params: { edit: { changes: {} } }
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const response = transport.sentMessages.find(
      (message) => 'id' in message && message.id === 77 && 'result' in message
    );

    expect(response).toBeDefined();
  });

  it('returns method not found error when no handler is registered', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    transport.emit({
      jsonrpc: '2.0',
      id: 'srv-404',
      method: 'workspace/applyEdit',
      params: { edit: { changes: {} } }
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const response = transport.sentMessages.find(
      (message) => 'id' in message && message.id === 'srv-404' && 'error' in message
    ) as { error: { code: number } } | undefined;

    expect(response?.error.code).toBe(-32601);
  });

  it('returns internal error when handler throws', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    client.onRequest('workspace/applyEdit', async () => {
      throw new Error('boom');
    });

    transport.emit({
      jsonrpc: '2.0',
      id: 'srv-500',
      method: 'workspace/applyEdit',
      params: { edit: { changes: {} } }
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const response = transport.sentMessages.find(
      (message) => 'id' in message && message.id === 'srv-500' && 'error' in message
    ) as { error: { code: number; message: string } } | undefined;

    expect(response?.error.code).toBe(-32603);
    expect(response?.error.message).toContain('boom');
  });
});
