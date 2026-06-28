# Discovery & Invocation Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `lsproxy --help <lang> <ns> <req>` self-describing (param + result JSON Schema in `--json`, example input/output JSON in text), let common methods be invoked without raw `--params` (deepened `zodToCommander` flags), and color all help + config output.

**Architecture:** Derive everything from existing Zod schemas — `getSchemaForMethod` (params) plus a new `getResultSchemaForMethod` (results, added via a protocol-codegen pass). A pure `exampleFromZod` walker (core) produces required-only example payloads for input and output. `zodToCommander` is deepened for nested scalars/enums/scalar-arrays. `help.ts` surfaces schemas (`--json`) and examples (text); `format.ts` coloring is applied to the drill-down and config commands.

**Tech Stack:** TypeScript 5 (strict, no `any` in prod), Node ≥20, Zod 4 (`z.toJSONSchema`), Commander, Vitest, the `x-to-zod` `ZodBuilder` used by the protocol generator.

## Global Constraints

- TypeScript strict; **no `any`** in production code (tests may cast).
- All diagnostics → stderr; `--json` output is **ANSI-free**.
- Conventional commits; commit per task. Run one test: `pnpm exec vitest run <path>`. Type-check: `pnpm run type-check`.
- **`packages/core/src/protocol/schemas.ts` is auto-generated — never hand-edit; regenerate via `pnpm exec tsx scripts/generate-protocol-types.ts`** (confirm the exact run command from `package.json` scripts during Task 1) and commit the regenerated file.
- **JSDoc on exported symbols must not contain raw `<...>` angle-bracket placeholders** — wrap them in backticks. Raw `<x>` breaks the VitePress docs build ("Element is missing end tag"). This bit PR #149.
- **The final verification MUST run the full `pnpm run build` (incl. the docs build)** — not just test/type-check/lint/format. The docs build is the gate that catches generated-markdown issues.
- Example payloads are **required-only**, typed samples, labelled illustrative. Flag deepening is **Option 1**: nested scalars (dotted flags) + enums (choices) + scalar arrays; array-of-objects/unions/recursive `LSPAny` keep the `--params` fallback.

---

## File Structure

| File | Responsibility |
|---|---|
| `scripts/generate-protocol-types.ts` *(modify)* | Emit `<Method>ResultSchema` consts + `LSPResultSchemas` map + `getResultSchemaForMethod` into schemas.ts |
| `packages/core/src/protocol/schemas.ts` *(regenerated)* | Now contains result schemas + getter (generated, committed) |
| `packages/core/src/index.ts` *(modify)* | Export `getResultSchemaForMethod` (+ `LSPResultSchemas`) |
| `packages/core/src/example-from-zod.ts` *(create)* | Pure `exampleFromZod(schema)` walker |
| `apps/cli/src/zod-to-commander.ts` *(modify)* | Deepen flag generation (nested scalars, enums, scalar arrays) |
| `apps/cli/src/help.ts` *(modify)* | `--json` paramsSchema/resultSchema; text example input/output; color |
| `apps/cli/src/config/commands.ts` *(modify)* | Color the list/import/export/diff text output |
| `apps/cli/src/format.ts` *(modify, if needed)* | Any helper needed for the above coloring |

---

## Task 1: Result-schema codegen

**Files:**
- Modify: `scripts/generate-protocol-types.ts` (the `generateSchemas()` method, ~lines 774–955)
- Regenerate + commit: `packages/core/src/protocol/schemas.ts`
- Modify: `packages/core/src/index.ts` (export the getter)
- Test: `packages/core/src/protocol/result-schemas.test.ts` *(create)*

**Interfaces:**
- Consumes: the generator's `typeToBuilder(type, selfName, lazyRefs)` (returns a `ZodBuilder`; `.text()` → the Zod expression string) and the `Request { method: string; result: Type }` shape.
- Produces (in generated schemas.ts + re-exported from core):
  ```ts
  const LSPResultSchemas: Record<string, z.ZodType<unknown>>;
  function getResultSchemaForMethod(method: string): z.ZodType<unknown> | undefined;
  ```

