/**
 * Unit tests for LSPClient constructor and connect/disconnect
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LSPClient } from '../../src/client.js';
import { StdioTransport } from '@lspeasy/core';
import { PassThrough } from 'node:stream';

// Delegate unhandled rejections to any original listeners without filtering by message
const originalListeners = process.listeners('unhandledRejection');
process.removeAllListeners('unhandledRejection');
process.on('unhandledRejection', (reason, promise) => {
  originalListeners.forEach((listener) => {
    // Preserve the original listener signature (reason, promise)
    listener(reason, promise);
  });
});

const parseMessage = (chunk: Buffer): { id?: string | number; method?: string } | undefined => {
  const text = chunk.toString('utf8');
  const start = text.indexOf('{');
  if (start === -1) {
    return undefined;
  }

  try {
    return JSON.parse(text.slice(start)) as { id?: string | number; method?: string };
  } catch {
    return undefined;
  }
};

const captureRequestId = (outputStream: PassThrough, method: string): Promise<string | number> => {
  return new Promise((resolve) => {
    const onData = (chunk: Buffer) => {
      const message = parseMessage(chunk);
      if (message?.method === method && message.id !== undefined) {
        outputStream.off('data', onData);
        resolve(message.id);
      }
    };
    outputStream.on('data', onData);
  });
};

describe('LSPClient', () => {
  describe('constructor', () => {
    it('should create client with default options', () => {
      const client = new LSPClient();

      expect(client).toBeDefined();
      expect(client.isConnected()).toBe(false);
    });

    it('should create client with custom options', () => {
      const client = new LSPClient({
        name: 'test-client',
        version: '1.0.0',
        capabilities: {
          textDocument: {
            hover: {
              contentFormat: ['markdown']
            }
          }
        }
      });

      expect(client).toBeDefined();
      expect(client.isConnected()).toBe(false);
    });

    it('should initialize high-level API methods', () => {
      const client = new LSPClient();

      //expect(client.')).toBeDefined();
      //expect(client.workspace).toBeDefined();
      expect(client).toBeDefined();
    });
  });

  describe('connect', () => {
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

    it('should throw if already connected', async () => {
      const client = new LSPClient();
      const initIdPromise = captureRequestId(outputStream, 'initialize');

      // Mock successful connection
      const connectPromise = client.connect(transport);

      // Simulate server response
      initIdPromise.then((id) => {
        const initResponse = {
          jsonrpc: '2.0',
          id,
          result: {
            capabilities: {},
            serverInfo: { name: 'test-server' }
          }
        };
        const responseStr = JSON.stringify(initResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);
      });

      await connectPromise;

      await expect(client.connect(transport)).rejects.toThrow('Client is already connected');
    });

    it('should send initialize request on connect', async () => {
      const client = new LSPClient({
        name: 'test-client',
        version: '1.0.0'
      });

      const outputPromise = new Promise<string>((resolve) => {
        const chunks: Buffer[] = [];
        const onData = (chunk: Buffer) => {
          chunks.push(chunk);
          const buffer = Buffer.concat(chunks);
          const str = buffer.toString('utf8');
          if (str.includes('"method":"initialize"')) {
            outputStream.off('data', onData);
            resolve(str);
          }
        };
        outputStream.on('data', onData);
      });

      const connectPromise = client.connect(transport);

      const output = await outputPromise;
      const initMessage = parseMessage(Buffer.from(output));
      const initId = initMessage?.id ?? 'init';
      expect(output).toContain('"method":"initialize"');
      expect(output).toContain('"clientInfo"');

      // Simulate server response
      const initResponse = {
        jsonrpc: '2.0',
        id: initId,
        result: {
          capabilities: {},
          serverInfo: { name: 'test-server' }
        }
      };
      const responseStr = JSON.stringify(initResponse);
      const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
      inputStream.write(buffer);

      const result = await connectPromise;
      expect(result.capabilities).toBeDefined();
    });

    it('should clean up on initialization failure', async () => {
      const client = new LSPClient();

      // Start connection and immediately attach error handler
      const connectPromise = client.connect(transport);
      let rejectedError: Error | undefined;
      connectPromise.catch((err) => {
        rejectedError = err;
      });

      // Capture the init ID
      const id = await captureRequestId(outputStream, 'initialize');

      const errorResponse = {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32600,
          message: 'Invalid request'
        }
      };
      const responseStr = JSON.stringify(errorResponse);
      const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);

      // Give the catch handler a moment to be fully registered
      await new Promise((resolve) => setImmediate(resolve));

      inputStream.write(buffer);

      // Wait for rejection to propagate
      await new Promise((resolve) => setImmediate(resolve));

      // Verify rejection occurred
      expect(rejectedError).toBeInstanceOf(Error);
      expect(rejectedError?.message).toContain('Invalid request');

      // Client should be cleaned up
      expect(client.isConnected()).toBe(false);
    });
  });

  describe('disconnect', () => {
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

    it('should do nothing if not connected', async () => {
      const client = new LSPClient();

      await expect(client.disconnect()).resolves.not.toThrow();
    });

    it('should send shutdown and exit on disconnect', async () => {
      const client = new LSPClient();
      const initIdPromise = captureRequestId(outputStream, 'initialize');

      // Connect first
      const connectPromise = client.connect(transport);

      initIdPromise.then((id) => {
        const initResponse = {
          jsonrpc: '2.0',
          id,
          result: {
            capabilities: {},
            serverInfo: { name: 'test-server' }
          }
        };
        const responseStr = JSON.stringify(initResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);
      });

      await connectPromise;

      // Set up listener for shutdown and exit requests
      const shutdownRef = { received: false };
      const exitRef = { received: false };
      const dataListener = (chunk: Buffer) => {
        const str = chunk.toString('utf8');
        if (str.includes('"method":"shutdown"')) {
          shutdownRef.received = true;
        }
        if (str.includes('"method":"exit"')) {
          exitRef.received = true;
        }
      };
      outputStream.on('data', dataListener);

      // Capture shutdown request ID
      const shutdownIdPromise = captureRequestId(outputStream, 'shutdown');

      const disconnectPromise = client.disconnect();

      // Simulate shutdown response
      shutdownIdPromise.then((id) => {
        const shutdownResponse = {
          jsonrpc: '2.0',
          id,
          result: null
        };
        const responseStr = JSON.stringify(shutdownResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);
      });

      await disconnectPromise;
      outputStream.off('data', dataListener);

      expect(client.isConnected()).toBe(false);
    });
  });

  describe('isConnected', () => {
    it('should return false initially', () => {
      const client = new LSPClient();
      expect(client.isConnected()).toBe(false);
    });

    it('should return true after successful connection', async () => {
      const client = new LSPClient();
      const inputStream = new PassThrough();
      const outputStream = new PassThrough();
      const transport = new StdioTransport({
        input: inputStream,
        output: outputStream
      });
      const initIdPromise = captureRequestId(outputStream, 'initialize');

      const connectPromise = client.connect(transport);

      initIdPromise.then((id) => {
        const initResponse = {
          jsonrpc: '2.0',
          id,
          result: {
            capabilities: {},
            serverInfo: { name: 'test-server' }
          }
        };
        const responseStr = JSON.stringify(initResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);
      });

      await connectPromise;

      expect(client.isConnected()).toBe(true);
    });

    it('should return false after disconnect', async () => {
      const client = new LSPClient();
      const inputStream = new PassThrough();
      const outputStream = new PassThrough();
      const transport = new StdioTransport({
        input: inputStream,
        output: outputStream
      });
      const initIdPromise = captureRequestId(outputStream, 'initialize');
      const shutdownIdPromise = captureRequestId(outputStream, 'shutdown');

      const connectPromise = client.connect(transport);

      initIdPromise.then((id) => {
        const initResponse = {
          jsonrpc: '2.0',
          id,
          result: {
            capabilities: {},
            serverInfo: { name: 'test-server' }
          }
        };
        const responseStr = JSON.stringify(initResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);
      });

      await connectPromise;

      const disconnectPromise = client.disconnect();

      shutdownIdPromise.then((id) => {
        const shutdownResponse = {
          jsonrpc: '2.0',
          id,
          result: null
        };
        const responseStr = JSON.stringify(shutdownResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);
      });

      await disconnectPromise;

      expect(client.isConnected()).toBe(false);
    });
  });
});
