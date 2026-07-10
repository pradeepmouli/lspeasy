import { Command } from 'commander';
import type { ServerCapabilities } from '@lspeasy/core';
import type { RefactorSession } from './session.js';
import type { GlobalFlags } from './io.js';
import { buildCommandTree } from './build-commands.js';
import { buildConfigCommand } from './config-command.js';
import { buildDaemonCommand } from './daemon-commands.js';
import { createFormatter } from './format.js';

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

  // Registered via the same builders cli.ts uses for real dispatch, so this
  // metadata-only tree can never drift from the actual command surface.
  program.addCommand(buildConfigCommand(stubFlags));
  program.addCommand(buildDaemonCommand(stubFlags, createFormatter(false)));

  return program;
}
