# Organize Imports Polyfill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a third `@lsproxy/polyfill` polyfill, `organizeImports`, that synthesizes a composite `source.organizeImports` code action from per-diagnostic import-related quickfixes, for backends that support pull-diagnostics and quickfixes but never implement the dedicated `source.organizeImports` batch action.

**Architecture:** `organizeImports` follows the exact same shape as the existing `fixAll` polyfill (`packages/polyfill/src/fix-all.ts`): fetch diagnostics via `textDocument/diagnostic`, request a per-diagnostic `quickfix` via `textDocument/codeAction`, merge the selected fixes' edits into one non-overlapping edit map, and return a single synthesized `CodeAction`. The two polyfills differ only in (a) which per-diagnostic fix they select — `fixAll` takes whatever fix comes back (preferring `isPreferred`), `organizeImports` additionally filters to fixes whose `title` looks import-related — and (b) the emitted action's `title`/`kind`. Because this shared "fetch diagnostics → per-diagnostic quickfix → resolve command-only fixes → merge non-overlapping edits" sequence is real, non-trivial logic (position comparison, range-overlap detection, the command-only resolve fallback), this plan extracts it into `packages/polyfill/src/quickfix-aggregation.ts` in Task 1, refactoring `fix-all.ts` to use it with zero behavior change (its existing test suite is the regression net), before building `organize-imports.ts` on top of the same shared module in Task 2. This keeps the two polyfills DRY instead of duplicating ~60 lines of merge/resolve logic that would otherwise need to evolve in lockstep.

**Import-fix detection:** there is no reliable, portable diagnostic *code* to filter on across language servers (unused-import and missing-import diagnostic codes are entirely server-specific: TS6133, F401, unused-imports, etc.). Instead, `organizeImports` filters candidate fixes by **title heuristic** — a case-insensitive match for the word "import" in the `CodeAction.title` returned by the backend's own `textDocument/codeAction` response (e.g. "Add all missing imports", "Remove unused import", "Organize Imports"). This works because the filter runs on the backend's own human-readable title, not on a piece of per-language metadata this package would otherwise have to special-case, and every mainstream server's import-related quickfix titles do contain the word "import".

**Tech Stack:** TypeScript 5, Vitest, `@lspeasy/core` LSP protocol types, `@lspeasy/client`'s `LSPClient`. No new dependencies.

## Global Constraints

