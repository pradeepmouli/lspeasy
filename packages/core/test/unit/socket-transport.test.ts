import { describe, expect, it, afterEach } from 'vitest';
import { createServer, Socket, type Server } from 'node:net';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { existsSync, unlinkSync } from 'node:fs';
import { SocketTransport, socketToTransport } from '../../src/transport/socket.js';
import { MessageReader } from '../../src/jsonrpc/reader.js';
import { MessageWriter } from '../../src/jsonrpc/writer.js';
import { serializeMessage } from '../../src/jsonrpc/framing.js';
import type { Message } from '../../src/jsonrpc/messages.js';

async function waitUntil(condition: () => boolean, timeoutMs = 3000): Promise<void> {
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

function closeServer(server: Server): Promise<void> {
  return new Promise((resolve) => server.close(() => resolve()));
}

function getFreePort(): Promise<number> {
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

function tmpSocketPath(name: string): string {
  return join(tmpdir(), `lspeasy-test-${name}-${process.pid}.sock`);
}

function cleanupSocketFile(path: string): void {
  if (existsSync(path)) {
    unlinkSync(path);
  }
}

describe('SocketTransport (Unix domain socket mode)', () => {
  const servers: Server[] = [];
  const transports: SocketTransport[] = [];
  const socketFiles: string[] = [];
  const sockets: Socket[] = [];

  afterEach(async () => {
    await Promise.all(transports.map((t) => t.close().catch(() => undefined)));
    transports.length = 0;
    await Promise.all(sockets.map((s) => closeSocket(s)));
    sockets.length = 0;
    await Promise.all(servers.map((s) => closeServer(s)));
    servers.length = 0;
    for (const p of socketFiles) cleanupSocketFile(p);
    socketFiles.length = 0;
  });

  it('connects and exchanges messages via Unix socket echo server', async () => {
    const sockPath = tmpSocketPath('unix-echo');
    socketFiles.push(sockPath);

    const server = createServer((socket) => {
      sockets.push(socket);
      const serverTransport = socketToTransport(socket);
      serverTransport.onMessage(async (message) => {
        await serverTransport.send(message);
      });
    });
    servers.push(server);
    await new Promise<void>((resolve) => server.listen(sockPath, resolve));

    const transport = new SocketTransport({ path: sockPath });
    transports.push(transport);

    await waitUntil(() => transport.isConnected());

    const received = new Promise<Message>((resolve) => {
      transport.onMessage((message) => resolve(message));
    });

    const msg: Message = { jsonrpc: '2.0', id: '1', method: 'ping', params: {} };
    await transport.send(msg);

    const response = await received;
    expect(response).toMatchObject({ jsonrpc: '2.0', id: '1', method: 'ping' });
  });

  it('rejects send when not yet connected', async () => {
    const sockPath = tmpSocketPath('unix-no-server');
    socketFiles.push(sockPath);

    const transport = new SocketTransport({ path: sockPath });
    transports.push(transport);

    await expect(
      transport.send({ jsonrpc: '2.0', method: 'window/logMessage', params: { type: 3 } })
    ).rejects.toThrow(/not connected/);
  });

  it('isConnected() returns false after close()', async () => {
    const sockPath = tmpSocketPath('unix-close');
    socketFiles.push(sockPath);

    const server = createServer((socket) => {
      sockets.push(socket);
    });
    servers.push(server);
    await new Promise<void>((resolve) => server.listen(sockPath, resolve));

    const transport = new SocketTransport({ path: sockPath });
    transports.push(transport);

    await waitUntil(() => transport.isConnected());
    await transport.close();

    expect(transport.isConnected()).toBe(false);
  });
});

describe('SocketTransport (TCP mode)', () => {
  const servers: Server[] = [];
  const transports: SocketTransport[] = [];
  const sockets: Socket[] = [];

  afterEach(async () => {
    await Promise.all(transports.map((t) => t.close().catch(() => undefined)));
    transports.length = 0;
    await Promise.all(sockets.map((s) => closeSocket(s)));
    sockets.length = 0;
    await Promise.all(servers.map((s) => closeServer(s)));
    servers.length = 0;
  });

  it('connects and exchanges messages via TCP echo server', async () => {
    const port = await getFreePort();

    const server = createServer((socket) => {
      sockets.push(socket);
      const serverTransport = socketToTransport(socket);
      serverTransport.onMessage(async (message) => {
        await serverTransport.send(message);
      });
    });
    servers.push(server);
    await new Promise<void>((resolve) => server.listen(port, '127.0.0.1', resolve));

    const transport = new SocketTransport({ host: '127.0.0.1', port });
    transports.push(transport);

    await waitUntil(() => transport.isConnected());

    const received = new Promise<Message>((resolve) => {
      transport.onMessage((message) => resolve(message));
    });

    const msg: Message = { jsonrpc: '2.0', id: '42', method: 'ping', params: {} };
    await transport.send(msg);

    const response = await received;
    expect(response).toMatchObject({ jsonrpc: '2.0', id: '42', method: 'ping' });
  });

  it('rejects send when not yet connected (TCP)', async () => {
    const port = await getFreePort();

    const transport = new SocketTransport({ host: '127.0.0.1', port });
    transports.push(transport);

    await expect(
      transport.send({ jsonrpc: '2.0', method: 'window/logMessage', params: { type: 3 } })
    ).rejects.toThrow(/not connected/);
  });
});

describe('socketToTransport', () => {
  const servers: Server[] = [];
  const socketFiles: string[] = [];
  const sockets: Socket[] = [];
  const serverTransports: ReturnType<typeof socketToTransport>[] = [];

  afterEach(async () => {
    await Promise.all(serverTransports.map((t) => t.close().catch(() => undefined)));
    serverTransports.length = 0;
    await Promise.all(sockets.map((s) => closeSocket(s)));
    sockets.length = 0;
    await Promise.all(servers.map((s) => closeServer(s)));
    servers.length = 0;
    for (const p of socketFiles) cleanupSocketFile(p);
    socketFiles.length = 0;
  });

  it('wraps an accepted server socket and receives messages from a raw writer', async () => {
    const sockPath = tmpSocketPath('wrap-recv');
    socketFiles.push(sockPath);

    let serverTransport: ReturnType<typeof socketToTransport> | undefined;
    const firstMessage = new Promise<Message>((resolve) => {
      const server = createServer((socket) => {
        sockets.push(socket);
        serverTransport = socketToTransport(socket);
        serverTransports.push(serverTransport);
        serverTransport.onMessage((message) => resolve(message));
      });
      servers.push(server);
      server.listen(sockPath, () => {
        // connect a raw client socket
        const clientSocket = new Socket();
        sockets.push(clientSocket);
        clientSocket.connect(sockPath, async () => {
          const writer = new MessageWriter(clientSocket);
          await writer.write({ jsonrpc: '2.0', id: '7', method: 'hello', params: {} });
        });
      });
    });

    const received = await firstMessage;
    expect(received).toMatchObject({ jsonrpc: '2.0', id: '7', method: 'hello' });
  });

  it('emits error for invalid JSON-RPC payload', async () => {
    const sockPath = tmpSocketPath('wrap-invalid');
    socketFiles.push(sockPath);

    const errors: Error[] = [];
    const errorReceived = new Promise<void>((resolve) => {
      const server = createServer((socket) => {
        sockets.push(socket);
        const t = socketToTransport(socket);
        serverTransports.push(t);
        t.onError((err) => {
          errors.push(err);
          resolve();
        });
      });
      servers.push(server);

      server.listen(sockPath, () => {
        const clientSocket = new Socket();
        sockets.push(clientSocket);
        clientSocket.connect(sockPath, () => {
          const invalidPayload = serializeMessage({
            jsonrpc: '2.0',
            method: 123 as unknown as string
          });
          clientSocket.write(invalidPayload);
        });
      });
    });

    await errorReceived;
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]?.message).toContain('Invalid JSON-RPC message');
  });
});
