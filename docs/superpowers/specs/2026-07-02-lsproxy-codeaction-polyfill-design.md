# lsproxy CodeAction Polyfill — Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement the plan derived from this spec.

**Goal:** Let lsproxy offer LSP capabilities a connected backend doesn't natively provide — starting with two concrete cases: backfilling `codeAction/resolve` for servers that support `textDocument/codeAction` but not resolve, and synthesizing a `source.fixAll` composite code action from a server's individual quick-fixes when it doesn't support batch fix-all natively.

**Architecture:** `apps/proxy`'s `ClientSession` (currently a hand-rolled raw JSON-RPC dispatcher) migrates onto `@lspeasy/server`'s `LSPServer`, gaining a proper capability-aware request/notification registry. A new package, `@lsproxy/polyfill`, defines a small `CodeActionPolyfill` interface and the two concrete polyfills; `ClientSession` consults them from within its `textDocument/codeAction`, `codeAction/resolve`, and `initialize` handlers. `@lspeasy/server` itself gains one new capability — a `resolveCapabilities` hook — so a server's advertised capabilities can depend on async, per-connection state (which backend is chosen) rather than only the static capabilities declared before `listen()`.

**Tech Stack:** TypeScript 5 strict, `@lspeasy/core` (protocol types, method maps), `@lspeasy/server` (`LSPServer`), `@lspeasy/client` (`LSPClient`, used for the backend connection in `apps/proxy/src/backend-pool.ts`), Vitest.

## Global Constraints

- Polyfills operate on a single backend (one language server) at a time — no cross-backend/cross-language composition. (Confirmed: both example polyfills are single-backend by nature; if a future polyfill needs cross-backend orchestration, it does not fit this design and needs its own.)
- `@lsproxy/polyfill` lives at `apps/polyfill` (flat, sibling to `apps/cli`/`apps/proxy`), matching the existing `apps/*` → `@lsproxy/*` naming convention (as opposed to `packages/*` → `@lspeasy/*` for the general SDK).
- Built-in polyfills are always on, selected purely by runtime capability detection (`appliesTo`) — no configuration surface in v1 (YAGNI; add opt-out later only if requested).
- "Fix All" v1 is scoped to backends that advertise `diagnosticProvider` (pull diagnostics, LSP 3.17 `textDocument/diagnostic`). Backends that only push diagnostics via `textDocument/publishDiagnostics` are out of scope for v1 (see Follow-ups).
- No `any`, TypeScript strict mode, conventional commits — per project CLAUDE.md.
- Implementation order: the `ClientSession` → `LSPServer` migration (sections 4 and 6, minus the codeAction-specific overrides) must land and be verified regression-free (migration-parity test passing, existing `apps/proxy` test suite green) before the polyfill-specific work (section 5, and the codeAction/resolve overrides in section 6) begins. Two sequential plan phases, not interleaved tasks.

---

## 1. Background

`apps/proxy` (`@lsproxy/proxy`) is a per-root daemon: CLI/editor clients connect over a Unix socket; `ClientSession` (`apps/proxy/src/client-session.ts`) forwards every LSP message essentially verbatim to a per-language backend `LSPClient` managed by `BackendPool` (`apps/proxy/src/backend-pool.ts`). Today this forwarding is a hand-rolled `if/else` chain over raw JSON-RPC messages — `initialize`, `shutdown`, and the non-standard `$/lsproxy.status` are special-cased; everything else is forwarded blind via `backend.sendRequest(msg.method!, msg.params)`. `handleInitialize` returns `backend.getServerCapabilities()` unmodified as the capabilities lsproxy advertises to its own client.

Two related gaps motivate this design:

