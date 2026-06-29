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
import {
  configList,
  configImport,
  configExport,
  configDiff,
  type ConfigFlags
} from './config/commands.js';
import { discoverServer, discoverServers, discoverServerByLanguageId } from '@lspeasy/core';
import { coldStatusReport } from '@lsproxy/proxy';
import { RefactorSession, CLI_VERSION } from './session.js';
import { connectViaProxy, fetchDaemonStatus } from './connect.js';
import { runDaemon } from './daemon-commands.js';
import { buildCommandTree } from './build-commands.js';
import { createFormatter } from './format.js';
import { renderTopLevel, renderDrillDownText, drillDownJson } from './help.js';

const GLOBAL_OPTION_CONFIG = {
  server: { type: 'string' as const },
  root: { type: 'string' as const },
  'dry-run': { type: 'boolean' as const, default: false },
  json: { type: 'boolean' as const, default: false },
  wait: { type: 'string' as const, default: '15000' },
  verbose: { type: 'boolean' as const, default: false },
  'allow-outside-root': { type: 'boolean' as const, default: false },
  'no-proxy': { type: 'boolean' as const, default: false },
  user: { type: 'boolean' as const, default: false },
  version: { type: 'boolean' as const, short: 'V', default: false },
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

  // `--version` / `-V` / `version` print the bare version and exit — handled
  // before help/dispatch so it works with or without positionals and never
  // touches the daemon.
  if (values.version === true || positionals[0] === 'version') {
    process.stdout.write(`${CLI_VERSION}\n`);
    exit(0);
  }

  const helpMode = values.help === true;
  if (helpMode || positionals.length === 0) {
    await runHelp(positionals, buildFlags(values as ParsedOptionValues));
    exit(0);
  }

  const flags = buildFlags(values as ParsedOptionValues);

  if (positionals[0] === 'config') {
    const sub = positionals[1];
    const platform = positionals[2];
    const scope: ConfigFlags['scope'] = (values as Record<string, unknown>)['user']
      ? 'user'
      : 'project';
    const cfg: ConfigFlags = { json: flags.json, root: flags.root, scope };
    const color = process.stdout.isTTY === true && !process.env['NO_COLOR'] && !flags.json;
    const fmt = createFormatter(color);
    if (sub === 'list') configList(cfg, fmt);
    else if (sub === 'import' && platform) configImport(platform, cfg, fmt);
    else if (sub === 'export' && platform) configExport(platform, cfg, fmt);
    else if (sub === 'diff' && platform) configDiff(platform, cfg, fmt);
    else {
      process.stderr.write(
        'usage: lsproxy config <list|import|export|diff> [platform] [--user] [--json]\n'
      );
      exit(1);
    }
    exit(0);
  }

  if (positionals[0] === 'daemon') {
    const color = process.stdout.isTTY === true && !process.env['NO_COLOR'] && !flags.json;
    await runDaemon(positionals[1], flags, createFormatter(color));
    exit(0);
  }

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

  // Some methods carry their file in `--params` rather than a positional, so the
  // file-detection above skips them. Without an anchor file the session never
  // opens a document, the TS server loads no program, and the request fails
  // (rename edits come back empty; refactors throw "No Project"); the languageId
  // also stays 'plaintext' so even a didOpen wouldn't register as TS. Mine the
  // --params JSON (parseArgs leaves it in positionals, or in values when given as
  // --params=...) for a file to anchor on:
  //   • workspace/willRename|willCreate|willDeleteFiles → `files[].oldUri|uri`
  //   • any textDocument/* raw call            → `textDocument.uri`
  //   • workspace/executeCommand refactors     → `arguments[0].file` (a plain
  //     path, e.g. _typescript.applyRefactoring's "Move to file") — opening it
  //     loads the whole tsconfig program, so the move's target file is in scope.
  const anchorFromParams = (): string | undefined => {
    const candidates = [...positionals];
    const paramsVal = (values as Record<string, unknown>)['params'];
    if (typeof paramsVal === 'string') candidates.push(paramsVal);
    for (const c of candidates) {
      if (!c.startsWith('{')) continue;
      try {
        const o = JSON.parse(c) as {
          files?: Array<{ oldUri?: string; uri?: string }>;
          textDocument?: { uri?: string };
          arguments?: Array<{ file?: string }>;
        };
        const uri = o.files?.[0]?.oldUri ?? o.files?.[0]?.uri ?? o.textDocument?.uri;
        if (typeof uri === 'string') return fileURLToPath(uri);
        const cmdFile = o.arguments?.[0]?.file;
        if (typeof cmdFile === 'string') return cmdFile;
      } catch {
        /* not the params JSON — keep scanning */
      }
    }
    return undefined;
  };
  const anchorFile = subArgFile ?? anchorFromParams();

  if (flags.server) {
    serverCommand = flags.server;
    // Infer languageId from the file extension when --server bypasses discovery.
    if (anchorFile) {
      const ext = extname(anchorFile);
      const discovered = discoverServer(flags.root, ext);
      if (discovered) languageId = discovered.languageId;
    }
  } else {
    const ext = anchorFile ? extname(anchorFile) : '';

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
    if (anchorFile && !values.help) {
      const absPath = resolvePathArg(anchorFile, flags);
      await session.open(absPath);
    }

    const program = new Command('lsproxy');

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
 * Help-mode dispatch. Positionals after `--help` mean [language, namespace,
 * request]. Depth 0 -> top-level language listing (config + live status);
 * depth >= 1 -> connect to that language's server with indexWaitMs 0 and render
 * the capability-filtered command tree at the requested level.
 */
export async function runHelp(positionals: string[], flags: GlobalFlags): Promise<void> {
  const [language, ...drillPath] = positionals;

  if (!language) {
    const live = await fetchDaemonStatus(flags.root);
    const report = live ?? coldStatusReport(discoverServers(flags.root));
    if (flags.json) {
      process.stdout.write(JSON.stringify(report) + '\n');
    } else {
      const color = process.stdout.isTTY === true && !process.env['NO_COLOR'];
      process.stdout.write(renderTopLevel(report, createFormatter(color)));
    }
    return;
  }

  const discovered = flags.server
    ? { serverCommand: flags.server, languageId: language }
    : discoverServerByLanguageId(flags.root, language);
  if (!discovered) {
    const names = discoverServers(flags.root).flatMap((s) => Object.values(s.fileExtensions));
    fail(
      `No server configured for language "${language}". Configured: ${[...new Set(names)].join(', ')}`,
      flags.json
    );
  }

  // Connecting (spawn + initialize) can fail when the server command is missing
  // or crashes. In --json mode that failure must still produce a parseable
  // { ok: false, error } on stdout, not a fatal text error from main().catch.
  let session: RefactorSession;
  try {
    session =
      flags.noProxy || flags.server
        ? new RefactorSession({
            serverCommand: discovered.serverCommand,
            languageId: discovered.languageId,
            root: flags.root,
            indexWaitMs: 0,
            verbose: flags.verbose
          })
        : await connectViaProxy({
            root: flags.root,
            languageId: discovered.languageId,
            indexWaitMs: 0,
            verbose: flags.verbose
          });
    if (flags.noProxy || flags.server) await session.start();
  } catch (err) {
    // fail() emits { ok: false, error } on stdout for --json (and "error: …" on
    // stderr otherwise), then exits 1 — the same machine-readable error contract
    // as the unconfigured-language path and the `call` command.
    fail(
      `Failed to start "${language}" language server: ${
        err instanceof Error ? err.message : String(err)
      }`,
      flags.json
    );
  }

  try {
    const program = new Command('lsproxy');
    buildCommandTree(program, session.capabilities, session, flags);
    if (flags.json) {
      const jsonResult = drillDownJson(program, language, drillPath) as { ok?: boolean };
      process.stdout.write(JSON.stringify(jsonResult) + '\n');
      if (jsonResult.ok === false) {
        await session.stop();
        exit(1);
      }
    } else {
      const color = process.stdout.isTTY === true && !process.env['NO_COLOR'];
      const { ok, text } = renderDrillDownText(program, drillPath, createFormatter(color));
      process.stdout.write(text.endsWith('\n') ? text : text + '\n');
      if (!ok) {
        await session.stop();
        exit(1);
      }
    }
  } finally {
    await session.stop();
  }
}

/**
 * True when this module is the process entry point (vs. imported by a test).
 *
 * Compares resolved real paths of import.meta.url and argv[1]. The bin
 * (lsproxy) is installed as a symlink to dist/cli.js, so argv[1] is the
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
