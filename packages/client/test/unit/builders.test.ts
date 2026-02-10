/**
 * Unit tests for high-level method builders (textDocument.*, workspace.*)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LSPClient } from '../../src/client.js';
import { StdioTransport } from '@lspeasy/core';
import { PassThrough } from 'node:stream';

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
    outputStream.on('data', (chunk: Buffer) => {
      const message = parseMessage(chunk);
      if (message?.method === method && message.id !== undefined) {
        resolve(message.id);
      }
    });
  });
};

describe('High-level method builders', () => {
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

    client = new LSPClient();

    // Connect and initialize
    const initIdPromise = captureRequestId(outputStream, 'initialize');
    const connectPromise = client.connect(transport);

    const initId = await initIdPromise;
    const initResponse = {
      jsonrpc: '2.0',
      id: initId,
      result: {
        capabilities: {
          hoverProvider: true,
          completionProvider: {},
          definitionProvider: true,
          referencesProvider: true,
          documentSymbolProvider: true,
          workspaceSymbolProvider: true,
          textDocumentSync: 1
        },
        serverInfo: { name: 'test-server' }
      }
    };
    const responseStr = JSON.stringify(initResponse);
    const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
    inputStream.write(buffer);

    await connectPromise;
  });

  describe('textDocument methods', () => {
    describe('hover', () => {
      it('should send hover request', async () => {
        const hoverIdPromise = captureRequestId(outputStream, 'textDocument/hover');
        const hoverPromise = client.textDocument.hover({
          textDocument: { uri: 'file:///test.ts' },
          position: { line: 0, character: 5 }
        });
        const hoverId = await hoverIdPromise;
        const hoverResponse = {
          jsonrpc: '2.0',
          id: hoverId,
          result: {
            contents: { kind: 'markdown', value: '**test**' }
          }
        };
        const responseStr = JSON.stringify(hoverResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);

        const result = await hoverPromise;
        expect(result).toEqual({
          contents: { kind: 'markdown', value: '**test**' }
        });
      });
    });

    describe('completion', () => {
      it('should send completion request', async () => {
        const completionIdPromise = captureRequestId(outputStream, 'textDocument/completion');
        const completionPromise = client.textDocument.completion({
          textDocument: { uri: 'file:///test.ts' },
          position: { line: 0, character: 5 }
        });
        const completionId = await completionIdPromise;
        const completionResponse = {
          jsonrpc: '2.0',
          id: completionId,
          result: {
            isIncomplete: false,
            items: [{ label: 'test1' }, { label: 'test2' }]
          }
        };
        const responseStr = JSON.stringify(completionResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);

        const result = await completionPromise;
        expect(result).toHaveProperty('items');
      });
    });

    describe('definition', () => {
      it('should send definition request', async () => {
        const definitionIdPromise = captureRequestId(outputStream, 'textDocument/definition');
        const definitionPromise = client.textDocument.definition({
          textDocument: { uri: 'file:///test.ts' },
          position: { line: 0, character: 5 }
        });
        const definitionId = await definitionIdPromise;
        const definitionResponse = {
          jsonrpc: '2.0',
          id: definitionId,
          result: {
            uri: 'file:///test.ts',
            range: {
              start: { line: 5, character: 0 },
              end: { line: 5, character: 10 }
            }
          }
        };
        const responseStr = JSON.stringify(definitionResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);

        const result = await definitionPromise;
        expect(result).toHaveProperty('uri');
      });
    });

    describe('references', () => {
      it('should send references request', async () => {
        const referencesIdPromise = captureRequestId(outputStream, 'textDocument/references');
        const referencesPromise = client.textDocument.references({
          textDocument: { uri: 'file:///test.ts' },
          position: { line: 0, character: 5 },
          context: { includeDeclaration: true }
        });
        const referencesId = await referencesIdPromise;
        const referencesResponse = {
          jsonrpc: '2.0',
          id: referencesId,
          result: [
            {
              uri: 'file:///test.ts',
              range: {
                start: { line: 0, character: 5 },
                end: { line: 0, character: 10 }
              }
            }
          ]
        };
        const responseStr = JSON.stringify(referencesResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);

        const result = await referencesPromise;
        expect(Array.isArray(result)).toBe(true);
      });
    });

    describe('documentSymbol', () => {
      it('should send documentSymbol request', async () => {
        const symbolIdPromise = captureRequestId(outputStream, 'textDocument/documentSymbol');
        const symbolPromise = client.textDocument.documentSymbol({
          textDocument: { uri: 'file:///test.ts' }
        });
        const symbolId = await symbolIdPromise;
        const symbolResponse = {
          jsonrpc: '2.0',
          id: symbolId,
          result: [
            {
              name: 'test',
              kind: 12,
              range: {
                start: { line: 0, character: 0 },
                end: { line: 10, character: 0 }
              },
              selectionRange: {
                start: { line: 0, character: 0 },
                end: { line: 0, character: 4 }
              }
            }
          ]
        };
        const responseStr = JSON.stringify(symbolResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);

        const result = await symbolPromise;
        expect(Array.isArray(result)).toBe(true);
      });
    });

    describe('didOpen', () => {
      it('should send didOpen notification', async () => {
        const outputPromise = new Promise<string>((resolve) => {
          const chunks: Buffer[] = [];
          const listener = (chunk: Buffer) => {
            chunks.push(chunk);
            const buffer = Buffer.concat(chunks);
            const str = buffer.toString('utf8');
            if (str.includes('"method":"textDocument/didOpen"')) {
              outputStream.off('data', listener);
              resolve(str);
            }
          };
          outputStream.on('data', listener);
        });

        await client.textDocument.didOpen({
          textDocument: {
            uri: 'file:///test.ts',
            languageId: 'typescript',
            version: 1,
            text: 'const x = 1;'
          }
        });

        const output = await outputPromise;
        expect(output).toContain('"method":"textDocument/didOpen"');
        expect(output).toContain('typescript');
      });
    });

    describe('didChange', () => {
      it('should send didChange notification', async () => {
        const outputPromise = new Promise<string>((resolve) => {
          const chunks: Buffer[] = [];
          const listener = (chunk: Buffer) => {
            chunks.push(chunk);
            const buffer = Buffer.concat(chunks);
            const str = buffer.toString('utf8');
            if (str.includes('"method":"textDocument/didChange"')) {
              outputStream.off('data', listener);
              resolve(str);
            }
          };
          outputStream.on('data', listener);
        });

        await client.textDocument.didChange({
          textDocument: {
            uri: 'file:///test.ts',
            version: 2
          },
          contentChanges: [{ text: 'const x = 2;' }]
        });

        const output = await outputPromise;
        expect(output).toContain('"method":"textDocument/didChange"');
      });
    });

    describe('didClose', () => {
      it('should send didClose notification', async () => {
        const outputPromise = new Promise<string>((resolve) => {
          const chunks: Buffer[] = [];
          const listener = (chunk: Buffer) => {
            chunks.push(chunk);
            const buffer = Buffer.concat(chunks);
            const str = buffer.toString('utf8');
            if (str.includes('"method":"textDocument/didClose"')) {
              outputStream.off('data', listener);
              resolve(str);
            }
          };
          outputStream.on('data', listener);
        });

        await client.textDocument.didClose({
          textDocument: { uri: 'file:///test.ts' }
        });

        const output = await outputPromise;
        expect(output).toContain('"method":"textDocument/didClose"');
      });
    });

    describe('didSave', () => {
      it('should send didSave notification', async () => {
        const outputPromise = new Promise<string>((resolve) => {
          const chunks: Buffer[] = [];
          const listener = (chunk: Buffer) => {
            chunks.push(chunk);
            const buffer = Buffer.concat(chunks);
            const str = buffer.toString('utf8');
            if (str.includes('"method":"textDocument/didSave"')) {
              outputStream.off('data', listener);
              resolve(str);
            }
          };
          outputStream.on('data', listener);
        });

        await client.textDocument.didSave({
          textDocument: { uri: 'file:///test.ts' }
        });

        const output = await outputPromise;
        expect(output).toContain('"method":"textDocument/didSave"');
      });
    });
  });

  describe('workspace methods', () => {
    describe('symbol', () => {
      it('should send workspace/symbol request', async () => {
        const symbolIdPromise = captureRequestId(outputStream, 'workspace/symbol');
        const symbolPromise = client.workspace.symbol({
          query: 'test'
        });
        const symbolId = await symbolIdPromise;
        const symbolResponse = {
          jsonrpc: '2.0',
          id: symbolId,
          result: [
            {
              name: 'TestClass',
              kind: 5,
              location: {
                uri: 'file:///test.ts',
                range: {
                  start: { line: 0, character: 0 },
                  end: { line: 10, character: 0 }
                }
              }
            }
          ]
        };
        const responseStr = JSON.stringify(symbolResponse);
        const buffer = Buffer.from(`Content-Length: ${responseStr.length}\r\n\r\n${responseStr}`);
        inputStream.write(buffer);

        const result = await symbolPromise;
        expect(Array.isArray(result)).toBe(true);
      });
    });

    describe('didChangeWorkspaceFolders', () => {
      it('should send didChangeWorkspaceFolders notification', async () => {
        const outputPromise = new Promise<string>((resolve) => {
          const chunks: Buffer[] = [];
          const listener = (chunk: Buffer) => {
            chunks.push(chunk);
            const buffer = Buffer.concat(chunks);
            const str = buffer.toString('utf8');
            if (str.includes('"method":"workspace/didChangeWorkspaceFolders"')) {
              outputStream.off('data', listener);
              resolve(str);
            }
          };
          outputStream.on('data', listener);
        });

        await client.workspace.didChangeWorkspaceFolders({
          event: {
            added: [{ uri: 'file:///workspace', name: 'workspace' }],
            removed: []
          }
        });

        const output = await outputPromise;
        expect(output).toContain('"method":"workspace/didChangeWorkspaceFolders"');
      });
    });

    describe('didChangeConfiguration', () => {
      it('should send didChangeConfiguration notification', async () => {
        const outputPromise = new Promise<string>((resolve) => {
          const chunks: Buffer[] = [];
          const listener = (chunk: Buffer) => {
            chunks.push(chunk);
            const buffer = Buffer.concat(chunks);
            const str = buffer.toString('utf8');
            if (str.includes('"method":"workspace/didChangeConfiguration"')) {
              outputStream.off('data', listener);
              resolve(str);
            }
          };
          outputStream.on('data', listener);
        });

        await client.workspace.didChangeConfiguration({
          settings: { test: true }
        });

        const output = await outputPromise;
        expect(output).toContain('"method":"workspace/didChangeConfiguration"');
      });
    });

    describe('didChangeWatchedFiles', () => {
      it('should send didChangeWatchedFiles notification', async () => {
        const outputPromise = new Promise<string>((resolve) => {
          const chunks: Buffer[] = [];
          const listener = (chunk: Buffer) => {
            chunks.push(chunk);
            const buffer = Buffer.concat(chunks);
            const str = buffer.toString('utf8');
            if (str.includes('"method":"workspace/didChangeWatchedFiles"')) {
              outputStream.off('data', listener);
              resolve(str);
            }
          };
          outputStream.on('data', listener);
        });

        await client.workspace.didChangeWatchedFiles({
          changes: [{ uri: 'file:///test.ts', type: 1 }]
        });

        const output = await outputPromise;
        expect(output).toContain('"method":"workspace/didChangeWatchedFiles"');
      });
    });
  });
});
