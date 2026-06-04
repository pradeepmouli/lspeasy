#!/usr/bin/env node
/**
 * lspeasy CLI entry point.
 *
 * Two-pass parse: util.parseArgs extracts global flags first (no Commander),
 * then the CLI connects to the server, reads capabilities, builds a
 * namespace/subcommand Commander tree, and hands process.argv back to
 * Commander for final dispatch.
 */

import { parseArgs } from 'node:util';
import { argv, exit } from 'node:process';
import { extname } from 'node:path';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';

import { fail, resolvePathArg, type GlobalFlags } from './io.js';
import { discoverServer } from '@lspeasy/core';
import { RefactorSession } from './session.js';
import { connectViaProxy } from './connect.js';
import { buildCommandTree } from './build-commands.js';

const STATIC_HELP = `lspeasy — LSP-driven CLI

Usage:
  lspeasy <namespace> <command> [args]
  lspeasy call <method> --params <json>

Available commands depend on the connected server's advertised capabilities.
Run with a file argument to see available commands for that language:
  lspeasy textDocument hover --help src/foo.ts

Global flags:
  --server <cmd>        LSP server launch command (overrides lsp.json discovery)
  --root <dir>          Project root (default: cwd)
  --dry-run             Print changes; do not write
  --json                Machine-readable JSON on stdout; diagnostics to stderr
  --wait <ms>           Server index wait in ms (default: 15000)
  --verbose             Progress logging to stderr
  --allow-outside-root  Allow file paths outside --root
  --no-proxy            Bypass proxy daemon; connect directly to language server
  -h, --help            Show this help
`;

const GLOBAL_OPTION_CONFIG = {
  server: { type: 'string' as const },
  root: { type: 'string' as const },
  'dry-run': { type: 'boolean' as const, default: false },
  json: { type: 'boolean' as const, default: false },
  wait: { type: 'string' as const, default: '15000' },
  verbose: { type: 'boolean' as const, default: false },
  'allow-outside-root': { type: 'boolean' as const, default: false },
  'no-proxy': { type: 'boolean' as const, default: false },
  help: { type: 'boolean' as const, short: 'h', default: false }
};

/** Parsed raw flag values from the first pass. */
export type ParsedOptionValues = {
  server?: string;
  root?: string;
  'dry-run'?: boolean;
  json?: boolean;
  wait?: string;
  verbose?: boolean;
  'allow-outside-root'?: boolean;
  'no-proxy'?: boolean;
};

/**
 * Validate raw flag values and project them onto {@link GlobalFlags}.
 *
 * `--wait` must parse to a finite, non-negative number; a typo like
 * `--wait abc` would otherwise become NaN, which setTimeout coerces to 0,
 * silently skipping the index wait refactor requests depend on.
 */
