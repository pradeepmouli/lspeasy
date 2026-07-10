/**
 * Unified server resolution: lsp.json first (project + global, via @lspeasy/core),
 * then a fallback to detected config platforms (claude-code plugins, codex, …)
 * via the same adapters `config list` uses. This lets `lsproxy --help <lang>` and
 * `lsproxy <lang> <cmd>` serve a language that's only configured in a platform's
 * config (e.g. rust from a Claude Code plugin) without first running
 * `config import`.
 */
import { extname } from 'node:path';

import {
  discoverServer,
  discoverServerByLanguageId,
  discoverServers,
  type ConfiguredServer,
  type LspServerEntry,
  type ResolvedServer
} from '@lspeasy/core';

import { getAdapters } from './config/registry.js';
import { homeForAdapter } from './config/commands.js';
import type { Scope } from './config/adapter.js';

// Mirror @lspeasy/core's (unexported) buildServerCommand: quote every token so
// spaces/backslashes survive tokenizeCommand uniformly.
function buildCommand(entry: LspServerEntry): string {
  const parts = [entry.command, ...(entry.args ?? [])].filter(Boolean);
  return parts.map((t) => `"${t.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`).join(' ');
}

export interface SourcedServer extends ConfiguredServer {
  /** Adapter id this server config came from: 'lsp.json' or a platform
   * adapter id (e.g. 'claude-code', 'codex', 'copilot', 'vscode'). */
  source: string;
}

// Configured servers from detected config platforms, excluding `lspjson`
// (already covered by core lsp.json discovery). Platforms (claude-code/codex)
// are user-scoped.
function platformServers(root: string, scope: Scope): SourcedServer[] {
  const out: SourcedServer[] = [];
  for (const adapter of getAdapters()) {
    if (adapter.id === 'lspjson') continue;
    const base = homeForAdapter(adapter.id, root);
    if (!adapter.detect(scope, base)) continue;
    let servers: Record<string, LspServerEntry>;
    try {
      servers = adapter.read(scope, base);
    } catch {
      continue;
    }
    for (const [name, entry] of Object.entries(servers)) {
      if (!entry.command) continue;
      out.push({
        name,
        command: buildCommand(entry),
        fileExtensions: entry.fileExtensions ?? {},
        source: adapter.id
      });
    }
  }
  return out;
}

/**
 * A resolution plus its provenance. `fromPlatform: true` means the server was
 * found only in a config platform (claude-code/codex), NOT lsp.json — so the
 * proxy daemon (which discovers via lsp.json only) can't spawn it; callers must
 * use a direct session with `serverCommand` rather than routing through the daemon.
 */
export type Resolution = ResolvedServer & { fromPlatform: boolean };

/** Resolve a server for a languageId: lsp.json → detected platforms. */
export function resolveByLanguageId(
  root: string,
  languageId: string,
  scope: Scope = 'user'
): Resolution | null {
  const core = discoverServerByLanguageId(root, languageId);
  if (core) return { ...core, fromPlatform: false };
  for (const s of platformServers(root, scope)) {
    if (Object.values(s.fileExtensions).includes(languageId)) {
      return { serverCommand: s.command, languageId, fromPlatform: true };
    }
  }
  return null;
}

/** Resolve a server for a file extension (".rs"): lsp.json → detected platforms. */
export function resolveByExtension(
  root: string,
  ext: string,
  scope: Scope = 'user'
): Resolution | null {
  const core = discoverServer(root, ext);
  if (core) return { ...core, fromPlatform: false };
  if (ext === '') return null;
  for (const s of platformServers(root, scope)) {
    const languageId = s.fileExtensions[ext];
    if (languageId) return { serverCommand: s.command, languageId, fromPlatform: true };
  }
  return null;
}

/**
 * Every configured server across lsp.json + detected platforms, tagged with
 * which config produced it. Used by `lsproxy status` (§7 of the design doc)
 * to show a server's provenance. lsp.json wins on language collisions, same
 * dedup rule as `allConfiguredServers`.
 */
export function allConfiguredServersWithSource(
  root: string,
  scope: Scope = 'user'
): SourcedServer[] {
  const core = discoverServers(root).map((s) => ({ ...s, source: 'lsp.json' }));
  const coreLangs = new Set(core.flatMap((s) => Object.values(s.fileExtensions)));
  const extra: SourcedServer[] = [];
  for (const s of platformServers(root, scope)) {
    // Drop only the extensions whose languageId collides with lsp.json — a
    // multi-language platform server keeps its non-colliding entries.
    const fileExtensions = Object.fromEntries(
      Object.entries(s.fileExtensions).filter(([, lang]) => !coreLangs.has(lang))
    );
    if (Object.keys(fileExtensions).length > 0) extra.push({ ...s, fileExtensions });
  }
  return [...core, ...extra];
}

/**
 * Every configured server across lsp.json + detected platforms, for the bare
 * `lsproxy` discovery view and accurate "available languages" errors. lsp.json
 * wins on language collisions (platform duplicates are dropped).
 */
export function allConfiguredServers(root: string, scope: Scope = 'user'): ConfiguredServer[] {
  return allConfiguredServersWithSource(root, scope);
}

export interface EntryResolution {
  serverCommand: string;
  languageId: string;
  fromPlatform: boolean;
  /** Set only when the token was a file path — it doubles as the request's
   * implicit target file, so callers don't need to repeat it. */
  anchorFile?: string;
}

/**
 * Resolve the CLI's first positional: either a configured language id, or a
 * file path whose extension resolves the language (and which becomes the
 * implicit anchor file for the request). `serverOverride` (`--server`)
 * bypasses discovery entirely, but the token still supplies a languageId
 * label and, when it looks like a file, an anchor.
 */
export function resolveEntry(
  token: string,
  root: string,
  serverOverride: string,
  scope: Scope = 'user'
): EntryResolution | null {
  const ext = extname(token);

  if (serverOverride) {
    const discovered = ext ? resolveByExtension(root, ext, scope) : null;
    return {
      serverCommand: serverOverride,
      languageId: discovered?.languageId ?? token,
      fromPlatform: false,
      ...(ext ? { anchorFile: token } : {})
    };
  }

  const knownLanguages = new Set(
    allConfiguredServers(root, scope).flatMap((s) => Object.values(s.fileExtensions))
  );
  if (knownLanguages.has(token)) {
    const resolution = resolveByLanguageId(root, token, scope);
    return resolution ? { ...resolution } : null;
  }

  if (!ext) return null;
  const resolution = resolveByExtension(root, ext, scope);
  return resolution ? { ...resolution, anchorFile: token } : null;
}
