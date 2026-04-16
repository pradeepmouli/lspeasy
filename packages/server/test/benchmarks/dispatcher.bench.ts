/**
 * Benchmarks for request dispatch and handler lookup.
 */

import { bench, describe } from 'vitest';
import { NullLogger } from '@lspeasy/core';
import { MessageDispatcher } from '../../src/dispatcher.js';
import type { Transport } from '@lspeasy/core';

const transport: Transport = {
  send: async () => undefined,
  onMessage: () => ({ dispose: () => {} }),
  onError: () => ({ dispose: () => {} }),
  onClose: () => ({ dispose: () => {} }),
  close: async () => undefined,
  isConnected: () => true
};

describe('Dispatcher Benchmarks', () => {
  const logger = new NullLogger();
  const dispatcher = new MessageDispatcher(logger);

  dispatcher.registerRequest('textDocument/hover', async () => ({ contents: 'ok' }));
  dispatcher.registerNotification('textDocument/didOpen', async () => undefined);

  const requestMessage = {
    jsonrpc: '2.0' as const,
    id: 'req-1',
    method: 'textDocument/hover',
    params: {
      textDocument: { uri: 'file:///test.ts' },
      position: { line: 0, character: 0 }
    }
  };

  const notificationMessage = {
    jsonrpc: '2.0' as const,
    method: 'textDocument/didOpen',
    params: {
      textDocument: { uri: 'file:///test.ts', languageId: 'typescript', version: 1, text: '' }
    }
  };

  bench('dispatch request handler lookup', async () => {
    await dispatcher.dispatch(requestMessage, transport, new Map());
  });

  bench('dispatch notification handler lookup', async () => {
    await dispatcher.dispatch(notificationMessage, transport, new Map());
  });
});
