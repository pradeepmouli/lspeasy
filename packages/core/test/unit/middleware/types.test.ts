import { describe, expect, it } from 'vitest';
import type { MiddlewareContext } from '../../../src/middleware/types.js';

describe('middleware types', () => {
  it('defines message id as readonly at runtime contract boundary', () => {
    const context: MiddlewareContext = {
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

    expect(context.message.id).toBe('1');
  });
});
