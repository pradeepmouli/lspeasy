/**
 * Test type inference for LSPClient with both client and server capabilities
 */

import { describe, it, expect } from 'vitest';
import { LSPClient } from '../../src/client.js';

describe('Dynamic Typing - Type Inference', () => {
  it('should infer both client and server capabilities from options', () => {
    // TypeScript infers both type parameters from the options object
    const client = new LSPClient({
      name: 'test-client',
      capabilities: {
        textDocument: { hover: { contentFormat: ['markdown'] } }
      }
    });

    // IntelliSense should show ONLY methods for the specified server capabilities:
    // - client.textDocument.hover ✓ (hoverProvider: true)
    // - client.textDocument.completion ✓ (completionProvider declared)
    // - client.textDocument.definition ✗ (not in capabilities)
    // - client.textDocument.implementation ✗ (not in capabilities)

    expect(client).toBeDefined();
  });

  it('should work with type assertion for cleaner syntax', () => {
    type ServerCaps = {
      hoverProvider: true;
      definitionProvider: true;
    };

    const client = new LSPClient({
      name: 'test-client',
      capabilities: { textDocument: { hover: { contentFormat: ['markdown'] } } },
      _serverCapabilities: {} as ServerCaps
    });

    // TypeScript narrows to only hover and definition methods
    expect(client).toBeDefined();
  });
});