1. **Resolve backfill.** Some LSP servers implement `textDocument/codeAction` but not `codeAction/resolve` (no `codeActionProvider.resolveProvider`). Per the LSP spec, such servers must return fully-resolved actions from `textDocument/codeAction` directly. A client that always calls `codeAction/resolve` regardless (common in some tooling) gets a hard failure today, because lsproxy blindly forwards `codeAction/resolve` to a backend that doesn't implement it.
2. **Composite actions.** Some servers expose only per-diagnostic quick-fixes, not the batch `source.fixAll` kind. lsproxy can synthesize `source.fixAll` itself by collecting each diagnostic's quick-fix and merging the edits — using only requests the backend *does* support.

Investigation also surfaced two pre-existing, unrelated gaps, noted here but explicitly deferred (see Follow-ups): the CLI always sends `context: { diagnostics: [] }` on `textDocument/codeAction` (`apps/cli/src/zod-to-commander.ts:443`), and lsproxy never forwards `textDocument/publishDiagnostics` notifications from backend to client at all.

## 2. Scope

**In scope:**
- Migrate `ClientSession` onto `@lspeasy/server`'s `LSPServer`.
- Add a `resolveCapabilities` hook to `@lspeasy/server`'s `ServerOptions`.
- New `@lsproxy/polyfill` package with a `CodeActionPolyfill` interface.
- Two concrete polyfills: resolve-backfill, Fix All (pull-diagnostics backends only).

