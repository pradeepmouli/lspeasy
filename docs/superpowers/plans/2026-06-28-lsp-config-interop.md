# LSP Config Interop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Two-way interop between lsproxy's `lsp.json` and other platforms' LSP config (Copilot CLI, Claude Code, Codex; VS Code detected-but-unsupported) via `lsproxy config list|import|export|diff`.

**Architecture:** A canonical model (`LspJson`/`LspServerEntry`) is the hub. Generic logic — canonical model, a `languageId→extensions` table, an `LspJson` file reader/writer, and a local plugin resolver that reads installed `.lsp.json` files — lives in `@lspeasy/core` (reusable by the proxy). Tool-specific `PlatformAdapter`s and the `config` commands live in `apps/cli`. Adapters declare a capability tier; plugin-toggle platforms resolve enabled plugins through the resolver.

**Tech Stack:** TypeScript 5 (strict, no `any` in prod), Node ≥20, Commander, Vitest, pnpm workspaces, `smol-toml` (new dep, for reading Codex `config.toml`).

## Global Constraints

- TypeScript strict mode; **no `any`** in production code (test files may use `as any`/`as never`, matching existing tests).
- All diagnostics → stderr; stdout stays parseable. `--json` output contains **zero ANSI bytes**.
- Conventional-commit messages; commit after each task.
- Run one test file: `pnpm exec vitest run <path>` from repo root. Type-check: `pnpm run type-check`.
- **Plugin `.lsp.json` schema** (resolver input, verbatim): `{ "<serverKey>": { "command": string, "args"?: string[], "extensionToLanguage": Record<ext, languageId>, "transport"?: string, "initializationOptions"?: object, "settings"?: object, "maxRestarts"?: number } }`. One file may define multiple servers. `extensionToLanguage` maps to canonical `fileExtensions`.
- **Canonical / Copilot / lspeasy `lsp.json` schema** (identical): `{ "lspServers": Record<name, LspServerEntry> }`.
- **Claude Code** config: `~/.claude/settings.json` → `enabledPlugins: Record<"<plugin>@<marketplace>", boolean>`.
- **Codex** config: `~/.codex/config.toml` → `[plugins."<plugin>@<marketplace>"]` tables with `enabled = <bool>` (read-only in v1).
- **Copilot** config paths: user `~/.copilot/lsp-config.json`; repo `lsp.json` / `.github/lsp.json`.
- **Plugin install root**: `~/.claude/plugins/marketplaces/`; `.lsp.json` files appear at varying depths (flat `claude-code-lsps/<plugin>/.lsp.json` and nested `claude-plugins-official/plugins/<plugin>/.lsp.json`) — the resolver must scan recursively and derive `<plugin>` = the directory containing `.lsp.json`, `<marketplace>` = the first path segment under `marketplaces/`.
- Preserved-but-unused fields (`transport`/`initializationOptions`/`settings`/`maxRestarts`) round-trip verbatim; the runtime does not consume them in v1.
- Writes to existing user files are surgical + backed up (`<file>.bak`). Codex is read-only in v1 (no TOML write).

---

## File Structure

| File | Responsibility |
|---|---|
| `packages/core/src/discover.ts` *(modify)* | Extend `LspServerEntry` (provenance + preserved fields); add `readLspJsonFile`/`writeLspJsonFile`/`mergeServers` |
| `packages/core/src/language-extensions.ts` *(create)* | `DEFAULT_EXTENSIONS` table + `extensionsForLanguage()` |
| `packages/core/src/plugin-resolver.ts` *(create)* | `resolvePlugin`/`findPluginFor`/`listInstalledPluginServers` over installed `.lsp.json` |
| `packages/core/src/index.ts` *(modify)* | Re-export the new core symbols |
| `apps/cli/src/config/adapter.ts` *(create)* | `PlatformAdapter` interface + shared types (`Tier`, `Scope`, `CanonicalServers`, `WriteResult`) |
| `apps/cli/src/config/registry.ts` *(create)* | Registry of adapters keyed by id |
| `apps/cli/src/config/adapters/lspjson.ts` *(create)* | Canonical `lsp.json` adapter (full) |
| `apps/cli/src/config/adapters/copilot.ts` *(create)* | Copilot CLI adapter (full) |
| `apps/cli/src/config/adapters/claude-code.ts` *(create)* | Claude Code `enabledPlugins` adapter (full; surgical write) |
| `apps/cli/src/config/adapters/codex.ts` *(create)* | Codex `config.toml` adapter (read-only) |
| `apps/cli/src/config/adapters/vscode.ts` *(create)* | VS Code adapter (detected-but-unsupported) |
| `apps/cli/src/config/commands.ts` *(create)* | `list`/`import`/`export`/`diff` logic |
| `apps/cli/src/cli.ts` *(modify)* | Route the `config` subcommand |
| `apps/cli/package.json` *(modify)* | Add `smol-toml` dependency |

---

## Task 1: Canonical model — provenance + preserved fields

**Files:**
- Modify: `packages/core/src/discover.ts` (the `LspServerEntry` interface, near line 5)
- Test: `packages/core/src/discover.test.ts`

**Interfaces:**
- Produces: extended `LspServerEntry`:
  ```ts
  interface LspServerEntry {
    command: string;
    args?: string[];
    fileExtensions: Record<string, string>;
    marketplacePlugin?: string;
    transport?: string;
    initializationOptions?: Record<string, unknown>;
    settings?: Record<string, unknown>;
    maxRestarts?: number;
  }
  ```

- [ ] **Step 1: Write the failing test**

Add to `packages/core/src/discover.test.ts`:
```ts
import type { LspServerEntry } from './discover.js';

describe('LspServerEntry preserved fields', () => {
  it('accepts provenance and preserved-but-unused fields', () => {
    const e: LspServerEntry = {
      command: 'rust-analyzer',
      fileExtensions: { '.rs': 'rust' },
      marketplacePlugin: 'rust-analyzer@claude-code-lsps',
      transport: 'stdio',
      initializationOptions: { a: 1 },
      settings: { b: 2 },
      maxRestarts: 3
    };
    expect(e.marketplacePlugin).toBe('rust-analyzer@claude-code-lsps');
    expect(e.maxRestarts).toBe(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run packages/core/src/discover.test.ts`
Expected: FAIL — TS error "Object literal may only specify known properties" on `marketplacePlugin`.

- [ ] **Step 3: Extend the interface**

In `packages/core/src/discover.ts`, replace the `LspServerEntry` interface:
```ts
export interface LspServerEntry {
  command: string;
  args?: string[];
  fileExtensions: Record<string, string>;
  /** Provenance: qualified plugin id this entry was imported from, e.g.
   *  "rust-analyzer@claude-code-lsps". Lets export round-trip to a plugin toggle. */
  marketplacePlugin?: string;
  /** Preserved-but-not-consumed fields carried verbatim from richer native
   *  formats (e.g. plugin .lsp.json) so import → export round-trips losslessly.
   *  The lsproxy runtime ignores these in v1. */
  transport?: string;
  initializationOptions?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  maxRestarts?: number;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run packages/core/src/discover.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add packages/core/src/discover.ts packages/core/src/discover.test.ts
git commit -m "feat(core): extend LspServerEntry with provenance and preserved fields"
```

---

## Task 2: `languageId → extensions` table

**Files:**
- Create: `packages/core/src/language-extensions.ts`
- Create: `packages/core/src/language-extensions.test.ts`
- Modify: `packages/core/src/index.ts`

**Interfaces:**
- Produces:
  ```ts
  const DEFAULT_EXTENSIONS: Record<string, string[]>;
  function extensionsForLanguage(languageId: string): string[]; // [] if unknown
  ```

