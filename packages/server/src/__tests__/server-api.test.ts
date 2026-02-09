/**
 * Tests for LSPServer new APIs: registerCapability() and expect()
 */
import { describe, it, expect } from 'vitest';
import type { ClientCapabilities } from '@lspeasy/core';
import { LSPServer } from '../server.js';

describe('LSPServer.registerCapability()', () => {
  it('should add a capability and return the same instance', () => {
    const server = new LSPServer();
    server.setCapabilities({});
    const withHover = server.registerCapability('hoverProvider', true);

    expect(withHover).toBe(server);
    expect(withHover.getServerCapabilities().hoverProvider).toBe(true);
  });

  it('should support chaining multiple registerCapability calls', () => {
    const server = new LSPServer();
    server.setCapabilities({});
    const typed = server
      .registerCapability('hoverProvider', true)
      .registerCapability('completionProvider', { triggerCharacters: ['.'] })
      .registerCapability('definitionProvider', true);

    const caps = typed.getServerCapabilities();
    expect(caps.hoverProvider).toBe(true);
    expect(caps.completionProvider).toEqual({ triggerCharacters: ['.'] });
    expect(caps.definitionProvider).toBe(true);
  });

  it('should preserve existing capabilities when adding new ones', () => {
    const server = new LSPServer();
    server.setCapabilities({ hoverProvider: true });
    server.registerCapability('completionProvider', {});

    const caps = server.getServerCapabilities();
    expect(caps.hoverProvider).toBe(true);
    expect(caps.completionProvider).toEqual({});
  });
});

describe('LSPServer.expect()', () => {
  it('should return the same instance', () => {
    const server = new LSPServer();
    server.setCapabilities({ hoverProvider: true });

    const typed = server.expect<ClientCapabilities>();
    expect(typed).toBe(server);
  });

  it('should not alter runtime behavior', () => {
    const server = new LSPServer();
    server.setCapabilities({ hoverProvider: true });

    const typed = server.expect<ClientCapabilities>();
    expect(typed.getServerCapabilities().hoverProvider).toBe(true);
  });
});
