import { describe, expect, it, vi } from 'vitest';
import { LSPServer, LogLevel } from '@lspeasy/server';
import { ClientRequestMethodToCapabilityMap } from '@lspeasy/core';
import type { Transport, Message } from '@lspeasy/core';
import { registerPassThrough } from './pass-through.js';

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

const EXCLUDED = new Set(['initialize', 'shutdown', 'initialized', 'exit', '$/cancelRequest']);

async function initializedServer(capabilities: Record<string, unknown> = {}) {
  // Register enough capabilities to allow all handler registrations
  const defaultCapabilities = {
    completionProvider: true,
    hoverProvider: true,
    definitionProvider: true,
    referencesProvider: true,
    documentSymbolProvider: true,
    ...capabilities
  };

  const server = new LSPServer({
    logLevel: LogLevel.Error,
    validateParams: false
  }).registerCapabilities(defaultCapabilities);
  const backend = {
    sendRequest: vi.fn().mockResolvedValue({ ok: true }),
    sendNotification: vi.fn().mockResolvedValue(undefined)
  };
  registerPassThrough(server, () => backend as never);
  const transport = new FakeTransport();
  await server.listen(transport);
  transport.simulate({
    jsonrpc: '2.0',
    id: 0,
    method: 'initialize',
    params: { processId: null, rootUri: null, capabilities: {} }
  });
  await vi.waitFor(() => expect(transport.sent).toHaveLength(1));
  return { server, backend, transport };
}

describe('registerPassThrough', () => {
  it('forwards a sample of methods across both request and notification maps to the resolved backend', async () => {
    const { backend, transport } = await initializedServer();

    transport.simulate({
      jsonrpc: '2.0',
      id: 1,
      method: 'textDocument/hover',
      params: { textDocument: { uri: 'file:///x.ts' }, position: { line: 0, character: 0 } }
    });
    await vi.waitFor(() =>
      expect(backend.sendRequest).toHaveBeenCalledWith('textDocument/hover', expect.anything())
    );

    transport.simulate({
      jsonrpc: '2.0',
      method: 'textDocument/didChange',
      params: { textDocument: { uri: 'file:///x.ts', version: 2 }, contentChanges: [] }
    });
    await vi.waitFor(() =>
      expect(backend.sendNotification).toHaveBeenCalledWith(
        'textDocument/didChange',
        expect.anything()
      )
    );
  });

  it('does not clobber the lifecycle methods LSPServer already handles internally', async () => {
    const { transport } = await initializedServer();
    // A second initialize must be rejected by LSPServer's own built-in guard
    // (ServerState !== Created), not silently forwarded to a backend.
    transport.simulate({
      jsonrpc: '2.0',
      id: 2,
      method: 'initialize',
      params: { processId: null, rootUri: null, capabilities: {} }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(2));
    expect(transport.sent[1]).toMatchObject({ id: 2, error: { code: -32600 } });
  });
});

describe('registerPassThrough — full surface parity', () => {
  it('registers every request method except lifecycle ones', async () => {
    // Build a comprehensive capabilities object to allow all methods to be registered
    const capabilities: Record<string, unknown> = {
      completionProvider: true,
      hoverProvider: true,
      definitionProvider: true,
      referencesProvider: true,
      documentSymbolProvider: true,
      callHierarchyProvider: true,
      codeActionProvider: { resolveProvider: true },
      codeLensProvider: { resolveProvider: true },
      colorProvider: true,
      declarationProvider: true,
      documentFormattingProvider: true,
      documentHighlightProvider: true,
      documentLinkProvider: { resolveProvider: true },
      documentRangeFormattingProvider: true,
      foldingRangeProvider: true,
      implementationProvider: true,
      inlayHintProvider: { resolveProvider: true },
      inlineValueProvider: true,
      linkedEditingRangeProvider: true,
      monikerProvider: true,
      onTypeFormattingProvider: true,
      renameProvider: { prepareProvider: true },
      semanticTokensProvider: { full: true },
      selectionRangeProvider: true,
      signatureHelpProvider: true,
      typeDefinitionProvider: true,
      typeHierarchyProvider: true,
      workspaceSymbolProvider: { resolveProvider: true },
      workspace: {
        workspaceFolders: { supported: true, changeNotifications: true },
        fileOperations: { willCreate: {}, willRename: {}, willDelete: {} }
      }
    };

    const backend = { sendRequest: vi.fn().mockResolvedValue(null) };
    const server = new LSPServer({
      logLevel: LogLevel.Error,
      validateParams: false
    }).registerCapabilities(capabilities);
    registerPassThrough(server, () => backend as never);
    const transport = new FakeTransport();
    await server.listen(transport);
    transport.simulate({
      jsonrpc: '2.0',
      id: 0,
      method: 'initialize',
      params: { processId: null, rootUri: null, capabilities: {} }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));

    const methods = [...ClientRequestMethodToCapabilityMap.keys()].filter((m) => !EXCLUDED.has(m));
    let id = 1;
    for (const method of methods) {
      transport.simulate({ jsonrpc: '2.0', id: id++, method, params: {} });
    }
    await vi.waitFor(() => expect(backend.sendRequest).toHaveBeenCalledTimes(methods.length));
    for (const method of methods) {
      expect(backend.sendRequest).toHaveBeenCalledWith(method, expect.anything());
    }
  });
});
