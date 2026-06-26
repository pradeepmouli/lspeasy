import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';

export interface LspServerEntry {
  command: string;
  args?: string[];
  fileExtensions: Record<string, string>;
}

export interface LspJson {
  lspServers: Record<string, LspServerEntry>;
}

export interface ResolvedServer {
  /** Full spawn command string passed to RefactorSession as serverCommand. */
  serverCommand: string;
  /** languageId for textDocument/didOpen (e.g. 'typescript', 'rust'). */
  languageId: string;
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

function buildServerCommand(entry: LspServerEntry): string {
  const parts = [entry.command, ...(entry.args ?? [])].filter(Boolean);
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
      if (languageId) return { serverCommand: buildServerCommand(entry), languageId };
    } else {
      const languageId = entry.fileExtensions[fileExt];
      if (languageId) return { serverCommand: buildServerCommand(entry), languageId };
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
      if (lid === languageId) return { serverCommand: buildServerCommand(entry), languageId };
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
 * Walk the directory tree from `root` to the filesystem root, checking
 * `lsp.json`, `.claude/lsp.json`, and `.github/lsp.json` at each level, then
 * fall back to `~/.claude/lsp.json`.  Returns the first entry whose
 * `fileExtensions` map contains `fileExt` (or the first entry overall when
 * `fileExt` is empty).
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
 * Walk the directory tree from `root` looking for a `lsp.json` entry whose
 * `fileExtensions` map maps any extension to `languageId`.
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
