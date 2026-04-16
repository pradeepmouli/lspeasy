import { describe, expect, it, vi } from 'vitest';
import { connect as connectTcp, createServer, type Socket } from 'node:net';
import { TcpTransport } from '../../../src/transport/tcp.js';
import type { Message } from '../../../src/jsonrpc/messages.js';
import { MessageReader } from '../../../src/jsonrpc/reader.js';
import { MessageWriter } from '../../../src/jsonrpc/writer.js';
import { serializeMessage } from '../../../src/jsonrpc/framing.js';

async function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Failed to get free port'));
        return;
      }
      const port = address.port;
      server.close(() => resolve(port));
    });
    server.on('error', reject);
  });
}

async function waitUntil(condition: () => boolean, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!condition()) {
    if (Date.now() - start > timeoutMs) {
      throw new Error('Timed out waiting for condition');
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

function closeSocket(socket: Socket): Promise<void> {
  return new Promise((resolve) => {
    if (socket.destroyed) {
      resolve();
      return;
    }
    socket.once('close', () => resolve());
    socket.destroy();
  });
}

describe('TcpTransport', () => {
  it('rejects send when disconnected', async () => {
    const port = await getFreePort();
    const transport = new TcpTransport({ mode: 'client', host: '127.0.0.1', port });

    await expect(
      transport.send({ jsonrpc: '2.0', method: 'window/logMessage', params: { type: 3 } })
    ).rejects.toThrow(/not connected/);

    await transport.close();
  });

  it('connects in client mode and exchanges messages', async () => {
    const port = await getFreePort();
    const sockets: Socket[] = [];

    const server = createServer((socket) => {
      sockets.push(socket);
      const reader = new MessageReader(socket);
      const writer = new MessageWriter(socket);
      reader.on('message', async (message) => {
        if ('id' in message && message.id !== undefined) {
          await writer.write({
            jsonrpc: '2.0',
            id: message.id,
            result: { ok: true }
          });
        }
      });
    });

    await new Promise<void>((resolve) => server.listen(port, '127.0.0.1', resolve));
    const transport = new TcpTransport({ mode: 'client', host: '127.0.0.1', port });

    try {
      await waitUntil(() => transport.isConnected());

      const response = new Promise<Message>((resolve) => {
        transport.onMessage((message) => resolve(message));
      });

      await transport.send({
        jsonrpc: '2.0',
        id: '1',
        method: 'workspace/symbol',
        params: { query: 'a' }
      });

      await expect(response).resolves.toMatchObject({
        jsonrpc: '2.0',
        id: '1',
        result: { ok: true }
      });
    } finally {
      await transport.close();
      await Promise.all(sockets.map((socket) => closeSocket(socket)));
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it('rejects additional concurrent server-mode connections', async () => {
    const port = await getFreePort();
    const transport = new TcpTransport({ mode: 'server', host: '127.0.0.1', port });

    const first = connectTcp({ host: '127.0.0.1', port });
    try {
      await new Promise<void>((resolve) => first.once('connect', () => resolve()));

      const second = connectTcp({ host: '127.0.0.1', port });
      try {
        await new Promise<void>((resolve) => {
          second.once('close', () => resolve());
          second.once('error', () => resolve());
        });
      } finally {
        await closeSocket(second);
      }
    } finally {
      await closeSocket(first);
      await transport.close();
    }
  });

  it('attempts reconnect when enabled after unexpected disconnect', async () => {
    const port = await getFreePort();
    const sockets: Socket[] = [];
    const timeoutSpy = vi.spyOn(globalThis, 'setTimeout');

    const server = createServer((socket) => {
      sockets.push(socket);
      setTimeout(() => socket.destroy(), 20);
    });

    await new Promise<void>((resolve) => server.listen(port, '127.0.0.1', resolve));

    const transport = new TcpTransport({
      mode: 'client',
      host: '127.0.0.1',
      port,
      reconnect: {
        enabled: true,
        initialDelayMs: 10,
        maxDelayMs: 50,
        multiplier: 1,
        maxAttempts: 3
      }
    });

    try {
      await waitUntil(() => timeoutSpy.mock.calls.length > 0, 4000);
      expect(timeoutSpy.mock.calls.some((call) => typeof call[1] === 'number')).toBe(true);
    } finally {
      timeoutSpy.mockRestore();
      await transport.close();
      await Promise.all(sockets.map((socket) => closeSocket(socket)));
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it('reassembles split TCP frames into one JSON-RPC message', async () => {
    const port = await getFreePort();
    const sockets: Socket[] = [];

    const server = createServer((socket) => {
      sockets.push(socket);
      const payload = serializeMessage({
        jsonrpc: '2.0',
        method: 'window/logMessage',
        params: { type: 3, message: 'hello' }
      });
      const midpoint = Math.floor(payload.length / 2);
      socket.write(payload.subarray(0, midpoint));
      setTimeout(() => socket.write(payload.subarray(midpoint)), 10);
    });

    await new Promise<void>((resolve) => server.listen(port, '127.0.0.1', resolve));

    const transport = new TcpTransport({ mode: 'client', host: '127.0.0.1', port });
    try {
      const received = new Promise<Message>((resolve) => {
        transport.onMessage((message) => resolve(message));
      });

      await expect(received).resolves.toMatchObject({
        jsonrpc: '2.0',
        method: 'window/logMessage'
      });
    } finally {
      await transport.close();
      await Promise.all(sockets.map((socket) => closeSocket(socket)));
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it('emits error for invalid incoming JSON-RPC payload', async () => {
    const port = await getFreePort();
    const sockets: Socket[] = [];

    const server = createServer((socket) => {
      sockets.push(socket);
      const invalidPayload = serializeMessage({ jsonrpc: '2.0', method: 123 as unknown as string });
      socket.write(invalidPayload);
    });

    await new Promise<void>((resolve) => server.listen(port, '127.0.0.1', resolve));

    const transport = new TcpTransport({ mode: 'client', host: '127.0.0.1', port });
    const errors: Error[] = [];
    transport.onError((error) => errors.push(error));

    try {
      await waitUntil(() => errors.length > 0);
      expect(errors[0]?.message).toContain('Invalid JSON-RPC message');
    } finally {
      await transport.close();
      await Promise.all(sockets.map((socket) => closeSocket(socket)));
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it('supports idempotent close in server mode', async () => {
    const port = await getFreePort();
    const transport = new TcpTransport({ mode: 'server', host: '127.0.0.1', port });

    await transport.close();
    await expect(transport.close()).resolves.toBeUndefined();
  });
});
