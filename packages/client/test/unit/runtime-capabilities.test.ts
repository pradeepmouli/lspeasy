/**
 * Runtime test for capability-aware method injection (CLIENT)
 */

import { describe, it, expect } from 'vitest';
import { LSPClient } from '../../src/client.js';
import { initializeCapabilityMethods } from '../../src/capability-proxy.js';

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