export function buildFlags(values: ParsedOptionValues): GlobalFlags {
  const json = values.json === true;
  const waitMs = Number(values.wait ?? '15000');
  if (!Number.isFinite(waitMs) || waitMs < 0) {
    fail(`--wait must be a non-negative number of milliseconds, got "${values.wait}"`, json);
  }
  return {
    server: values.server ?? '',
    root: values.root ?? process.cwd(),
    dryRun: values['dry-run'] === true,
    json,
    verbose: values.verbose === true,
    waitMs,
    allowOutsideRoot: values['allow-outside-root'] === true,
    noProxy: values['no-proxy'] === true,
    overwrite: false // move-file removed; the flag is kept in GlobalFlags for io.ts compatibility
  };
}

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    args: argv.slice(2),
    options: GLOBAL_OPTION_CONFIG,
    allowPositionals: true,
    strict: false
  });

  if (!positionals.length) {
    process.stdout.write(STATIC_HELP);
    exit(0);
  }

  const flags = buildFlags(values as ParsedOptionValues);

  let serverCommand: string;
  let languageId = 'plaintext';

  // positionals[0] = namespace, positionals[1] = method/command.
  // The source file can only appear at positionals[2] (the first subcommand
  // argument). A value is file-like only when it has an extension AND is not
  // a JSON literal (--params values that parseArgs left in positionals).
  // workspace/* methods (e.g. workspace/symbol) take a query string as their
  // first argument, not a file — skip file detection for that namespace to avoid
  // treating dotted identifiers like React.Component as file paths.
  const isFileLike = (p: string) =>
    extname(p) !== '' && !p.startsWith('{') && !p.startsWith('[') && !p.startsWith('"');
  const firstSubArg = positionals[2];
  const subArgFile =
    positionals[0] !== 'workspace' && firstSubArg !== undefined && isFileLike(firstSubArg)
      ? firstSubArg
      : undefined;

  if (flags.server) {
    serverCommand = flags.server;
    // Infer languageId from the file extension when --server bypasses discovery.
    if (subArgFile) {
      const ext = extname(subArgFile);
      const discovered = discoverServer(flags.root, ext);
      if (discovered) languageId = discovered.languageId;
    }
  } else {
    const ext = subArgFile ? extname(subArgFile) : '';

    if (!ext) {
      // No file argument — try lsp.json discovery with a wildcard lookup so
      // file-less commands (e.g. workspace/symbol) can still find a server.
      const discovered = discoverServer(flags.root, '');
      if (discovered) {
        serverCommand = discovered.serverCommand;
        languageId = discovered.languageId;
      } else {
        fail('Cannot determine language: pass a file argument or use --server <cmd>.', flags.json);
      }
    } else {
      const discovered = discoverServer(flags.root, ext);
      if (!discovered) {
        fail(
          `No LSP server configured for ${ext} files.\n` +
            'Add an lsp.json to your project (or ~/.claude/lsp.json) or use --server <cmd>.\n' +
            'Format: { "lspServers": { "lang": { "command": "...", "args": [...], "fileExtensions": { ".ext": "languageId" } } } }',
          flags.json
        );
      }
      serverCommand = discovered.serverCommand;
      languageId = discovered.languageId;
    }
  }

  let session: RefactorSession;
  if (flags.noProxy || !!flags.server || !serverCommand) {
    session = new RefactorSession({
      serverCommand,
      languageId,
      root: flags.root,
      indexWaitMs: flags.waitMs,
      verbose: flags.verbose
    });
    await session.start();
  } else {
    session = await connectViaProxy({
      root: flags.root,
      languageId,
      indexWaitMs: flags.waitMs,
      verbose: flags.verbose
    });
  }

  try {
    if (subArgFile && !values.help) {
      const absPath = resolvePathArg(subArgFile, flags);
      await session.open(absPath);
    }

    const program = new Command('lspeasy');

    // Declare global options so Commander does not reject them in pass 2
    program
      .option('--server <cmd>')
      .option('--root <dir>')
      .option('--dry-run')
      .option('--json')
      .option('--wait <ms>')
      .option('--verbose')
      .option('--allow-outside-root')
      .option('--no-proxy');

    buildCommandTree(program, session.capabilities, session, flags);

    await program.parseAsync(argv);
  } finally {
    await session.stop();
  }
}

/**
 * True when this module is the process entry point (vs. imported by a test).
 *
 * Compares resolved real paths of import.meta.url and argv[1]. The bin
 * (lspeasy) is installed as a symlink to dist/cli.js, so argv[1] is the
 * symlink path while import.meta.url is Node's realpath — a plain compare
 * would mismatch and never run main(). realpathSync on both sides makes the
 * symlinked-bin and direct-invocation cases agree.
 */
function isEntryPoint(): boolean {
  const entry = argv[1];
  if (!entry) return false;
  try {
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(entry);
  } catch {
    return false;
  }
}

if (isEntryPoint()) {
  main().catch((err) => {
    process.stderr.write(`fatal: ${err instanceof Error ? err.message : String(err)}\n`);
    exit(1);
  });
}
