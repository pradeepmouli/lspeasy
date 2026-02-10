/**
 * Test dynamic typing for LSPClient
 */

import { describe, it, expect } from 'vitest';
import { LSPClient } from '../../src/client.js';

describe('Dynamic Typing - LSPClient', () => {
  it('should have capability-aware methods with typed constructor', () => {
    // Create client using generic constructor with type parameters
    const client = new LSPClient({
      name: 'test-client',
      capabilities: {
        textDocument: { hover: { contentFormat: ['markdown'] }, synchronization: { didSave: true } }
      }
    });
    (client as any).serverCapabilities = {
      hoverProvider: true,
      completionProvider: { triggerCharacters: ['.'] }
    } as const;

    // Intellisense should show these namespace properties:
    // - client.textDocument
    // - client.workspace
    // - client.window
    // etc.

    // Note: Methods are populated at runtime after connect()
    // For now we just verify the client is created
    expect(client.callHierarchy.incomingCalls).toBeDefined();
  });

  it('should show all methods when using default ServerCapabilities', () => {
    // When no type parameter is provided, defaults to full ServerCapabilities
    const client = new LSPClient({ name: 'test-client' });

    // Intellisense should show ALL possible methods:
    // - client.textDocument.hover
    // - client.textDocument.completion
    // - client.textDocument.definition
    // - client.workspace.executeCommand
    // etc.

    expect(client).toBeDefined();
  });

  it('should create client with minimal options', () => {
    const client = new LSPClient({ name: 'minimal-client' });

    expect(client).toBeDefined();
    expect(client).toHaveProperty('connect');
    expect(client).toHaveProperty('disconnect');
  });
});
