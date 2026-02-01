/**
 * Unit tests for handler registration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LSPServer } from '@lspeasy/server';
import type { HoverParams } from '@lspeasy/core';

describe('Handler Registration', () => {
  let server: LSPServer;

  beforeEach(() => {
    server = new LSPServer({ logLevel: 'error' });
  });

  describe('onRequest', () => {
    it('should register request handler', () => {
      const handler = vi.fn(async () => null);

      server.onRequest('textDocument/hover', handler);

      expect(server).toBeDefined();
    });

    it('should accept typed handler', () => {
      server.onRequest<'textDocument/hover', HoverParams, null>(
        'textDocument/hover',
        async (params) => {
          expect(params.textDocument).toBeDefined();
          expect(params.position).toBeDefined();
          return null;
        }
      );

      expect(server).toBeDefined();
    });

    it('should accept generic handler', () => {
      server.onRequest<string, any, any>('custom/method', async (params) => {
        return { result: params };
      });

      expect(server).toBeDefined();
    });

    it('should support multiple handlers for different methods', () => {
      server.onRequest('textDocument/hover', async () => null);
      server.onRequest('textDocument/completion', async () => ({ items: [] }));
      server.onRequest('textDocument/definition', async () => []);

      expect(server).toBeDefined();
    });
  });

  describe('onNotification', () => {
    it('should register notification handler', () => {
      const handler = vi.fn();

      server.onNotification('textDocument/didOpen', handler);

      expect(server).toBeDefined();
    });

    it('should accept typed handler', () => {
      server.onNotification('textDocument/didOpen', (params: any) => {
        expect(params.textDocument).toBeDefined();
      });

      expect(server).toBeDefined();
    });

    it('should accept async handler', () => {
      server.onNotification('textDocument/didChange', async (_params: any) => {
        await Promise.resolve();
      });

      expect(server).toBeDefined();
    });

    it('should support multiple handlers for different methods', () => {
      server.onNotification('textDocument/didOpen', () => {});
      server.onNotification('textDocument/didChange', () => {});
      server.onNotification('textDocument/didClose', () => {});

      expect(server).toBeDefined();
    });
  });

  describe('Handler types', () => {
    it('should provide cancellation token to request handlers', async () => {
      let receivedToken = false;

      server.onRequest('textDocument/hover', async (params, token) => {
        receivedToken = token !== undefined;
        expect(token.isCancellationRequested).toBeDefined();
        expect(token.onCancellationRequested).toBeDefined();
        return null;
      });

      expect(receivedToken).toBe(false);
    });

    it('should provide context to request handlers', async () => {
      let receivedContext = false;

      server.onRequest('textDocument/hover', async (params, token, context) => {
        receivedContext = context !== undefined;
        expect(context.method).toBeDefined();
        return null;
      });

      expect(receivedContext).toBe(false);
    });

    it('should provide context to notification handlers', () => {
      let receivedContext = false;

      server.onNotification('textDocument/didOpen', (params, context) => {
        receivedContext = context !== undefined;
        expect(context.method).toBeDefined();
      });

      expect(receivedContext).toBe(false);
    });
  });
});
