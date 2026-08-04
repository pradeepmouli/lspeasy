# Known issues / field log

Ongoing log of issues discovered while dogfooding `lsproxy` against real
repositories. Newest first. Each entry: environment, symptom, repro, impact,
hypothesis, and suggested investigation. Promote confirmed bugs to GitHub
issues and link them back here.

---

## 2026-06-28 — `textDocument/references` returns only the same-file declaration in a pnpm/ESM TS monorepo

**Status:** open (mitigated) · **Severity:** high (silently incomplete results → false "no callers")
**Server:** `typescript-language-server --stdio`, TypeScript **6.0.3**
**lsproxy:** `/usr/local/bin/lsproxy`

### Update 2026-06-28
- **Mitigation shipped:** `lsproxy` no longer emits a bare `ok:true` for a
  `textDocument/references` result that is empty or declaration-only. It now adds
  `partial:true` + a `warning` (JSON) and a stderr note, so a false-empty no
  longer silently green-lights a deletion/move. (Detection: `result-quality.ts`.)
- **Cause re-ranked → structural is now the lead hypothesis.** Proxy backends are
  *persistent* (`ensureBackend` reuses a spawned tsserver for ~10 min), so a pure
  timing/readiness bug would clear on a warm repeat call. The original repros (#2
  proxy, #3 `--no-proxy`) were *both effectively cold* (a single call against a
  fresh daemon is what warms it), so they do **not** isolate timing. The decisive
  test is **cold vs warm**, not proxy vs no-proxy:
  ```bash
  lsproxy textDocument references .../common.ts 31:17 --root . --json   # cold (warms backend)
  lsproxy textDocument references .../common.ts 31:17 --root . --json   # WARM — the real test
  ```
  Warm-complete → timing (readiness gate fixes it). Warm-still-declaration-only →
  structural: inferred/solution-`tsconfig` project never includes the importers
  (check whether the root `tsconfig.json` is solution-style: `references:[]`, no
  `include`).
- **CONFIRMED 2026-07-02 — structural, not timing.** Ran the decisive cold-vs-warm
  test against a second pnpm/ESM monorepo (`to-skills`/skillit), which also has a
  root `tsconfig.json` with no `include`/`references` (packages each carry their
  own `tsconfig.build.json` `extends`-ing the root, no composite project graph).
  Cold and warm calls to `textDocument/references` on `ExtractedSkill.pitfalls`
  (`packages/core/src/types.ts`) returned **byte-identical** results both times —
  3 files, 6 ranges, no `partial:true`. Closes the pending timing question: this
  is structural. See the new 2026-07-02 entry below for the precise boundary
  (package, not file) and a proposed fix direction.
- **Skill capture:** the pitfall is authored as a `@never` tag (skillit's
  anti-pattern convention) on the detector; surfacing it in the *generated CLI
  skill* is blocked on skillit auto-correlating config surfaces —
  filed as pradeepmouli/skillit#87.

---

## 2026-07-02 — `textDocument/references`/`rename` silently stop at the workspace-package boundary in a pnpm monorepo without composite `tsconfig` references

**Status:** open · **Severity:** high (same class as 2026-06-28, narrower/cleaner repro)
**Server:** `typescript-language-server --stdio`
**lsproxy:** `/usr/local/bin/lsproxy`

### Repro
Second monorepo (`to-skills`/skillit — pnpm workspaces, ESM, root `tsconfig.json`
with no `include`/`references`; each package has its own `tsconfig.build.json`).
Renaming `ExtractedSkill.pitfalls` (`packages/core/src/types.ts:80`), a property
consumed by `packages/typedoc`, `packages/cli`, `packages/mcp`, and `packages/client`
via `import type { ExtractedSkill } from '@skillit/core'` (workspace dep, resolved
through a `node_modules` symlink):

```bash
lsproxy textDocument rename --dry-run packages/core/src/types.ts 80:3 "never" --json
```

Returns edits in exactly 3 files — **all inside `packages/core`** (`types.ts`,
`audit.ts`, `renderer.ts`). Zero edits in `packages/typedoc/src/extractor.ts`,
`packages/cli/src/extract.ts`, `packages/mcp/src/extract.ts`, or any consumer —
despite `rg` confirming 88 real usages of the property across those packages.

**This narrows the 2026-06-28 finding.** Same-package cross-*file* resolution
works correctly here (types.ts → audit.ts → renderer.ts, 3 separate files, 6
ranges, found fine). The boundary that fails is specifically the **workspace
*package* boundary** — tsserver's inferred single-file project for
`packages/core/src/types.ts` never expands to include `packages/typedoc` etc.,
because nothing in either package's `tsconfig.json` declares a `references`
edge between them. The 2026-06-28 `sittir` repro (declaration-only, not even
same-package files found) may be a related-but-distinct manifestation — worth
re-testing there with the same cold/warm-confirmed methodology to see if it's
the same root cause or compounded by the `.ts`-extension-specifier import style
noted in that repo's environment.

### Hypothesis
tsserver's cross-project reference resolution (`findAllReferences` traversing
into referenced projects) requires the source tsconfig to have
`"composite": true` and the consuming/sibling tsconfigs wired via
`"references": [{ "path": "../other-package" }]`. Without that graph, tsserver
has no way to know `packages/typedoc` depends on `packages/core` — it only
sees `packages/core/src/types.ts`'s own inferred project. This is not
lsproxy-specific: **no** LSP client can get an answer tsserver doesn't have.

