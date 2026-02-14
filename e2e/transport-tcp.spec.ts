import { describe, expect, it } from 'vitest';
import { LSPClient } from '../packages/client/src/client.js';
import { LSPServer } from '../packages/server/src/server.js';
import { TcpTransport } from '../packages/core/src/transport/tcp.js';

async function waitUntilConnected(transport: TcpTransport, timeoutMs = 2000): Promise<void> {
  const start = Date.now();
  while (!transport.isConnected()) {
    if (Date.now() - start > timeoutMs) {
      throw new Error('Timed out waiting for tcp connection');
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

describe('TCP Transport Integration', () => {
  it('completes initialize and request roundtrip over tcp transport', async () => {
    const port = 30201;
    const server = new LSPServer({ name: 'tcp-server', version: '1.0.0' });
    server.onRequest('workspace/symbol', async () => []);

    const serverTransport = new TcpTransport({ mode: 'server', host: '127.0.0.1', port });
    const clientTransport = new TcpTransport({ mode: 'client', host: '127.0.0.1', port });
    const client = new LSPClient();

    try {
      await server.listen(serverTransport);
      await waitUntilConnected(clientTransport);
      await client.connect(clientTransport);

      await expect(client.sendRequest('workspace/symbol', { query: 'x' })).resolves.toEqual([]);
    } finally {
      await client.disconnect().catch(() => undefined);
      await clientTransport.close().catch(() => undefined);
      await server.shutdown().catch(() => undefined);
      await serverTransport.close().catch(() => undefined);
    }
  });
});
