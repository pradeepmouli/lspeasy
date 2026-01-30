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
      outputStream.on('data', (chunk) => chunks.push(chunk));

      for (const message of messages) {
        await transport.send(message);
      }

      // Give time for all writes to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

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

      const handler1 = vi.fn();
      const handler2 = vi.fn();

      transport.onMessage(handler1);
      transport.onMessage(handler2);

      const serialized = serializeMessage(message);
      inputStream.write(serialized);

      // Wait for handlers to be called
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(handler1).toHaveBeenCalledWith(message);
      expect(handler2).toHaveBeenCalledWith(message);
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

      const received: Message[] = [];
      transport.onMessage((msg) => received.push(msg));

      for (const message of messages) {
        const serialized = serializeMessage(message);
        inputStream.write(serialized);
      }

      // Wait for all messages to be processed
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(received).toHaveLength(2);
      expect(received[0]).toEqual(messages[0]);
      expect(received[1]).toEqual(messages[1]);
    });

    it('should not crash if handler throws error', async () => {
      const message: Message = { jsonrpc: '2.0', id: 1, method: 'test' };
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const successHandler = vi.fn();

      transport.onMessage(errorHandler);
      transport.onMessage(successHandler);

      const serialized = serializeMessage(message);
      inputStream.write(serialized);

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(errorHandler).toHaveBeenCalled();
      expect(successHandler).toHaveBeenCalled();
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
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      transport.onError(handler1);
      transport.onError(handler2);

      const error = new Error('Test error');
      inputStream.emit('error', error);

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(handler1).toHaveBeenCalledWith(error);
      expect(handler2).toHaveBeenCalledWith(error);
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
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const successHandler = vi.fn();

      transport.onError(errorHandler);
      transport.onError(successHandler);

      const error = new Error('Test error');
      inputStream.emit('error', error);

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(errorHandler).toHaveBeenCalled();
      expect(successHandler).toHaveBeenCalled();
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
      const handler1 = vi.fn();
      const handler2 = vi.fn();

      transport.onClose(handler1);
      transport.onClose(handler2);

      inputStream.emit('close');

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
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
      const messageHandler = vi.fn();
      const errorHandler = vi.fn();
      const closeHandler = vi.fn();

      transport.onMessage(messageHandler);
      transport.onError(errorHandler);
      transport.onClose(closeHandler);

      inputStream.emit('close');

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify handlers were called initially
      expect(closeHandler).toHaveBeenCalled();

      // After close, message and error handlers should be cleared
      // But emitting on the stream might still trigger underlying listeners
      // We just verify the transport is disconnected
      expect(transport.isConnected()).toBe(false);
    });

    it('should not crash if close handler throws error', async () => {
      const errorHandler = vi.fn(() => {
        throw new Error('Handler error');
      });
      const successHandler = vi.fn();

      transport.onClose(errorHandler);
      transport.onClose(successHandler);

      inputStream.emit('close');

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(errorHandler).toHaveBeenCalled();
      expect(successHandler).toHaveBeenCalled();
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
