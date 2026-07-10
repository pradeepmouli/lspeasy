# CLI Commander Unification + Grammar Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `apps/cli`'s `node:util parseArgs` pre-scan with Commander's own `parseOptions`, turn `config`/`daemon` into real Commander command trees, and unify real dispatch with `--help` around one grammar (`lsproxy <language-or-file> <namespace> <request> [args] [flags]`) so an incomplete real command shows the same drill-down view `--help` would.

**Architecture:** A shared `global-options.ts` module is the single source of truth for global flags (used by pass-1 parsing, both dispatch programs, and every help surface). A new `resolveEntry()` resolves the first positional as either a configured language id or a file (whose extension resolves the language and which becomes the request's implicit anchor). `runHelp()` and a new `runDispatch()` both build the same Commander tree from that resolution; `runDispatch()` attempts real execution and falls back to the same drill-down renderer `runHelp()` uses when Commander reports a missing required argument. `config`/`daemon` become real Commander command trees (`config-command.ts`, and additions to `daemon-commands.ts`) shared between real dispatch (`cli.ts`) and the existing metadata-only introspection tree (`program.ts`), eliminating a pre-existing duplicate definition of those commands that was the direct cause of the help/behavior drift.

**Tech Stack:** TypeScript 5 strict, Commander 15, Zod, Vitest, oxlint/oxfmt (pnpm workspace `@lsproxy/cli`).

## Global Constraints

- TypeScript strict mode, no `any` in new code.
- Follow existing code style: named exports, no default exports, JSDoc only where the *why* is non-obvious (matches existing `apps/cli/src` files).
- This is a breaking CLI syntax change (spec: `docs/superpowers/specs/2026-07-06-cli-commander-unification-design.md`) — no dual-mode/back-compat parsing.
- Every task must leave `pnpm exec vitest run apps/cli/src`, `pnpm --filter @lsproxy/cli run type-check`, and `pnpm exec oxlint apps/cli` green before moving on.
- Run every `pnpm exec vitest ...`/`pnpm exec oxlint ...` command from the **repo root**, not from inside `apps/cli` — vitest's include globs are defined in the root `vitest.config.ts` and only resolve correctly against root-relative paths (e.g. `apps/cli/src/foo.test.ts`); running from inside `apps/cli` with a `src/...`-relative path silently reports "No test files found". `pnpm --filter @lsproxy/cli run <script>` commands (`type-check`, `build`, `skill:gen`) are fine to run from anywhere — they're real scripts in that package's `package.json`. There is no `test`/`lint` script in `apps/cli/package.json`; those only exist at the repo root, which is why the commands above use `pnpm exec` with an explicit `apps/cli/...` path instead.
- `apps/proxy/src/main.ts` is out of scope — do not touch it.

---

## File Structure

| File | Responsibility |
|---|---|
| `apps/cli/src/global-options.ts` (new) | Single source of truth for global flag metadata; `registerGlobalOptions`, `globalOptionsHelpText`, `buildFlags`, `ParsedOptionValues` (moved from `cli.ts`) |
| `apps/cli/src/resolve.ts` (modify) | Add `resolveEntry()` — resolves the first positional to a language-or-file; add `allConfiguredServersWithSource()`/`SourcedServer` — config-source tracking for `status` |
| `apps/cli/src/anchor.ts` (new) | `findAnchorFile()` — best-effort file-to-open detection, generalized from today's inline `cli.ts` logic |
| `apps/cli/src/zod-to-commander.ts` (modify) | `zodToCommander`/`marshalParams` accept an optional pre-resolved `anchorFile` |
| `apps/cli/src/build-commands.ts` (modify) | Thread `anchorFile` through; add the global-options help footer to every leaf/`call` command |
| `apps/cli/src/config-command.ts` (new) | `buildConfigCommand()` — real Commander tree wrapping `config/commands.ts` |
| `apps/cli/src/daemon-commands.ts` (modify) | Add `buildDaemonCommand()` alongside the existing `runDaemon()` |
| `apps/cli/src/program.ts` (modify) | Reuse `buildConfigCommand`/`buildDaemonCommand` instead of a hand-rolled duplicate metadata tree |
| `apps/cli/src/help.ts` (modify) | `renderTopLevel`'s Usage/Explore/Global-options sections reflect the unified grammar; add `renderStatus`, grouped by server |
| `apps/cli/src/resolve-binary.ts` (new) | `resolveBinaryPath()` — `$PATH`/`$PATHEXT`-aware executable resolution, `which`-style |
| `apps/cli/src/server-groups.ts` (new) | `groupServerStatus()` — re-projects per-language `StatusReport.languages` into one entry per server process |
| `apps/cli/src/status-command.ts` (new) | `buildStatusCommand()` — real Commander `status` command wiring resolution + grouping + rendering together |
| `apps/cli/src/cli.ts` (modify) | Pass-1 via `parseOptions`; `runHelp`/new `runDispatch` share `resolveEntry`; `config`/`daemon`/`status` routed to their command trees |
| `apps/cli/README.md` (modify) | Examples/usage updated to the unified grammar; document `status` |

---

## Task 1: Shared global-option registry

**Files:**
- Create: `apps/cli/src/global-options.ts`
- Create: `apps/cli/src/global-options.test.ts`
- Modify: `apps/cli/src/cli.ts:36-86` (remove `GLOBAL_OPTION_CONFIG`, `ParsedOptionValues`, `buildFlags`; re-export `buildFlags`)

**Interfaces:**
- Produces: `GLOBAL_OPTIONS: ReadonlyArray<{flags: string; description: string}>`, `registerGlobalOptions(cmd: Command): Command`, `globalOptionsHelpText(): string`, `ParsedOptionValues` type, `buildFlags(values: ParsedOptionValues): GlobalFlags`

- [ ] **Step 1: Write the failing test**

```ts
// apps/cli/src/global-options.test.ts
import { describe, it, expect, vi } from 'vitest';
import { Command } from 'commander';
import {
  GLOBAL_OPTIONS,
  registerGlobalOptions,
  globalOptionsHelpText,
  buildFlags
} from './global-options.js';

describe('registerGlobalOptions', () => {
  it('registers every entry in GLOBAL_OPTIONS on the command', () => {
    const cmd = new Command('x');
    registerGlobalOptions(cmd);
    for (const { flags } of GLOBAL_OPTIONS) {
      const long = flags.split(/[ ,]+/).find((t) => t.startsWith('--'));
      expect(cmd.options.some((o) => o.long === long)).toBe(true);
    }
  });
});

describe('globalOptionsHelpText', () => {
  it('mentions every flag exactly once, in a "Global options:" block', () => {
    const text = globalOptionsHelpText();
    expect(text).toMatch(/^Global options:/);
    for (const { flags } of GLOBAL_OPTIONS) {
      const long = flags.split(/[ ,]+/).find((t) => t.startsWith('--'))!;
      expect(text).toContain(long);
    }
  });
});

describe('buildFlags', () => {
  it('defaults --wait to 15000 and applies the documented defaults', () => {
    const flags = buildFlags({ root: '/repo' });
    expect(flags.waitMs).toBe(15000);
    expect(flags.dryRun).toBe(false);
    expect(flags.overwrite).toBe(false);
    expect(flags.allowOutsideRoot).toBe(false);
    expect(flags.server).toBe('');
  });

  it('rejects a non-numeric --wait', () => {
    vi.spyOn(process, 'exit').mockImplementation(((): never => {
      throw new Error('exit');
    }) as never);
    const errs: string[] = [];
    vi.spyOn(process.stderr, 'write').mockImplementation(((s: string) => {
      errs.push(s);
      return true;
    }) as never);
    expect(() => buildFlags({ root: '/repo', wait: 'abc' })).toThrow('exit');
    expect(errs.join('')).toMatch(/--wait must be a non-negative number/);
    vi.restoreAllMocks();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/global-options.test.ts`
Expected: FAIL — `Cannot find module './global-options.js'`

- [ ] **Step 3: Write the implementation**

```ts
// apps/cli/src/global-options.ts
import type { Command } from 'commander';
import { fail, type GlobalFlags } from './io.js';

/** Single source of truth for the CLI's global flags — consumed by pass-1
 * parsing, every Commander program (`main()`, `config`/`daemon`, `runHelp`),
 * and every help surface (top-level view + leaf-command footer), so they
 * cannot drift out of sync with each other again. */
export const GLOBAL_OPTIONS: ReadonlyArray<{ flags: string; description: string }> = [
  { flags: '--server <cmd>', description: 'LSP server launch command (bypasses lsp.json discovery)' },
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
```

- [ ] **Step 4: Remove the old definitions from `cli.ts` and re-export**

In `apps/cli/src/cli.ts`, delete `GLOBAL_OPTION_CONFIG`, the `ParsedOptionValues` type, and the `buildFlags` function (current lines ~36-86). Leave the `import { parseArgs } from 'node:util';` line and its call site in `main()` untouched for now — Task 10 replaces all of `main()`, including that import, in one pass. For this step, just remove the three deleted symbols and add:

```ts
export { buildFlags, type ParsedOptionValues } from './global-options.js';
```

Place this re-export where `buildFlags` used to be defined, so `cli.test.ts`'s `import { buildFlags, runHelp } from './cli.js'` keeps working unchanged.

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm exec vitest run apps/cli/src/global-options.test.ts apps/cli/src/cli.test.ts`
Expected: PASS (cli.test.ts's `buildFlags` describe block still passes via the re-export)

- [ ] **Step 6: Commit**

```bash
git add apps/cli/src/global-options.ts apps/cli/src/global-options.test.ts apps/cli/src/cli.ts
git commit -m "refactor(cli): extract global-option metadata into a single shared module"
```

---

## Task 2: `resolveEntry` — resolve the first positional as language-or-file

**Files:**
- Modify: `apps/cli/src/resolve.ts`
- Modify: `apps/cli/src/resolve.test.ts`

**Interfaces:**
- Consumes: `resolveByLanguageId`, `resolveByExtension`, `allConfiguredServers` (already in `resolve.ts`), `Resolution` type
- Produces: `EntryResolution` type, `resolveEntry(token: string, root: string, serverOverride: string, scope?: Scope): EntryResolution | null`

- [ ] **Step 1: Write the failing tests**

Append to `apps/cli/src/resolve.test.ts` (same file, same mocks already declared at the top):

```ts
import { resolveEntry } from './resolve.js';

describe('resolveEntry — language-or-file resolution', () => {
  it('resolves a known language id with no anchor file', () => {
    vi.mocked(discoverServerByLanguageId).mockReturnValueOnce({
      serverCommand: '"tsls"',
      languageId: 'typescript'
    });
    vi.mocked(discoverServers).mockReturnValueOnce([
      { name: 'typescript', command: '"tsls"', fileExtensions: { '.ts': 'typescript' } }
    ]);
    const entry = resolveEntry('typescript', '/p', '');
    expect(entry?.languageId).toBe('typescript');
    expect(entry?.anchorFile).toBeUndefined();
  });

  it('resolves a file path by extension, and the file becomes the anchor', () => {
    const entry = resolveEntry('src/foo.rs', '/p', '');
    expect(entry?.languageId).toBe('rust');
    expect(entry?.anchorFile).toBe('src/foo.rs');
  });

  it('returns null for a token that is neither a configured language nor an extensioned file', () => {
    expect(resolveEntry('nope', '/p', '')).toBeNull();
  });

  it('--server bypasses discovery; a file token still becomes the anchor', () => {
    const entry = resolveEntry('src/foo.rs', '/p', 'rust-analyzer');
    expect(entry?.serverCommand).toBe('rust-analyzer');
    expect(entry?.anchorFile).toBe('src/foo.rs');
    expect(entry?.languageId).toBe('rust'); // inferred from extension even with --server
  });

  it('--server with a plain language-name token has no anchor and uses the token as languageId', () => {
    const entry = resolveEntry('typescript', '/p', 'my-custom-server');
    expect(entry?.serverCommand).toBe('my-custom-server');
    expect(entry?.anchorFile).toBeUndefined();
    expect(entry?.languageId).toBe('typescript');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/resolve.test.ts`
Expected: FAIL — `resolveEntry is not exported`

- [ ] **Step 3: Implement `resolveEntry`**

Add to `apps/cli/src/resolve.ts` (add `import { extname } from 'node:path';` at the top alongside the existing imports):

```ts
export interface EntryResolution {
  serverCommand: string;
  languageId: string;
  fromPlatform: boolean;
  /** Set only when the token was a file path — it doubles as the request's
   * implicit target file, so callers don't need to repeat it. */
  anchorFile?: string;
}

/**
 * Resolve the CLI's first positional: either a configured language id, or a
 * file path whose extension resolves the language (and which becomes the
 * implicit anchor file for the request). `serverOverride` (`--server`)
 * bypasses discovery entirely, but the token still supplies a languageId
 * label and, when it looks like a file, an anchor.
 */
export function resolveEntry(
  token: string,
  root: string,
  serverOverride: string,
  scope: Scope = 'user'
): EntryResolution | null {
  const ext = extname(token);

  if (serverOverride) {
    const discovered = ext ? resolveByExtension(root, ext, scope) : null;
    return {
      serverCommand: serverOverride,
      languageId: discovered?.languageId ?? token,
      fromPlatform: false,
      anchorFile: ext ? token : undefined
    };
  }

  const knownLanguages = new Set(
    allConfiguredServers(root, scope).flatMap((s) => Object.values(s.fileExtensions))
  );
  if (knownLanguages.has(token)) {
    const resolution = resolveByLanguageId(root, token, scope);
    return resolution ? { ...resolution } : null;
  }

  if (!ext) return null;
  const resolution = resolveByExtension(root, ext, scope);
  return resolution ? { ...resolution, anchorFile: token } : null;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm exec vitest run apps/cli/src/resolve.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/resolve.ts apps/cli/src/resolve.test.ts
git commit -m "feat(cli): add resolveEntry for the language-or-file first positional"
```

---

## Task 3: `findAnchorFile` — generalized anchor-file detection

**Files:**
- Create: `apps/cli/src/anchor.ts`
- Create: `apps/cli/src/anchor.test.ts`

**Interfaces:**
- Consumes: `getSchemaForMethod` (`@lspeasy/core`), `detectArgPattern` (already exported from `zod-to-commander.ts`)
- Produces: `findAnchorFile(method: string | undefined, args: readonly string[]): string | undefined`

This generalizes the anchor-detection logic currently inline in `cli.ts`'s `main()` (`isFileLike` + `anchorFromParams`), keyed on the method's schema-derived arg pattern instead of a fixed positional index, and drops the old `namespace !== 'workspace'` special case — the pattern check already excludes `workspace/symbol`'s `query` pattern generically.

- [ ] **Step 1: Write the failing tests**

```ts
// apps/cli/src/anchor.test.ts
import { describe, it, expect } from 'vitest';
import { findAnchorFile } from './anchor.js';

describe('findAnchorFile', () => {
  it('finds the file for a file-position method (e.g. textDocument/hover)', () => {
    expect(findAnchorFile('textDocument/hover', ['src/foo.ts', '12:7'])).toBe('src/foo.ts');
  });

  it('finds the file for a file-position-newname method (e.g. textDocument/rename)', () => {
    expect(findAnchorFile('textDocument/rename', ['src/foo.ts', '12:7', 'newName'])).toBe(
      'src/foo.ts'
    );
  });

  it('does not treat a query argument as a file (workspace/symbol)', () => {
    expect(findAnchorFile('workspace/symbol', ['MyClass'])).toBeUndefined();
  });

  it('does not treat a JSON literal as a file', () => {
    expect(findAnchorFile('textDocument/hover', ['{"not":"a file"}', '1:1'])).toBeUndefined();
  });

  it('mines a file URI out of a --params JSON blob for workspace/willRenameFiles', () => {
    const params = JSON.stringify({
      files: [{ oldUri: 'file:///project/a.ts', newUri: 'file:///project/b.ts' }]
    });
    expect(findAnchorFile('workspace/willRenameFiles', [params])).toBe('/project/a.ts');
  });

  it('mines textDocument.uri out of a raw call\'s --params blob', () => {
    const params = JSON.stringify({ textDocument: { uri: 'file:///project/c.ts' } });
    expect(findAnchorFile(undefined, [params])).toBe('/project/c.ts');
  });

  it('mines arguments[0].file out of an executeCommand-style --params blob', () => {
    const params = JSON.stringify({ arguments: [{ file: '/project/d.ts' }] });
    expect(findAnchorFile(undefined, [params])).toBe('/project/d.ts');
  });

  it('returns undefined when nothing anchors (e.g. the generic call command)', () => {
    expect(findAnchorFile(undefined, ['{"command":"typescript.reloadProjects"}'])).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/anchor.test.ts`
Expected: FAIL — `Cannot find module './anchor.js'`

- [ ] **Step 3: Implement**

```ts
// apps/cli/src/anchor.ts
import { extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSchemaForMethod } from '@lspeasy/core';
import { detectArgPattern } from './zod-to-commander.js';

function isFileLike(p: string): boolean {
  return extname(p) !== '' && !p.startsWith('{') && !p.startsWith('[') && !p.startsWith('"');
}

const FILE_LEADING_PATTERNS = new Set(['file-position-newname', 'file-position', 'file-range', 'file']);

/**
 * Best-effort file to open before sending a request, so the language server
 * has a document loaded (e.g. TS project resolution depends on it). Checks,
 * in order:
 *   1. the method's own first remaining arg, when its schema-derived pattern
 *      leads with a file (skipped generically for query-style methods like
 *      workspace/symbol, since their pattern isn't file-leading);
 *   2. any `--params`-style JSON blob among the remaining args:
 *      workspace/willRenameFiles' `files[].oldUri`, a raw `textDocument/*`
 *      call's `textDocument.uri`, or an executeCommand refactor's
 *      `arguments[0].file`.
 * `method` is undefined for the generic `call` command, whose "method" is a
 * user-supplied string, not a fixed schema — only the --params scan applies.
 */
export function findAnchorFile(method: string | undefined, args: readonly string[]): string | undefined {
  if (method) {
    const schema = getSchemaForMethod(method);
    if (schema) {
      const pattern = detectArgPattern(schema);
      const first = args[0];
      if (FILE_LEADING_PATTERNS.has(pattern) && first !== undefined && isFileLike(first)) {
        return first;
      }
    }
  }

  for (const candidate of args) {
    if (!candidate.startsWith('{')) continue;
    try {
      const parsed = JSON.parse(candidate) as {
        files?: Array<{ oldUri?: string; uri?: string }>;
        textDocument?: { uri?: string };
        arguments?: Array<{ file?: string }>;
      };
      const uri = parsed.files?.[0]?.oldUri ?? parsed.files?.[0]?.uri ?? parsed.textDocument?.uri;
      if (typeof uri === 'string') return fileURLToPath(uri);
      const cmdFile = parsed.arguments?.[0]?.file;
      if (typeof cmdFile === 'string') return cmdFile;
    } catch {
      /* not the params JSON — keep scanning */
    }
  }
  return undefined;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm exec vitest run apps/cli/src/anchor.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/anchor.ts apps/cli/src/anchor.test.ts
git commit -m "feat(cli): add findAnchorFile, generalized from cli.ts's inline detection"
```

---

## Task 4: `zodToCommander`/`marshalParams` accept a pre-resolved anchor file

**Files:**
- Modify: `apps/cli/src/zod-to-commander.ts`
- Modify: `apps/cli/src/zod-to-commander.test.ts`

**Interfaces:**
- Consumes: nothing new
- Produces: `zodToCommander(method, schema, session, flags, anchorFile?: string): Command`; `marshalParams(pattern, positional, opts, flags, anchorFile?: string): unknown` (both gain a trailing optional param; existing callers with 4 args are unaffected)

- [ ] **Step 1: Write the failing tests**

Add to `apps/cli/src/zod-to-commander.test.ts`:

```ts
describe('anchorFile support', () => {
  it('marshalParams prepends the anchor file for a file-position pattern', () => {
    const params = marshalParams(
      'file-position',
      ['12:7'], // no file — anchor supplies it
      {},
      { root: '/project', json: false, allowOutsideRoot: true } as GlobalFlags,
      '/project/src/foo.ts'
    ) as { textDocument: { uri: string }; position: { line: number; character: number } };
    expect(params.textDocument.uri).toContain('foo.ts');
    expect(params.position).toEqual({ line: 11, character: 6 });
  });

  it('marshalParams ignores the anchor file for a query pattern', () => {
    const params = marshalParams(
      'query',
      ['MyClass'],
      {},
      { root: '/project', json: false, allowOutsideRoot: true } as GlobalFlags,
      '/project/src/foo.ts'
    ) as { query: string };
    expect(params.query).toBe('MyClass');
  });

  it('zodToCommander omits the <file> argument when an anchor file is provided', () => {
    const cmd = zodToCommander(
      'textDocument/hover',
      getSchemaForMethod('textDocument/hover')!,
      {} as any,
      { root: '/project' } as GlobalFlags,
      '/project/src/foo.ts'
    );
    expect(cmd.registeredArguments.map((a) => a.name())).toEqual(['line:col']);
  });

  it('zodToCommander keeps the <file> argument when no anchor is provided', () => {
    const cmd = zodToCommander(
      'textDocument/hover',
      getSchemaForMethod('textDocument/hover')!,
      {} as any,
      { root: '/project' } as GlobalFlags
    );
    expect(cmd.registeredArguments.map((a) => a.name())).toEqual(['file', 'line:col']);
  });
});
```

Add the needed imports at the top of the test file: `import { getSchemaForMethod } from '@lspeasy/core';` and `import type { GlobalFlags } from './io.js';` (alongside whatever `marshalParams`/`zodToCommander` import already looks like in that file).

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/zod-to-commander.test.ts`
Expected: FAIL — anchor-aware behavior not implemented; `<file>` argument always present

- [ ] **Step 3: Implement**

In `apps/cli/src/zod-to-commander.ts`, change `marshalParams`'s signature and body to prepend the anchor for file-leading patterns only:

```ts
export function marshalParams(
  pattern: ArgPattern,
  positional: string[],
  opts: Record<string, unknown>,
  flags: GlobalFlags,
  anchorFile?: string
): unknown {
  const effective =
    anchorFile !== undefined && pattern !== 'query' && pattern !== 'raw'
      ? [anchorFile, ...positional]
      : positional;
  const override =
    typeof opts['params'] === 'string' ? (JSON.parse(opts['params']) as unknown) : undefined;

  switch (pattern) {
    case 'file-position-newname': {
      const file = resolvePathArg(effective[0]!, flags);
      const pos = parseLineCol(effective[1]!);
      return {
        textDocument: { uri: pathToFileURL(file).href },
        position: toLspPosition(pos),
        newName: effective[2]
      };
    }
    case 'file-position': {
      const file = resolvePathArg(effective[0]!, flags);
      const pos = parseLineCol(effective[1]!);
      return {
        textDocument: { uri: pathToFileURL(file).href },
        position: toLspPosition(pos)
      };
    }
    case 'file-range': {
      const file = resolvePathArg(effective[0]!, flags);
      const [startStr, endStr] = (effective[1] ?? '').split('-');
      const start = parseLineCol(startStr ?? '1:1');
      const end = parseLineCol(endStr ?? startStr ?? '1:1');
      return {
        textDocument: { uri: pathToFileURL(file).href },
        range: { start: toLspPosition(start), end: toLspPosition(end) }
      };
    }
    case 'file': {
      const file = resolvePathArg(effective[0]!, flags);
      return { textDocument: { uri: pathToFileURL(file).href } };
    }
    case 'query':
      return { query: positional[0] ?? '' };
    case 'raw':
      if (override === undefined) throw new Error('This method requires --params <json>');
      return override;
  }
}
```

(Only the top of the function and the `effective` variable are new; every `positional` reference inside the file-leading cases becomes `effective`. `query`/`raw` keep using `positional` unchanged.)

Then update `zodToCommander`'s signature and the argument-declaration switch:

```ts
export function zodToCommander(
  method: string,
  schema: z.ZodType,
  session: RefactorSession,
  flags: GlobalFlags,
  anchorFile?: string
): Command {
  const subcommand = method.split('/').slice(1).join('-') || method;
  const cmd = new Command(subcommand);
  const pattern = detectArgPattern(schema);
  const hasAnchor = anchorFile !== undefined;

  switch (pattern) {
    case 'file-position-newname':
      if (!hasAnchor) cmd.argument('<file>', 'file path (relative to --root)');
      cmd.argument('<line:col>', '1-based position, e.g. 12:7');
      cmd.argument('<newName>', 'new symbol name');
      break;
    case 'file-position':
      if (!hasAnchor) cmd.argument('<file>', 'file path (relative to --root)');
      cmd.argument('<line:col>', '1-based position, e.g. 12:7');
      break;
    case 'file-range':
      if (!hasAnchor) cmd.argument('<file>', 'file path (relative to --root)');
      cmd.argument('<range>', 'range as startLine:col-endLine:col, e.g. 2:1-4:5');
      break;
    case 'file':
      if (!hasAnchor) cmd.argument('<file>', 'file path (relative to --root)');
      break;
    case 'query':
      cmd.argument('<query>', 'search query string');
      break;
    case 'raw':
      break;
  }
  // ...unchanged code below (the --params option, addFieldOptions loop)...
```

Finally, inside the existing `cmd.action(async (...cmdArgs) => { ... })` body, change the `marshalParams` call to thread `anchorFile`:

```ts
      const rawParams = marshalParams(pattern, positional, cmdOpts, flags, anchorFile);
```

Everything else in the action body is unchanged.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm exec vitest run apps/cli/src/zod-to-commander.test.ts`
Expected: PASS

- [ ] **Step 5: Run the full existing test suite to check for regressions**

Run: `pnpm exec vitest run apps/cli/src`
Expected: PASS (existing 4-arg call sites in `build-commands.ts`, `integration.test.ts`, `build-commands.test.ts` are unaffected since `anchorFile` is optional and defaults to `undefined` everywhere it's currently omitted)

- [ ] **Step 6: Commit**

```bash
git add apps/cli/src/zod-to-commander.ts apps/cli/src/zod-to-commander.test.ts
git commit -m "feat(cli): thread an optional pre-resolved anchor file through zodToCommander"
```

---

## Task 5: `buildCommandTree` threads `anchorFile` and adds the global-options footer

**Files:**
- Modify: `apps/cli/src/build-commands.ts`
- Modify: `apps/cli/src/build-commands.test.ts`

**Interfaces:**
- Consumes: `globalOptionsHelpText` (Task 1), the updated `zodToCommander` (Task 4)
- Produces: `buildCommandTree(program, capabilities, session, flags, anchorFile?: string): void`

- [ ] **Step 1: Write the failing tests**

Add to `apps/cli/src/build-commands.test.ts`:

```ts
it('passes anchorFile through to zodToCommander (file argument omitted)', () => {
  const program = new Command();
  buildCommandTree(program, { hoverProvider: true } as any, fakeSession, FLAGS, '/project/src/foo.ts');
  const ns = program.commands.find((c) => c.name() === 'textDocument');
  const hover = ns?.commands.find((c) => c.name() === 'hover');
  expect(hover?.registeredArguments.map((a) => a.name())).toEqual(['line:col']);
});

it('every leaf command and the call command get the global-options help footer', () => {
  const program = new Command();
  buildCommandTree(program, { hoverProvider: true } as any, fakeSession, FLAGS);
  const ns = program.commands.find((c) => c.name() === 'textDocument');
  const hover = ns?.commands.find((c) => c.name() === 'hover');
  const call = program.commands.find((c) => c.name() === 'call');
  expect(hover?.helpInformation()).toMatch(/Global options:/);
  expect(call?.helpInformation()).toMatch(/Global options:/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/build-commands.test.ts`
Expected: FAIL — `<file>` argument still present; no "Global options:" text in help output

- [ ] **Step 3: Implement**

In `apps/cli/src/build-commands.ts`, add the import:

```ts
import { globalOptionsHelpText } from './global-options.js';
```

Change the signature and the `zodToCommander` call site:

```ts
export function buildCommandTree(
  program: Command,
  capabilities: ServerCapabilities,
  session: RefactorSession,
  flags: GlobalFlags,
  anchorFile?: string
): void {
  for (const method of Object.keys(LSPSchemas) as Array<keyof typeof LSPSchemas>) {
    const schema = getSchemaForMethod(method as string);
    if (!schema) continue;

    const capPath = getCapabilityForRequestMethod(method as any);
    if (capPath === 'alwaysOn') continue;
    if (!getNestedValue(capabilities, capPath as string)) continue;
    const refinedCapPath = CAPABILITY_REFINEMENTS[method as string];
    if (refinedCapPath && !getNestedValue(capabilities, refinedCapPath)) continue;

    const parts = (method as string).split('/');
    if (parts.length < 2) continue;
    const [namespace] = parts as [string, ...string[]];

    let nsCmd = program.commands.find((c) => c.name() === namespace);
    if (!nsCmd) {
      nsCmd = new Command(namespace).description(`${namespace} operations`);
      program.addCommand(nsCmd);
    }

    const subCmd = zodToCommander(method as string, schema, session, flags, anchorFile);
    enrichCommandFromCapabilities(method as string, subCmd, capabilities);
    if (method === 'workspace/executeCommand') {
      subCmd.addHelpText(
        'after',
        '\nDiscovering commands: server command names (if advertised) appear above as\n' +
          'capability options. Argument shapes are server-specific — obtain a ready-to-run\n' +
          '{command, arguments} from a textDocument/codeAction or textDocument/codeLens result and replay it\n' +
          '(lsproxy auto-runs command-bearing code actions).'
      );
    }
    subCmd.addHelpText('after', `\n${globalOptionsHelpText()}`);
    nsCmd.addCommand(subCmd);
  }

  const callCmd = program
    .command('call <method>')
    .description('Send any LSP request by method name with raw JSON params')
    .option('--params <json>', 'LSP params as JSON')
    .action(async (method: string, opts: { params?: string }) => {
      // ...unchanged action body...
    });
  callCmd.addHelpText('after', `\n${globalOptionsHelpText()}`);
}
```

(Only the `zodToCommander(...)` call gains the `anchorFile` argument, and two `addHelpText('after', ...)` calls are added — one after the `executeCommand` special case, one after the `call` command definition. The rest of the function, including the full `call` action body, is unchanged from today's file.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm exec vitest run apps/cli/src/build-commands.test.ts`
Expected: PASS

- [ ] **Step 5: Run the full suite**

Run: `pnpm exec vitest run apps/cli/src`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add apps/cli/src/build-commands.ts apps/cli/src/build-commands.test.ts
git commit -m "feat(cli): thread anchorFile through buildCommandTree; add global-options help footer"
```

---

## Task 6: `config-command.ts` — real Commander tree for `config`

**Files:**
- Create: `apps/cli/src/config-command.ts`
- Create: `apps/cli/src/config-command.test.ts`

**Interfaces:**
- Consumes: `configList`, `configImport`, `configExport`, `configDiff`, `type ConfigFlags` (`./config/commands.js`), `createFormatter` (`./format.js`)
- Produces: `buildConfigCommand(flags: GlobalFlags): Command`

- [ ] **Step 1: Write the failing tests**

```ts
// apps/cli/src/config-command.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildConfigCommand } from './config-command.js';
import type { GlobalFlags } from './io.js';

const dirs: string[] = [];
function root(): string {
  const d = mkdtempSync(join(tmpdir(), 'lspeasy-config-cmd-'));
  dirs.push(d);
  return d;
}
afterEach(() => {
  vi.restoreAllMocks();
  while (dirs.length) rmSync(dirs.pop()!, { recursive: true, force: true });
});

function flagsFor(r: string, json = false): GlobalFlags {
  return {
    server: '',
    root: r,
    dryRun: false,
    json,
    verbose: false,
    waitMs: 0,
    allowOutsideRoot: false,
    noProxy: false,
    overwrite: false
  };
}

function captureStdout(): { out: () => string; restore: () => void } {
  const chunks: string[] = [];
  const spy = vi.spyOn(process.stdout, 'write').mockImplementation(((s: string) => {
    chunks.push(s);
    return true;
  }) as never);
  return { out: () => chunks.join(''), restore: () => spy.mockRestore() };
}

describe('buildConfigCommand', () => {
  it('has real Commander help for list/import/export/diff (not a hand-written usage string)', () => {
    const cmd = buildConfigCommand(flagsFor('/x'));
    expect(cmd.commands.map((c) => c.name()).sort()).toEqual(['diff', 'export', 'import', 'list']);
    expect(cmd.commands.find((c) => c.name() === 'list')?.helpInformation()).toMatch(/Usage:/);
  });

  it('list dispatches to configList with project scope by default', async () => {
    const r = root();
    const cmd = buildConfigCommand(flagsFor(r, true));
    const cap = captureStdout();
    try {
      await cmd.parseAsync(['list'], { from: 'user' });
    } finally {
      cap.restore();
    }
    const parsed = JSON.parse(cap.out()) as { platforms: Array<{ id: string }> };
    expect(parsed.platforms.length).toBeGreaterThan(0);
  });

  it('--user switches scope to user-level config', async () => {
    const r = root();
    writeFileSync(join(r, 'lsp.json'), JSON.stringify({ lspServers: {} }), 'utf8');
    const cmd = buildConfigCommand(flagsFor(r, true));
    const cap = captureStdout();
    try {
      await cmd.parseAsync(['import', 'copilot', '--user'], { from: 'user' });
    } finally {
      cap.restore();
    }
    // Doesn't throw and produces a parseable result — scope plumbing works end to end.
    expect(() => JSON.parse(cap.out())).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/config-command.test.ts`
Expected: FAIL — `Cannot find module './config-command.js'`

- [ ] **Step 3: Implement**

```ts
// apps/cli/src/config-command.ts
import { Command } from 'commander';
import { configList, configImport, configExport, configDiff, type ConfigFlags } from './config/commands.js';
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
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm exec vitest run apps/cli/src/config-command.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/config-command.ts apps/cli/src/config-command.test.ts
git commit -m "feat(cli): add buildConfigCommand, a real Commander tree for config"
```

---

## Task 7: `buildDaemonCommand` — real Commander tree for `daemon`

**Files:**
- Modify: `apps/cli/src/daemon-commands.ts`
- Create: `apps/cli/src/daemon-commands.test.ts`

**Interfaces:**
- Consumes: existing `runDaemon` (unchanged, in the same file)
- Produces: `buildDaemonCommand(flags: GlobalFlags, fmt: Formatter): Command`

- [ ] **Step 1: Write the failing test**

```ts
// apps/cli/src/daemon-commands.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { buildDaemonCommand } from './daemon-commands.js';
import { createFormatter } from './format.js';
import type { GlobalFlags } from './io.js';

afterEach(() => vi.restoreAllMocks());

const FLAGS: GlobalFlags = {
  server: '',
  root: '/project',
  dryRun: false,
  json: true,
  verbose: false,
  waitMs: 0,
  allowOutsideRoot: false,
  noProxy: false,
  overwrite: false
};

describe('buildDaemonCommand', () => {
  it('has real Commander help for start/stop/status', () => {
    const cmd = buildDaemonCommand(FLAGS, createFormatter(false));
    expect(cmd.commands.map((c) => c.name()).sort()).toEqual(['start', 'status', 'stop']);
  });

  it('status dispatches through to a parseable result (daemon not running)', async () => {
    const cmd = buildDaemonCommand(FLAGS, createFormatter(false));
    const chunks: string[] = [];
    const spy = vi.spyOn(process.stdout, 'write').mockImplementation(((s: string) => {
      chunks.push(s);
      return true;
    }) as never);
    try {
      await cmd.parseAsync(['status'], { from: 'user' });
    } finally {
      spy.mockRestore();
    }
    const parsed = JSON.parse(chunks.join('')) as { ok: boolean; daemon: unknown };
    expect(parsed.ok).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/daemon-commands.test.ts`
Expected: FAIL — `buildDaemonCommand is not exported`

- [ ] **Step 3: Implement**

Add to the top of `apps/cli/src/daemon-commands.ts`:

```ts
import { Command } from 'commander';
```

Append to the file (after the existing `runDaemon` function, which is unchanged):

```ts
/** Real Commander command tree for `lsproxy daemon <start|stop|status>`,
 * wrapping the existing `runDaemon` dispatch. */
export function buildDaemonCommand(flags: GlobalFlags, fmt: Formatter): Command {
  const daemon = new Command('daemon').description(
    'Manage the per-root proxy daemon (otherwise starts lazily on first request)'
  );
  daemon
    .command('start')
    .description('Start the proxy daemon for --root (no-op if already running)')
    .action(() => runDaemon('start', flags, fmt));
  daemon
    .command('stop')
    .description('Stop the proxy daemon for --root')
    .action(() => runDaemon('stop', flags, fmt));
  daemon
    .command('status')
    .description('Show daemon status for --root')
    .action(() => runDaemon('status', flags, fmt));
  return daemon;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm exec vitest run apps/cli/src/daemon-commands.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/daemon-commands.ts apps/cli/src/daemon-commands.test.ts
git commit -m "feat(cli): add buildDaemonCommand, a real Commander tree for daemon"
```

---

## Task 8: `program.ts` reuses the shared builders (removes the duplicate definition)

**Files:**
- Modify: `apps/cli/src/program.ts`

**Interfaces:**
- Consumes: `buildConfigCommand` (Task 6), `buildDaemonCommand` (Task 7)

This is the fix for the root-cause drift: `program.ts` previously hand-rolled its own metadata-only `config`/`daemon` shape (used by `help.test.ts`'s `buildProgram()` fixture and by `scripts/gen-skill.ts`), separate from `cli.ts`'s real dispatch. Now there is exactly one definition.

- [ ] **Step 1: Replace the hand-rolled block**

In `apps/cli/src/program.ts`, replace lines 56-91 (the `// Register the \`config\` command family...` through the end of the `daemon` block) with:

```ts
  // Registered via the same builders cli.ts uses for real dispatch, so this
  // metadata-only tree can never drift from the actual command surface.
  program.addCommand(buildConfigCommand(stubFlags));
  program.addCommand(buildDaemonCommand(stubFlags, createFormatter(false)));
```

Add the imports at the top of the file:

```ts
import { buildConfigCommand } from './config-command.js';
import { buildDaemonCommand } from './daemon-commands.js';
import { createFormatter } from './format.js';
```

- [ ] **Step 2: Run the existing consumers to verify no regression**

Run: `pnpm exec vitest run apps/cli/src/help.test.ts`
Expected: PASS — `help.test.ts`'s `renderDrillDownText(buildProgram(), ['config'], colorFmt)` test still gets a real Commander-generated, colorized help block (this was already true before, since `program.ts`'s old hand-rolled tree also produced real `Command` objects — the change is that there is now only one source for that shape, not two).

- [ ] **Step 3: Verify the skill generator still runs**

Run: `pnpm --filter @lsproxy/cli run build && pnpm --filter @lsproxy/cli run skill:gen`
Expected: succeeds and produces the same command surface as before (config/daemon subcommand names, descriptions, and `--user` options are unchanged — only *how* they're defined changed)

- [ ] **Step 4: Commit**

```bash
git add apps/cli/src/program.ts
git commit -m "refactor(cli): program.ts reuses buildConfigCommand/buildDaemonCommand"
```

---

## Task 9: `help.ts` — Usage/Explore/Global-options sections for the unified grammar

**Files:**
- Modify: `apps/cli/src/help.ts`
- Modify: `apps/cli/src/help.test.ts`

**Interfaces:**
- Consumes: `globalOptionsHelpText`, `GLOBAL_OPTIONS` (Task 1)

- [ ] **Step 1: Update the failing assertions first**

In `apps/cli/src/help.test.ts`, change the two assertions that hard-code the old (incorrect) grammar:

```ts
  it('lists running and cold languages with the drill-down hint and no ANSI', () => {
    // ...unchanged report construction...
    const out = renderTopLevel(report, fmt);
    expect(out).toContain('typescript');
    expect(out).toContain('.ts');
    expect(out).toContain('rust');
    expect(out).toContain('lsproxy <language-or-file>');
    expect(out).not.toContain('\x1b');
  });
```

```ts
  it('shows base usage + non-namespace commands (config/daemon/call) with descriptions', () => {
    const report: StatusReport = { daemon: null, languages: [] };
    const out = renderTopLevel(report, fmt);
    expect(out).toMatch(/Usage:/);
    expect(out).toMatch(/lsproxy <language-or-file> <namespace> <request>/);
    expect(out).toMatch(/Commands:/);
    expect(out).toMatch(/config .*read\/write LSP config/);
    expect(out).toMatch(/daemon .*manage the per-root proxy daemon/);
    expect(out).toMatch(/call .*send any LSP request/);
    expect(out).toMatch(/Global options:/);
    expect(out).toMatch(/--dry-run/);
  });
```

Add a new test for the corrected role-coloring (position of `<language-or-file>` isn't affected, but verify the token is classified as a namespace-role for coloring, matching how `<namespace>`/`<request>` already are):

```ts
  it('colorizes <language-or-file> with the namespace role', () => {
    const color = createFormatter(true);
    const report: StatusReport = { daemon: null, languages: [] };
    const out = renderTopLevel(report, color);
    expect(out).toContain('\x1b[38;2;136;192;208m<language-or-file>\x1b[0m'); // nord cyan
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm exec vitest run apps/cli/src/help.test.ts`
Expected: FAIL — old Usage text still present

- [ ] **Step 3: Implement**

In `apps/cli/src/help.ts`, add the import:

```ts
import { globalOptionsHelpText } from './global-options.js';
```

Add `<language-or-file>` to the `USAGE_ROLE` map (namespace role, matching `<language>`/`<namespace>`):

```ts
const USAGE_ROLE: Readonly<Record<string, UsageRole>> = {
  '<language>': 'ns',
  '<language-or-file>': 'ns',
  '<namespace>': 'ns',
  '<request>': 'method',
  '<method>': 'method',
  '[flags]': 'option',
  '[options]': 'option'
};
```

Replace `renderTopLevel`'s `usage`/`drill` construction (the `Usage:`/`Drill down:` blocks) with the corrected grammar and a new `Global options:` block:

```ts
  const usage = [
    fmt.bold('Usage:'),
    `  ${colorizeUsage('lsproxy <language-or-file> <namespace> <request> [args] [flags]', fmt)}`,
    `  ${colorizeUsage('lsproxy <language-or-file> call <method> --params <json>', fmt)}`
  ].join('\n');

  // Non-namespace (meta) commands — listed with descriptions so they're
  // discoverable from the bare view, not just the per-language drill-down.
  const commands = [
    fmt.bold('Commands:'),
    row('config <list|import|export|diff>', 'read/write LSP config across platforms'),
    row('daemon <start|stop|status>', 'manage the per-root proxy daemon'),
    row('call <method> --params <json>', 'send any LSP request by method name'),
    row('--version, -V', 'print the CLI version')
  ].join('\n');

  const explore = [
    fmt.bold('Explore:'),
    row('lsproxy <language-or-file>', 'namespaces for that server'),
    row('lsproxy <language-or-file> <namespace>', 'requests in that namespace'),
    row('lsproxy <language-or-file> <namespace> <request> --help', 'parameter schema'),
    fmt.dim('(fewer args than a request needs shows the same schema view instead of an error)')
  ].join('\n');

  const globalOpts = [fmt.bold('Global options:'), globalOptionsHelpText().split('\n').slice(1).join('\n')].join(
    '\n'
  );

  return [
    fmt.bold('lsproxy — LSP-driven CLI'),
    '',
    header,
    '',
    usage,
    '',
    fmt.bold('Languages:'),
    ...lines,
    '',
    commands,
    '',
    explore,
    '',
    globalOpts,
    ''
  ].join('\n');
```

(This replaces the old `usage`/`drill` local variables and the final `return [...]` array — the `header`, `lines`, `commands`, and `row` helper above it are unchanged.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm exec vitest run apps/cli/src/help.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/help.ts apps/cli/src/help.test.ts
git commit -m "fix(cli): correct top-level Usage grammar; add Global options section"
```

---

## Task 10: `cli.ts` — pass-1 via `parseOptions`, unified `runHelp`/new `runDispatch`

**Files:**
- Modify: `apps/cli/src/cli.ts`
- Modify: `apps/cli/src/cli.test.ts`
- Modify: `apps/cli/src/integration.test.ts` (new cases only; existing cases unchanged, they call `buildCommandTree` directly, not `main()`/`runDispatch`)

**Interfaces:**
- Consumes: `registerGlobalOptions`, `buildFlags` (Task 1), `resolveEntry` (Task 2), `findAnchorFile` (Task 3), `buildConfigCommand` (Task 6), `buildDaemonCommand` (Task 7)
- Produces: rewritten `main()`; `runHelp(positionals: string[], flags: GlobalFlags): Promise<void>` (same signature, now language-or-file aware); new `runDispatch(positionals: string[], flags: GlobalFlags): Promise<void>`; new `drillPathFor(path: string[]): string[]`

(The `status` command — Tasks 11–16 below — is wired into `main()`'s meta-command branch afterward, as a small follow-up diff against the code this task produces. Writing it here would mean referencing a function that doesn't exist yet.)

This is the largest task — it removes `node:util parseArgs`, removes the old hand-rolled `config`/`daemon` dispatch, and collapses real dispatch onto the same grammar `runHelp` already used.

- [ ] **Step 1: Write the failing tests first**

Add to `apps/cli/src/cli.test.ts` (keep all existing tests in the file as-is; they exercise `buildFlags` and `runHelp` and should still pass once this task is done — add these new ones):

```ts
import { runDispatch } from './cli.js';

describe('runHelp — file-as-first-token (unified grammar)', () => {
  it('accepts a file path as the first token, same as a language id', async () => {
    const root = tmpRootWithConfig();
    writeFileSync(join(root, 'foo.ts'), 'const x = 1;\n', 'utf8');
    const cap = captureStdout();
    try {
      await runHelp(['foo.ts'], baseFlags(root, false));
    } finally {
      cap.restore();
    }
    expect(cap.out()).toContain('textDocument');
  });
});

describe('runDispatch — incomplete real call falls back to the drill-down view', () => {
  it('shows the same schema view as --help when a required arg is missing', async () => {
    const root = tmpRootWithConfig();
    const cap = captureStdout();
    try {
      await runDispatch(['typescript', 'textDocument', 'hover'], baseFlags(root, false));
    } finally {
      cap.restore();
    }
    const text = cap.out();
    expect(text).toMatch(/Usage:/);
    expect(text.toLowerCase()).toContain('hover');
  });

  it('an unresolvable first token fails with the configured-languages list', async () => {
    const root = tmpRootWithConfig();
    const errs: string[] = [];
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((): never => {
      throw new Error('exit');
    }) as never);
    const errSpy = vi.spyOn(process.stderr, 'write').mockImplementation(((s: string) => {
      errs.push(s);
      return true;
    }) as never);
    try {
      await expect(runDispatch(['nope', 'textDocument', 'hover'], baseFlags(root, false))).rejects.toThrow(
        'exit'
      );
      expect(errs.some((s) => s.includes('nope'))).toBe(true);
    } finally {
      exitSpy.mockRestore();
      errSpy.mockRestore();
    }
  });
});
```

Add to `apps/cli/src/integration.test.ts` (new `describe` block; existing ones untouched):

```ts
describe('anchorFile-aware dispatch (form B: file as first token)', () => {
  it('produces identical params whether the file is the first token or the request-level positional', async () => {
    const sendRequest = vi.fn(async () => ({ contents: { kind: 'markdown', value: 'hi' } }));
    const fakeSession = {
      lsp: { sendRequest },
      takeCapturedEdits: () => [],
      requestWithRetry: (run: () => Promise<unknown>) => run()
    } as any;

    // Form A: language given, file repeated at the request level (today's shape).
    const programA = new Command().exitOverride();
    buildCommandTree(programA, { hoverProvider: true } as any, fakeSession, FLAGS);
    await programA.parseAsync(['textDocument', 'hover', '/project/src/foo.ts', '5:10'], { from: 'user' });
    const paramsA = sendRequest.mock.calls[0]![1];

    sendRequest.mockClear();

    // Form B: file is the pre-resolved anchor; the leaf command's own <file> arg is gone.
    const programB = new Command().exitOverride();
    buildCommandTree(programB, { hoverProvider: true } as any, fakeSession, FLAGS, '/project/src/foo.ts');
    await programB.parseAsync(['textDocument', 'hover', '5:10'], { from: 'user' });
    const paramsB = sendRequest.mock.calls[0]![1];

    expect(paramsB).toEqual(paramsA);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm exec vitest run apps/cli/src/cli.test.ts apps/cli/src/integration.test.ts`
Expected: FAIL — `runDispatch` doesn't exist yet; `runHelp` doesn't accept a file token yet

- [ ] **Step 3: Rewrite `cli.ts`**

Replace the file's imports (the block from `import { parseArgs } from 'node:util';` through the `renderTopLevel, renderDrillDownText, drillDownJson` import) with:

```ts
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
import { buildFlags, registerGlobalOptions, type ParsedOptionValues } from './global-options.js';
import { resolveEntry, allConfiguredServers } from './resolve.js';
import { findAnchorFile } from './anchor.js';
import { coldStatusReport } from '@lsproxy/proxy';
import { RefactorSession, CLI_VERSION } from './session.js';
import { connectViaProxy, fetchDaemonStatus } from './connect.js';
import { buildConfigCommand } from './config-command.js';
import { buildDaemonCommand } from './daemon-commands.js';
import { buildCommandTree } from './build-commands.js';
import { createFormatter } from './format.js';
import { renderTopLevel, renderDrillDownText, drillDownJson } from './help.js';

export { buildFlags, type ParsedOptionValues } from './global-options.js';
```

This drops two imports that no longer belong in `cli.ts`: `parseArgs` from `node:util` (pass 1 is now `scan.parseOptions`, below) and `discoverServer` from `@lspeasy/core` (its only prior use was the old inline `--server` branch, which `resolveEntry` now owns — `cli.ts` has no direct `@lspeasy/core` import left). The `export { buildFlags, ... }` line re-exports Task 1's module so `cli.test.ts`'s existing `import { buildFlags, runHelp } from './cli.js'` keeps working, while the `import { buildFlags, ... }` line above it binds the same names for use inside this file — both are needed (a bare `export ... from` does not bind names locally).

Delete the now-unused `GLOBAL_OPTION_CONFIG` object, the local `ParsedOptionValues` type, and the local `buildFlags` function if any of them still remain from before Task 1 (Task 1 already removed them from this file — this step just confirms they're gone).

Replace `main()` entirely:

```ts
async function main(): Promise<void> {
  const scan = new Command('lsproxy').allowUnknownOption(true).helpOption(false);
  registerGlobalOptions(scan);
  scan.option('-V, --version').option('-h, --help');
  const { operands, unknown } = scan.parseOptions(argv.slice(2));
  const positionals = [...operands, ...unknown].filter((t) => !t.startsWith('-'));
  const scanOpts = scan.opts() as ParsedOptionValues & { version?: boolean; help?: boolean };

  if (scanOpts.version === true || positionals[0] === 'version') {
    process.stdout.write(`${CLI_VERSION}\n`);
    exit(0);
  }

  const flags = buildFlags(scanOpts);

  if (positionals[0] === 'config' || positionals[0] === 'daemon') {
    const color = process.stdout.isTTY === true && !process.env['NO_COLOR'] && !flags.json;
    const program = new Command('lsproxy');
    registerGlobalOptions(program);
    program.addCommand(buildConfigCommand(flags));
    program.addCommand(buildDaemonCommand(flags, createFormatter(color)));
    await program.parseAsync(argv);
    exit(0);
  }

  if (scanOpts.help === true || positionals.length === 0) {
    await runHelp(positionals, flags);
    exit(0);
  }

  await runDispatch(positionals, flags);
}
```

Add the small shared helper, right above `runHelp`:

```ts
/** `call`'s "request" is a user-supplied method string, not a second command
 * level — treat it as a 1-token drill path; every other namespace/request
 * pair is a 2-token path. Used both by runHelp's own path and by
 * runDispatch's incomplete-call fallback. */
function drillPathFor(path: string[]): string[] {
  return path[0] === 'call' ? path.slice(0, 1) : path.slice(0, 2);
}
```

Replace `runHelp` entirely:

```ts
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

  const entry = resolveEntry(token, flags.root, flags.server);
  if (!entry) {
    const names = allConfiguredServers(flags.root).flatMap((s) => Object.values(s.fileExtensions));
    fail(
      `"${token}" is not a configured language or a file with a recognized extension. Configured: ${[...new Set(names)].join(', ')}`,
      flags.json
    );
  }

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
```

Add the new `runDispatch`, right after `runHelp`:

```ts
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
  const entry = resolveEntry(token, flags.root, flags.server);
  if (!entry) {
    const names = allConfiguredServers(flags.root).flatMap((s) => Object.values(s.fileExtensions));
    fail(
      `"${token}" is not a configured language or a file with a recognized extension. Configured: ${[...new Set(names)].join(', ')}`,
      flags.json
    );
  }

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

    const rawArgs = argv.slice(2);
    const tokenIdx = rawArgs.indexOf(token);
    const pass2Args = tokenIdx === -1 ? rawArgs : [...rawArgs.slice(0, tokenIdx), ...rawArgs.slice(tokenIdx + 1)];

    try {
      await program.parseAsync(pass2Args, { from: 'user' });
    } catch (err) {
      if (err instanceof CommanderError && err.code === 'commander.missingArgument') {
        const drillPath = drillPathFor([namespace, request]);
        if (flags.json) {
          process.stdout.write(JSON.stringify(drillDownJson(program, entry.languageId, drillPath)) + '\n');
        } else {
          const color = process.stdout.isTTY === true && !process.env['NO_COLOR'] && !flags.json;
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
```

Leave `isEntryPoint()` and the trailing `if (isEntryPoint()) { main().catch(...) }` block unchanged.

- [ ] **Step 4: Run the tests to verify they pass**

Run: `pnpm exec vitest run apps/cli/src/cli.test.ts apps/cli/src/integration.test.ts`
Expected: PASS

- [ ] **Step 5: Run the full suite, type-check, and lint**

Run: `pnpm exec vitest run apps/cli/src && pnpm --filter @lsproxy/cli run type-check && pnpm exec oxlint apps/cli`
Expected: all green. Fix any remaining unused-import or type errors surfaced by the rewrite before proceeding (in particular, double-check no file still imports `parseArgs` from `node:util`, and that `discoverServer` has no leftover import in `cli.ts`).

- [ ] **Step 6: Commit**

```bash
git add apps/cli/src/cli.ts apps/cli/src/cli.test.ts apps/cli/src/integration.test.ts
git commit -m "feat(cli): unify dispatch and --help on one language-or-file grammar via Commander parseOptions"
```

---

## Task 11: `resolveBinaryPath` — `$PATH`-aware executable resolution

**Files:**
- Create: `apps/cli/src/resolve-binary.ts`
- Create: `apps/cli/src/resolve-binary.test.ts`

**Interfaces:**
- Produces: `resolveBinaryPath(cmd: string): string | undefined`

- [ ] **Step 1: Write the failing tests**

```ts
// apps/cli/src/resolve-binary.test.ts
import { describe, it, expect, afterEach } from 'vitest';
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, delimiter } from 'node:path';
import { resolveBinaryPath } from './resolve-binary.js';

const dirs: string[] = [];
function fakeBin(name: string): { dir: string; path: string } {
  const dir = mkdtempSync(join(tmpdir(), 'lspeasy-bin-'));
  dirs.push(dir);
  const path = join(dir, name);
  writeFileSync(path, '#!/bin/sh\necho hi\n');
  chmodSync(path, 0o755);
  return { dir, path };
}

const originalPath = process.env['PATH'];
afterEach(() => {
  process.env['PATH'] = originalPath;
  while (dirs.length) rmSync(dirs.pop()!, { recursive: true, force: true });
});

describe('resolveBinaryPath', () => {
  it('finds an executable on $PATH', () => {
    const { dir, path } = fakeBin('fake-lsp-server');
    process.env['PATH'] = `${dir}${delimiter}${originalPath}`;
    expect(resolveBinaryPath('fake-lsp-server')).toBe(path);
  });

  it('returns the path unchanged when already absolute and it exists', () => {
    const { path } = fakeBin('fake-lsp-server-2');
    expect(resolveBinaryPath(path)).toBe(path);
  });

  it('returns undefined for a name not on $PATH', () => {
    process.env['PATH'] = '';
    expect(resolveBinaryPath('definitely-not-a-real-binary-xyz')).toBeUndefined();
  });

  it('returns undefined for an absolute path that does not exist', () => {
    expect(resolveBinaryPath('/no/such/path/binary')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/resolve-binary.test.ts`
Expected: FAIL — `Cannot find module './resolve-binary.js'`

- [ ] **Step 3: Implement**

```ts
// apps/cli/src/resolve-binary.ts
import { accessSync, constants, existsSync } from 'node:fs';
import { delimiter, isAbsolute, join } from 'node:path';

/**
 * Resolve a command's executable to an absolute filesystem path, the way a
 * shell would find it: an absolute/relative path (containing a path
 * separator) is checked directly; a bare name is searched across `$PATH`
 * (and, on Windows, each `$PATHEXT` extension). Returns `undefined` if
 * nothing is found — this is best-effort display info for `lsproxy status`,
 * not a spawn-time guarantee (the daemon/session resolve the command
 * themselves when actually launching a server).
 */
export function resolveBinaryPath(cmd: string): string | undefined {
  if (!cmd) return undefined;
  if (cmd.includes('/') || cmd.includes('\\') || isAbsolute(cmd)) {
    return existsSync(cmd) ? cmd : undefined;
  }

  const pathDirs = (process.env['PATH'] ?? '').split(delimiter).filter(Boolean);
  const extensions =
    process.platform === 'win32' ? (process.env['PATHEXT'] ?? '.EXE;.CMD;.BAT').split(';') : [''];

  for (const dir of pathDirs) {
    for (const ext of extensions) {
      const candidate = join(dir, cmd + ext);
      if (!existsSync(candidate)) continue;
      try {
        accessSync(candidate, constants.X_OK);
        return candidate;
      } catch {
        continue; // exists but not executable — keep searching
      }
    }
  }
  return undefined;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm exec vitest run apps/cli/src/resolve-binary.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/resolve-binary.ts apps/cli/src/resolve-binary.test.ts
git commit -m "feat(cli): add resolveBinaryPath, a which()-style executable resolver"
```

---

## Task 12: `resolve.ts` — track each configured server's config source

**Files:**
- Modify: `apps/cli/src/resolve.ts`
- Modify: `apps/cli/src/resolve.test.ts`

**Interfaces:**
- Produces: `SourcedServer` type (`ConfiguredServer & {source: string}`); `allConfiguredServersWithSource(root, scope?): SourcedServer[]`
- `allConfiguredServers()`'s public signature/behavior is unchanged — it becomes a one-line wrapper around the new function, so there is exactly one aggregation implementation.

- [ ] **Step 1: Write the failing tests**

Add to `apps/cli/src/resolve.test.ts` (same file, same mocks already at the top):

```ts
import { allConfiguredServersWithSource } from './resolve.js';

describe('allConfiguredServersWithSource', () => {
  it('tags a platform-adapter server with the adapter id', () => {
    const servers = allConfiguredServersWithSource('/p');
    const rust = servers.find((s) => s.fileExtensions['.rs'] === 'rust');
    expect(rust?.source).toBe('claude-code');
  });

  it('tags an lsp.json server with "lsp.json"', () => {
    vi.mocked(discoverServers).mockReturnValueOnce([
      { name: 'typescript', command: '"tsls"', fileExtensions: { '.ts': 'typescript' } }
    ]);
    const servers = allConfiguredServersWithSource('/p');
    const ts = servers.find((s) => s.fileExtensions['.ts'] === 'typescript');
    expect(ts?.source).toBe('lsp.json');
  });

  it('allConfiguredServers still returns the same servers via the wrapper', () => {
    const withSource = allConfiguredServersWithSource('/p');
    const plain = allConfiguredServers('/p');
    expect(plain.map((s) => s.command).sort()).toEqual(withSource.map((s) => s.command).sort());
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/resolve.test.ts`
Expected: FAIL — `allConfiguredServersWithSource is not exported`

- [ ] **Step 3: Implement**

In `apps/cli/src/resolve.ts`, add the exported type and widen `platformServers`'s return type to always attach `source` (every existing caller only reads `.command`/`.fileExtensions`, so this is a non-breaking superset change):

```ts
export interface SourcedServer extends ConfiguredServer {
  /** Adapter id this server config came from: 'lsp.json' or a platform
   * adapter id (e.g. 'claude-code', 'codex', 'copilot', 'vscode'). */
  source: string;
}
```

Change `platformServers`'s signature and its single `out.push(...)` call site:

```ts
function platformServers(root: string, scope: Scope): SourcedServer[] {
  const out: SourcedServer[] = [];
  for (const adapter of getAdapters()) {
    if (adapter.id === 'lspjson') continue;
    const base = homeForAdapter(adapter.id, root);
    if (!adapter.detect(scope, base)) continue;
    let servers: Record<string, LspServerEntry>;
    try {
      servers = adapter.read(scope, base);
    } catch {
      continue;
    }
    for (const [name, entry] of Object.entries(servers)) {
      if (!entry.command) continue;
      out.push({
        name,
        command: buildCommand(entry),
        fileExtensions: entry.fileExtensions ?? {},
        source: adapter.id
      });
    }
  }
  return out;
}
```

Add the new exported function right after `allConfiguredServers`'s current definition, then rewrite `allConfiguredServers` itself as a one-line wrapper:

```ts
/**
 * Every configured server across lsp.json + detected platforms, tagged with
 * which config produced it. Used by `lsproxy status` (§7 of the design doc)
 * to show a server's provenance. lsp.json wins on language collisions, same
 * dedup rule as `allConfiguredServers`.
 */
export function allConfiguredServersWithSource(root: string, scope: Scope = 'user'): SourcedServer[] {
  const core = discoverServers(root).map((s) => ({ ...s, source: 'lsp.json' }));
  const coreLangs = new Set(core.flatMap((s) => Object.values(s.fileExtensions)));
  const extra: SourcedServer[] = [];
  for (const s of platformServers(root, scope)) {
    const fileExtensions = Object.fromEntries(
      Object.entries(s.fileExtensions).filter(([, lang]) => !coreLangs.has(lang))
    );
    if (Object.keys(fileExtensions).length > 0) extra.push({ ...s, fileExtensions });
  }
  return [...core, ...extra];
}

export function allConfiguredServers(root: string, scope: Scope = 'user'): ConfiguredServer[] {
  return allConfiguredServersWithSource(root, scope);
}
```

Delete the old body of `allConfiguredServers` (the loop this replaces) — the new one-line version above is the entire function.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm exec vitest run apps/cli/src/resolve.test.ts`
Expected: PASS

- [ ] **Step 5: Run the full suite to check for regressions**

Run: `pnpm exec vitest run apps/cli/src`
Expected: PASS — every existing `allConfiguredServers` call site (Tasks 2, 9, 10) is unaffected since its signature and behavior didn't change.

- [ ] **Step 6: Commit**

```bash
git add apps/cli/src/resolve.ts apps/cli/src/resolve.test.ts
git commit -m "feat(cli): track each configured server's config source"
```

---

## Task 13: `groupServerStatus` — re-project per-language status by server

**Files:**
- Create: `apps/cli/src/server-groups.ts`
- Create: `apps/cli/src/server-groups.test.ts`

**Interfaces:**
- Consumes: `resolveBinaryPath` (Task 11), `SourcedServer` (Task 12), `tokenizeCommand` (`@lspeasy/core`), `LanguageStatus` (`@lsproxy/proxy`)
- Produces: `ServerLanguageStatus`, `ServerGroupStatus` types; `groupServerStatus(languages, sources): ServerGroupStatus[]`

`@lsproxy/proxy`'s `StatusReport.languages` is keyed per language; this groups those entries by their shared `command` string into one entry per server process, with every language it serves listed underneath. See design spec §7 for the "optimistic" mixed-status policy this implements.

- [ ] **Step 1: Write the failing tests**

```ts
// apps/cli/src/server-groups.test.ts
import { describe, it, expect } from 'vitest';
import { groupServerStatus } from './server-groups.js';
import type { LanguageStatus } from '@lsproxy/proxy';
import type { SourcedServer } from './resolve.js';

const SOURCES: SourcedServer[] = [
  { name: 'typescript', command: '"tsls"', fileExtensions: { '.ts': 'typescript' }, source: 'lsp.json' }
];

describe('groupServerStatus', () => {
  it('one language, one group, source looked up by command', () => {
    const languages: LanguageStatus[] = [
      { languageId: 'typescript', name: 'typescript', extensions: ['.ts'], command: '"tsls"', status: 'cold' }
    ];
    const [group] = groupServerStatus(languages, SOURCES);
    expect(group?.source).toBe('lsp.json');
    expect(group?.status).toBe('cold');
    expect(group?.mixed).toBe(false);
    expect(group?.languages).toHaveLength(1);
  });

  it('two languages sharing a command become one group', () => {
    const languages: LanguageStatus[] = [
      { languageId: 'typescript', name: 'ts', extensions: ['.ts'], command: '"multi-lang"', status: 'running', pid: 1 },
      { languageId: 'javascript', name: 'js', extensions: ['.js'], command: '"multi-lang"', status: 'running', pid: 1 }
    ];
    const groups = groupServerStatus(languages, []);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.languages.map((l) => l.languageId).sort()).toEqual(['javascript', 'typescript']);
  });

  it('mixed status: optimistic headline (running wins), mixed flag set', () => {
    const languages: LanguageStatus[] = [
      { languageId: 'typescript', name: 'ts', extensions: ['.ts'], command: '"multi-lang"', status: 'cold' },
      { languageId: 'javascript', name: 'js', extensions: ['.js'], command: '"multi-lang"', status: 'running', pid: 7 }
    ];
    const [group] = groupServerStatus(languages, []);
    expect(group?.mixed).toBe(true);
    expect(group?.status).toBe('running');
    expect(group?.pid).toBe(7);
  });

  it('source falls back to "(unconfigured)" when no match', () => {
    const languages: LanguageStatus[] = [
      { languageId: 'go', name: 'go', extensions: ['.go'], command: '"gopls"', status: 'cold' }
    ];
    const [group] = groupServerStatus(languages, []);
    expect(group?.source).toBe('(unconfigured)');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/server-groups.test.ts`
Expected: FAIL — `Cannot find module './server-groups.js'`

- [ ] **Step 3: Implement**

```ts
// apps/cli/src/server-groups.ts
import { basename } from 'node:path';
import type { LanguageStatus } from '@lsproxy/proxy';
import { tokenizeCommand } from '@lspeasy/core';
import { resolveBinaryPath } from './resolve-binary.js';
import type { SourcedServer } from './resolve.js';

export interface ServerLanguageStatus {
  languageId: string;
  extensions: string[];
  status: 'running' | 'cold';
  healthy?: boolean;
  pid?: number;
  uptimeMs?: number;
  openDocuments?: number;
  requestsServed?: number;
}

export interface ServerGroupStatus {
  /** Display name — the resolved binary's basename (e.g.
   * "typescript-language-server"), not the lsp.json config key. */
  name: string;
  command: string;
  resolvedPath?: string;
  source: string;
  status: 'running' | 'cold';
  healthy?: boolean;
  /** True when this group's members disagree on status — see the design
   * doc's "optimistic" aggregation policy. */
  mixed: boolean;
  pid?: number;
  uptimeMs?: number;
  openDocuments?: number;
  requestsServed?: number;
  languages: ServerLanguageStatus[];
}

/**
 * Group per-language status entries by their server command — one entry per
 * distinct command, with every language it serves listed underneath.
 * "Optimistic" aggregation: the group is `running` if ANY member is
 * running, and its aggregate pid/uptime/stats come from that running
 * member; `mixed: true` flags when members disagree so the renderer can
 * show per-language detail instead of one clean status for the whole group.
 */
export function groupServerStatus(
  languages: readonly LanguageStatus[],
  sources: readonly SourcedServer[]
): ServerGroupStatus[] {
  const sourceByCommand = new Map(sources.map((s) => [s.command, s.source]));
  const groups = new Map<string, ServerGroupStatus>();

  for (const lang of languages) {
    const entry: ServerLanguageStatus = {
      languageId: lang.languageId,
      extensions: lang.extensions,
      status: lang.status,
      healthy: lang.healthy,
      pid: lang.pid,
      uptimeMs: lang.uptimeMs,
      openDocuments: lang.openDocuments,
      requestsServed: lang.requestsServed
    };

    let group = groups.get(lang.command);
    if (!group) {
      const [cmdToken] = tokenizeCommand(lang.command);
      const resolvedPath = cmdToken ? resolveBinaryPath(cmdToken) : undefined;
      group = {
        name: basename(resolvedPath ?? cmdToken ?? lang.command),
        command: lang.command,
        resolvedPath,
        source: sourceByCommand.get(lang.command) ?? '(unconfigured)',
        status: entry.status,
        healthy: entry.healthy,
        mixed: false,
        pid: entry.pid,
        uptimeMs: entry.uptimeMs,
        openDocuments: entry.openDocuments,
        requestsServed: entry.requestsServed,
        languages: []
      };
      groups.set(lang.command, group);
    } else if (group.status !== entry.status) {
      group.mixed = true;
      if (entry.status === 'running') {
        group.status = 'running';
        group.healthy = entry.healthy;
        group.pid = entry.pid;
        group.uptimeMs = entry.uptimeMs;
        group.openDocuments = entry.openDocuments;
        group.requestsServed = entry.requestsServed;
      }
    }
    group.languages.push(entry);
  }

  return [...groups.values()];
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm exec vitest run apps/cli/src/server-groups.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/server-groups.ts apps/cli/src/server-groups.test.ts
git commit -m "feat(cli): add groupServerStatus, re-projecting per-language status by server"
```

---

## Task 14: `renderStatus` — grouped-by-server rendering in `help.ts`

**Files:**
- Modify: `apps/cli/src/help.ts`
- Modify: `apps/cli/src/help.test.ts`

**Interfaces:**
- Consumes: `ServerGroupStatus` (Task 13), `daemonStatusLine`/`SYMBOLS` (already in `help.ts`)
- Produces: `renderStatus(servers: ServerGroupStatus[], daemon: StatusReport['daemon'], fmt: Formatter): string`

- [ ] **Step 1: Write the failing tests**

Add to `apps/cli/src/help.test.ts`:

```ts
import type { ServerGroupStatus } from './server-groups.js';

function group(overrides: Partial<ServerGroupStatus> = {}): ServerGroupStatus {
  return {
    name: 'typescript-language-server',
    command: '"tsls"',
    resolvedPath: '/usr/local/bin/tsls',
    source: 'lsp.json',
    status: 'running',
    healthy: true,
    mixed: false,
    pid: 9,
    uptimeMs: 4000,
    openDocuments: 2,
    requestsServed: 11,
    languages: [{ languageId: 'typescript', extensions: ['.ts', '.tsx'], status: 'running', healthy: true, pid: 9 }],
    ...overrides
  };
}

describe('renderStatus', () => {
  it('shows name, location, source, uptime, and languages for a healthy running server', () => {
    const out = renderStatus([group()], null, fmt);
    expect(out).toContain('typescript-language-server');
    expect(out).toContain('/usr/local/bin/tsls');
    expect(out).toContain('lsp.json');
    expect(out).toMatch(/4s/);
    expect(out).toContain('typescript (.ts .tsx)');
  });

  it('flags a command that could not be resolved on $PATH', () => {
    const out = renderStatus([group({ resolvedPath: undefined, status: 'cold', pid: undefined })], null, fmt);
    expect(out).toMatch(/not found on \$PATH/);
  });

  it('shows "not started" and no uptime line for a cold server', () => {
    const out = renderStatus(
      [group({ status: 'cold', pid: undefined, uptimeMs: undefined, healthy: undefined })],
      null,
      fmt
    );
    expect(out).toMatch(/not started/);
  });

  it('mixed status shows a per-language breakdown instead of the flat languages line', () => {
    const mixed = group({
      mixed: true,
      languages: [
        { languageId: 'typescript', extensions: ['.ts'], status: 'running', pid: 9 },
        { languageId: 'javascript', extensions: ['.js'], status: 'cold' }
      ]
    });
    const out = renderStatus([mixed], null, fmt);
    expect(out).toMatch(/mixed/);
    expect(out).toContain('typescript');
    expect(out).toContain('javascript');
  });

  it('includes the daemon status line', () => {
    const out = renderStatus(
      [group()],
      { pid: 123, uptimeMs: 12000, root: '/p', sessions: 1, backends: 2 },
      fmt
    );
    expect(out).toMatch(/daemon: up/);
    expect(out).toContain('pid 123');
  });
});
```

Add the imports to the top of `help.test.ts`: `renderStatus` alongside the existing `./help.js` import, and `import type { ServerGroupStatus } from './server-groups.js';`.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/help.test.ts`
Expected: FAIL — `renderStatus is not exported`

- [ ] **Step 3: Implement**

Add to `apps/cli/src/help.ts`, near `renderTopLevel` (it reuses `SYMBOLS` and `daemonStatusLine`, already in this file):

```ts
import type { ServerGroupStatus } from './server-groups.js';

/** Grouped-by-server view for `lsproxy status` — see design doc §7. */
export function renderStatus(
  servers: ServerGroupStatus[],
  daemon: StatusReport['daemon'],
  fmt: Formatter
): string {
  const serverLines = servers.flatMap((s) => {
    const lines: string[] = [];
    const mark = s.status === 'running' ? (s.healthy === false ? SYMBOLS.degraded : SYMBOLS.running) : SYMBOLS.cold;
    const statusLabel =
      s.status === 'running'
        ? fmt.green('running') +
          (s.mixed ? fmt.dim(' (mixed — see below)') : s.healthy === false ? ` ${fmt.yellow('· unhealthy')}` : ` · ${fmt.dim('healthy')}`)
        : fmt.dim('not started');
    lines.push(`  ${mark} ${fmt.cyan(s.name)}  ${statusLabel}`);
    lines.push(
      `    ${fmt.dim('location')}   ${s.resolvedPath ?? `${fmt.dim(s.command)}  ${fmt.yellow('(not found on $PATH)')}`}`
    );
    lines.push(`    ${fmt.dim('source')}     ${s.source}`);
    if (s.status === 'running' && !s.mixed) {
      lines.push(
        `    ${fmt.dim('uptime')}     ${Math.round((s.uptimeMs ?? 0) / 1000)}s · ${s.requestsServed ?? 0} reqs · ${s.openDocuments ?? 0} open docs`
      );
    }
    if (s.mixed) {
      lines.push(`    ${fmt.dim('languages')}`);
      for (const l of s.languages) {
        const lMark = l.status === 'running' ? SYMBOLS.running : SYMBOLS.cold;
        const lLabel =
          l.status === 'running'
            ? `${fmt.green('running')} · pid ${l.pid} · up ${Math.round((l.uptimeMs ?? 0) / 1000)}s`
            : fmt.dim('not started');
        lines.push(`      ${lMark} ${l.languageId}  ${lLabel}`);
      }
    } else {
      const langList = s.languages.map((l) => `${l.languageId} (${l.extensions.join(' ')})`).join('  ');
      lines.push(`    ${fmt.dim('languages')}  ${langList}`);
    }
    return lines;
  });

  return [
    fmt.bold('lsproxy status'),
    '',
    fmt.bold('Servers:'),
    ...(serverLines.length ? serverLines : [fmt.dim('  (none configured)')]),
    '',
    daemonStatusLine(daemon, fmt),
    ''
  ].join('\n');
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm exec vitest run apps/cli/src/help.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/help.ts apps/cli/src/help.test.ts
git commit -m "feat(cli): render lsproxy status grouped by server"
```

---

## Task 15: `status-command.ts` — wire resolution, grouping, and rendering together

**Files:**
- Create: `apps/cli/src/status-command.ts`
- Create: `apps/cli/src/status-command.test.ts`

**Interfaces:**
- Consumes: `allConfiguredServersWithSource` (Task 12), `groupServerStatus` (Task 13), `renderStatus` (Task 14), `fetchDaemonStatus` (`connect.ts`), `coldStatusReport` (`@lsproxy/proxy`)
- Produces: `buildStatusCommand(flags: GlobalFlags): Command`

- [ ] **Step 1: Write the failing test**

```ts
// apps/cli/src/status-command.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('./connect.js', () => ({ fetchDaemonStatus: vi.fn(async () => null) }));
vi.mock('./resolve.js', () => ({
  allConfiguredServersWithSource: () => [
    { name: 'typescript', command: '"tsls"', fileExtensions: { '.ts': 'typescript' }, source: 'lsp.json' }
  ]
}));
vi.mock('@lsproxy/proxy', () => ({
  coldStatusReport: (
    servers: Array<{ name: string; command: string; fileExtensions: Record<string, string> }>
  ) => ({
    daemon: null,
    languages: servers.flatMap((s) =>
      Object.entries(s.fileExtensions).map(([ext, languageId]) => ({
        languageId,
        name: s.name,
        extensions: [ext],
        command: s.command,
        status: 'cold' as const
      }))
    )
  })
}));

import { buildStatusCommand } from './status-command.js';
import type { GlobalFlags } from './io.js';

afterEach(() => vi.restoreAllMocks());

const FLAGS: GlobalFlags = {
  server: '',
  root: '/project',
  dryRun: false,
  json: true,
  verbose: false,
  waitMs: 0,
  allowOutsideRoot: false,
  noProxy: false,
  overwrite: false
};

describe('buildStatusCommand', () => {
  it('--json output is grouped by server, with source and a languages array', async () => {
    const cmd = buildStatusCommand(FLAGS);
    const chunks: string[] = [];
    const spy = vi.spyOn(process.stdout, 'write').mockImplementation(((s: string) => {
      chunks.push(s);
      return true;
    }) as never);
    try {
      await cmd.parseAsync([], { from: 'user' });
    } finally {
      spy.mockRestore();
    }
    const parsed = JSON.parse(chunks.join('')) as {
      daemon: unknown;
      servers: Array<{ name: string; source: string; languages: Array<{ languageId: string }> }>;
    };
    expect(parsed.servers).toHaveLength(1);
    expect(parsed.servers[0]!.source).toBe('lsp.json');
    expect(parsed.servers[0]!.languages.map((l) => l.languageId)).toContain('typescript');
    expect(parsed.daemon).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/status-command.test.ts`
Expected: FAIL — `Cannot find module './status-command.js'`

- [ ] **Step 3: Implement**

```ts
// apps/cli/src/status-command.ts
import { Command } from 'commander';
import { coldStatusReport } from '@lsproxy/proxy';
import { allConfiguredServersWithSource } from './resolve.js';
import { fetchDaemonStatus } from './connect.js';
import { groupServerStatus } from './server-groups.js';
import { renderStatus } from './help.js';
import { createFormatter } from './format.js';
import type { GlobalFlags } from './io.js';

/** Real Commander command for `lsproxy status` — every configured language
 * server grouped by process, with live status (if the daemon is up),
 * resolved binary location, and config source. Never connects an LSP
 * session. */
export function buildStatusCommand(flags: GlobalFlags): Command {
  return new Command('status')
    .description('Show configured language servers grouped by process, with location and config source')
    .action(async () => {
      const live = await fetchDaemonStatus(flags.root);
      const report = live ?? coldStatusReport(allConfiguredServersWithSource(flags.root));
      const sources = allConfiguredServersWithSource(flags.root);
      const servers = groupServerStatus(report.languages, sources);

      if (flags.json) {
        process.stdout.write(JSON.stringify({ daemon: report.daemon, servers }) + '\n');
      } else {
        const color = process.stdout.isTTY === true && !process.env['NO_COLOR'];
        process.stdout.write(renderStatus(servers, report.daemon, createFormatter(color)));
      }
    });
}
```

Note `coldStatusReport` accepts `ConfiguredServer[]` — passing `SourcedServer[]` (a superset) works structurally without a cast.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm exec vitest run apps/cli/src/status-command.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/status-command.ts apps/cli/src/status-command.test.ts
git commit -m "feat(cli): add lsproxy status, wiring resolution/grouping/rendering together"
```

---

## Task 16: Wire `status` into `main()`, `program.ts`, and the top-level Commands list

**Files:**
- Modify: `apps/cli/src/cli.ts` (the meta-command branch Task 10 produced)
- Modify: `apps/cli/src/program.ts` (the metadata tree Task 8 produced)
- Modify: `apps/cli/src/help.ts` (the `Commands:` list Task 9 produced)
- Modify: `apps/cli/src/help.test.ts`

- [ ] **Step 1: Write the failing test**

Add to `apps/cli/src/help.test.ts`'s existing `'shows base usage + non-namespace commands...'` test:

```ts
    expect(out).toMatch(/status .*grouped by process/);
```

(append this line to that existing test's assertions — same `out` variable already in scope there).

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/help.test.ts`
Expected: FAIL — no `status` entry in the `Commands:` section yet

- [ ] **Step 3: Add `status` to the top-level Commands list**

In `apps/cli/src/help.ts`'s `renderTopLevel`, add a row to the `commands` array (right after the `daemon` row) — description matches `buildStatusCommand`'s own description (Task 15) so the two never drift apart:

```ts
    row('daemon <start|stop|status>', 'manage the per-root proxy daemon'),
    row('status', 'servers grouped by process, with location and config source'),
```

- [ ] **Step 4: Wire `status` into `cli.ts`'s meta-command branch**

In `apps/cli/src/cli.ts`, add the import:

```ts
import { buildStatusCommand } from './status-command.js';
```

Change the meta-command `if` in `main()` from Task 10:

```ts
  if (positionals[0] === 'config' || positionals[0] === 'daemon') {
```

to:

```ts
  if (positionals[0] === 'config' || positionals[0] === 'daemon' || positionals[0] === 'status') {
```

and add one line inside that block, alongside the existing `program.addCommand(...)` calls:

```ts
    program.addCommand(buildStatusCommand(flags));
```

- [ ] **Step 5: Add `status` to `program.ts`'s metadata tree**

In `apps/cli/src/program.ts`, add the import `import { buildStatusCommand } from './status-command.js';` and, next to the existing `program.addCommand(buildConfigCommand(stubFlags));` / `buildDaemonCommand(...)` lines, add:

```ts
  program.addCommand(buildStatusCommand(stubFlags));
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `pnpm exec vitest run apps/cli/src`
Expected: PASS (full suite)

- [ ] **Step 7: Commit**

```bash
git add apps/cli/src/cli.ts apps/cli/src/program.ts apps/cli/src/help.ts apps/cli/src/help.test.ts
git commit -m "feat(cli): wire lsproxy status into dispatch, metadata tree, and top-level help"
```

---

## Task 17: README grammar update

**Files:**
- Modify: `apps/cli/README.md`

- [ ] **Step 1: Update the Quick Start and Usage sections**

Replace the `## Quick Start` code block's commands and the `## Usage` section's grammar line and namespace-first examples with the unified grammar. Concretely:

- `lsproxy textDocument rename --dry-run src/auth/login.ts 42:15 "signIn"` → `lsproxy src/auth/login.ts textDocument rename --dry-run 42:15 "signIn"`
- `lsproxy textDocument references src/auth/login.ts 42:15` → `lsproxy src/auth/login.ts textDocument references 42:15`
- `lsproxy textDocument codeAction src/foo.ts 12:1-12:20` → `lsproxy src/foo.ts textDocument codeAction 12:1-12:20`
- The `## Usage` grammar line `lsproxy <namespace> <command> [args] [flags]` → `lsproxy <language-or-file> <namespace> <request> [args] [flags]`
- The bare namespace-first example block (`lsproxy textDocument hover src/foo.ts 12:7` etc.) → the file-first form, e.g. `lsproxy src/foo.ts textDocument hover 12:7`
- `lsproxy workspace symbol MyClass` → `lsproxy typescript workspace symbol MyClass` (no file to anchor a query-only request, so the language id form is used)
- `lsproxy call textDocument/semanticTokens/full --params '...'` → `lsproxy typescript call textDocument/semanticTokens/full --params '...'`

- [ ] **Step 2: Document `status`**

Add a bullet to the `## Features` list:

```markdown
- **Server visibility** — `lsproxy status` groups every configured server by process, showing its resolved binary location, config source (lsp.json, Claude Code, Codex, Copilot CLI), live connection status/uptime, and which languages it serves
```

- [ ] **Step 3: Update the "Help output" section**

The `Depth 0`–`Depth 3` descriptions currently say `lsproxy --help <language>` etc. Add a short note above them:

```markdown
The same tree is used for real dispatch: `lsproxy <language-or-file> <namespace> <request>`
without enough args to actually run shows the same view as the equivalent
`--help` invocation below.
```

- [ ] **Step 4: Verify by rendering**

Run: `pnpm --filter @lsproxy/cli run build && node dist/cli.js --help` (from `apps/cli`) and confirm the printed Usage/Explore/Global-options sections match what the README now shows. Also run `node dist/cli.js status` and confirm it matches the new Features bullet.

- [ ] **Step 5: Commit**

```bash
git add apps/cli/README.md
git commit -m "docs(cli): update README to the unified language-or-file grammar; document status"
```

---

## Task 18: Full-suite verification and manual smoke test

**Files:** none (verification only)

- [ ] **Step 1: Full workspace test/type-check/lint**

Run: `pnpm exec vitest run apps/cli/src && pnpm --filter @lsproxy/cli run type-check && pnpm exec oxlint apps/cli`
Expected: all green

- [ ] **Step 2: Manual smoke test against a real TypeScript project**

```bash
cd apps/cli && pnpm run build
cd /tmp && mkdir -p smoke && cd smoke
printf '{"lspServers":{"typescript":{"command":"typescript-language-server --stdio","fileExtensions":{".ts":"typescript"}}}}' > lsp.json
printf 'export function add(a: number, b: number) { return a + b; }\n' > foo.ts
node /path/to/apps/cli/dist/cli.js foo.ts textDocument hover 1:17          # Form B
node /path/to/apps/cli/dist/cli.js typescript textDocument hover foo.ts 1:17  # Form A
node /path/to/apps/cli/dist/cli.js typescript textDocument hover             # incomplete → drill-down view, not a crash
node /path/to/apps/cli/dist/cli.js                                          # bare → top-level view with corrected Usage/Explore/Global options
node /path/to/apps/cli/dist/cli.js config list
node /path/to/apps/cli/dist/cli.js daemon status
node /path/to/apps/cli/dist/cli.js status
```

Expected: the two hover invocations (Form A and Form B) print the same hover result; the incomplete call prints the parameter schema/example instead of a Commander stack trace or raw error; the bare invocation's Usage section reads `lsproxy <language-or-file> <namespace> <request> [args] [flags]` and includes a `Global options:` section; `config list`, `daemon status`, and `status` all work without connecting to any language server (fast, no hang); `status` shows one entry named `typescript-language-server` (not the lsp.json key `typescript`) with `source: lsp.json`, resolved to a real absolute path (or a clear "not found on $PATH" note if it isn't actually installed in the smoke environment), and lists `typescript` under its `languages`.

- [ ] **Step 3: Report results**

If anything in Step 2 doesn't match, stop and fix it (do not report success) — this is the one step in the plan that exercises the real, end-to-end binary rather than mocked units.

---

## Self-Review Notes

- **Spec coverage:** Parser unification (Task 10 replaces `parseArgs`), `config`/`daemon` as real Commander commands (Tasks 6–8), global-option single source of truth + help-text consistency (Tasks 1, 5, 9), unified language-or-file grammar with anchor-file reuse (Tasks 2–4, 10), incomplete-call drill-down fallback (Task 10), `lsproxy status` grouped by server with config-source tracking and mixed-status handling (§7 of the spec — Tasks 11–16), README update (Task 17) — every section of `docs/superpowers/specs/2026-07-06-cli-commander-unification-design.md` maps to a task.
- **Type consistency:** `EntryResolution` (Task 2) is the type both `runHelp` and `runDispatch` (Task 10) destructure (`entry.serverCommand`, `entry.languageId`, `entry.fromPlatform`, `entry.anchorFile`) — verified consistent across both call sites. `zodToCommander`/`marshalParams`/`buildCommandTree`'s `anchorFile?: string` parameter name and position (always last) is consistent from Task 4 through Task 10. `SourcedServer` (Task 12) flows into `groupServerStatus` (Task 13) as its `sources` param and into `status-command.ts` (Task 15) via `allConfiguredServersWithSource` — verified the field name is `source` (singular) consistently, not `origin`/`platform`. `ServerGroupStatus` (Task 13) is the type both `renderStatus` (Task 14) and `status-command.ts` (Task 15) share verbatim (no separate DTO) — `resolvedPath`/`healthy`/`pid`/`uptimeMs`/`openDocuments`/`requestsServed` are all optional in both producer and consumer.
- **Task ordering:** Tasks 11–16 (the `status` command) were appended after Task 10 rather than interleaved, since Task 10 already reads as a complete, self-contained rewrite of `cli.ts`'s `main()`. Within the status feature, Tasks 11–12 (pure resolution helpers) come before Task 13 (grouping, which consumes both), which comes before Task 14 (rendering, which consumes the grouped shape) and Task 15 (wiring, which consumes rendering) — each task only depends on ones already done. Task 16 makes small, explicitly-located follow-up edits against the code Tasks 8/9/10 already produced (one `if` condition in `cli.ts`, one `addCommand` line in `program.ts`, one `row(...)` in `help.ts`) rather than requiring those tasks to be rewritten — verified each edit names the exact prior line it's changing.
- **Known limitation (documented, not fixed):** `lsproxy <language> call` (no method) still shows an empty `requests: []` in `--json` drill-down mode, since `call` has no sub-commands for `drillDownJson`'s depth-1 branch to list — this is pre-existing behavior (the `call` command already sat at the same tree level before this change) and out of scope. `resolveBinaryPath` is best-effort display info only (Task 11) — it does not guarantee the daemon will successfully spawn that binary; a `PATH` change between `status` and the next real dispatch could make them disagree, which is acceptable since `status` is explicitly a diagnostic view, not a pre-flight check. `groupServerStatus`'s (Task 13) grouping-by-command is not structurally guaranteed to have consistent pid/status across members sharing a command (the daemon's backend pool is keyed per-languageId, not per-command) — handled via the documented optimistic/mixed-flag policy, not eliminated, since fixing it properly would mean changing `@lsproxy/proxy`'s backend pool, out of scope for this plan.
