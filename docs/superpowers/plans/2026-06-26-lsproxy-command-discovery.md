# lsproxy Command Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `lsproxy` self-describing — bare invocation lists configured languages with live health/stats, and `lsproxy --help <lang> <ns> <req>` drills down through capability-filtered namespaces to parameter schemas.

**Architecture:** A new `$/lsproxy.status` control request in the proxy daemon reports daemon + per-backend health/stats; the CLI overlays it on `lsp.json` config (new `discoverServers()` core enumerator) for the top-level view. Drill-down levels connect with `indexWaitMs: 0` and delegate to the existing `buildCommandTree` + Commander help. `--json` emits a stable, ANSI-free contract at every level.

**Tech Stack:** TypeScript 5 (strict, no `any` in production code), Node ≥20, Commander, Zod, Vitest, pnpm workspaces.

## Global Constraints

- TypeScript strict mode; **no `any`** in production code (test files may use `as any`, matching existing tests).
- All diagnostics go to **stderr**; stdout stays machine-parseable (critical for `--json`).
- `--json` output contains **zero ANSI escape bytes** at every help level.
- Conventional-commit messages; commit after each task.
- Reuse existing patterns: Vitest with `vi.mock`, module-private helpers in `discover.ts`, Commander command tree from `buildCommandTree`.
- Run a single test file with: `pnpm exec vitest run <path>` from the repo root.
- Run type-check with: `pnpm run type-check`.

---

## File Structure

| File | Responsibility |
|---|---|
| `packages/core/src/discover.ts` *(modify)* | Add `discoverServers()` + `ConfiguredServer` type |
| `packages/core/src/discover.test.ts` *(create)* | Tests for `discoverServers()` |
| `packages/core/src/index.ts` *(modify)* | Re-export `discoverServers`, `ConfiguredServer` |
| `apps/proxy/src/status.ts` *(create)* | `StatusReport`/`LanguageStatus`/`BackendRuntime` types + pure `buildStatusReport()` / `coldStatusReport()` |
| `apps/proxy/src/status.test.ts` *(create)* | Tests for the pure status builders |
| `apps/proxy/src/backend-pool.ts` *(modify)* | `startedAt`/`requestCount` per entry, `recordRequest()`, `listBackends()` |
| `apps/proxy/src/document-state.ts` *(modify)* | `countByLanguage()` |
| `apps/proxy/src/client-session.ts` *(modify)* | `$/lsproxy.status` branch, `onStatus` option, `resolveBackend()` refactor + request counting |
| `apps/proxy/src/client-session.test.ts` *(create)* | Tests for status routing + request counting |
| `apps/proxy/src/proxy-server.ts` *(modify)* | `startedAt`, `getStatus()`, wire `onStatus` into `ClientSession` |
| `apps/proxy/src/proxy-server.test.ts` *(create)* | Test `getStatus()` shape |
| `apps/proxy/src/index.ts` *(modify)* | Re-export `StatusReport` (+ sibling types) |
| `apps/cli/src/format.ts` *(create)* | `Formatter`, `createFormatter()`, `SYMBOLS` |
| `apps/cli/src/format.test.ts` *(create)* | Color-on/off byte-stability tests |
| `apps/cli/src/help.ts` *(create)* | `renderTopLevel()`, `navigateTree()`, `renderDrillDownText()`, `drillDownJson()` |
| `apps/cli/src/help.test.ts` *(create)* | Renderer + navigation tests |
| `apps/cli/src/connect.ts` *(modify)* | `fetchDaemonStatus()` |
| `apps/cli/src/cli.ts` *(modify)* | Help-mode router replacing `STATIC_HELP` branch |
| `e2e/` *(add)* | bare + drill-down + `--json` against a fixture server |

---

## Task 1: `discoverServers()` core enumerator

**Files:**
- Modify: `packages/core/src/discover.ts`
- Modify: `packages/core/src/index.ts:300-308`
- Test: `packages/core/src/discover.test.ts` *(create)*

**Interfaces:**
- Consumes: module-private `loadConfig(root)` and `buildServerCommand(entry)` (already in `discover.ts`).
- Produces:
  ```ts
  export interface ConfiguredServer {
    name: string;                          // lsp.json server key, e.g. "typescript"
    command: string;                       // full spawn command string
    fileExtensions: Record<string, string>; // ext (".ts") -> languageId ("typescript")
  }
  export function discoverServers(root: string): ConfiguredServer[];
  ```

- [ ] **Step 1: Write the failing test**

Create `packages/core/src/discover.test.ts`:
```ts
import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { discoverServers } from './discover.js';

const tmpRoots: string[] = [];
function rootWithConfig(config: unknown): string {
  const dir = mkdtempSync(join(tmpdir(), 'lspeasy-disc-'));
  tmpRoots.push(dir);
  writeFileSync(join(dir, 'lsp.json'), JSON.stringify(config), 'utf8');
  return dir;
}

afterEach(() => {
  while (tmpRoots.length) rmSync(tmpRoots.pop()!, { recursive: true, force: true });
});

describe('discoverServers', () => {
  it('returns every configured server with name, command, and fileExtensions', () => {
    const root = rootWithConfig({
      lspServers: {
        typescript: {
          command: 'typescript-language-server',
          args: ['--stdio'],
          fileExtensions: { '.ts': 'typescript', '.tsx': 'typescriptreact' }
        },
        rust: { command: 'rust-analyzer', fileExtensions: { '.rs': 'rust' } }
      }
    });
    const servers = discoverServers(root);
    expect(servers).toHaveLength(2);
    const ts = servers.find((s) => s.name === 'typescript')!;
    expect(ts.command).toBe('"typescript-language-server" "--stdio"');
    expect(ts.fileExtensions).toEqual({ '.ts': 'typescript', '.tsx': 'typescriptreact' });
    expect(servers.find((s) => s.name === 'rust')!.command).toBe('"rust-analyzer"');
  });

  it('returns an empty array when no lsp.json is found', () => {
    const dir = mkdtempSync(join(tmpdir(), 'lspeasy-empty-'));
    tmpRoots.push(dir);
    expect(discoverServers(dir)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run packages/core/src/discover.test.ts`
Expected: FAIL — `discoverServers is not a function` / not exported.

- [ ] **Step 3: Implement `discoverServers`**