- [ ] **Step 1: Read the generator's schema emission**

Read `scripts/generate-protocol-types.ts` `generateSchemas()` — specifically the structure-schema loop that calls `this.typeToBuilder(p.type, name, lazyRefs).text()` (~line 905) and the `LSPSchemas` registry + `getSchemaForMethod` emission (~lines 930–952). Confirm the run command in `package.json` (e.g. a `codegen`/`generate` script) for regenerating schemas.ts.

- [ ] **Step 2: Write the failing test**

Create `packages/core/src/protocol/result-schemas.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { getResultSchemaForMethod } from './schemas.js';

describe('getResultSchemaForMethod', () => {
  it('returns a Zod schema for a request method with a result', () => {
    const schema = getResultSchemaForMethod('textDocument/hover');
    expect(schema).toBeDefined();
    expect(schema).toBeInstanceOf(z.ZodType);
  });
  it('returns undefined for an unknown / notification method', () => {
    expect(getResultSchemaForMethod('textDocument/didOpen')).toBeUndefined();
    expect(getResultSchemaForMethod('made/up')).toBeUndefined();
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm exec vitest run packages/core/src/protocol/result-schemas.test.ts`
Expected: FAIL — `getResultSchemaForMethod` not exported from schemas.js.

- [ ] **Step 4: Add result-schema emission to the generator**

In `generateSchemas()`, after the structure-schema consts are emitted and before/around the `LSPSchemas` block, add result-schema emission. Use the existing `typeToBuilder` to render each request's result Type, and a deterministic const name derived from the method.

Add a helper near the other name helpers:
```ts
// "textDocument/hover" -> "TextDocumentHoverResult"
private resultConstName(method: string): string {
  const pascal = method
    .split(/[/_$]/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
  return `${pascal}Result`;
}
```

After the structure schemas are pushed (and `lazyRefs` is available), emit one const per request result and the registry:
```ts
// Result schemas — one per request method, from its metaModel `result` Type.
lines.push('');
const resultEntries: Array<{ method: string; constName: string }> = [];
for (const req of requests) {
  if (!req.result) continue;
  const constName = this.resultConstName(req.method) + 'Schema';
  const builder = this.typeToBuilder(req.result, this.resultConstName(req.method), lazyRefs);
  lines.push(`export const ${constName}: z.ZodType<unknown> = ${builder.text()};`);
  resultEntries.push({ method: req.method, constName });
}

lines.push('');
lines.push('export const LSPResultSchemas = {');
for (const { method, constName } of resultEntries.sort((a, b) => a.method.localeCompare(b.method))) {
  lines.push(`  ${JSON.stringify(method)}: ${constName},`);
}
lines.push('} as const;');
lines.push('');
lines.push('/** Result schema for a request method, or undefined for notifications/unknown. */');
lines.push('export function getResultSchemaForMethod(method: string): z.ZodType<unknown> | undefined {');
lines.push('  return LSPResultSchemas[method as keyof typeof LSPResultSchemas];');
lines.push('}');
```
> Notes: (a) the explicit `: z.ZodType<unknown>` annotation avoids TS inference-cycle errors for result schemas that reference recursive structures; (b) `lazyRefs` must be the same object used by the structure loop so refs resolve; if it's locally scoped, hoist it so the result loop can reuse it; (c) results are emitted AFTER structure schemas so `XSchema` refs are declared.

- [ ] **Step 5: Regenerate schemas.ts and export the getter**

Run the generator (the command confirmed in Step 1, e.g. `pnpm exec tsx scripts/generate-protocol-types.ts`). Confirm `packages/core/src/protocol/schemas.ts` now contains `LSPResultSchemas` + `getResultSchemaForMethod`.

In `packages/core/src/index.ts`, add to the `./protocol/schemas.js` export block (alongside `LSPSchemas`, `getSchemaForMethod`):
```ts
  LSPResultSchemas,
  getResultSchemaForMethod
```

- [ ] **Step 6: Run test + type-check + docs build**

