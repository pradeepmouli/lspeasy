import { describe, expect, it } from 'vitest';
import { executeMiddlewarePipeline } from '../../../src/middleware/pipeline.js';
import type { MiddlewareContext } from '../../../src/middleware/types.js';

describe('middleware benchmark', () => {
  it('has minimal overhead when no middleware is registered', async () => {
    const context: MiddlewareContext = {
      direction: 'clientToServer',
      messageType: 'notification',
      method: 'initialized',
      message: { jsonrpc: '2.0', method: 'initialized', params: {} },
      metadata: {},
      transport: 'bench'
    };

    const start = performance.now();
    for (let index = 0; index < 1000; index++) {
      await executeMiddlewarePipeline([], context, async () => undefined);
    }
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(1000);
  });
});
