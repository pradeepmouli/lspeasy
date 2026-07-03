// apps/proxy/src/proxy-session.ts
import { extname } from 'node:path';
import { LSPServer } from '@lspeasy/server';
import type { InitializeParams, ServerCapabilities, Transport } from '@lspeasy/core';
import type { LSPClient } from '@lspeasy/client';
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
  private readonly onEnd: (sessionId: string) => void;
  private readonly server: LSPServer;
  private languageId = 'plaintext';

  constructor(opts: ProxySessionOptions) {
    this.id = opts.sessionId;
    this.pool = opts.pool;
    this.onEnd = opts.onEnd;

    this.server = new LSPServer({
      name: 'lsproxy',
      version: '0.1.0',
      resolveCapabilities: (params) => this.resolveCapabilities(params)
    });

    this.server.onRequest('$/lsproxy.status', async () => opts.onStatus());

    registerPassThrough(this.server, (params) => this.resolveBackend(params));

    opts.transport.onClose(() => this.handleClose());

    void this.server.listen(opts.transport);
  }

  private async resolveCapabilities(params: InitializeParams): Promise<ServerCapabilities> {
    const initOpts = params.initializationOptions as Record<string, unknown> | undefined;
    this.languageId = (initOpts?.['languageId'] as string | undefined) ?? 'plaintext';
    const backend = await this.pool.ensureBackend(this.languageId);
    return backend.getServerCapabilities() ?? {};
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

  private languageIdForUri(uri: string): string | undefined {
    try {
      const ext = extname(new URL(uri).pathname);
      return this.pool.getLanguageIdForExtension(ext) ?? this.languageId;
    } catch {
      return this.languageId;
    }
  }

  private handleClose(): void {
    this.onEnd(this.id);
  }
}