Run: `pnpm exec vitest run packages/core/src/protocol/result-schemas.test.ts` (PASS), `pnpm run type-check` (clean), and `pnpm --filter @lspeasy/docs build` (PASS — confirms no generated-markdown / docs regression). If the docs build fails on a raw `<...>`, fix the offending JSDoc/comment by backticking it.

- [ ] **Step 7: Commit**

```bash
git add scripts/generate-protocol-types.ts packages/core/src/protocol/schemas.ts packages/core/src/index.ts packages/core/src/protocol/result-schemas.test.ts
git commit -m "feat(core): generate LSP result schemas and getResultSchemaForMethod"
```

---

## Task 2: `exampleFromZod` walker

**Files:**
- Create: `packages/core/src/example-from-zod.ts`
- Create: `packages/core/src/example-from-zod.test.ts`
- Modify: `packages/core/src/index.ts`

**Interfaces:**
- Produces: `function exampleFromZod(schema: z.ZodType, depth?: number): unknown` — required-only typed sample.

- [ ] **Step 1: Write the failing test**

Create `packages/core/src/example-from-zod.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { exampleFromZod } from './example-from-zod.js';

describe('exampleFromZod', () => {
  it('fills scalars with typed samples', () => {
    expect(exampleFromZod(z.string())).toBe('example');
    expect(exampleFromZod(z.number())).toBe(1);
    expect(exampleFromZod(z.boolean())).toBe(false);
  });
  it('uses the first value of an enum/literal union', () => {
    expect(exampleFromZod(z.enum(['a', 'b']))).toBe('a');
    expect(exampleFromZod(z.literal('quickfix'))).toBe('quickfix');
  });
  it('includes required object props and omits optionals', () => {
    const schema = z.object({ uri: z.string(), version: z.number().optional() });
    expect(exampleFromZod(schema)).toEqual({ uri: 'example' });
  });
  it('produces a one-element array sample', () => {
    expect(exampleFromZod(z.array(z.string()))).toEqual(['example']);
  });
  it('guards recursion depth (no infinite loop on lazy/recursive schemas)', () => {
    const Rec: z.ZodType<unknown> = z.lazy(() => z.object({ child: Rec.optional() }));
    expect(() => exampleFromZod(Rec)).not.toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run packages/core/src/example-from-zod.test.ts`
Expected: FAIL — cannot find module `./example-from-zod.js`.

- [ ] **Step 3: Implement**

Create `packages/core/src/example-from-zod.ts`:
```ts
import { z } from 'zod';

const MAX_DEPTH = 6;

/**
 * Build an illustrative, required-only example value from a Zod schema.
 * Strings → "example", numbers → 1, booleans → false, enum/literal → first value,
 * objects → required props (optionals omitted), arrays → one sample element.
 * Optionals/nullables are omitted; recursion is capped at MAX_DEPTH (returns null).
 * The lsproxy CLI uses this to show example request/response payloads.
 */
export function exampleFromZod(schema: z.ZodType, depth = 0): unknown {
  if (depth > MAX_DEPTH) return null;
  const def = (schema as { _def?: { typeName?: string } })._def;
  const t = def?.typeName;

  // Unwrap optional/nullable/default → omit-able wrappers handled by callers (objects).
  if (t === 'ZodOptional' || t === 'ZodNullable' || t === 'ZodDefault') {
    const inner = (schema as unknown as { unwrap?: () => z.ZodType }).unwrap?.();
    return inner ? exampleFromZod(inner, depth) : null;
  }
  if (t === 'ZodLazy') {
    const inner = (schema as unknown as { _def: { getter: () => z.ZodType } })._def.getter();
    return exampleFromZod(inner, depth + 1);
  }
  if (t === 'ZodString') return 'example';
  if (t === 'ZodNumber') return 1;
  if (t === 'ZodBoolean') return false;
  if (t === 'ZodLiteral') return (def as { value?: unknown }).value ?? null;
  if (t === 'ZodEnum') {
    const values = (def as { values?: unknown[]; entries?: Record<string, unknown> });
    if (Array.isArray(values.values)) return values.values[0] ?? null;
    if (values.entries) return Object.values(values.entries)[0] ?? null;
    return null;
  }
  if (t === 'ZodArray') {
    const element = (def as { type?: z.ZodType; element?: z.ZodType });
    const el = element.type ?? element.element;
    return el ? [exampleFromZod(el, depth + 1)] : [];
  }
  if (t === 'ZodUnion') {
    const opts = (def as { options?: z.ZodType[] }).options ?? [];
    return opts[0] ? exampleFromZod(opts[0], depth + 1) : null;
  }
  if (t === 'ZodObject') {
    const shape = (schema as z.ZodObject<z.ZodRawShape>).shape;
    const out: Record<string, unknown> = {};
    for (const [key, field] of Object.entries(shape)) {
      const fdef = (field as { _def?: { typeName?: string } })._def;
      // Omit optional / default fields from the required-only example.
      if (fdef?.typeName === 'ZodOptional' || fdef?.typeName === 'ZodDefault') continue;
      out[key] = exampleFromZod(field as z.ZodType, depth + 1);
    }
    return out;
  }
  return null;
}
```
> Note: Zod 4 internal `_def` shapes vary by node; the implementer should run the test and adjust the property reads (`values`/`entries`, `type`/`element`, `getter`) to the installed Zod 4 version if a case fails — the test is the contract. No `any`: use narrow casts to the specific shape being read.