- [ ] **Step 1: Write the failing test**

Create `packages/core/src/language-extensions.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { extensionsForLanguage, DEFAULT_EXTENSIONS } from './language-extensions.js';

describe('extensionsForLanguage', () => {
  it('returns known extensions for a standard languageId', () => {
    expect(extensionsForLanguage('typescript')).toContain('.ts');
    expect(extensionsForLanguage('rust')).toEqual(['.rs']);
  });
  it('returns an empty array for an unknown languageId', () => {
    expect(extensionsForLanguage('made-up-lang')).toEqual([]);
  });
  it('exposes the table', () => {
    expect(DEFAULT_EXTENSIONS['python']).toContain('.py');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run packages/core/src/language-extensions.test.ts`
Expected: FAIL — cannot find module `./language-extensions.js`.

- [ ] **Step 3: Implement**

Create `packages/core/src/language-extensions.ts`:
```ts
/**
 * Default file extensions per LSP languageId. Used as a fallback when a config
 * source names a language but omits its extensions. Not exhaustive — covers the
 * common languages; extend as needed.
 */
export const DEFAULT_EXTENSIONS: Record<string, string[]> = {
  typescript: ['.ts', '.mts', '.cts'],
  typescriptreact: ['.tsx'],
  javascript: ['.js', '.mjs', '.cjs'],
  javascriptreact: ['.jsx'],
  rust: ['.rs'],
  python: ['.py', '.pyi', '.pyw'],
  go: ['.go'],
  c: ['.c', '.h'],
  cpp: ['.cpp', '.cc', '.cxx', '.hpp', '.hh'],
  json: ['.json'],
  jsonc: ['.jsonc'],
  css: ['.css'],
  scss: ['.scss'],
  less: ['.less'],
  html: ['.html', '.htm'],
  ruby: ['.rb'],
  java: ['.java'],
  csharp: ['.cs']
};

/** Extensions for a languageId, or [] when unknown. */
export function extensionsForLanguage(languageId: string): string[] {
  return DEFAULT_EXTENSIONS[languageId] ?? [];
}
```

- [ ] **Step 4: Re-export from the package entry**

In `packages/core/src/index.ts`, after the discovery export block, add:
```ts
export { DEFAULT_EXTENSIONS, extensionsForLanguage } from './language-extensions.js';
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm exec vitest run packages/core/src/language-extensions.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/language-extensions.ts packages/core/src/language-extensions.test.ts packages/core/src/index.ts
git commit -m "feat(core): add languageId to default-extensions table"
```

---

## Task 3: `LspJson` file reader/writer + merge

**Files:**
- Modify: `packages/core/src/discover.ts`
- Modify: `packages/core/src/index.ts`
- Test: `packages/core/src/discover.test.ts`

**Interfaces:**
- Consumes: `LspJson`, `LspServerEntry` (Task 1).
- Produces:
  ```ts
  function readLspJsonFile(path: string): Record<string, LspServerEntry>; // {} if missing/invalid
  function writeLspJsonFile(path: string, servers: Record<string, LspServerEntry>): void; // pretty JSON, mkdir -p
  function mergeServers(
    base: Record<string, LspServerEntry>,
    incoming: Record<string, LspServerEntry>
  ): { merged: Record<string, LspServerEntry>; added: string[]; updated: string[] };
  ```

- [ ] **Step 1: Write the failing test**

Add to `packages/core/src/discover.test.ts` (it already imports `node:fs`/`node:os`/`node:path` and has a temp-dir helper pattern — reuse `mkdtempSync`):
```ts
import { readLspJsonFile, writeLspJsonFile, mergeServers } from './discover.js';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

describe('LspJson file IO', () => {
  it('writes then reads back the same servers', () => {
    const dir = mkdtempSync(join(tmpdir(), 'lspeasy-io-'));
    try {
      const servers = { rust: { command: 'rust-analyzer', fileExtensions: { '.rs': 'rust' } } };
      const file = join(dir, 'lsp.json');
      writeLspJsonFile(file, servers);
      expect(readLspJsonFile(file)).toEqual(servers);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('returns {} for a missing or invalid file', () => {
    expect(readLspJsonFile('/no/such/lsp.json')).toEqual({});
  });

  it('mergeServers reports added and updated keys', () => {
    const base = { a: { command: 'a', fileExtensions: {} } };
    const incoming = {
      a: { command: 'a2', fileExtensions: {} },
      b: { command: 'b', fileExtensions: {} }
    };
    const { merged, added, updated } = mergeServers(base, incoming);
    expect(added).toEqual(['b']);
    expect(updated).toEqual(['a']);
    expect(merged.a!.command).toBe('a2');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run packages/core/src/discover.test.ts`
Expected: FAIL — `readLspJsonFile` not exported.

- [ ] **Step 3: Implement**

In `packages/core/src/discover.ts`, add (reuse the existing `readFileSync`/`existsSync` imports; add `writeFileSync`/`mkdirSync` to the `node:fs` import and `dirname` is already imported):
```ts
/** Read a single lsp.json file's `lspServers` map. Returns {} when missing or unparseable. */
export function readLspJsonFile(path: string): Record<string, LspServerEntry> {
  if (!existsSync(path)) return {};
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8')) as Partial<LspJson>;
    return parsed.lspServers ?? {};
  } catch {
    return {};
  }
}

/** Write an `lspServers` map to a file as pretty JSON, creating parent dirs. */
export function writeLspJsonFile(
  path: string,
  servers: Record<string, LspServerEntry>
): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify({ lspServers: servers }, null, 2) + '\n', 'utf8');
}

/** Merge incoming servers over base; report which keys were added vs updated. */
export function mergeServers(
  base: Record<string, LspServerEntry>,
  incoming: Record<string, LspServerEntry>
): { merged: Record<string, LspServerEntry>; added: string[]; updated: string[] } {
  const merged = { ...base };
  const added: string[] = [];
  const updated: string[] = [];
  for (const [name, entry] of Object.entries(incoming)) {
    if (name in base) updated.push(name);
    else added.push(name);
    merged[name] = entry;
  }
  return { merged, added, updated };
}
```
Ensure the `node:fs` import line includes `writeFileSync` and `mkdirSync`:
```ts
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
```

- [ ] **Step 4: Re-export**

In `packages/core/src/index.ts`, add to the discovery `export { … }` block:
```ts
  readLspJsonFile,
  writeLspJsonFile,
  mergeServers
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm exec vitest run packages/core/src/discover.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/core/src/discover.ts packages/core/src/discover.test.ts packages/core/src/index.ts
git commit -m "feat(core): add lsp.json file reader/writer and server merge"
```

---

## Task 4: Local plugin resolver

**Files:**
- Create: `packages/core/src/plugin-resolver.ts`
- Create: `packages/core/src/plugin-resolver.test.ts`
- Modify: `packages/core/src/index.ts`

**Interfaces:**
- Consumes: `LspServerEntry` (Task 1).
- Produces:
  ```ts
  function defaultPluginsRoot(): string;  // ~/.claude/plugins/marketplaces
  function listInstalledPluginServers(pluginsRoot?: string): Record<string, LspServerEntry[]>; // "<plugin>@<marketplace>" → servers
  function resolvePlugin(pluginId: string, pluginsRoot?: string): LspServerEntry[]; // [] if not found
  function findPluginFor(entry: LspServerEntry, pluginsRoot?: string): string | undefined;
  ```

- [ ] **Step 1: Write the failing test**

