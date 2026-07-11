import { describe, expect, it, afterEach, vi } from 'vitest';
import { createServer, Socket, type Server } from 'node:net';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { existsSync, unlinkSync } from 'node:fs';
import { SocketTransport, socketToTransport } from '../../src/transport/socket.js';
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

  it('cancels reconnect timer when closed during backoff period', async () => {
    const sockPath = join(tmpdir(), `lspeasy-reconnect-${process.pid}-${Date.now()}.sock`);
    socketFiles.push(sockPath);

    // Start a server that immediately destroys the accepted socket to force a reconnect cycle
    const serverSockets: Socket[] = [];
    const srv = createServer((s) => {
      serverSockets.push(s);
      s.destroy();
    });
    servers.push(srv);
    await new Promise<void>((r) => srv.listen(sockPath, r));

    // Use a short reconnect delay so the guard window (300ms) actually covers it —
    // if cancel doesn't work a reconnect fires at ~50ms, which shows up as a second close event.
    const client = new SocketTransport({
      path: sockPath,
      reconnect: { enabled: true, initialDelayMs: 50, maxAttempts: 3 }
    });
    transports.push(client);

    // Wait for the first connect+disconnect cycle so the reconnect timer is armed
    await waitUntil(() => !client.isConnected(), 3000);

    const closeFired = vi.fn();
    client.onClose(closeFired);

    // Close while reconnect timer is pending — should cancel it and fire close exactly once
    await client.close();

    // Wait past the reconnect delay; a leaked timer would fire a second close event
    await new Promise<void>((r) => setTimeout(r, 300));

    expect(client.isConnected()).toBe(false);
    // onClose should fire exactly once (from close(), not from the reconnect timer)
    expect(closeFired.mock.calls.length).toBe(1);

    // Cleanup server sockets
    for (const s of serverSockets) s.destroy();
  });

  // Regression test for a real bug: SocketTransport shares one socket
  // between a MessageReader, a MessageWriter, and its own 'close' handler.
  // MessageReader/MessageWriter's close() used to call
  // `stream.removeAllListeners()`, and since 'end' fires before 'close' on a
  // real socket, MessageReader's 'end'-triggered close() wiped out
  // SocketTransport's own 'close' handler before 'close' was ever emitted —
  // so a peer dying abruptly (e.g. the proxy daemon crashing mid-handshake)
  // never fired the client's onClose(), and LSPClient.handleClose() (which
  // rejects pending requests) was never called: the pending request just
  // hung forever instead of rejecting.
  it('fires onClose when the server abruptly destroys the connection (peer crash), not just on a graceful close()', async () => {
    const sockPath = tmpSocketPath('unix-abrupt-crash');
    socketFiles.push(sockPath);

    const server = createServer((socket) => {
      sockets.push(socket);
      // Simulate a peer crashing mid-session: destroy the accepted socket
      // from the server side without any graceful FIN/shutdown handshake,
      // the same way an uncaught exception kills a Node process and the OS
      // tears down its file descriptors.
      socket.destroy();
    });
    servers.push(server);
    await new Promise<void>((resolve) => server.listen(sockPath, resolve));

    const transport = new SocketTransport({ path: sockPath });
    transports.push(transport);

    const closeFired = vi.fn();
    transport.onClose(closeFired);

    await waitUntil(() => closeFired.mock.calls.length > 0, 3000);

    expect(closeFired).toHaveBeenCalledTimes(1);
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