- [ ] **Step 4: Re-export**

In `packages/core/src/index.ts`:
```ts
export { exampleFromZod } from './example-from-zod.js';
```

- [ ] **Step 5: Run test + type-check**

Run: `pnpm exec vitest run packages/core/src/example-from-zod.test.ts` (PASS) and `pnpm run type-check` (clean). Rebuild core for downstream cli tasks: `pnpm --filter @lspeasy/core build`.

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/example-from-zod.ts packages/core/src/example-from-zod.test.ts packages/core/src/index.ts
git commit -m "feat(core): add exampleFromZod walker for illustrative payloads"
```

---

## Task 3: Deepen `zodToCommander` flag generation

**Files:**
- Modify: `apps/cli/src/zod-to-commander.ts`
- Test: `apps/cli/src/zod-to-commander.test.ts` (extend)

**Interfaces:**
- Consumes/Produces: the existing `zodToCommander(method, schema, session, flags)` and its field-option helpers — extended to emit deeper flags. No signature change.

- [ ] **Step 1: Read the current flag building**

Read `apps/cli/src/zod-to-commander.ts` — `detectArgPattern`, `addFieldOptions`/`fieldCliKey`, the option loop in `zodToCommander` (the part after `cmd.option('--params <json>', ...)`), and `unwrapOptional`/`isZodObjectLike`. The deepening extends this existing per-field option emission.

- [ ] **Step 2: Write the failing test**

Add to `apps/cli/src/zod-to-commander.test.ts` (import `buildProgram` from `./program.js` to get a real capability-filtered tree, or call `zodToCommander` directly on `getSchemaForMethod('textDocument/codeAction')`):
```ts
import { getSchemaForMethod } from '@lspeasy/core';
// ... within the existing describe or a new one:
it('codeAction generates deepened flags (enum --only, nested trigger-kind), not just --params', () => {
  const schema = getSchemaForMethod('textDocument/codeAction')!;
  const cmd = zodToCommander('textDocument/codeAction', schema, stubSession, stubFlags);
  const flags = cmd.options.map((o) => o.flags).join(' ');
  expect(flags).toContain('--params'); // fallback still present
  // scalar-array enum surfaced as a flag (not buried in raw json):
  expect(flags).toMatch(/--(context-)?only/);
});
```
> Use the test file's existing stub session/flags pattern; if none, construct minimal stubs as the file's other tests do. The exact deepened flag names depend on the field-key scheme — assert on the *presence* of an `only` flag and that `--params` remains, rather than an exact string, to keep the test robust.

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/zod-to-commander.test.ts`
Expected: FAIL — codeAction currently yields only `--params` (raw pattern), no `--only` flag.

