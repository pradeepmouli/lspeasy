# Move zod off the runtime path: build-time schema introspection

## Problem

`lsproxy` spends roughly 45% of its cold start constructing zod schemas it
never validates with.

The CLI's discovery model derives its entire command grammar — which flags
exist, which values are legal, how arguments parse — from the LSP protocol
schemas in `packages/core/src/protocol/schemas.ts`. That derivation happens
at runtime, on every single invocation, and it is pure structural
introspection: `apps/cli/src/zod-to-commander.ts` is 664 lines of
`instanceof z.ZodObject` / `z.ZodString` / `z.ZodEnum` / `z.ZodUnion`
checks reading `.shape`, `.element`, `.options`, and `.values` off the
schema AST. Nothing is parsed. Nothing is validated.

Measured on Node 26, from `apps/cli`:

```
zod's own module load ............ ~15-30ms
protocol schema construction ..... ~17ms      (2,672 lines of schemas.ts)
                                   --------
                                   ~41ms      of a ~90-140ms cold start
```

The schemas are also re-exported unconditionally from the `@lspeasy/core`
barrel (`index.ts:200-203`), so *every* consumer of the package pays for
them — including consumers that only want types and a transport. Tracing
actual usage shows how badly that trade is priced:

| Module | Imports zod | Actually consumed by |
| --- | --- | --- |
| `protocol/schemas.ts` (2,672 loc) | yes | **`apps/cli` only** — `build-commands`, `anchor`, `help`, `zod-to-commander`. Not `client`, not `server`. |
| `jsonrpc/schemas.ts` (85 loc, `messageSchema`) | yes | core's own `socket` / `tcp` / `shared-worker` transports, which genuinely `safeParse` untrusted wire data |
| `example-from-zod.ts`, `zod-introspection.ts` | yes | `apps/cli` help and example rendering |

So the 2,672-line protocol schema graph has exactly one consumer in the
repo, and that consumer only walks it.

A secondary finding: `packages/client/src/validation.ts` exports
`validateResponse` and `ResponseValidationError`, and nothing outside that
file ever calls them. It is dead code.

### Why this surfaced now