Create `packages/core/src/plugin-resolver.test.ts`:
```ts
import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { listInstalledPluginServers, resolvePlugin, findPluginFor } from './plugin-resolver.js';

const roots: string[] = [];
function fixtureRoot(): string {
  // marketplaces/<mp>/<plugin>/.lsp.json (flat) and nested plugins/<plugin>/.lsp.json
  const root = mkdtempSync(join(tmpdir(), 'lspeasy-plugins-'));
  roots.push(root);
  const flat = join(root, 'claude-code-lsps', 'rust-analyzer');
  mkdirSync(flat, { recursive: true });
  writeFileSync(
    join(flat, '.lsp.json'),
    JSON.stringify({
      rust: { command: 'rust-analyzer', args: [], extensionToLanguage: { '.rs': 'rust' }, maxRestarts: 3 }
    })
  );
  const nested = join(root, 'claude-plugins-official', 'plugins', 'vscode-langservers');
  mkdirSync(nested, { recursive: true });
  writeFileSync(
    join(nested, '.lsp.json'),
    JSON.stringify({
      html: { command: 'vscode-html-language-server', args: ['--stdio'], extensionToLanguage: { '.html': 'html' } },
      css: { command: 'vscode-css-language-server', args: ['--stdio'], extensionToLanguage: { '.css': 'css' } }
    })
  );
  return root;
}

afterEach(() => {
  while (roots.length) rmSync(roots.pop()!, { recursive: true, force: true });
});

describe('plugin resolver', () => {
  it('lists installed plugin servers keyed by <plugin>@<marketplace>', () => {
    const all = listInstalledPluginServers(fixtureRoot());
    expect(Object.keys(all).sort()).toEqual([
      'rust-analyzer@claude-code-lsps',
      'vscode-langservers@claude-plugins-official'
    ]);
    expect(all['vscode-langservers@claude-plugins-official']).toHaveLength(2);
  });

  it('resolvePlugin renames extensionToLanguage and carries preserved fields + provenance', () => {
    const servers = resolvePlugin('rust-analyzer@claude-code-lsps', fixtureRoot());
    expect(servers).toHaveLength(1);
    expect(servers[0]).toMatchObject({
      command: 'rust-analyzer',
      fileExtensions: { '.rs': 'rust' },
      maxRestarts: 3,
      marketplacePlugin: 'rust-analyzer@claude-code-lsps'
    });
    expect((servers[0] as { extensionToLanguage?: unknown }).extensionToLanguage).toBeUndefined();
  });

  it('resolvePlugin returns [] for an unknown plugin', () => {
    expect(resolvePlugin('nope@nowhere', fixtureRoot())).toEqual([]);
  });

  it('findPluginFor matches by stamped provenance then by command', () => {
    const root = fixtureRoot();
    expect(findPluginFor({ command: 'x', fileExtensions: {}, marketplacePlugin: 'rust-analyzer@claude-code-lsps' }, root))
      .toBe('rust-analyzer@claude-code-lsps');
    expect(findPluginFor({ command: 'rust-analyzer', fileExtensions: {} }, root))
      .toBe('rust-analyzer@claude-code-lsps');
    expect(findPluginFor({ command: 'unmatched', fileExtensions: {} }, root)).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run packages/core/src/plugin-resolver.test.ts`
Expected: FAIL — cannot find module `./plugin-resolver.js`.

- [ ] **Step 3: Implement**

Create `packages/core/src/plugin-resolver.ts`:
```ts
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { basename, dirname, join, relative, sep } from 'node:path';
import type { LspServerEntry } from './discover.js';

/** Default install root for plugin marketplaces. */
export function defaultPluginsRoot(): string {
  return join(homedir(), '.claude', 'plugins', 'marketplaces');
}

/** The raw per-server shape inside a plugin's `.lsp.json`. */
interface RawPluginServer {
  command: string;
  args?: string[];
  extensionToLanguage?: Record<string, string>;
  transport?: string;
  initializationOptions?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  maxRestarts?: number;
}

/** Recursively collect every `.lsp.json` file path under a directory. */
function findLspJsonFiles(dir: string): string[] {
  const out: string[] = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...findLspJsonFiles(full));
    else if (e.name === '.lsp.json') out.push(full);
  }
  return out;
}

function toCanonical(raw: RawPluginServer, pluginId: string): LspServerEntry {
  const entry: LspServerEntry = {
    command: raw.command,
    fileExtensions: raw.extensionToLanguage ?? {},
    marketplacePlugin: pluginId
  };
  if (raw.args) entry.args = raw.args;
  if (raw.transport !== undefined) entry.transport = raw.transport;
  if (raw.initializationOptions !== undefined) entry.initializationOptions = raw.initializationOptions;
  if (raw.settings !== undefined) entry.settings = raw.settings;
  if (raw.maxRestarts !== undefined) entry.maxRestarts = raw.maxRestarts;
  return entry;
}

/**
 * Map every installed plugin's servers, keyed by "<plugin>@<marketplace>".
 * `<marketplace>` is the first path segment under the root; `<plugin>` is the
 * directory directly containing the `.lsp.json` (handles flat and nested layouts).
 */
export function listInstalledPluginServers(
  pluginsRoot: string = defaultPluginsRoot()
): Record<string, LspServerEntry[]> {
  const result: Record<string, LspServerEntry[]> = {};
  if (!existsSync(pluginsRoot)) return result;
  for (const file of findLspJsonFiles(pluginsRoot)) {
    const marketplace = relative(pluginsRoot, file).split(sep)[0];
    if (!marketplace) continue;
    const plugin = basename(dirname(file));
    const pluginId = `${plugin}@${marketplace}`;
    let raw: Record<string, RawPluginServer>;
    try {
      raw = JSON.parse(readFileSync(file, 'utf8')) as Record<string, RawPluginServer>;
    } catch {
      continue;
    }
    result[pluginId] = Object.values(raw).map((s) => toCanonical(s, pluginId));
  }
  return result;
}

/** Canonical servers for one "<plugin>@<marketplace>" id, or [] when not installed. */
export function resolvePlugin(
  pluginId: string,
  pluginsRoot: string = defaultPluginsRoot()
): LspServerEntry[] {
  return listInstalledPluginServers(pluginsRoot)[pluginId] ?? [];
}

/** Find the plugin id a canonical entry maps to: prefer stamped provenance, else match by command. */
export function findPluginFor(
  entry: LspServerEntry,
  pluginsRoot: string = defaultPluginsRoot()
): string | undefined {
  if (entry.marketplacePlugin) return entry.marketplacePlugin;
  const all = listInstalledPluginServers(pluginsRoot);
  for (const [pluginId, servers] of Object.entries(all)) {
    if (servers.some((s) => s.command === entry.command)) return pluginId;
  }
  return undefined;
}
```

- [ ] **Step 4: Re-export**

