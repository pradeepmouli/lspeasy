import { describe, expect, it } from 'vitest';
import type { Disposable, Message, Transport } from '@lspeasy/core';
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

describe('client notebook namespace', () => {
  it('sends notebook document sync notifications through convenience methods', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    await client.notebookDocument.didOpen({
      notebookDocument: {
        uri: 'file:///nb',
        notebookType: 'jupyter-notebook',
        version: 1,
        cells: []
      },
      cellTextDocuments: []
    });

    await client.notebookDocument.didChange({
      notebookDocument: {
        uri: 'file:///nb',
        version: 2
      },
      change: {}
    });

    await client.notebookDocument.didSave({
      notebookDocument: {
        uri: 'file:///nb'
      }
    });

    await client.notebookDocument.didClose({
      notebookDocument: {
        uri: 'file:///nb'
      },
      cellTextDocuments: []
    });

    const methods = transport.sentMessages
      .filter(
        (message): message is Message & { method: string } =>
          'method' in message && typeof (message as { method?: unknown }).method === 'string'
      )
      .map((message) => message.method);

    expect(methods).toContain('notebookDocument/didOpen');
    expect(methods).toContain('notebookDocument/didChange');
    expect(methods).toContain('notebookDocument/didSave');
    expect(methods).toContain('notebookDocument/didClose');
  });
});