- [ ] **Step 4: Implement the deepening**

Extend the per-field option emission in `zodToCommander.ts`:
- When a field unwraps to a **scalar** (`ZodString`/`ZodNumber`/`ZodBoolean`/`ZodLiteral`): emit `--<key> <value>` (existing behavior — keep).
- When a field is a `ZodEnum` or a union of literals: emit `--<key> <value>` and attach `.choices([...])` with the enum values.
- When a field is a `ZodArray` of scalars/enums: emit `--<key> <items>` documented as comma-separated; marshal by `.split(',')`.
- When a field is a **nested object** of scalars: recurse one more level with dotted/kebab keys (extend the existing `addFieldOptions` depth from 1 to cover the nested-scalar case, e.g. `--context-trigger-kind`).
- When a field is an **array-of-objects**, a **non-literal union**, or recursive `LSPAny`: do NOT emit a flag — leave it to `--params` (current fallback).
Mirror the marshalling side (`marshalParams`/`extractFieldValue`) so the new flags are parsed back into the params object (enums pass through; scalar arrays `.split(',')`; nested scalars assigned at the dotted path).

Keep `detectArgPattern`'s known positional patterns (file/position/range) unchanged; the deepened flags are additive options on top.

- [ ] **Step 5: Run test + full cli suite + type-check**

Run: `pnpm exec vitest run apps/cli/src/zod-to-commander.test.ts` (PASS), `pnpm exec vitest run apps/cli` (all pass — existing methods unaffected), `pnpm run type-check` (clean).

- [ ] **Step 6: Commit**

```bash
git add apps/cli/src/zod-to-commander.ts apps/cli/src/zod-to-commander.test.ts
git commit -m "feat(cli): deepen zodToCommander flags (enums, scalar arrays, nested scalars)"
```

---

## Task 4: Surface schemas (`--json`) + examples (text) in drill-down help

**Files:**
- Modify: `apps/cli/src/help.ts` (the `drillDownJson` depth-2 branch + `renderDrillDownText`)
- Test: `apps/cli/src/help.test.ts` (extend)

**Interfaces:**
- Consumes: `getSchemaForMethod`, `getResultSchemaForMethod`, `exampleFromZod` (`@lspeasy/core`); `z.toJSONSchema` (zod).
- Produces: depth-2 `drillDownJson` gains `paramsSchema` + (optional) `resultSchema`; depth-2 text help gains Example input/output blocks. Add a helper `methodForPath(language, path)` → the LSP method string (`<namespace>/<request>`).

- [ ] **Step 1: Write the failing test**

