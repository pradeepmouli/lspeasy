# lsproxy CodeAction Polyfill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let lsproxy offer LSP capabilities a connected backend doesn't natively provide — codeAction/resolve backfill and a synthesized `source.fixAll` composite action — by migrating `apps/proxy`'s session handling onto `@lspeasy/server`'s `LSPServer`, then layering polyfills on top.

**Architecture:** Two sequential phases. Phase 1 migrates `apps/proxy`'s per-connection session from a hand-rolled raw JSON-RPC dispatcher (`ClientSession`) to a new `LSPServer`-based `ProxySession`, built *alongside* the existing `ClientSession` (parallel implementations, so each can be tested independently) and cut over only once validated. Phase 2 adds the `@lsproxy/polyfill` package and wires it into `ProxySession`.

**Tech Stack:** TypeScript 5 strict, `@lspeasy/core`, `@lspeasy/server` (`LSPServer`), `@lspeasy/client` (`LSPClient`), Vitest, pnpm workspaces.

## Global Constraints

- No `any`, TypeScript strict mode, conventional commits (project CLAUDE.md).
- Polyfills operate on a single backend at a time — no cross-backend composition.
- `@lsproxy/polyfill` lives at `apps/polyfill` (flat, matching the `apps/*` → `@lsproxy/*` convention).
- Built-in polyfills are always on, selected by runtime capability detection — no config surface.
- "Fix All" v1 only applies to backends advertising `diagnosticProvider` (pull diagnostics).
- Phase 1 (migration) must fully land, pass its tests, and the daemon `ProxyServer` must be cut over to `ProxySession` before any Phase 2 (polyfill) task begins.
- The new per-connection class is named `ProxySession` (not `ClientSessionV2`) — `ProxyServer` (the existing daemon in `apps/proxy/src/proxy-server.ts`) keeps its current name unchanged.

---

## Phase 1: Migrate to `ProxySession`

### Task 1: `resolveCapabilities` hook on `@lspeasy/server`'s `LSPServer`

