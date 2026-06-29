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
  `include`). **[pending: warm-call result]**
- **Skill capture:** the pitfall is authored as a `@never` tag (skillit's
  anti-pattern convention) on the detector; surfacing it in the *generated CLI
  skill* is blocked on skillit auto-correlating config surfaces —
  filed as pradeepmouli/skillit#87.

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
