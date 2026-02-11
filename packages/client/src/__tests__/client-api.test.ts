/**
 * Tests for LSPClient new APIs: single type parameter and expect()
 */
import { describe, it, expect } from 'vitest';
import type { ServerCapabilities } from '@lspeasy/core';
import { LSPClient } from '../client.js';
import { initializeCapabilityMethods } from '../capability-proxy.js';

describe('Client single type parameter', () => {
  it('should construct with only ClientCaps type parameter', () => {
    const client = new LSPClient({
      capabilities: {
        textDocument: {
          hover: { contentFormat: ['plaintext'] }
        }
      }
    });

    expect(client).toBeDefined();
    expect(client.isConnected()).toBe(false);
  });

  it('should construct with no type parameters', () => {
    const client = new LSPClient();
    expect(client).toBeDefined();
  });
});

describe('LSPClient.expect()', () => {
  it('should return the same instance', () => {
    const client = new LSPClient();
    const typed = client.expect<{ hoverProvider: true }>();
    expect(typed).toBe(client);
  });

  it('should be callable after setting server capabilities', () => {
    const client = new LSPClient();

    // Mock server capabilities
    (client as any).serverCapabilities = {
      hoverProvider: true,
      completionProvider: { triggerCharacters: ['.'] }
    };

    initializeCapabilityMethods(client);

    const typed = client.expect<{
      hoverProvider: true;
      completionProvider: { triggerCharacters: ['.'] };
    }>();

    // The typed client should have capability-aware methods injected
    expect((typed as any).textDocument).toBeDefined();
    expect((typed as any).textDocument.hover).toBeDefined();
    expect((typed as any).textDocument.completion).toBeDefined();
  });

  it('should preserve serverCapabilities after expect()', () => {
    const client = new LSPClient();

    const caps: Partial<ServerCapabilities> = {
      hoverProvider: true
    };
    (client as any).serverCapabilities = caps;

    const typed = client.expect<{ hoverProvider: true }>();
    expect(typed.getServerCapabilities()).toBe(caps);
  });
});
