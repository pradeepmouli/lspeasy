import { describe, expect, it } from 'vitest';
import { createPinoMiddleware, type PinoLikeLogger } from '../../src/logger.js';

function createLoggerCollector() {
  const logs: Array<{ level: string; payload: Record<string, unknown>; message?: string }> = [];

  const logger: PinoLikeLogger = {
    trace: (payload, message) => logs.push({ level: 'trace', payload, message }),
    debug: (payload, message) => logs.push({ level: 'debug', payload, message }),
    info: (payload, message) => logs.push({ level: 'info', payload, message }),
    warn: (payload, message) => logs.push({ level: 'warn', payload, message }),
    error: (payload, message) => logs.push({ level: 'error', payload, message }),
    fatal: (payload, message) => logs.push({ level: 'fatal', payload, message })
  };

  return { logger, logs };
}

describe('createPinoMiddleware', () => {
  it('logs before and after middleware execution', async () => {
    const { logger, logs } = createLoggerCollector();
    const middleware = createPinoMiddleware(logger);

    const result = await middleware(
      {
        direction: 'clientToServer',
        messageType: 'request',
        method: 'textDocument/hover',
        message: {
          jsonrpc: '2.0',
          id: 1,
          method: 'textDocument/hover',
          params: {}
        },
        metadata: {},
        transport: 'stdio'
      },
      async () => ({ shortCircuit: false })
    );

    expect(result).toEqual({ shortCircuit: false });
    expect(logs.length).toBe(2);
    expect(logs[0].level).toBe('info');
    expect(logs[0].message).toContain('lsp.before');
    expect(logs[1].message).toContain('lsp.after');
  });

  it('supports custom log levels and message formatting', async () => {
    const { logger, logs } = createLoggerCollector();
    const middleware = createPinoMiddleware(logger, {
      level: 'debug',
      includeMessageContent: true,
      staticFields: { service: 'unit-test' },
      formatMessage: ({ phase, method }) => `${phase}:${method}`
    });

    await middleware(
      {
        direction: 'serverToClient',
        messageType: 'response',
        method: 'textDocument/hover',
        message: {
          jsonrpc: '2.0',
          id: 2,
          result: null
        },
        metadata: {},
        transport: 'websocket'
      },
      async () => undefined
    );

    expect(logs[0].level).toBe('debug');
    expect(logs[0].message).toBe('before:textDocument/hover');
    expect(logs[0].payload.service).toBe('unit-test');
    expect(logs[0].payload.message).toBeDefined();
    expect(logs[1].message).toBe('after:textDocument/hover');
  });
});
