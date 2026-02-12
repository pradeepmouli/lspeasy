import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LSPClient } from '@lspeasy/client';
import { LSPServer } from '@lspeasy/server';
import { createConnectedStdioTransports } from './transport-utils.js';

describe('waitForNotification (e2e)', () => {
  let server: LSPServer;
  let client: LSPClient;

  beforeEach(() => {
    server = new LSPServer({ name: 'wait-server', version: '1.0.0' });
    client = new LSPClient({ name: 'wait-client', version: '1.0.0' });
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

  it("resolves for 'textDocument/publishDiagnostics' with explicit timeout", async () => {
    const { serverTransport, clientTransport } = createConnectedStdioTransports();

    await server.listen(serverTransport);
    await client.connect(clientTransport);

    const waiter = client.waitForNotification('textDocument/publishDiagnostics', {
      timeout: 500,
      filter: (params) => params.uri === 'file:///diagnostics.ts'
    });

    await server.sendNotification('textDocument/publishDiagnostics', {
      uri: 'file:///diagnostics.ts',
      diagnostics: [
        {
          range: {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 3 }
          },
          severity: 1,
          source: 'e2e',
          message: 'sample diagnostic'
        }
      ]
    });

    const diagnostics = await waiter;
    expect(diagnostics.uri).toBe('file:///diagnostics.ts');
    expect(diagnostics.diagnostics.length).toBe(1);
  });
});
