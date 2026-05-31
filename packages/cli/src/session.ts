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
import { NullLogger, type ClientCapabilities, type Logger } from '@lspeasy/core';
import { StdioTransport } from '@lspeasy/core/node';

import type { WorkspaceEdit } from './apply.js';

export interface SessionOptions {
  /** Server launch command, e.g. `typescript-language-server --stdio`. */
  serverCommand: string;
  /** Absolute project root directory. */
  root: string;
  /** Milliseconds to wait for the server to index before the first request. */
  indexWaitMs?: number;
  /** Emit `[lspeasy] …` progress lines to stderr. */
  verbose?: boolean;
}

/** Client capabilities advertised at `initialize`. Generous so the server
 * gates none of the refactor features we rely on. */
const CLIENT_CAPABILITIES = {
  textDocument: {
    synchronization: { dynamicRegistration: false },
    rename: { dynamicRegistration: false, prepareSupport: true },
    codeAction: {
      dynamicRegistration: false,
      codeActionLiteralSupport: { codeActionKind: { valueSet: ['', 'refactor', 'refactor.move'] } },
      resolveSupport: { properties: ['edit'] },
      dataSupport: true
    },
    definition: { dynamicRegistration: false },
    references: { dynamicRegistration: false },
    hover: { dynamicRegistration: false }
  },
  workspace: {
    applyEdit: true,
    executeCommand: { dynamicRegistration: false },
    workspaceEdit: {
      documentChanges: true,
      resourceOperations: ['create', 'rename', 'delete'] as Array<'create' | 'rename' | 'delete'>
    },
    fileOperations: { dynamicRegistration: false, willRename: true }
  }
} satisfies Partial<ClientCapabilities>;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Split a server launch command into argv tokens, honoring single- and
 * double-quoted spans so an argument containing spaces survives intact (e.g.
 * `node "/path with spaces/server.js" --stdio`). A naive `split(/\s+/)` shredded
 * such commands into broken fragments.
 *
 * This is a deliberately small, dependency-free tokenizer (matching the repo's
 * "no extra dependency" ethos): quotes group, a `\` escapes the next character,
 * and unquoted whitespace separates tokens. It is not a full POSIX shell parser
 * (no variable/glob expansion) — only the quoting needed to pass paths/args.
 */
export function tokenizeCommand(command: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inToken = false;
  let quote: '"' | "'" | undefined;

  for (let i = 0; i < command.length; i++) {
    const ch = command[i]!;
    if (quote) {
      if (ch === '\\' && quote === '"' && i + 1 < command.length) {
        // In double quotes a backslash escapes the next character.
        current += command[++i]!;
      } else if (ch === quote) {
        quote = undefined;
      } else {
        current += ch;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      inToken = true;
      continue;
    }
    if (ch === '\\' && i + 1 < command.length) {
      current += command[++i]!;
      inToken = true;
      continue;
    }
    if (/\s/.test(ch)) {
      if (inToken) {
        tokens.push(current);
        current = '';
        inToken = false;
      }
      continue;
    }
    current += ch;
    inToken = true;
  }
  if (inToken) tokens.push(current);
  return tokens;
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

export class RefactorSession {
  private readonly opts: Required<SessionOptions>;
  private proc?: ChildProcessWithoutNullStreams;
  private client?: LSPClient;
  /** Captured edit pushed by the server via `workspace/applyEdit`. */
  private capturedApplyEdit: WorkspaceEdit | undefined = undefined;

  constructor(opts: SessionOptions) {
    this.opts = {
      indexWaitMs: 15000,
      verbose: false,
      ...opts
    };
  }

  private log(msg: string): void {
    if (this.opts.verbose) process.stderr.write(`[lspeasy] ${msg}\n`);
  }

  /** Spawn the server and complete the LSP handshake. */
  async start(): Promise<void> {
    const [cmd, ...args] = tokenizeCommand(this.opts.serverCommand);
    if (!cmd) throw new Error('Empty --server command');

    this.log(`spawning: ${this.opts.serverCommand} (cwd ${this.opts.root})`);
    const proc = spawn(cmd, args, { cwd: this.opts.root }) as ChildProcessWithoutNullStreams;
    this.proc = proc;
    proc.on('error', (e) => {
      process.stderr.write(`[lspeasy] server spawn error: ${e.message}\n`);
    });

    // Derive the workspace root URI + folders from --root so the server indexes
    // the right project (rootUri:null is fragile for non-tsserver servers).
    const rootDir = resolve(this.opts.root);
    const rootUri = pathToFileURL(rootDir).href;

    const transport = new StdioTransport({ input: proc.stdout, output: proc.stdin });
    const client: LSPClient = new LSPClient<ClientCapabilities>({
      name: 'lspeasy-cli',
      version: '0.1.0',
      capabilities: CLIENT_CAPABILITIES as ClientCapabilities,
      rootUri,
      workspaceFolders: [{ uri: rootUri, name: basename(rootDir) }],
      // Keep stdout clean; route the SDK's own logging to stderr (or silence it).
      logger: this.opts.verbose ? new StderrLogger() : new NullLogger()
    });
    this.client = client;

    // Intercept server-pushed edits (tsserver's refactor.move applies this way).
    client.onRequest('workspace/applyEdit', (params: { edit: WorkspaceEdit }) => {
      this.capturedApplyEdit = params.edit;
      return { applied: true };
    });

    await client.connect(transport);
    this.log('connected (initialize/initialized handshake complete)');
  }

  /** Open an anchor file and wait for the server to index the project. */
  async openAndWait(anchorFile: string, languageId = 'typescript'): Promise<void> {
    const client = this.requireClient();
    await client.sendNotification('textDocument/didOpen', {
      textDocument: {
        uri: pathToFileURL(anchorFile).href,
        languageId,
        version: 1,
        text: readFileSync(anchorFile, 'utf8')
      }
    });
    this.log(`didOpen ${anchorFile}; waiting ${this.opts.indexWaitMs}ms for indexing…`);
    await sleep(this.opts.indexWaitMs);
  }

  /**
   * Run a request that may return `null` while the project is still warming up.
   * Retries once after another index wait. Returns the (possibly null) result.
   */
  async requestWithRetry<R>(run: () => Promise<R | null | undefined>): Promise<R | null> {
    let res = await run();
    if (res === null || res === undefined) {
      this.log(`null result — retrying after ${this.opts.indexWaitMs}ms`);
      await sleep(this.opts.indexWaitMs);
      res = await run();
    }
    return (res ?? null) as R | null;
  }

  /** The edit most recently pushed by the server via `workspace/applyEdit`. */
  takeCapturedEdit(): WorkspaceEdit | undefined {
    const e = this.capturedApplyEdit;
    this.capturedApplyEdit = undefined;
    return e;
  }

  get lsp(): LSPClient {
    return this.requireClient();
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
