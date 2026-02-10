/**
 * Integration test for capability-aware runtime behavior
 */

import { describe, it, expect } from 'vitest';
import { LSPServer } from '@lspeasy/server';
import type { ServerCapabilities } from '@lspeasy/core';

describe('Capability-Aware Runtime', () => {
  let server: LSPServer;

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
