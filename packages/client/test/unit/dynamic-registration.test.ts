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

describe('dynamic registration', () => {
  it('accepts registerCapability and tracks runtime registrations', async () => {
    const transport = new MockTransport();
    const client = new LSPClient({
      capabilities: {
        workspace: {
          didChangeWatchedFiles: { dynamicRegistration: true }
        }
      }
    });

    await client.connect(transport);

    transport.emit({
      jsonrpc: '2.0',
      id: 'srv-register',
      method: 'client/registerCapability',
      params: {
        registrations: [
          {
            id: 'watchers-1',
            method: 'workspace/didChangeWatchedFiles',
            registerOptions: { watchers: [{ globPattern: '**/*.ts' }] }
          }
        ]
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const response = transport.sentMessages.find(
      (message) => 'id' in message && message.id === 'srv-register'
    ) as { result?: unknown; error?: { code: number } } | undefined;

    expect(response?.result).toBeNull();
    expect(response?.error).toBeUndefined();

    const runtime = client.getRuntimeCapabilities();
    expect(runtime.dynamicRegistrations).toHaveLength(1);
    expect(runtime.dynamicRegistrations[0]?.id).toBe('watchers-1');
    expect((client as unknown as Record<string, unknown>).workspace).toBeDefined();
  });

  it('returns -32602 for unknown unregister IDs', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    transport.emit({
      jsonrpc: '2.0',
      id: 'srv-unregister',
      method: 'client/unregisterCapability',
      params: {
        unregisterations: [{ id: 'missing', method: 'workspace/symbol' }]
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const response = transport.sentMessages.find(
      (message) => 'id' in message && message.id === 'srv-unregister' && 'error' in message
    ) as { error: { code: number } } | undefined;

    expect(response?.error.code).toBe(-32602);
  });

  it('unregisters existing capability successfully', async () => {
    const transport = new MockTransport();
    const client = new LSPClient({
      dynamicRegistration: {
        allowUndeclaredDynamicRegistration: true
      }
    });
    await client.connect(transport);

    transport.emit({
      jsonrpc: '2.0',
      id: 'srv-register-before-unregister',
      method: 'client/registerCapability',
      params: {
        registrations: [{ id: 'existing-id', method: 'workspace/symbol' }]
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    transport.emit({
      jsonrpc: '2.0',
      id: 'srv-unregister-existing',
      method: 'client/unregisterCapability',
      params: {
        unregisterations: [{ id: 'existing-id', method: 'workspace/symbol' }]
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const response = transport.sentMessages.find(
      (message) => 'id' in message && message.id === 'srv-unregister-existing'
    ) as { result?: unknown; error?: { code: number } } | undefined;

    expect(response?.error).toBeUndefined();
    expect(response?.result).toBeNull();
    expect(client.getRuntimeCapabilities().dynamicRegistrations).toHaveLength(0);
  });

  it('keeps registration metadata for selector-scoped entries', async () => {
    const transport = new MockTransport();
    const client = new LSPClient({
      capabilities: {
        textDocument: {
          completion: { dynamicRegistration: true }
        }
      }
    });
    await client.connect(transport);

    const selector = [{ language: 'python' }];
    transport.emit({
      jsonrpc: '2.0',
      id: 'srv-register-selector',
      method: 'client/registerCapability',
      params: {
        registrations: [
          {
            id: 'selector-1',
            method: 'textDocument/completion',
            registerOptions: { documentSelector: selector }
          }
        ]
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const registration = client
      .getRuntimeCapabilities()
      .dynamicRegistrations.find((entry) => entry.id === 'selector-1');

    expect(registration).toBeDefined();
    const options = registration?.registerOptions as { documentSelector?: unknown[] } | undefined;
    expect(options?.documentSelector).toEqual(selector);
  });

  it('rejects undeclared dynamic registration in strict mode', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    transport.emit({
      jsonrpc: '2.0',
      id: 'srv-register-strict',
      method: 'client/registerCapability',
      params: {
        registrations: [{ id: 'r1', method: 'textDocument/definition' }]
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const response = transport.sentMessages.find(
      (message) => 'id' in message && message.id === 'srv-register-strict' && 'error' in message
    ) as { error: { code: number; message: string } } | undefined;

    expect(response?.error.code).toBe(-32602);
    expect(response?.error.message).toContain('Dynamic registration not declared');
  });

  it('accepts undeclared registration in compatibility mode', async () => {
    const transport = new MockTransport();
    const client = new LSPClient({
      dynamicRegistration: {
        allowUndeclaredDynamicRegistration: true
      }
    });
    await client.connect(transport);

    transport.emit({
      jsonrpc: '2.0',
      id: 'srv-register-compat',
      method: 'client/registerCapability',
      params: {
        registrations: [{ id: 'r-compat', method: 'textDocument/definition' }]
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 0));

    const response = transport.sentMessages.find(
      (message) => 'id' in message && message.id === 'srv-register-compat'
    ) as { result?: unknown; error?: { code: number } } | undefined;

    expect(response?.error).toBeUndefined();
    expect(response?.result).toBeNull();

    const runtime = client.getRuntimeCapabilities();
    expect(
      runtime.dynamicRegistrations.some((registration) => registration.id === 'r-compat')
    ).toBe(true);
  });

  it('returns -32602 for invalid register params', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    transport.emit({
      jsonrpc: '2.0',
      id: 'srv-register-invalid',
      method: 'client/registerCapability',
      params: {
        registrations: [{ method: 'workspace/symbol' }]
      }
    } as unknown as Message);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const response = transport.sentMessages.find(
      (message) => 'id' in message && message.id === 'srv-register-invalid' && 'error' in message
    ) as { error: { code: number } } | undefined;

    expect(response?.error.code).toBe(-32602);
  });

  it('returns -32602 for invalid unregister params', async () => {
    const transport = new MockTransport();
    const client = new LSPClient();
    await client.connect(transport);

    transport.emit({
      jsonrpc: '2.0',
      id: 'srv-unregister-invalid',
      method: 'client/unregisterCapability',
      params: {
        unregisterations: [{ method: 'workspace/symbol' }]
      }
    } as unknown as Message);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const response = transport.sentMessages.find(
      (message) => 'id' in message && message.id === 'srv-unregister-invalid' && 'error' in message
    ) as { error: { code: number } } | undefined;

    expect(response?.error.code).toBe(-32602);
  });
});
