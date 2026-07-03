// apps/proxy/src/proxy-session.ts
import { extname } from 'node:path';
import { LSPServer } from '@lspeasy/server';
import type { InitializeParams, ServerCapabilities, Transport } from '@lspeasy/core';
import type { CodeAction, CodeActionParams } from '@lspeasy/core';
import type { LSPClient } from '@lspeasy/client';
import { applicablePolyfills } from '@lsproxy/polyfill';
import type { BackendPool } from './backend-pool.js';
import type { DocumentStateManager } from './document-state.js';
import type { StatusReport } from './status.js';
import { registerPassThrough } from './pass-through.js';

export interface ProxySessionOptions {
  sessionId: string;
  transport: Transport;
  pool: BackendPool;
  docState: DocumentStateManager;
  root: string;
  onEnd: (sessionId: string) => void;
  onStatus: () => StatusReport;
}

export class ProxySession {
  private readonly id: string;
  private readonly pool: BackendPool;
  private readonly docState: DocumentStateManager;
  private readonly onEnd: (sessionId: string) => void;
  private readonly server: LSPServer;
  private languageId = 'plaintext';
  private applyEditDisposable: { dispose(): void } | undefined;

  constructor(opts: ProxySessionOptions) {
    this.id = opts.sessionId;
    this.pool = opts.pool;
    this.docState = opts.docState;
    this.onEnd = opts.onEnd;

    this.server = new LSPServer({
      name: 'lsproxy',
      version: '0.1.0',
      preInitializeMethods: ['$/lsproxy.status'],
      resolveCapabilities: (params) => this.resolveCapabilities(params)
    });

    this.server.onRequest('$/lsproxy.status', async () => opts.onStatus());

    registerPassThrough(this.server, (params) => this.resolveBackend(params));

    // Override the generic pass-through for the two methods doc-state needs
    // to see (must-not-forward-verbatim: open/change detection and lazy
    // backend spin-up happen here, same as today's ClientSession).
    this.server.onNotification('textDocument/didOpen', (params) => this.handleDidOpen(params));
    this.server.onNotification('textDocument/didClose', (params) => this.handleDidClose(params));

    // Override the generic pass-through for CodeAction methods so we can
    // patch in polyfilled behavior (fix-all synthesis, resolve backfill)
    // when the backend doesn't natively support it.
    this.server.onRequest('textDocument/codeAction', (params) =>
      this.handleCodeAction(params as CodeActionParams)
    );
    this.server.onRequest('codeAction/resolve', (params) =>
      this.handleResolveCodeAction(params as CodeAction)
    );

    opts.transport.onClose(() => this.handleClose());

    void this.server.listen(opts.transport);
  }

  private async resolveCapabilities(params: InitializeParams): Promise<ServerCapabilities> {
    const initOpts = params.initializationOptions as Record<string, unknown> | undefined;
    this.languageId = (initOpts?.['languageId'] as string | undefined) ?? 'plaintext';
    const backend = await this.pool.ensureBackend(this.languageId);

    // Forward workspace/applyEdit from this backend to this session's client.
    // The registration overwrites any prior session's handler for the same
    // (shared, pooled) backend — acceptable because applyEdit only fires
    // during executeCommand, which is driven by an active session.
    this.applyEditDisposable?.dispose();
    this.applyEditDisposable = (
      backend.onRequest as (m: string, h: (p: unknown) => Promise<unknown>) => { dispose(): void }
    )('workspace/applyEdit', (p) => this.server.sendRequest('workspace/applyEdit', p as never));

    const raw = backend.getServerCapabilities() ?? {};
    return applicablePolyfills(raw).reduce(
      (caps, polyfill) => polyfill.patchCapabilities?.(caps) ?? caps,
      raw
    );
  }

  private async handleDidOpen(params: unknown): Promise<void> {
    const p = params as Record<string, unknown>;
    const td = p['textDocument'] as Record<string, unknown>;
    const uri = td['uri'] as string;
    const content = td['text'] as string;
    const langId = td['languageId'] as string;
    const action = this.docState.onDidOpen(this.id, uri, content, langId);

    const backend = await this.pool.ensureBackend(
      langId || this.languageIdForUri(uri) || this.languageId
    );

    if (action === 'open') {
      await (backend.sendNotification as (m: string, p: unknown) => Promise<void>)(
        'textDocument/didOpen',
        p
      );
    } else if (action === 'change') {
      await (backend.sendNotification as (m: string, p: unknown) => Promise<void>)(
        'textDocument/didChange',
        {
          textDocument: { uri, version: (td['version'] as number) + 1 },
          contentChanges: [{ text: content }]
        }
      );
    }
    // 'skip' -> no-op
  }

  private handleDidClose(params: unknown): void {
    const p = params as Record<string, unknown>;
    const td = p['textDocument'] as Record<string, unknown>;
    const uri = td['uri'] as string;
    this.docState.onDidClose(this.id, uri);
  }

  private resolveBackend(params: unknown): LSPClient {
    const p = params as Record<string, unknown> | undefined;
    const td = p?.['textDocument'] as Record<string, unknown> | undefined;
    const uri = td?.['uri'] as string | undefined;
    const langId = uri ? (this.languageIdForUri(uri) ?? this.languageId) : this.languageId;
    const backend = this.pool.getBackend(langId) ?? this.pool.getBackend(this.languageId);
    if (!backend) throw new Error(`No backend available for languageId "${langId}"`);
    this.pool.recordRequest(uri ? langId : this.languageId);
    return backend;
  }

  private async handleCodeAction(params: CodeActionParams): Promise<CodeAction[]> {
    const backend = this.resolveBackend(params);
    const real = ((await (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(
      'textDocument/codeAction',
      params
    )) ?? []) as CodeAction[];

    let actions = real;
    for (const polyfill of applicablePolyfills(backend.getServerCapabilities() ?? {})) {
      if (!polyfill.augmentCodeActions) continue;
      try {
        actions = await polyfill.augmentCodeActions(actions, params, backend);
      } catch {
        // Degrade gracefully: synthesis failure must not fail the whole request.
      }
    }
    return actions;
  }

  private async handleResolveCodeAction(action: CodeAction): Promise<CodeAction> {
    const backend = this.pool.getBackend(this.languageId);
    if (!backend) throw new Error(`No backend available for languageId "${this.languageId}"`);
    const capabilities = backend.getServerCapabilities() ?? {};
    const provider = capabilities.codeActionProvider;
    const hasNativeResolve = typeof provider === 'object' && provider.resolveProvider === true;

    if (hasNativeResolve) {
      return (await (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(
        'codeAction/resolve',
        action
      )) as CodeAction;
    }

    for (const polyfill of applicablePolyfills(capabilities)) {
      if (polyfill.resolveCodeAction) return polyfill.resolveCodeAction(action, backend);
    }
    // No applicable polyfill and no native support: nothing more we can do.
    return action;
  }

  private languageIdForUri(uri: string): string | undefined {
    try {
      const ext = extname(new URL(uri).pathname);
      return this.pool.getLanguageIdForExtension(ext) ?? this.languageId;
    } catch {
      return this.languageId;
    }
  }

  private handleClose(): void {
    this.applyEditDisposable?.dispose();
    this.applyEditDisposable = undefined;
    this.docState.onSessionEnd(this.id);
    this.onEnd(this.id);
  }
}
