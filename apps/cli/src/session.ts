/**
 * Thin session wrapper around `@lspeasy/client` for one-shot refactor commands.
 *
 * Encapsulates the proven recipe: spawn the language server, connect (which
 * performs the `initialize` / `initialized` handshake with a generous set of
 * client capabilities), open an anchor file, wait for the project to index,
 * then run a request with a single null-result retry.
 *
 * All diagnostic logging goes to **stderr** so that `--json` output on stdout
 * stays machine-parseable.
 */

import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { LSPClient } from '@lspeasy/client';
import {
  NullLogger,
  tokenizeCommand,
  type ClientCapabilities,
  type Logger,
  type ServerCapabilities,
  type Transport
} from '@lspeasy/core';
import { StdioTransport } from '@lspeasy/core/node';

import type { WorkspaceEdit } from './apply.js';

export interface SessionOptions {
  /** Server launch command, e.g. `typescript-language-server --stdio`. Required unless `transport` is supplied. */
  serverCommand?: string;
  /** Absolute project root directory. */
  root: string;
  /** languageId for textDocument/didOpen (e.g. 'typescript', 'rust'). */
  languageId?: string;
  /** Milliseconds to wait for the server to index before the first request. */
  indexWaitMs?: number;
  /** Emit `[lsproxy] …` progress lines to stderr. */
  verbose?: boolean;
  /**
   * Pre-built transport to use instead of spawning a server process.
   *
   * When supplied, `serverCommand` is ignored and no child process is spawned.
   * Used by the proxy path to reuse all downstream session logic unchanged.
   */
  transport?: Transport;
}

// Advertise the full set of capabilities the CLI can dispatch so servers do
// not gate their ServerCapabilities on a narrow client declaration. Each entry
// corresponds to a ClientCapability path used by getCapabilityForRequestMethod;
// a missing entry silently suppresses the matching command from the command tree.
const CLIENT_CAPABILITIES = {
  textDocument: {
    synchronization: { dynamicRegistration: false },
    // Navigation
    definition: { dynamicRegistration: false },
    declaration: { dynamicRegistration: false },
    typeDefinition: { dynamicRegistration: false },
    implementation: { dynamicRegistration: false },
    references: { dynamicRegistration: false },
    documentHighlight: { dynamicRegistration: false },
    documentSymbol: { dynamicRegistration: false },
    // Hover / completion / signature
    hover: { dynamicRegistration: false },
    completion: { dynamicRegistration: false },
    signatureHelp: { dynamicRegistration: false },
    // Refactor / actions / rename
    rename: { dynamicRegistration: false, prepareSupport: true },
    codeAction: {
      dynamicRegistration: false,
      codeActionLiteralSupport: {
        codeActionKind: {
          valueSet: [
            '',
            'quickfix',
            'refactor',
            'refactor.extract',
            'refactor.inline',
            'refactor.move',
            'refactor.rewrite',
            'source',
            'source.organizeImports',
            'source.fixAll'
          ]
        }
      },
      resolveSupport: { properties: ['edit'] },
      dataSupport: true
    },
    codeLens: { dynamicRegistration: false },
    // Formatting
    formatting: { dynamicRegistration: false },
    rangeFormatting: { dynamicRegistration: false },
    onTypeFormatting: { dynamicRegistration: false },
    // Semantic tokens — needed for servers to advertise semanticTokensProvider
    semanticTokens: {
      dynamicRegistration: false,
      requests: { full: { delta: true }, range: true },
      tokenTypes: [],
      tokenModifiers: [],
      formats: ['relative' as const],
      overlappingTokenSupport: false,
      multilineTokenSupport: false
    },
    // Hierarchy / navigation
    callHierarchy: { dynamicRegistration: false },
    typeHierarchy: { dynamicRegistration: false },
    selectionRange: { dynamicRegistration: false },
    foldingRange: { dynamicRegistration: false },
    linkedEditingRange: { dynamicRegistration: false },
    // Lenses / hints
    inlayHint: { dynamicRegistration: false, resolveSupport: { properties: [] } },
    inlineValue: { dynamicRegistration: false },
    // Diagnostics / misc
    diagnostic: { dynamicRegistration: false },
    colorProvider: { dynamicRegistration: false },
    documentLink: { dynamicRegistration: false },
    moniker: { dynamicRegistration: false }
  },
  workspace: {
    applyEdit: true,
    executeCommand: { dynamicRegistration: false },
    symbol: { dynamicRegistration: false },
    workspaceEdit: {
      documentChanges: true,
      resourceOperations: ['create', 'rename', 'delete'] as Array<'create' | 'rename' | 'delete'>
    },
    fileOperations: { dynamicRegistration: false, willRename: true }
  }
} satisfies Partial<ClientCapabilities>;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * An ordered queue of edits the server pushed via `workspace/applyEdit`.
 *
 * A server implementing `executeCommand` may send MORE THAN ONE sequential
 * applyEdit request for a single command. The old "single field" capture
 * overwrote earlier edits while still acking each `applied: true`, silently
 * dropping every edit but the last. This queue preserves them all in arrival
 * order; {@link drain} returns and clears the batch.
 */
