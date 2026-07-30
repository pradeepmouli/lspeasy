import { Command } from 'commander';
import {
  configList,
  configImport,
  configExport,
  configDiff,
  type ConfigFlags
} from './config/commands.js';
import { createFormatter } from './format.js';
import type { GlobalFlags } from './io.js';

function toConfigFlags(flags: GlobalFlags, opts: { user?: boolean }): ConfigFlags {
  return { json: flags.json, root: flags.root, scope: opts.user ? 'user' : 'project' };
}

function fmtFor(flags: GlobalFlags) {
  const color = process.stdout.isTTY === true && !process.env['NO_COLOR'] && !flags.json;
  return createFormatter(color);
}

/** Real Commander command tree for `lsproxy config <list|import|export|diff>`,
 * built and dispatched before any LSP session connects. */
export function buildConfigCommand(flags: GlobalFlags): Command {
  const config = new Command('config').description(
    'Read/write LSP server config across platforms (lsp.json, Copilot CLI, Claude Code, Codex; VS Code is detected-but-unsupported)'
  );

  config
    .command('list')
    .description('List detected platforms and their configured servers')
    .option('--user', 'User-level config (~/.claude/lsp.json) instead of project')
    .action((opts: { user?: boolean }) => configList(toConfigFlags(flags, opts), fmtFor(flags)));

  config
    .command('import <platform>')
    .description("Import a platform's LSP servers into lsp.json")
    .option('--user', 'User-level config instead of project')
    .action((platform: string, opts: { user?: boolean }) =>
      configImport(platform, toConfigFlags(flags, opts), fmtFor(flags))
    );

  config
    .command('export <platform>')
    .description("Export lsp.json servers to a platform's native config")
    .option('--user', 'User-level config instead of project')
    .action((platform: string, opts: { user?: boolean }) =>
      configExport(platform, toConfigFlags(flags, opts), fmtFor(flags))
    );

  config
    .command('diff <platform>')
    .description("Diff lsp.json against a platform's config")
    .option('--user', 'User-level config instead of project')
    .action((platform: string, opts: { user?: boolean }) =>
      configDiff(platform, toConfigFlags(flags, opts), fmtFor(flags))
    );

  return config;
}
