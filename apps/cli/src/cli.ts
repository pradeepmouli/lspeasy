#!/usr/bin/env node
/**
 * lspeasy CLI entry point.
 *
 * One grammar for both real dispatch and --help:
 *   lsproxy <language-or-file> <namespace> <request> [args] [flags]
 * The first positional is either a configured language id, or a file path
 * whose extension resolves the language (and which becomes the request's
 * implicit anchor file). Real dispatch (runDispatch) and --help (runHelp)
 * both resolve it the same way and build the same Commander tree; an
 * incomplete real call falls back to the same drill-down view --help shows.
 */

import { argv, exit } from 'node:process';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Command, CommanderError } from 'commander';

import { fail, resolvePathArg, type GlobalFlags } from './io.js';
import {
  buildFlags,
  registerGlobalOptions,
  GLOBAL_OPTIONS,
  type ParsedOptionValues
} from './global-options.js';
import { resolveEntry, allConfiguredServers, type EntryResolution } from './resolve.js';
import { findAnchorFile } from './anchor.js';
import { coldStatusReport } from '@lsproxy/proxy';
import { RefactorSession, CLI_VERSION } from './session.js';
import { connectViaProxy, fetchDaemonStatus } from './connect.js';
import { buildConfigCommand } from './config-command.js';
import { buildDaemonCommand } from './daemon-commands.js';
import { buildStatusCommand } from './status-command.js';
import { buildCommandTree } from './build-commands.js';
import { createFormatter } from './format.js';
import { renderTopLevel, renderDrillDownText, drillDownJson } from './help.js';

export { buildFlags, type ParsedOptionValues } from './global-options.js';

/** Raw shape Commander's `opts()` actually produces for the pass-1 scan:
 * long option names camelCased, and (for the `--no-x`-prefixed `--no-proxy`
 * option) the `no-` prefix stripped and the boolean inverted — `proxy`, not
 * `noProxy`. `version`/`help` are the plain `-V`/`-h` flags declared
 * separately on `scan`, not part of {@link ParsedOptionValues}. */
interface RawScanOpts {
  server?: string;
  root?: string;
  dryRun?: boolean;
  json?: boolean;
  wait?: string;
  verbose?: boolean;
  allowOutsideRoot?: boolean;
  proxy?: boolean;
  version?: boolean;
  help?: boolean;
}

/**
 * Pass-1 scan: parse global options plus `-V`/`-h` from raw argv via
 * Commander's `parseOptions()`, and map Commander's real `opts()` shape
 * ({@link RawScanOpts}) onto {@link ParsedOptionValues}'s hyphenated-key
 * shape that `buildFlags` (global-options.ts) expects.
 */
export function scanArgs(rawArgv: string[]): {
  positionals: string[];
  rawOpts: RawScanOpts;
  scanOpts: ParsedOptionValues;
} {
  const scan = new Command('lsproxy').allowUnknownOption(true).helpOption(false);
  registerGlobalOptions(scan);
  scan.option('-V, --version').option('-h, --help');
  const { operands, unknown } = scan.parseOptions(rawArgv);
  const positionals = [...operands, ...unknown].filter((t) => !t.startsWith('-'));
  const rawOpts = scan.opts() as RawScanOpts;
  // Spread each key in conditionally (rather than assigning possibly-`undefined`
  // values directly) so an omitted flag leaves the key absent from `scanOpts`,
  // as `exactOptionalPropertyTypes` requires for `ParsedOptionValues`'s
  // optional properties.
  const scanOpts: ParsedOptionValues = {
    ...(rawOpts.server !== undefined && { server: rawOpts.server }),
    ...(rawOpts.root !== undefined && { root: rawOpts.root }),
    ...(rawOpts.dryRun !== undefined && { 'dry-run': rawOpts.dryRun }),
    ...(rawOpts.json !== undefined && { json: rawOpts.json }),
    ...(rawOpts.wait !== undefined && { wait: rawOpts.wait }),
    ...(rawOpts.verbose !== undefined && { verbose: rawOpts.verbose }),
    ...(rawOpts.allowOutsideRoot !== undefined && {
      'allow-outside-root': rawOpts.allowOutsideRoot
    }),
    'no-proxy': rawOpts.proxy === false
  };
  return { positionals, rawOpts, scanOpts };
}

