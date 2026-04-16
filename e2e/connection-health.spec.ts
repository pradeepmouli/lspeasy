import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LSPClient, ConnectionState } from '@lspeasy/client';
import { LSPServer } from '@lspeasy/server';
import { createConnectedStdioTransports } from './transport-utils.js';

describe('connection health (e2e)', () => {
  let server: LSPServer;
  let client: LSPClient;

  beforeEach(() => {
    server = new LSPServer({ name: 'health-server', version: '1.0.0' });
    client = new LSPClient({
      name: 'health-client',
      version: '1.0.0',
      heartbeat: {
        enabled: true,
        interval: 50,
        timeout: 200
      }
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

  it('tracks state transitions and last message timestamps', async () => {
    server.setCapabilities({ hoverProvider: true });
    server.onRequest('textDocument/hover', async () => ({
      contents: { kind: 'plaintext', value: 'healthy' }
    }));

    const transitions: ConnectionState[] = [];
    const dispose = client.onConnectionStateChange((event) => {
      transitions.push(event.current);
    });

    const { serverTransport, clientTransport } = createConnectedStdioTransports();
    await server.listen(serverTransport);
    await client.connect(clientTransport);

    await client.sendRequest('textDocument/hover', {
      textDocument: { uri: 'file:///health.ts' },
      position: { line: 0, character: 0 }
    });

    const health = client.getConnectionHealth();

    expect(transitions).toContain(ConnectionState.Connected);
    expect(health.state).toBe(ConnectionState.Connected);
    expect(health.lastMessageSent).not.toBeNull();
    expect(health.lastMessageReceived).not.toBeNull();
    expect(health.heartbeat?.enabled).toBe(true);

    await client.disconnect();

    const disconnectedHealth = client.getConnectionHealth();
    expect(disconnectedHealth.state).toBe(ConnectionState.Disconnected);

    dispose.dispose();
  });
});