In `packages/core/src/index.ts`, add:
```ts
export {
  defaultPluginsRoot,
  listInstalledPluginServers,
  resolvePlugin,
  findPluginFor
} from './plugin-resolver.js';
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm exec vitest run packages/core/src/plugin-resolver.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Run the whole core package + type-check**

Run: `pnpm exec vitest run packages/core && pnpm run type-check`
Expected: PASS, clean. Then rebuild core so downstream packages see the new exports: `pnpm --filter @lspeasy/core build`.

- [ ] **Step 7: Commit**

```bash
git add packages/core/src/plugin-resolver.ts packages/core/src/plugin-resolver.test.ts packages/core/src/index.ts
git commit -m "feat(core): add local plugin resolver over installed .lsp.json files"
```

---

## Task 5: Adapter interface + registry

**Files:**
- Create: `apps/cli/src/config/adapter.ts`
- Create: `apps/cli/src/config/registry.ts`
- Create: `apps/cli/src/config/registry.test.ts`

**Interfaces:**
- Consumes: `LspServerEntry` (`@lspeasy/core`).
- Produces:
  ```ts
  type Tier = 'full' | 'plugin-resolved' | 'read-only';
  type Scope = 'user' | 'project';
  type CanonicalServers = Record<string, import('@lspeasy/core').LspServerEntry>;
  interface WriteResult { path: string; written: string[]; skipped: Array<{ name: string; reason: string }>; }
  interface PlatformAdapter {
    id: string; name: string; tier: Tier;
    detect(scope: Scope, root: string): boolean;
    configPath(scope: Scope, root: string): string;
    read(scope: Scope, root: string): CanonicalServers;
    write?(servers: CanonicalServers, scope: Scope, root: string): WriteResult;
  }
  function getAdapters(): PlatformAdapter[];
  function getAdapter(id: string): PlatformAdapter | undefined;
  ```

- [ ] **Step 1: Write the failing test**

Create `apps/cli/src/config/registry.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { getAdapters, getAdapter } from './registry.js';

