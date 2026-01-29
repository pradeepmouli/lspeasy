/**
 * Integration test for initialize handshake
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LSPServer } from '@lspy/server';
import type { Transport, InitializeParams } from '@lspy/core';

// Mock transport for testing
class TestTransport implements Transport {
  private messageHandlers: Array<(message: any) => void> = [];
  private errorHandlers: Array<(error: Error) => void> = [];
  public sentMessages: any[] = [];
  private _connected = true;

  async send(message: any): Promise<void> {
    this.sentMessages.push(message);
  }

  onMessage(handler: (message: any) => void) {
    this.messageHandlers.push(handler);
    return { dispose: () => {} };
  }

  onError(handler: (error: Error) => void) {
    this.errorHandlers.push(handler);
    return { dispose: () => {} };
  }

  async close(): Promise<void> {
    this._connected = false;
  }

  isConnected(): boolean {
    return this._connected;
  }

  // Test helper to simulate receiving a message
  simulateMessage(message: any): void {
    for (const handler of this.messageHandlers) {
      handler(message);
    }
  }

  // Test helper to simulate an error
  simulateError(error: Error): void {
    for (const handler of this.errorHandlers) {
      handler(error);
    }
  }
}

describe('Initialize Handshake Integration', () => {
  let server: LSPServer;
  let transport: TestTransport;

  beforeEach(async () => {
    server = new LSPServer({
      name: 'test-server',
      version: '1.0.0',
      logLevel: 'error'
    });

    server.setCapabilities({
      textDocumentSync: 1,
      hoverProvider: true
    });

    transport = new TestTransport();
    await server.listen(transport);
  });

  afterEach(async () => {
    await server.close();
  });

  it('should handle initialize request', async () => {
    const initializeParams: InitializeParams = {
      processId: null,
      rootUri: null,
      capabilities: {
        textDocument: {
          hover: { dynamicRegistration: true }
        }
      }
    };

    // Send initialize request
    transport.simulateMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: initializeParams
    });

    // Wait for response
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check response
    expect(transport.sentMessages.length).toBeGreaterThan(0);
    const response = transport.sentMessages[0];

    expect(response).toMatchObject({
      jsonrpc: '2.0',
      id: 1
    });

    expect(response.result).toBeDefined();
    expect(response.result.capabilities).toEqual({
      textDocumentSync: 1,
      hoverProvider: true
    });
    expect(response.result.serverInfo).toEqual({
      name: 'test-server',
      version: '1.0.0'
    });
  });

  it('should handle initialized notification', async () => {
    // First initialize
    transport.simulateMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        processId: null,
        rootUri: null,
        capabilities: {}
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Then send initialized notification
    const messageCount = transport.sentMessages.length;
    transport.simulateMessage({
      jsonrpc: '2.0',
      method: 'initialized',
      params: {}
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should not send any response to notification
    expect(transport.sentMessages.length).toBe(messageCount);
  });

  it('should reject requests before initialization', async () => {
    // Create new server without initializing
    const newServer = new LSPServer({ logLevel: 'error' });
    const newTransport = new TestTransport();
    await newServer.listen(newTransport);

    // Try to send a request before initialize
    newTransport.simulateMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'textDocument/hover',
      params: {
        textDocument: { uri: 'file:///test.txt' },
        position: { line: 0, character: 0 }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should get server not initialized error
    expect(newTransport.sentMessages.length).toBeGreaterThan(0);
    const response = newTransport.sentMessages[0];

    expect(response).toMatchObject({
      jsonrpc: '2.0',
      id: 1,
      error: {
        code: -32002,
        message: expect.stringContaining('not initialized')
      }
    });

    await newServer.close();
  });

  it('should reject double initialization', async () => {
    // First initialize
    transport.simulateMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        processId: null,
        rootUri: null,
        capabilities: {}
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Try to initialize again
    transport.simulateMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'initialize',
      params: {
        processId: null,
        rootUri: null,
        capabilities: {}
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should get error
    const secondResponse = transport.sentMessages.find((msg) => msg.id === 2);
    expect(secondResponse).toBeDefined();
    expect(secondResponse.error).toBeDefined();
    expect(secondResponse.error.code).toBe(-32600);
  });

  it('should handle shutdown request', async () => {
    // Initialize first
    transport.simulateMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        processId: null,
        rootUri: null,
        capabilities: {}
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Send shutdown
    transport.simulateMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'shutdown',
      params: null
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Should get shutdown response
    const shutdownResponse = transport.sentMessages.find((msg) => msg.id === 2);
    expect(shutdownResponse).toMatchObject({
      jsonrpc: '2.0',
      id: 2,
      result: null
    });
  });
});