Append to `packages/core/src/discover.ts` (after `discoverExtensionMap`):
```ts
export interface ConfiguredServer {
  /** lsp.json server key, e.g. "typescript". */
  name: string;
  /** Full spawn command string (same quoting as ResolvedServer.serverCommand). */
  command: string;
  /** File extension (".ts") to languageId ("typescript") map for this server. */
  fileExtensions: Record<string, string>;
}

/**
 * Enumerate every server configured in the discovered lsp.json. Unlike
 * {@link discoverServer}, which resolves a single server, this returns the full
 * set so callers can present available languages without connecting.
 */
export function discoverServers(root: string): ConfiguredServer[] {
  const config = loadConfig(root);
  if (!config) return [];
  return Object.entries(config.lspServers).map(([name, entry]) => ({
    name,
    command: buildServerCommand(entry),
    fileExtensions: { ...entry.fileExtensions }
  }));
}
```

- [ ] **Step 4: Re-export from the package entry**

In `packages/core/src/index.ts`, extend the discovery block (lines 300-308):
```ts
export type { LspServerEntry, LspJson, ResolvedServer, ConfiguredServer } from './discover.js';
export {
  selectServer,
  selectServerByLanguageId,
  selectExtensionMap,
  discoverServer,
  discoverServerByLanguageId,
  discoverExtensionMap,
  discoverServers
} from './discover.js';
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm exec vitest run packages/core/src/discover.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/discover.ts packages/core/src/discover.test.ts packages/core/src/index.ts
git commit -m "feat(core): add discoverServers() enumerator for configured LSP servers"
```

---

## Task 2: Proxy status types + pure builders

**Files:**
- Create: `apps/proxy/src/status.ts`
- Create: `apps/proxy/src/status.test.ts`
- Modify: `apps/proxy/src/index.ts`

**Interfaces:**
- Consumes: `ConfiguredServer` from `@lspeasy/core` (Task 1).
- Produces:
  ```ts
  export interface BackendRuntime {
    languageId: string; pid: number; startedAt: number; requestCount: number; healthy: boolean;
  }
  export interface LanguageStatus {
    languageId: string; name: string; extensions: string[]; command: string;
    status: 'running' | 'cold';
    healthy?: boolean; pid?: number; uptimeMs?: number; openDocuments?: number; requestsServed?: number;
  }
  export interface DaemonStatus { pid: number; uptimeMs: number; root: string; sessions: number; backends: number; }
  export interface StatusReport { daemon: DaemonStatus | null; languages: LanguageStatus[]; }
  export interface BuildStatusInput {
    now: number; daemonPid: number; daemonStartedAt: number; root: string; sessions: number;
    configured: ConfiguredServer[]; backends: BackendRuntime[]; openDocsByLanguage: Record<string, number>;
  }
  export function buildStatusReport(input: BuildStatusInput): StatusReport;
  export function coldStatusReport(configured: ConfiguredServer[]): StatusReport;
  ```

- [ ] **Step 1: Write the failing test**

Create `apps/proxy/src/status.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import type { ConfiguredServer } from '@lspeasy/core';
import { buildStatusReport, coldStatusReport } from './status.js';

const tsServer: ConfiguredServer = {
  name: 'typescript',
  command: '"typescript-language-server" "--stdio"',
  fileExtensions: { '.ts': 'typescript', '.tsx': 'typescript' }
};
const rustServer: ConfiguredServer = {
  name: 'rust',
  command: '"rust-analyzer"',
  fileExtensions: { '.rs': 'rust' }
};

describe('buildStatusReport', () => {
  it('marks languages with a live backend as running with stats, others cold', () => {
    const report = buildStatusReport({
      now: 10_000,
      daemonPid: 100,
      daemonStartedAt: 1_000,
      root: '/proj',
      sessions: 2,
      configured: [tsServer, rustServer],
      backends: [
        { languageId: 'typescript', pid: 200, startedAt: 4_000, requestCount: 7, healthy: true }
      ],
      openDocsByLanguage: { typescript: 3 }
    });

    expect(report.daemon).toEqual({ pid: 100, uptimeMs: 9_000, root: '/proj', sessions: 2, backends: 1 });

    const ts = report.languages.find((l) => l.languageId === 'typescript')!;
    expect(ts).toMatchObject({
      languageId: 'typescript', name: 'typescript', status: 'running',
      healthy: true, pid: 200, uptimeMs: 6_000, openDocuments: 3, requestsServed: 7
    });
    expect(ts.extensions.sort()).toEqual(['.ts', '.tsx']);

    const rust = report.languages.find((l) => l.languageId === 'rust')!;
    expect(rust.status).toBe('cold');
    expect(rust.pid).toBeUndefined();
  });
});

describe('coldStatusReport', () => {
  it('reports null daemon and every language cold', () => {
    const report = coldStatusReport([tsServer, rustServer]);
    expect(report.daemon).toBeNull();
    expect(report.languages.map((l) => l.status)).toEqual(['typescript', 'rust'].map(() => 'cold'));
    expect(report.languages.map((l) => l.languageId).sort()).toEqual(['rust', 'typescript']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/proxy/src/status.test.ts`
Expected: FAIL — cannot find module `./status.js`.

- [ ] **Step 3: Implement `status.ts`**

