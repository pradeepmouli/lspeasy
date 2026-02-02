/**
 * Unit tests for sendRequest and sendNotification
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LSPClient } from '../../src/client.js';
import { StdioTransport, CancellationTokenSource } from '@lspeasy/core';
import { PassThrough } from 'node:stream';

describe('LSPClient requests and notifications', () => {
  let client: LSPClient;
  let inputStream: PassThrough;
  let outputStream: PassThrough;
  let transport: StdioTransport;

  beforeEach(async () => {
    inputStream = new PassThrough();
    outputStream = new PassThrough();
    transport = new StdioTransport({
      input: inputStream,
      output: outputStream
    });

    client = new LSPClient({
      name: 'test-client',
      version: '1.0.0'
    });

    // Connect and initialize
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
  });

  describe('sendRequest', () => {
    it('should send request and receive response', async () => {
      const requestPromise = client.sendRequest('textDocument/hover', {
        textDocument: { uri: 'file:///test.ts' },
        position: { line: 0, character: 5 }
      });

      // Wait for request to be sent
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Simulate server response
      const hoverResponse = {
        jsonrpc: '2.0',
        id: 2,
        result: {
          contents: 'Test hover'
        }
      };
      const responseStr = JSON.stringify(hoverResponse);
      const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
      inputStream.write(buffer);

      const result = await requestPromise;
      expect(result).toEqual({ contents: 'Test hover' });
    });

    it('should reject on error response', async () => {
      const requestPromise = client.sendRequest('textDocument/definition', {
        textDocument: { uri: 'file:///test.ts' },
        position: { line: 0, character: 5 }
      });

      await new Promise((resolve) => setTimeout(resolve, 10));

      // Simulate server error response
      const errorResponse = {
        jsonrpc: '2.0',
        id: 2,
        error: {
          code: -32601,
          message: 'Method not found'
        }
      };
      const responseStr = JSON.stringify(errorResponse);
      const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
      inputStream.write(buffer);

      await expect(requestPromise).rejects.toThrow('Method not found');
    });

    it('should support cancellable requests', async () => {
      const cancelSource = new CancellationTokenSource();

      const requestPromise = client.sendRequest(
        'textDocument/completion',
        {
          textDocument: { uri: 'file:///test.ts' },
          position: { line: 0, character: 5 }
        },
        cancelSource.token
      );

      // Cancel the request
      await new Promise((resolve) => setTimeout(resolve, 10));
      cancelSource.cancel();

      await expect(requestPromise).rejects.toThrow('Request was cancelled');
    });

    it('should handle already cancelled token', async () => {
      const cancelSource = new CancellationTokenSource();
      cancelSource.cancel();

      const requestPromise = client.sendRequest(
        'textDocument/hover',
        {
          textDocument: { uri: 'file:///test.ts' },
          position: { line: 0, character: 5 }
        },
        cancelSource.token
      );

      await expect(requestPromise).rejects.toThrow('Request was cancelled');
    });

    it('should throw if not connected', async () => {
      const disconnectedClient = new LSPClient();

      await expect(
        disconnectedClient.sendRequest('textDocument/hover', {
          textDocument: { uri: 'file:///test.ts' },
          position: { line: 0, character: 5 }
        })
      ).rejects.toThrow('Client is not connected');
    });
  });

  describe('sendNotification', () => {
    it('should send notification without waiting for response', async () => {
      let didOpenSeen = false;
      const outputPromise = new Promise<string>((resolve) => {
        const chunks: Buffer[] = [];
        const listener = (chunk: Buffer) => {
          chunks.push(chunk);
          const buffer = Buffer.concat(chunks);
          const str = buffer.toString('utf8');
          // Look for didOpen notification specifically (skip initialize/initialized)
          const messages = str.split('Content-Length:');
          for (const msg of messages) {
            if (msg.includes('"method":"textDocument/didOpen"') && !didOpenSeen) {
              didOpenSeen = true;
              outputStream.off('data', listener);
              // Extract just the didOpen message
              const startIdx = msg.indexOf('{');
              const endIdx = msg.lastIndexOf('}') + 1;
              resolve(msg.substring(startIdx, endIdx));
              break;
            }
          }
        };
        outputStream.on('data', listener);
      });

      await client.sendNotification('textDocument/didOpen', {
        textDocument: {
          uri: 'file:///test.ts',
          languageId: 'typescript',
          version: 1,
          text: 'const x = 1;'
        }
      });

      const output = await outputPromise;
      expect(output).toContain('"method":"textDocument/didOpen"');
      expect(output).not.toContain('"id"'); // Notifications don't have IDs
    });

    it('should throw if not connected', async () => {
      const disconnectedClient = new LSPClient();

      await expect(
        disconnectedClient.sendNotification('textDocument/didOpen', {
          textDocument: {
            uri: 'file:///test.ts',
            languageId: 'typescript',
            version: 1,
            text: ''
          }
        })
      ).rejects.toThrow('Client is not connected');
    });
  });

  describe('sendCancellableRequest', () => {
    it('should return promise and cancel function', async () => {
      const { promise, cancel } = client.sendCancellableRequest('textDocument/hover', {
        textDocument: { uri: 'file:///test.ts' },
        position: { line: 0, character: 5 }
      });

      expect(promise).toBeInstanceOf(Promise);
      expect(typeof cancel).toBe('function');

      // Cancel the request
      cancel();

      await expect(promise).rejects.toThrow('Request was cancelled');
    });
  });

  describe('onRequest', () => {
    it('should handle server-to-client requests', async () => {
      const handlerPromise = new Promise<any>((resolve) => {
        client.onRequest('workspace/configuration', async (params) => {
          resolve(params);
          return { settings: {} };
        });
      });

      // Simulate server request
      const serverRequest = {
        jsonrpc: '2.0',
        id: 100,
        method: 'workspace/configuration',
        params: { items: [] }
      };
      const requestStr = JSON.stringify(serverRequest);
      const buffer = Buffer.from(`Content-Length: ${requestStr.length}\r\n\r\n${requestStr}`);
      inputStream.write(buffer);

      const params = await handlerPromise;
      expect(params).toEqual({ items: [] });

      // Wait for response to be sent
      await new Promise((resolve) => setTimeout(resolve, 50));
    });

    it('should send error response for unhandled requests', async () => {
      const outputPromise = new Promise<string>((resolve) => {
        const chunks: Buffer[] = [];
        const listener = (chunk: Buffer) => {
          chunks.push(chunk);
          const buffer = Buffer.concat(chunks);
          const str = buffer.toString('utf8');
          if (str.includes('"error"') && str.includes('"id":100')) {
            outputStream.off('data', listener);
            resolve(str);
          }
        };
        outputStream.on('data', listener);
      });

      // Simulate server request without handler
      const serverRequest = {
        jsonrpc: '2.0',
        id: 100,
        method: 'unknown/method',
        params: {}
      };
      const requestStr = JSON.stringify(serverRequest);
      const buffer = Buffer.from(`Content-Length: ${requestStr.length}\r\n\r\n${requestStr}`);
      inputStream.write(buffer);

      const output = await outputPromise;
      expect(output).toContain('"error"');
      expect(output).toContain('Method not found');
    });

    it('should return disposable to unregister handler', async () => {
      const handler = async () => ({ result: 'test' });

      const disposable = client.onRequest('test/method', handler);
      expect(disposable.dispose).toBeDefined();

      disposable.dispose();

      // After disposal, the handler should not be called
      // This is validated by checking error response
      const outputPromise = new Promise<string>((resolve) => {
        const chunks: Buffer[] = [];
        const listener = (chunk: Buffer) => {
          chunks.push(chunk);
          const buffer = Buffer.concat(chunks);
          const str = buffer.toString('utf8');
          if (str.includes('"error"')) {
            outputStream.off('data', listener);
            resolve(str);
          }
        };
        outputStream.on('data', listener);
      });

      const serverRequest = {
        jsonrpc: '2.0',
        id: 101,
        method: 'test/method',
        params: {}
      };
      const requestStr = JSON.stringify(serverRequest);
      const buffer = Buffer.from(`Content-Length: ${requestStr.length}\r\n\r\n${requestStr}`);
      inputStream.write(buffer);

      const output = await outputPromise;
      expect(output).toContain('Method not found');
    });
  });

  describe('onNotification', () => {
    it('should handle server notifications', async () => {
      const notificationPromise = new Promise<any>((resolve) => {
        client.onNotification('window/logMessage', (params) => {
          resolve(params);
        });
      });

      // Simulate server notification
      const serverNotification = {
        jsonrpc: '2.0',
        method: 'window/logMessage',
        params: { type: 3, message: 'Test log' }
      };
      const notifStr = JSON.stringify(serverNotification);
      const buffer = Buffer.from(`Content-Length: ${notifStr.length}\r\n\r\n${notifStr}`);
      inputStream.write(buffer);

      const params = await notificationPromise;
      expect(params).toEqual({ type: 3, message: 'Test log' });
    });

    it('should return disposable to unregister handler', () => {
      const handler = () => {};

      const disposable = client.onNotification('test/notification', handler);
      expect(disposable.dispose).toBeDefined();

      disposable.dispose();
    });
  });
});
