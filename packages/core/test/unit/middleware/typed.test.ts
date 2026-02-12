import { describe, expect, it } from 'vitest';
import { createTypedMiddleware, executeMiddlewarePipeline } from '../../../src/middleware/index.js';
import type { MiddlewareContext } from '../../../src/middleware/types.js';

describe('typed middleware', () => {
  it('creates method-scoped middleware wrapper', async () => {
    let observedMethod = '';

    const typed = createTypedMiddleware('textDocument/hover', async (ctx, next) => {
      observedMethod = ctx.method;
      return next();
    });

    const context: MiddlewareContext = {
      direction: 'clientToServer',
      messageType: 'request',
      method: 'textDocument/hover',
      message: {
        jsonrpc: '2.0',
        id: '1',
        method: 'textDocument/hover',
        params: {
          textDocument: { uri: 'file:///tmp.ts' },
          position: { line: 0, character: 0 }
        }
      },
      metadata: {},
      transport: 'test'
    };

    await executeMiddlewarePipeline([typed], context, async () => undefined);

    expect(observedMethod).toBe('textDocument/hover');
  });
});