Create `apps/proxy/src/status.ts`:
```ts
import type { ConfiguredServer } from '@lspeasy/core';

export interface BackendRuntime {
  languageId: string;
  pid: number;
  startedAt: number;
  requestCount: number;
  healthy: boolean;
}

export interface LanguageStatus {
  languageId: string;
  name: string;
  extensions: string[];
  command: string;
  status: 'running' | 'cold';
  healthy?: boolean;
  pid?: number;
  uptimeMs?: number;
  openDocuments?: number;
  requestsServed?: number;
}

export interface DaemonStatus {
  pid: number;
  uptimeMs: number;
  root: string;
  sessions: number;
  backends: number;
}

export interface StatusReport {
  daemon: DaemonStatus | null;
  languages: LanguageStatus[];
}

export interface BuildStatusInput {
  now: number;
  daemonPid: number;
  daemonStartedAt: number;
  root: string;
  sessions: number;
  configured: ConfiguredServer[];
  backends: BackendRuntime[];
  openDocsByLanguage: Record<string, number>;
}

/** Group a server's extensions by the languageId they map to. */
function extensionsByLanguage(server: ConfiguredServer): Map<string, string[]> {
  const byLang = new Map<string, string[]>();
  for (const [ext, languageId] of Object.entries(server.fileExtensions)) {
    const list = byLang.get(languageId) ?? [];
    list.push(ext);
    byLang.set(languageId, list);
  }
  return byLang;
}

function coldLanguages(configured: ConfiguredServer[]): LanguageStatus[] {
  const out: LanguageStatus[] = [];
  for (const server of configured) {
    for (const [languageId, extensions] of extensionsByLanguage(server)) {
      out.push({ languageId, name: server.name, extensions, command: server.command, status: 'cold' });
    }
  }
  return out;
}

export function buildStatusReport(input: BuildStatusInput): StatusReport {
  const byLang = new Map(input.backends.map((b) => [b.languageId, b]));
  const languages: LanguageStatus[] = [];
  for (const server of input.configured) {
    for (const [languageId, extensions] of extensionsByLanguage(server)) {
      const rt = byLang.get(languageId);
      if (rt) {
        languages.push({
          languageId,
          name: server.name,
          extensions,
          command: server.command,
          status: 'running',
          healthy: rt.healthy,
          pid: rt.pid,
          uptimeMs: input.now - rt.startedAt,
          openDocuments: input.openDocsByLanguage[languageId] ?? 0,
          requestsServed: rt.requestCount
        });
      } else {
        languages.push({ languageId, name: server.name, extensions, command: server.command, status: 'cold' });
      }
    }
  }
  return {
    daemon: {
      pid: input.daemonPid,
      uptimeMs: input.now - input.daemonStartedAt,
      root: input.root,
      sessions: input.sessions,
      backends: input.backends.length
    },
    languages
  };
}

/** Status view when the daemon is unreachable: null daemon, all languages cold. */
export function coldStatusReport(configured: ConfiguredServer[]): StatusReport {
  return { daemon: null, languages: coldLanguages(configured) };
}
```

- [ ] **Step 4: Re-export the public types**

In `apps/proxy/src/index.ts`, add:
```ts
export type {
  StatusReport,
  DaemonStatus,
  LanguageStatus,
  BackendRuntime
} from './status.js';
export { buildStatusReport, coldStatusReport } from './status.js';
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm exec vitest run apps/proxy/src/status.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add apps/proxy/src/status.ts apps/proxy/src/status.test.ts apps/proxy/src/index.ts
git commit -m "feat(proxy): add StatusReport types and pure status builders"
```

---

## Task 3: BackendPool stats — `startedAt`, `requestCount`, `recordRequest()`, `listBackends()`

**Files:**
- Modify: `apps/proxy/src/backend-pool.ts`
- Test: `apps/proxy/src/backend-pool.test.ts:27-34` (extend spawn mock) and add cases

**Interfaces:**
- Consumes: `BackendRuntime` from `./status.js` (Task 2).
- Produces:
  ```ts
  recordRequest(languageId: string): void;   // increments the backend's request counter
  listBackends(): BackendRuntime[];           // one entry per live backend
  ```

- [ ] **Step 1: Write the failing test**

In `apps/proxy/src/backend-pool.test.ts`, first extend the `node:child_process` mock (lines 27-34) so spawned procs expose `pid`/`exitCode`:
```ts
vi.mock('node:child_process', () => ({
  spawn: vi.fn().mockReturnValue({
    pid: 4242,
    exitCode: null,
    stdout: { on: vi.fn() },
    stdin: { on: vi.fn() },
    on: vi.fn(),
    kill: vi.fn()
  })
}));
```
Then add these cases inside `describe('BackendPool', ...)`:
```ts
it('listBackends reports a live backend with pid, healthy, and zero requests', async () => {
  const pool = new BackendPool('/project');
  await pool.ensureBackend('typescript');
  const list = pool.listBackends();
  expect(list).toHaveLength(1);
  expect(list[0]).toMatchObject({
    languageId: 'typescript', pid: 4242, requestCount: 0, healthy: true
  });
  expect(typeof list[0]!.startedAt).toBe('number');
});

it('recordRequest increments the per-backend counter', async () => {
  const pool = new BackendPool('/project');
  await pool.ensureBackend('typescript');
  pool.recordRequest('typescript');
  pool.recordRequest('typescript');
  expect(pool.listBackends()[0]!.requestCount).toBe(2);
});

it('recordRequest is a no-op for an unknown languageId', () => {
  const pool = new BackendPool('/project');
  expect(() => pool.recordRequest('python')).not.toThrow();
  expect(pool.listBackends()).toEqual([]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/proxy/src/backend-pool.test.ts`
Expected: FAIL — `pool.listBackends is not a function`.

- [ ] **Step 3: Implement the pool changes**

In `apps/proxy/src/backend-pool.ts`:

Add the import at the top:
```ts
import type { BackendRuntime } from './status.js';
```

Extend `BackendEntry` (lines 44-48):
```ts
interface BackendEntry {
  client: LSPClient;
  proc: ReturnType<typeof spawn>;
  idleTimer?: ReturnType<typeof setTimeout>;
  startedAt: number;
  requestCount: number;
}
```

In `startBackend`, set the new fields when constructing the entry (line 119):
```ts
const entry: BackendEntry = { client, proc, startedAt: Date.now(), requestCount: 0 };
```

Add two public methods (e.g. after `getBackend`, near line 70):
```ts
/** Increment the forwarded-request counter for a live backend; no-op if cold. */
recordRequest(languageId: string): void {
  const entry = this.backends.get(languageId);
  if (entry) entry.requestCount += 1;
}

/** Runtime snapshot of every live backend, for status reporting. */
listBackends(): BackendRuntime[] {
  return [...this.backends.entries()].map(([languageId, entry]) => ({
    languageId,
    pid: entry.proc.pid ?? -1,
    startedAt: entry.startedAt,
    requestCount: entry.requestCount,
    healthy: entry.proc.exitCode === null
  }));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run apps/proxy/src/backend-pool.test.ts`
Expected: PASS (existing + 3 new cases).

- [ ] **Step 5: Commit**

```bash
git add apps/proxy/src/backend-pool.ts apps/proxy/src/backend-pool.test.ts
git commit -m "feat(proxy): track backend startedAt/requestCount and expose listBackends()"
```

---

## Task 4: `DocumentStateManager.countByLanguage()`

**Files:**
- Modify: `apps/proxy/src/document-state.ts`
- Test: `apps/proxy/src/document-state.test.ts`

**Interfaces:**
- Produces: `countByLanguage(): Record<string, number>` — open-document count keyed by languageId.

- [ ] **Step 1: Write the failing test**

