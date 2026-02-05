/**
 * Runtime test for capability-aware method injection (SERVER)
 */

import { describe, it, expect } from 'vitest';
import { LSPServer } from '../../src/server.js';

describe('Runtime Capability Checking - Server', () => {
  it('should only add handler methods for declared capabilities', () => {
    const server = new LSPServer();

    // Set limited capabilities
    server.setCapabilities({
      hoverProvider: true
      // No completionProvider
    });

    // Check that textDocument namespace exists
    expect((server as any).textDocument).toBeDefined();

    // onHover should exist (capability declared)
    expect((server as any).textDocument.onHover).toBeDefined();
    expect(typeof (server as any).textDocument.onHover).toBe('function');

    // onCompletion should NOT exist (capability not declared)
    expect((server as any).textDocument.onCompletion).toBeUndefined();

    // onDefinition should NOT exist (capability not declared)
    expect((server as any).textDocument.onDefinition).toBeUndefined();
  });

  it('should add all handler methods when full capabilities declared', () => {
    const server = new LSPServer();

    server.setCapabilities({
      hoverProvider: true,
      completionProvider: { triggerCharacters: ['.'] },
      definitionProvider: true,
      referencesProvider: true
    });

    // All handler methods should exist
    expect((server as any).textDocument.onHover).toBeDefined();
    expect((server as any).textDocument.onCompletion).toBeDefined();
    expect((server as any).textDocument.onDefinition).toBeDefined();
    expect((server as any).textDocument.onReferences).toBeDefined();
  });

  it('should not add methods for capabilities that are false or null', () => {
    const server = new LSPServer();

    server.setCapabilities({
      hoverProvider: true,
      completionProvider: false, // Explicitly disabled
      definitionProvider: null // Also disabled
    } as any);

    // onHover should exist
    expect((server as any).textDocument.onHover).toBeDefined();

    // These should NOT exist
    expect((server as any).textDocument.onCompletion).toBeUndefined();
    expect((server as any).textDocument.onDefinition).toBeUndefined();
  });

  it('should handle nested capability paths correctly', () => {
    const server = new LSPServer();

    server.setCapabilities({
      completionProvider: {
        triggerCharacters: ['.', ':'],
        resolveProvider: true
      }
    });

    // Methods requiring completionProvider should exist
    expect((server as any).textDocument.onCompletion).toBeDefined();

    // Check that the capability-aware method can be called
    let handlerCalled = false;
    (server as any).textDocument.onCompletion(() => {
      handlerCalled = true;
      return { isIncomplete: false, items: [] };
    });

    expect(handlerCalled).toBe(false); // Not called until actual request
  });
});