**Files:**
- Modify: `packages/server/src/types.ts`
- Modify: `packages/server/src/server.ts:579-630` (`registerBuiltinHandlers`'s `initialize` handler)
- Test: `packages/server/test/integration/initialize.test.ts`

**Interfaces:**
- Produces: `ServerOptions<Capabilities>.resolveCapabilities?(params: InitializeParams): Promise<Capabilities> | Capabilities` — an optional per-connection capability resolver. When provided, its return value (not the value passed to `registerCapabilities()`) is what `InitializeResult.capabilities` contains for that connection. `registerCapabilities()` keeps governing compile-time typing and the handler-registration guard, both of which stay static.

- [ ] **Step 1: Write the failing test**

Add to `packages/server/test/integration/initialize.test.ts`, inside the existing `describe('Initialize Handshake Integration', ...)` block (after the `'should handle initialize request'` test):

```ts
  it('uses resolveCapabilities to determine advertised capabilities per connection', async () => {
    const dynamicServer = new LSPServer({
      name: 'dynamic-server',
      version: '1.0.0',
      logLevel: LogLevel.Error,
      resolveCapabilities: async (params) => {
        expect(params.rootUri).toBe('file:///dynamic-root');
        return { hoverProvider: true, definitionProvider: true };
      }
    });
    const dynamicTransport = new TestTransport();
    await dynamicServer.listen(dynamicTransport);

    dynamicTransport.simulateMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        processId: null,
        rootUri: 'file:///dynamic-root',
        capabilities: {}
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = dynamicTransport.sentMessages[0];
    expect(response.result.capabilities).toEqual({
      hoverProvider: true,
      definitionProvider: true
    });

    await dynamicServer.close();
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run packages/server/test/integration/initialize.test.ts`
Expected: FAIL — `resolveCapabilities` does not exist on `ServerOptions` (type error) or, if TS is loose enough to run, the returned capabilities are `{}` instead of the expected object (the option is silently ignored).

- [ ] **Step 3: Add the option to `ServerOptions`**

In `packages/server/src/types.ts`, add `InitializeParams` to the `@lspeasy/core` type import (top of file):

```ts
import type {
  CancellationToken,
  Logger,
  ClientCapabilities,
  Server,
  DidOpenNotebookDocumentParams,
  DidChangeNotebookDocumentParams,
  DidSaveNotebookDocumentParams,
  DidCloseNotebookDocumentParams,
  LogLevel,
  ServerCapabilities,
  Middleware,
  ScopedMiddleware,
  InitializeParams
} from '@lspeasy/core';
```

Then add the field to `ServerOptions<Capabilities>`, right after the existing `capabilities` field (around line 83):

```ts
  capabilities?: Capabilities;

  /**
   * Resolve the capabilities to advertise for a specific connection, computed
   * from that connection's `initialize` params.
   *
   * @remarks
   * Takes precedence over `registerCapabilities()` for the value returned in
   * `InitializeResult` only. `registerCapabilities()` still governs the
   * compile-time capability-aware namespaces and the handler-registration
   * guard, both of which must remain static — handlers register once, before
   * any connection exists, so they cannot depend on a specific connection's
   * resolved capabilities.
   */
  resolveCapabilities?(params: InitializeParams): Promise<Capabilities> | Capabilities;

  /**
   * Strict capability checking mode
```

(The `/** Strict capability checking mode` doc comment for the next field, `strictCapabilities`, already exists directly below `capabilities` — insert the new field and its doc comment between `capabilities` and that existing comment, without duplicating or removing anything.)

- [ ] **Step 4: Use the hook in the built-in `initialize` handler**

In `packages/server/src/server.ts`, inside `registerBuiltinHandlers()`, modify the `initialize` handler:

```ts
    // Initialize request - use onRequest to get validation
    this.onRequest('initialize', async (params, token, context) => {
      if (this.state !== ServerState.Created) {
        throw ResponseError.invalidRequest('Server already initialized');
      }

      this.state = ServerState.Initializing;
      this.clientCapabilities = params.capabilities;
      this.clientCapabilityGuard = new ClientCapabilityGuard(
        params.capabilities ?? {},
        this.logger,
        this.options.strictCapabilities ?? false
      );
      if (params.clientInfo) {
        this.clientInfo = params.clientInfo;
      }
      this.dispatcher.setClientCapabilities(params.capabilities);

      if (this.options.resolveCapabilities) {
        const resolved = await this.options.resolveCapabilities(params);
        this.lifecycleManager.registerCapabilities(resolved as ServerCapabilities);
      }

      const result = await this.lifecycleManager.handleInitialize(
        params,
        this.transport!,
        context.id
      );
      this.state = ServerState.Initialized;

      return result;
    });
```

(Only the new `if (this.options.resolveCapabilities) { ... }` block is added; everything else in this handler is unchanged.)

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm vitest run packages/server/test/integration/initialize.test.ts`
Expected: PASS (all tests in the file, including the new one and the pre-existing ones — the fallback path, where `resolveCapabilities` is omitted and `registerCapabilities()`'s value is used, is already covered by `'should handle initialize request'`).

- [ ] **Step 6: Run the full server package test suite and type-check**

Run: `pnpm vitest run packages/server && pnpm --filter @lspeasy/server type-check`
Expected: all pass, no regressions.

- [ ] **Step 7: Commit**

```bash
git add packages/server/src/types.ts packages/server/src/server.ts packages/server/test/integration/initialize.test.ts
git commit -m "feat(server): add resolveCapabilities hook for per-connection dynamic capabilities"
```

---

### Task 2: Scaffold `apps/polyfill` package (empty, for later phases to build on) — SKIP, folded into Task 6

*(Intentionally omitted here — package scaffolding is folded into Task 6, the first task that actually needs the package, per the "fold setup into the task whose deliverable needs it" rule.)*

### Task 2: Bulk pass-through registration helper

**Files:**
- Create: `apps/proxy/src/pass-through.ts`
- Test: `apps/proxy/src/pass-through.test.ts`

**Interfaces:**
- Consumes: `ClientRequestMethodToCapabilityMap: Map<string, string | undefined>` and `ClientNotificationMethodToCapabilityMap: Map<string, string | undefined>`, both exported from `@lspeasy/core` (defined in `packages/core/src/protocol/capability-methods.ts`). `LSPServer` type and `LSPClient` type, both already exported from `@lspeasy/server` and `@lspeasy/client` respectively.
- Produces: `registerPassThrough(server: LSPServer, resolveBackend: BackendResolver): void` and `type BackendResolver = (params: unknown) => LSPClient`. Later tasks (3, 4) construct a `BackendResolver` closure and call `registerPassThrough` once during `ProxySession` construction.

- [ ] **Step 1: Write the failing test**

Create `apps/proxy/src/pass-through.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { LSPServer, LogLevel } from '@lspeasy/server';
import { ClientRequestMethodToCapabilityMap, ClientNotificationMethodToCapabilityMap } from '@lspeasy/core';
import type { Transport, Message } from '@lspeasy/core';
import { registerPassThrough } from './pass-through.js';

class FakeTransport implements Transport {
  public sent: Message[] = [];
  private messageHandlers: Array<(m: Message) => void> = [];
  async send(m: Message): Promise<void> {
    this.sent.push(m);
  }
  onMessage(h: (m: Message) => void) {
    this.messageHandlers.push(h);
    return { dispose: () => {} };
  }
  onError() {
    return { dispose: () => {} };
  }
  onClose() {
    return { dispose: () => {} };
  }
  async close(): Promise<void> {}
  simulate(m: Message): void {
    for (const h of this.messageHandlers) h(m);
  }
}

const EXCLUDED = new Set(['initialize', 'shutdown', 'initialized', 'exit', '$/cancelRequest']);

async function initializedServer() {
  const server = new LSPServer({ logLevel: LogLevel.Error });
  const backend = { sendRequest: vi.fn().mockResolvedValue({ ok: true }), sendNotification: vi.fn().mockResolvedValue(undefined) };
  registerPassThrough(server, () => backend as never);
  const transport = new FakeTransport();
  await server.listen(transport);
  transport.simulate({
    jsonrpc: '2.0',
    id: 0,
    method: 'initialize',
    params: { processId: null, rootUri: null, capabilities: {} }
  });
  await vi.waitFor(() => expect(transport.sent).toHaveLength(1));
  return { server, backend, transport };
}

describe('registerPassThrough', () => {
  it('forwards a sample of methods across both request and notification maps to the resolved backend', async () => {
    const { backend, transport } = await initializedServer();

    transport.simulate({
      jsonrpc: '2.0',
      id: 1,
      method: 'textDocument/hover',
      params: { textDocument: { uri: 'file:///x.ts' }, position: { line: 0, character: 0 } }
    });
    await vi.waitFor(() => expect(backend.sendRequest).toHaveBeenCalledWith('textDocument/hover', expect.anything()));

    transport.simulate({
      jsonrpc: '2.0',
      method: 'textDocument/didChange',
      params: { textDocument: { uri: 'file:///x.ts', version: 2 }, contentChanges: [] }
    });
    await vi.waitFor(() =>
      expect(backend.sendNotification).toHaveBeenCalledWith('textDocument/didChange', expect.anything())
    );
  });

  it('does not clobber the lifecycle methods LSPServer already handles internally', async () => {
    const { transport } = await initializedServer();
    // A second initialize must be rejected by LSPServer's own built-in guard
    // (ServerState !== Created), not silently forwarded to a backend.
    transport.simulate({
      jsonrpc: '2.0',
      id: 2,
      method: 'initialize',
      params: { processId: null, rootUri: null, capabilities: {} }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(2));
    expect(transport.sent[1]).toMatchObject({ id: 2, error: { code: -32600 } });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run apps/proxy/src/pass-through.test.ts`
Expected: FAIL — `./pass-through.js` does not exist.

- [ ] **Step 3: Implement `registerPassThrough`**

Create `apps/proxy/src/pass-through.ts`:

```ts
// apps/proxy/src/pass-through.ts
import { ClientRequestMethodToCapabilityMap, ClientNotificationMethodToCapabilityMap } from '@lspeasy/core';
import type { LSPClient } from '@lspeasy/client';
import type { LSPServer } from '@lspeasy/server';

/** Resolve the backend LSPClient a given request/notification's params should
 *  be routed to (e.g. by document URI). */
export type BackendResolver = (params: unknown) => LSPClient;

// Handled internally by LSPServer's own lifecycle machinery — must never be
// overwritten by a blind pass-through, or the handshake/shutdown/cancellation
// protocol breaks.
const LIFECYCLE_METHODS = new Set(['initialize', 'shutdown', 'initialized', 'exit', '$/cancelRequest']);

/** Register a forward-everything-verbatim handler for every LSP method this
 *  proxy doesn't special-case, so ProxySession transparently mirrors whatever
 *  the resolved backend supports — matching today's ClientSession behavior. */
export function registerPassThrough(server: LSPServer, resolveBackend: BackendResolver): void {
  for (const method of ClientRequestMethodToCapabilityMap.keys()) {
    if (LIFECYCLE_METHODS.has(method)) continue;
    server.onRequest(method, async (params: unknown) => {
      const backend = resolveBackend(params);
      return (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(method, params);
    });
  }

  for (const method of ClientNotificationMethodToCapabilityMap.keys()) {
    if (LIFECYCLE_METHODS.has(method)) continue;
    server.onNotification(method, async (params: unknown) => {
      const backend = resolveBackend(params);
      await (backend.sendNotification as (m: string, p: unknown) => Promise<void>)(method, params);
    });
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run apps/proxy/src/pass-through.test.ts`
Expected: PASS.

- [ ] **Step 5: Add the migration-parity test**

Append to `apps/proxy/src/pass-through.test.ts`:

```ts
describe('registerPassThrough — full surface parity', () => {
  it('registers every request method except lifecycle ones', async () => {
    const backend = { sendRequest: vi.fn().mockResolvedValue(null) };
    const server = new LSPServer({ logLevel: LogLevel.Error });
    registerPassThrough(server, () => backend as never);
    const transport = new FakeTransport();
    await server.listen(transport);
    transport.simulate({
      jsonrpc: '2.0',
      id: 0,
      method: 'initialize',
      params: { processId: null, rootUri: null, capabilities: {} }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));

    const methods = [...ClientRequestMethodToCapabilityMap.keys()].filter((m) => !EXCLUDED.has(m));
    let id = 1;
    for (const method of methods) {
      transport.simulate({ jsonrpc: '2.0', id: id++, method, params: {} });
    }
    await vi.waitFor(() => expect(backend.sendRequest).toHaveBeenCalledTimes(methods.length));
    for (const method of methods) {
      expect(backend.sendRequest).toHaveBeenCalledWith(method, expect.anything());
    }
  });
});
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm vitest run apps/proxy/src/pass-through.test.ts`
Expected: PASS — every non-lifecycle method in the map was forwarded.

- [ ] **Step 7: Run the full proxy test suite and type-check**

Run: `pnpm vitest run apps/proxy && pnpm --filter @lsproxy/proxy type-check`
Expected: all pass (note: `client-session.ts` is untouched by this task, so its existing tests still pass unmodified).

- [ ] **Step 8: Commit**

```bash
git add apps/proxy/src/pass-through.ts apps/proxy/src/pass-through.test.ts
git commit -m "feat(proxy): add bulk pass-through registration helper for LSPServer"
```

---

### Task 3: `ProxySession` — construction, dynamic capabilities, pass-through wiring, status

**Files:**
- Create: `apps/proxy/src/proxy-session.ts`
- Test: `apps/proxy/src/proxy-session.test.ts`
- Modify: `apps/proxy/package.json` (add `@lspeasy/server` dependency)
- Modify: `apps/proxy/tsconfig.json` (add `packages/server` project reference)

**Interfaces:**
- Consumes: `BackendPool` (`apps/proxy/src/backend-pool.ts`) — `ensureBackend(languageId): Promise<LSPClient>`, `getBackend(languageId): LSPClient | undefined`, `getLanguageIdForExtension(ext): string | undefined`, `recordRequest(languageId): void`. `registerPassThrough`/`BackendResolver` from Task 2 (`./pass-through.js`). `StatusReport` from `apps/proxy/src/status.ts`.
- Produces: `class ProxySession` with constructor `{ sessionId: string; transport: Transport; pool: BackendPool; docState: DocumentStateManager; root: string; onEnd: (sessionId: string) => void; onStatus: () => StatusReport }` — the same public shape as today's `ClientSession`, so `proxy-server.ts` can swap the import with no other changes (Task 5). This task covers everything except doc-state notification handling and `workspace/applyEdit` forwarding, which are Task 4.

- [ ] **Step 1: Add the `@lspeasy/server` dependency**

In `apps/proxy/package.json`, add to `dependencies` (alphabetical, alongside the existing two):

```json
  "dependencies": {
    "@lspeasy/client": "workspace:*",
    "@lspeasy/core": "workspace:*",
    "@lspeasy/server": "workspace:*"
  },
```

In `apps/proxy/tsconfig.json`, add a reference:

```json
  "references": [
    { "path": "../../packages/core" },
    { "path": "../../packages/client" },
    { "path": "../../packages/server" }
  ],
```

Run: `pnpm install`
Expected: lockfile updates, no errors.

- [ ] **Step 2: Write the failing test**

Create `apps/proxy/src/proxy-session.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import type { Transport, Message } from '@lspeasy/core';
import { ProxySession } from './proxy-session.js';
import type { StatusReport } from './status.js';

class FakeTransport implements Transport {
  public sent: Message[] = [];
  private messageHandlers: Array<(m: Message) => void> = [];
  async send(m: Message): Promise<void> {
    this.sent.push(m);
  }
  onMessage(h: (m: Message) => void) {
    this.messageHandlers.push(h);
    return { dispose: () => {} };
  }
  onError() {
    return { dispose: () => {} };
  }
  onClose() {
    return { dispose: () => {} };
  }
  async close(): Promise<void> {}
  simulate(m: Message): void {
    for (const h of this.messageHandlers) h(m);
  }
}

const STATUS: StatusReport = { daemon: null, languages: [] };

function makeSession(capabilities: Record<string, unknown> = { hoverProvider: true }) {
  const recordRequest = vi.fn();
  const backend = {
    sendRequest: vi.fn().mockResolvedValue({ ok: 1 }),
    sendNotification: vi.fn().mockResolvedValue(undefined),
    getServerCapabilities: vi.fn().mockReturnValue(capabilities),
    onRequest: vi.fn().mockReturnValue({ dispose: vi.fn() })
  };
  const pool = {
    getBackend: vi.fn().mockReturnValue(backend),
    getLanguageIdForExtension: vi.fn().mockReturnValue('typescript'),
    ensureBackend: vi.fn().mockResolvedValue(backend),
    recordRequest
  };
  const transport = new FakeTransport();
  new ProxySession({
    sessionId: 's1',
    transport: transport as never,
    pool: pool as never,
    docState: { onSessionEnd: vi.fn(), onDidOpen: vi.fn(), onDidClose: vi.fn() } as never,
    root: '/proj',
    onEnd: vi.fn(),
    onStatus: () => STATUS
  });
  return { transport, recordRequest, backend, pool };
}

describe('ProxySession', () => {
  it('reflects the resolved backend capabilities in the initialize response', async () => {
    const { transport } = makeSession({ hoverProvider: true, definitionProvider: true });
    transport.simulate({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        processId: null,
        rootUri: null,
        capabilities: {},
        initializationOptions: { languageId: 'typescript' }
      }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));
    expect(transport.sent[0]).toMatchObject({
      id: 1,
      result: { capabilities: { hoverProvider: true, definitionProvider: true } }
    });
  });

  it('answers $/lsproxy.status from onStatus without touching a backend', async () => {
    const { transport, backend } = makeSession();
    transport.simulate({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { processId: null, rootUri: null, capabilities: {}, initializationOptions: { languageId: 'typescript' } }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));

    transport.simulate({ jsonrpc: '2.0', id: 2, method: '$/lsproxy.status', params: {} });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(2));
    expect(transport.sent[1]).toMatchObject({ id: 2, result: STATUS });
    expect(backend.sendRequest).not.toHaveBeenCalled();
  });

  it('forwards a non-special-cased request and records it against the resolved language', async () => {
    const { transport, backend, recordRequest } = makeSession();
    transport.simulate({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { processId: null, rootUri: null, capabilities: {}, initializationOptions: { languageId: 'typescript' } }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));

    transport.simulate({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/hover',
      params: { textDocument: { uri: 'file:///x.ts' }, position: { line: 0, character: 0 } }
    });
    await vi.waitFor(() => expect(backend.sendRequest).toHaveBeenCalledWith('textDocument/hover', expect.anything()));
    expect(recordRequest).toHaveBeenCalledWith('typescript');
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm vitest run apps/proxy/src/proxy-session.test.ts`
Expected: FAIL — `./proxy-session.js` does not exist.

- [ ] **Step 4: Implement `ProxySession`**

Create `apps/proxy/src/proxy-session.ts`:

```ts
// apps/proxy/src/proxy-session.ts
import { extname } from 'node:path';
import { LSPServer } from '@lspeasy/server';
import type { InitializeParams, ServerCapabilities, Transport } from '@lspeasy/core';
import type { LSPClient } from '@lspeasy/client';
import type { BackendPool } from './backend-pool.js';
import type { DocumentStateManager } from './document-state.js';
import type { StatusReport } from './status.js';
import { registerPassThrough } from './pass-through.js';

export interface ProxySessionOptions {
  sessionId: string;
  transport: Transport;
  pool: BackendPool;
  docState: DocumentStateManager;
  root: string;
  onEnd: (sessionId: string) => void;
  onStatus: () => StatusReport;
}

export class ProxySession {
  private readonly id: string;
  private readonly pool: BackendPool;
  private readonly onEnd: (sessionId: string) => void;
  private readonly server: LSPServer;
  private languageId = 'plaintext';

  constructor(opts: ProxySessionOptions) {
    this.id = opts.sessionId;
    this.pool = opts.pool;
    this.onEnd = opts.onEnd;

    this.server = new LSPServer({
      name: 'lsproxy',
      version: '0.1.0',
      resolveCapabilities: (params) => this.resolveCapabilities(params)
    });

    this.server.onRequest('$/lsproxy.status', async () => opts.onStatus());

    registerPassThrough(this.server, (params) => this.resolveBackend(params));

    opts.transport.onClose(() => this.handleClose());

    void this.server.listen(opts.transport);
  }

  private async resolveCapabilities(params: InitializeParams): Promise<ServerCapabilities> {
    const initOpts = params.initializationOptions as Record<string, unknown> | undefined;
    this.languageId = (initOpts?.['languageId'] as string | undefined) ?? 'plaintext';
    const backend = await this.pool.ensureBackend(this.languageId);
    return backend.getServerCapabilities() ?? {};
  }

  private resolveBackend(params: unknown): LSPClient {
    const p = params as Record<string, unknown> | undefined;
    const td = p?.['textDocument'] as Record<string, unknown> | undefined;
    const uri = td?.['uri'] as string | undefined;
    const langId = uri ? (this.languageIdForUri(uri) ?? this.languageId) : this.languageId;
    const backend = this.pool.getBackend(langId) ?? this.pool.getBackend(this.languageId);
    if (!backend) throw new Error(`No backend available for languageId "${langId}"`);
    this.pool.recordRequest(uri ? langId : this.languageId);
    return backend;
  }

  private languageIdForUri(uri: string): string | undefined {
    try {
      const ext = extname(new URL(uri).pathname);
      return this.pool.getLanguageIdForExtension(ext) ?? this.languageId;
    } catch {
      return this.languageId;
    }
  }

  private handleClose(): void {
    this.onEnd(this.id);
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm vitest run apps/proxy/src/proxy-session.test.ts`
Expected: PASS.

Note: `recordRequest` is called with `langId` when a URI resolves the backend, and with `this.languageId` (the session's primary/initialize-time language) otherwise — matching today's `ClientSession.resolveBackend`'s `byUri ? langId : this.languageId` behavior (`client-session.ts:190`). The third test above passes a `textDocument.uri`, so it asserts `recordRequest` was called with `'typescript'` (the URI-resolved value, which the fake `getLanguageIdForExtension` always returns).

- [ ] **Step 6: Run the full proxy test suite and type-check**

Run: `pnpm vitest run apps/proxy && pnpm --filter @lsproxy/proxy type-check`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add apps/proxy/package.json apps/proxy/tsconfig.json apps/proxy/src/proxy-session.ts apps/proxy/src/proxy-session.test.ts pnpm-lock.yaml
git commit -m "feat(proxy): add ProxySession, an LSPServer-based session (alongside ClientSession)"
```

---

### Task 4: `ProxySession` — doc-state notifications and `workspace/applyEdit` forwarding

**Files:**
- Modify: `apps/proxy/src/proxy-session.ts`
- Modify: `apps/proxy/src/proxy-session.test.ts`

**Interfaces:**
- Consumes: `DocumentStateManager.onDidOpen(sessionId, uri, content, languageId): DidOpenAction`, `.onDidClose(sessionId, uri): void`, `.onSessionEnd(sessionId): string[]` (all from `apps/proxy/src/document-state.ts`, unchanged). `LSPServer.sendRequest(method, params): Promise<Result>` (built-in, for `workspace/applyEdit`).
- Produces: `ProxySession` now overrides `textDocument/didOpen` and `textDocument/didClose` (registered after `registerPassThrough`, so they take precedence over the pass-through registration for those two methods — `HandlerRegistry.register` overwrites by method key), and registers an `onRequest('workspace/applyEdit', ...)` handler on each session's resolved backend that forwards to the connected client via `this.server.sendRequest(...)`.

- [ ] **Step 1: Write the failing test**

Add to `apps/proxy/src/proxy-session.test.ts`:

```ts
  it('opens a document via doc-state and forwards didOpen to the backend on first open', async () => {
    const recordRequest = vi.fn();
    const backend = {
      sendRequest: vi.fn().mockResolvedValue(null),
      sendNotification: vi.fn().mockResolvedValue(undefined),
      getServerCapabilities: vi.fn().mockReturnValue({}),
      onRequest: vi.fn().mockReturnValue({ dispose: vi.fn() })
    };
    const pool = {
      getBackend: vi.fn().mockReturnValue(backend),
      getLanguageIdForExtension: vi.fn().mockReturnValue('typescript'),
      ensureBackend: vi.fn().mockResolvedValue(backend),
      recordRequest
    };
    const docState = { onSessionEnd: vi.fn(), onDidOpen: vi.fn().mockReturnValue('open'), onDidClose: vi.fn() };
    const transport = new FakeTransport();
    new ProxySession({
      sessionId: 's1',
      transport: transport as never,
      pool: pool as never,
      docState: docState as never,
      root: '/proj',
      onEnd: vi.fn(),
      onStatus: () => STATUS
    });

    transport.simulate({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { processId: null, rootUri: null, capabilities: {}, initializationOptions: { languageId: 'typescript' } }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));

    transport.simulate({
      jsonrpc: '2.0',
      method: 'textDocument/didOpen',
      params: { textDocument: { uri: 'file:///x.ts', languageId: 'typescript', version: 1, text: 'x' } }
    });

    await vi.waitFor(() =>
      expect(backend.sendNotification).toHaveBeenCalledWith(
        'textDocument/didOpen',
        expect.objectContaining({ textDocument: expect.objectContaining({ uri: 'file:///x.ts' }) })
      )
    );
    expect(docState.onDidOpen).toHaveBeenCalledWith('s1', 'file:///x.ts', 'x', 'typescript');
  });

  it('forwards a backend-initiated workspace/applyEdit to the connected client', async () => {
    let applyEditHandler: ((p: unknown) => Promise<unknown>) | undefined;
    const backend = {
      sendRequest: vi.fn().mockResolvedValue(null),
      sendNotification: vi.fn().mockResolvedValue(undefined),
      getServerCapabilities: vi.fn().mockReturnValue({}),
      onRequest: vi.fn((method: string, handler: (p: unknown) => Promise<unknown>) => {
        if (method === 'workspace/applyEdit') applyEditHandler = handler;
        return { dispose: vi.fn() };
      })
    };
    const pool = {
      getBackend: vi.fn().mockReturnValue(backend),
      getLanguageIdForExtension: vi.fn().mockReturnValue('typescript'),
      ensureBackend: vi.fn().mockResolvedValue(backend),
      recordRequest: vi.fn()
    };
    const transport = new FakeTransport();
    new ProxySession({
      sessionId: 's1',
      transport: transport as never,
      pool: pool as never,
      docState: { onSessionEnd: vi.fn(), onDidOpen: vi.fn(), onDidClose: vi.fn() } as never,
      root: '/proj',
      onEnd: vi.fn(),
      onStatus: () => STATUS
    });

    transport.simulate({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { processId: null, rootUri: null, capabilities: {}, initializationOptions: { languageId: 'typescript' } }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));
    expect(applyEditHandler).toBeDefined();

    const resultPromise = applyEditHandler!({ edit: { changes: {} } });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(2));
    expect(transport.sent[1]).toMatchObject({ method: 'workspace/applyEdit' });

    const requestId = (transport.sent[1] as { id: number | string }).id;
    transport.simulate({ jsonrpc: '2.0', id: requestId, result: { applied: true } });
    await expect(resultPromise).resolves.toEqual({ applied: true });
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run apps/proxy/src/proxy-session.test.ts`
Expected: FAIL — `textDocument/didOpen` currently falls through to the generic pass-through (calls `sendRequest` semantics don't match; `onDidOpen`/doc-state are never invoked), and no `workspace/applyEdit` handler is ever registered on the backend.

- [ ] **Step 3: Add doc-state and applyEdit handling**

In `apps/proxy/src/proxy-session.ts`, update the imports and constructor, and add the new private methods:

```ts
import { extname } from 'node:path';
import { LSPServer } from '@lspeasy/server';
import type { InitializeParams, ServerCapabilities, Transport } from '@lspeasy/core';
import type { LSPClient } from '@lspeasy/client';
import type { BackendPool } from './backend-pool.js';
import type { DocumentStateManager } from './document-state.js';
import type { StatusReport } from './status.js';
import { registerPassThrough } from './pass-through.js';

export interface ProxySessionOptions {
  sessionId: string;
  transport: Transport;
  pool: BackendPool;
  docState: DocumentStateManager;
  root: string;
  onEnd: (sessionId: string) => void;
  onStatus: () => StatusReport;
}

export class ProxySession {
  private readonly id: string;
  private readonly pool: BackendPool;
  private readonly docState: DocumentStateManager;
  private readonly onEnd: (sessionId: string) => void;
  private readonly server: LSPServer;
  private languageId = 'plaintext';
  private applyEditDisposable: { dispose(): void } | undefined;

  constructor(opts: ProxySessionOptions) {
    this.id = opts.sessionId;
    this.pool = opts.pool;
    this.docState = opts.docState;
    this.onEnd = opts.onEnd;

    this.server = new LSPServer({
      name: 'lsproxy',
      version: '0.1.0',
      resolveCapabilities: (params) => this.resolveCapabilities(params)
    });

    this.server.onRequest('$/lsproxy.status', async () => opts.onStatus());

    registerPassThrough(this.server, (params) => this.resolveBackend(params));

    // Override the generic pass-through for the two methods doc-state needs
    // to see (must-not-forward-verbatim: open/change detection and lazy
    // backend spin-up happen here, same as today's ClientSession).
    this.server.onNotification('textDocument/didOpen', (params) => this.handleDidOpen(params));
    this.server.onNotification('textDocument/didClose', (params) => this.handleDidClose(params));

    opts.transport.onClose(() => this.handleClose());

    void this.server.listen(opts.transport);
  }

  private async resolveCapabilities(params: InitializeParams): Promise<ServerCapabilities> {
    const initOpts = params.initializationOptions as Record<string, unknown> | undefined;
    this.languageId = (initOpts?.['languageId'] as string | undefined) ?? 'plaintext';
    const backend = await this.pool.ensureBackend(this.languageId);

    // Forward workspace/applyEdit from this backend to this session's client.
    // The registration overwrites any prior session's handler for the same
    // (shared, pooled) backend — acceptable because applyEdit only fires
    // during executeCommand, which is driven by an active session.
    this.applyEditDisposable?.dispose();
    this.applyEditDisposable = (
      backend.onRequest as (m: string, h: (p: unknown) => Promise<unknown>) => { dispose(): void }
    )('workspace/applyEdit', (p) => this.server.sendRequest('workspace/applyEdit', p as never));

    return backend.getServerCapabilities() ?? {};
  }

  private async handleDidOpen(params: unknown): Promise<void> {
    const p = params as Record<string, unknown>;
    const td = p['textDocument'] as Record<string, unknown>;
    const uri = td['uri'] as string;
    const content = td['text'] as string;
    const langId = td['languageId'] as string;
    const action = this.docState.onDidOpen(this.id, uri, content, langId);

    const backend = await this.pool.ensureBackend(langId || this.languageIdForUri(uri) || this.languageId);

    if (action === 'open') {
      await (backend.sendNotification as (m: string, p: unknown) => Promise<void>)('textDocument/didOpen', p);
    } else if (action === 'change') {
      await (backend.sendNotification as (m: string, p: unknown) => Promise<void>)('textDocument/didChange', {
        textDocument: { uri, version: (td['version'] as number) + 1 },
        contentChanges: [{ text: content }]
      });
    }
    // 'skip' -> no-op
  }

  private handleDidClose(params: unknown): void {
    const p = params as Record<string, unknown>;
    const td = p['textDocument'] as Record<string, unknown>;
    const uri = td['uri'] as string;
    this.docState.onDidClose(this.id, uri);
  }

  private resolveBackend(params: unknown): LSPClient {
    const p = params as Record<string, unknown> | undefined;
    const td = p?.['textDocument'] as Record<string, unknown> | undefined;
    const uri = td?.['uri'] as string | undefined;
    const langId = uri ? (this.languageIdForUri(uri) ?? this.languageId) : this.languageId;
    const backend = this.pool.getBackend(langId) ?? this.pool.getBackend(this.languageId);
    if (!backend) throw new Error(`No backend available for languageId "${langId}"`);
    this.pool.recordRequest(uri ? langId : this.languageId);
    return backend;
  }

  private languageIdForUri(uri: string): string | undefined {
    try {
      const ext = extname(new URL(uri).pathname);
      return this.pool.getLanguageIdForExtension(ext) ?? this.languageId;
    } catch {
      return this.languageId;
    }
  }

  private handleClose(): void {
    this.applyEditDisposable?.dispose();
    this.applyEditDisposable = undefined;
    this.docState.onSessionEnd(this.id);
    this.onEnd(this.id);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run apps/proxy/src/proxy-session.test.ts`
Expected: PASS, all tests including Task 3's.

- [ ] **Step 5: Run the full proxy test suite and type-check**

Run: `pnpm vitest run apps/proxy && pnpm --filter @lsproxy/proxy type-check`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add apps/proxy/src/proxy-session.ts apps/proxy/src/proxy-session.test.ts
git commit -m "feat(proxy): ProxySession doc-state notifications and workspace/applyEdit forwarding"
```

---

### Task 5: Cut over `ProxyServer` to `ProxySession`, remove `ClientSession`

**Amendment (discovered during implementation):** `$/lsproxy.status` must be answerable *before* the `initialize` handshake — `lsproxy status`/`lsproxy start` (`apps/cli/src/connect.ts`'s `fetchDaemonStatus`) send it as the very first message on the socket, with no handshake, to cheaply query/wait for the daemon without paying for a full LSP session bring-up. The old hand-rolled `ClientSession` special-cased this unconditionally. `LSPServer`'s built-in dispatch loop rejects any non-`initialize`/`shutdown` request sent before `state === ServerState.Initialized` with `serverNotInitialized()` (`packages/server/src/server.ts:675-681`) — this silently broke `ProxySession`'s `$/lsproxy.status` handler, caught by `apps/cli/src/connect.test.ts`'s `fetchDaemonStatus` test. Fix: extend `@lspeasy/server` with a small, configurable allowlist (same pattern as Task 1's `resolveCapabilities` — extend the SDK rather than route around it in `apps/proxy`), then use it in `ProxySession`.

**Files:**
- Modify: `packages/server/src/types.ts` (add `ServerOptions.preInitializeMethods`)
- Modify: `packages/server/src/server.ts:675` (honor it in the pre-Initialized gate)
- Modify: `packages/server/test/integration/initialize.test.ts` (test the new option)
- Modify: `apps/proxy/src/proxy-session.ts` (pass `preInitializeMethods: ['$/lsproxy.status']`)
- Modify: `apps/proxy/src/proxy-session.test.ts` (test status works pre-initialize)
- Modify: `apps/proxy/src/proxy-server.ts:9,76-84`
- Delete: `apps/proxy/src/client-session.ts`
- Delete: `apps/proxy/src/client-session.test.ts`

**Interfaces:**
- Produces: `ServerOptions<Capabilities>.preInitializeMethods?: string[]` — request method names that bypass the `serverNotInitialized` gate, in addition to the hardcoded `initialize`/`shutdown`.
- Consumes: `ProxySession` from Task 4 (same constructor shape as today's `ClientSession`, confirmed by Task 3/4's tests).

- [ ] **Step 1: Write the failing test for `preInitializeMethods`**

Add to `packages/server/test/integration/initialize.test.ts`, inside the existing `describe('Initialize Handshake Integration', ...)` block:

```ts
  it('allows a method in preInitializeMethods to be answered before initialize', async () => {
    const preInitServer = new LSPServer({
      logLevel: LogLevel.Error,
      preInitializeMethods: ['$/ping']
    });
    preInitServer.onRequest('$/ping', async () => 'pong');
    const preInitTransport = new TestTransport();
    await preInitServer.listen(preInitTransport);

    preInitTransport.simulateMessage({ jsonrpc: '2.0', id: 1, method: '$/ping', params: {} });
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(preInitTransport.sentMessages[0]).toMatchObject({ id: 1, result: 'pong' });

    await preInitServer.close();
  });

  it('still rejects a method NOT in preInitializeMethods before initialize', async () => {
    const preInitServer = new LSPServer({
      logLevel: LogLevel.Error,
      preInitializeMethods: ['$/ping']
    });
    const preInitTransport = new TestTransport();
    await preInitServer.listen(preInitTransport);

    preInitTransport.simulateMessage({
      jsonrpc: '2.0',
      id: 1,
      method: 'textDocument/hover',
      params: { textDocument: { uri: 'file:///test.txt' }, position: { line: 0, character: 0 } }
    });
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(preInitTransport.sentMessages[0]).toMatchObject({ id: 1, error: { code: -32002 } });

    await preInitServer.close();
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run packages/server/test/integration/initialize.test.ts`
Expected: FAIL — `preInitializeMethods` does not exist on `ServerOptions` (type error), or the first new test fails because `$/ping` still gets rejected.

- [ ] **Step 3: Add the option and honor it in the gate**

In `packages/server/src/types.ts`, add to `ServerOptions<Capabilities>`, near `resolveCapabilities`:

```ts
  /**
   * Request methods allowed to be answered before the `initialize` handshake
   * completes, in addition to `initialize`/`shutdown` themselves.
   *
   * @remarks
   * Use for cheap, non-LSP meta-endpoints (health checks, status queries)
   * that a caller may need to reach without paying for a full session
   * bring-up. Methods here must still be registered via `onRequest` as usual
   * — this only exempts them from the `serverNotInitialized` gate.
   */
  preInitializeMethods?: string[];
```

In `packages/server/src/server.ts`, update the gate in `handleMessage` (around line 670-680):

```ts
      if (isRequestMessage(message)) {
        const method = message.method;
        const isLifecycleMethod =
          ['initialize', 'shutdown'].includes(method) ||
          (this.options.preInitializeMethods?.includes(method) ?? false);

        if (!isLifecycleMethod && this.state !== ServerState.Initialized) {
          await this.transport!.send({
            jsonrpc: '2.0',
            id: message.id,
            error: ResponseError.serverNotInitialized().toJSON()
          });
          return;
        }
      }
```

(Only the `isLifecycleMethod` line changes — everything else in this block is unchanged.)

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run packages/server/test/integration/initialize.test.ts`
Expected: PASS, all tests including the two new ones.

- [ ] **Step 5: Run the full server package test suite and type-check**

Run: `pnpm vitest run packages/server && pnpm --filter @lspeasy/server type-check`
Expected: all pass.

- [ ] **Step 6: Wire it into `ProxySession`**

In `apps/proxy/src/proxy-session.ts`, in the `LSPServer` construction inside the constructor, add the option:

```ts
    this.server = new LSPServer({
      name: 'lsproxy',
      version: '0.1.0',
      preInitializeMethods: ['$/lsproxy.status'],
      resolveCapabilities: (params) => this.resolveCapabilities(params)
    });
```

- [ ] **Step 7: Write the failing test for pre-initialize status**

Add to `apps/proxy/src/proxy-session.test.ts`:

```ts
  it('answers $/lsproxy.status even before initialize', async () => {
    const { transport } = makeSession();
    transport.simulate({ jsonrpc: '2.0', id: 1, method: '$/lsproxy.status', params: {} });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));
    expect(transport.sent[0]).toMatchObject({ id: 1, result: STATUS });
  });
```

- [ ] **Step 8: Run test to verify it fails, then passes**

Run: `pnpm vitest run apps/proxy/src/proxy-session.test.ts`
Expected: FAILs before Step 6/7's changes are combined (status request gets a `serverNotInitialized` error instead of `STATUS`), PASSes after.

- [ ] **Step 9: Run the full proxy test suite and type-check**

Run: `pnpm vitest run apps/proxy && pnpm --filter @lsproxy/proxy type-check`
Expected: all pass.

- [ ] **Step 10: Commit the SDK fix and ProxySession wiring**

```bash
git add packages/server/src/types.ts packages/server/src/server.ts packages/server/test/integration/initialize.test.ts apps/proxy/src/proxy-session.ts apps/proxy/src/proxy-session.test.ts
git commit -m "feat(server): add preInitializeMethods for pre-handshake meta-endpoints"
```

- [ ] **Step 11: Switch the import and construction site**

In `apps/proxy/src/proxy-server.ts`, change the import (line 9):

```ts
import { ProxySession } from './proxy-session.js';
```

And in `start()`'s connection handler (around line 71-87), change:

```ts
      const session = new ClientSession({
```

to:

```ts
      const session = new ProxySession({
```

(No other changes in this file — the constructor options object passed is identical, and `this.sessions: Map<string, ClientSession>` should be updated to `Map<string, ProxySession>` at its declaration, line 28.)

- [ ] **Step 12: Delete the old implementation**

```bash
git rm apps/proxy/src/client-session.ts apps/proxy/src/client-session.test.ts
```

- [ ] **Step 13: Run the full proxy test suite, type-check, and e2e**

Run: `pnpm vitest run apps/proxy && pnpm --filter @lsproxy/proxy type-check && pnpm --filter @lsproxy/proxy build`
Expected: all pass, build succeeds.

Run: `pnpm test && pnpm run test:e2e` (root `test` = unit/integration suite across `packages/**`+`apps/**`; `test:e2e` separately runs `vitest run e2e`, per the root `package.json` scripts — `e2e/` is not included in the default `test` run)
Expected: all pass — this is the regression gate for the whole migration. If any e2e scenario fails, diagnose against `ProxySession` before proceeding to Phase 2 (per the Global Constraint: migration must be fully verified before polyfill work begins).

- [ ] **Step 14: Commit**

```bash
git add apps/proxy/src/proxy-server.ts
git commit -m "feat(proxy): cut over to ProxySession, remove legacy ClientSession"
```

---

### Task 5b: Fix the `e2e/` test-runner discovery gap

**Discovered during Task 5:** `pnpm run test:e2e` (`vitest run e2e`) reports "No test files found." Root cause, confirmed pre-existing (predates this feature — traced to a commit from before this plan existed) and unrelated to the `ProxySession` migration: `vitest.config.ts`'s `include` glob only covers `packages/**` and `apps/**`, never `e2e/**`; and `e2e/` has no `package.json`, so it isn't a pnpm workspace member — `pnpm-workspace.yaml`'s globs (`packages/*`, `packages/*/*`, `apps/*`) don't cover it either. Some `e2e/*.spec.ts` files import packages (`ws`) that aren't hoisted to the root `node_modules`, so even if vitest discovered these files, some imports would fail to resolve.

This blocks Task 9 (which adds a new `e2e/*.spec.ts` file and needs `pnpm run test:e2e` to actually run it), so it's fixed now rather than deferred.

**Scope boundary:** this task fixes the *wiring* (files get discovered, imports resolve) — it does not guarantee every pre-existing `e2e/*.spec.ts` file's assertions pass. If, once runnable, some pre-existing specs fail for reasons unrelated to wiring (e.g. a real behavioral regression, or specs that were already stale/wrong before this feature), treat that the same way as any other unexpected test failure during this plan: investigate whether it's a genuine regression from this plan's work (unlikely, since nothing in Phase 1 touches what these specs exercise) or a separate pre-existing issue, and report back rather than attempting to fix unrelated pre-existing test failures — that's out of scope for this task.

**Files:**
- Modify: `pnpm-workspace.yaml` (add `e2e` to the `packages` list)
- Create: `e2e/package.json`
- Modify: `vitest.config.ts` (extend `include`)

**Interfaces:**
- None — this is infrastructure/config only, no new exported code.

- [ ] **Step 1: Add `e2e` as a workspace member**

In `pnpm-workspace.yaml`, add `e2e` to the `packages` list:

```yaml
packages:
  - 'packages/*'
  - 'packages/*/*'
  - 'apps/*'
  - 'e2e'
allowBuilds:
  esbuild: true
  simple-git-hooks: true
```

- [ ] **Step 2: Give `e2e/` its own `package.json`**

Create `e2e/package.json`:

```json
{
  "name": "e2e",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "devDependencies": {
    "@lspeasy/client": "workspace:*",
    "@lspeasy/core": "workspace:*",
    "@lspeasy/server": "workspace:*",
    "typescript": "^6.0.3",
    "vitest": "^4.1.8",
    "ws": "^8.20.1"
  }
}
```

- [ ] **Step 3: Extend `vitest.config.ts`'s include glob**

In `vitest.config.ts`, update `test.include`:

```ts
    include: [
      'packages/**/test/**/*.test.ts',
      'packages/**/src/**/*.test.ts',
      'apps/**/src/**/*.test.ts',
      'e2e/**/*.spec.ts'
    ],
```

(Only this one array changes — everything else in the file stays the same.)

- [ ] **Step 4: Install and verify discovery**

Run: `pnpm install`
Expected: `e2e` appears as a linked workspace member; no errors.

Run: `pnpm run test:e2e`
Expected: test files are now discovered and run (no longer "No test files found"). Report back the actual pass/fail counts — do not assume all pre-existing specs pass. If any fail, apply the scope boundary above: check whether the failure is plausibly caused by anything in Phase 1 (it should not be, since nothing there touches transports/middleware/notebook-sync/etc. that these specs exercise) — if it's clearly unrelated and pre-existing, note it and continue; if there's any doubt, stop and report back with the failure details before proceeding.

- [ ] **Step 5: Run the root suite once more for a full sanity check**

Run: `pnpm test && pnpm run test:e2e`
Expected: both commands now run to completion (pass/fail counts reported, not a runner-discovery error).

- [ ] **Step 6: Commit the wiring fix**

```bash
git add pnpm-workspace.yaml e2e/package.json vitest.config.ts pnpm-lock.yaml
git commit -m "fix(e2e): wire e2e/ into the pnpm workspace and vitest's test discovery"
```

**Amendment:** wiring the e2e runner surfaced 27 pre-existing test failures, confirmed unrelated to this plan (zero changes to `e2e/` exist between `develop` and this branch) and traced to two root causes that predate this feature: (1) `e2e/transport-utils.ts` imports `StdioTransport` from `@lspeasy/core` instead of the `@lspeasy/core/node` subpath where it's actually exported; (2) five spec files call `server.setCapabilities(...)`, renamed to `registerCapabilities` before this branch existed. Fix both now so `test:e2e` is fully green before Phase 2.

- [ ] **Step 7: Fix the `StdioTransport` import**

In `e2e/transport-utils.ts`, find the import of `StdioTransport` from `@lspeasy/core` and change it to import from `@lspeasy/core/node` instead (matching how every other e2e spec that uses `StdioTransport` already imports it — check `e2e/lsp-compliance.spec.ts` or similar for the correct pattern). Leave every other import in the file untouched.

- [ ] **Step 8: Rename `setCapabilities` to `registerCapabilities`**

In each of `e2e/connection-health.spec.ts`, `e2e/partial-results.spec.ts`, `e2e/lsp-compliance.spec.ts`, `e2e/workspace-folders.spec.ts`, `e2e/middleware-integration.spec.ts`: replace every call of the form `server.setCapabilities(...)` with `server.registerCapabilities(...)` — same arguments, only the method name changes. Do not change anything else in these files. (Exact call sites and argument shapes vary per file — read each one, this is a straightforward rename, not a behavior change.)

- [ ] **Step 9: Run the e2e suite**

Run: `pnpm run test:e2e`
Expected: 13/14 spec files pass. `e2e/websocket-native.spec.ts` is a known, separate, in-flight issue (a WebSocket connection-timing bug, unrelated to either root cause fixed here — being diagnosed and fixed independently, in a separate worktree, not gating this task). If any file OTHER than `websocket-native.spec.ts` still fails, stop and report it — do not attempt further fixes without checking in.

- [ ] **Step 10: Run the full workspace suite one more time**

Run: `pnpm test && pnpm run test:e2e`
Expected: `pnpm test` fully green; `pnpm run test:e2e` shows only `websocket-native.spec.ts` failing (known, tracked separately).

- [ ] **Step 11: Commit the spec fixes**

```bash
git add e2e/transport-utils.ts e2e/connection-health.spec.ts e2e/partial-results.spec.ts e2e/lsp-compliance.spec.ts e2e/workspace-folders.spec.ts e2e/middleware-integration.spec.ts
git commit -m "fix(e2e): repair pre-existing StdioTransport import path and setCapabilities rename"
```

**Note:** `e2e/websocket-native.spec.ts`'s connection-timing failure is being fixed independently in a separate worktree/branch, unrelated to this feature. Task 5b is considered complete once Steps 1-11 above land, regardless of that fix's status — it isn't part of this plan.

---

## Phase 2: CodeAction Polyfills

*(Do not begin until every Phase 1 task above — through Task 5b — is committed and Task 5b Step 10's full-suite run is green.)*

### Task 6: `@lsproxy/polyfill` package — `CodeActionPolyfill` type, `resolve-backfill`, registry

**Files:**
- Create: `apps/polyfill/package.json`
- Create: `apps/polyfill/tsconfig.json`
- Create: `apps/polyfill/src/index.ts`
- Create: `apps/polyfill/src/types.ts`
- Create: `apps/polyfill/src/resolve-backfill.ts`
- Create: `apps/polyfill/src/resolve-backfill.test.ts`
- Create: `apps/polyfill/src/registry.ts`
- Create: `apps/polyfill/src/registry.test.ts`
- Modify: `apps/proxy/package.json` (add `@lsproxy/polyfill` dependency)
- Modify: `apps/proxy/tsconfig.json` (add `apps/polyfill` project reference)

**Interfaces:**
- Produces: `interface CodeActionPolyfill { id: string; appliesTo(capabilities: ServerCapabilities): boolean; patchCapabilities?(capabilities: ServerCapabilities): ServerCapabilities; augmentCodeActions?(actions: CodeAction[], params: CodeActionParams, backend: LSPClient): Promise<CodeAction[]>; resolveCodeAction?(action: CodeAction, backend: LSPClient): Promise<CodeAction>; }`, `const resolveBackfill: CodeActionPolyfill`, `const BUILTIN_POLYFILLS: readonly CodeActionPolyfill[]`, `function applicablePolyfills(capabilities: ServerCapabilities): CodeActionPolyfill[]`. Task 7 adds `fixAll` to `BUILTIN_POLYFILLS`; Task 8 consumes `applicablePolyfills` and the `CodeActionPolyfill` interface from `ProxySession`.

- [ ] **Step 1: Scaffold the package**

Create `apps/polyfill/package.json` (modeled on `apps/proxy/package.json`, no `bin`):

```json
{
  "name": "@lsproxy/polyfill",
  "version": "0.1.0",
  "description": "CodeAction capability polyfills for lsproxy backends that don't natively support them",
  "private": false,
  "keywords": ["lsp", "language-server-protocol", "lsp-proxy", "code-action"],
  "homepage": "https://github.com/pradeepmouli/lspeasy#readme",
  "bugs": { "url": "https://github.com/pradeepmouli/lspeasy/issues" },
  "license": "MIT",
  "author": "Pradeep Mouli <pmouli@mac.com> (https://github.com/pradeepmouli)",
  "repository": {
    "type": "git",
    "url": "https://github.com/pradeepmouli/lspeasy.git",
    "directory": "apps/polyfill"
  },
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "README.md"],
  "publishConfig": { "access": "public" },
  "scripts": {
    "build": "tsgo --build",
    "clean": "rm -rf dist tsconfig.tsbuildinfo",
    "type-check": "tsgo --noEmit"
  },
  "dependencies": {
    "@lspeasy/client": "workspace:*",
    "@lspeasy/core": "workspace:*"
  },
  "devDependencies": {
    "typescript": "^6.0.3"
  },
  "engines": {
    "node": ">=22.0.0"
  }
}
```

Create `apps/polyfill/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declarationMap": true
  },
  "references": [{ "path": "../../packages/core" }, { "path": "../../packages/client" }],
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules", "**/*.test.ts", "**/*.spec.ts"]
}
```

Run: `pnpm install`
Expected: workspace picks up the new package (matches the existing `apps/*` glob), no errors.

- [ ] **Step 2: Write the `CodeActionPolyfill` type (no test — a type-only file)**

Create `apps/polyfill/src/types.ts`:

```ts
// apps/polyfill/src/types.ts
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

- [ ] **Step 3: Write the failing test for resolve-backfill**

Create `apps/polyfill/src/resolve-backfill.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import type { ServerCapabilities, CodeAction } from '@lspeasy/core';
import { resolveBackfill } from './resolve-backfill.js';

describe('resolveBackfill.appliesTo', () => {
  it('applies when codeActionProvider is true (boolean form, no resolve)', () => {
    expect(resolveBackfill.appliesTo({ codeActionProvider: true })).toBe(true);
  });

  it('applies when codeActionProvider is an object without resolveProvider', () => {
    expect(resolveBackfill.appliesTo({ codeActionProvider: { codeActionKinds: ['quickfix'] } })).toBe(true);
  });

  it('does not apply when resolveProvider is already true', () => {
    expect(resolveBackfill.appliesTo({ codeActionProvider: { resolveProvider: true } })).toBe(false);
  });

  it('does not apply when codeActionProvider is absent', () => {
    expect(resolveBackfill.appliesTo({})).toBe(false);
  });
});

describe('resolveBackfill.patchCapabilities', () => {
  it('normalizes boolean codeActionProvider to object form with resolveProvider: true', () => {
    const patched = resolveBackfill.patchCapabilities!({ codeActionProvider: true });
    expect(patched.codeActionProvider).toEqual({ resolveProvider: true });
  });

  it('adds resolveProvider: true to an existing object form', () => {
    const patched = resolveBackfill.patchCapabilities!({
      codeActionProvider: { codeActionKinds: ['quickfix'] }
    });
    expect(patched.codeActionProvider).toEqual({ codeActionKinds: ['quickfix'], resolveProvider: true });
  });
});

describe('resolveBackfill.resolveCodeAction', () => {
  it('returns the input action unchanged', async () => {
    const action: CodeAction = {
      title: 'Fix it',
      kind: 'quickfix',
      edit: { changes: { 'file:///x.ts': [{ range: { start: { line: 0, character: 0 }, end: { line: 0, character: 1 } }, newText: 'y' }] } }
    };
    const resolved = await resolveBackfill.resolveCodeAction!(action, {} as never);
    expect(resolved).toBe(action);
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `pnpm vitest run apps/polyfill/src/resolve-backfill.test.ts`
Expected: FAIL — `./resolve-backfill.js` does not exist.

- [ ] **Step 5: Implement resolve-backfill**

Create `apps/polyfill/src/resolve-backfill.ts`:

```ts
// apps/polyfill/src/resolve-backfill.ts
import type { ServerCapabilities } from '@lspeasy/core';
import type { CodeActionPolyfill } from './types.js';

function hasNativeResolve(capabilities: ServerCapabilities): boolean {
  const provider = capabilities.codeActionProvider;
  if (!provider) return false;
  return typeof provider === 'object' && provider.resolveProvider === true;
}

export const resolveBackfill: CodeActionPolyfill = {
  id: 'resolve-backfill',

  appliesTo(capabilities) {
    return Boolean(capabilities.codeActionProvider) && !hasNativeResolve(capabilities);
  },

  patchCapabilities(capabilities) {
    const provider = capabilities.codeActionProvider;
    const base = typeof provider === 'object' ? provider : {};
    return { ...capabilities, codeActionProvider: { ...base, resolveProvider: true } };
  },

  async resolveCodeAction(action) {
    // Per the LSP spec, a server without resolveProvider must return fully
    // resolved actions from textDocument/codeAction already — echo unchanged.
    return action;
  }
};
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm vitest run apps/polyfill/src/resolve-backfill.test.ts`
Expected: PASS.

- [ ] **Step 7: Write the failing test for the registry**

Create `apps/polyfill/src/registry.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { applicablePolyfills } from './registry.js';
import { resolveBackfill } from './resolve-backfill.js';

describe('applicablePolyfills', () => {
  it('includes resolve-backfill when the backend lacks native resolve', () => {
    const applicable = applicablePolyfills({ codeActionProvider: true });
    expect(applicable.map((p) => p.id)).toContain(resolveBackfill.id);
  });

  it('excludes resolve-backfill when the backend already supports resolve', () => {
    const applicable = applicablePolyfills({ codeActionProvider: { resolveProvider: true } });
    expect(applicable.map((p) => p.id)).not.toContain(resolveBackfill.id);
  });

  it('returns an empty list when no polyfill applies', () => {
    expect(applicablePolyfills({})).toEqual([]);
  });
});
```

- [ ] **Step 8: Run test to verify it fails**

Run: `pnpm vitest run apps/polyfill/src/registry.test.ts`
Expected: FAIL — `./registry.js` does not exist.

- [ ] **Step 9: Implement the registry**

Create `apps/polyfill/src/registry.ts`:

```ts
// apps/polyfill/src/registry.ts
import type { ServerCapabilities } from '@lspeasy/core';
import type { CodeActionPolyfill } from './types.js';
import { resolveBackfill } from './resolve-backfill.js';

export const BUILTIN_POLYFILLS: readonly CodeActionPolyfill[] = [resolveBackfill];

export function applicablePolyfills(capabilities: ServerCapabilities): CodeActionPolyfill[] {
  return BUILTIN_POLYFILLS.filter((p) => p.appliesTo(capabilities));
}
```

- [ ] **Step 10: Run test to verify it passes**

Run: `pnpm vitest run apps/polyfill/src/registry.test.ts`
Expected: PASS.

- [ ] **Step 11: Add the package's barrel export**

Create `apps/polyfill/src/index.ts`:

```ts
export type { CodeActionPolyfill } from './types.js';
export { resolveBackfill } from './resolve-backfill.js';
export { BUILTIN_POLYFILLS, applicablePolyfills } from './registry.js';
```

- [ ] **Step 12: Wire `apps/proxy` to depend on the new package**

In `apps/proxy/package.json`, the `dependencies` block (last edited in Task 3 Step 1) becomes:

```json
  "dependencies": {
    "@lspeasy/client": "workspace:*",
    "@lspeasy/core": "workspace:*",
    "@lspeasy/server": "workspace:*",
    "@lsproxy/polyfill": "workspace:*"
  },
```

In `apps/proxy/tsconfig.json`, the `references` array (last edited in Task 3 Step 1) becomes:

```json
  "references": [
    { "path": "../../packages/core" },
    { "path": "../../packages/client" },
    { "path": "../../packages/server" },
    { "path": "../polyfill" }
  ],
```

Run: `pnpm install`

- [ ] **Step 13: Run the full polyfill package test suite, type-check, and build**

Run: `pnpm vitest run apps/polyfill && pnpm --filter @lsproxy/polyfill type-check && pnpm --filter @lsproxy/polyfill build`
Expected: all pass.

- [ ] **Step 14: Commit**

```bash
git add apps/polyfill apps/proxy/package.json apps/proxy/tsconfig.json pnpm-lock.yaml
git commit -m "feat(polyfill): add @lsproxy/polyfill package with CodeActionPolyfill and resolve-backfill"
```

---

### Task 7: `fix-all` polyfill

**Files:**
- Create: `apps/polyfill/src/fix-all.ts`
- Create: `apps/polyfill/src/fix-all.test.ts`
- Modify: `apps/polyfill/src/registry.ts`
- Modify: `apps/polyfill/src/registry.test.ts`
- Modify: `apps/polyfill/src/index.ts`

**Interfaces:**
- Consumes: `CodeActionPolyfill` (Task 6). `LSPClient.sendRequest` (already exported, used to call `textDocument/diagnostic` and per-diagnostic `textDocument/codeAction`).
- Produces: `const fixAll: CodeActionPolyfill`, added to `BUILTIN_POLYFILLS`.

- [ ] **Step 1: Write the failing test**

Create `apps/polyfill/src/fix-all.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import type { ServerCapabilities, CodeActionParams, CodeAction, Diagnostic } from '@lspeasy/core';
import { fixAll } from './fix-all.js';

describe('fixAll.appliesTo', () => {
  it('applies when codeAction + diagnosticProvider are present and source.fixAll is not advertised', () => {
    const caps: ServerCapabilities = {
      codeActionProvider: { codeActionKinds: ['quickfix'] },
      diagnosticProvider: { interFileDependencies: false, workspaceDiagnostics: false }
    };
    expect(fixAll.appliesTo(caps)).toBe(true);
  });

  it('does not apply without diagnosticProvider', () => {
    expect(fixAll.appliesTo({ codeActionProvider: true })).toBe(false);
  });

  it('does not apply when source.fixAll is already advertised', () => {
    const caps: ServerCapabilities = {
      codeActionProvider: { codeActionKinds: ['quickfix', 'source.fixAll'] },
      diagnosticProvider: { interFileDependencies: false, workspaceDiagnostics: false }
    };
    expect(fixAll.appliesTo(caps)).toBe(false);
  });
});

describe('fixAll.augmentCodeActions', () => {
  const diagnostic1: Diagnostic = {
    range: { start: { line: 0, character: 0 }, end: { line: 0, character: 3 } },
    message: 'unused var'
  };
  const diagnostic2: Diagnostic = {
    range: { start: { line: 1, character: 0 }, end: { line: 1, character: 3 } },
    message: 'missing semi'
  };

  function makeBackend(fixesByLine: Record<number, CodeAction[]>) {
    return {
      sendRequest: vi.fn(async (method: string, params: unknown) => {
        if (method === 'textDocument/diagnostic') {
          return { kind: 'full', items: [diagnostic1, diagnostic2] };
        }
        if (method === 'textDocument/codeAction') {
          const p = params as { range: { start: { line: number } } };
          return fixesByLine[p.range.start.line] ?? [];
        }
        throw new Error(`unexpected method ${method}`);
      })
    };
  }

  const params: CodeActionParams = {
    textDocument: { uri: 'file:///x.ts' },
    range: { start: { line: 0, character: 0 }, end: { line: 2, character: 0 } },
    context: { diagnostics: [], only: ['source.fixAll'] }
  };

  it('does nothing when context.only does not request source.fixAll', async () => {
    const backend = makeBackend({});
    const result = await fixAll.augmentCodeActions!(
      [],
      { ...params, context: { diagnostics: [] } },
      backend as never
    );
    expect(result).toEqual([]);
    expect(backend.sendRequest).not.toHaveBeenCalled();
  });

  it('merges one quick-fix per diagnostic into a single composite action', async () => {
    const backend = makeBackend({
      0: [
        {
          title: 'Remove unused var',
          kind: 'quickfix',
          edit: {
            changes: {
              'file:///x.ts': [
                { range: { start: { line: 0, character: 0 }, end: { line: 0, character: 3 } }, newText: '' }
              ]
            }
          }
        }
      ],
      1: [
        {
          title: 'Add semicolon',
          kind: 'quickfix',
          edit: {
            changes: {
              'file:///x.ts': [
                { range: { start: { line: 1, character: 3 }, end: { line: 1, character: 3 } }, newText: ';' }
              ]
            }
          }
        }
      ]
    });

    const result = await fixAll.augmentCodeActions!([], params, backend as never);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ kind: 'source.fixAll' });
    expect(result[0]!.edit!.changes!['file:///x.ts']).toHaveLength(2);
  });

  it('skips diagnostics with no available quick-fix and returns real actions unchanged if none merge', async () => {
    const backend = makeBackend({});
    const realAction: CodeAction = { title: 'Real action', kind: 'quickfix' };
    const result = await fixAll.augmentCodeActions!([realAction], params, backend as never);
    expect(result).toEqual([realAction]);
  });

  it('drops the later edit when two collected fixes overlap on the same URI', async () => {
    const overlappingRange = { start: { line: 0, character: 0 }, end: { line: 0, character: 5 } };
    const backend = makeBackend({
      0: [
        {
          title: 'Fix A',
          kind: 'quickfix',
          edit: { changes: { 'file:///x.ts': [{ range: overlappingRange, newText: 'a' }] } }
        }
      ],
      1: [
        {
          title: 'Fix B',
          kind: 'quickfix',
          edit: { changes: { 'file:///x.ts': [{ range: overlappingRange, newText: 'b' }] } }
        }
      ]
    });

    const result = await fixAll.augmentCodeActions!([], params, backend as never);
    expect(result[0]!.edit!.changes!['file:///x.ts']).toHaveLength(1);
    expect(result[0]!.edit!.changes!['file:///x.ts']![0]).toMatchObject({ newText: 'a' });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run apps/polyfill/src/fix-all.test.ts`
Expected: FAIL — `./fix-all.js` does not exist.

- [ ] **Step 3: Implement fix-all**

Create `apps/polyfill/src/fix-all.ts`:

```ts
// apps/polyfill/src/fix-all.ts
import type { CodeAction, CodeActionParams, Diagnostic, ServerCapabilities, TextEdit } from '@lspeasy/core';
import type { LSPClient } from '@lspeasy/client';
import type { CodeActionPolyfill } from './types.js';

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

function pickFix(actions: CodeAction[]): CodeAction | undefined {
  return actions.find((a) => a.isPreferred) ?? actions[0];
}

function rangesOverlap(a: TextEdit['range'], b: TextEdit['range']): boolean {
  const aStart = a.start.line * 100000 + a.start.character;
  const aEnd = a.end.line * 100000 + a.end.character;
  const bStart = b.start.line * 100000 + b.start.character;
  const bEnd = b.end.line * 100000 + b.end.character;
  return aStart < bEnd && bStart < aEnd;
}

function mergeEdits(uri: string, existing: TextEdit[], incoming: TextEdit[]): TextEdit[] {
  const merged = [...existing];
  for (const edit of incoming) {
    if (merged.some((m) => rangesOverlap(m.range, edit.range))) continue;
    merged.push(edit);
  }
  return merged;
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

    const report = (await (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(
      'textDocument/diagnostic',
      { textDocument: params.textDocument }
    )) as { kind: 'full' | 'unchanged'; items?: Diagnostic[] };
    const diagnostics = report.kind === 'full' ? (report.items ?? []) : [];

    const changes: Record<string, TextEdit[]> = {};
    let mergedCount = 0;

    for (const diagnostic of diagnostics) {
      const candidates = (await (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(
        'textDocument/codeAction',
        {
          textDocument: params.textDocument,
          range: diagnostic.range,
          context: { diagnostics: [diagnostic], only: ['quickfix'] }
        }
      )) as CodeAction[] | null;

      const fix = candidates ? pickFix(candidates) : undefined;
      if (!fix?.edit?.changes) continue;

      for (const [uri, edits] of Object.entries(fix.edit.changes)) {
        changes[uri] = mergeEdits(uri, changes[uri] ?? [], edits);
      }
      mergedCount += 1;
    }

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

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run apps/polyfill/src/fix-all.test.ts`
Expected: PASS.

- [ ] **Step 5: Add `fixAll` to the registry**

In `apps/polyfill/src/registry.ts`:

```ts
import type { ServerCapabilities } from '@lspeasy/core';
import type { CodeActionPolyfill } from './types.js';
import { resolveBackfill } from './resolve-backfill.js';
import { fixAll } from './fix-all.js';

export const BUILTIN_POLYFILLS: readonly CodeActionPolyfill[] = [resolveBackfill, fixAll];

export function applicablePolyfills(capabilities: ServerCapabilities): CodeActionPolyfill[] {
  return BUILTIN_POLYFILLS.filter((p) => p.appliesTo(capabilities));
}
```

In `apps/polyfill/src/registry.test.ts`, add:

```ts
  it('includes fix-all when the backend has pull diagnostics but not source.fixAll', () => {
    const applicable = applicablePolyfills({
      codeActionProvider: true,
      diagnosticProvider: { interFileDependencies: false, workspaceDiagnostics: false }
    });
    expect(applicable.map((p) => p.id)).toContain('fix-all');
  });
```

(Import `fixAll` is not needed in the test file — the assertion checks `p.id === 'fix-all'` as a string.)

In `apps/polyfill/src/index.ts`, add:

```ts
export { fixAll } from './fix-all.js';
```

- [ ] **Step 6: Run the full polyfill test suite, type-check, and build**

Run: `pnpm vitest run apps/polyfill && pnpm --filter @lsproxy/polyfill type-check && pnpm --filter @lsproxy/polyfill build`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add apps/polyfill/src/fix-all.ts apps/polyfill/src/fix-all.test.ts apps/polyfill/src/registry.ts apps/polyfill/src/registry.test.ts apps/polyfill/src/index.ts
git commit -m "feat(polyfill): add fix-all composite codeAction polyfill"
```

---

### Task 8: Wire polyfills into `ProxySession`

**Files:**
- Modify: `apps/proxy/src/proxy-session.ts`
- Modify: `apps/proxy/src/proxy-session.test.ts`

**Interfaces:**
- Consumes: `applicablePolyfills` from `@lsproxy/polyfill` (Tasks 6, 7).

- [ ] **Step 1: Write the failing test**

Add to `apps/proxy/src/proxy-session.test.ts`:

```ts
  it('patches advertised capabilities for an applicable polyfill (resolve-backfill)', async () => {
    const { transport } = makeSession({ codeActionProvider: true });
    transport.simulate({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { processId: null, rootUri: null, capabilities: {}, initializationOptions: { languageId: 'typescript' } }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));
    expect(transport.sent[0]).toMatchObject({
      result: { capabilities: { codeActionProvider: { resolveProvider: true } } }
    });
  });

  it('answers codeAction/resolve locally when the backend lacks native resolve', async () => {
    const { transport, backend } = makeSession({ codeActionProvider: true });
    transport.simulate({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { processId: null, rootUri: null, capabilities: {}, initializationOptions: { languageId: 'typescript' } }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));

    const action = { title: 'Fix', kind: 'quickfix', edit: { changes: {} } };
    transport.simulate({ jsonrpc: '2.0', id: 2, method: 'codeAction/resolve', params: action });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(2));
    expect(transport.sent[1]).toMatchObject({ id: 2, result: action });
    expect(backend.sendRequest).not.toHaveBeenCalledWith('codeAction/resolve', expect.anything());
  });

  it('forwards codeAction/resolve to the backend when it natively supports resolve', async () => {
    const { transport, backend } = makeSession({ codeActionProvider: { resolveProvider: true } });
    transport.simulate({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { processId: null, rootUri: null, capabilities: {}, initializationOptions: { languageId: 'typescript' } }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));

    transport.simulate({
      jsonrpc: '2.0',
      id: 2,
      method: 'codeAction/resolve',
      params: { title: 'Fix', kind: 'quickfix' }
    });
    await vi.waitFor(() =>
      expect(backend.sendRequest).toHaveBeenCalledWith('codeAction/resolve', expect.anything())
    );
  });

  it('augments textDocument/codeAction results with applicable polyfill output', async () => {
    const backend = {
      sendRequest: vi.fn(async (method: string) => {
        if (method === 'textDocument/codeAction') return [];
        if (method === 'textDocument/diagnostic') return { kind: 'full', items: [] };
        return null;
      }),
      sendNotification: vi.fn().mockResolvedValue(undefined),
      getServerCapabilities: vi.fn().mockReturnValue({ codeActionProvider: true }),
      onRequest: vi.fn().mockReturnValue({ dispose: vi.fn() })
    };
    const pool = {
      getBackend: vi.fn().mockReturnValue(backend),
      getLanguageIdForExtension: vi.fn().mockReturnValue('typescript'),
      ensureBackend: vi.fn().mockResolvedValue(backend),
      recordRequest: vi.fn()
    };
    const transport = new FakeTransport();
    new ProxySession({
      sessionId: 's1',
      transport: transport as never,
      pool: pool as never,
      docState: { onSessionEnd: vi.fn(), onDidOpen: vi.fn(), onDidClose: vi.fn() } as never,
      root: '/proj',
      onEnd: vi.fn(),
      onStatus: () => STATUS
    });

    transport.simulate({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { processId: null, rootUri: null, capabilities: {}, initializationOptions: { languageId: 'typescript' } }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(1));

    transport.simulate({
      jsonrpc: '2.0',
      id: 2,
      method: 'textDocument/codeAction',
      params: {
        textDocument: { uri: 'file:///x.ts' },
        range: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
        context: { diagnostics: [] }
      }
    });
    await vi.waitFor(() => expect(transport.sent).toHaveLength(2));
    // No diagnostics -> fix-all merges nothing -> real (empty) actions returned unchanged.
    expect(transport.sent[1]).toMatchObject({ id: 2, result: [] });
    expect(backend.sendRequest).toHaveBeenCalledWith('textDocument/codeAction', expect.anything());
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run apps/proxy/src/proxy-session.test.ts`
Expected: FAIL — capabilities aren't patched, `codeAction/resolve` and `textDocument/codeAction` still go through the plain pass-through.

- [ ] **Step 3: Wire polyfills into `ProxySession`**

In `apps/proxy/src/proxy-session.ts`:

Add the import:

```ts
import { applicablePolyfills } from '@lsproxy/polyfill';
import type { CodeAction, CodeActionParams } from '@lspeasy/core';
```

Update `resolveCapabilities` to patch capabilities:

```ts
  private async resolveCapabilities(params: InitializeParams): Promise<ServerCapabilities> {
    const initOpts = params.initializationOptions as Record<string, unknown> | undefined;
    this.languageId = (initOpts?.['languageId'] as string | undefined) ?? 'plaintext';
    const backend = await this.pool.ensureBackend(this.languageId);

    this.applyEditDisposable?.dispose();
    this.applyEditDisposable = (
      backend.onRequest as (m: string, h: (p: unknown) => Promise<unknown>) => { dispose(): void }
    )('workspace/applyEdit', (p) => this.server.sendRequest('workspace/applyEdit', p as never));

    const raw = backend.getServerCapabilities() ?? {};
    return applicablePolyfills(raw).reduce(
      (caps, polyfill) => polyfill.patchCapabilities?.(caps) ?? caps,
      raw
    );
  }
```

Add `textDocument/codeAction` and `codeAction/resolve` overrides in the constructor, after the `didOpen`/`didClose` overrides:

```ts
    this.server.onRequest('textDocument/codeAction', (params) => this.handleCodeAction(params as CodeActionParams));
    this.server.onRequest('codeAction/resolve', (params) => this.handleResolveCodeAction(params as CodeAction));
```

Add the two new private methods (near `resolveBackend`):

```ts
  private async handleCodeAction(params: CodeActionParams): Promise<CodeAction[]> {
    const backend = this.resolveBackend(params);
    const real = ((await (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(
      'textDocument/codeAction',
      params
    )) ?? []) as CodeAction[];

    let actions = real;
    for (const polyfill of applicablePolyfills(backend.getServerCapabilities() ?? {})) {
      if (!polyfill.augmentCodeActions) continue;
      try {
        actions = await polyfill.augmentCodeActions(actions, params, backend);
      } catch {
        // Degrade gracefully: synthesis failure must not fail the whole request.
      }
    }
    return actions;
  }

  private async handleResolveCodeAction(action: CodeAction): Promise<CodeAction> {
    const backend = this.pool.getBackend(this.languageId);
    if (!backend) throw new Error(`No backend available for languageId "${this.languageId}"`);
    const capabilities = backend.getServerCapabilities() ?? {};
    const provider = capabilities.codeActionProvider;
    const hasNativeResolve = typeof provider === 'object' && provider.resolveProvider === true;

    if (hasNativeResolve) {
      return (await (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(
        'codeAction/resolve',
        action
      )) as CodeAction;
    }

    for (const polyfill of applicablePolyfills(capabilities)) {
      if (polyfill.resolveCodeAction) return polyfill.resolveCodeAction(action, backend);
    }
    // No applicable polyfill and no native support: nothing more we can do.
    return action;
  }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run apps/proxy/src/proxy-session.test.ts`
Expected: PASS, all tests.

- [ ] **Step 5: Run the full proxy test suite and type-check**

Run: `pnpm vitest run apps/proxy && pnpm --filter @lsproxy/proxy type-check`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add apps/proxy/src/proxy-session.ts apps/proxy/src/proxy-session.test.ts
git commit -m "feat(proxy): wire CodeAction polyfills into ProxySession"
```

---

### Task 9: End-to-end test covering both polyfills

**Files:**
- Modify or create: an `e2e/` test file — inspect `e2e/` structure first (e.g. `e2e/middleware-integration.spec.ts` exists per earlier repo exploration) to match existing conventions for spinning up `ProxyServer` and a real/fixture backend; name the new file `e2e/codeaction-polyfill.spec.ts` unless an existing fixture-server file is the better home.

**Interfaces:**
- Consumes: whatever e2e harness helpers the existing `e2e/` suite already provides for starting a `ProxyServer` and connecting a client.

- [ ] **Step 1: Read the existing e2e harness**

Before writing this test, read `e2e/middleware-integration.spec.ts` (or equivalent) in full to learn: how a `ProxyServer` is started in-process for tests, how a test client connects and sends `initialize`, and whether a fixture LSP server (not a real language server) is already used elsewhere for deterministic e2e coverage. Reuse that harness rather than inventing a new one.

- [ ] **Step 2: Write the e2e test**

Using the harness discovered in Step 1, write `e2e/codeaction-polyfill.spec.ts` covering:
1. Connect to a `ProxyServer` backed by a fixture LSP server that declares `codeActionProvider: true` (no `resolveProvider`) and `diagnosticProvider`.
2. Send `initialize`; assert the response's `capabilities.codeActionProvider.resolveProvider === true`.
3. Send `textDocument/codeAction` for a document with a known fixable diagnostic, with `context.only: ['source.fixAll']`; assert a `source.fixAll` action is present with a non-empty `edit`.
4. Send `codeAction/resolve` for an already-resolved action; assert it's echoed back unchanged.

(Concrete fixture-server setup depends on what Step 1 finds — write the exact test body against that harness once read; do not guess its API here.)

- [ ] **Step 3: Run the e2e suite**

Run: `pnpm run test:e2e` (root `package.json` script: `vitest run e2e`; `e2e/` has no own `package.json` — it's a flat spec directory run by this root script, not a workspace package, so no `pnpm --filter` form exists for it)
Expected: PASS.

- [ ] **Step 4: Run the full workspace test suite**

Run: `pnpm test && pnpm run test:e2e`
Expected: all pass — final regression gate for the whole feature.

- [ ] **Step 5: Commit**

```bash
git add e2e/codeaction-polyfill.spec.ts
git commit -m "test(e2e): cover codeAction/resolve backfill and fix-all polyfill end-to-end"
```

---

## Self-Review Notes

- **Spec coverage:** Task 1 covers spec §4 (`resolveCapabilities`). Tasks 2-5 cover spec §6 (`ClientSession` migration) plus the confirmed parallel-implementation/`ProxySession` naming decisions. Tasks 6-7 cover spec §5 (`@lsproxy/polyfill`, both polyfills). Task 8 covers the remaining wiring in spec §6. Task 9 covers spec §8's end-to-end requirement. Spec §7 (error handling: degrade-gracefully on synthesis failure, skip unfixable diagnostics) is implemented in Task 8's `handleCodeAction` try/catch and Task 7's `pickFix`/`mergeEdits` skip logic. Spec §9 (follow-ups) is intentionally not covered by any task — out of scope, as stated.
- **Type consistency:** `CodeActionPolyfill`, `applicablePolyfills`, `BUILTIN_POLYFILLS`, `ProxySession`, `BackendResolver`, `registerPassThrough` are used with the same names and signatures everywhere they're referenced across tasks.
- **Placeholder scan:** no TBD/TODO remain, except Task 9 Step 2's explicit instruction to write the exact test body only after reading the real e2e harness — this is a deliberate "read first, then write concretely" step, not an unresolved placeholder in the deliverable itself, since the harness's API is unknown at plan-writing time and guessing it would produce incorrect code.