Add to `apps/proxy/src/document-state.test.ts` (inside the existing top-level `describe`):
```ts
it('countByLanguage tallies open documents per languageId', () => {
  const mgr = new DocumentStateManager();
  mgr.onDidOpen('s1', 'file:///a.ts', 'a', 'typescript');
  mgr.onDidOpen('s1', 'file:///b.ts', 'b', 'typescript');
  mgr.onDidOpen('s1', 'file:///c.rs', 'c', 'rust');
  expect(mgr.countByLanguage()).toEqual({ typescript: 2, rust: 1 });
});
```
> If `document-state.test.ts` imports `DocumentStateManager` differently, match the file's existing import style.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/proxy/src/document-state.test.ts`
Expected: FAIL — `mgr.countByLanguage is not a function`.

- [ ] **Step 3: Implement `countByLanguage`**

Add to `DocumentStateManager` in `apps/proxy/src/document-state.ts` (e.g. after `getContent`, line 84):
```ts
/** Count currently-tracked open documents, grouped by languageId. */
countByLanguage(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const entry of this.docs.values()) {
    counts[entry.languageId] = (counts[entry.languageId] ?? 0) + 1;
  }
  return counts;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run apps/proxy/src/document-state.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/proxy/src/document-state.ts apps/proxy/src/document-state.test.ts
git commit -m "feat(proxy): add DocumentStateManager.countByLanguage()"
```

---

## Task 5: ClientSession — `$/lsproxy.status` routing + request counting

**Files:**
- Modify: `apps/proxy/src/client-session.ts`
- Test: `apps/proxy/src/client-session.test.ts` *(create)*

**Interfaces:**
- Consumes: `StatusReport` (Task 2); `BackendPool.recordRequest` (Task 3).
- Produces: `ClientSessionOptions` gains `onStatus: () => StatusReport`. New private `resolveBackend(msg): { backend: LSPClient; languageId: string }` replaces `backendForMsg`.

- [ ] **Step 1: Write the failing test**

Create `apps/proxy/src/client-session.test.ts`:
```ts
import { describe, expect, it, vi } from 'vitest';
import type { Message } from '@lspeasy/core';
import { ClientSession } from './client-session.js';
import type { StatusReport } from './status.js';

interface Captured { sent: Message[]; emit: (m: Message) => void; }

function fakeTransport(): { transport: any; cap: Captured } {
  const cap: Captured = { sent: [], emit: () => {} };
  const transport = {
    send: vi.fn(async (m: Message) => { cap.sent.push(m); }),
    onMessage: (h: (m: Message) => void) => { cap.emit = h; return { dispose: vi.fn() }; },
    onClose: () => ({ dispose: vi.fn() }),
    onError: () => ({ dispose: vi.fn() })
  };
  return { transport, cap };
}

const STATUS: StatusReport = { daemon: null, languages: [] };

function makeSession(poolOverrides: Record<string, unknown> = {}) {
  const recordRequest = vi.fn();
  const backend = { sendRequest: vi.fn().mockResolvedValue({ ok: 1 }) };
  const pool = {
    getBackend: vi.fn().mockReturnValue(backend),
    getLanguageIdForExtension: vi.fn().mockReturnValue('typescript'),
    ensureBackend: vi.fn().mockResolvedValue(backend),
    recordRequest,
    ...poolOverrides
  };
  const { transport, cap } = fakeTransport();
  new ClientSession({
    sessionId: 's1',
    transport: transport as never,
    pool: pool as never,
    docState: { onSessionEnd: vi.fn() } as never,
    root: '/proj',
    onEnd: vi.fn(),
    onStatus: () => STATUS
  });
  return { cap, recordRequest, backend };
}

describe('ClientSession status routing', () => {
  it('answers $/lsproxy.status from onStatus without touching a backend', async () => {
    const { cap, backend } = makeSession();
    cap.emit({ jsonrpc: '2.0', id: 1, method: '$/lsproxy.status', params: {} } as Message);
    await vi.waitFor(() => expect(cap.sent).toHaveLength(1));
    expect(cap.sent[0]).toMatchObject({ id: 1, result: STATUS });
    expect(backend.sendRequest).not.toHaveBeenCalled();
  });

  it('records a forwarded request', async () => {
    const { cap, recordRequest } = makeSession();
    cap.emit({
      jsonrpc: '2.0', id: 2, method: 'textDocument/hover',
      params: { textDocument: { uri: 'file:///x.ts' } }
    } as Message);
    await vi.waitFor(() => expect(recordRequest).toHaveBeenCalledWith('typescript'));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/proxy/src/client-session.test.ts`
Expected: FAIL — `onStatus` not accepted / `$/lsproxy.status` falls through to `resolveBackend` and throws.

- [ ] **Step 3: Implement the ClientSession changes**

In `apps/proxy/src/client-session.ts`:

Add the import:
```ts
import type { StatusReport } from './status.js';
```

Extend `ClientSessionOptions` (lines 8-15):
```ts
export interface ClientSessionOptions {
  sessionId: string;
  transport: Transport;
  pool: BackendPool;
  docState: DocumentStateManager;
  root: string;
  onEnd: (sessionId: string) => void;
  onStatus: () => StatusReport;
}
```

Store it in the constructor (alongside the other assignments, near line 37-42):
```ts
private readonly onStatus: () => StatusReport;
// ...in constructor body:
this.onStatus = opts.onStatus;
```

In `handleRequest` (lines 94-107), add the status branch and use `resolveBackend` + `recordRequest`:
```ts
private async handleRequest(msg: RawMsg): Promise<unknown> {
  if (msg.method === 'initialize') {
    return this.handleInitialize(msg.params as Record<string, unknown>);
  }
  if (msg.method === 'shutdown') {
    return null;
  }
  if (msg.method === '$/lsproxy.status') {
    return this.onStatus();
  }
  const { backend, languageId } = this.resolveBackend(msg);
  this.pool.recordRequest(languageId);
  return (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(msg.method!, msg.params);
}
```

Replace `backendForMsg` (lines 173-182) with `resolveBackend` returning the languageId too:
```ts
private resolveBackend(msg: RawMsg): { backend: LSPClient; languageId: string } {
  const params = msg.params as Record<string, unknown> | undefined;
  const td = params?.['textDocument'] as Record<string, unknown> | undefined;
  const uri = td?.['uri'] as string | undefined;
  const langId = uri ? (this.languageIdForUri(uri) ?? this.languageId) : this.languageId;
  const byUri = this.pool.getBackend(langId);
  const backend = byUri ?? this.pool.getBackend(this.languageId);
  if (!backend) throw new Error(`No backend available for languageId "${langId}"`);
  return { backend, languageId: byUri ? langId : this.languageId };
}
```

