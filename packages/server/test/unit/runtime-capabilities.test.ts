/**
 * Runtime test for capability-aware method injection (SERVER)
 */

import { describe, it, expect } from 'vitest';
import type { ClientCapabilities } from '@lspeasy/core';
import { LSPServer } from '../../src/server.js';

describe('Server.registerCapabilities()', () => {
  it('should return the same instance typed with capabilities', () => {
    const server = new LSPServer();
    const withHover = server.registerCapabilities({ hoverProvider: true });

    // The returned value is the same instance
    expect(withHover).toBe(server);

    // Capabilities should include hoverProvider
    const caps = withHover.getServerCapabilities();
    expect(caps.hoverProvider).toBe(true);
  });

  it('should support declaring multiple capabilities at once', () => {
    const server = new LSPServer();
    const typed = server.registerCapabilities({
      hoverProvider: true,
      completionProvider: { triggerCharacters: ['.'] },
      definitionProvider: true
    });

    const caps = typed.getServerCapabilities();
    expect(caps.hoverProvider).toBe(true);
    expect(caps.completionProvider).toEqual({ triggerCharacters: ['.'] });
    expect(caps.definitionProvider).toBe(true);
  });

  it('should inject handler methods after registerCapabilities', () => {
    const server = new LSPServer();

    // Initially no capabilities
    expect((server as any).textDocument?.onHover).toBeUndefined();

    // Register hover capability
    const withHover = server.registerCapabilities({ hoverProvider: true });

    // Now onHover should be available
    expect((withHover as any).textDocument.onHover).toBeDefined();
    expect(typeof (withHover as any).textDocument.onHover).toBe('function');
  });
});

describe('Server.expect()', () => {
  it('should return the same instance', () => {
    const server = new LSPServer();
    server.registerCapabilities({ hoverProvider: true });

    const typed = server.expect<{ textDocument: { hover: {} } }>();
    expect(typed).toBe(server);
  });

  it('should be callable with no runtime cost', () => {
    const server = new LSPServer();
    server.registerCapabilities({ hoverProvider: true });

    // expect<> is zero-cost - it just casts the type
    const typed = server.expect<ClientCapabilities>();
    expect(typed.getServerCapabilities().hoverProvider).toBe(true);
  });
});

describe('Runtime Capability Checking - Server', () => {
  it('should only add handler methods for declared capabilities', () => {
    const server = new LSPServer();

    // Set limited capabilities
    server.registerCapabilities({
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

    server.registerCapabilities({
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

    server.registerCapabilities({
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

    server.registerCapabilities({
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
