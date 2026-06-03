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
import { discoverServer } from './discover.js';
import { RefactorSession } from './session.js';
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

  if (flags.server) {
    serverCommand = flags.server;
  } else {
    const fileArg = positionals.find((p) => extname(p) !== '');
    const ext = fileArg ? extname(fileArg) : '';

    if (!ext) {
      fail('Cannot determine language: pass a file argument or use --server <cmd>.', flags.json);
    }

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

  const session = new RefactorSession({
    serverCommand,
    languageId,
    root: flags.root,
    indexWaitMs: flags.waitMs,
    verbose: flags.verbose
  });

  try {
    await session.start();

    const fileArg = positionals.find((p) => extname(p) !== '');
    if (fileArg && !values.help) {
      const absPath = resolvePathArg(fileArg, flags);
      await session.openAndWait(absPath);
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
      .option('--allow-outside-root');

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
