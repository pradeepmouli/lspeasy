import { describe, expect, it } from 'vitest';
import { executeMiddlewarePipeline } from '../../../src/middleware/pipeline.js';
import type { MiddlewareContext } from '../../../src/middleware/types.js';

function createContext(): MiddlewareContext {
  return {
    direction: 'clientToServer',
    messageType: 'request',
    method: 'textDocument/hover',
    message: {
      jsonrpc: '2.0',
      id: '1',
      method: 'textDocument/hover',
      params: {}
    },
    metadata: {},
    transport: 'test'
  };
}

describe('executeMiddlewarePipeline', () => {
  it('runs middleware in registration order', async () => {
    const calls: string[] = [];
    const context = createContext();

    const middlewareA = async (_ctx: MiddlewareContext, next: () => Promise<unknown>) => {
      calls.push('A:before');
      await next();
      calls.push('A:after');
    };

    const middlewareB = async (_ctx: MiddlewareContext, next: () => Promise<unknown>) => {
      calls.push('B:before');
      await next();
      calls.push('B:after');
    };

    await executeMiddlewarePipeline([middlewareA, middlewareB], context, async () => {
      calls.push('handler');
      return undefined;
    });

    expect(calls).toEqual(['A:before', 'B:before', 'handler', 'B:after', 'A:after']);
  });

  it('supports short-circuit responses', async () => {
    const context = createContext();

    const result = await executeMiddlewarePipeline(
      [
        async () => ({
          shortCircuit: true,
          response: {
            jsonrpc: '2.0',
            id: '1',
            result: { cached: true }
          }
        })
      ],
      context,
      async () => {
        throw new Error('should not execute');
      }
    );

    expect(result?.shortCircuit).toBe(true);
  });

  it('rejects middleware that mutates message id', async () => {
    const context = createContext();

    await expect(
      executeMiddlewarePipeline(
        [
          async (ctx, next) => {
            (ctx.message as { id?: string }).id = '2';
            return next();
          }
        ],
        context,
        async () => undefined
      )
    ).rejects.toThrow('Middleware cannot modify JSON-RPC message id');
  });
});
