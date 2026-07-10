import type { Command } from 'commander';
import { fail, type GlobalFlags } from './io.js';

/** Single source of truth for the CLI's global flags — consumed by pass-1
 * parsing, every Commander program (`main()`, `config`/`daemon`, `runHelp`),
 * and every help surface (top-level view + leaf-command footer), so they
 * cannot drift out of sync with each other again. */
export const GLOBAL_OPTIONS: ReadonlyArray<{ flags: string; description: string }> = [
  {
    flags: '--server <cmd>',
    description: 'LSP server launch command (bypasses lsp.json discovery)'
  },
  { flags: '--root <dir>', description: 'project root (default: cwd)' },
  { flags: '--dry-run', description: 'preview edits without writing to disk' },
  { flags: '--json', description: 'machine-readable output; diagnostics still go to stderr' },
  { flags: '--wait <ms>', description: 'index wait time in ms (default: 15000)' },
  { flags: '--verbose', description: 'progress logging to stderr' },
  { flags: '--allow-outside-root', description: 'allow file paths outside --root' },
  { flags: '--no-proxy', description: 'bypass the daemon; connect directly to the language server' }
];

export function registerGlobalOptions(cmd: Command): Command {
  for (const { flags, description } of GLOBAL_OPTIONS) cmd.option(flags, description);
  return cmd;
}

/** Rendered once here and reused verbatim by `renderTopLevel` (help.ts) and
 * every leaf/`call` command's help footer (build-commands.ts). */
export function globalOptionsHelpText(): string {
  const width = Math.max(...GLOBAL_OPTIONS.map((o) => o.flags.length));
  const lines = GLOBAL_OPTIONS.map((o) => `  ${o.flags.padEnd(width)}  ${o.description}`);
  return ['Global options:', ...lines].join('\n');
}

/** Parsed raw flag values from Commander's pass-1 `parseOptions()` scan. */
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
