import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LSPClient } from '../packages/client/src/client.js';
import { LSPServer } from '../packages/server/src/server.js';
import { createConnectedStdioTransports } from './transport-utils.js';

describe('Dynamic Registration Integration', () => {
  let server: any;
  let client: any;

  beforeEach(() => {
    server = new LSPServer({ name: 'dynamic-reg-server', version: '1.0.0' });
    client = new LSPClient({
      capabilities: {
        workspace: {
          didChangeWatchedFiles: {
            dynamicRegistration: true
          }
        }
      }
    });
  });

  afterEach(async () => {
    await client.disconnect().catch(() => undefined);
    await server.shutdown().catch(() => undefined);
  });

  it('applies register/unregister requests and updates runtime registrations', async () => {
    const { serverTransport, clientTransport } = createConnectedStdioTransports();
    await server.listen(serverTransport);
    await client.connect(clientTransport);

    await server.sendRequest('client/registerCapability', {
      registrations: [{ id: 'watch-1', method: 'workspace/didChangeWatchedFiles' }]
    });

    expect(
      client
        .getRuntimeCapabilities()
        .dynamicRegistrations.some((entry: { id: string }) => entry.id === 'watch-1')
    ).toBe(true);

    await server.sendRequest('client/unregisterCapability', {
      unregisterations: [{ id: 'watch-1', method: 'workspace/didChangeWatchedFiles' }]
    });

    expect(
      client
        .getRuntimeCapabilities()
        .dynamicRegistrations.some((entry: { id: string }) => entry.id === 'watch-1')
    ).toBe(false);
  });
});
