/**
 * Tests for LSPServer APIs: registerCapabilities() and expect()
 */
import { describe, it, expect } from 'vitest';
import type { ClientCapabilities } from '@lspeasy/core';
import { LSPServer } from '../server.js';

describe('LSPServer.registerCapabilities()', () => {
  it('should return the same instance', () => {
    const server = new LSPServer();
    const withHover = server.registerCapabilities({ hoverProvider: true });

    expect(withHover).toBe(server);
    expect(withHover.getServerCapabilities().hoverProvider).toBe(true);
  });

  it('should support fluent declaration of multiple capabilities', () => {
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

  it('should replace capabilities on a second call', () => {
    const server = new LSPServer();
    server.registerCapabilities({ hoverProvider: true });
    server.registerCapabilities({ hoverProvider: true, completionProvider: {} });

    const caps = server.getServerCapabilities();
    expect(caps.hoverProvider).toBe(true);
    expect(caps.completionProvider).toEqual({});
  });
});

describe('LSPServer.expect()', () => {
  it('should return the same instance', () => {
    const server = new LSPServer();
    server.registerCapabilities({ hoverProvider: true });

    const typed = server.expect<ClientCapabilities>();
    expect(typed).toBe(server);
  });

  it('should not alter runtime behavior', () => {
    const server = new LSPServer();
    server.registerCapabilities({ hoverProvider: true });

    const typed = server.expect<ClientCapabilities>();
    expect(typed.getServerCapabilities().hoverProvider).toBe(true);
  });
});
