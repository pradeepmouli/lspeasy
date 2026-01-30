/**
 * Unit tests for WebSocketTransport
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WebSocketTransport } from '../../src/transport/websocket';
import type { Message } from '../../src/types';
import { EventEmitter } from 'events';
import type WebSocket from 'ws';

// Mock WebSocket
class MockWebSocket extends EventEmitter {
  readyState = 1; // OPEN
  CONNECTING = 0;
  OPEN = 1;
  CLOSING = 2;
  CLOSED = 3;

  send = vi.fn((data: string, callback?: (error?: Error) => void) => {
    if (callback) callback();
  });

  close = vi.fn(() => {
    this.readyState = this.CLOSED;
    setImmediate(() => this.emit('close'));
  });

  ping = vi.fn();

  // Add on method for event listening (needed by the transport)
  on(event: string, handler: any) {
    return super.on(event, handler);
  }
}

describe('WebSocketTransport', () => {
  describe('Server mode', () => {
    let mockSocket: MockWebSocket;
    let transport: WebSocketTransport;

    beforeEach(async () => {
      mockSocket = new MockWebSocket();
      transport = new WebSocketTransport({
        socket: mockSocket as unknown as WebSocket
      });
      // Emit open event and wait for it to be processed
      mockSocket.emit('open');
      await new Promise((resolve) => setImmediate(resolve));
    });

    afterEach(async () => {
      await transport.close();
    });

    it('should send messages via WebSocket', async () => {
      const message: Message = {
        jsonrpc: '2.0',
        method: 'test',
        id: 1
      };

      await transport.send(message);

      expect(mockSocket.send).toHaveBeenCalledWith(
        JSON.stringify(message),
        expect.any(Function)
      );
    });

    it('should receive messages from WebSocket', async () => {
      const message: Message = {
        jsonrpc: '2.0',
        method: 'test',
        id: 1
      };

      const messagePromise = new Promise<Message>((resolve) => {
        transport.onMessage((msg) => resolve(msg));
      });

      mockSocket.emit('message', JSON.stringify(message));

      const received = await messagePromise;
      expect(received).toEqual(message);
    });

    it('should handle WebSocket errors', async () => {
      const testError = new Error('WebSocket error');

      const errorPromise = new Promise<Error>((resolve) => {
        transport.onError((err) => resolve(err));
      });

      mockSocket.emit('error', testError);

      const receivedError = await errorPromise;
      expect(receivedError.message).toBe('WebSocket error');
    });

    it('should emit close event when WebSocket closes', async () => {
      const closePromise = new Promise<void>((resolve) => {
        transport.onClose(() => resolve());
      });

      mockSocket.emit('close');

      await closePromise;
    });

    it('should close WebSocket when transport closes', async () => {
      await transport.close();

      expect(mockSocket.close).toHaveBeenCalled();
    });

    it('should handle invalid JSON messages', async () => {
      const errorPromise = new Promise<Error>((resolve) => {
        transport.onError((err) => resolve(err));
      });

      mockSocket.emit('message', 'invalid json {');

      const error = await errorPromise;
      expect(error.message).toContain('Failed to parse');
    });

    it('should not send after close', async () => {
      await transport.close();

      const message: Message = {
        jsonrpc: '2.0',
        method: 'test',
        id: 1
      };

      await expect(transport.send(message)).rejects.toThrow('WebSocket is not connected');
    });

    it('should handle multiple message handlers', async () => {
      const message: Message = {
        jsonrpc: '2.0',
        method: 'test',
        id: 1
      };

      const handlers = [
        vi.fn(),
        vi.fn(),
        vi.fn()
      ];

      handlers.forEach((handler) => {
        transport.onMessage(handler);
      });

      mockSocket.emit('message', JSON.stringify(message));

      // Wait for handlers to be called
      await new Promise((resolve) => setImmediate(resolve));

      handlers.forEach((handler) => {
        expect(handler).toHaveBeenCalledWith(message);
      });
    });

    it('should allow unsubscribing message handlers', async () => {
      const handler = vi.fn();
      const disposable = transport.onMessage(handler);

      const message: Message = {
        jsonrpc: '2.0',
        method: 'test',
        id: 1
      };

      mockSocket.emit('message', JSON.stringify(message));
      await new Promise((resolve) => setImmediate(resolve));
      expect(handler).toHaveBeenCalledTimes(1);

      disposable.dispose();

      mockSocket.emit('message', JSON.stringify(message));
      await new Promise((resolve) => setImmediate(resolve));
      expect(handler).toHaveBeenCalledTimes(1); // Not called again
    });
  });

  describe('Client mode with reconnection', () => {
    it('should accept client mode configuration', () => {
      expect(() => {
        new WebSocketTransport({
          url: 'ws://localhost:3000',
          enableReconnect: true,
          maxReconnectAttempts: 3,
          reconnectDelay: 1000
        });
      }).not.toThrow();
    });

    it('should throw if neither socket nor url provided', () => {
      expect(() => {
        new WebSocketTransport({} as any);
      }).toThrow('Either url or socket must be provided');
    });

    it('should throw if both socket and url provided', () => {
      const mockSocket = new MockWebSocket();
      expect(() => {
        new WebSocketTransport({
          socket: mockSocket as unknown as WebSocket,
          url: 'ws://localhost:3000'
        } as any);
      }).toThrow('Cannot provide both url and socket');
    });
  });

  describe('Error handling', () => {
    let mockSocket: MockWebSocket;
    let transport: WebSocketTransport;

    beforeEach(async () => {
      mockSocket = new MockWebSocket();
      transport = new WebSocketTransport({
        socket: mockSocket as unknown as WebSocket
      });
      // Emit open event and wait for it to be processed
      mockSocket.emit('open');
      await new Promise((resolve) => setImmediate(resolve));
    });

    afterEach(async () => {
      await transport.close();
    });

    it('should handle send errors gracefully', async () => {
      mockSocket.send = vi.fn((data: string, callback?: (error?: Error) => void) => {
        if (callback) callback(new Error('Send failed'));
      });

      const message: Message = {
        jsonrpc: '2.0',
        method: 'test',
        id: 1
      };

      await expect(transport.send(message)).rejects.toThrow('Failed to send message: Send failed');
    });

    it('should not throw when closing already closed transport', async () => {
      await transport.close();
      await expect(transport.close()).resolves.not.toThrow();
    });
  });
});
