import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LSPClient } from '../packages/client/src/client.js';
import { LSPServer } from '../packages/server/src/server.js';
import { createConnectedStdioTransports } from './transport-utils.js';

describe('Notebook Sync Integration', () => {
  let server: any;
  let client: any;

  beforeEach(() => {
    server = new LSPServer({ name: 'notebook-server', version: '1.0.0' });
    client = new LSPClient({ name: 'notebook-client', version: '1.0.0' });
  });

  afterEach(async () => {
    await client.disconnect().catch(() => undefined);
    await server.shutdown().catch(() => undefined);
  });

  it('routes notebook open/change/save/close notifications via namespace APIs', async () => {
    const { serverTransport, clientTransport } = createConnectedStdioTransports();

    const received: string[] = [];
    server.notebookDocument.onDidOpen(() => received.push('open'));
    server.notebookDocument.onDidChange(() => received.push('change'));
    server.notebookDocument.onDidSave(() => received.push('save'));
    server.notebookDocument.onDidClose(() => received.push('close'));

    await server.listen(serverTransport);
    await client.connect(clientTransport);

    await client.notebookDocument.didOpen({
      notebookDocument: {
        uri: 'file:///nb',
        notebookType: 'jupyter-notebook',
        version: 1,
        cells: []
      },
      cellTextDocuments: []
    });

    await client.notebookDocument.didChange({
      notebookDocument: { uri: 'file:///nb', version: 2 },
      change: {}
    });

    await client.notebookDocument.didSave({
      notebookDocument: { uri: 'file:///nb' }
    });

    await client.notebookDocument.didClose({
      notebookDocument: { uri: 'file:///nb' },
      cellTextDocuments: []
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(received).toEqual(['open', 'change', 'save', 'close']);
  });
});
