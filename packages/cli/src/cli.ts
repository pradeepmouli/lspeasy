#!/usr/bin/env node
/**
 * `lspeasy` — standalone LSP-driven refactor CLI.
 *
 * Drives any LSP server that advertises rename / codeAction / willRenameFiles
 * to perform write-side refactors that read-only tooling cannot: project-wide
 * rename, file move with importer updates, and move-symbol.
 *
 * Built on `@lspeasy/client` (SDK) over the stdio transport from
 * `@lspeasy/core/node`. Arg parsing uses Node's built-in `util.parseArgs`
 * (no extra dependency).
 */

import { parseArgs } from 'node:util';
import { argv } from 'node:process';
import { fileURLToPath } from 'node:url';

import { fail, type GlobalFlags } from './io.js';
import { runRename } from './commands/rename.js';
import { runMoveFile } from './commands/move-file.js';
import { runMoveSymbol } from './commands/move-symbol.js';
import { runQuery } from './commands/query.js';

const USAGE = `lspeasy — LSP-driven refactor CLI

Usage:
  lspeasy rename <file> <line:col> <newName>        Rename a symbol project-wide
  lspeasy move-file <oldPath> <newPath>             Move a file, update importers
  lspeasy move-symbol <file> <line:col> <target>    Move a symbol into <target> file
  lspeasy query <op> <file> <line:col>              Read op: definition|references|hover

Positions are 1-based (editor style), e.g. 12:7.

Global flags:
  --server <cmd>   LSP server launch command  (default: "typescript-language-server --stdio")
  --root <dir>     Project root               (default: current working directory)
  --dry-run        Print the WorkspaceEdit / affected files; change nothing
  --apply          Apply changes to disk      (default; conflicts with --dry-run)
  --json           Emit machine-readable JSON on stdout
  --wait <ms>      Index wait before requests  (default: 15000)
  --verbose        Progress logging to stderr
  --overwrite      move-file: replace an existing destination (default: OFF)
  --allow-outside-root  Permit file-path args that resolve outside --root (default: OFF)
  -h, --help       Show this help

Relative file-path arguments are resolved against --root (NOT the current
directory), so running from an unrelated checkout cannot touch the wrong one.
Paths that resolve outside --root are refused unless --allow-outside-root.
`;

const OPTION_CONFIG = {
  server: { type: 'string' as const, default: 'typescript-language-server --stdio' },
  root: { type: 'string' as const },
  'dry-run': { type: 'boolean' as const, default: false },
  apply: { type: 'boolean' as const, default: false },
  json: { type: 'boolean' as const, default: false },
  wait: { type: 'string' as const, default: '15000' },
  verbose: { type: 'boolean' as const, default: false },
  overwrite: { type: 'boolean' as const, default: false },
  'allow-outside-root': { type: 'boolean' as const, default: false },
  help: { type: 'boolean' as const, short: 'h', default: false }
};

/** Parsed `--flag` values as `util.parseArgs` returns them for {@link OPTION_CONFIG}. */
export type ParsedOptionValues = {
  server?: string;
  root?: string;
  'dry-run'?: boolean;
  apply?: boolean;
  json?: boolean;
  wait?: string;
  verbose?: boolean;
  overwrite?: boolean;
  'allow-outside-root'?: boolean;
};

/**
 * Validate raw `--flag` values and project them onto {@link GlobalFlags}.
 *
 * Enforces two precedence rules that were previously silent footguns:
 *  - `--apply` and `--dry-run` are mutually exclusive (both default to the
 *    documented behaviour, so passing both is ambiguous → error). This is also
 *    the only place that reads `--apply`, which was declared but never consulted.
 *  - `--wait` must parse to a finite, non-negative number; otherwise a typo like
 *    `--wait abc` became `NaN`, which `setTimeout` coerces to `0`, silently
 *    skipping the index wait the refactor requests depend on.
 *
 * On a validation failure it calls {@link fail} (writes the error and exits
 * non-zero); the `never`-returning branch keeps the happy path well-typed.
 */
export function buildFlags(values: ParsedOptionValues): GlobalFlags {
  const json = values.json === true;

  if (values.apply === true && values['dry-run'] === true) {
    fail('--apply and --dry-run are mutually exclusive', json);
  }

  const waitMs = Number(values.wait ?? '15000');
  if (!Number.isFinite(waitMs) || waitMs < 0) {
    fail(`--wait must be a non-negative number of milliseconds, got "${values.wait}"`, json);
  }

  return {
    server: values.server ?? 'typescript-language-server --stdio',
    root: values.root ? values.root : process.cwd(),
    dryRun: values['dry-run'] === true,
    json,
    verbose: values.verbose === true,
    waitMs,
    allowOutsideRoot: values['allow-outside-root'] === true,
    overwrite: values.overwrite === true
  };
}

async function main(): Promise<void> {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: OPTION_CONFIG,
    allowPositionals: true
  });

  if (values.help || positionals.length === 0) {
    process.stdout.write(USAGE);
    process.exit(values.help ? 0 : 1);
  }

  const flags = buildFlags(values);

  const [command, ...rest] = positionals;

  switch (command) {
    case 'rename': {
      const [file, position, newName] = rest;
      if (!file || !position || !newName) {
        process.stderr.write('usage: lspeasy rename <file> <line:col> <newName>\n');
        process.exit(1);
      }
      await runRename({ file, position, newName }, flags);
      break;
    }
    case 'move-file': {
      const [oldPath, newPath] = rest;
      if (!oldPath || !newPath) {
        process.stderr.write('usage: lspeasy move-file <oldPath> <newPath>\n');
        process.exit(1);
      }
      await runMoveFile({ oldPath, newPath }, flags);
      break;
    }
    case 'move-symbol': {
      const [file, position, targetFile] = rest;
      if (!file || !position || !targetFile) {
        process.stderr.write('usage: lspeasy move-symbol <file> <line:col> <targetFile>\n');
        process.exit(1);
      }
      await runMoveSymbol({ file, position, targetFile }, flags);
      break;
    }
    case 'query': {
      const [op, file, position] = rest;
      if (!op || !file || !position) {
        process.stderr.write('usage: lspeasy query <op> <file> <line:col>\n');
        process.exit(1);
      }
      await runQuery({ op, file, position }, flags);
      break;
    }
    case 'help':
      process.stdout.write(USAGE);
      break;
    default:
      process.stderr.write(`unknown command: ${command}\n\n${USAGE}`);
      process.exit(1);
  }
}

/** True when this module is the process entry point (vs. imported by a test). */
function isEntryPoint(): boolean {
  const entry = argv[1];
  if (!entry) return false;
  try {
    return fileURLToPath(import.meta.url) === entry;
  } catch {
    return false;
  }
}

if (isEntryPoint()) {
  main().catch((err) => {
    process.stderr.write(`error: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
  });
}
