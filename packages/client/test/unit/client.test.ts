/**
 * Unit tests for LSPClient constructor and connect/disconnect
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LSPClient } from '../../src/client.js';
import { StdioTransport } from '@lspy/core';
import { PassThrough } from 'node:stream';

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

      expect(client.textDocument).toBeDefined();
      expect(client.workspace).toBeDefined();
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

      // Mock successful connection
      const connectPromise = client.connect(transport);

      // Simulate server response
      setTimeout(() => {
        const initResponse = {
          jsonrpc: '2.0',
          id: 1,
          result: {
            capabilities: {},
            serverInfo: { name: 'test-server' }
          }
        };
        const responseStr = JSON.stringify(initResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);
      }, 10);

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
        outputStream.on('data', (chunk) => {
          chunks.push(chunk);
          const buffer = Buffer.concat(chunks);
          const str = buffer.toString('utf8');
          if (str.includes('"method":"initialize"')) {
            resolve(str);
          }
        });
      });

      const connectPromise = client.connect(transport);

      const output = await outputPromise;
      expect(output).toContain('"method":"initialize"');
      expect(output).toContain('"clientInfo"');

      // Simulate server response
      const initResponse = {
        jsonrpc: '2.0',
        id: 1,
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

      const connectPromise = client.connect(transport);

      // Simulate server error response
      setTimeout(() => {
        const errorResponse = {
          jsonrpc: '2.0',
          id: 1,
          error: {
            code: -32600,
            message: 'Invalid request'
          }
        };
        const responseStr = JSON.stringify(errorResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);
      }, 10);

      await expect(connectPromise).rejects.toThrow();

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

      // Connect first
      const connectPromise = client.connect(transport);

      setTimeout(() => {
        const initResponse = {
          jsonrpc: '2.0',
          id: 1,
          result: {
            capabilities: {},
            serverInfo: { name: 'test-server' }
          }
        };
        const responseStr = JSON.stringify(initResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);
      }, 10);

      await connectPromise;

      const outputPromise = new Promise<string>((resolve) => {
        const chunks: Buffer[] = [];
        outputStream.on('data', (chunk) => {
          chunks.push(chunk);
          const buffer = Buffer.concat(chunks);
          const str = buffer.toString('utf8');
          if (str.includes('"method":"exit"')) {
            resolve(str);
          }
        });
      });

      const disconnectPromise = client.disconnect();

      // Simulate shutdown response
      setTimeout(() => {
        const shutdownResponse = {
          jsonrpc: '2.0',
          id: 2,
          result: null
        };
        const responseStr = JSON.stringify(shutdownResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);
      }, 10);

      const output = await outputPromise;
      expect(output).toContain('"method":"shutdown"');
      expect(output).toContain('"method":"exit"');

      await disconnectPromise;

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

      const connectPromise = client.connect(transport);

      setTimeout(() => {
        const initResponse = {
          jsonrpc: '2.0',
          id: 1,
          result: {
            capabilities: {},
            serverInfo: { name: 'test-server' }
          }
        };
        const responseStr = JSON.stringify(initResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);
      }, 10);

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

      const connectPromise = client.connect(transport);

      setTimeout(() => {
        const initResponse = {
          jsonrpc: '2.0',
          id: 1,
          result: {
            capabilities: {},
            serverInfo: { name: 'test-server' }
          }
        };
        const responseStr = JSON.stringify(initResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);
      }, 10);

      await connectPromise;

      const disconnectPromise = client.disconnect();

      setTimeout(() => {
        const shutdownResponse = {
          jsonrpc: '2.0',
          id: 2,
          result: null
        };
        const responseStr = JSON.stringify(shutdownResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);
      }, 10);

      await disconnectPromise;

      expect(client.isConnected()).toBe(false);
    });
  });
});
