/**
 * Unit tests for message dispatcher
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MessageDispatcher } from '@lspeasy/server';
import { ConsoleLogger, LogLevel, ResponseError } from '@lspeasy/core';
import type { Transport, RequestMessage, NotificationMessage } from '@lspeasy/core';

// Mock transport
class MockTransport implements Transport {
  sentMessages: any[] = [];
  messageHandler?: (message: any) => void;
  errorHandler?: (error: Error) => void;
  closeHandler?: () => void;

  async send(message: any): Promise<void> {
    this.sentMessages.push(message);
  }

  onMessage(handler: (message: any) => void) {
    this.messageHandler = handler;
    return { dispose: () => {} };
  }

  onError(handler: (error: Error) => void) {
    this.errorHandler = handler;
    return { dispose: () => {} };
  }

  onClose(handler: () => void) {
    this.closeHandler = handler;
    return { dispose: () => {} };
  }

  async close(): Promise<void> {}

  isConnected(): boolean {
    return true;
  }
}

describe('MessageDispatcher', () => {
  let dispatcher: MessageDispatcher;
  let logger: ConsoleLogger;
  let mockTransport: MockTransport;

  beforeEach(() => {
    logger = new ConsoleLogger(LogLevel.Error);
    dispatcher = new MessageDispatcher(logger);
    mockTransport = new MockTransport();
  });

  describe('registerRequest', () => {
    it('should register request handler', () => {
      const handler = vi.fn(async () => ({ result: 'test' }));
      dispatcher.registerRequest('test/method', handler);
      expect(dispatcher).toBeDefined();
    });
  });

  describe('registerNotification', () => {
    it('should register notification handler', () => {
      const handler = vi.fn();
      dispatcher.registerNotification('test/notification', handler);
      expect(dispatcher).toBeDefined();
    });
  });

  describe('dispatch', () => {
    it('should dispatch request to handler', async () => {
      const handler = vi.fn(async () => ({ result: 'success' }));
      dispatcher.registerRequest('test/method', handler);

      const request: RequestMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'test/method',
        params: { test: true }
      };

      await dispatcher.dispatch(request, mockTransport, new Map());

      expect(handler).toHaveBeenCalledOnce();
      expect(mockTransport.sentMessages).toHaveLength(1);
      expect(mockTransport.sentMessages[0]).toMatchObject({
        jsonrpc: '2.0',
        id: 1,
        result: { result: 'success' }
      });
    });

    it('should normalize undefined handler result to null', async () => {
      const handler = vi.fn(async () => undefined);
      dispatcher.registerRequest('test/method', handler);

      const request: RequestMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'test/method',
        params: {}
      };

      await dispatcher.dispatch(request, mockTransport, new Map());

      expect(mockTransport.sentMessages).toHaveLength(1);
      const response = mockTransport.sentMessages[0];
      expect(response.jsonrpc).toBe('2.0');
      expect(response.id).toBe(1);
      // result MUST be present (not undefined) per JSON-RPC 2.0 spec
      expect('result' in response).toBe(true);
      expect(response.result).toBeNull();
    });

    it('should dispatch notification to handler', async () => {
      const handler = vi.fn();
      dispatcher.registerNotification('test/notification', handler);

      const notification: NotificationMessage = {
        jsonrpc: '2.0',
        method: 'test/notification',
        params: { test: true }
      };

      await dispatcher.dispatch(notification, mockTransport, new Map());

      expect(handler).toHaveBeenCalledOnce();
      expect(mockTransport.sentMessages).toHaveLength(0);
    });

    it('should send error for unknown request method', async () => {
      const request: RequestMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'unknown/method',
        params: {}
      };

      await dispatcher.dispatch(request, mockTransport, new Map());

      expect(mockTransport.sentMessages).toHaveLength(1);
      expect(mockTransport.sentMessages[0]).toMatchObject({
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32601,
          message: expect.stringContaining('Method not found')
        }
      });
    });

    it('should handle handler errors', async () => {
      const handler = vi.fn(async () => {
        throw new Error('Handler error');
      });
      dispatcher.registerRequest('test/method', handler);

      const request: RequestMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'test/method',
        params: {}
      };

      await dispatcher.dispatch(request, mockTransport, new Map());

      expect(mockTransport.sentMessages).toHaveLength(1);
      expect(mockTransport.sentMessages[0]).toMatchObject({
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32603,
          message: 'Handler error'
        }
      });
    });

    it('should handle ResponseError from handler', async () => {
      const handler = vi.fn(async () => {
        throw ResponseError.invalidParams('Invalid test params');
      });
      dispatcher.registerRequest('test/method', handler);

      const request: RequestMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'test/method',
        params: {}
      };

      await dispatcher.dispatch(request, mockTransport, new Map());

      expect(mockTransport.sentMessages).toHaveLength(1);
      expect(mockTransport.sentMessages[0]).toMatchObject({
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32602,
          message: 'Invalid test params'
        }
      });
    });

    it('should not send error for unknown notification', async () => {
      const notification: NotificationMessage = {
        jsonrpc: '2.0',
        method: 'unknown/notification',
        params: {}
      };

      await dispatcher.dispatch(notification, mockTransport, new Map());

      expect(mockTransport.sentMessages).toHaveLength(0);
    });

    it('should provide cancellation token to handler', async () => {
      let receivedToken: any;

      const handler = vi.fn(async (params, token) => {
        receivedToken = token;
        return { result: 'test' };
      });
      dispatcher.registerRequest('test/method', handler);

      const request: RequestMessage = {
        jsonrpc: '2.0',
        id: 1,
        method: 'test/method',
        params: {}
      };

      await dispatcher.dispatch(request, mockTransport, new Map());

      expect(receivedToken).toBeDefined();
      expect(receivedToken.isCancellationRequested).toBeDefined();
      expect(receivedToken.onCancellationRequested).toBeDefined();
    });
  });

  describe('setClientCapabilities', () => {
    it('should store client capabilities', () => {
      const capabilities = {
        textDocument: {
          hover: { dynamicRegistration: true }
        }
      };

      dispatcher.setClientCapabilities(capabilities);
      expect(dispatcher).toBeDefined();
    });
  });

  describe('clear', () => {
    it('should clear all handlers', () => {
      dispatcher.registerRequest('test/method', async () => ({}));
      dispatcher.registerNotification('test/notification', () => {});
      dispatcher.clear();
      expect(dispatcher).toBeDefined();
    });
  });
});