Add to `apps/cli/src/help.test.ts`:
```ts
import { z } from 'zod';
import { drillDownJson, renderDrillDownText } from './help.js';
import { buildProgram } from './program.js';

it('drillDownJson depth-2 includes params and result JSON Schema', () => {
  const json = drillDownJson(buildProgram(), 'typescript', ['textDocument', 'hover']) as {
    paramsSchema?: unknown;
    resultSchema?: unknown;
  };
  expect(json.paramsSchema).toBeTypeOf('object');
  expect(json.resultSchema).toBeTypeOf('object'); // hover has a result
});

it('renderDrillDownText depth-2 includes an illustrative example input block', () => {
  const { text } = renderDrillDownText(buildProgram(), ['textDocument', 'hover']);
  expect(text).toMatch(/Example input/i);
  expect(text).not.toContain('\x1b'); // pure function: no color unless a formatter is passed
});
```
> If `renderDrillDownText`/`drillDownJson` need the LSP method string, derive it as `\`${namespace}/${request}\`` from the path. `buildProgram()` builds the full offline tree, so `textDocument hover` resolves.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/help.test.ts`
Expected: FAIL — no `paramsSchema`/`resultSchema`; no "Example input" in text.

- [ ] **Step 3: Implement**

In `apps/cli/src/help.ts`:
- Add imports: `import { z } from 'zod';` and `import { getSchemaForMethod, getResultSchemaForMethod, exampleFromZod } from '@lspeasy/core';`
- Add a helper:
  ```ts
  function methodForPath(path: string[]): string | undefined {
    return path.length >= 2 ? `${path[0]}/${path[1]}` : undefined;
  }
  function safeJsonSchema(schema: import('zod').z.ZodType | undefined): unknown {
    if (!schema) return undefined;
    try { return z.toJSONSchema(schema); } catch { return undefined; }
  }
  ```
- In `drillDownJson`, depth-2 branch (where `request` is set), compute `const method = methodForPath(path);` and add to the returned object:
  ```ts
  paramsSchema: safeJsonSchema(method ? getSchemaForMethod(method) : undefined),
  resultSchema: safeJsonSchema(method ? getResultSchemaForMethod(method) : undefined),
  ```
  (Omit keys that are `undefined` so the JSON stays clean — or include them as `null`; pick one and assert it in the test. Recommended: include only when defined.)
- In `renderDrillDownText`, after the existing `command.helpInformation()` for a depth-2 request, append example blocks:
  ```ts
  const method = methodForPath(path);
  const params = method ? getSchemaForMethod(method) : undefined;
  const result = method ? getResultSchemaForMethod(method) : undefined;
  let extra = '';
  if (params) extra += `\nExample input (illustrative):\n${JSON.stringify(exampleFromZod(params), null, 2)}\n`;
  if (result) extra += `\nExample output (illustrative):\n${JSON.stringify(exampleFromZod(result), null, 2)}\n`;
  return { ok: true, text: result.command.helpInformation() + extra };
  ```
  (Adjust to the actual `renderDrillDownText` return shape; only append for the success/depth-2 case.)

- [ ] **Step 4: Run test + full cli suite + type-check**

Run: `pnpm exec vitest run apps/cli/src/help.test.ts` (PASS), `pnpm exec vitest run apps/cli` (all pass), `pnpm run type-check` (clean).

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/help.ts apps/cli/src/help.test.ts
git commit -m "feat(cli): surface param/result JSON Schema and example payloads in drill-down help"
```

---

## Task 5: Color across drill-down help + config commands

**Files:**
- Modify: `apps/cli/src/help.ts` (`renderDrillDownText` section headers / example labels accept a formatter)
- Modify: `apps/cli/src/config/commands.ts` (route text output through a formatter)
- Modify: `apps/cli/src/cli.ts` (pass a formatter into the drill-down + config text paths, gated)
- Test: `apps/cli/src/help.test.ts` / `apps/cli/src/config/commands.test.ts` (extend)

**Interfaces:**
- Consumes: `createFormatter(enabled)` (`./format.js`). Gate: `process.stdout.isTTY === true && !process.env['NO_COLOR'] && !flags.json`.

- [ ] **Step 1: Write the failing test**

Add to `apps/cli/src/config/commands.test.ts` (color is opt-in via the existing gate; assert that with color disabled the output is ANSI-free, and that the list renderer accepts/uses a formatter when enabled). Since commands currently build plain strings, drive a minimal change: have `configList` colorize the status glyph/tier when a formatter is passed.
```ts
it('configList text output is ANSI-free when color is disabled', () => {
  const cap = captureStdout();
  try { configList({ json: false, root: root(), scope: 'project' }); } finally { cap.restore(); }
  expect(cap.out()).not.toContain('\x1b');
});
```
> If the controller-level gate already yields plain output in tests (no TTY), this test locks the contract. Add a focused test that, with color forced on, the output contains an ANSI code — using whatever seam Task 5 introduces (e.g. an internal `renderList(platforms, fmt)` taking a `Formatter`).

- [ ] **Step 2: Run test to verify it fails (or passes trivially) and drive the seam**

Run: `pnpm exec vitest run apps/cli/src/config/commands.test.ts`. If the ANSI-free assertion already passes (no color today), add the color seam first (a `Formatter` param on the internal render helper) so there is a colored path to test, then assert both on/off.

