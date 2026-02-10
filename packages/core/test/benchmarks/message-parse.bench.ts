/**
 * Benchmark suite for JSON-RPC message parsing
 * Target: <1ms p95 latency
 */

import { bench, describe } from 'vitest';
import { parseMessage, serializeMessage } from '../../src/jsonrpc/framing.js';
import type {
  RequestMessage,
  NotificationMessage,
  ResponseMessage
} from '../../src/jsonrpc/messages.js';

describe('Message Parsing Benchmarks', () => {
  // Sample messages for benchmarking
  const requestMessage: RequestMessage = {
    jsonrpc: '2.0',
    id: 1,
    method: 'textDocument/hover',
    params: {
      textDocument: { uri: 'file:///test.ts' },
      position: { line: 10, character: 5 }
    }
  };

  const notificationMessage: NotificationMessage = {
    jsonrpc: '2.0',
    method: 'textDocument/didChange',
    params: {
      textDocument: { uri: 'file:///test.ts', version: 2 },
      contentChanges: [{ text: 'const x = 42;' }]
    }
  };

  const successResponse: ResponseMessage = {
    jsonrpc: '2.0',
    id: 1,
    result: {
      contents: { kind: 'markdown', value: '# Hover Info' }
    }
  };

  const errorResponse: ResponseMessage = {
    jsonrpc: '2.0',
    id: 1,
    error: {
      code: -32600,
      message: 'Invalid request'
    }
  };

  // Serialize messages once for parsing benchmarks
  const serializedRequest = serializeMessage(requestMessage);
  const serializedNotification = serializeMessage(notificationMessage);
  const serializedSuccess = serializeMessage(successResponse);
  const serializedError = serializeMessage(errorResponse);

  describe('Serialization', () => {
    bench('serialize request message', () => {
      serializeMessage(requestMessage);
    });

    bench('serialize notification message', () => {
      serializeMessage(notificationMessage);
    });

    bench('serialize success response', () => {
      serializeMessage(successResponse);
    });

    bench('serialize error response', () => {
      serializeMessage(errorResponse);
    });
  });

  describe('Parsing', () => {
    bench('parse request message', () => {
      parseMessage(serializedRequest);
    });

    bench('parse notification message', () => {
      parseMessage(serializedNotification);
    });

    bench('parse success response', () => {
      parseMessage(serializedSuccess);
    });

    bench('parse error response', () => {
      parseMessage(serializedError);
    });
  });

  describe('Round-trip', () => {
    bench('serialize + parse request', () => {
      const serialized = serializeMessage(requestMessage);
      parseMessage(serialized);
    });

    bench('serialize + parse notification', () => {
      const serialized = serializeMessage(notificationMessage);
      parseMessage(serialized);
    });

    bench('serialize + parse response', () => {
      const serialized = serializeMessage(successResponse);
      parseMessage(serialized);
    });
  });

  describe('Large messages', () => {
    // Create a large completion response
    const largeCompletionResponse: ResponseMessage = {
      jsonrpc: '2.0',
      id: 1,
      result: {
        isIncomplete: false,
        items: Array.from({ length: 1000 }, (_, i) => ({
          label: `completion_item_${i}`,
          kind: 1,
          detail: `Detail for item ${i}`,
          documentation: {
            kind: 'markdown',
            value: `# Documentation\n\nThis is documentation for completion item ${i}`
          }
        }))
      }
    };

    const serializedLarge = serializeMessage(largeCompletionResponse);

    bench('serialize large completion (1000 items)', () => {
      serializeMessage(largeCompletionResponse);
    });

    bench('parse large completion (1000 items)', () => {
      parseMessage(serializedLarge);
    });
  });

  describe('Message with Content-Length header', () => {
    const messageWithHeader = `Content-Length: ${serializedRequest.length}\r\n\r\n${serializedRequest}`;
    const buffer = Buffer.from(messageWithHeader, 'utf-8');

    bench('parse message with header', () => {
      parseMessage(buffer);
    });
  });
});
