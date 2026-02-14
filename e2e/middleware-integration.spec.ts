import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LSPClient } from '@lspeasy/client';
import { LSPServer } from '@lspeasy/server';
import type { Middleware } from '@lspeasy/core';
import { createConnectedStdioTransports } from './transport-utils.js';

describe('middleware integration (e2e)', () => {
  let server: LSPServer;
  let client: LSPClient;

  beforeEach(() => {
    server = new LSPServer({
      name: 'middleware-server',
      version: '1.0.0'
    });

    client = new LSPClient({
      name: 'middleware-client',
      version: '1.0.0'
    });
  });

  afterEach(async () => {
    try {
      await client.disconnect();
    } catch {
      // ignore
    }
    try {
      await server.shutdown();
    } catch {
      // ignore
    }
  });

  it('executes middleware pipeline with multiple middleware in both directions', async () => {
    const seen: string[] = [];

    const mwA: Middleware = async (context, next) => {
      seen.push(`A:before:${context.direction}:${context.messageType}:${context.method}`);
      await next();
      seen.push(`A:after:${context.direction}:${context.messageType}:${context.method}`);
    };

    const mwB: Middleware = async (context, next) => {
      seen.push(`B:before:${context.direction}:${context.messageType}:${context.method}`);
      await next();
      seen.push(`B:after:${context.direction}:${context.messageType}:${context.method}`);
    };

    server = new LSPServer({
      name: 'middleware-server',
      version: '1.0.0',
      middleware: [mwA, mwB]
    });

    client = new LSPClient({
      name: 'middleware-client',
      version: '1.0.0',
      middleware: [mwA, mwB]
    });

    server.setCapabilities({ hoverProvider: true });
    server.onRequest('textDocument/hover', async () => ({
      contents: { kind: 'plaintext', value: 'ok' }
    }));

    const { serverTransport, clientTransport } = createConnectedStdioTransports();

    await server.listen(serverTransport);
    await client.connect(clientTransport);

    const hover = await client.sendRequest('textDocument/hover', {
      textDocument: { uri: 'file:///middleware.ts' },
      position: { line: 0, character: 0 }
    });

    expect(hover).toBeDefined();
    expect(seen.some((entry) => entry.includes('clientToServer:request:textDocument/hover'))).toBe(
      true
    );
    expect(seen.some((entry) => entry.includes('serverToClient:response:textDocument/hover'))).toBe(
      true
    );
    expect(seen.filter((entry) => entry.startsWith('A:before')).length).toBeGreaterThanOrEqual(2);
    expect(seen.filter((entry) => entry.startsWith('B:before')).length).toBeGreaterThanOrEqual(2);
  });
});
