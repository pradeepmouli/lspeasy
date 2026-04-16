import { describe, expect, it } from 'vitest';
import { composeMiddleware } from '../../../src/middleware/compose.js';
import type { MiddlewareContext } from '../../../src/middleware/types.js';

const context: MiddlewareContext = {
  direction: 'clientToServer',
  messageType: 'notification',
  method: 'initialized',
  message: {
    jsonrpc: '2.0',
    method: 'initialized',
    params: {}
  },
  metadata: {},
  transport: 'test'
};

describe('composeMiddleware', () => {
  it('composes middleware left-to-right', async () => {
    const calls: string[] = [];

    const first = async (_ctx: MiddlewareContext, next: () => Promise<unknown>) => {
      calls.push('first');
      return next();
    };

    const second = async (_ctx: MiddlewareContext, next: () => Promise<unknown>) => {
      calls.push('second');
      return next();
    };

    const composed = composeMiddleware(first, second);

    await composed(context, async () => {
      calls.push('handler');
      return undefined;
    });

    expect(calls).toEqual(['first', 'second', 'handler']);
  });
});