export class CapturedEdits {
  private edits: WorkspaceEdit[] = [];
  /** Record an edit the server pushed (handler must NOT drop it). */
  push(edit: WorkspaceEdit): void {
    this.edits.push(edit);
  }
  /** Return all captured edits in order and reset the queue. */
  drain(): WorkspaceEdit[] {
    const out = this.edits;
    this.edits = [];
    return out;
  }
}

/**
 * Logger that routes everything to **stderr**, keeping stdout clean for the
 * CLI's own output (critical for `--json`).
 */
class StderrLogger implements Logger {
  error(message: string, ...args: unknown[]): void {
    this.write('error', message, args);
  }
  warn(message: string, ...args: unknown[]): void {
    this.write('warn', message, args);
  }
  info(message: string, ...args: unknown[]): void {
    this.write('info', message, args);
  }
  debug(message: string, ...args: unknown[]): void {
    this.write('debug', message, args);
  }
  trace(message: string, ...args: unknown[]): void {
    this.write('trace', message, args);
  }
  private write(level: string, message: string, args: unknown[]): void {
    const extra = args.length ? ' ' + args.map((a) => JSON.stringify(a)).join(' ') : '';
    process.stderr.write(`[lsp:${level}] ${message}${extra}\n`);
  }
}

/** Internal resolved options — all fields except `serverCommand` and `transport` have defaults. */
type ResolvedSessionOptions = Required<Omit<SessionOptions, 'transport' | 'serverCommand'>> &
  Pick<SessionOptions, 'transport' | 'serverCommand'>;

export class RefactorSession {
  private readonly opts: ResolvedSessionOptions;
  private proc?: ChildProcessWithoutNullStreams;
  private client?: LSPClient;
  /**
   * Edits pushed by the server via `workspace/applyEdit`, in arrival order. A
   * server implementing `executeCommand` may send MORE THAN ONE sequential
   * applyEdit; we queue them all (rather than overwriting) so none is dropped
   * after the server was told `applied: true`.
   */
  private readonly capturedEdits = new CapturedEdits();

  constructor(opts: SessionOptions) {
    this.opts = {
      indexWaitMs: 15000,
      verbose: false,
      languageId: 'plaintext',
      ...opts
    };
  }

  private log(msg: string): void {
    if (this.opts.verbose) process.stderr.write(`[lsproxy] ${msg}\n`);
  }