async function main(): Promise<void> {
  const { positionals, rawOpts, scanOpts } = scanArgs(argv.slice(2));

  if (rawOpts.version === true || positionals[0] === 'version') {
    process.stdout.write(`${CLI_VERSION}\n`);
    exit(0);
  }

  const flags = buildFlags(scanOpts);

  if (positionals[0] === 'config' || positionals[0] === 'daemon' || positionals[0] === 'status') {
    const color = process.stdout.isTTY === true && !process.env['NO_COLOR'] && !flags.json;
    const program = new Command('lsproxy');
    registerGlobalOptions(program);
    program.addCommand(buildConfigCommand(flags));
    program.addCommand(buildDaemonCommand(flags, createFormatter(color)));
    program.addCommand(buildStatusCommand(flags));
    await program.parseAsync(argv);
    exit(0);
  }

  if (rawOpts.help === true || positionals.length === 0) {
    await runHelp(positionals, flags);
    exit(0);
  }

  await runDispatch(positionals, flags);
}

/** `call`'s "request" is a user-supplied method string, not a second command
 * level — treat it as a 1-token drill path; every other namespace/request
 * pair is a 2-token path. Used both by runHelp's own path and by
 * runDispatch's incomplete-call fallback. */
function drillPathFor(path: string[]): string[] {
  return path[0] === 'call' ? path.slice(0, 1) : path.slice(0, 2);
}

/**
 * Resolve the CLI's first positional (language id or file) exactly as
 * runHelp and runDispatch each need it, or fail with the "not a configured
 * language or file" error. `fail` never returns, so TypeScript narrows the
 * result to non-null after the `if (!entry)` check.
 */
function resolveEntryOrFail(token: string, flags: GlobalFlags): EntryResolution {
  const entry = resolveEntry(token, flags.root, flags.server);
  if (!entry) {
    const names = allConfiguredServers(flags.root).flatMap((s) => Object.values(s.fileExtensions));
    fail(
      `"${token}" is not a configured language or a file with a recognized extension. Configured: ${[...new Set(names)].join(', ')}`,
      flags.json
    );
  }
  return entry;
}

/**
 * Recursively apply `exitOverride()` to `cmd` and every descendant.
 *
 * Commander's `exitOverride()` only sets the *current* Command's own
 * `_exitCallback`; it is copied onto children created via `.command()` (the
 * factory method), but NOT onto commands attached via `.addCommand()` —
 * which is how `buildCommandTree` wires up every namespace/leaf command.
 * Without this, a leaf command's own error (e.g. a missing required
 * argument) calls `process.exit()` directly instead of throwing a
 * `CommanderError` — verified against Commander 15's source
 * (`Command.addCommand` vs `Command.command`/`copyInheritedSettings`).
 */
function applyExitOverride(cmd: Command): void {
  cmd.exitOverride();
  for (const sub of cmd.commands) applyExitOverride(sub);
}

/** Long-flag names (e.g. `--server`, `--root`, `--wait`) that consume a
 * following value, derived from {@link GLOBAL_OPTIONS} so this can't drift
 * out of sync with the actual option definitions. An entry's `flags` string
 * contains `<...>` iff it takes a value (e.g. `'--server <cmd>'`); boolean
 * flags (e.g. `'--dry-run'`) don't. None of these entries have a short-flag
 * alias, so splitting on the first space is enough to get the long name. */
const VALUE_TAKING_FLAGS = new Set(
  GLOBAL_OPTIONS.filter((o) => o.flags.includes('<')).map((o) => o.flags.split(' ')[0])
);

/**
 * Find the index of `token` in `args` that is the actual positional, not the
 * VALUE of a preceding value-taking global option that happens to equal
 * `token` (e.g. `--root src/foo.ts src/foo.ts textDocument hover`, where
 * `--root`'s value and the language/file positional are the same string).
 * Scans left to right and skips any occurrence immediately preceded by a
 * value-taking flag name.
 */
function findPositionalIndex(args: string[], token: string): number {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === token && !(i > 0 && VALUE_TAKING_FLAGS.has(args[i - 1]!))) return i;
  }
  return -1;
}

/**
 * Help-mode dispatch. `positionals` after the language-or-file token mean
 * [namespace, request, ...]. Depth 0 (no token at all) -> top-level language
 * listing; otherwise resolve the token (language id or file), connect to
 * that server with indexWaitMs 0, and render the capability-filtered
 * command tree at the requested depth.
 */
