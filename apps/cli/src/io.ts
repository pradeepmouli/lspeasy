/**
 * Shared CLI I/O helpers.
 *
 * Convention: **stdout is reserved for command output** (human summary or, with
 * `--json`, a single JSON document). All progress/diagnostic chatter goes to
 * **stderr** so piped `--json` consumers get clean input.
 */

import { existsSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path';

import type { AppliedChange } from './apply.js';

export interface GlobalFlags {
  server: string;
  root: string;
  dryRun: boolean;
  json: boolean;
  verbose: boolean;
  waitMs: number;
  allowOutsideRoot: boolean;
  /** Permit move-file to replace an existing destination (default: OFF). */
  overwrite: boolean;
  /** Bypass the proxy daemon and connect directly to the language server. */
  noProxy: boolean;
}

/**
 * Resolve a path's longest EXISTING ancestor through `realpath`, then rejoin the
 * non-existing tail. This makes containment checks symlink-aware even for
 * destinations that do not exist yet (e.g. a move target): if any existing
 * ancestor is a symlink escaping `--root`, the canonical path reflects it, while
 * a not-yet-created leaf cannot be `realpath`'d directly (it would throw).
 *
 * Walks up to a fixed-point so a chain like `root/link -> /tmp/ext` + `ext/sub`
 * is fully canonicalized via the first existing ancestor.
 */
function canonicalize(absPath: string): string {
  let existing = absPath;
  const tail: string[] = [];
  while (!existsSync(existing)) {
    const parent = dirname(existing);
    if (parent === existing) break; // reached filesystem root
    tail.unshift(existing.slice(parent.length + 1));
    existing = parent;
  }
  try {
    const real = realpathSync(existing);
    return tail.length ? resolve(real, ...tail) : real;
  } catch {
    // realpath can still fail on permission errors; fall back to the lexical path.
    return absPath;
  }
}

/**
 * Test whether an absolute path is contained within `root`, resolving symlinks
 * in both the candidate and the root before comparing. A lexical-only check
 * accepts `root/link/x` where `root/link -> /tmp/external`; canonicalizing the
 * existing ancestors closes that escape.
 */
export function isInsideRoot(absPath: string, root: string): boolean {
  const realRoot = canonicalize(resolve(root));
  const realPath = canonicalize(absPath);
  return realPath === realRoot || realPath.startsWith(realRoot + sep);
}

/**
 * Resolve a file-path argument against the project `--root` and enforce that it
 * stays inside that root.
 *
 * This is the single base both the server (spawn cwd / `rootUri`) and the file
 * arguments share — they MUST agree. Relative args are resolved against `root`
 * (NOT `process.cwd()`), so running the CLI from an unrelated directory (e.g. a
 * different git worktree of the same project) cannot silently operate on the
 * wrong checkout. Absolute args are used as-is.
 *
 * Unless `allowOutsideRoot` is set, any resolved path outside `root` is rejected
 * (error + non-zero exit, no changes) — defense-in-depth against the wrong-repo
 * incident relative-cwd resolution caused. Containment is symlink-aware (see
 * {@link isInsideRoot}).
 */
export function resolvePathArg(
  arg: string,
  flags: Pick<GlobalFlags, 'root' | 'json' | 'allowOutsideRoot'>
): string {
  const root = resolve(flags.root);
  const abs = isAbsolute(arg) ? resolve(arg) : resolve(root, arg);
  if (!flags.allowOutsideRoot && !isInsideRoot(abs, root)) {
    fail(`refusing: ${abs} is outside --root ${root}`, flags.json);
  }
  return abs;
}

/**
 * Refuse a SERVER-RETURNED set of edit/resource targets that escape `--root`.
 *
 * The input-path guard ({@link resolvePathArg}) only validates CLI arguments;
 * a language server can return a {@link WorkspaceEdit} whose URIs/resource ops
 * point outside the project. Applying that unguarded would let a server
 * modify, rename, or delete an external file — bypassing the `--root` safety
 * guarantee. Every command routes server edits through this pre-flight check
 * (via `apply.ts`), so all three inherit the boundary.
 *
 * Throws (rather than `fail()`/exit) so it composes inside the apply pipeline
 * and is unit-testable; callers surface the message verbatim.
 */
export function assertTargetsInsideRoot(
  targets: readonly string[],
  flags: Pick<GlobalFlags, 'root' | 'allowOutsideRoot'>
): void {
  if (flags.allowOutsideRoot) return;
  const root = resolve(flags.root);
  for (const abs of targets) {
    if (!isInsideRoot(abs, root)) {
      throw new Error(
        `refusing server edit: ${abs} is outside --root ${root} (pass --allow-outside-root to permit)`
      );
    }
  }
}

/** Editor-style 1-based `line:col`. */
export interface OneBasedPosition {
  line: number;
  character: number;
}

/** Parse `line:col` (1-based, editor style) into a 1-based position. */
export function parseLineCol(input: string): OneBasedPosition {
  const m = /^(\d+):(\d+)$/.exec(input.trim());
  if (!m) throw new Error(`Invalid position "${input}" — expected line:col (1-based), e.g. 12:7`);
  const line = Number(m[1]);
  const character = Number(m[2]);
  if (line < 1 || character < 1) throw new Error(`Position is 1-based; got "${input}"`);
  return { line, character };
}

/** Convert a 1-based editor position to the 0-based position LSP expects. */
export function toLspPosition(p: OneBasedPosition): { line: number; character: number } {
  return { line: p.line - 1, character: p.character - 1 };
}

export function fail(message: string, json: boolean): never {
  if (json) process.stdout.write(JSON.stringify({ ok: false, error: message }) + '\n');
  else process.stderr.write(`error: ${message}\n`);
  process.exit(1);
}

/** Render a list of applied/planned changes for human output. */
export function summarizeChanges(changes: AppliedChange[], root: string, dryRun: boolean): string {
  // Use path.relative so the root prefix is stripped with the platform
  // separator (a hardcoded '/' left Windows paths un-shortened). Fall back to
  // the absolute path for anything that resolves outside root.
  const resolvedRoot = resolve(root);
  const rel = (p: string) => relative(resolvedRoot, p) || p;
  const lines: string[] = [];
  const verb = dryRun ? 'would change' : 'changed';
  const totalEdits = changes.reduce((n, c) => n + (c.editCount ?? 0), 0);
  lines.push(
    `${dryRun ? '[dry-run] ' : ''}${changes.length} file(s) ${verb}, ${totalEdits} text edit(s)`
  );
  for (const c of changes) {
    if (c.kind === 'edit') lines.push(`  edit   ${c.editCount}\t${rel(c.path)}`);
    else if (c.kind === 'create') lines.push(`  create  \t${rel(c.path)}`);
    else if (c.kind === 'delete') lines.push(`  delete  \t${rel(c.path)}`);
    else if (c.kind === 'rename')
      lines.push(`  rename  \t${rel(c.path)} -> ${rel(c.toPath ?? '')}`);
  }
  return lines.join('\n');
}

/** Emit the result, either as JSON (stdout) or a human summary. */
export function emitResult(
  op: string,
  changes: AppliedChange[],
  flags: Pick<GlobalFlags, 'json' | 'root' | 'dryRun'>,
  extra: Record<string, unknown> = {}
): void {
  if (flags.json) {
    process.stdout.write(
      JSON.stringify({ ok: true, op, dryRun: flags.dryRun, changes, ...extra }) + '\n'
    );
  } else {
    process.stdout.write(summarizeChanges(changes, flags.root, flags.dryRun) + '\n');
  }
}
