// apps/proxy/src/client-session.ts
import { extname } from 'node:path';
import type { Transport } from '@lspeasy/core';
import type { LSPClient } from '@lspeasy/client';
import type { BackendPool } from './backend-pool.js';
import type { DocumentStateManager } from './document-state.js';

export interface ClientSessionOptions {
  sessionId: string;
  transport: Transport;
  pool: BackendPool;
  docState: DocumentStateManager;
  root: string;
  onEnd: (sessionId: string) => void;
}

type RawMsg = {
  jsonrpc: '2.0';
  id?: string | number | null;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: unknown;
};

export class ClientSession {
  private readonly id: string;
  private readonly transport: Transport;
  private readonly pool: BackendPool;
  private readonly docState: DocumentStateManager;
  private readonly onEnd: (sessionId: string) => void;
  private languageId = 'plaintext';
  private requestIdCounter = 0;
  private readonly pendingClientRequests = new Map<string | number, (result: unknown) => void>();
  private applyEditDisposable: { dispose(): void } | undefined;

  constructor(opts: ClientSessionOptions) {
    this.id = opts.sessionId;
    this.transport = opts.transport;
    this.pool = opts.pool;
    this.docState = opts.docState;
    this.onEnd = opts.onEnd;

    this.transport.onMessage((msg) => this.handleMessage(msg as unknown as RawMsg));
    this.transport.onClose(() => this.handleClose());
    this.transport.onError((e) => process.stderr.write(`[session:${this.id}] ${e.message}\n`));
  }

  private async handleMessage(msg: RawMsg): Promise<void> {
    const isRequest = msg.id !== undefined && msg.method !== undefined;
    const isNotification = msg.id === undefined && msg.method !== undefined;
    // Response to a request we sent (e.g. workspace/applyEdit forwarded to CLI)
    const isResponse = msg.id !== undefined && msg.method === undefined && msg.result !== undefined;

    if (isResponse) {
      const resolve = this.pendingClientRequests.get(msg.id as string | number);
      if (resolve) {
        this.pendingClientRequests.delete(msg.id as string | number);
        resolve(msg.result);
      }
      return;
    }

    try {
      if (isRequest) {
        const result = await this.handleRequest(msg);
        await this.transport.send({
          jsonrpc: '2.0',
          id: msg.id as string | number,
          result
        });
      } else if (isNotification) {
        await this.handleNotification(msg);
      }
    } catch (err) {
      if (isRequest) {
        await this.transport.send({
          jsonrpc: '2.0',
          id: msg.id as string | number,
          error: { code: -32603, message: String(err) }
        });
      }
    }
  }

  private async forwardToClient(method: string, params: unknown): Promise<unknown> {
    const id = ++this.requestIdCounter;
    return new Promise((resolve) => {
      this.pendingClientRequests.set(id, resolve);
      void this.transport.send({ jsonrpc: '2.0', id, method, params });
    });
  }

  private async handleRequest(msg: RawMsg): Promise<unknown> {
    if (msg.method === 'initialize') {
      return this.handleInitialize(msg.params as Record<string, unknown>);
    }
    if (msg.method === 'shutdown') {
      // Ack without tearing down the shared backend
      return null;
    }
    const backend = this.backendForMsg(msg);
    return (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(
      msg.method!,
      msg.params
    );
  }

  private async handleInitialize(params: Record<string, unknown>): Promise<unknown> {
    const initOpts = params['initializationOptions'] as Record<string, unknown> | undefined;
    this.languageId = (initOpts?.['languageId'] as string | undefined) ?? 'plaintext';
    const backend = await this.pool.ensureBackend(this.languageId);

    // Forward workspace/applyEdit from backend to this CLI session.
    // The registration overwrites any prior session's handler — acceptable because
    // applyEdit only fires during executeCommand, which is driven by an active session.
    this.applyEditDisposable?.dispose();
    this.applyEditDisposable = (
      backend.onRequest as (m: string, h: (p: unknown) => Promise<unknown>) => { dispose(): void }
    )('workspace/applyEdit', (p) => this.forwardToClient('workspace/applyEdit', p));

    return { capabilities: backend.getServerCapabilities() ?? {} };
  }

  private async handleNotification(msg: RawMsg): Promise<void> {
    // Session lifecycle — not forwarded to the shared backend
    if (msg.method === 'initialized' || msg.method === 'exit') return;

    if (msg.method === 'textDocument/didOpen') {
      const p = msg.params as Record<string, unknown>;
      const td = p['textDocument'] as Record<string, unknown>;
      const uri = td['uri'] as string;
      const content = td['text'] as string;
      const langId = td['languageId'] as string;
      const action = this.docState.onDidOpen(this.id, uri, content, langId);

      const backend = await this.pool.ensureBackend(langId || this.languageIdForUri(uri));

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
      // 'skip' → no-op
      return;
    }

    if (msg.method === 'textDocument/didClose') {
      const p = msg.params as Record<string, unknown>;
      const td = p['textDocument'] as Record<string, unknown>;
      const uri = td['uri'] as string;
      this.docState.onDidClose(this.id, uri);
      return;
    }

    // Forward all other notifications (didChange, willSave, etc.)
    const backend = this.backendForMsg(msg);
    await (backend.sendNotification as (m: string, p: unknown) => Promise<void>)(
      msg.method!,
      msg.params
    );
  }

  private backendForMsg(msg: RawMsg): LSPClient {
    // Prefer routing by URI extension; fall back to session's primary languageId
    const params = msg.params as Record<string, unknown> | undefined;
    const td = params?.['textDocument'] as Record<string, unknown> | undefined;
    const uri = td?.['uri'] as string | undefined;
    const langId = uri ? (this.languageIdForUri(uri) ?? this.languageId) : this.languageId;
    const backend = this.pool.getBackend(langId) ?? this.pool.getBackend(this.languageId);
    if (!backend) throw new Error(`No backend available for languageId "${langId}"`);
    return backend;
  }

  private languageIdForUri(uri: string): string {
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