Update the one other caller in `handleNotification` (line 166):
```ts
const { backend } = this.resolveBackend(msg);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run apps/proxy/src/client-session.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/proxy/src/client-session.ts apps/proxy/src/client-session.test.ts
git commit -m "feat(proxy): route \$/lsproxy.status and count forwarded requests"
```

---

## Task 6: ProxyServer — `startedAt`, `getStatus()`, wire `onStatus`

**Files:**
- Modify: `apps/proxy/src/proxy-server.ts`
- Test: `apps/proxy/src/proxy-server.test.ts` *(create)*

**Interfaces:**
- Consumes: `buildStatusReport` (Task 2), `discoverServers` (Task 1), `BackendPool.listBackends` (Task 3), `DocumentStateManager.countByLanguage` (Task 4), `ClientSessionOptions.onStatus` (Task 5).
- Produces: `ProxyServer.getStatus(): StatusReport` (public, for the `onStatus` closure and tests).

- [ ] **Step 1: Write the failing test**

Create `apps/proxy/src/proxy-server.test.ts`:
```ts
import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ProxyServer } from './proxy-server.js';

const roots: string[] = [];
function tmpRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'lspeasy-proxy-'));
  roots.push(dir);
  writeFileSync(
    join(dir, 'lsp.json'),
    JSON.stringify({
      lspServers: { typescript: { command: 'tsls', fileExtensions: { '.ts': 'typescript' } } }
    }),
    'utf8'
  );
  return dir;
}

afterEach(() => {
  while (roots.length) rmSync(roots.pop()!, { recursive: true, force: true });
});

describe('ProxyServer.getStatus', () => {
  it('reports daemon facts and configured languages as cold before any backend starts', () => {
    const root = tmpRoot();
    const server = new ProxyServer({ root, socketOverride: join(root, 'x.sock') });
    const status = server.getStatus();
    expect(status.daemon).toMatchObject({ pid: process.pid, root, sessions: 0, backends: 0 });
    expect(typeof status.daemon!.uptimeMs).toBe('number');
    expect(status.languages).toEqual([
      expect.objectContaining({ languageId: 'typescript', status: 'cold', command: '"tsls"' })
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/proxy/src/proxy-server.test.ts`
Expected: FAIL — `server.getStatus is not a function`.

- [ ] **Step 3: Implement the ProxyServer changes**

In `apps/proxy/src/proxy-server.ts`:

Add imports:
```ts
import { discoverServers } from '@lspeasy/core';
import { buildStatusReport, type StatusReport } from './status.js';
```

Add a field initialized to construction time (near line 29):
```ts
private readonly startedAt = Date.now();
```

Add the public method (e.g. after the constructor):
```ts
/** Assemble the current daemon + backend status snapshot. */
getStatus(): StatusReport {
  return buildStatusReport({
    now: Date.now(),
    daemonPid: process.pid,
    daemonStartedAt: this.startedAt,
    root: this.root,
    sessions: this.sessions.size,
    configured: discoverServers(this.root),
    backends: this.pool.listBackends(),
    openDocsByLanguage: this.docState.countByLanguage()
  });
}
```

In `start()`'s `createServer` callback, pass `onStatus` when constructing `ClientSession` (lines 57-64):
```ts
const session = new ClientSession({
  sessionId,
  transport,
  pool: this.pool,
  docState: this.docState,
  root: this.root,
  onEnd: (id) => this.onSessionEnd(id),
  onStatus: () => this.getStatus()
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run apps/proxy/src/proxy-server.test.ts`
Expected: PASS.

- [ ] **Step 5: Run the whole proxy package to catch regressions**

Run: `pnpm exec vitest run apps/proxy`
Expected: PASS (all proxy tests).

- [ ] **Step 6: Commit**

```bash
git add apps/proxy/src/proxy-server.ts apps/proxy/src/proxy-server.test.ts
git commit -m "feat(proxy): assemble status snapshot and serve it via onStatus"
```

---

## Task 7: CLI `format.ts` — color + symbols

**Files:**
- Create: `apps/cli/src/format.ts`
- Create: `apps/cli/src/format.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export interface Formatter { green(s: string): string; red(s: string): string; yellow(s: string): string; dim(s: string): string; }
  export function createFormatter(enabled: boolean): Formatter;
  export const SYMBOLS: { running: string; cold: string; healthy: string; unhealthy: string; degraded: string };
  ```

- [ ] **Step 1: Write the failing test**

Create `apps/cli/src/format.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { createFormatter, SYMBOLS } from './format.js';

describe('createFormatter', () => {
  it('emits ANSI codes when enabled', () => {
    const fmt = createFormatter(true);
    const green = fmt.green('ok');
    expect(green).toContain('\x1b[');
    expect(green).toContain('ok');
  });

  it('returns the raw string unchanged when disabled (no ANSI bytes)', () => {
    const fmt = createFormatter(false);
    expect(fmt.green('ok')).toBe('ok');
    expect(fmt.red('x')).toBe('x');
    expect(fmt.dim('y')).toBe('y');
    expect(fmt.green('z')).not.toContain('\x1b');
  });

  it('exposes status glyphs', () => {
    expect(SYMBOLS.running).toBe('●');
    expect(SYMBOLS.cold).toBe('○');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/format.test.ts`
Expected: FAIL — cannot find module `./format.js`.

- [ ] **Step 3: Implement `format.ts`**

