/**
 * Integration test for textDocument/hover request/response
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LSPServer } from '@lspy/server';
import type { Transport, HoverParams, Hover } from '@lspy/core';

// Mock transport
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

  simulateMessage(message: any): void {
    for (const handler of this.messageHandlers) {
      handler(message);
    }
  }
}

describe('textDocument/hover Integration', () => {
  let server: LSPServer;
  let transport: TestTransport;

  beforeEach(async () => {
    server = new LSPServer({
      name: 'hover-test-server',
      version: '1.0.0',
      logLevel: 'error'
    });

    server.setCapabilities({
      hoverProvider: true
    });

    // Register hover handler
    server.onRequest<'textDocument/hover', HoverParams, Hover | null>(
      'textDocument/hover',
      async (params, token) => {
        if (token.isCancellationRequested) {
          return null;
        }

        return {
          contents: {
            kind: 'markdown',
            value: `Hover at line ${params.position.line}`
          }
        };
      }
    );

    transport = new TestTransport();
    await server.listen(transport);

    // Initialize server
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
    transport.sentMessages = [];
  });

  afterEach(async () => {
    await server.close();
  });

  it('should handle hover request', async () => {
    const hoverParams: HoverParams = {
      textDocument: { uri: 'file:///test.txt' },
      position: { line: 5, character: 10 }
    };

    transport.simulateMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/hover',
      params: hoverParams
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(transport.sentMessages.length).toBeGreaterThan(0);
    const response = transport.sentMessages[0];

    expect(response).toMatchObject({
      jsonrpc: '2.0',
      id: 2
    });

    expect(response.result).toBeDefined();
    expect(response.result.contents).toEqual({
      kind: 'markdown',
      value: 'Hover at line 5'
    });
  });

  it('should return null for no hover', async () => {
    const noHoverServer = new LSPServer({ logLevel: 'error' });
    noHoverServer.setCapabilities({ hoverProvider: true });

    noHoverServer.onRequest<'textDocument/hover', HoverParams, Hover | null>(
      'textDocument/hover',
      async () => null
    );

    const noHoverTransport = new TestTransport();
    await noHoverServer.listen(noHoverTransport);

    // Initialize
    noHoverTransport.simulateMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { processId: null, rootUri: null, capabilities: {} }
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    noHoverTransport.sentMessages = [];

    // Request hover
    noHoverTransport.simulateMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/hover',
      params: {
        textDocument: { uri: 'file:///test.txt' },
        position: { line: 0, character: 0 }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = noHoverTransport.sentMessages[0];
    expect(response.result).toBeNull();

    await noHoverServer.close();
  });

  it('should handle multiple hover requests', async () => {
    // Send multiple hover requests
    for (let i = 0; i < 3; i++) {
      transport.simulateMessage({
        jsonrpc: '2.0',
        id: 100 + i,
        method: 'textDocument/hover',
        params: {
          textDocument: { uri: 'file:///test.txt' },
          position: { line: i, character: 0 }
        }
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(transport.sentMessages.length).toBe(3);

    // Check all responses
    for (let i = 0; i < 3; i++) {
      const response = transport.sentMessages[i];
      expect(response.id).toBe(100 + i);
      expect(response.result.contents.value).toBe(`Hover at line ${i}`);
    }
  });

  it('should handle hover with range', async () => {
    const rangeServer = new LSPServer({ logLevel: 'error' });
    rangeServer.setCapabilities({ hoverProvider: true });

    rangeServer.onRequest<'textDocument/hover', HoverParams, Hover | null>(
      'textDocument/hover',
      async (params) => {
        return {
          contents: 'Test hover',
          range: {
            start: params.position,
            end: { line: params.position.line, character: params.position.character + 5 }
          }
        };
      }
    );

    const rangeTransport = new TestTransport();
    await rangeServer.listen(rangeTransport);

    // Initialize
    rangeTransport.simulateMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { processId: null, rootUri: null, capabilities: {} }
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    rangeTransport.sentMessages = [];

    // Request hover
    rangeTransport.simulateMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/hover',
      params: {
        textDocument: { uri: 'file:///test.txt' },
        position: { line: 0, character: 5 }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = rangeTransport.sentMessages[0];
    expect(response.result.range).toEqual({
      start: { line: 0, character: 5 },
      end: { line: 0, character: 10 }
    });

    await rangeServer.close();
  });

  it('should handle errors in hover handler', async () => {
    const errorServer = new LSPServer({ logLevel: 'error' });
    errorServer.setCapabilities({ hoverProvider: true });

    errorServer.onRequest('textDocument/hover', async () => {
      throw new Error('Hover error');
    });

    const errorTransport = new TestTransport();
    await errorServer.listen(errorTransport);

    // Initialize
    errorTransport.simulateMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { processId: null, rootUri: null, capabilities: {} }
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    errorTransport.sentMessages = [];

    // Request hover
    errorTransport.simulateMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/hover',
      params: {
        textDocument: { uri: 'file:///test.txt' },
        position: { line: 0, character: 0 }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = errorTransport.sentMessages[0];
    expect(response.error).toBeDefined();
    expect(response.error.code).toBe(-32603);
    expect(response.error.message).toBe('Hover error');

    await errorServer.close();
  });
});
