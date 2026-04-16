import { afterEach, describe, expect, it } from 'vitest';
import { WebSocketServer } from 'ws';
import { WebSocketTransport } from '@lspeasy/core';

describe('native WebSocket transport (e2e)', () => {
  const activeServers: WebSocketServer[] = [];

  afterEach(async () => {
    for (const server of activeServers) {
      await new Promise<void>((resolve) => {
        server.close(() => resolve());
      });
    }
    activeServers.length = 0;
  });

  it('connects and exchanges messages using globalThis.WebSocket when available', async () => {
    const server = new WebSocketServer({ port: 0 });
    activeServers.push(server);

    const clientReceived: Array<{ method: string; params?: unknown }> = [];

    server.on('connection', (socket) => {
      const transport = new WebSocketTransport({ socket: socket as any });
      transport.onMessage(async (message) => {
        if ('id' in message && 'method' in message) {
          await transport.send({
            jsonrpc: '2.0',
            id: message.id,
            result: { ok: true }
          });
          await transport.send({
            jsonrpc: '2.0',
            method: 'server/ping',
            params: { accepted: true }
          });
        }
      });
    });

    await new Promise<void>((resolve) => server.once('listening', () => resolve()));
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Unable to obtain websocket server address');
    }

    const client = new WebSocketTransport({
      url: `ws://127.0.0.1:${address.port}`
    });

    client.onMessage((message) => {
      if ('method' in message && !('id' in message)) {
        clientReceived.push({ method: message.method, params: message.params });
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    await client.send({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {}
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(clientReceived.some((message) => message.method === 'server/ping')).toBe(true);

    await client.close();
  });
});
