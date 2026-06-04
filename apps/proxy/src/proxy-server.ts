// apps/proxy/src/proxy-server.ts
import { createServer, createConnection, type Server, type Socket } from 'node:net';
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { socketToTransport } from '@lspeasy/core/node';
import { BackendPool, type BackendPoolOptions } from './backend-pool.js';
import { DocumentStateManager } from './document-state.js';
import { ClientSession } from './client-session.js';
import { socketPath, pidPath } from './socket-path.js';

export interface ProxyServerOptions extends BackendPoolOptions {
  root: string;
  socketOverride?: string;
  idleTimeoutMs?: number;
  lazyCloseMs?: number;
}

export class ProxyServer {
  private readonly root: string;
  private readonly sockPath: string;
  private readonly pidFilePath: string;
  private readonly idleTimeoutMs: number;
  private readonly pool: BackendPool;
  private readonly docState: DocumentStateManager;
  private server: Server | undefined;
  private readonly sessions = new Map<string, ClientSession>();
  private readonly activeSockets = new Set<Socket>();
  private idleTimer: ReturnType<typeof setTimeout> | undefined;
  private sessionCounter = 0;

  constructor(opts: ProxyServerOptions) {
    this.root = opts.root;
    this.sockPath = opts.socketOverride ?? socketPath(opts.root);
    this.pidFilePath = opts.socketOverride
      ? opts.socketOverride.endsWith('.sock')
        ? opts.socketOverride.slice(0, -5) + '.pid'
        : opts.socketOverride + '.pid'
      : pidPath(opts.root);
    this.idleTimeoutMs = opts.idleTimeoutMs ?? 1_800_000;
    this.pool = new BackendPool(opts.root, {
      ...(opts.backendIdleMs !== undefined && { backendIdleMs: opts.backendIdleMs })
    });
    this.docState = new DocumentStateManager({
      ...(opts.lazyCloseMs !== undefined && { lazyCloseMs: opts.lazyCloseMs }),
      onClose: (uri) => this.lazyCloseUri(uri)
    });
  }

  async start(): Promise<void> {
    mkdirSync(dirname(this.sockPath), { recursive: true });

    const srv = createServer((socket) => {
      this.activeSockets.add(socket);
      socket.on('close', () => this.activeSockets.delete(socket));
      const sessionId = `s${++this.sessionCounter}`;
      const transport = socketToTransport(socket);
      const session = new ClientSession({
        sessionId,
        transport,
        pool: this.pool,
        docState: this.docState,
        root: this.root,
        onEnd: (id) => this.onSessionEnd(id)
      });
      this.sessions.set(sessionId, session);
      this.resetIdleTimer();
    });

    this.server = srv;
    await new Promise<void>((resolve, reject) => {
      srv.on('error', async (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          const live = await this.isSocketLive(this.sockPath);
          if (live) {
            process.stderr.write('[lsproxy] socket already in use — another daemon is running\n');
            process.exit(0);
          }
          // Stale socket from a crashed daemon — remove and retry once
          unlinkSync(this.sockPath);
          srv.listen(this.sockPath, resolve);
        } else {
          reject(err);
        }
      });
      srv.listen(this.sockPath, resolve);
    });

    writeFileSync(this.pidFilePath, String(process.pid), 'utf8');
    process.stderr.write(`[lsproxy] listening on ${this.sockPath}\n`);

    process.on('SIGTERM', () => this.stop());
    this.resetIdleTimer();
  }

  async stop(): Promise<void> {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = undefined;
    }
    await this.pool.stopAll();
    for (const sock of this.activeSockets) sock.destroy();
    await new Promise<void>((resolve) => {
      if (!this.server) {
        resolve();
        return;
      }
      this.server.close(() => resolve());
    });
    if (existsSync(this.sockPath)) unlinkSync(this.sockPath);
    if (existsSync(this.pidFilePath)) unlinkSync(this.pidFilePath);
  }

  private onSessionEnd(sessionId: string): void {
    this.sessions.delete(sessionId);
    this.resetIdleTimer();
  }

  private resetIdleTimer(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    if (this.sessions.size > 0) return;
    this.idleTimer = setTimeout(() => {
      process.stderr.write('[lsproxy] idle timeout — shutting down\n');
      this.stop().then(() => process.exit(0));
    }, this.idleTimeoutMs);
  }

  private isSocketLive(sockPath: string): Promise<boolean> {
    return new Promise((resolve) => {
      const sock = createConnection({ path: sockPath });
      sock.once('connect', () => {
        sock.destroy();
        resolve(true);
      });
      sock.once('error', () => resolve(false));
    });
  }

  private async lazyCloseUri(uri: string): Promise<void> {
    const ext = (() => {
      try {
        return new URL(uri).pathname.split('.').pop() ?? '';
      } catch {
        return '';
      }
    })();
    const langId = ext ? this.pool.getLanguageIdForExtension(`.${ext}`) : undefined;
    const backend = langId ? this.pool.getBackend(langId) : undefined;
    if (!backend) return;
    try {
      await (backend.sendNotification as (m: string, p: unknown) => Promise<void>)(
        'textDocument/didClose',
        { textDocument: { uri } }
      );
    } catch {
      // ignore
    }
  }
}
