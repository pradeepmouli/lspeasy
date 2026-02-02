/**
 * Integration test for capability-aware runtime behavior
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LSPServer } from '@lspeasy/server';
import type { Transport, ServerCapabilities, InitializeParams } from '@lspeasy/core';

// Simple test transport for capability testing
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

describe('Capability-Aware Runtime', () => {
  let server: LSPServer;
  let transport: TestTransport;

  beforeEach(() => {
    transport = new TestTransport();
  });

  describe('Server Capability Validation', () => {
    it('should allow handler registration for declared capabilities in non-strict mode', async () => {
      server = new LSPServer({
        name: 'test-server',
        strictCapabilities: false // Non-strict mode (default)
      });

      const capabilities: ServerCapabilities = {
        hoverProvider: true
        // definitionProvider NOT declared
      };
      server.setCapabilities(capabilities);

      // Should NOT throw in non-strict mode
      expect(() => {
        server.onRequest('textDocument/hover', async () => ({ contents: 'hover' }));
        server.onRequest('textDocument/definition', async () => ({
          uri: 'file:///test',
          range: {} as any
        }));
      }).not.toThrow();
    });

    it('should throw error for undeclared capability in strict mode', async () => {
      server = new LSPServer({
        name: 'test-server',
        strictCapabilities: true // Strict mode
      });

      const capabilities: ServerCapabilities = {
        hoverProvider: true
        // definitionProvider NOT declared
      };
      server.setCapabilities(capabilities);

      // Hover should work
      expect(() => {
        server.onRequest('textDocument/hover', async () => ({ contents: 'hover' }));
      }).not.toThrow();

      // Definition should throw
      expect(() => {
        server.onRequest('textDocument/definition', async () => ({
          uri: 'file:///test',
          range: {} as any
        }));
      }).toThrow('Cannot register handler for textDocument/definition');
    });

    it('should always allow lifecycle handlers regardless of capabilities', async () => {
      server = new LSPServer({
        strictCapabilities: true
      });

      server.setCapabilities({}); // Empty capabilities

      // These should all work
      expect(() => {
        server.onNotification('initialized', async () => {});
        server.onNotification('textDocument/didOpen', async () => {});
        server.onNotification('textDocument/didChange', async () => {});
        server.onNotification('textDocument/didClose', async () => {});
      }).not.toThrow();
    });
  });
});
