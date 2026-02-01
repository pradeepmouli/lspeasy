/**
 * Test demonstrating type guard usage with capability-aware client
 */

import { describe, it, expect } from 'vitest';
import {
  hasServerCapability,
  hasHoverCapability,
  hasCompletionCapability,
  hasDefinitionCapability,
  supportsMethod,
  LSPClient
} from '@lspeasy/client';

describe('Type Guards', () => {
  describe('supportsMethod', () => {
    it('should check method availability by full method name', () => {
      const capabilities = {
        hoverProvider: true,
        completionProvider: { triggerCharacters: ['.'] }
      };

      expect(supportsMethod('textDocument/hover', capabilities)).toBe(true);
      expect(supportsMethod('textDocument/completion', capabilities)).toBe(true);
      expect(supportsMethod('textDocument/definition', capabilities)).toBe(false);
    });

    it('should handle workspace methods', () => {
      const capabilities = { workspaceSymbolProvider: true };

      expect(supportsMethod('workspace/symbol', capabilities)).toBe(true);
      expect(supportsMethod('textDocument/definition', capabilities)).toBe(false);
    });

    it('should return false for unknown methods', () => {
      const capabilities = { hoverProvider: true };

      expect(supportsMethod('textDocument/unknownMethod', capabilities)).toBe(false);
    });
  });

  describe('hasServerCapability', () => {
    it('should return true when capability is enabled', () => {
      const client = new LSPClient({ name: 'test' });
      (client as any).serverCapabilities = { hoverProvider: true };

      expect(hasServerCapability(client, 'hoverProvider')).toBe(true);
    });

    it('should return false when capability is undefined', () => {
      const client = new LSPClient({ name: 'test' });
      (client as any).serverCapabilities = {};

      expect(hasServerCapability(client, 'hoverProvider')).toBe(false);
    });

    it('should return false when capability is false', () => {
      const client = new LSPClient({ name: 'test' });
      (client as any).serverCapabilities = { hoverProvider: false };

      expect(hasServerCapability(client, 'hoverProvider')).toBe(false);
    });

    it('should return false when serverCapabilities is undefined', () => {
      const client = new LSPClient({ name: 'test' });

      expect(hasServerCapability(client, 'hoverProvider')).toBe(false);
    });
  });

  describe('hasHoverCapability', () => {
    it('should return true when hover method exists', () => {
      const client = new LSPClient({ name: 'test' });
      (client as any).serverCapabilities = { hoverProvider: true };

      // After setting capabilities, the proxy should expose hover
      expect(hasHoverCapability(client)).toBe(true);

      // TypeScript should know hover exists after type guard
      if (hasHoverCapability(client)) {
        expect(typeof client.textDocument.hover).toBe('function');
      }
    });

    it('should return false when hover method does not exist', () => {
      const client = new LSPClient({ name: 'test' });
      (client as any).serverCapabilities = {}; // No hoverProvider

      expect(hasHoverCapability(client)).toBe(false);
    });
  });

  describe('hasCompletionCapability', () => {
    it('should return true when completion method exists', () => {
      const client = new LSPClient({ name: 'test' });
      (client as any).serverCapabilities = {
        completionProvider: { triggerCharacters: ['.'] }
      };

      expect(hasCompletionCapability(client)).toBe(true);

      if (hasCompletionCapability(client)) {
        expect(typeof client.textDocument.completion).toBe('function');
      }
    });

    it('should return false when completion provider is not set', () => {
      const client = new LSPClient({ name: 'test' });
      (client as any).serverCapabilities = {};

      expect(hasCompletionCapability(client)).toBe(false);
    });
  });

  describe('hasDefinitionCapability', () => {
    it('should return true when definition method exists', () => {
      const client = new LSPClient({ name: 'test' });
      (client as any).serverCapabilities = { definitionProvider: true };

      expect(hasDefinitionCapability(client)).toBe(true);

      if (hasDefinitionCapability(client)) {
        expect(typeof client.textDocument.definition).toBe('function');
      }
    });

    it('should return false when definition provider is not set', () => {
      const client = new LSPClient({ name: 'test' });
      (client as any).serverCapabilities = {};

      expect(hasDefinitionCapability(client)).toBe(false);
    });
  });

  describe('Type narrowing', () => {
    it('should provide proper TypeScript type narrowing', () => {
      const client = new LSPClient({ name: 'test' });
      (client as any).serverCapabilities = {
        hoverProvider: true,
        completionProvider: { triggerCharacters: ['.'] }
      };

      // Type guards narrow the type
      if (hasHoverCapability(client)) {
        // TypeScript knows hover exists with proper signature
        const hover = client.textDocument.hover;
        expect(typeof hover).toBe('function');
      }

      if (hasCompletionCapability(client)) {
        // TypeScript knows completion exists with proper signature
        const completion = client.textDocument.completion;
        expect(typeof completion).toBe('function');
      }

      if (hasDefinitionCapability(client)) {
        // This should not execute since definitionProvider not set
        expect(true).toBe(false);
      }
    });
  });
});