### Fix directions (needs design work before picking one)
1. **Detect + warn**: on `textDocument/references`/`rename`, if the result set
   never leaves the requesting file's own package dir AND the repo has multiple
   workspace packages (pnpm-workspace.yaml / package.json workspaces present),
   attach a `partial:true`-style warning suggesting the result may be
   incomplete due to missing tsconfig project references — same treatment as
   the existing declaration-only mitigation.
2. **Guide the consumer to fix their tsconfig**: since this is fundamentally a
   tsconfig-graph gap, a `lsproxy doctor`-style check (or a note in
   `server-discovery-lsp-json.md`) that inspects the target repo's tsconfigs
   and flags "no composite project references detected — cross-package
   rename/references will silently under-report" would surface the real fix
   (add `references`) without lsproxy pretending to solve it magically.
3. **(Riskier) Synthesize a broader ambient program**: construct a temporary
   umbrella tsconfig (or use the TS compiler API directly with a wide
   `include` across all workspace packages) as a fallback when no composite
   graph exists. More invasive, higher chance of divergent type-checking
   behavior from the repo's real build, needs its own design pass.

**Recommendation for now: (1) + (2)** — visibility over silent magic. (3) is a
separate, larger project.

### Impact
Same as 2026-06-28: `references`/`rename`/file-move-with-importer-updates are
unsafe for any symbol used across workspace package boundaries in a repo
without composite tsconfig references — a common, not-rare monorepo shape
(neither `sittir` nor `to-skills` has this wiring today).

### Environment
- Repo: `sittir` — pnpm monorepo, ESM, root `tsconfig.json` with `paths`
  mapping `@sittir/*` → `packages/<name>/src/*.ts`.
- Local imports use **explicit `.ts` extension specifiers**
  (`allowImportingTsExtensions`-style), e.g. `import { x } from './foo.ts'`.

### Symptoms
1. **`workspace/symbol` fails with `No Project` when `--root` is a subpackage.**
   ```
   lsproxy workspace symbol "compileWordMatcher" --root packages/codegen --json
   → {"ok":false,"error":"... TypeScript Server Error (6.0.3)\nNo Project.\nError: No Project. ... getFullNavigateToItems ..."}
   ```
   navto requires a loaded project; rooting at a subdir (no tsconfig that
   tsserver adopts as the active project) yields none.

2. **`textDocument/references` returns ONLY the declaration's own range** — every
   cross-file importer is missing, even rooted at the repo root.
   ```
   lsproxy textDocument references packages/codegen/src/compiler/common.ts 31:17 --root . --json
   → result: [ <common.ts:30 — the declaration itself> ]   # and nothing else
   ```
   Ground truth: `compileWordMatcher` (the symbol at that position) has 5+ real
   importers (`compiler/assemble.ts`, `compiler/scc.ts`,
   `emitters/render-module.ts`, `emitters/templates.ts`, `emitters/wrap.ts`).
   None are returned. The call reports `ok:true` — it's a *silent* under-report,
   not an error.

3. **Same incomplete result with the proxy bypassed** — so it is not the warm
   daemon; the underlying per-request session is the issue.
   ```
   lsproxy textDocument references packages/codegen/src/compiler/common.ts 31:17 \
     --root . --no-proxy --server "typescript-language-server --stdio" --json
   → same single (declaration-only) result
   ```

### Impact
- `textDocument references` is unusable for caller analysis / dead-code
  verification in this repo: a false-empty result reads as "zero callers" and
  would green-light an unsafe deletion.
- By extension, **file-move-with-importer-updates / `workspace/willRenameFiles`
  is unsafe here** — it relies on the same reference index, so it would silently
  miss importers and leave the build broken. (Worked around by doing the file
  move with literal import-path rewrites + a full typecheck/validator gate
  instead of via lsproxy.)

### Likely cause (hypotheses, unconfirmed)
- tsserver opens the single requested file as an **inferred project** rather than
  loading the workspace project (root `tsconfig.json`), so the cross-file
  reference graph is never built; `references` returns before/without
  project-wide indexing.
- Contributing factor: **`.ts`-extension ESM import specifiers** — if the
  server's module resolution for the inferred project doesn't resolve `./foo.ts`
  specifiers, the importer files never enter the program, so they can't appear in
  references.

### Suggested investigation
- After init, wait for `projectLoadingFinished` (and honor
  `workspace/configuration`) before issuing position requests; consider a warm-up
  `textDocument/didOpen` on a file the root tsconfig owns so tsserver adopts the
  configured project instead of an inferred one.
- Probe `initialize` capabilities + the chosen project: `lsproxy call initialize`
  and compare an explicit `--root` at the package that owns the tsconfig vs repo
  root.
- Reproduce against raw `tsserver` (vs the `typescript-language-server` wrapper)
  to isolate whether the wrapper or tsserver drops the cross-file refs.
- Confirm whether disabling `.ts`-extension specifiers (or enabling the matching
  resolution mode) changes the result — to validate the resolution hypothesis.

### Repro (minimal)
```bash
cd /path/to/sittir
lsproxy textDocument references packages/codegen/src/compiler/common.ts 31:17 --root . --json
# expect: 1 declaration + 5 importer sites
# actual: 1 declaration only, ok:true
```