- TypeScript strict mode, no `any` (project-wide convention).
- oxlint / oxfmt must pass with zero new warnings introduced by this feature (pre-existing warnings elsewhere in the repo are out of scope).
- Every new/modified file keeps the `// packages/polyfill/src/<file>.ts` path-header comment convention already used in this package.
- `CodeActionPolyfill.appliesTo` is checked once per backend from its **real, unpatched** capabilities (per the interface's own doc comment in `packages/polyfill/src/types.ts`) — `organizeImports.appliesTo` must follow this contract exactly like `fixAll.appliesTo` does.
- Do not add a `patchCapabilities` to `organizeImports` — `fixAll` deliberately has none either (it doesn't advertise `source.fixAll` in `codeActionKinds`), so `organizeImports` should stay symmetric with its sibling rather than introducing an inconsistent new pattern.
- Do not manually add a `.changeset/*.md` file for this feature. The `Auto-generate Changeset` GitHub Actions workflow (fixed in PR #189 this session) will scope a changeset correctly to `@lsproxy/polyfill` alone once a PR is opened — verify its generated changeset once CI runs (package scope = `@lsproxy/polyfill` only, type = `minor` since this is a `feat`), and only intervene if it's wrong.

---

### Task 1: Extract shared quickfix-aggregation logic from `fix-all.ts`

**Files:**
- Create: `packages/polyfill/src/quickfix-aggregation.ts`
- Modify: `packages/polyfill/src/fix-all.ts`
- Test: `packages/polyfill/src/fix-all.test.ts` (existing file — **do not modify it in this task**; it is the regression net proving the refactor is behavior-preserving)

**Interfaces:**
- Produces: `isCodeAction(item: Command | CodeAction): item is CodeAction` — re-exported, unchanged behavior from the current private helper in `fix-all.ts`.
- Produces: `aggregateQuickFixes(params: CodeActionParams, backend: LSPClient, selectFix: (candidates: (Command | CodeAction)[]) => CodeAction | undefined): Promise<{ changes: Record<string, TextEdit[]>; mergedCount: number }>` — the extracted diagnostic-fetch + per-diagnostic-fix-selection + resolve-fallback + merge loop. Task 2 consumes this directly.
- Produces: `comparePositions`, `rangesOverlap`, `mergeEdits` — exported for potential reuse/testing, unchanged behavior.

- [ ] **Step 1: Create the shared module with the extracted logic**

Create `packages/polyfill/src/quickfix-aggregation.ts`:

```ts
// packages/polyfill/src/quickfix-aggregation.ts
import type {
  CodeAction,
  CodeActionParams,
  Command,
  Diagnostic,
  Position,
  ServerCapabilities,
  TextEdit
} from '@lspeasy/core';
import type { LSPClient } from '@lspeasy/client';

export function isCodeAction(item: Command | CodeAction): item is CodeAction {
  return typeof item.command !== 'string';
}

export function comparePositions(a: Position, b: Position): number {
  return a.line !== b.line ? a.line - b.line : a.character - b.character;
}

export function rangesOverlap(a: TextEdit['range'], b: TextEdit['range']): boolean {
  return comparePositions(a.start, b.end) < 0 && comparePositions(b.start, a.end) < 0;
}

export function mergeEdits(existing: TextEdit[], incoming: TextEdit[]): TextEdit[] {
  const merged = [...existing];
  for (const edit of incoming) {
    if (merged.some((m) => rangesOverlap(m.range, edit.range))) continue;
    merged.push(edit);
  }
  return merged;
}

function supportsResolve(capabilities: ServerCapabilities): boolean {
  const provider = capabilities.codeActionProvider;
  return typeof provider === 'object' && provider.resolveProvider === true;
}

export interface AggregationResult {
  changes: Record<string, TextEdit[]>;
  mergedCount: number;
}

/**
 * Fetches diagnostics for the document, requests a `quickfix` for each one,
 * lets `selectFix` choose which candidate (if any) to keep, resolves
 * command-only fixes via `codeAction/resolve` when the backend supports it,
 * and merges every chosen fix's edits into one non-overlapping edit map.
 */
export async function aggregateQuickFixes(
  params: CodeActionParams,
  backend: LSPClient,
  selectFix: (candidates: (Command | CodeAction)[]) => CodeAction | undefined
): Promise<AggregationResult> {
  const report = (await (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(
    'textDocument/diagnostic',
    { textDocument: params.textDocument }
  )) as { kind: 'full' | 'unchanged'; items?: Diagnostic[] };
  const diagnostics = report.kind === 'full' ? (report.items ?? []) : [];

  const capabilities = backend.getServerCapabilities() ?? {};
  const changes: Record<string, TextEdit[]> = {};
  let mergedCount = 0;

  for (const diagnostic of diagnostics) {
    const candidates = (await (
      backend.sendRequest as (m: string, p: unknown) => Promise<unknown>
    )('textDocument/codeAction', {
      textDocument: params.textDocument,
      range: diagnostic.range,
      context: { diagnostics: [diagnostic], only: ['quickfix'] }
    })) as (Command | CodeAction)[] | null;

    let fix = candidates ? selectFix(candidates) : undefined;
    if (fix && !fix.edit?.changes && fix.command && supportsResolve(capabilities)) {
      fix = (await (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(
        'codeAction/resolve',
        fix
      )) as CodeAction;
    }
    if (!fix?.edit?.changes) continue;

    let mergedAny = false;
    for (const [uri, edits] of Object.entries(fix.edit.changes)) {
      if (edits.length === 0) continue;
      changes[uri] = mergeEdits(changes[uri] ?? [], edits);
      mergedAny = true;
    }
    if (mergedAny) mergedCount += 1;
  }

  return { changes, mergedCount };
}
```

- [ ] **Step 2: Refactor `fix-all.ts` to use the shared module**

Replace the full contents of `packages/polyfill/src/fix-all.ts` with:

```ts
// packages/polyfill/src/fix-all.ts
import type { CodeActionParams, Command, CodeAction, ServerCapabilities } from '@lspeasy/core';
import type { LSPClient } from '@lspeasy/client';
import type { CodeActionPolyfill } from './types.js';
import { aggregateQuickFixes, isCodeAction } from './quickfix-aggregation.js';

function hasDiagnosticProvider(capabilities: ServerCapabilities): boolean {
  return Boolean(capabilities.diagnosticProvider);
}

function alreadyAdvertisesFixAll(capabilities: ServerCapabilities): boolean {
  const provider = capabilities.codeActionProvider;
  return (
    typeof provider === 'object' &&
    Array.isArray(provider.codeActionKinds) &&
    provider.codeActionKinds.includes('source.fixAll' as never)
  );
}

function requestsFixAll(params: CodeActionParams): boolean {
  const only = params.context.only;
  if (!only) return false;
  return only.some((kind) => kind === 'source.fixAll' || kind === 'source');
}

function pickFix(candidates: (Command | CodeAction)[]): CodeAction | undefined {
  const actions = candidates.filter(isCodeAction);
  return actions.find((a) => a.isPreferred) ?? actions[0];
}

export const fixAll: CodeActionPolyfill = {
  id: 'fix-all',

  appliesTo(capabilities) {
    return (
      Boolean(capabilities.codeActionProvider) &&
      hasDiagnosticProvider(capabilities) &&
      !alreadyAdvertisesFixAll(capabilities)
    );
  },

  async augmentCodeActions(actions, params, backend: LSPClient) {
    if (!requestsFixAll(params)) return actions;

    const { changes, mergedCount } = await aggregateQuickFixes(params, backend, pickFix);
    if (mergedCount === 0) return actions;

    return [
      ...actions,
      {
        title: 'Fix all auto-fixable problems',
        kind: 'source.fixAll',
        edit: { changes }
      }
    ];
  }
};
```

- [ ] **Step 3: Run the existing fix-all test suite to confirm zero behavior change**

Run: `pnpm vitest run packages/polyfill/src/fix-all.test.ts`
Expected: PASS — all 12 existing tests green, unchanged. If anything fails, the refactor introduced a behavior difference; fix `quickfix-aggregation.ts` or `fix-all.ts` until this file passes without being modified itself.

- [ ] **Step 4: Type-check and lint**

Run: `pnpm --filter @lsproxy/polyfill type-check && pnpm --filter @lsproxy/polyfill build`
Expected: both succeed with no errors.

Run: `pnpm run lint`
Expected: no new warnings beyond the pre-existing ones already present on `develop` (unrelated files).

- [ ] **Step 5: Commit**

```bash
git add packages/polyfill/src/quickfix-aggregation.ts packages/polyfill/src/fix-all.ts
git commit -m "refactor(polyfill): extract shared quickfix aggregation from fix-all"
```

---

### Task 2: Implement the `organizeImports` polyfill with TDD unit tests

**Files:**
- Create: `packages/polyfill/src/organize-imports.ts`
- Create: `packages/polyfill/src/organize-imports.test.ts`

**Interfaces:**
- Consumes: `aggregateQuickFixes`, `isCodeAction` from `packages/polyfill/src/quickfix-aggregation.js` (Task 1).
- Consumes: `CodeActionPolyfill` from `packages/polyfill/src/types.js` (existing, unchanged).
- Produces: `export const organizeImports: CodeActionPolyfill` with `id: 'organize-imports'` — Task 3 registers this.

- [ ] **Step 1: Write the failing appliesTo tests**

Create `packages/polyfill/src/organize-imports.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import type { ServerCapabilities, CodeActionParams, CodeAction, Command } from '@lspeasy/core';
import { organizeImports } from './organize-imports.js';

describe('organizeImports.appliesTo', () => {
  it('applies when codeAction + diagnosticProvider are present and source.organizeImports is not advertised', () => {
    const caps: ServerCapabilities = {
      codeActionProvider: { codeActionKinds: ['quickfix'] },
      diagnosticProvider: { interFileDependencies: false, workspaceDiagnostics: false }
    };
    expect(organizeImports.appliesTo(caps)).toBe(true);
  });

  it('does not apply without diagnosticProvider', () => {
    expect(organizeImports.appliesTo({ codeActionProvider: true })).toBe(false);
  });

  it('does not apply when source.organizeImports is already advertised', () => {
    const caps: ServerCapabilities = {
      codeActionProvider: { codeActionKinds: ['quickfix', 'source.organizeImports'] },
      diagnosticProvider: { interFileDependencies: false, workspaceDiagnostics: false }
    };
    expect(organizeImports.appliesTo(caps)).toBe(false);
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm vitest run packages/polyfill/src/organize-imports.test.ts`
Expected: FAIL — `Cannot find module './organize-imports.js'` (the file doesn't exist yet).

- [ ] **Step 3: Implement `organizeImports` to make the appliesTo tests pass**

Create `packages/polyfill/src/organize-imports.ts`:

```ts
// packages/polyfill/src/organize-imports.ts
import type { CodeAction, CodeActionParams, Command, ServerCapabilities } from '@lspeasy/core';
import type { LSPClient } from '@lspeasy/client';
import type { CodeActionPolyfill } from './types.js';
import { aggregateQuickFixes, isCodeAction } from './quickfix-aggregation.js';

function hasDiagnosticProvider(capabilities: ServerCapabilities): boolean {
  return Boolean(capabilities.diagnosticProvider);
}

function alreadyAdvertisesOrganizeImports(capabilities: ServerCapabilities): boolean {
  const provider = capabilities.codeActionProvider;
  return (
    typeof provider === 'object' &&
    Array.isArray(provider.codeActionKinds) &&
    provider.codeActionKinds.includes('source.organizeImports' as never)
  );
}

function requestsOrganizeImports(params: CodeActionParams): boolean {
  const only = params.context.only;
  if (!only) return false;
  return only.some((kind) => kind === 'source.organizeImports' || kind === 'source');
}

const IMPORT_FIX_TITLE = /import/i;

function isImportRelatedFix(action: CodeAction): boolean {
  return IMPORT_FIX_TITLE.test(action.title);
}

function pickImportFix(candidates: (Command | CodeAction)[]): CodeAction | undefined {
  const actions = candidates.filter(isCodeAction).filter(isImportRelatedFix);
  return actions.find((a) => a.isPreferred) ?? actions[0];
}

export const organizeImports: CodeActionPolyfill = {
  id: 'organize-imports',

  appliesTo(capabilities) {
    return (
      Boolean(capabilities.codeActionProvider) &&
      hasDiagnosticProvider(capabilities) &&
      !alreadyAdvertisesOrganizeImports(capabilities)
    );
  },

  async augmentCodeActions(actions, params, backend: LSPClient) {
    if (!requestsOrganizeImports(params)) return actions;

    const { changes, mergedCount } = await aggregateQuickFixes(params, backend, pickImportFix);
    if (mergedCount === 0) return actions;

    return [
      ...actions,
      {
        title: 'Organize imports',
        kind: 'source.organizeImports',
        edit: { changes }
      }
    ];
  }
};
```

- [ ] **Step 4: Run the appliesTo tests to verify they pass**

Run: `pnpm vitest run packages/polyfill/src/organize-imports.test.ts`
Expected: PASS — all 3 `appliesTo` tests green.

- [ ] **Step 5: Write the failing augmentCodeActions tests**

Append to `packages/polyfill/src/organize-imports.test.ts` (after the closing `});` of the `appliesTo` describe block):

```ts

describe('organizeImports.augmentCodeActions', () => {
  const missingImportDiagnostic = {
    range: { start: { line: 0, character: 0 }, end: { line: 0, character: 3 } },
    message: "Cannot find name 'foo'"
  };
  const unusedVarDiagnostic = {
    range: { start: { line: 1, character: 0 }, end: { line: 1, character: 3 } },
    message: 'unused variable'
  };

  function makeBackend(
    fixesByLine: Record<number, (Command | CodeAction)[]>,
    options: {
      capabilities?: ServerCapabilities;
      resolve?: (action: CodeAction) => CodeAction;
    } = {}
  ) {
    return {
      sendRequest: vi.fn(async (method: string, params: unknown) => {
        if (method === 'textDocument/diagnostic') {
          return { kind: 'full', items: [missingImportDiagnostic, unusedVarDiagnostic] };
        }
        if (method === 'textDocument/codeAction') {
          const p = params as { range: { start: { line: number } } };
          return fixesByLine[p.range.start.line] ?? [];
        }
        if (method === 'codeAction/resolve') {
          if (!options.resolve) throw new Error('backend does not support resolve');
          return options.resolve(params as CodeAction);
        }
        throw new Error(`unexpected method ${method}`);
      }),
      getServerCapabilities: () => options.capabilities ?? {}
    };
  }

  const params: CodeActionParams = {
    textDocument: { uri: 'file:///x.ts' },
    range: { start: { line: 0, character: 0 }, end: { line: 2, character: 0 } },
    context: { diagnostics: [], only: ['source.organizeImports'] }
  };

  it('does nothing when context.only does not request organizeImports or source', async () => {
    const backend = makeBackend({});
    const result = await organizeImports.augmentCodeActions!(
      [],
      { ...params, context: { diagnostics: [] } },
      backend as never
    );
    expect(result).toEqual([]);
    expect(backend.sendRequest).not.toHaveBeenCalled();
  });

  it('fires for a plain "source" request too', async () => {
    const backend = makeBackend({
      0: [
        {
          title: 'Add missing import for "foo"',
          kind: 'quickfix',
          edit: {
            changes: {
              'file:///x.ts': [
                { range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }, newText: 'import foo;\n' }
              ]
            }
          }
        }
      ]
    });

    const result = await organizeImports.augmentCodeActions!(
      [],
      { ...params, context: { diagnostics: [], only: ['source'] } },
      backend as never
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ kind: 'source.organizeImports' });
  });

  it('picks the import-related fix and ignores an unrelated quickfix for a different diagnostic', async () => {
    const backend = makeBackend({
      0: [
        {
          title: 'Add missing import for "foo"',
          kind: 'quickfix',
          edit: {
            changes: {
              'file:///x.ts': [
                { range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }, newText: 'import foo;\n' }
              ]
            }
          }
        }
      ],
      1: [
        {
          title: 'Remove unused variable',
          kind: 'quickfix',
          edit: {
            changes: {
              'file:///x.ts': [{ range: { start: { line: 1, character: 0 }, end: { line: 1, character: 3 } }, newText: '' }]
            }
          }
        }
      ]
    });

    const result = await organizeImports.augmentCodeActions!([], params, backend as never);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ title: 'Organize imports', kind: 'source.organizeImports' });
    // Only the import fix's edit is present — the non-import "Remove unused
    // variable" fix for line 1 must not have been merged in.
    expect(result[0]!.edit!.changes!['file:///x.ts']).toHaveLength(1);
    expect(result[0]!.edit!.changes!['file:///x.ts']![0]).toMatchObject({ newText: 'import foo;\n' });
  });

  it('prefers the import-related fix over a non-import fix marked isPreferred for the same diagnostic', async () => {
    const backend = makeBackend({
      0: [
        {
          title: 'Rename to _foo',
          kind: 'quickfix',
          isPreferred: true,
          edit: {
            changes: {
              'file:///x.ts': [{ range: { start: { line: 0, character: 0 }, end: { line: 0, character: 3 } }, newText: '_foo' }]
            }
          }
        },
        {
          title: 'Add missing import for "foo"',
          kind: 'quickfix',
          edit: {
            changes: {
              'file:///x.ts': [
                { range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }, newText: 'import foo;\n' }
              ]
            }
          }
        }
      ]
    });

    const result = await organizeImports.augmentCodeActions!([], params, backend as never);

    expect(result).toHaveLength(1);
    expect(result[0]!.edit!.changes!['file:///x.ts']![0]).toMatchObject({ newText: 'import foo;\n' });
  });

  it('returns real actions unchanged when no diagnostic has an import-related fix', async () => {
    const backend = makeBackend({
      1: [
        {
          title: 'Remove unused variable',
          kind: 'quickfix',
          edit: {
            changes: {
              'file:///x.ts': [{ range: { start: { line: 1, character: 0 }, end: { line: 1, character: 3 } }, newText: '' }]
            }
          }
        }
      ]
    });
    const realAction: CodeAction = { title: 'Real action', kind: 'quickfix' };

    const result = await organizeImports.augmentCodeActions!([realAction], params, backend as never);

    expect(result).toEqual([realAction]);
  });

  it('resolves a command-only import fix via codeAction/resolve when the backend supports native resolve', async () => {
    const commandOnlyFix: CodeAction = {
      title: 'Add missing import for "foo"',
      kind: 'quickfix',
      command: { title: 'Apply import', command: 'server.addImport' }
    };
    const resolvedEdit = {
      'file:///x.ts': [
        { range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }, newText: 'import foo;\n' }
      ]
    };
    const backend = makeBackend(
      { 0: [commandOnlyFix] },
      {
        capabilities: { codeActionProvider: { resolveProvider: true } },
        resolve: (action) => ({ ...action, edit: { changes: resolvedEdit } })
      }
    );

    const result = await organizeImports.augmentCodeActions!([], params, backend as never);

    expect(backend.sendRequest).toHaveBeenCalledWith('codeAction/resolve', commandOnlyFix);
    expect(result).toHaveLength(1);
    expect(result[0]!.edit!.changes!['file:///x.ts']).toHaveLength(1);
  });
});
```

- [ ] **Step 6: Run the tests to verify they fail correctly first, then pass**

Run: `pnpm vitest run packages/polyfill/src/organize-imports.test.ts`
Expected: all tests PASS immediately, since Step 3 already implemented `organize-imports.ts` ahead of writing these tests (the appliesTo tests were written test-first in Steps 1-4; these augmentCodeActions tests exercise the same already-written implementation). If any test fails, fix `organize-imports.ts` — do not weaken the test.

Note: this file deliberately does **not** re-test range-overlap deduplication or the large-character-offset position-comparison edge case — those are exhaustively covered by `fix-all.test.ts` against the exact same shared `quickfix-aggregation.ts` code path (Task 1's regression suite). Re-testing them here would duplicate coverage of shared logic without exercising anything specific to `organizeImports`.

- [ ] **Step 7: Type-check and lint**

Run: `pnpm --filter @lsproxy/polyfill type-check && pnpm --filter @lsproxy/polyfill build`
Expected: both succeed with no errors.

- [ ] **Step 8: Commit**

```bash
git add packages/polyfill/src/organize-imports.ts packages/polyfill/src/organize-imports.test.ts
git commit -m "feat(polyfill): add organizeImports polyfill"
```

---

### Task 3: Register `organizeImports` in the polyfill registry and public exports

**Files:**
- Modify: `packages/polyfill/src/registry.ts`
- Modify: `packages/polyfill/src/registry.test.ts`
- Modify: `packages/polyfill/src/index.ts`

**Interfaces:**
- Consumes: `organizeImports` from `packages/polyfill/src/organize-imports.js` (Task 2).
- Produces: `organizeImports` becomes part of `BUILTIN_POLYFILLS` and is returned by `applicablePolyfills()` whenever its `appliesTo` matches — `apps/proxy/src/proxy-session.ts` already calls `applicablePolyfills()` in three places (capability patching, `augmentCodeActions`, `resolveCodeAction`) and needs **no changes**, since it iterates whatever the registry returns.

- [ ] **Step 1: Write the failing registry test**

Modify `packages/polyfill/src/registry.test.ts` — add this test inside the existing `describe('applicablePolyfills', ...)` block, after the `'includes fix-all...'` test:

```ts
  it('includes organize-imports when the backend has pull diagnostics but not source.organizeImports', () => {
    const applicable = applicablePolyfills({
      codeActionProvider: true,
      diagnosticProvider: { interFileDependencies: false, workspaceDiagnostics: false }
    });
    expect(applicable.map((p) => p.id)).toContain('organize-imports');
  });
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run packages/polyfill/src/registry.test.ts`
Expected: FAIL — the new test's `expect(...).toContain('organize-imports')` fails because `organizeImports` isn't registered yet.

- [ ] **Step 3: Register `organizeImports`**

In `packages/polyfill/src/registry.ts`, change:

```ts
import { resolveBackfill } from './resolve-backfill.js';
import { fixAll } from './fix-all.js';

export const BUILTIN_POLYFILLS: readonly CodeActionPolyfill[] = [resolveBackfill, fixAll];
```

to:

```ts
import { resolveBackfill } from './resolve-backfill.js';
import { fixAll } from './fix-all.js';
import { organizeImports } from './organize-imports.js';

export const BUILTIN_POLYFILLS: readonly CodeActionPolyfill[] = [
  resolveBackfill,
  fixAll,
  organizeImports
];
```

In `packages/polyfill/src/index.ts`, change:

```ts
export type { CodeActionPolyfill } from './types.js';
export { resolveBackfill } from './resolve-backfill.js';
export { fixAll } from './fix-all.js';
export { BUILTIN_POLYFILLS, applicablePolyfills } from './registry.js';
```

to:

```ts
export type { CodeActionPolyfill } from './types.js';
export { resolveBackfill } from './resolve-backfill.js';
export { fixAll } from './fix-all.js';
export { organizeImports } from './organize-imports.js';
export { BUILTIN_POLYFILLS, applicablePolyfills } from './registry.js';
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run packages/polyfill/src/registry.test.ts`
Expected: PASS — all 5 tests green (4 existing + the new one).

- [ ] **Step 5: Run the full polyfill package test suite**

Run: `pnpm vitest run packages/polyfill`
Expected: PASS — every test file in the package green (`fix-all.test.ts`, `organize-imports.test.ts`, `registry.test.ts`, `resolve-backfill.test.ts`).

- [ ] **Step 6: Commit**

```bash
git add packages/polyfill/src/registry.ts packages/polyfill/src/registry.test.ts packages/polyfill/src/index.ts
git commit -m "feat(polyfill): register organizeImports in the polyfill registry"
```

---

### Task 4: End-to-end coverage through the real proxy path

**Files:**
- Modify: `e2e/fixtures/codeaction-fixture-server.mjs`
- Modify: `e2e/codeaction-polyfill.spec.ts`

**Interfaces:**
- Consumes: nothing new from earlier tasks directly — this exercises the already-registered `organizeImports` polyfill transitively through `ProxySession`/`applicablePolyfills`, same as the existing e2e test does for `resolveBackfill`/`fixAll`.

- [ ] **Step 1: Extend the fixture backend with a missing-import diagnostic and its quickfix**

In `e2e/fixtures/codeaction-fixture-server.mjs`, add a second diagnostic constant right after `UNUSED_VAR_DIAGNOSTIC`:

```js
// A second, distinct diagnostic exercising organize-imports: a "missing
// import" finding whose quickfix title contains the word "import" (the
// signal organize-imports' polyfill filters on), on a different line than
// UNUSED_VAR_DIAGNOSTIC so both can be reported for the same document.
const MISSING_IMPORT_DIAGNOSTIC = {
  range: { start: { line: 1, character: 0 }, end: { line: 1, character: 3 } },
  message: 'Cannot find name "foo"',
  severity: 2,
  code: 'missing-import',
  source: 'fixture'
};
```

Change the `textDocument/diagnostic` handler from:

```js
server.onRequest('textDocument/diagnostic', async () => ({
  kind: 'full',
  items: [UNUSED_VAR_DIAGNOSTIC]
}));
```

to:

```js
server.onRequest('textDocument/diagnostic', async () => ({
  kind: 'full',
  items: [UNUSED_VAR_DIAGNOSTIC, MISSING_IMPORT_DIAGNOSTIC]
}));
```

Change the `textDocument/codeAction` handler from:

```js
server.onRequest('textDocument/codeAction', async (params) => {
  const only = params?.context?.only ?? [];
  if (!only.includes('quickfix')) return [];

  const diagnostic = params.context.diagnostics?.[0];
  if (!diagnostic || diagnostic.code !== 'no-unused-vars') return [];

  return [
    {
      title: 'Remove unused variable',
      kind: 'quickfix',
      isPreferred: true,
      diagnostics: [diagnostic],
      edit: {
        changes: {
          [params.textDocument.uri]: [{ range: diagnostic.range, newText: '' }]
        }
      }
    }
  ];
});
```

to:

```js
server.onRequest('textDocument/codeAction', async (params) => {
  const only = params?.context?.only ?? [];
  if (!only.includes('quickfix')) return [];

  const diagnostic = params.context.diagnostics?.[0];
  if (!diagnostic) return [];

  if (diagnostic.code === 'no-unused-vars') {
    return [
      {
        title: 'Remove unused variable',
        kind: 'quickfix',
        isPreferred: true,
        diagnostics: [diagnostic],
        edit: {
          changes: {
            [params.textDocument.uri]: [{ range: diagnostic.range, newText: '' }]
          }
        }
      }
    ];
  }

  if (diagnostic.code === 'missing-import') {
    return [
      {
        title: 'Add missing import for "foo"',
        kind: 'quickfix',
        diagnostics: [diagnostic],
        edit: {
          changes: {
            [params.textDocument.uri]: [
              { range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }, newText: 'import foo;\n' }
            ]
          }
        }
      }
    ];
  }

  return [];
});
```

Update the module doc comment's bullet about `fix-all`'s gap to also mention the new diagnostic (append to the existing `diagnosticProvider` bullet):

```js
 *   - `diagnosticProvider`, so fix-all's and organize-imports' `appliesTo`
 *     both match. It implements pull-diagnostics (`textDocument/diagnostic`)
 *     reporting two diagnostics — an unused-variable finding and a
 *     missing-import finding — and per-diagnostic `quickfix` code actions
 *     for each, but never synthesizes a composite `source.fixAll` or
 *     `source.organizeImports` action itself.
```

(This replaces the corresponding existing bullet in the file's top doc comment.)

- [ ] **Step 2: Add the e2e test**

In `e2e/codeaction-polyfill.spec.ts`, add a constant near `UNUSED_VAR_RANGE`:

```ts
// Mirrors MISSING_IMPORT_DIAGNOSTIC.range in fixtures/codeaction-fixture-server.mjs.
const MISSING_IMPORT_RANGE = { start: { line: 1, character: 0 }, end: { line: 1, character: 3 } };
```

Add a new `it` block inside the existing `describe('codeAction polyfills (e2e, real proxy + real backend process)', ...)`, after the existing `it(...)` block:

```ts
  it('synthesizes source.organizeImports from the fixture backend\'s import-related quickfix only', async () => {
    const root = tmpRoot();
    await startProxy(root);
    const { client } = await connectClient(join(root, 'test.sock'));

    const actions = (await client.sendRequest('textDocument/codeAction', {
      textDocument: { uri: FIXTURE_URI },
      range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
      context: { diagnostics: [], only: ['source.organizeImports'] }
    })) as CodeAction[];

    const organizeImportsAction = actions.find((a) => a.kind === 'source.organizeImports');
    expect(organizeImportsAction).toBeDefined();
    const edits = organizeImportsAction!.edit!.changes![FIXTURE_URI];
    expect(edits).toBeDefined();
    // Only the import quickfix's edit is present — the fixture's separate
    // "Remove unused variable" quickfix (for a diagnostic whose title has no
    // "import" in it) must not have been picked up.
    expect(edits).toHaveLength(1);
    expect(edits![0]!.newText).toContain('import foo');
  });
```

The `MISSING_IMPORT_RANGE` constant declared above documents the fixture's second diagnostic range for future readers even though this particular test only asserts on the produced edit's `newText` — keep it, since `UNUSED_VAR_RANGE` is used the same documentary way for the sibling test.

- [ ] **Step 3: Run the e2e test**

Run: `pnpm vitest run e2e/codeaction-polyfill.spec.ts`
Expected: PASS — both the pre-existing `fixAll`/`resolveBackfill` test and the new `organizeImports` test are green.

- [ ] **Step 4: Run the full suite, build, and type-check**

Run: `pnpm build && pnpm run type-check && pnpm run lint && pnpm test`
Expected: all four succeed — build clean, type-check clean, lint with no new warnings, full test suite passes (only the pre-existing, unrelated `e2e/lsp-compliance.spec.ts` unhandled-rejection noise, if any, is out of scope for this feature).

- [ ] **Step 5: Commit**

```bash
git add e2e/fixtures/codeaction-fixture-server.mjs e2e/codeaction-polyfill.spec.ts
git commit -m "test(e2e): cover organizeImports through the real proxy path"
```

---

## Self-Review Notes

- **Spec coverage:** appliesTo gating (Task 2), import-fix selection including the isPreferred-shadowing edge case (Task 2), registry wiring with zero `proxy-session.ts` changes needed since it already iterates `applicablePolyfills()` generically (Task 3), and real end-to-end proof through `ProxySession` (Task 4) are all covered. `patchCapabilities` is explicitly *not* added, matching `fixAll`'s precedent, per the Global Constraints.
- **Placeholder scan:** none — every step has complete, runnable code.
- **Type consistency:** `aggregateQuickFixes`'s `selectFix` parameter type (`(candidates: (Command | CodeAction)[]) => CodeAction | undefined`) matches both `pickFix` in `fix-all.ts` and `pickImportFix` in `organize-imports.ts` exactly. `organizeImports.id` (`'organize-imports'`) is the exact string asserted by the Task 3 registry test.
