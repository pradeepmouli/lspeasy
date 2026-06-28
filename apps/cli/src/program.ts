import { Command } from 'commander';
import type { ServerCapabilities } from '@lspeasy/core';
import type { RefactorSession } from './session.js';
import type { GlobalFlags } from './io.js';
import { buildCommandTree } from './build-commands.js';

/**
 * Build the full Commander program with all LSP method subcommands populated.
 *
 * Uses a mock {@link ServerCapabilities} where every capability path is truthy
 * so the complete command tree is included regardless of what a live server
 * would actually advertise. Intended for static introspection by tools such as
 * `skillit gen --source cli`; action handlers close over stub values and will
 * error if invoked, so this program is not suitable for real command dispatch.
 *
 * @returns A Commander {@link Command} rooted at `lsproxy` with all known LSP
 *   method subcommands registered under their namespace (e.g. `textDocument`,
 *   `workspace`) plus the catch-all `call <method>` command.
 */
export function buildProgram(): Command {
  const program = new Command('lsproxy')
    .description('LSP-driven CLI for project-wide refactoring via any LSP server')
    .option('--server <cmd>', 'LSP server launch command (overrides lsp.json discovery)')
    .option('--root <dir>', 'Project root (default: cwd)')
    .option('--dry-run', 'Print changes; do not write')
    .option('--json', 'Machine-readable JSON on stdout; diagnostics to stderr')
    .option('--wait <ms>', 'Server index wait in ms (default: 15000)')
    .option('--verbose', 'Progress logging to stderr')
    .option('--allow-outside-root', 'Allow file paths outside --root')
    .option('--no-proxy', 'Bypass proxy daemon; connect directly to language server');

  // Proxy that returns itself for any property access so every capability
  // path resolves to a truthy object — all capability-gated method subcommands
  // are included in the tree without needing a live LSP server connection.
  const allCaps = new Proxy(
    {},
    {
      get: (_target, _prop, receiver) => receiver
    }
  ) as unknown as ServerCapabilities;

  const stubFlags: GlobalFlags = {
    server: '',
    root: process.cwd(),
    dryRun: false,
    json: false,
    verbose: false,
    waitMs: 15000,
    allowOutsideRoot: false,
    noProxy: false,
    overwrite: false
  };

  buildCommandTree(program, allCaps, null as unknown as RefactorSession, stubFlags);

  // Register the `config` command family for static introspection.
  // Actual dispatch lives in cli.ts main(); these entries are metadata-only so
  // that tools such as `skillit gen --source cli` capture the command surface.
  // `--json` is already declared as a global option on `program`.
  const config = program
    .command('config')
    .description(
      'Read/write LSP server config across platforms (lsp.json, Copilot CLI, Claude Code, Codex; VS Code is detected-but-unsupported)'
    );
  config
    .command('list')
    .description('List detected platforms and their configured servers')
    .option('--user', 'User-level config (~/.claude/lsp.json) instead of project');
  config
    .command('import <platform>')
    .description("Import a platform's LSP servers into lsp.json")
    .option('--user', 'User-level config instead of project');
  config
    .command('export <platform>')
    .description("Export lsp.json servers to a platform's native config")
    .option('--user', 'User-level config instead of project');
  config
    .command('diff <platform>')
    .description("Diff lsp.json against a platform's config")
    .option('--user', 'User-level config instead of project');

  return program;
}