- [ ] **Step 3: Implement**

- `config/commands.ts`: extract the text rendering of each command into a small internal helper that takes a `Formatter` (from `createFormatter`), colorizing status glyphs/tiers/headers; `emit()` passes a formatter built from the gate (disabled in `--json`). Keep `--json` paths untouched (no formatter).
- `help.ts`: have `renderDrillDownText` accept an optional `fmt?: Formatter` and colorize the "Example input/output" labels + section headers; default (no fmt) stays plain so the pure-function tests remain ANSI-free.
- `cli.ts`: where it calls `renderDrillDownText` and the `config` commands in text mode, compute `const color = process.stdout.isTTY === true && !process.env['NO_COLOR'] && !flags.json;` and pass `createFormatter(color)`.

- [ ] **Step 4: Run focused + full cli suite + type-check**

Run: `pnpm exec vitest run apps/cli/src/config/commands.test.ts apps/cli/src/help.test.ts` (pass), `pnpm exec vitest run apps/cli` (all pass), `pnpm run type-check` (clean).

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/help.ts apps/cli/src/config/commands.ts apps/cli/src/cli.ts apps/cli/src/config/commands.test.ts apps/cli/src/help.test.ts
git commit -m "feat(cli): color drill-down help and config command output"
```

---

## Task 6: Changeset + full verification (incl. docs build)

**Files:**
- Create: `.changeset/discovery-polish.md`

- [ ] **Step 1: Changeset**

Create `.changeset/discovery-polish.md`:
```markdown
---
'@lsproxy/cli': minor
'@lspeasy/core': minor
---

`lsproxy` help now surfaces param + result JSON Schema (`--json`) and illustrative
example input/output payloads (text) per request, derived from the LSP Zod schemas
(new `getResultSchemaForMethod` + `exampleFromZod`). `zodToCommander` generates
deeper flags (enums, scalar arrays, nested scalars) so common methods like
`textDocument/codeAction` are invokable without raw `--params`. Drill-down help and
`lsproxy config` output are now colored (TTY only; `--json` stays ANSI-free).
```

- [ ] **Step 2: Full verification — INCLUDING the docs build**

Run, and report each:
```bash
pnpm test
pnpm run type-check
pnpm run lint
pnpm run format
pnpm run build      # <-- includes the VitePress docs build that failed PR #149; MUST pass
```
If the docs build fails on a raw `<...>` in any new JSDoc, fix by backticking and re-run. If `pnpm run format` changes files, stage them.

- [ ] **Step 3: Commit**

```bash
git add .changeset
git commit -m "chore: changeset for discovery & invocation polish"
```

---

## Self-Review Notes

- **Spec coverage:** §result-schema codegen → Task 1; §exampleFromZod → Task 2; §deepen zodToCommander (Option 1) → Task 3; §surface schemas (--json) + examples (text) → Task 4; §color across help + config → Task 5; §non-goal "no live capture / synthetic examples" honored (Task 2 is pure/synthetic); §JSDoc-no-raw-angle-brackets + §full build verification → Global Constraints + Tasks 1/6.
- **Placeholder scan:** Task 1 (codegen) and Task 3 (zodToCommander) require reading existing code before editing — those read-steps are explicit and cite exact functions (`typeToBuilder`, `addFieldOptions`); the emission code, naming helper, and tests are concrete. Task 2's Zod `_def` reads carry a "adjust to installed Zod 4 shape; test is the contract" note — acceptable given Zod's internal-shape variance, with the test pinning behavior.
- **Type consistency:** `getResultSchemaForMethod(method): z.ZodType<unknown> | undefined` defined in Task 1, consumed in Task 4; `exampleFromZod(schema, depth?)` defined in Task 2, consumed in Task 4; `Formatter`/`createFormatter` (existing) used in Task 5; `methodForPath` defined + used within Task 4.
- **Risk note:** Task 1 (generator) is the highest-risk; its run-command + `lazyRefs` scoping are confirmed in Step 1 before editing, and Step 6 runs the docs build to catch generated-output issues early.
