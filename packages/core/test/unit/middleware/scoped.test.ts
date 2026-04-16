import { describe, expect, it } from 'vitest';
import {
  createScopedMiddleware,
  executeMiddlewarePipeline
} from '../../../src/middleware/index.js';
import type { MiddlewareContext } from '../../../src/middleware/types.js';

function context(method: string): MiddlewareContext {
  return {
    direction: 'clientToServer',
    messageType: 'request',
    method,
    message: {
      jsonrpc: '2.0',
      id: '1',
      method,
      params: {}
    },
    metadata: {},
    transport: 'test'
  };
}

describe('scoped middleware', () => {
  it('runs only for matching methods', async () => {
    const calls: string[] = [];
    const scoped = createScopedMiddleware(
      { methods: ['textDocument/hover'] },
      async (_ctx, next) => {
        calls.push('scoped');
        return next();
      }
    );

    await executeMiddlewarePipeline([scoped], context('textDocument/hover'), async () => undefined);
    await executeMiddlewarePipeline([scoped], context('workspace/symbol'), async () => undefined);

    expect(calls).toEqual(['scoped']);
  });
});
