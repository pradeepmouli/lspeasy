/**
 * Integration tests for partial result streaming
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LSPServer } from '@lspy/server';
import { LSPClient } from '@lspy/client';
import { StdioTransport, createPartialResultParams, createProgressToken } from '@lspy/core';
import type { ProgressToken, CompletionItem, CompletionList } from '@lspy/core';

describe('Partial Result Streaming Integration', () => {
  let server: LSPServer;
  let client: LSPClient;
  let serverTransport: StdioTransport;
  let clientTransport: StdioTransport;

  beforeEach(() => {
    server = new LSPServer({
      name: 'Test Server',
      version: '1.0.0'
    });

    client = new LSPClient({
      name: 'Test Client',
      version: '1.0.0',
      capabilities: {
        textDocument: {
          completion: {
            dynamicRegistration: false,
            completionItem: {
              documentationFormat: ['markdown', 'plaintext']
            }
          }
        }
      }
    });
  });

  afterEach(async () => {
    try {
      await client.disconnect();
    } catch {
      // Ignore errors
    }
    try {
      await server.shutdown();
    } catch {
      // Ignore errors
    }
  });

  it('should stream completion results using partial result token', async () => {
    const partialResults: CompletionItem[][] = [];
    const partialResultToken = createProgressToken();

    // Set up server capabilities
    server.setCapabilities({
      completionProvider: {
        triggerCharacters: ['.'],
        resolveProvider: false
      }
    });

    // Handle completion request with partial results
    server.onRequest('textDocument/completion', async (params) => {
      // Check if partial result token is provided
      const hasPartialToken = 'partialResultToken' in params;

      if (hasPartialToken) {
        // Stream results in batches
        const batch1: CompletionItem[] = [
          { label: 'item1', kind: 1 },
          { label: 'item2', kind: 1 }
        ];

        const batch2: CompletionItem[] = [
          { label: 'item3', kind: 1 },
          { label: 'item4', kind: 1 }
        ];

        const batch3: CompletionItem[] = [
          { label: 'item5', kind: 1 },
          { label: 'item6', kind: 1 }
        ];

        // Send partial results
        await server.sendNotification('$/progress', {
          token: (params as any).partialResultToken,
          value: batch1
        });

        await new Promise((resolve) => setTimeout(resolve, 50));

        await server.sendNotification('$/progress', {
          token: (params as any).partialResultToken,
          value: batch2
        });

        await new Promise((resolve) => setTimeout(resolve, 50));

        await server.sendNotification('$/progress', {
          token: (params as any).partialResultToken,
          value: batch3
        });

        // Return final complete result
        return {
          isIncomplete: false,
          items: [...batch1, ...batch2, ...batch3]
        };
      }

      // Without partial results, return all at once
      return {
        isIncomplete: false,
        items: [
          { label: 'item1', kind: 1 },
          { label: 'item2', kind: 1 },
          { label: 'item3', kind: 1 },
          { label: 'item4', kind: 1 },
          { label: 'item5', kind: 1 },
          { label: 'item6', kind: 1 }
        ]
      };
    });

    // Set up client to track partial results
    client.onNotification('$/progress', (params: any) => {
      if (params.token === partialResultToken && Array.isArray(params.value)) {
        partialResults.push(params.value);
      }
    });

    serverTransport = new StdioTransport();
    clientTransport = new StdioTransport();

    await server.listen(serverTransport);
    await client.connect(clientTransport);

    // Open a document
    await client.sendNotification('textDocument/didOpen', {
      textDocument: {
        uri: 'file:///test.ts',
        languageId: 'typescript',
        version: 1,
        text: 'const x = '
      }
    });

    // Request completion with partial result token
    const completion = await client.sendRequest('textDocument/completion', {
      textDocument: { uri: 'file:///test.ts' },
      position: { line: 0, character: 10 },
      ...createPartialResultParams(partialResultToken)
    });

    // Wait for all partial results
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Verify partial results were streamed
    expect(partialResults.length).toBeGreaterThan(0);

    // Verify final result contains all items
    const items = Array.isArray(completion) ? completion : (completion as CompletionList).items;
    expect(items).toHaveLength(6);

    // Verify all items are present
    const labels = items.map((item) => item.label);
    expect(labels).toContain('item1');
    expect(labels).toContain('item2');
    expect(labels).toContain('item3');
    expect(labels).toContain('item4');
    expect(labels).toContain('item5');
    expect(labels).toContain('item6');
  });

  it('should work without partial result token', async () => {
    server.setCapabilities({
      completionProvider: {
        triggerCharacters: ['.']
      }
    });

    server.onRequest('textDocument/completion', async () => {
      return {
        isIncomplete: false,
        items: [
          { label: 'simpleItem1', kind: 1 },
          { label: 'simpleItem2', kind: 1 }
        ]
      };
    });

    serverTransport = new StdioTransport();
    clientTransport = new StdioTransport();

    await server.listen(serverTransport);
    await client.connect(clientTransport);

    // Request without partial result token
    const completion = await client.textDocument.completion({
      textDocument: { uri: 'file:///test.ts' },
      position: { line: 0, character: 0 }
    });

    expect(completion).toBeDefined();
    const items = Array.isArray(completion) ? completion : completion!.items;
    expect(items).toHaveLength(2);
    expect(items[0].label).toBe('simpleItem1');
    expect(items[1].label).toBe('simpleItem2');
  });

  it('should handle partial results for large datasets', async () => {
    const partialResultToken = createProgressToken();
    const totalItems = 1000;
    const batchSize = 100;
    const receivedBatches: number[] = [];

    server.setCapabilities({
      completionProvider: {}
    });

    server.onRequest('textDocument/completion', async (params) => {
      if ('partialResultToken' in params) {
        const token = (params as any).partialResultToken;

        // Stream in batches
        for (let i = 0; i < totalItems; i += batchSize) {
          const batch = Array.from({ length: batchSize }, (_, j) => ({
            label: `item${i + j}`,
            kind: 1
          }));

          await server.sendNotification('$/progress', {
            token,
            value: batch
          });

          await new Promise((resolve) => setTimeout(resolve, 10));
        }

        // Return full result
        return {
          isIncomplete: false,
          items: Array.from({ length: totalItems }, (_, i) => ({
            label: `item${i}`,
            kind: 1
          }))
        };
      }

      return { isIncomplete: false, items: [] };
    });

    client.onNotification('$/progress', (params: any) => {
      if (params.token === partialResultToken && Array.isArray(params.value)) {
        receivedBatches.push(params.value.length);
      }
    });

    serverTransport = new StdioTransport();
    clientTransport = new StdioTransport();

    await server.listen(serverTransport);
    await client.connect(clientTransport);

    const completion = await client.sendRequest('textDocument/completion', {
      textDocument: { uri: 'file:///large.ts' },
      position: { line: 0, character: 0 },
      ...createPartialResultParams(partialResultToken)
    });

    await new Promise((resolve) => setTimeout(resolve, 200));

    // Verify batches were received
    expect(receivedBatches.length).toBeGreaterThan(0);
    expect(receivedBatches.every((size) => size <= batchSize)).toBe(true);

    // Verify final result
    const items = Array.isArray(completion) ? completion : (completion as CompletionList).items;
    expect(items).toHaveLength(totalItems);
  });
});
