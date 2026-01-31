/**
 * Benchmark suite for handler dispatch performance
 * Target: <0.1ms p95 latency
 */

import { bench, describe } from 'vitest';
import { LSPServer } from '../../src/server.js';
import type { HoverParams, CompletionParams } from '@lspy/core';

describe('Handler Dispatch Benchmarks', () => {
  describe('Request handler registration', () => {
    bench('register single request handler', () => {
      const server = new LSPServer({ name: 'test', version: '1.0.0' });
      server.onRequest('textDocument/hover', async () => null);
    });

    bench('register 10 request handlers', () => {
      const server = new LSPServer({ name: 'test', version: '1.0.0' });
      server.onRequest('textDocument/hover', async () => null);
      server.onRequest('textDocument/completion', async () => null);
      server.onRequest('textDocument/definition', async () => null);
      server.onRequest('textDocument/references', async () => null);
      server.onRequest('textDocument/documentSymbol', async () => null);
      server.onRequest('textDocument/codeAction', async () => null);
      server.onRequest('textDocument/formatting', async () => null);
      server.onRequest('textDocument/rename', async () => null);
      server.onRequest('workspace/symbol', async () => null);
      server.onRequest('workspace/executeCommand', async () => null);
    });
  });

  describe('Notification handler registration', () => {
    bench('register single notification handler', () => {
      const server = new LSPServer({ name: 'test', version: '1.0.0' });
      server.onNotification('textDocument/didOpen', async () => {});
    });

    bench('register 5 notification handlers', () => {
      const server = new LSPServer({ name: 'test', version: '1.0.0' });
      server.onNotification('textDocument/didOpen', async () => {});
      server.onNotification('textDocument/didChange', async () => {});
      server.onNotification('textDocument/didClose', async () => {});
      server.onNotification('textDocument/didSave', async () => {});
      server.onNotification('workspace/didChangeConfiguration', async () => {});
    });
  });

  describe('Handler dispatch', () => {
    // Note: These benchmarks test handler invocation overhead
    // Actual dispatch happens through the transport layer in real usage

    bench('invoke hover handler directly', async () => {
      const handler = async (_params: HoverParams) => {
        return {
          contents: { kind: 'markdown', value: 'test' }
        };
      };

      await handler({
        textDocument: { uri: 'file:///test.ts' },
        position: { line: 10, character: 5 }
      });
    });

    bench('invoke completion handler directly', async () => {
      const handler = async (_params: CompletionParams) => {
        const items = Array.from({ length: 50 }, (_, i) => ({
          label: `item${i}`,
          kind: 1
        }));
        return { isIncomplete: false, items };
      };

      await handler({
        textDocument: { uri: 'file:///test.ts' },
        position: { line: 10, character: 5 }
      });
    });

    bench('handler registration overhead', () => {
      const server = new LSPServer({ name: 'test', version: '1.0.0' });
      const handler = async () => null;
      server.onRequest('textDocument/hover', handler);
    });
  });

  describe('Concurrent requests', () => {
    // Benchmark handler execution overhead for concurrent operations
    const handlers = Array.from({ length: 100 }, () => async (_params: HoverParams) => {
      await new Promise((resolve) => setTimeout(resolve, 1));
      return {
        contents: { kind: 'markdown', value: 'test' }
      };
    });

    const hoverParams: HoverParams = {
      textDocument: { uri: 'file:///test.ts' },
      position: { line: 10, character: 5 }
    };

    bench('10 concurrent handler invocations', async () => {
      const promises = handlers.slice(0, 10).map((handler) => handler(hoverParams));
      await Promise.all(promises);
    });

    bench('100 concurrent handler invocations', async () => {
      const promises = handlers.map((handler) => handler(hoverParams));
      await Promise.all(promises);
    });
  });

  describe('Handler with validation', () => {
    bench('handler with parameter validation', async () => {
      const handler = async (params: HoverParams) => {
        // Simulate validation
        if (!params.textDocument?.uri) {
          throw new Error('Missing uri');
        }
        if (params.position.line < 0) {
          throw new Error('Invalid line');
        }
        return {
          contents: { kind: 'markdown', value: 'test' }
        };
      };

      await handler({
        textDocument: { uri: 'file:///test.ts' },
        position: { line: 10, character: 5 }
      });
    });
  });
});
