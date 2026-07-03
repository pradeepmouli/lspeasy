import { describe, expect, it, vi } from 'vitest';
import type { Transport, Message } from '@lspeasy/core';
import { ProxySession } from './proxy-session.js';
import type { StatusReport } from './status.js';

class FakeTransport implements Transport {
  public sent: Message[] = [];
  private messageHandlers: Array<(m: Message) => void> = [];
  async send(m: Message): Promise<void> {
    this.sent.push(m);
  }
  onMessage(h: (m: Message) => void) {
    this.messageHandlers.push(h);
    return { dispose: () => {} };
  }
  onError() {
    return { dispose: () => {} };
  }
  onClose() {
    return { dispose: () => {} };
  }
  async close(): Promise<void> {}
  simulate(m: Message): void {
    for (const h of this.messageHandlers) h(m);
  }
}

const STATUS: StatusReport = { daemon: null, languages: [] };

function makeSession(capabilities: Record<string, unknown> = { hoverProvider: true }) {
  const recordRequest = vi.fn();
  const backend = {
    sendRequest: vi.fn().mockResolvedValue({ ok: 1 }),
    sendNotification: vi.fn().mockResolvedValue(undefined),
    getServerCapabilities: vi.fn().mockReturnValue(capabilities),
    onRequest: vi.fn().mockReturnValue({ dispose: vi.fn() })
  };
  const pool = {
    getBackend: vi.fn().mockReturnValue(backend),
    getLanguageIdForExtension: vi.fn().mockReturnValue('typescript'),
    ensureBackend: vi.fn().mockResolvedValue(backend),
    recordRequest
  };
  const transport = new FakeTransport();
  new ProxySession({
    sessionId: 's1',
    transport: transport as never,
    pool: pool as never,
    docState: { onSessionEnd: vi.fn(), onDidOpen: vi.fn(), onDidClose: vi.fn() } as never,
    root: '/proj',
    onEnd: vi.fn(),
    onStatus: () => STATUS
  });
  return { transport, recordRequest, backend, pool };
}

describe('ProxySession', () => {
  it('reflects the resolved backend capabilities in the initialize response', async () => {
    const { transport } = makeSession({ hoverProvider: true, definitionProvider: true });
    transport.simulate({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        processId: null,
        rootUri: null,
        capabilities: {},
        initializationOptions: { languageId: 'typescript' }
      }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));
    expect(transport.sent[0]).toMatchObject({
      id: 1,
      result: { capabilities: { hoverProvider: true, definitionProvider: true } }
    });
  });

  it('answers $/lsproxy.status from onStatus without touching a backend', async () => {
    const { transport, backend } = makeSession();
    transport.simulate({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        processId: null,
        rootUri: null,
        capabilities: {},
        initializationOptions: { languageId: 'typescript' }
      }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));

    transport.simulate({ jsonrpc: '2.0', id: 2, method: '$/lsproxy.status', params: {} });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(2));
    expect(transport.sent[1]).toMatchObject({ id: 2, result: STATUS });
    expect(backend.sendRequest).not.toHaveBeenCalled();
  });

  it('forwards a non-special-cased request and records it against the resolved language', async () => {
    const { transport, backend, recordRequest } = makeSession();
    transport.simulate({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        processId: null,
        rootUri: null,
        capabilities: {},
        initializationOptions: { languageId: 'typescript' }
      }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));

    transport.simulate({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/hover',
      params: { textDocument: { uri: 'file:///x.ts' }, position: { line: 0, character: 0 } }
    });
    await vi.waitFor(() =>
      expect(backend.sendRequest).toHaveBeenCalledWith('textDocument/hover', expect.anything())
    );
    expect(recordRequest).toHaveBeenCalledWith('typescript');
  });

  it('opens a document via doc-state and forwards didOpen to the backend on first open', async () => {
    const recordRequest = vi.fn();
    const backend = {
      sendRequest: vi.fn().mockResolvedValue(null),
      sendNotification: vi.fn().mockResolvedValue(undefined),
      getServerCapabilities: vi.fn().mockReturnValue({}),
      onRequest: vi.fn().mockReturnValue({ dispose: vi.fn() })
    };
    const pool = {
      getBackend: vi.fn().mockReturnValue(backend),
      getLanguageIdForExtension: vi.fn().mockReturnValue('typescript'),
      ensureBackend: vi.fn().mockResolvedValue(backend),
      recordRequest
    };
    const docState = {
      onSessionEnd: vi.fn(),
      onDidOpen: vi.fn().mockReturnValue('open'),
      onDidClose: vi.fn()
    };
    const transport = new FakeTransport();
    new ProxySession({
      sessionId: 's1',
      transport: transport as never,
      pool: pool as never,
      docState: docState as never,
      root: '/proj',
      onEnd: vi.fn(),
      onStatus: () => STATUS
    });

    transport.simulate({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        processId: null,
        rootUri: null,
        capabilities: {},
        initializationOptions: { languageId: 'typescript' }
      }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));

    transport.simulate({
      jsonrpc: '2.0',
      method: 'textDocument/didOpen',
      params: {
        textDocument: { uri: 'file:///x.ts', languageId: 'typescript', version: 1, text: 'x' }
      }
    });

    await vi.waitFor(() =>
      expect(backend.sendNotification).toHaveBeenCalledWith(
        'textDocument/didOpen',
        expect.objectContaining({ textDocument: expect.objectContaining({ uri: 'file:///x.ts' }) })
      )
    );
    expect(docState.onDidOpen).toHaveBeenCalledWith('s1', 'file:///x.ts', 'x', 'typescript');
  });

  it('forwards a backend-initiated workspace/applyEdit to the connected client', async () => {
    let applyEditHandler: ((p: unknown) => Promise<unknown>) | undefined;
    const backend = {
      sendRequest: vi.fn().mockResolvedValue(null),
      sendNotification: vi.fn().mockResolvedValue(undefined),
      getServerCapabilities: vi.fn().mockReturnValue({}),
      onRequest: vi.fn((method: string, handler: (p: unknown) => Promise<unknown>) => {
        if (method === 'workspace/applyEdit') applyEditHandler = handler;
        return { dispose: vi.fn() };
      })
    };
    const pool = {
      getBackend: vi.fn().mockReturnValue(backend),
      getLanguageIdForExtension: vi.fn().mockReturnValue('typescript'),
      ensureBackend: vi.fn().mockResolvedValue(backend),
      recordRequest: vi.fn()
    };
    const transport = new FakeTransport();
    new ProxySession({
      sessionId: 's1',
      transport: transport as never,
      pool: pool as never,
      docState: { onSessionEnd: vi.fn(), onDidOpen: vi.fn(), onDidClose: vi.fn() } as never,
      root: '/proj',
      onEnd: vi.fn(),
      onStatus: () => STATUS
    });

    transport.simulate({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        processId: null,
        rootUri: null,
        capabilities: {},
        initializationOptions: { languageId: 'typescript' }
      }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));
    expect(applyEditHandler).toBeDefined();

    const resultPromise = applyEditHandler!({ edit: { changes: {} } });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(2));
    expect(transport.sent[1]).toMatchObject({ method: 'workspace/applyEdit' });

    const requestId = (transport.sent[1] as { id: number | string }).id;
    transport.simulate({ jsonrpc: '2.0', id: requestId, result: { applied: true } });
    await expect(resultPromise).resolves.toEqual({ applied: true });
  });
});
