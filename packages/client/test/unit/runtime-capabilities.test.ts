/**
 * Runtime test for capability-aware method injection (CLIENT)
 */

import { describe, it, expect } from 'vitest';
import type { ServerCapabilities } from '@lspeasy/core';
import { LSPClient } from '../../src/client.js';
import { initializeCapabilityMethods } from '../../src/capability-proxy.js';

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

describe('Client.expect()', () => {
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

describe('Runtime Capability Checking - Client', () => {
  it('should only add methods for capabilities supported by server', () => {
    const client = new LSPClient();

    // Mock server capabilities with only hover support
    (client as any).serverCapabilities = {
      hoverProvider: true
      // No completionProvider
    };

    // Manually trigger capability method initialization
    initializeCapabilityMethods(client);

    // Check that textDocument namespace exists
    expect((client as any).textDocument).toBeDefined();

    // Hover should exist (capability present)
    expect((client as any).textDocument.hover).toBeDefined();
    expect(typeof (client as any).textDocument.hover).toBe('function');

    // Completion should NOT exist (capability missing)
    expect((client as any).textDocument.completion).toBeUndefined();

    // Definition should NOT exist (capability missing)
    expect((client as any).textDocument.definition).toBeUndefined();
  });

  it('should add all methods when server has full capabilities', () => {
    const client = new LSPClient();

    // Mock full server capabilities
    (client as any).serverCapabilities = {
      hoverProvider: true,
      completionProvider: { triggerCharacters: ['.'] },
      definitionProvider: true,
      referencesProvider: true
    };

    initializeCapabilityMethods(client);

    // All methods should exist
    expect((client as any).textDocument.hover).toBeDefined();
    expect((client as any).textDocument.completion).toBeDefined();
    expect((client as any).textDocument.definition).toBeDefined();
    expect((client as any).textDocument.references).toBeDefined();
  });

  it('should not add methods requiring capabilities that are false', () => {
    const client = new LSPClient();

    // Set capabilities with some explicitly false
    (client as any).serverCapabilities = {
      hoverProvider: true,
      completionProvider: false, // Explicitly disabled
      definitionProvider: null // Also disabled
    };

    initializeCapabilityMethods(client);

    // Hover should exist
    expect((client as any).textDocument.hover).toBeDefined();

    // These should NOT exist (false/null)
    expect((client as any).textDocument.completion).toBeUndefined();
    expect((client as any).textDocument.definition).toBeUndefined();
  });
});