describe('adapter registry', () => {
  it('exposes all v1 adapters by id', () => {
    const ids = getAdapters().map((a) => a.id).sort();
    expect(ids).toEqual(['claude-code', 'codex', 'copilot', 'lspjson', 'vscode']);
  });
  it('looks up an adapter by id', () => {
    expect(getAdapter('lspjson')?.tier).toBe('full');
    expect(getAdapter('codex')?.tier).toBe('read-only');
    expect(getAdapter('nope')).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/config/registry.test.ts`
Expected: FAIL — cannot find module `./registry.js`.

- [ ] **Step 3: Implement the interface**

Create `apps/cli/src/config/adapter.ts`:
```ts
import type { LspServerEntry } from '@lspeasy/core';

export type Tier = 'full' | 'plugin-resolved' | 'read-only';
export type Scope = 'user' | 'project';
export type CanonicalServers = Record<string, LspServerEntry>;

export interface WriteResult {
  path: string;
  written: string[];
  skipped: Array<{ name: string; reason: string }>;
}

export interface PlatformAdapter {
  id: string;
  name: string;
  tier: Tier;
  /** Is this platform's config present for the given scope? */
  detect(scope: Scope, root: string): boolean;
  /** The file this adapter reads/writes for the given scope. */
  configPath(scope: Scope, root: string): string;
  /** Native config → canonical servers. {} when absent. */
  read(scope: Scope, root: string): CanonicalServers;
  /** Canonical servers → native config. Absent ⇒ read-only adapter. */
  write?(servers: CanonicalServers, scope: Scope, root: string): WriteResult;
}
```

- [ ] **Step 4: Implement the registry (with placeholder adapters wired in later tasks)**

Create `apps/cli/src/config/registry.ts`:
```ts
import type { PlatformAdapter } from './adapter.js';
import { lspjsonAdapter } from './adapters/lspjson.js';
import { copilotAdapter } from './adapters/copilot.js';
import { claudeCodeAdapter } from './adapters/claude-code.js';
import { codexAdapter } from './adapters/codex.js';
import { vscodeAdapter } from './adapters/vscode.js';

const ADAPTERS: PlatformAdapter[] = [
  lspjsonAdapter,
  copilotAdapter,
  claudeCodeAdapter,
  codexAdapter,
  vscodeAdapter
];

export function getAdapters(): PlatformAdapter[] {
  return ADAPTERS;
}

export function getAdapter(id: string): PlatformAdapter | undefined {
  return ADAPTERS.find((a) => a.id === id);
}
```

> This imports the five adapter modules created in Tasks 6–10. To keep this task's test green on its own, create minimal stub files for the four not-yet-built adapters now and flesh them out in their tasks: each stub exports a `const <name>Adapter: PlatformAdapter` with the correct `id`/`name`/`tier`, a `detect` returning `false`, a `configPath` returning `''`, and a `read` returning `{}`. Replace the stub bodies in the corresponding task. Create stubs: `adapters/lspjson.ts` (id `lspjson`, tier `full`), `adapters/copilot.ts` (id `copilot`, tier `full`), `adapters/claude-code.ts` (id `claude-code`, tier `full`), `adapters/codex.ts` (id `codex`, tier `read-only`), `adapters/vscode.ts` (id `vscode`, tier `read-only`). Example stub:
> ```ts
> import type { PlatformAdapter } from '../adapter.js';
> export const lspjsonAdapter: PlatformAdapter = {
>   id: 'lspjson', name: 'lsp.json', tier: 'full',
>   detect: () => false, configPath: () => '', read: () => ({})
> };
> ```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm exec vitest run apps/cli/src/config/registry.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add apps/cli/src/config/adapter.ts apps/cli/src/config/registry.ts apps/cli/src/config/registry.test.ts apps/cli/src/config/adapters/
git commit -m "feat(cli): add PlatformAdapter interface and adapter registry"
```

---

## Task 6: `lspjson` adapter (canonical, full)

**Files:**
- Modify: `apps/cli/src/config/adapters/lspjson.ts` (replace the stub)
- Create: `apps/cli/src/config/adapters/lspjson.test.ts`

**Interfaces:**
- Consumes: `readLspJsonFile`/`writeLspJsonFile` (`@lspeasy/core`, Task 3); `PlatformAdapter` (Task 5).
- Produces: `lspjsonAdapter` (full). Paths: user → `~/.claude/lsp.json`; project → `<root>/lsp.json`.

- [ ] **Step 1: Write the failing test**

Create `apps/cli/src/config/adapters/lspjson.test.ts`:
```ts
import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { lspjsonAdapter } from './lspjson.js';

const roots: string[] = [];
function root(): string {
  const d = mkdtempSync(join(tmpdir(), 'lspeasy-lspjson-'));
  roots.push(d);
  return d;
}
afterEach(() => {
  while (roots.length) rmSync(roots.pop()!, { recursive: true, force: true });
});

describe('lspjsonAdapter', () => {
  it('round-trips servers through the project lsp.json', () => {
    const r = root();
    const servers = { rust: { command: 'rust-analyzer', fileExtensions: { '.rs': 'rust' } } };
    const res = lspjsonAdapter.write!(servers, 'project', r);
    expect(res.written).toEqual(['rust']);
    expect(lspjsonAdapter.detect('project', r)).toBe(true);
    expect(lspjsonAdapter.read('project', r)).toEqual(servers);
  });

  it('reads {} when no file exists', () => {
    expect(lspjsonAdapter.read('project', root())).toEqual({});
    expect(lspjsonAdapter.detect('project', root())).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/config/adapters/lspjson.test.ts`
Expected: FAIL — stub `write` is undefined / `read` returns `{}` for a written file.

- [ ] **Step 3: Implement**

Replace `apps/cli/src/config/adapters/lspjson.ts`:
```ts
import { homedir } from 'node:os';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { readLspJsonFile, writeLspJsonFile } from '@lspeasy/core';
import type { CanonicalServers, PlatformAdapter, Scope, WriteResult } from '../adapter.js';

function pathFor(scope: Scope, root: string): string {
  return scope === 'user' ? join(homedir(), '.claude', 'lsp.json') : join(root, 'lsp.json');
}

export const lspjsonAdapter: PlatformAdapter = {
  id: 'lspjson',
  name: 'lsp.json',
  tier: 'full',
  detect: (scope, root) => existsSync(pathFor(scope, root)),
  configPath: (scope, root) => pathFor(scope, root),
  read: (scope, root) => readLspJsonFile(pathFor(scope, root)),
  write: (servers: CanonicalServers, scope, root): WriteResult => {
    const path = pathFor(scope, root);
    writeLspJsonFile(path, servers);
    return { path, written: Object.keys(servers), skipped: [] };
  }
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run apps/cli/src/config/adapters/lspjson.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/config/adapters/lspjson.ts apps/cli/src/config/adapters/lspjson.test.ts
git commit -m "feat(cli): implement lspjson config adapter"
```

---

## Task 7: `copilot` adapter (full)

**Files:**
- Modify: `apps/cli/src/config/adapters/copilot.ts` (replace the stub)
- Create: `apps/cli/src/config/adapters/copilot.test.ts`

**Interfaces:**
- Consumes: `readLspJsonFile`/`writeLspJsonFile` (`@lspeasy/core`); `PlatformAdapter`.
- Produces: `copilotAdapter` (full). Paths: user → `~/.copilot/lsp-config.json`; project → `<root>/.github/lsp.json`. Same `{ lspServers }` schema as lsp.json.

- [ ] **Step 1: Write the failing test**

Create `apps/cli/src/config/adapters/copilot.test.ts`:
```ts
import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { copilotAdapter } from './copilot.js';

const roots: string[] = [];
function root(): string {
  const d = mkdtempSync(join(tmpdir(), 'lspeasy-copilot-'));
  roots.push(d);
  return d;
}
afterEach(() => {
  while (roots.length) rmSync(roots.pop()!, { recursive: true, force: true });
});

describe('copilotAdapter', () => {
  it('round-trips servers through the project .github/lsp.json', () => {
    const r = root();
    const servers = { python: { command: 'basedpyright-langserver', args: ['--stdio'], fileExtensions: { '.py': 'python' } } };
    const res = copilotAdapter.write!(servers, 'project', r);
    expect(res.path).toBe(join(r, '.github', 'lsp.json'));
    expect(res.written).toEqual(['python']);
    expect(copilotAdapter.read('project', r)).toEqual(servers);
  });

  it('uses the user-level lsp-config.json path', () => {
    expect(copilotAdapter.configPath('user', root())).toMatch(/\.copilot\/lsp-config\.json$/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/config/adapters/copilot.test.ts`
Expected: FAIL — stub `write` undefined.

- [ ] **Step 3: Implement**

Replace `apps/cli/src/config/adapters/copilot.ts`:
```ts
import { homedir } from 'node:os';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { readLspJsonFile, writeLspJsonFile } from '@lspeasy/core';
import type { CanonicalServers, PlatformAdapter, Scope, WriteResult } from '../adapter.js';

// Copilot CLI uses the SAME { lspServers } schema as lsp.json. User-level lives
// at ~/.copilot/lsp-config.json; repo-level is .github/lsp.json (its canonical
// repo location, distinct from lspeasy's primary lsp.json).
function pathFor(scope: Scope, root: string): string {
  return scope === 'user'
    ? join(homedir(), '.copilot', 'lsp-config.json')
    : join(root, '.github', 'lsp.json');
}

export const copilotAdapter: PlatformAdapter = {
  id: 'copilot',
  name: 'Copilot CLI',
  tier: 'full',
  detect: (scope, root) => existsSync(pathFor(scope, root)),
  configPath: (scope, root) => pathFor(scope, root),
  read: (scope, root) => readLspJsonFile(pathFor(scope, root)),
  write: (servers: CanonicalServers, scope, root): WriteResult => {
    const path = pathFor(scope, root);
    writeLspJsonFile(path, servers);
    return { path, written: Object.keys(servers), skipped: [] };
  }
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run apps/cli/src/config/adapters/copilot.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/config/adapters/copilot.ts apps/cli/src/config/adapters/copilot.test.ts
git commit -m "feat(cli): implement Copilot CLI config adapter"
```

---

## Task 8: `claude-code` adapter (plugin-resolved, full)

**Files:**
- Modify: `apps/cli/src/config/adapters/claude-code.ts` (replace the stub)
- Create: `apps/cli/src/config/adapters/claude-code.test.ts`

**Interfaces:**
- Consumes: `resolvePlugin`/`findPluginFor` (`@lspeasy/core`, Task 4); `PlatformAdapter`.
- Produces: `claudeCodeAdapter` (full). Config: `~/.claude/settings.json` `enabledPlugins`. Only `user` scope is meaningful (Claude Code settings are user-level); `project` falls back to the same user file. Read resolves enabled plugins that have `.lsp.json`. Write toggles `enabledPlugins["<plugin>@<marketplace>"] = true` surgically (+`.bak`); servers with no matching installed plugin are skipped.

- [ ] **Step 1: Write the failing test**

Create `apps/cli/src/config/adapters/claude-code.test.ts`:
```ts
import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { claudeCodeAdapter } from './claude-code.js';

const dirs: string[] = [];
// Build a fake home with settings.json (enabledPlugins) + a plugins tree.
function fakeHome(): string {
  const home = mkdtempSync(join(tmpdir(), 'lspeasy-cc-'));
  dirs.push(home);
  mkdirSync(join(home, '.claude'), { recursive: true });
  writeFileSync(
    join(home, '.claude', 'settings.json'),
    JSON.stringify({ enabledPlugins: { 'rust-analyzer@claude-code-lsps': true, 'other@mp': true }, theme: 'dark' }, null, 2)
  );
  const plug = join(home, '.claude', 'plugins', 'marketplaces', 'claude-code-lsps', 'rust-analyzer');
  mkdirSync(plug, { recursive: true });
  writeFileSync(
    join(plug, '.lsp.json'),
    JSON.stringify({ rust: { command: 'rust-analyzer', extensionToLanguage: { '.rs': 'rust' } } })
  );
  return home;
}
afterEach(() => {
  while (dirs.length) rmSync(dirs.pop()!, { recursive: true, force: true });
});

describe('claudeCodeAdapter', () => {
  it('reads enabled plugins that resolve to servers', () => {
    const home = fakeHome();
    const servers = claudeCodeAdapter.read('user', home);
    // keyed by canonical server name (the .lsp.json server key)
    expect(servers['rust']).toMatchObject({ command: 'rust-analyzer', marketplacePlugin: 'rust-analyzer@claude-code-lsps' });
    // "other@mp" had no installed .lsp.json → omitted
    expect(Object.keys(servers)).toEqual(['rust']);
  });

  it('writes by toggling enabledPlugins, preserving other keys, with a backup', () => {
    const home = fakeHome();
    const res = claudeCodeAdapter.write!(
      { rust: { command: 'rust-analyzer', fileExtensions: { '.rs': 'rust' }, marketplacePlugin: 'rust-analyzer@claude-code-lsps' } },
      'user',
      home
    );
    expect(res.written).toEqual(['rust']);
    const settings = JSON.parse(readFileSync(join(home, '.claude', 'settings.json'), 'utf8'));
    expect(settings.enabledPlugins['rust-analyzer@claude-code-lsps']).toBe(true);
    expect(settings.theme).toBe('dark'); // unrelated key preserved
    expect(existsSync(join(home, '.claude', 'settings.json.bak'))).toBe(true);
  });

  it('skips a server with no matching installed plugin on write', () => {
    const home = fakeHome();
    const res = claudeCodeAdapter.write!(
      { ghost: { command: 'ghost-ls', fileExtensions: {} } },
      'user',
      home
    );
    expect(res.written).toEqual([]);
    expect(res.skipped.map((s) => s.name)).toEqual(['ghost']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/config/adapters/claude-code.test.ts`
Expected: FAIL — stub returns `{}` / no `write`.

- [ ] **Step 3: Implement**

Replace `apps/cli/src/config/adapters/claude-code.ts`:
```ts
import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';
import { resolvePlugin, findPluginFor } from '@lspeasy/core';
import type { CanonicalServers, PlatformAdapter, Scope, WriteResult } from '../adapter.js';

// `root` here is treated as the home directory (the controller passes the real
// home for production; tests pass a fake home). Claude Code config is user-level.
function settingsPath(home: string): string {
  return join(home, '.claude', 'settings.json');
}
function pluginsRoot(home: string): string {
  return join(home, '.claude', 'plugins', 'marketplaces');
}

interface Settings {
  enabledPlugins?: Record<string, boolean>;
  [k: string]: unknown;
}

function readSettings(home: string): Settings {
  const p = settingsPath(home);
  if (!existsSync(p)) return {};
  try {
    return JSON.parse(readFileSync(p, 'utf8')) as Settings;
  } catch {
    return {};
  }
}

export const claudeCodeAdapter: PlatformAdapter = {
  id: 'claude-code',
  name: 'Claude Code',
  tier: 'full',
  detect: (_scope, home) => existsSync(settingsPath(home)),
  configPath: (_scope, home) => settingsPath(home),
  read: (_scope: Scope, home: string): CanonicalServers => {
    const enabled = readSettings(home).enabledPlugins ?? {};
    const servers: CanonicalServers = {};
    for (const [pluginId, on] of Object.entries(enabled)) {
      if (!on) continue;
      for (const s of resolvePlugin(pluginId, pluginsRoot(home))) {
        const lang = Object.values(s.fileExtensions)[0] ?? s.command;
        servers[lang] = s;
      }
    }
    return servers;
  },
  write: (servers: CanonicalServers, _scope, home): WriteResult => {
    const p = settingsPath(home);
    const settings = readSettings(home);
    const enabled = settings.enabledPlugins ?? {};
    const written: string[] = [];
    const skipped: Array<{ name: string; reason: string }> = [];
    for (const [name, entry] of Object.entries(servers)) {
      const pluginId = findPluginFor(entry, pluginsRoot(home));
      if (!pluginId) {
        skipped.push({ name, reason: 'no matching installed plugin' });
        continue;
      }
      enabled[pluginId] = true;
      written.push(name);
    }
    if (written.length > 0) {
      if (existsSync(p)) copyFileSync(p, p + '.bak');
      settings.enabledPlugins = enabled;
      writeFileSync(p, JSON.stringify(settings, null, 2) + '\n', 'utf8');
    }
    return { path: p, written, skipped };
  }
};
```

> Note: the adapter takes the home directory as its `root` argument. The commands layer (Task 11) passes `homedir()` for the `claude-code`/`codex` adapters' user scope. This keeps the adapter testable with a fake home.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run apps/cli/src/config/adapters/claude-code.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/config/adapters/claude-code.ts apps/cli/src/config/adapters/claude-code.test.ts
git commit -m "feat(cli): implement Claude Code config adapter (plugin-resolved)"
```

---

## Task 9: `codex` adapter (read-only)

**Files:**
- Modify: `apps/cli/src/config/adapters/codex.ts` (replace the stub)
- Modify: `apps/cli/package.json` (add `smol-toml`)
- Create: `apps/cli/src/config/adapters/codex.test.ts`

**Interfaces:**
- Consumes: `resolvePlugin` (`@lspeasy/core`); `parse` from `smol-toml`; `PlatformAdapter`.
- Produces: `codexAdapter` (read-only). Config: `~/.codex/config.toml` → `[plugins."<id>"] enabled = <bool>`. No `write`.

- [ ] **Step 1: Add the dependency**

Run: `pnpm --filter @lsproxy/cli add smol-toml`
Verify `apps/cli/package.json` lists `smol-toml` under dependencies.

- [ ] **Step 2: Write the failing test**

Create `apps/cli/src/config/adapters/codex.test.ts`:
```ts
import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { codexAdapter } from './codex.js';

const dirs: string[] = [];
function fakeHome(): string {
  const home = mkdtempSync(join(tmpdir(), 'lspeasy-codex-'));
  dirs.push(home);
  mkdirSync(join(home, '.codex'), { recursive: true });
  writeFileSync(
    join(home, '.codex', 'config.toml'),
    [
      '[plugins."rust-analyzer@claude-code-lsps"]',
      'enabled = true',
      '',
      '[plugins."disabled@mp"]',
      'enabled = false'
    ].join('\n')
  );
  const plug = join(home, '.claude', 'plugins', 'marketplaces', 'claude-code-lsps', 'rust-analyzer');
  mkdirSync(plug, { recursive: true });
  writeFileSync(
    join(plug, '.lsp.json'),
    JSON.stringify({ rust: { command: 'rust-analyzer', extensionToLanguage: { '.rs': 'rust' } } })
  );
  return home;
}
afterEach(() => {
  while (dirs.length) rmSync(dirs.pop()!, { recursive: true, force: true });
});

describe('codexAdapter', () => {
  it('is read-only (no write)', () => {
    expect(codexAdapter.tier).toBe('read-only');
    expect(codexAdapter.write).toBeUndefined();
  });
  it('reads enabled plugin servers from config.toml', () => {
    const home = fakeHome();
    const servers = codexAdapter.read('user', home);
    expect(servers['rust']).toMatchObject({ command: 'rust-analyzer', marketplacePlugin: 'rust-analyzer@claude-code-lsps' });
    expect(Object.keys(servers)).toEqual(['rust']); // disabled@mp excluded
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/config/adapters/codex.test.ts`
Expected: FAIL — stub returns `{}`.

- [ ] **Step 4: Implement**

Replace `apps/cli/src/config/adapters/codex.ts`:
```ts
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'smol-toml';
import { resolvePlugin } from '@lspeasy/core';
import type { CanonicalServers, PlatformAdapter, Scope } from '../adapter.js';

function configPath(home: string): string {
  return join(home, '.codex', 'config.toml');
}
function pluginsRoot(home: string): string {
  return join(home, '.claude', 'plugins', 'marketplaces');
}

export const codexAdapter: PlatformAdapter = {
  id: 'codex',
  name: 'Codex',
  tier: 'read-only',
  detect: (_scope, home) => existsSync(configPath(home)),
  configPath: (_scope, home) => configPath(home),
  read: (_scope: Scope, home: string): CanonicalServers => {
    const p = configPath(home);
    if (!existsSync(p)) return {};
    let toml: { plugins?: Record<string, { enabled?: boolean }> };
    try {
      toml = parse(readFileSync(p, 'utf8')) as typeof toml;
    } catch {
      return {};
    }
    const servers: CanonicalServers = {};
    for (const [pluginId, cfg] of Object.entries(toml.plugins ?? {})) {
      if (cfg?.enabled !== true) continue;
      for (const s of resolvePlugin(pluginId, pluginsRoot(home))) {
        const lang = Object.values(s.fileExtensions)[0] ?? s.command;
        servers[lang] = s;
      }
    }
    return servers;
  }
  // read-only: no write()
};
```

- [ ] **Step 5: Run test to verify it passes**

Run: `pnpm exec vitest run apps/cli/src/config/adapters/codex.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add apps/cli/src/config/adapters/codex.ts apps/cli/src/config/adapters/codex.test.ts apps/cli/package.json pnpm-lock.yaml
git commit -m "feat(cli): implement Codex config adapter (read-only, TOML)"
```

---

## Task 10: `vscode` adapter (detected-but-unsupported)

**Files:**
- Modify: `apps/cli/src/config/adapters/vscode.ts` (replace the stub)
- Create: `apps/cli/src/config/adapters/vscode.test.ts`

**Interfaces:**
- Produces: `vscodeAdapter` (read-only). `detect` checks for the user `settings.json`; `read` returns `{}` (no portable LSP server map). No `write`.

- [ ] **Step 1: Write the failing test**

Create `apps/cli/src/config/adapters/vscode.test.ts`:
```ts
import { describe, expect, it } from 'vitest';
import { vscodeAdapter } from './vscode.js';

describe('vscodeAdapter', () => {
  it('is read-only and returns no servers (unsupported in v1)', () => {
    expect(vscodeAdapter.tier).toBe('read-only');
    expect(vscodeAdapter.write).toBeUndefined();
    expect(vscodeAdapter.read('user', '/anywhere')).toEqual({});
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/config/adapters/vscode.test.ts`
Expected: PASS already if the stub matches — if so, flesh out `detect`/`configPath` and keep the test. (If the stub lacks the exact shape, this still drives it.)

- [ ] **Step 3: Implement**

Replace `apps/cli/src/config/adapters/vscode.ts`:
```ts
import { homedir, platform } from 'node:os';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import type { CanonicalServers, PlatformAdapter, Scope } from '../adapter.js';

// VS Code has no portable LSP server map (LSP comes from per-extension config),
// so v1 detects presence but reports no servers. Revisit if a faithful source
// (e.g. a Piebald extension reusing .lsp.json) is confirmed.
function userSettingsPath(): string {
  const home = homedir();
  if (platform() === 'darwin') return join(home, 'Library', 'Application Support', 'Code', 'User', 'settings.json');
  if (platform() === 'win32') return join(home, 'AppData', 'Roaming', 'Code', 'User', 'settings.json');
  return join(home, '.config', 'Code', 'User', 'settings.json');
}

export const vscodeAdapter: PlatformAdapter = {
  id: 'vscode',
  name: 'VS Code (unsupported in v1)',
  tier: 'read-only',
  detect: () => existsSync(userSettingsPath()),
  configPath: () => userSettingsPath(),
  read: (_scope: Scope, _root: string): CanonicalServers => ({})
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run apps/cli/src/config/adapters/vscode.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/cli/src/config/adapters/vscode.ts apps/cli/src/config/adapters/vscode.test.ts
git commit -m "feat(cli): add VS Code adapter (detected-but-unsupported in v1)"
```

---

## Task 11: `config` commands (list/import/export/diff) + CLI wiring

**Files:**
- Create: `apps/cli/src/config/commands.ts`
- Create: `apps/cli/src/config/commands.test.ts`
- Modify: `apps/cli/src/cli.ts` (route a `config` subcommand)

**Interfaces:**
- Consumes: registry (`getAdapters`/`getAdapter`), adapters, `mergeServers`/`writeLspJsonFile`/`readLspJsonFile` (`@lspeasy/core`), `lspjsonAdapter`.
- Produces:
  ```ts
  interface ConfigFlags { json: boolean; root: string; scope: Scope; }
  function configList(flags: ConfigFlags): void;
  function configImport(platform: string, flags: ConfigFlags): void;  // platform → lsp.json
  function configExport(platform: string, flags: ConfigFlags): void;  // lsp.json → platform
  function configDiff(platform: string, flags: ConfigFlags): void;
  function homeForAdapter(id: string, root: string): string; // home for claude-code/codex, else root
  ```

- [ ] **Step 1: Write the failing test**

Create `apps/cli/src/config/commands.test.ts`:
```ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { configList, configImport } from './commands.js';

const dirs: string[] = [];
function root(): string {
  const d = mkdtempSync(join(tmpdir(), 'lspeasy-cmd-'));
  dirs.push(d);
  return d;
}
function captureStdout(): { out: () => string; restore: () => void } {
  const chunks: string[] = [];
  const spy = vi.spyOn(process.stdout, 'write').mockImplementation(((s: string) => {
    chunks.push(s);
    return true;
  }) as never);
  return { out: () => chunks.join(''), restore: () => spy.mockRestore() };
}
afterEach(() => {
  vi.restoreAllMocks();
  while (dirs.length) rmSync(dirs.pop()!, { recursive: true, force: true });
});

describe('config commands', () => {
  it('list --json reports every adapter with tier and detected flag', () => {
    const cap = captureStdout();
    try {
      configList({ json: true, root: root(), scope: 'project' });
    } finally {
      cap.restore();
    }
    const parsed = JSON.parse(cap.out()) as { platforms: Array<{ id: string; tier: string; detected: boolean }> };
    expect(parsed.platforms.map((p) => p.id).sort()).toEqual(['claude-code', 'codex', 'copilot', 'lspjson', 'vscode']);
  });

  it('import copilot merges the platform config into lsp.json', () => {
    const r = root();
    // seed a Copilot repo config
    const { mkdirSync } = require('node:fs') as typeof import('node:fs');
    mkdirSync(join(r, '.github'), { recursive: true });
    writeFileSync(
      join(r, '.github', 'lsp.json'),
      JSON.stringify({ lspServers: { go: { command: 'gopls', fileExtensions: { '.go': 'go' } } } })
    );
    const cap = captureStdout();
    try {
      configImport('copilot', { json: true, root: r, scope: 'project' });
    } finally {
      cap.restore();
    }
    expect(existsSync(join(r, 'lsp.json'))).toBe(true);
    const written = JSON.parse(require('node:fs').readFileSync(join(r, 'lsp.json'), 'utf8'));
    expect(written.lspServers.go.command).toBe('gopls');
    const parsed = JSON.parse(cap.out()) as { ok: boolean; added: string[] };
    expect(parsed.ok).toBe(true);
    expect(parsed.added).toContain('go');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run apps/cli/src/config/commands.test.ts`
Expected: FAIL — cannot find module `./commands.js`.

- [ ] **Step 3: Implement**

Create `apps/cli/src/config/commands.ts`:
```ts
import { homedir } from 'node:os';
import { mergeServers, readLspJsonFile, writeLspJsonFile } from '@lspeasy/core';
import { getAdapters, getAdapter } from './registry.js';
import { lspjsonAdapter } from './adapters/lspjson.js';
import type { CanonicalServers, Scope } from './adapter.js';

export interface ConfigFlags {
  json: boolean;
  root: string;
  scope: Scope;
}

// claude-code/codex read user-level config under the home dir; others use root.
export function homeForAdapter(id: string, root: string): string {
  return id === 'claude-code' || id === 'codex' ? homedir() : root;
}

function emit(flags: ConfigFlags, json: unknown, text: string): void {
  process.stdout.write(flags.json ? JSON.stringify(json) + '\n' : text);
}

export function configList(flags: ConfigFlags): void {
  const platforms = getAdapters().map((a) => {
    const base = homeForAdapter(a.id, flags.root);
    const detected = a.detect(flags.scope, base);
    const servers = detected ? Object.keys(a.read(flags.scope, base)) : [];
    return { id: a.id, name: a.name, tier: a.tier, detected, servers };
  });
  const text =
    platforms
      .map((p) => `${p.detected ? '●' : '○'} ${p.id} (${p.tier})  ${p.servers.join(' ')}`)
      .join('\n') + '\n';
  emit(flags, { platforms }, text);
}

function fail(flags: ConfigFlags, message: string): never {
  if (flags.json) process.stdout.write(JSON.stringify({ ok: false, error: message }) + '\n');
  else process.stderr.write(`error: ${message}\n`);
  process.exit(1);
}

export function configImport(platform: string, flags: ConfigFlags): void {
  const adapter = getAdapter(platform);
  if (!adapter) fail(flags, `Unknown platform "${platform}". Known: ${getAdapters().map((a) => a.id).join(', ')}`);
  const incoming = adapter.read(flags.scope, homeForAdapter(adapter.id, flags.root));
  const target = lspjsonAdapter.configPath(flags.scope, flags.root);
  const base = readLspJsonFile(target);
  const { merged, added, updated } = mergeServers(base, incoming);
  writeLspJsonFile(target, merged);
  emit(
    flags,
    { ok: true, platform, target, added, updated },
    `imported ${added.length + updated.length} server(s) from ${platform} into ${target}\n` +
      `  added: ${added.join(', ') || '(none)'}\n  updated: ${updated.join(', ') || '(none)'}\n`
  );
}

export function configExport(platform: string, flags: ConfigFlags): void {
  const adapter = getAdapter(platform);
  if (!adapter) fail(flags, `Unknown platform "${platform}". Known: ${getAdapters().map((a) => a.id).join(', ')}`);
  if (!adapter.write) fail(flags, `Platform "${platform}" is read-only and cannot be exported to.`);
  const servers: CanonicalServers = readLspJsonFile(lspjsonAdapter.configPath(flags.scope, flags.root));
  const result = adapter.write(servers, flags.scope, homeForAdapter(adapter.id, flags.root));
  emit(
    flags,
    { ok: true, platform, ...result },
    `exported ${result.written.length} server(s) to ${result.path}\n` +
      (result.skipped.length ? `  skipped: ${result.skipped.map((s) => `${s.name} (${s.reason})`).join(', ')}\n` : '')
  );
}

export function configDiff(platform: string, flags: ConfigFlags): void {
  const adapter = getAdapter(platform);
  if (!adapter) fail(flags, `Unknown platform "${platform}". Known: ${getAdapters().map((a) => a.id).join(', ')}`);
  const platformServers = adapter.read(flags.scope, homeForAdapter(adapter.id, flags.root));
  const lspServers = readLspJsonFile(lspjsonAdapter.configPath(flags.scope, flags.root));
  const onlyPlatform = Object.keys(platformServers).filter((k) => !(k in lspServers));
  const onlyLsp = Object.keys(lspServers).filter((k) => !(k in platformServers));
  const common = Object.keys(platformServers).filter((k) => k in lspServers);
  const changed = common.filter(
    (k) => JSON.stringify(platformServers[k]) !== JSON.stringify(lspServers[k])
  );
  emit(
    flags,
    { platform, onlyPlatform, onlyLsp, changed },
    `diff ${platform} vs lsp.json\n  only in ${platform}: ${onlyPlatform.join(', ') || '(none)'}\n` +
      `  only in lsp.json: ${onlyLsp.join(', ') || '(none)'}\n  changed: ${changed.join(', ') || '(none)'}\n`
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run apps/cli/src/config/commands.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Wire the `config` subcommand into `cli.ts`**

In `apps/cli/src/cli.ts`, in `main()` immediately after `const flags = buildFlags(...)` is available (and before the existing execution dispatch), intercept the `config` namespace. Add near the top of `main()` after parseArgs, before help-mode handling is fine too — place it right after `buildFlags`:
```ts
import { configList, configImport, configExport, configDiff, type ConfigFlags } from './config/commands.js';
```
And the routing block (insert after `const flags = buildFlags(values as ParsedOptionValues);`):
```ts
  if (positionals[0] === 'config') {
    const sub = positionals[1];
    const platform = positionals[2];
    const scope: ConfigFlags['scope'] = (values as Record<string, unknown>)['user'] ? 'user' : 'project';
    const cfg: ConfigFlags = { json: flags.json, root: flags.root, scope };
    if (sub === 'list') configList(cfg);
    else if (sub === 'import' && platform) configImport(platform, cfg);
    else if (sub === 'export' && platform) configExport(platform, cfg);
    else if (sub === 'diff' && platform) configDiff(platform, cfg);
    else {
      process.stderr.write('usage: lsproxy config <list|import|export|diff> [platform] [--user] [--json]\n');
      exit(1);
    }
    exit(0);
  }
```
Add `'user': { type: 'boolean' as const, default: false }` to `GLOBAL_OPTION_CONFIG` so `--user` parses.

> Note: this block must come BEFORE the `helpMode`/no-positionals branch only if `config` should not be treated as help; since `config` is a normal positional command, place it after `buildFlags` and before the file-anchor/server-discovery logic. `config` never needs a language server, so returning via `exit(0)` short-circuits the rest of `main()`.

- [ ] **Step 6: Run the full CLI suite + type-check**

Run: `pnpm exec vitest run apps/cli && pnpm run type-check`
Expected: PASS, clean.

- [ ] **Step 7: Commit**

```bash
git add apps/cli/src/config/commands.ts apps/cli/src/config/commands.test.ts apps/cli/src/cli.ts
git commit -m "feat(cli): add lsproxy config list/import/export/diff commands"
```

---

## Task 12: Changeset + full verification

**Files:**
- Create: `.changeset/lsp-config-interop.md`

- [ ] **Step 1: Write the changeset**

Create `.changeset/lsp-config-interop.md`:
```markdown
---
'@lsproxy/cli': minor
'@lspeasy/core': minor
---

Multi-platform LSP config interop. `lsproxy config import|export|diff|list`
bridges lsproxy's lsp.json with Copilot CLI, Claude Code, and Codex
(read-only); VS Code is detected-but-unsupported. A local plugin resolver in
@lspeasy/core reads installed `.lsp.json` definitions to translate plugin
toggles to/from canonical servers. Richer `.lsp.json` fields are preserved
end-to-end. `--json` emits a stable contract at every command.
```

- [ ] **Step 2: Full verification**

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
git commit -m "chore: changeset for lsp config interop"
```

---

## Self-Review Notes

- **Spec coverage:** §canonical model → Task 1; §languageId table → Task 2; §file reader/writer (no writer existed) → Task 3; §local plugin resolver (core) → Task 4; §adapter interface/registry → Task 5; §adapters (lspjson/copilot/claude-code/codex/vscode) → Tasks 6–10; §commands list/import/export/diff + `--user`/`--json` → Task 11; §surgical+backup writes → Task 8; §preserved fields → Tasks 1, 4 (carry-through), round-trip asserted in Task 4; §Codex read-only → Task 9; §VS Code detected-but-unsupported → Task 10; §testing → every task; §changeset → Task 12.
- **Placeholder scan:** the only intentional scaffolding is Task 5's adapter stubs, each replaced in its own task (6–10) with complete code — not a left-behind TODO.
- **Type consistency:** `CanonicalServers` = `Record<string, LspServerEntry>` used uniformly; `WriteResult { path, written, skipped }` consistent across adapters and commands; `resolvePlugin`/`findPluginFor`/`listInstalledPluginServers` signatures match between Task 4 and consumers (Tasks 8, 9); `readLspJsonFile`/`writeLspJsonFile`/`mergeServers` signatures match between Task 3 and Tasks 6, 7, 11.
- **Provenance for round-trip:** Task 4 stamps `marketplacePlugin`; Task 8's `findPluginFor` prefers it — so Claude-Code import→export round-trips to the same toggle.
- **Known design choice:** the `claude-code`/`codex` adapters take the home dir as their `root` arg (Task 11's `homeForAdapter` passes `homedir()`), enabling fake-home tests; other adapters use the real `root`.
