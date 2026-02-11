/**
 * Integration test for parameter validation
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LSPServer } from '../../src/server.js';
import { LogLevel } from '@lspeasy/core';
import type { Transport } from '@lspeasy/core';

// Mock transport
class TestTransport implements Transport {
  private messageHandlers: Array<(message: any) => void> = [];
  private errorHandlers: Array<(error: Error) => void> = [];
  private closeHandlers: Array<() => void> = [];
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

  onClose(handler: () => void) {
    this.closeHandlers.push(handler);
    return { dispose: () => {} };
  }

  async close(): Promise<void> {
    this._connected = false;
    for (const handler of this.closeHandlers) {
      handler();
    }
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

describe('Parameter Validation Integration', () => {
  let server: LSPServer;
  let transport: TestTransport;

  beforeEach(async () => {
    server = new LSPServer({
      name: 'validation-test-server',
      version: '1.0.0',
      logLevel: LogLevel.Error
    });

    server.setCapabilities({
      hoverProvider: true
    });

    server.onRequest('textDocument/hover', async () => {
      return { contents: 'test' };
    });

    transport = new TestTransport();
    await server.listen(transport);

    // Initialize
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

  it('should reject malformed hover params - missing textDocument', async () => {
    transport.simulateMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/hover',
      params: {
        // Missing textDocument
        position: { line: 0, character: 0 }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = transport.sentMessages[0];
    expect(response.error).toBeDefined();
    expect(response.error.code).toBe(-32602);
    expect(response.error.message).toContain('Invalid params');
  });

  it('should reject malformed hover params - missing position', async () => {
    transport.simulateMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/hover',
      params: {
        textDocument: { uri: 'file:///test.txt' }
        // Missing position
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = transport.sentMessages[0];
    expect(response.error).toBeDefined();
    expect(response.error.code).toBe(-32602);
  });

  it('should reject invalid position - negative line', async () => {
    transport.simulateMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/hover',
      params: {
        textDocument: { uri: 'file:///test.txt' },
        position: { line: -1, character: 0 }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = transport.sentMessages[0];
    expect(response.error).toBeDefined();
    expect(response.error.code).toBe(-32602);
  });

  it('should reject invalid position - negative character', async () => {
    transport.simulateMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/hover',
      params: {
        textDocument: { uri: 'file:///test.txt' },
        position: { line: 0, character: -1 }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = transport.sentMessages[0];
    expect(response.error).toBeDefined();
    expect(response.error.code).toBe(-32602);
  });

  it('should accept valid hover params', async () => {
    transport.simulateMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/hover',
      params: {
        textDocument: { uri: 'file:///test.txt' },
        position: { line: 5, character: 10 }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = transport.sentMessages[0];
    expect(response.result).toBeDefined();
    expect(response.error).toBeUndefined();
  });

  it('should use custom validation error handler', async () => {
    const customServer = new LSPServer({
      name: 'custom-validation-server',
      logLevel: LogLevel.Error,
      onValidationError: (error, _context) => {
        return {
          code: -32099,
          message: 'Custom validation error',
          data: { zodErrors: error.issues }
        };
      }
    });

    customServer.setCapabilities({ hoverProvider: true });
    customServer.onRequest('textDocument/hover', async () => ({ contents: 'test' }));

    const customTransport = new TestTransport();
    await customServer.listen(customTransport);

    // Initialize
    customTransport.simulateMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { processId: null, rootUri: null, capabilities: {} }
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    customTransport.sentMessages = [];

    // Send invalid params
    customTransport.simulateMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/hover',
      params: {
        position: { line: 0, character: 0 }
        // Missing textDocument
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = customTransport.sentMessages[0];
    expect(response.error).toBeDefined();
    expect(response.error.code).toBe(-32099);
    expect(response.error.message).toBe('Custom validation error');

    await customServer.close();
  });

  it('should skip validation when disabled', async () => {
    const noValidationServer = new LSPServer({
      name: 'no-validation-server',
      logLevel: LogLevel.Error,
      validateParams: false
    });

    noValidationServer.setCapabilities({ hoverProvider: true });
    noValidationServer.onRequest('textDocument/hover', async () => {
      return { contents: 'ok' };
    });

    const noValidationTransport = new TestTransport();
    await noValidationServer.listen(noValidationTransport);

    noValidationTransport.simulateMessage({
      jsonrpc: '2.0',
      id: 'init',
      method: 'initialize',
      params: {
        processId: null,
        rootUri: null,
        capabilities: {}
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    noValidationTransport.sentMessages = [];

    noValidationTransport.simulateMessage({
      jsonrpc: '2.0',
      id: 'hover',
      method: 'textDocument/hover',
      params: {
        position: { line: 0, character: 0 }
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = noValidationTransport.sentMessages[0];
    expect(response.error).toBeUndefined();
    expect(response.result).toBeDefined();

    await noValidationServer.close();
  });

  it('should skip validation for methods without schemas', async () => {
    server.onRequest('custom/method', async (params: any) => {
      return { result: params };
    });

    transport.simulateMessage({
      jsonrpc: '2.0',
      id: 2,
      method: 'custom/method',
      params: {
        // Any params should work
        custom: true,
        data: [1, 2, 3]
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = transport.sentMessages[0];
    expect(response.result).toBeDefined();
    expect(response.error).toBeUndefined();
  });

  it('should validate initialize params', async () => {
    const newServer = new LSPServer({ logLevel: LogLevel.Error });
    const newTransport = new TestTransport();
    await newServer.listen(newTransport);

    // Send invalid initialize params
    newTransport.simulateMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        processId: 'not a number', // Should be number or null
        rootUri: null,
        capabilities: {}
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = newTransport.sentMessages[0];
    expect(response.error).toBeDefined();
    expect(response.error.code).toBe(-32602);

    await newServer.close();
  });
});
