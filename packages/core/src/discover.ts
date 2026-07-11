import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

import { tokenizeCommand } from './utils/tokenize-command.js';

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

export interface LspJson {
  lspServers: Record<string, LspServerEntry>;
}

export interface ResolvedServer {
  /** Full spawn command string passed to RefactorSession as serverCommand. */
  serverCommand: string;
  /** languageId for textDocument/didOpen (e.g. 'typescript', 'rust'). */
  languageId: string;
  /** Arbitrary server-specific `initializationOptions` from the matched
   * `lsp.json` entry, merged into the real `initialize` request's
   * `initializationOptions` on top of the computed `languageId`. */
  initializationOptions?: Record<string, unknown>;
}

export interface ConfiguredServer {
  /** lsp.json server key, e.g. "typescript". */
  name: string;
  /** Full spawn command string (same quoting as ResolvedServer.serverCommand). */
  command: string;
  /** File extension (".ts") to languageId ("typescript") map for this server. */
  fileExtensions: Record<string, string>;
}

const SEARCH_PATHS = ['lsp.json', '.claude/lsp.json', '.github/lsp.json'];

function findLspJsonPath(root: string): string | null {
  let dir = root;
  while (true) {
    for (const rel of SEARCH_PATHS) {
      const full = join(dir, rel);
      if (existsSync(full)) return full;
    }
    const parent = dirname(dir);
    if (parent === dir) break; // reached filesystem root
    dir = parent;
  }
  const global = join(homedir(), '.claude', 'lsp.json');
  return existsSync(global) ? global : null;
}

/**
 * Build the full spawn command string for an `lsp.json` entry: `entry.command`
 * is itself tokenized (via {@link tokenizeCommand}) before being combined with
 * `entry.args`, so a `command` field that embeds flags (e.g.
 * `"typescript-language-server --stdio"` with no separate `args` array) still
 * splits into separate argv tokens instead of collapsing into one bogus binary
 * name once re-quoted below. The common case — a bare executable name/path
 * with no embedded spaces — tokenizes to a single token, unchanged from before.
 *
 * Caveat: because `entry.command` is tokenized on whitespace, a legitimately
 * space-containing executable path (not embedded flags) must itself be quoted
 * in `lsp.json` (e.g. `"\"/path with spaces/my-server\""`) or it will be
 * split into multiple bogus tokens — the same requirement a real shell would
 * impose.
 */
export function buildServerCommand(entry: LspServerEntry): string {
  const commandTokens = tokenizeCommand(entry.command);
  const parts = [...commandTokens, ...(entry.args ?? [])].filter(Boolean);
  // Always quote every token so backslashes and spaces are handled uniformly.
  // tokenizeCommand treats \\ inside double-quotes as a literal backslash.
  return parts.map((t) => `"${t.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(' ');
}

function loadConfig(root: string): LspJson | null {
  const lspJsonPath = findLspJsonPath(root);
  if (!lspJsonPath) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(lspJsonPath, 'utf8'));
  } catch {
    return null;
  }
  if (!parsed || typeof (parsed as Record<string, unknown>)['lspServers'] !== 'object') return null;
  return parsed as LspJson;
}

export function selectServer(config: LspJson, fileExt: string): ResolvedServer | null {
  for (const entry of Object.values(config.lspServers)) {
    if (!fileExt) {
      // No extension — return the first configured server with its first languageId.
      const languageId = Object.values(entry.fileExtensions)[0];
      if (languageId) {
        return {
          serverCommand: buildServerCommand(entry),
          languageId,
          ...(entry.initializationOptions
            ? { initializationOptions: entry.initializationOptions }
            : {})
        };
      }
    } else {
      const languageId = entry.fileExtensions[fileExt];
      if (languageId) {
        return {
          serverCommand: buildServerCommand(entry),
          languageId,
          ...(entry.initializationOptions
            ? { initializationOptions: entry.initializationOptions }
            : {})
        };
      }
    }
  }
  return null;
}

export function selectServerByLanguageId(
  config: LspJson,
  languageId: string
): ResolvedServer | null {
  for (const entry of Object.values(config.lspServers)) {
    for (const lid of Object.values(entry.fileExtensions)) {
      if (lid === languageId) {
        return {
          serverCommand: buildServerCommand(entry),
          languageId,
          ...(entry.initializationOptions
            ? { initializationOptions: entry.initializationOptions }
            : {})
        };
      }
    }
  }
  return null;
}

export function selectExtensionMap(config: LspJson): Record<string, string> {
  const map: Record<string, string> = {};
  for (const entry of Object.values(config.lspServers)) {
    for (const [ext, lid] of Object.entries(entry.fileExtensions)) {
      map[ext] = lid;
    }
  }
  return map;
}

/**
 * Resolve an LSP server for a file extension by walking up from `root` to the filesystem root then falling back to the global user config.
 *
 * @never Returns `null` silently when no `lsp.json` is found anywhere in
 *   the search path (including the global `~/.claude/lsp.json` fallback).
 *   Callers that skip the null check will silently fail to resolve a server
 *   command — for the CLI this means `lsproxy` exits before the proxy daemon
 *   is ever spawned.  Create an `lsp.json` at the workspace root or at
 *   `~/.claude/lsp.json` for a per-user fallback.
 */
export function discoverServer(root: string, fileExt: string): ResolvedServer | null {
  const config = loadConfig(root);
  if (!config) return null;
  return selectServer(config, fileExt);
}

/**
 * Resolve an LSP server for a language ID by walking up from `root` to the filesystem root then falling back to the global user config.
 *
 * @never Returns `null` silently when no matching entry is found.  The
 *   proxy daemon's `BackendPool` calls this function on every new language
 *   connection — if `lsp.json` is absent or omits the requested language, the
 *   daemon starts successfully but throws `"No LSP server configured for
 *   languageId"` the moment a client request arrives.  An `lsp.json` must be
 *   present in the workspace (or at `~/.claude/lsp.json`) before the proxy
 *   server can serve any language.
 */
export function discoverServerByLanguageId(
  root: string,
  languageId: string
): ResolvedServer | null {
  const config = loadConfig(root);
  if (!config) return null;
  return selectServerByLanguageId(config, languageId);
}

export function discoverExtensionMap(root: string): Record<string, string> {
  const config = loadConfig(root);
  if (!config) return {};
  return selectExtensionMap(config);
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
export function writeLspJsonFile(path: string, servers: Record<string, LspServerEntry>): void {
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
