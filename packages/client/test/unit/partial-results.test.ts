import { describe, expect, it, vi } from 'vitest';
import {
  CancellationTokenSource,
  type Disposable,
  type Message,
  type RequestMessage,
  type Transport
} from '@lspeasy/core';
import { LSPClient } from '../../src/client.js';

class MockTransport implements Transport {
  private readonly messageHandlers = new Set<(message: Message) => void>();
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

  onClose(): Disposable {
    return { dispose: () => undefined };
  }

  async close(): Promise<void> {
    return Promise.resolve();
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

function findRequest(transport: MockTransport, method: string): RequestMessage | undefined {
  return transport.sentMessages.find(
    (message) => 'id' in message && 'method' in message && message.method === method
  ) as RequestMessage | undefined;
}

describe('partial results', () => {
  it('streams callbacks and returns ordered aggregation', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    const onPartial = vi.fn<(value: string) => void>();
    const pending = client.sendRequestWithPartialResults(
      'workspace/symbol',
      { query: 'a' },
      { token: 'p1', onPartial }
    );

    const request = findRequest(transport, 'workspace/symbol');
    expect(request).toBeDefined();

    transport.emit({
      jsonrpc: '2.0',
      method: '$/progress',
      params: { token: 'p1', value: 'first' }
    });
    transport.emit({
      jsonrpc: '2.0',
      method: '$/progress',
      params: { token: 'p1', value: 'second' }
    });

    transport.emit({
      jsonrpc: '2.0',
      id: request!.id,
      result: ['final']
    });

    const result = await pending;

    expect(onPartial.mock.calls.map((args) => args[0])).toEqual(['first', 'second']);
    expect(result.partialResults).toEqual(['first', 'second']);
    expect(result.cancelled).toBe(false);
    if (!result.cancelled) {
      expect(result.finalResult).toEqual(['final']);
    }
  });

  it('ignores late partial notifications after final response', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    const onPartial = vi.fn<(value: number) => void>();
    const pending = client.sendRequestWithPartialResults(
      'workspace/symbol',
      { query: 'b' },
      { token: 'p2', onPartial }
    );

    const request = findRequest(transport, 'workspace/symbol');
    expect(request).toBeDefined();

    transport.emit({
      jsonrpc: '2.0',
      method: '$/progress',
      params: { token: 'p2', value: 1 }
    });

    transport.emit({
      jsonrpc: '2.0',
      id: request!.id,
      result: []
    });

    const result = await pending;

    transport.emit({
      jsonrpc: '2.0',
      method: '$/progress',
      params: { token: 'p2', value: 2 }
    });

    expect(result.partialResults).toEqual([1]);
    expect(onPartial).toHaveBeenCalledTimes(1);
  });

  it('returns structured cancellation outcome', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    const tokenSource = new CancellationTokenSource();

    const pending = client.sendRequestWithPartialResults(
      'workspace/symbol',
      { query: 'c' },
      {
        token: 'p3',
        onPartial: () => undefined
      },
      tokenSource.token
    );

    tokenSource.cancel();

    const result = await pending;

    expect(result.cancelled).toBe(true);
    expect(result.partialResults).toEqual([]);
    if (result.cancelled) {
      expect(result.finalResult).toBeUndefined();
    }
  });

  it('keeps standard sendRequest behavior when no partialResultToken is used', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    const pending = client.sendRequest('workspace/symbol', { query: 'no-partials' });
    const request = findRequest(transport, 'workspace/symbol');
    expect(request).toBeDefined();
    expect(request?.params).toEqual({ query: 'no-partials' });

    transport.emit({
      jsonrpc: '2.0',
      method: '$/progress',
      params: { token: 'untracked', value: 'ignored' }
    });

    transport.emit({
      jsonrpc: '2.0',
      id: request!.id,
      result: [{ name: 'symbol' }]
    });

    await expect(pending).resolves.toEqual([{ name: 'symbol' }]);
  });

  it('discards partial results and throws error on non-cancellation errors', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    const onPartial = vi.fn<(value: string) => void>();
    const pending = client.sendRequestWithPartialResults(
      'workspace/symbol',
      { query: 'error-test' },
      { token: 'p4', onPartial }
    );

    const request = findRequest(transport, 'workspace/symbol');
    expect(request).toBeDefined();

    // Send some partial results before the error
    transport.emit({
      jsonrpc: '2.0',
      method: '$/progress',
      params: { token: 'p4', value: 'partial1' }
    });
    transport.emit({
      jsonrpc: '2.0',
      method: '$/progress',
      params: { token: 'p4', value: 'partial2' }
    });

    // Send an error response (not cancellation)
    transport.emit({
      jsonrpc: '2.0',
      id: request!.id,
      error: { code: -32603, message: 'Internal error' }
    });

    // Verify the error is thrown
    await expect(pending).rejects.toThrow('Internal error');

    // Verify partial callbacks were called during collection
    expect(onPartial).toHaveBeenCalledTimes(2);
    expect(onPartial.mock.calls.map((args) => args[0])).toEqual(['partial1', 'partial2']);
  });
});
