// apps/proxy/src/backend-pool.ts
import { spawn } from 'node:child_process';
import { resolve, basename } from 'node:path';
import type { Readable, Writable } from 'node:stream';
import type { BackendRuntime } from './status.js';
import { pathToFileURL } from 'node:url';
import { LSPClient } from '@lspeasy/client';
import {
  tokenizeCommand,
  discoverServerByLanguageId,
  discoverExtensionMap,
  type ClientCapabilities
} from '@lspeasy/core';
import { StdioTransport } from '@lspeasy/core/node';

// Advertise full capabilities so backends expose their complete ServerCapabilities.
const CLIENT_CAPABILITIES = {
  textDocument: {
    synchronization: { dynamicRegistration: false },
    definition: { dynamicRegistration: false },
    declaration: { dynamicRegistration: false },
    typeDefinition: { dynamicRegistration: false },
    implementation: { dynamicRegistration: false },
    references: { dynamicRegistration: false },
    documentSymbol: { dynamicRegistration: false },
    hover: { dynamicRegistration: false },
    completion: { dynamicRegistration: false },
    signatureHelp: { dynamicRegistration: false },
    rename: { dynamicRegistration: false },
    codeAction: { dynamicRegistration: false },
    formatting: { dynamicRegistration: false },
    rangeFormatting: { dynamicRegistration: false }
  },
  workspace: {
    applyEdit: true,
    executeCommand: { dynamicRegistration: false },
    symbol: { dynamicRegistration: false }
  }
} satisfies Partial<ClientCapabilities>;

export interface BackendPoolOptions {
  backendIdleMs?: number;
}

interface BackendEntry {
  client: LSPClient;
  proc: ReturnType<typeof spawn>;
  idleTimer?: ReturnType<typeof setTimeout>;
  startedAt: number;
  requestCount: number;
}

export class BackendPool {
  private readonly backends = new Map<string, BackendEntry>();
  private readonly starting = new Map<string, Promise<LSPClient>>();
  private readonly extensionMap: Record<string, string>;
  private readonly backendIdleMs: number;

  constructor(
    private readonly root: string,
    opts: BackendPoolOptions = {}
  ) {
    this.backendIdleMs = opts.backendIdleMs ?? 600_000;
    this.extensionMap = discoverExtensionMap(root);
  }

  getLanguageIdForExtension(ext: string): string | undefined {
    return this.extensionMap[ext];
  }

  getBackend(languageId: string): LSPClient | undefined {
    return this.backends.get(languageId)?.client;
  }

  /** Increment the forwarded-request counter for a live backend; no-op if cold. */
  recordRequest(languageId: string): void {
    const entry = this.backends.get(languageId);
    if (entry) entry.requestCount += 1;
  }

  /** Runtime snapshot of every live backend, for status reporting. */
  listBackends(): BackendRuntime[] {
    return [...this.backends.entries()].map(([languageId, entry]) => ({
      languageId,
      pid: entry.proc.pid ?? -1,
      startedAt: entry.startedAt,
      requestCount: entry.requestCount,
      healthy: entry.proc.exitCode === null
    }));
  }

  async ensureBackend(languageId: string): Promise<LSPClient> {
    const existing = this.backends.get(languageId);
    if (existing) {
      this.resetIdleTimer(languageId, existing);
      return existing.client;
    }

    // Deduplicate concurrent startup calls for the same languageId
    const inflight = this.starting.get(languageId);
    if (inflight) return inflight;

    const promise = this.startBackend(languageId);
    this.starting.set(languageId, promise);
    try {
      return await promise;
    } finally {
      this.starting.delete(languageId);
    }
  }

  private async startBackend(languageId: string): Promise<LSPClient> {
    const discovered = discoverServerByLanguageId(this.root, languageId);
    if (!discovered) {
      throw new Error(`No LSP server configured for languageId "${languageId}"`);
    }

    const [cmd, ...args] = tokenizeCommand(discovered.serverCommand);
    if (!cmd) throw new Error('Empty server command');

    const proc = spawn(cmd, args, { cwd: this.root, stdio: 'pipe' });

    // Without this handler, an unhandled 'error' event (e.g. ENOENT for a
    // misconfigured lsp.json command) throws synchronously and crashes the
    // *entire* daemon process — taking down every other language's backend
    // with it. Attaching a listener downgrades that to a normal rejection of
    // this startBackend() call (surfaced to the caller below), matching the
    // established pattern in apps/cli/src/session.ts's direct-spawn path.
    const spawnError = new Promise<never>((_, reject) => {
      proc.on('error', (err) => {
        const message = `Failed to spawn backend for languageId "${languageId}" (command: ${discovered.serverCommand}): ${err.message}`;
        process.stderr.write(`[lsproxy] ${message}\n`);
        reject(new Error(message));
      });
    });

    const transport = new StdioTransport({
      input: proc.stdout as Readable,
      output: proc.stdin as Writable
    });

    const rootDir = resolve(this.root);
    const rootUri = pathToFileURL(rootDir).href;
    const client = new LSPClient({
      name: 'lsproxy',
      version: '0.1.0',
      capabilities: CLIENT_CAPABILITIES as ClientCapabilities,
      rootUri,
      workspaceFolders: [{ uri: rootUri, name: basename(rootDir) }],
      ...(discovered.initializationOptions
        ? { initializationOptions: discovered.initializationOptions }
        : {})
    });

    try {
      // Race the handshake against the spawn-error signal so a broken
      // command (ENOENT, EACCES, ...) rejects this call immediately instead
      // of hanging forever waiting for a response from a process that never
      // started.
      await Promise.race([client.connect(transport), spawnError]);
    } catch (err) {
      // Best-effort cleanup — proc.kill() can itself throw (e.g. an already-
      // dead process, permission error); that must never mask the original
      // spawn/connect error being propagated below.
      try {
        proc.kill();
      } catch {
        // ignored — see comment above
      }
      throw err;
    }

    const entry: BackendEntry = { client, proc, startedAt: Date.now(), requestCount: 0 };
    this.backends.set(languageId, entry);
    this.resetIdleTimer(languageId, entry);
    return client;
  }

  async stopBackend(languageId: string): Promise<void> {
    const entry = this.backends.get(languageId);
    if (!entry) return;
    if (entry.idleTimer) {
      clearTimeout(entry.idleTimer);
      delete entry.idleTimer;
    }
    this.backends.delete(languageId);
    try {
      await entry.client.disconnect();
    } catch {
      // ignore
    }
    entry.proc.kill();
  }

  async stopAll(): Promise<void> {
    await Promise.all([...this.backends.keys()].map((id) => this.stopBackend(id)));
  }

  private resetIdleTimer(languageId: string, entry: BackendEntry): void {
    if (entry.idleTimer) {
      clearTimeout(entry.idleTimer);
    }
    entry.idleTimer = setTimeout(() => this.stopBackend(languageId), this.backendIdleMs);
  }
}