**Out of scope (see Follow-ups):**
- Push-diagnostics caching and forwarding `publishDiagnostics` to the CLI/editor.
- Composite actions that require `workspace/executeCommand` routing (Fix All doesn't need this, since it returns a plain `edit`; a future polyfill might).
- Cross-backend/cross-language composite actions.
- User-facing configuration to disable individual polyfills.

## 3. Architecture

```
CLI/editor ──socket──▶ ClientSession (wraps an LSPServer instance)
                          │
                          ├─ initialize: resolveCapabilities hook resolves the
                          │   backend (BackendPool.ensureBackend), computes
                          │   applicablePolyfills(backend capabilities), patches
                          │   and returns them
                          │
                          ├─ textDocument/codeAction: forward to backend, then
                          │   run augmentCodeActions from applicable polyfills
                          │
                          ├─ codeAction/resolve: forward if backend supports it
                          │   natively; else run resolveCodeAction from the
                          │   applicable polyfill
                          │
                          ├─ workspace/applyEdit (server→client): via
                          │   LSPServer.sendRequest, replacing today's
                          │   hand-rolled pendingClientRequests bookkeeping
                          │
                          ├─ $/lsproxy.status, textDocument/didOpen|didClose:
                          │   ported as onRequest/onNotification handlers,
                          │   same logic as today
                          │
                          └─ everything else: bulk pass-through registration,
                              one handler per method in
                              ClientRequestMethodToCapabilityMap /
                              ClientNotificationMethodToCapabilityMap, each
                              still resolving the target backend per-request
                              by document URI (BackendPool.getBackend)
```

## 4. `@lspeasy/server`: `resolveCapabilities` hook

**File:** `packages/server/src/types.ts` — add to `ServerOptions<Capabilities>`:

```ts
/**
 * Resolve the capabilities to advertise for a specific connection, computed
 * from that connection's `initialize` params. Takes precedence over the
 * static capabilities passed to `registerCapabilities()` for the value
 * returned in `InitializeResult` only — `registerCapabilities()` still governs
 * the compile-time capability-aware namespaces and the handler-registration
 * guard, both of which must remain static (handlers register once, before
 * any connection exists).
 */
resolveCapabilities?(params: InitializeParams): Promise<Capabilities> | Capabilities;
```

**File:** `packages/server/src/server.ts` — in `registerBuiltinHandlers()`'s `initialize` handler, after computing `this.state = ServerState.Initializing`:

```ts
const capabilities = this.options.resolveCapabilities
  ? await this.options.resolveCapabilities(params)
  : this.lifecycleManager.getCapabilities();
this.lifecycleManager.registerCapabilities(capabilities as ServerCapabilities);
```

then proceed with `this.lifecycleManager.handleInitialize(...)` as today, which now reads the just-set dynamic capabilities. No change to `LifecycleManager` itself — `registerCapabilities` is already a plain setter, callable at any time.

## 5. `@lsproxy/polyfill`

**File:** `apps/polyfill/src/types.ts`

```ts
import type { CodeAction, CodeActionParams, ServerCapabilities } from '@lspeasy/core';
import type { LSPClient } from '@lspeasy/client';

export interface CodeActionPolyfill {
  readonly id: string;

  /** Does this backend have the gap this polyfill fills? Checked once per
   *  backend, from its real (unpatched) capabilities. */
  appliesTo(capabilities: ServerCapabilities): boolean;

  /** Patch the capabilities lsproxy advertises to its own client so it knows
   *  the polyfilled feature is available. */
  patchCapabilities?(capabilities: ServerCapabilities): ServerCapabilities;

  /** Augment textDocument/codeAction's real result with synthesized actions. */
  augmentCodeActions?(
    actions: CodeAction[],
    params: CodeActionParams,
    backend: LSPClient
  ): Promise<CodeAction[]>;

  /** Answer codeAction/resolve when the backend doesn't natively support it. */
  resolveCodeAction?(action: CodeAction, backend: LSPClient): Promise<CodeAction>;
}
```

**File:** `apps/polyfill/src/resolve-backfill.ts`

- `appliesTo`: `codeActionProvider` truthy, and either it's `true` (boolean form — no resolve) or an object without `resolveProvider === true`.
- `patchCapabilities`: normalizes `codeActionProvider` to object form and sets `resolveProvider: true`.
- `resolveCodeAction`: returns the input `action` unchanged (spec: a non-resolve-provider server's actions from `textDocument/codeAction` must already be fully resolved).

**File:** `apps/polyfill/src/fix-all.ts`

- `appliesTo`: `codeActionProvider` truthy, `diagnosticProvider` present, and `source.fixAll` not already in `codeActionProvider.codeActionKinds` (when the object form is used).
- `augmentCodeActions`: no-ops unless `params.context.only` explicitly requests `source.fixAll` or `source`. When triggered:
  1. `backend.sendRequest('textDocument/diagnostic', { textDocument: params.textDocument })` → full diagnostics list (`.items` from the `full` report kind).
  2. For each diagnostic: `backend.sendRequest('textDocument/codeAction', { textDocument, range: diagnostic.range, context: { diagnostics: [diagnostic], only: ['quickfix'] } })`; pick the `isPreferred` action, else the first result; skip diagnostics with none.
  3. For any chosen action with a `command` but no `edit`, resolve it via the backend's real `codeAction/resolve` if it supports resolve; otherwise skip that diagnostic's fix.
  4. Merge all collected `WorkspaceEdit.changes` (the `{[uri]: TextEdit[]}` form only — `documentChanges` is unsupported in v1, a stated limitation) per URI. On overlapping `TextEdit` ranges within one URI, keep the earlier-collected edit and drop the later one.
  5. If at least one fix merged, append `{ title: 'Fix all auto-fixable problems', kind: 'source.fixAll', edit: merged }` to the real actions array; otherwise return the real actions unchanged.

**File:** `apps/polyfill/src/registry.ts`

```ts
export const BUILTIN_POLYFILLS: readonly CodeActionPolyfill[] = [resolveBackfill, fixAll];

export function applicablePolyfills(capabilities: ServerCapabilities): CodeActionPolyfill[] {
  return BUILTIN_POLYFILLS.filter((p) => p.appliesTo(capabilities));
}
```

## 6. `apps/proxy` `ClientSession` migration

**File:** `apps/proxy/src/client-session.ts` (rewrite)

- Construct one `LSPServer` per session (mirrors today's one-`ClientSession`-per-socket lifetime), with `resolveCapabilities` wired to: resolve the backend via `pool.ensureBackend(languageId)` (reading `languageId` from `params.initializationOptions`, same as today's `handleInitialize`), compute `applicablePolyfills(backend.getServerCapabilities() ?? {})`, and fold each applicable polyfill's `patchCapabilities` over the raw capabilities.
- Bulk pass-through: iterate `ClientRequestMethodToCapabilityMap`/`ClientNotificationMethodToCapabilityMap` (from `@lspeasy/core`) and register one `onRequest`/`onNotification` handler per method that resolves the target backend by document URI (porting today's `resolveBackend`/`languageIdForUri` logic) and forwards `params` unchanged.
- Override the pass-through for three methods:
  - `textDocument/codeAction`: forward to backend, then run `augmentCodeActions` for each applicable polyfill (from `applicablePolyfills(backend.getServerCapabilities())`), accumulating.
  - `codeAction/resolve`: if the backend's real capabilities show native resolve support, forward as-is; otherwise run the applicable polyfill's `resolveCodeAction`.
  - `textDocument/didOpen`/`didClose`: keep today's doc-state-manager logic (lazy backend spin-up, change-vs-open detection).
- `$/lsproxy.status`: registered as a plain `onRequest` handler (non-standard method — supported via `LSPServer.onRequest`'s loosely-typed overload).
- `workspace/applyEdit` (server-initiated): replace the hand-rolled `pendingClientRequests`/`forwardToClient` bookkeeping with `LSPServer.sendRequest('workspace/applyEdit', params)`, called from wherever the backend's own `workspace/applyEdit` request handler runs.

## 7. Error Handling

- If any backend request during `augmentCodeActions`' diagnostics/per-diagnostic-fix loop throws, `augmentCodeActions` fails; the `textDocument/codeAction` handler catches this and falls back to returning just the real backend actions it already had, rather than failing the whole request.
- An action with neither `edit` nor `command` (or a `command`-only action that can't be resolved) is silently skipped for that diagnostic — counts as "no fix available."
- Polyfill-originated protocol errors (not degrade-gracefully cases) use `ResponseError` from `@lspeasy/core`, matching `LSPServer`'s own dispatcher error shape.
- Bulk pass-through registration is the highest regression risk in this design — a method present in the method maps but mis-registered (e.g. request/notification confusion) would silently break that one LSP method. Mitigated by the migration-parity test below.

## 8. Testing

- **Migration parity:** drive every method in `ClientRequestMethodToCapabilityMap` + `ClientNotificationMethodToCapabilityMap` through a `ClientSession` backed by a mock/fake backend; assert each forwards correctly.
- **`resolveCapabilities` hook (in `@lspeasy/server`):** unit test that `InitializeResult.capabilities` reflects the hook's return value, not the value passed to `registerCapabilities()`, and that omitting the hook falls back to the static value (backwards compatible).
- **Resolve-backfill:** unit tests for `appliesTo` (gated on/off by capability shape), `patchCapabilities`, and `resolveCodeAction` echoing input unchanged.
- **Fix All:** unit tests for `appliesTo` gating (pull-diagnostics presence, `source.fixAll` already-advertised exclusion), the fetch/merge logic against a mock backend returning canned diagnostics/actions, and the overlap-drop (first-wins) policy.
- **End-to-end:** extend `e2e/` with at least one test exercising both polyfills against a real or fixture LSP server through the full proxy path.

## 9. Follow-ups (explicitly out of scope here)

- Push-diagnostics cache: subscribe to `textDocument/publishDiagnostics` per backend, cache latest diagnostics per URI, to support Fix All on backends without pull diagnostics.
- Forward `publishDiagnostics` (and other server-initiated notifications) from backend to the CLI/editor client — currently silently dropped, a pre-existing gap unrelated to this feature.
- Fix the CLI always sending `context: { diagnostics: [] }` on `textDocument/codeAction` (`apps/cli/src/zod-to-commander.ts:443`).
- A `handleCommand` hook on `CodeActionPolyfill` for composite actions that need `workspace/executeCommand` routing (not needed by Fix All, which returns a plain `edit`).
- User-facing configuration to disable individual built-in polyfills, if ever requested.