export async function runHelp(positionals: string[], flags: GlobalFlags): Promise<void> {
  const [token, ...drillPathRaw] = positionals;

  if (!token) {
    const live = await fetchDaemonStatus(flags.root);
    const report = live ?? coldStatusReport(allConfiguredServers(flags.root));
    if (flags.json) {
      process.stdout.write(JSON.stringify(report) + '\n');
    } else {
      const color = process.stdout.isTTY === true && !process.env['NO_COLOR'];
      process.stdout.write(renderTopLevel(report, createFormatter(color)));
    }
    return;
  }

  const entry = resolveEntryOrFail(token, flags);

  const direct = flags.noProxy || !!flags.server || entry.fromPlatform;
  let session: RefactorSession;
  try {
    session = direct
      ? new RefactorSession({
          serverCommand: entry.serverCommand,
          languageId: entry.languageId,
          root: flags.root,
          indexWaitMs: 0,
          verbose: flags.verbose
        })
      : await connectViaProxy({
          root: flags.root,
          languageId: entry.languageId,
          indexWaitMs: 0,
          verbose: flags.verbose
        });
    if (direct) await session.start();
  } catch (err) {
    fail(
      `Failed to start "${token}" language server: ${err instanceof Error ? err.message : String(err)}`,
      flags.json
    );
  }

  try {
    const program = new Command('lsproxy');
    registerGlobalOptions(program);
    buildCommandTree(program, session.capabilities, session, flags, entry.anchorFile);
    const drillPath = drillPathFor(drillPathRaw);
    if (flags.json) {
      const jsonResult = drillDownJson(program, entry.languageId, drillPath) as { ok?: boolean };
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
 * Real dispatch for a complete-or-incomplete command:
 * `<language-or-file> <namespace> <request> [args] [flags]`. Resolves the
 * same way runHelp does, connects with a real indexWaitMs (this may execute
 * a request), and attempts the Commander parse. A missing required argument
 * (e.g. the file/position `textDocument hover` needs) falls back to the same
 * drill-down view `--help` would show for that path, instead of Commander's
 * raw error — any other Commander error propagates normally.
 */
export async function runDispatch(positionals: string[], flags: GlobalFlags): Promise<void> {
  const token = positionals[0]!;
  const entry = resolveEntryOrFail(token, flags);

  const path = positionals.slice(1);
  if (path.length < 2) {
    await runHelp(positionals, flags);
    return;
  }

  const namespace = path[0]!;
  const request = path[1]!;
  const trailingArgs = path.slice(2);
  const method = namespace === 'call' ? undefined : `${namespace}/${request}`;
  const openAnchor = entry.anchorFile ?? findAnchorFile(method, trailingArgs);

  const direct = flags.noProxy || !!flags.server || entry.fromPlatform;
  let session: RefactorSession;
  if (direct) {
    session = new RefactorSession({
      serverCommand: entry.serverCommand,
      languageId: entry.languageId,
      root: flags.root,
      indexWaitMs: flags.waitMs,
      verbose: flags.verbose
    });
    await session.start();
  } else {
    session = await connectViaProxy({
      root: flags.root,
      languageId: entry.languageId,
      indexWaitMs: flags.waitMs,
      verbose: flags.verbose
    });
  }

  try {
    if (openAnchor) {
      await session.open(resolvePathArg(openAnchor, flags));
    }

    const program = new Command('lsproxy').exitOverride();
    registerGlobalOptions(program);
    buildCommandTree(program, session.capabilities, session, flags, entry.anchorFile);
    // `exitOverride()` only sets `program`'s own `_exitCallback` — Commander
    // copies it onto children created via `.command()`, but buildCommandTree
    // wires up namespace/leaf commands with `.addCommand()`, which does not
    // copy inherited settings. Without propagating it explicitly, a leaf
    // command's own missing-argument error (thrown deep in the tree, e.g.
    // `textDocument hover`) would call `process.exit()` directly instead of
    // throwing the CommanderError this function needs to catch below.
    applyExitOverride(program);

    const rawArgs = argv.slice(2);
    // Find the language/file positional itself, not a preceding global
    // option's VALUE that happens to equal `token` (see findPositionalIndex).
    const tokenIdx = findPositionalIndex(rawArgs, token);
    const pass2Args =
      tokenIdx === -1 ? rawArgs : [...rawArgs.slice(0, tokenIdx), ...rawArgs.slice(tokenIdx + 1)];

    try {
      await program.parseAsync(pass2Args, { from: 'user' });
    } catch (err) {
      if (err instanceof CommanderError && err.code === 'commander.missingArgument') {
        const drillPath = drillPathFor([namespace, request]);
        if (flags.json) {
          process.stdout.write(
            JSON.stringify(drillDownJson(program, entry.languageId, drillPath)) + '\n'
          );
        } else {
          const color = process.stdout.isTTY === true && !process.env['NO_COLOR'];
          const { text } = renderDrillDownText(program, drillPath, createFormatter(color));
          process.stdout.write(text.endsWith('\n') ? text : text + '\n');
        }
        return;
      }
      throw err;
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
