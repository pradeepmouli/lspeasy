/**
 * Unified server resolution: lsp.json first (project + global, via @lspeasy/core),
 * then a fallback to detected config platforms (claude-code plugins, codex, …)
 * via the same adapters `config list` uses. This lets `lsproxy --help <lang>` and
 * `lsproxy <lang> <cmd>` serve a language that's only configured in a platform's
 * config (e.g. rust from a Claude Code plugin) without first running
 * `config import`.
 */
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

// Configured servers from detected config platforms, excluding `lspjson`
// (already covered by core lsp.json discovery). Platforms (claude-code/codex)
// are user-scoped.
function platformServers(root: string, scope: Scope): ConfiguredServer[] {
  const out: ConfiguredServer[] = [];
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
      out.push({ name, command: buildCommand(entry), fileExtensions: entry.fileExtensions ?? {} });
    }
  }
  return out;
}

/** Resolve a server for a languageId: lsp.json → detected platforms. */
export function resolveByLanguageId(
  root: string,
  languageId: string,
  scope: Scope = 'user'
): ResolvedServer | null {
  const core = discoverServerByLanguageId(root, languageId);
  if (core) return core;
  for (const s of platformServers(root, scope)) {
    if (Object.values(s.fileExtensions).includes(languageId)) {
      return { serverCommand: s.command, languageId };
    }
  }
  return null;
}

/** Resolve a server for a file extension (".rs"): lsp.json → detected platforms. */
export function resolveByExtension(
  root: string,
  ext: string,
  scope: Scope = 'user'
): ResolvedServer | null {
  const core = discoverServer(root, ext);
  if (core) return core;
  if (ext === '') return null;
  for (const s of platformServers(root, scope)) {
    const languageId = s.fileExtensions[ext];
    if (languageId) return { serverCommand: s.command, languageId };
  }
  return null;
}

/**
 * Every configured server across lsp.json + detected platforms, for the bare
 * `lsproxy` discovery view and accurate "available languages" errors. lsp.json
 * wins on language collisions (platform duplicates are dropped).
 */
export function allConfiguredServers(root: string, scope: Scope = 'user'): ConfiguredServer[] {
  const core = discoverServers(root);
  const coreLangs = new Set(core.flatMap((s) => Object.values(s.fileExtensions)));
  const extra = platformServers(root, scope).filter(
    (s) => !Object.values(s.fileExtensions).some((l) => coreLangs.has(l))
  );
  return [...core, ...extra];
}
