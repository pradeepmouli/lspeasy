import { describe, expect, it } from 'vitest';
import type { Disposable, Message, Transport } from '@lspeasy/core';
import { LSPClient } from '../../../src/client.js';

class MockTransport implements Transport {
  private messageHandlers = new Set<(message: Message) => void>();
  private closeHandlers = new Set<() => void>();

  async send(message: Message): Promise<void> {
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

describe('waitForNotification', () => {
  it('resolves when a matching notification arrives', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    const promise = client.waitForNotification('textDocument/publishDiagnostics', {
      timeout: 200
    });

    transport.emit({
      jsonrpc: '2.0',
      method: 'textDocument/publishDiagnostics',
      params: { uri: 'file:///tmp.ts', diagnostics: [] }
    });

    const result = await promise;
    expect(result).toEqual({ uri: 'file:///tmp.ts', diagnostics: [] });
  });

  it('resolves only when filter matches', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    const promise = client.waitForNotification('textDocument/publishDiagnostics', {
      timeout: 500,
      filter: (params) => params.uri === 'file:///match.ts'
    });

    transport.emit({
      jsonrpc: '2.0',
      method: 'textDocument/publishDiagnostics',
      params: { uri: 'file:///other.ts', diagnostics: [] }
    });

    transport.emit({
      jsonrpc: '2.0',
      method: 'textDocument/publishDiagnostics',
      params: { uri: 'file:///match.ts', diagnostics: [] }
    });

    const result = await promise;
    expect(result.uri).toBe('file:///match.ts');
  });

  it('rejects when timeout is reached', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    await expect(
      client.waitForNotification('textDocument/publishDiagnostics', {
        timeout: 30
      })
    ).rejects.toThrow(/Timed out waiting for notification/);
  });

  it('cleans up waiter state after resolution', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    const promise = client.waitForNotification('textDocument/publishDiagnostics', {
      timeout: 200
    });

    transport.emit({
      jsonrpc: '2.0',
      method: 'textDocument/publishDiagnostics',
      params: { uri: 'file:///cleanup.ts', diagnostics: [] }
    });

    await promise;

    const waiterSet = (client as unknown as { notificationWaiters: Set<unknown> })
      .notificationWaiters;
    expect(waiterSet.size).toBe(0);
  });

  it('supports multiple concurrent waiters for the same method', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    const first = client.waitForNotification('textDocument/publishDiagnostics', {
      timeout: 200,
      filter: (params) => params.uri === 'file:///first.ts'
    });

    const second = client.waitForNotification('textDocument/publishDiagnostics', {
      timeout: 200,
      filter: (params) => params.uri === 'file:///second.ts'
    });

    transport.emit({
      jsonrpc: '2.0',
      method: 'textDocument/publishDiagnostics',
      params: { uri: 'file:///first.ts', diagnostics: [] }
    });

    transport.emit({
      jsonrpc: '2.0',
      method: 'textDocument/publishDiagnostics',
      params: { uri: 'file:///second.ts', diagnostics: [] }
    });

    const [firstResult, secondResult] = await Promise.all([first, second]);
    expect(firstResult.uri).toBe('file:///first.ts');
    expect(secondResult.uri).toBe('file:///second.ts');
  });
});
