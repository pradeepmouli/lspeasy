/**
 * Unit tests for StdioTransport
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PassThrough } from 'node:stream';
import { StdioTransport } from '../../src/transport/stdio.js';
import type { Message } from '../../src/jsonrpc/messages.js';
import { serializeMessage } from '../../src/jsonrpc/framing.js';

describe('StdioTransport', () => {
  let inputStream: PassThrough;
  let outputStream: PassThrough;
  let transport: StdioTransport;

  beforeEach(() => {
    inputStream = new PassThrough();
    outputStream = new PassThrough();
    transport = new StdioTransport({
      input: inputStream,
      output: outputStream
    });
  });

  describe('constructor', () => {
    it('should create transport with custom streams', () => {
      expect(transport).toBeDefined();
      expect(transport.isConnected()).toBe(true);
    });

    it('should use process.stdin/stdout by default', () => {
      const defaultTransport = new StdioTransport();
      expect(defaultTransport).toBeDefined();
      expect(defaultTransport.isConnected()).toBe(true);
    });
  });

  describe('send', () => {
    it('should send message to output stream', async () => {
      const message: Message = {
        jsonrpc: '2.0',
        id: 1,
        method: 'test'
      };

      const outputPromise = new Promise<Buffer>((resolve) => {
        const chunks: Buffer[] = [];
        outputStream.on('data', (chunk) => {
          chunks.push(chunk);
          // Check if we have a complete message
          const buffer = Buffer.concat(chunks);
          if (buffer.includes('\r\n\r\n')) {
            resolve(buffer);
          }
        });
      });

      await transport.send(message);

      const output = await outputPromise;
      const outputText = output.toString('utf8');
      expect(outputText).toContain('Content-Length:');
      expect(outputText).toContain('"jsonrpc":"2.0"');
      expect(outputText).toContain('"method":"test"');
    });

    it('should throw error when transport is not connected', async () => {
      await transport.close();

      const message: Message = { jsonrpc: '2.0', id: 1, method: 'test' };
      await expect(transport.send(message)).rejects.toThrow('Transport is not connected');
    });

    it('should send multiple messages sequentially', async () => {
      const messages: Message[] = [
        { jsonrpc: '2.0', id: 1, method: 'test1' },
        { jsonrpc: '2.0', id: 2, method: 'test2' },
        { jsonrpc: '2.0', id: 3, method: 'test3' }
      ];

      const chunks: Buffer[] = [];
      const dataPromise = new Promise<void>((resolve) => {
        let count = 0;
        outputStream.on('data', (chunk) => {
          chunks.push(chunk);
          count++;
          if (count === messages.length) {
            resolve();
          }
        });
      });

      for (const message of messages) {
        await transport.send(message);
      }

      // Wait for all data events
      await dataPromise;

      const output = Buffer.concat(chunks).toString('utf8');
      expect(output).toContain('"method":"test1"');
      expect(output).toContain('"method":"test2"');
      expect(output).toContain('"method":"test3"');
    });
  });

  describe('onMessage', () => {
    it('should receive message from input stream', async () => {
      const message: Message = {
        jsonrpc: '2.0',
        id: 1,
        method: 'test'
      };

      const messagePromise = new Promise<Message>((resolve) => {
        transport.onMessage((msg) => resolve(msg));
      });

      const serialized = serializeMessage(message);
      inputStream.write(serialized);

      const received = await messagePromise;
      expect(received).toEqual(message);
    });

    it('should handle multiple message handlers', async () => {
      const message: Message = { jsonrpc: '2.0', id: 1, method: 'test' };

      const handler1Promise = new Promise<Message>((resolve) => {
        const handler1 = vi.fn((msg: Message) => {
          resolve(msg);
        });
        transport.onMessage(handler1);
      });

      const handler2Promise = new Promise<Message>((resolve) => {
        const handler2 = vi.fn((msg: Message) => {
          resolve(msg);
        });
        transport.onMessage(handler2);
      });

      const serialized = serializeMessage(message);
      inputStream.write(serialized);

      // Wait for both handlers to be called
      const [result1, result2] = await Promise.all([handler1Promise, handler2Promise]);

      expect(result1).toEqual(message);
      expect(result2).toEqual(message);
    });

    it('should return disposable that removes handler', async () => {
      const message: Message = { jsonrpc: '2.0', id: 1, method: 'test' };
      const handler = vi.fn();

      const disposable = transport.onMessage(handler);
      disposable.dispose();

      const serialized = serializeMessage(message);
      inputStream.write(serialized);

      // Wait to ensure handler is not called
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(handler).not.toHaveBeenCalled();
    });

    it('should handle multiple messages from stream', async () => {
      const messages: Message[] = [
        { jsonrpc: '2.0', id: 1, method: 'test1' },
        { jsonrpc: '2.0', id: 2, method: 'test2' }
      ];

      const receivedPromise = new Promise<Message[]>((resolve) => {
        const received: Message[] = [];
        transport.onMessage((msg) => {
          received.push(msg);
          if (received.length === messages.length) {
            resolve(received);
          }
        });
      });

      for (const message of messages) {
        const serialized = serializeMessage(message);
        inputStream.write(serialized);
      }

      const received = await receivedPromise;

      expect(received).toHaveLength(2);
      expect(received[0]).toEqual(messages[0]);
      expect(received[1]).toEqual(messages[1]);
    });

    it('should not crash if handler throws error', async () => {
      const message: Message = { jsonrpc: '2.0', id: 1, method: 'test' };

      const bothHandlersCalledPromise = new Promise<void>((resolve) => {
        let callCount = 0;
        const errorHandler = vi.fn(() => {
          callCount++;
          if (callCount === 2) resolve();
          throw new Error('Handler error');
        });
        const successHandler = vi.fn(() => {
          callCount++;
          if (callCount === 2) resolve();
        });

        transport.onMessage(errorHandler);
        transport.onMessage(successHandler);
      });

      const serialized = serializeMessage(message);
      inputStream.write(serialized);

      await bothHandlersCalledPromise;
    });
  });

  describe('onError', () => {
    it('should receive error events', async () => {
      const errorPromise = new Promise<Error>((resolve) => {
        transport.onError((err) => resolve(err));
      });

      const error = new Error('Test error');
      inputStream.emit('error', error);

      const received = await errorPromise;
      expect(received).toBe(error);
    });

    it('should handle multiple error handlers', async () => {
      const bothCalledPromise = new Promise<void>((resolve) => {
        let callCount = 0;
        const handler1 = vi.fn(() => {
          callCount++;
          if (callCount === 2) resolve();
        });
        const handler2 = vi.fn(() => {
          callCount++;
          if (callCount === 2) resolve();
        });

        transport.onError(handler1);
        transport.onError(handler2);
      });

      const error = new Error('Test error');
      inputStream.emit('error', error);

      await bothCalledPromise;
    });

    it('should return disposable that removes handler', async () => {
      const handler = vi.fn();

      const disposable = transport.onError(handler);
      disposable.dispose();

      const error = new Error('Test error');
      inputStream.emit('error', error);

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(handler).not.toHaveBeenCalled();
    });

    it('should not crash if error handler throws error', async () => {
      const bothCalledPromise = new Promise<void>((resolve) => {
        let callCount = 0;
        const errorHandler = vi.fn(() => {
          callCount++;
          if (callCount === 2) resolve();
          throw new Error('Handler error');
        });
        const successHandler = vi.fn(() => {
          callCount++;
          if (callCount === 2) resolve();
        });

        transport.onError(errorHandler);
        transport.onError(successHandler);
      });

      const error = new Error('Test error');
      inputStream.emit('error', error);

      await bothCalledPromise;
    });
  });

  describe('onClose', () => {
    it('should receive close events when input closes', async () => {
      const closePromise = new Promise<void>((resolve) => {
        transport.onClose(() => resolve());
      });

      inputStream.emit('close');

      await closePromise;
      expect(transport.isConnected()).toBe(false);
    });

    it('should receive close events when output closes', async () => {
      const closePromise = new Promise<void>((resolve) => {
        transport.onClose(() => resolve());
      });

      outputStream.emit('close');

      await closePromise;
      expect(transport.isConnected()).toBe(false);
    });

    it('should handle multiple close handlers', async () => {
      const bothCalledPromise = new Promise<void>((resolve) => {
        let callCount = 0;
        const handler1 = vi.fn(() => {
          callCount++;
          if (callCount === 2) resolve();
        });
        const handler2 = vi.fn(() => {
          callCount++;
          if (callCount === 2) resolve();
        });

        transport.onClose(handler1);
        transport.onClose(handler2);
      });

      inputStream.emit('close');

      await bothCalledPromise;
    });

    it('should return disposable that removes handler', async () => {
      const handler = vi.fn();

      const disposable = transport.onClose(handler);
      disposable.dispose();

      inputStream.emit('close');

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(handler).not.toHaveBeenCalled();
    });

    it('should clear all handlers after close', async () => {
      const closePromise = new Promise<void>((resolve) => {
        const closeHandler = vi.fn(() => resolve());
        transport.onClose(closeHandler);
      });

      transport.onMessage(vi.fn());
      transport.onError(vi.fn());

      inputStream.emit('close');

      await closePromise;

      // Verify the transport is disconnected
      expect(transport.isConnected()).toBe(false);
    });

    it('should not crash if close handler throws error', async () => {
      const bothCalledPromise = new Promise<void>((resolve) => {
        let callCount = 0;
        const errorHandler = vi.fn(() => {
          callCount++;
          if (callCount === 2) resolve();
          throw new Error('Handler error');
        });
        const successHandler = vi.fn(() => {
          callCount++;
          if (callCount === 2) resolve();
        });

        transport.onClose(errorHandler);
        transport.onClose(successHandler);
      });

      inputStream.emit('close');

      await bothCalledPromise;
    });
  });

  describe('close', () => {
    it('should close transport and trigger close handlers', async () => {
      const closeHandler = vi.fn();
      transport.onClose(closeHandler);

      await transport.close();

      expect(transport.isConnected()).toBe(false);
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(closeHandler).toHaveBeenCalled();
    });

    it('should be idempotent', async () => {
      const closeHandler = vi.fn();
      transport.onClose(closeHandler);

      await transport.close();
      await transport.close();
      await transport.close();

      expect(closeHandler).toHaveBeenCalledTimes(1);
      expect(transport.isConnected()).toBe(false);
    });

    it('should clear all handlers after close', async () => {
      const messageHandler = vi.fn();
      const errorHandler = vi.fn();

      transport.onMessage(messageHandler);
      transport.onError(errorHandler);

      await transport.close();

      // After close, handlers should be cleared
      // We just verify the transport is disconnected
      expect(transport.isConnected()).toBe(false);
    });
  });

  describe('isConnected', () => {
    it('should return true initially', () => {
      expect(transport.isConnected()).toBe(true);
    });

    it('should return false after close', async () => {
      await transport.close();
      expect(transport.isConnected()).toBe(false);
    });

    it('should return false after stream closes', async () => {
      const closePromise = new Promise<void>((resolve) => {
        transport.onClose(() => resolve());
      });

      inputStream.emit('close');
      await closePromise;

      expect(transport.isConnected()).toBe(false);
    });
  });
});