Create `apps/cli/src/format.ts`:
```ts
const CODES = { green: 32, red: 31, yellow: 33, dim: 2 } as const;

export interface Formatter {
  green(s: string): string;
  red(s: string): string;
  yellow(s: string): string;
  dim(s: string): string;
}

function wrap(code: number, s: string): string {
  return `\x1b[${code}m${s}\x1b[0m`;
}

/**
 * Build a color formatter. When `enabled` is false every method returns its
 * argument unchanged, guaranteeing zero ANSI bytes (used for pipes, CI, and
 * `--json`). Callers gate `enabled` on
 * `process.stdout.isTTY && !process.env.NO_COLOR && !flags.json`.
 */
export function createFormatter(enabled: boolean): Formatter {
  if (!enabled) {
    const identity = (s: string): string => s;
    return { green: identity, red: identity, yellow: identity, dim: identity };
  }
  return {
    green: (s) => wrap(CODES.green, s),
    red: (s) => wrap(CODES.red, s),
    yellow: (s) => wrap(CODES.yellow, s),
    dim: (s) => wrap(CODES.dim, s)
  };
}

export const SYMBOLS = {
  running: '●',
  cold: '○',
  healthy: '✓',
  unhealthy: '✗',
  degraded: '⚠'
} as const;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run apps/cli/src/format.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/format.ts apps/cli/src/format.test.ts
git commit -m "feat(cli): add color/symbol formatter gated for json and non-tty"
```

---

## Task 8: CLI `help.ts` — top-level renderer

**Files:**
- Create: `apps/cli/src/help.ts`
- Create: `apps/cli/src/help.test.ts`

**Interfaces:**
- Consumes: `StatusReport`, `LanguageStatus` from `@lsproxy/proxy` (Task 2); `Formatter`, `SYMBOLS` (Task 7).
- Produces: `renderTopLevel(report: StatusReport, fmt: Formatter): string`.

- [ ] **Step 1: Write the failing test**

Create `apps/cli/src/help.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import type { StatusReport } from '@lsproxy/proxy';
import { createFormatter } from './format.js';
import { renderTopLevel } from './help.js';

const fmt = createFormatter(false);

describe('renderTopLevel', () => {
  it('lists running and cold languages with the drill-down hint and no ANSI', () => {
    const report: StatusReport = {
      daemon: { pid: 1, uptimeMs: 5000, root: '/p', sessions: 1, backends: 1 },
      languages: [
        {
          languageId: 'typescript', name: 'typescript', extensions: ['.ts', '.tsx'],
          command: '"tsls"', status: 'running', healthy: true, pid: 9, uptimeMs: 4000,
          openDocuments: 2, requestsServed: 11
        },
        { languageId: 'rust', name: 'rust', extensions: ['.rs'], command: '"ra"', status: 'cold' }
      ]
    };
    const out = renderTopLevel(report, fmt);
    expect(out).toContain('typescript');
    expect(out).toContain('.ts');
    expect(out).toContain('rust');
    expect(out).toMatch(/lsproxy --help <language>/);
    expect(out).not.toContain('\x1b');
  });

  it('shows a daemon-down header when daemon is null', () => {
    const report: StatusReport = {
      daemon: null,
      languages: [{ languageId: 'rust', name: 'rust', extensions: ['.rs'], command: '"ra"', status: 'cold' }]
    };
    expect(renderTopLevel(report, fmt)).toMatch(/daemon.*down/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/help.test.ts`
Expected: FAIL — cannot find module `./help.js`.

- [ ] **Step 3: Implement `renderTopLevel` in `help.ts`**

Create `apps/cli/src/help.ts`:
```ts
import type { LanguageStatus, StatusReport } from '@lsproxy/proxy';
import { SYMBOLS, type Formatter } from './format.js';

function languageLine(lang: LanguageStatus, fmt: Formatter): string {
  const exts = lang.extensions.join(' ');
  if (lang.status !== 'running') {
    return `  ${fmt.dim(SYMBOLS.cold)} ${lang.languageId}  ${fmt.dim(exts)}  ${fmt.dim('(cold)')}`;
  }
  const mark = lang.healthy ? fmt.green(SYMBOLS.running) : fmt.yellow(SYMBOLS.degraded);
  const health = lang.healthy ? fmt.green(SYMBOLS.healthy) : fmt.red(SYMBOLS.unhealthy);
  const stats = fmt.dim(
    `pid ${lang.pid} · up ${Math.round((lang.uptimeMs ?? 0) / 1000)}s · ` +
      `${lang.openDocuments ?? 0} docs · ${lang.requestsServed ?? 0} reqs`
  );
  return `  ${mark} ${lang.languageId}  ${fmt.dim(exts)}  ${health} ${stats}`;
}

/** Render the top-level `lsproxy` view: configured languages + live status. */
export function renderTopLevel(report: StatusReport, fmt: Formatter): string {
  const header =
    report.daemon === null
      ? fmt.dim('daemon: down — showing configured languages only')
      : fmt.dim(
          `daemon: up · pid ${report.daemon.pid} · ` +
            `${report.daemon.backends} backend(s) · ${report.daemon.sessions} session(s)`
        );
  const lines = report.languages.map((l) => languageLine(l, fmt));
  const footer = [
    '',
    'Drill down:',
    '  lsproxy --help <language>             namespaces for that server',
    '  lsproxy --help <language> <namespace> requests in that namespace',
    '  lsproxy --help <language> <namespace> <request>  parameter schema'
  ].join('\n');
  return ['lsproxy — LSP-driven CLI', '', header, '', 'Languages:', ...lines, footer, ''].join('\n');
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run apps/cli/src/help.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/help.ts apps/cli/src/help.test.ts
git commit -m "feat(cli): render top-level language listing from status report"
```

---

## Task 9: CLI `help.ts` — drill-down navigation + JSON

**Files:**
- Modify: `apps/cli/src/help.ts`
- Modify: `apps/cli/src/help.test.ts`

**Interfaces:**
- Consumes: Commander `Command`; `buildProgram()` from `./program.js` (tests only).
- Produces:
  ```ts
  export type NavResult = { command: Command } | { error: string; available: string[] };
  export function navigateTree(program: Command, path: string[]): NavResult;
  export function renderDrillDownText(program: Command, path: string[]): { ok: boolean; text: string };
  export function drillDownJson(program: Command, languageId: string, path: string[]): unknown;
  ```
  `path` is `[namespace?, request?]` (the language is already used to build `program`).

- [ ] **Step 1: Write the failing test**

Add to `apps/cli/src/help.test.ts`:
```ts
import { buildProgram } from './program.js';
import { navigateTree, renderDrillDownText, drillDownJson } from './help.js';

describe('drill-down navigation', () => {
  it('lists namespaces at the root', () => {
    const { ok, text } = renderDrillDownText(buildProgram(), []);
    expect(ok).toBe(true);
    expect(text).toContain('textDocument');
    expect(text).toContain('workspace');
  });

  it('shows a namespace help with its requests', () => {
    const { ok, text } = renderDrillDownText(buildProgram(), ['textDocument']);
    expect(ok).toBe(true);
    expect(text.toLowerCase()).toContain('hover');
  });

  it('errors with siblings for an unknown namespace', () => {
    const { ok, text } = renderDrillDownText(buildProgram(), ['nope']);
    expect(ok).toBe(false);
    expect(text).toContain('textDocument');
  });

  it('drillDownJson returns structured namespaces for a language', () => {
    const json = drillDownJson(buildProgram(), 'typescript', []) as {
      languageId: string; namespaces: Array<{ name: string }>;
    };
    expect(json.languageId).toBe('typescript');
    expect(json.namespaces.map((n) => n.name)).toContain('textDocument');
  });

  it('drillDownJson returns request options at depth 2', () => {
    const json = drillDownJson(buildProgram(), 'typescript', ['textDocument', 'hover']) as {
      request: string; options: Array<{ flags: string }>;
    };
    expect(json.request).toBe('hover');
    expect(Array.isArray(json.options)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/help.test.ts`
Expected: FAIL — `navigateTree`/`renderDrillDownText`/`drillDownJson` not exported.

- [ ] **Step 3: Implement the navigation + renderers**

Append to `apps/cli/src/help.ts`:
```ts
import type { Command } from 'commander';

export type NavResult = { command: Command } | { error: string; available: string[] };

/** Walk `program` → namespace → request along `path`; report siblings on a miss. */
export function navigateTree(program: Command, path: string[]): NavResult {
  let node = program;
  for (let i = 0; i < path.length; i++) {
    const name = path[i]!;
    const next = node.commands.find((c) => c.name() === name);
    if (!next) {
      const level = i === 0 ? 'namespace' : 'request';
      return {
        error: `Unknown ${level} "${name}".`,
        available: node.commands.map((c) => c.name()).sort()
      };
    }
    node = next;
  }
  return { command: node };
}

export function renderDrillDownText(program: Command, path: string[]): { ok: boolean; text: string } {
  const result = navigateTree(program, path);
  if ('error' in result) {
    return { ok: false, text: `${result.error}\nAvailable: ${result.available.join(', ')}\n` };
  }
  return { ok: true, text: result.command.helpInformation() };
}

interface OptionInfo {
  flags: string;
  description: string;
  required: boolean;
}

function optionInfos(command: Command): OptionInfo[] {
  return command.options.map((o) => ({
    flags: o.flags,
    description: o.description,
    required: o.required === true
  }));
}

/** Structured drill-down for `--json`: namespaces, requests, or request options. */
export function drillDownJson(program: Command, languageId: string, path: string[]): unknown {
  const result = navigateTree(program, path);
  if ('error' in result) {
    return { ok: false, languageId, error: result.error, available: result.available };
  }
  const node = result.command;
  if (path.length === 0) {
    return {
      ok: true,
      languageId,
      namespaces: node.commands.map((ns) => ({
        name: ns.name(),
        requests: ns.commands.map((r) => r.name())
      }))
    };
  }
  if (path.length === 1) {
    return {
      ok: true,
      languageId,
      namespace: path[0],
      requests: node.commands.map((r) => r.name())
    };
  }
  return {
    ok: true,
    languageId,
    namespace: path[0],
    request: path[1],
    options: optionInfos(node)
  };
}
```

> Note: `buildProgram()` (program.ts) builds the full mock-all-caps tree, so its `call <method>` command is also a child of the root. The root-level `drillDownJson` therefore lists `call` among namespaces; that is acceptable (it's a real command). The capability-filtered program built at runtime by `buildCommandTree` only includes supported namespaces.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run apps/cli/src/help.test.ts`
Expected: PASS (top-level + drill-down cases).

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/help.ts apps/cli/src/help.test.ts
git commit -m "feat(cli): add capability-tree drill-down navigation and json output"
```

---

## Task 10: `fetchDaemonStatus()` + help-mode router in `cli.ts`

**Files:**
- Modify: `apps/cli/src/connect.ts`
- Modify: `apps/cli/src/cli.ts:24-44` (remove `STATIC_HELP`), `cli.ts:104-107` (router)
- Test: `apps/cli/src/connect.test.ts` *(create, fetchDaemonStatus null-path)*; extend e2e

**Interfaces:**
- Consumes: `SocketTransport` (`@lspeasy/core/node`), `socketPath` (`@lsproxy/proxy`), `StatusReport` (`@lsproxy/proxy`), `discoverServers`/`discoverServerByLanguageId` (`@lspeasy/core`), `coldStatusReport` (`@lsproxy/proxy`), `renderTopLevel`/`renderDrillDownText`/`drillDownJson` (Task 8/9), `createFormatter` (Task 7), `connectViaProxy` (existing), `RefactorSession` (existing), `buildCommandTree` (existing).
- Produces: `fetchDaemonStatus(root: string): Promise<StatusReport | null>` exported from `connect.ts`.

- [ ] **Step 1: Write the failing test (null path)**

Create `apps/cli/src/connect.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fetchDaemonStatus } from './connect.js';

describe('fetchDaemonStatus', () => {
  it('returns null when no daemon socket is live', async () => {
    const root = mkdtempSync(join(tmpdir(), 'lspeasy-nostatus-'));
    expect(await fetchDaemonStatus(root)).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/connect.test.ts`
Expected: FAIL — `fetchDaemonStatus` not exported.

- [ ] **Step 3: Implement `fetchDaemonStatus`**

In `apps/cli/src/connect.ts`, add imports and the function (reusing the existing private `tryConnect` and `socketPath`):
```ts
import type { Message } from '@lspeasy/core';
import type { StatusReport } from '@lsproxy/proxy';

const STATUS_TIMEOUT_MS = 2000;

/**
 * Ask a running proxy daemon for its status. Returns null when no daemon is
 * listening on the project's socket — callers fall back to a config-only view.
 */
export async function fetchDaemonStatus(root: string): Promise<StatusReport | null> {
  const sockPath = socketPath(root);
  if (!existsSync(sockPath) || !(await tryConnect(sockPath))) return null;

  const transport = new SocketTransport({ path: sockPath });
  await transport.waitForConnect();
  try {
    return await new Promise<StatusReport>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('status request timed out')), STATUS_TIMEOUT_MS);
      const sub = transport.onMessage((m: Message) => {
        const msg = m as { id?: unknown; result?: StatusReport };
        if (msg.id === 1) {
          clearTimeout(timer);
          sub.dispose();
          resolve(msg.result as StatusReport);
        }
      });
      void transport.send({ jsonrpc: '2.0', id: 1, method: '$/lsproxy.status', params: {} } as Message);
    });
  } finally {
    await transport.close();
  }
}
```

- [ ] **Step 4: Run test to verify the null path passes**

Run: `pnpm exec vitest run apps/cli/src/connect.test.ts`
Expected: PASS.

- [ ] **Step 5: Replace the help branch in `cli.ts`**

In `apps/cli/src/cli.ts`:

Delete the `STATIC_HELP` constant (lines 24-44). Add imports:
```ts
import { Command } from 'commander';
import { discoverServers, discoverServerByLanguageId } from '@lspeasy/core';
import { coldStatusReport } from '@lsproxy/proxy';
import { fetchDaemonStatus, connectViaProxy } from './connect.js';
import { createFormatter } from './format.js';
import { renderTopLevel, renderDrillDownText, drillDownJson } from './help.js';
```
> `connectViaProxy` is already imported; merge rather than duplicate.

Replace the no-positionals branch (lines 104-107) with a help-mode dispatch. Insert **after** `parseArgs` returns `{ values, positionals }`:
```ts
const helpMode = values.help === true;
if (helpMode || positionals.length === 0) {
  await runHelp(positionals, buildFlags(values as ParsedOptionValues));
  exit(0);
}
```

Add the `runHelp` function (module scope in `cli.ts`):
```ts
/**
 * Help-mode dispatch. Positionals after `--help` mean [language, namespace,
 * request]. Depth 0 → top-level language listing (config + live status);
 * depth >= 1 → connect to that language's server with indexWaitMs 0 and render
 * the capability-filtered command tree at the requested level.
 */
async function runHelp(positionals: string[], flags: GlobalFlags): Promise<void> {
  const [language, ...drillPath] = positionals;

  if (!language) {
    const live = await fetchDaemonStatus(flags.root);
    const report = live ?? coldStatusReport(discoverServers(flags.root));
    if (flags.json) {
      process.stdout.write(JSON.stringify(report) + '\n');
    } else {
      const color = process.stdout.isTTY === true && !process.env['NO_COLOR'];
      process.stdout.write(renderTopLevel(report, createFormatter(color)));
    }
    return;
  }

  const discovered = flags.server
    ? { serverCommand: flags.server, languageId: language }
    : discoverServerByLanguageId(flags.root, language);
  if (!discovered) {
    const names = discoverServers(flags.root).flatMap((s) => Object.values(s.fileExtensions));
    fail(`No server configured for language "${language}". Configured: ${[...new Set(names)].join(', ')}`, flags.json);
    return;
  }

  const session =
    flags.noProxy || flags.server
      ? new RefactorSession({
          serverCommand: discovered.serverCommand,
          languageId: discovered.languageId,
          root: flags.root,
          indexWaitMs: 0,
          verbose: flags.verbose
        })
      : await connectViaProxy({
          root: flags.root,
          languageId: discovered.languageId,
          indexWaitMs: 0,
          verbose: flags.verbose
        });
  if (flags.noProxy || flags.server) await session.start();

  try {
    const program = new Command('lsproxy');
    buildCommandTree(program, session.capabilities, session, flags);
    if (flags.json) {
      process.stdout.write(JSON.stringify(drillDownJson(program, language, drillPath)) + '\n');
    } else {
      const { ok, text } = renderDrillDownText(program, drillPath);
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
> `buildFlags`, `RefactorSession`, `buildCommandTree`, `fail`, `GlobalFlags`, `ParsedOptionValues` are already imported/defined in `cli.ts`. Confirm `RefactorSession`'s import remains.

- [ ] **Step 6: Add an integration test for routing**

Add to `apps/cli/src/cli.test.ts` (it already stubs `process.exit`/`stderr`). Test that bare help with no daemon prints a config-derived listing by spying on stdout and a temp root with `lsp.json`:
```ts
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// runHelp is module-private; export it for testing or assert via the renderer.
```
> If `runHelp` is not exported, add `export` to it and import in the test. Assert the stdout buffer contains the configured language name and the drill-down hint, with the daemon down (no socket under the temp root).

- [ ] **Step 7: Run the CLI package tests + type-check**

Run: `pnpm exec vitest run apps/cli && pnpm run type-check`
Expected: PASS, no type errors.

- [ ] **Step 8: Add an e2e check**

Add an e2e spec (follow the existing `e2e/` harness pattern — inspect a sibling spec for the fixture-server setup) asserting:
- `lsproxy` (bare) exits 0 and prints the configured language(s) + drill-down hint.
- `lsproxy --help <language>` prints namespaces (e.g. `textDocument`).
- `lsproxy --json` output parses as JSON and has a `languages` array; output contains no `\x1b` byte.

Run: `pnpm exec vitest run e2e` (or the repo's e2e command) and confirm PASS.

- [ ] **Step 9: Commit**

```bash
git add apps/cli/src/connect.ts apps/cli/src/connect.test.ts apps/cli/src/cli.ts apps/cli/src/cli.test.ts e2e/
git commit -m "feat(cli): dynamic help with live status and capability-filtered drill-down"
```

---

## Task 11: Changeset + full verification

**Files:**
- Create: `.changeset/<name>.md`

- [ ] **Step 1: Write a changeset**

Create `.changeset/lsproxy-command-discovery.md`:
```markdown
---
'@lsproxy/cli': minor
'@lsproxy/proxy': minor
'@lspeasy/core': minor
---

Dynamic, capability-aware command discovery for `lsproxy`. Bare `lsproxy` lists
configured languages with live health/stats from a new `$/lsproxy.status` proxy
control message; `lsproxy --help <language> <namespace> <request>` drills down
through capability-filtered namespaces to parameter schemas. `--json` emits a
stable, ANSI-free status/command contract for agent invocation.
```

- [ ] **Step 2: Run the full suite, type-check, lint, format**

Run:
```bash
pnpm test
pnpm run type-check
pnpm run lint
pnpm run format
```
Expected: all PASS / clean.

- [ ] **Step 3: Commit**

```bash
git add .changeset
git commit -m "chore: changeset for lsproxy command discovery"
```

---

## Self-Review Notes

- **Spec coverage:** §grammar→Task 10; §top-level→Tasks 1,8,10; §drill-down→Tasks 9,10; §status message→Tasks 2-6; §JSON contract→Tasks 2,8,9,10; §color/symbols→Task 7; §error handling→Tasks 9 (siblings), 10 (unconfigured language, daemon-down); §testing→every task + Task 10 e2e.
- **Replaced behavior:** the old `lsproxy <ns> <cmd> --help <file>` form (documented only in the deleted `STATIC_HELP`) is superseded by `lsproxy --help <language> <ns> <req>`; positionals after `--help` are now always `[language, namespace, request]`.
- **Type consistency:** `ConfiguredServer.fileExtensions` (Task 1) is consumed by `buildStatusReport`/`coldStatusReport` (Task 2) and the unconfigured-language error (Task 10); `StatusReport` flows core-free from proxy → CLI via `@lsproxy/proxy`; `recordRequest(languageId)`/`listBackends()` names match across Tasks 3, 5, 6; `onStatus` option name matches across Tasks 5, 6.