  /** Spawn the server (or reuse a pre-built transport) and complete the LSP handshake. */
  async start(): Promise<void> {
    // Derive the workspace root URI + folders from --root so the server indexes
    // the right project (rootUri:null is fragile for non-tsserver servers).
    const rootDir = resolve(this.opts.root);
    const rootUri = pathToFileURL(rootDir).href;

    let transport: Transport;
    if (this.opts.transport) {
      transport = this.opts.transport;
      this.log(`using pre-built transport (proxy)`);
    } else {
      const [cmd, ...args] = tokenizeCommand(this.opts.serverCommand ?? '');
      if (!cmd) throw new Error('Empty --server command');

      this.log(`spawning: ${this.opts.serverCommand} (cwd ${this.opts.root})`);
      const proc = spawn(cmd, args, { cwd: this.opts.root }) as ChildProcessWithoutNullStreams;
      this.proc = proc;
      proc.on('error', (e) => {
        process.stderr.write(`[lsproxy] server spawn error: ${e.message}\n`);
      });
      transport = new StdioTransport({ input: proc.stdout, output: proc.stdin });
    }

    const client: LSPClient = new LSPClient<ClientCapabilities>({
      name: 'lsproxy-cli',
      version: '0.1.0',
      capabilities: CLIENT_CAPABILITIES as ClientCapabilities,
      rootUri,
      workspaceFolders: [{ uri: rootUri, name: basename(rootDir) }],
      initializationOptions: { languageId: this.opts.languageId },
      // Keep stdout clean; route the SDK's own logging to stderr (or silence it).
      logger: this.opts.verbose ? new StderrLogger() : new NullLogger()
    });
    this.client = client;

    // Intercept server-pushed edits (tsserver's refactor.move applies this way).
    // Queue every pushed edit in order — a server may send several sequential
    // applyEdit requests for one command, and acking `applied:true` for an edit
    // we then dropped would be a lie that loses changes.
    client.onRequest('workspace/applyEdit', (params: { edit: WorkspaceEdit }) => {
      this.capturedEdits.push(params.edit);
      return { applied: true };
    });

    await client.connect(transport);
    this.log('connected (initialize/initialized handshake complete)');
  }

  /** Notify the server that an anchor file is open. */
  async open(anchorFile: string): Promise<void> {
    const client = this.requireClient();
    await client.sendNotification('textDocument/didOpen', {
      textDocument: {
        uri: pathToFileURL(anchorFile).href,
        languageId: this.opts.languageId,
        version: 1,
        text: readFileSync(anchorFile, 'utf8')
      }
    });
    this.log(`didOpen ${anchorFile}`);
  }

  /**
   * Run a request immediately and retry with exponential backoff while the
   * server returns null (i.e. it is still indexing). Gives up after
   * `indexWaitMs` total elapsed time and returns null.
   *
   * Initial retry delay: 250 ms, doubling each round, capped at 5 s per
   * attempt. The first attempt is always immediate so fast servers pay no
   * extra latency at all.
   */
  async requestWithRetry<R>(run: () => Promise<R | null | undefined>): Promise<R | null> {
    const deadline = Date.now() + this.opts.indexWaitMs;
    let delay = 250;
    while (true) {
      const res = await run();
      if (res !== null && res !== undefined) return res as R;
      const remaining = deadline - Date.now();
      if (remaining <= 0) return null;
      const wait = Math.min(delay, remaining);
      this.log(`null result — retrying in ${wait}ms (${remaining}ms remaining)`);
      await sleep(wait);
      delay = Math.min(delay * 2, 5000);
    }
  }

  /**
   * Drain ALL edits pushed by the server via `workspace/applyEdit` since the
   * last drain, in arrival order. Returns an empty array if none were pushed.
   * Callers apply them in order so a multi-applyEdit command is fully honored.
   */
  takeCapturedEdits(): WorkspaceEdit[] {
    return this.capturedEdits.drain();
  }

  get lsp(): LSPClient {
    return this.requireClient();
  }

  get capabilities(): ServerCapabilities {
    return this.requireClient().getServerCapabilities() ?? ({} as ServerCapabilities);
  }

  private requireClient(): LSPClient {
    if (!this.client) throw new Error('Session not started — call start() first');
    return this.client;
  }

  /** Shut down the client and kill the server process. */
  async stop(): Promise<void> {
    try {
      await this.client?.disconnect();
    } catch {
      /* ignore shutdown races */
    }
    this.proc?.kill();
  }
}