While evaluating whether `lsproxy` could compile with
[scriptc](https://github.com/vercel-labs/scriptc), zod was one of the two
largest blockers (`SC2013` — zod values require the embedded JS engine).
That evaluation is a **no-go for unrelated reasons**: scriptc's
`ChildProcess` exposes `stdout`/`stderr` but no `stdin` ("piped STDIN stays
a compile fence"), and an LSP client must write JSON-RPC to a spawned
server's stdin. scriptc is **not** a motivation for this design and no part
of this spec should be justified by it.

The startup cost stands entirely on its own: it is paid by every `lsproxy`
invocation on Node today.

## Approach

Move the schema introspection from runtime to build time, and stop
re-exporting zod-importing modules from the `@lspeasy/core` barrel.

Two changes, which are separable but land together because the second is
what makes the first pay off fully:

1. **Generate static descriptors.** Extend the existing protocol generator
   to emit the derived data — command descriptors, JSON Schemas, example
   payloads — as plain TypeScript data. The CLI reads that instead of
   walking schema nodes.

2. **Split the barrel.** Move every zod-importing module behind a
   `@lspeasy/core/schemas` subpath so the main barrel is zod-free.

### Why both

If only (1) lands, `apps/cli` stops walking schemas but still imports
`@lspeasy/core`, whose barrel still re-exports `messageSchema` and
`exampleFromZod` — both of which import zod. zod's module load (~15-30ms)
is paid anyway and only ~17ms of the ~41ms is recovered.

The controlling invariant is therefore:

> **The `@lspeasy/core` barrel re-exports nothing that transitively imports
> zod.**

This is a property of the barrel, not of any one schema module, which is
why the guard in §5 tests the module graph rather than a list of names.

### Why not alternatives

**Lazy/conditional import of zod.** Defers the cost rather than removing
it. The CLI needs the schema data on the dispatch path, not just under
`--help` — `build-commands.ts` reads `LSPSchemas` to build the command tree
for real invocations — so the import fires on essentially every run. It
also leaves the barrel unchanged, so library consumers keep paying.

**Subpath split alone, no generation.** Helps other consumers of
`@lspeasy/core` but does nothing for `lsproxy`, which genuinely needs the
schema data and would simply import it from the new subpath. Zero startup
win for the CLI.

**Hand-write the descriptors.** They would drift from `schemas.ts` on the
first protocol update. The schemas are already generated; the descriptors
must be generated from the same source in the same step.

## Design

### 1. The subpath split

`packages/core/package.json` already declares seven subpath exports
(`./node`, `./protocol`, `./protocol/enums`, `./transport`, `./utils`,
`./utils/internal`, `./middleware`), so this follows an established pattern
rather than introducing one.

Add:

```jsonc
"./schemas": {
  "types": "./dist/schemas.d.ts",
  "import": "./dist/schemas.js"
}
```

`packages/core/src/schemas.ts` becomes a new barrel re-exporting:

- everything currently exported from `./protocol/schemas.js`
  (`LSPSchemas`, `getSchemaForMethod`, `LSPResultSchemas`,
  `getResultSchemaForMethod`, and the individual `*ParamsSchema` values)
- everything currently exported from `./jsonrpc/schemas.js`
  (`messageSchema`, `requestMessageSchema`, `notificationMessageSchema`,
  `responseErrorSchema`, `successResponseMessageSchema`,
  `errorResponseMessageSchema`, `responseMessageSchema`)
- `exampleFromZod` and the `zod-introspection` helpers

Those same exports are **removed** from `packages/core/src/index.ts`.

Internal core modules are unaffected: `transport/socket.ts`,
`transport/tcp.ts`, and `transport/shared-worker.ts` already import
`messageSchema` via a relative path (`from '../jsonrpc/schemas.js'`) and
keep doing so. Their runtime validation of untrusted wire data is
deliberately retained — it is real validation, unlike the CLI's
introspection.

Because `StdioTransport` contains no zod at all, and `lsproxy` uses only
`StdioTransport`, the CLI's module graph ends up genuinely zod-free rather
than merely zod-deferred.

**Type-only exports stay in the main barrel.** `z.infer`-derived types
(e.g. `Message`) erase at compile time and cost nothing at runtime, so
moving them would break consumers for no benefit.

### 2. The generator

`scripts/generate-protocol-types.ts` already writes
`packages/core/src/protocol/schemas.ts`. Add a step that imports the
just-generated schemas and emits static data into
`apps/cli/src/generated/`.

The generated files are committed (matching how `protocol/schemas.ts` is
committed today), so a plain `pnpm install && pnpm build` needs no
generation step and the diff is reviewable.

**`command-descriptors.ts`** — the field tree that `zodToCommander`
currently derives by walking. One entry per method:

```ts
export interface FieldDescriptor {
  /** Kebab-case CLI flag path, e.g. "position-line". */
  readonly cliKey: string;
  /** Dotted params path the value is written to, e.g. "position.line". */
  readonly paramsPath: string;
  readonly kind: 'string' | 'number' | 'boolean' | 'enum';
  readonly optional: boolean;
  readonly isArray: boolean;
  /** Present for closed enums/literal unions; absent when the union has an
   *  open-ended arm (see the CodeActionKind case in §4). */
  readonly choices?: readonly string[];
}

export interface MethodDescriptor {
  readonly method: string;
  readonly fields: readonly FieldDescriptor[];
  /** Fields the schema requires that are not expressible as flags, which
   *  the residual-JSON path handles. */
  readonly residual: boolean;
}

export const COMMAND_DESCRIPTORS: Readonly<Record<string, MethodDescriptor>>;
```

**`json-schemas.ts`** — the `z.toJSONSchema()` output that `help.ts`
computes at runtime for `--json`, keyed by method, for both params and
result.

**`examples.ts`** — `exampleFromZod()` results, keyed by method.

### 3. Runtime changes in `apps/cli`

`zodToCommander` keeps its name, signature shape, and responsibility —
building a Commander command from method metadata. Only its *input*
changes: it reads a `MethodDescriptor` instead of walking a `z.ZodType`.
The option-registration, kebab-casing, and residual-JSON logic is
unchanged.

`help.ts` reads `json-schemas.ts` and `examples.ts` instead of calling
`z.toJSONSchema` / `exampleFromZod`.

`anchor.ts` and `build-commands.ts` read `COMMAND_DESCRIPTORS` instead of
`LSPSchemas` / `getSchemaForMethod`.

**Runtime capability filtering is unchanged.** `build-commands.ts`
continues to consult live `ServerCapabilities` through
`getCapabilityForRequestMethod`. Only the static half of the derivation
moves to build time; which commands a given server actually exposes is
still decided at runtime, per session.

**Unknown methods degrade exactly as today.** A server extension method
misses the descriptor lookup and yields `undefined`, hitting the same
fallback that a `getSchemaForMethod` miss hits now. No runtime zod fallback
is required.

### 4. The risky part: porting the walker

`zod-to-commander.ts` is 664 lines and the schema-walking logic in it is
subtle. Cases that must survive the port, called out explicitly because
they are where a silent regression would hide:

- **Mixed open/closed unions.** `CodeActionKindSchema` is
  `z.union([z.literal('quickfix'), ..., z.string()])`. The open-ended
  `z.string()` tail means *any* string is valid, so `choices` must be
  omitted rather than populated with the literal arms. Emitting the
  literals as a closed choice list would reject valid input.
- **Nested object flattening.** Object members recurse into
  `position-line` / `position-character` style flag paths with a depth
  bound.
- **Optional unwrapping.** `z.optional` wrappers must be unwrapped before
  kind detection, and the unwrap must set `optional: true` rather than
  being discarded.
- **Scalar array elements.** `z.array` of scalars becomes a repeatable
  flag; `z.array` of objects does not, and is left to residual JSON.

The logic itself is not rewritten — it moves from runtime to the generator
essentially verbatim. But "essentially" is the risk, which §5 addresses.

### 5. Testing

**Equivalence during transition.** `zod-to-commander.test.ts` runs against
*both* implementations — the existing runtime walker and the generated
descriptors — asserting identical Commander trees for every method in
`LSPSchemas`. The runtime walker is deleted only once this passes across
the full method set. This is the primary defense against a silent
regression in §4 and is the reason the walker is not removed in the same
step it is replaced.

**Barrel purity.** A test that imports `@lspeasy/core` and asserts `zod`
is absent from the resulting module graph. This encodes the §2 invariant
directly. Without it, a future export re-introduces zod to the barrel and
silently returns the ~41ms, with no failing test and no obvious symptom —
which is precisely how the current situation arose.

**Generated freshness.** CI regenerates and runs `git diff --exit-code`,
matching the existing protocol-generation check, so descriptors cannot
drift from `schemas.ts`.

**Startup benchmark.** An assertion on cold-start time for
`lsproxy --version`, so the win is defended rather than achieved once and
eroded. Threshold set with enough headroom to not be flaky on CI runners —
this guards against a regression of tens of milliseconds, not single-digit
noise.

### 6. Dead code removal

Delete `validateResponse` and `ResponseValidationError` from
`packages/client/src/validation.ts`, and the `ValidationOptions` interface
if it has no remaining consumer. Nothing outside that file calls them.

This is included because it is zod-importing code in a package this change
already touches, and leaving it would mean `packages/client` keeps a zod
dependency for an unreachable code path. It is called out separately so it
can be dropped from the change if review disagrees.

## Migration

This is a **breaking change to `@lspeasy/core`'s public API** and needs a
changeset with a major bump.

Consumers importing schemas from the barrel update their import path:

```ts
// before
import { LSPSchemas, getSchemaForMethod, messageSchema } from '@lspeasy/core';

// after
import { LSPSchemas, getSchemaForMethod, messageSchema } from '@lspeasy/core/schemas';
```

Type-only imports are unaffected. In-repo, only `apps/cli` imports these,
and it stops importing them entirely.

The changeset and `packages/core/README.md` should state the rule plainly:
**types and transports from `@lspeasy/core`; runtime validation from
`@lspeasy/core/schemas`.**

## Non-goals

- **Removing runtime validation from the network transports.**
  `socket`/`tcp`/`shared-worker` parse untrusted wire data and keep
  validating it. The premise "we own both ends" is true for the CLI's own
  I/O and false for a network transport.
- **Making `lsproxy` compile with scriptc.** Blocked upstream on child
  stdin; not a goal here.
- **Changing the discovery model.** The CLI still derives its grammar from
  the protocol schemas and still filters by live server capabilities. Only
  the phase in which the static half is computed changes.
- **Optimizing `commander`'s own load cost.** Out of scope; measure
  separately if the ~41ms recovery proves insufficient.
