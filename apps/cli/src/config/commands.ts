import { homedir } from 'node:os';
import { mergeServers, readLspJsonFile, writeLspJsonFile } from '@lspeasy/core';
import { getAdapters, getAdapter } from './registry.js';
import { lspjsonAdapter } from './adapters/lspjson.js';
import type { CanonicalServers, PlatformAdapter, Scope } from './adapter.js';
import { createFormatter, SYMBOLS, type Formatter } from '../format.js';

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

interface PlatformInfo {
  id: string;
  name: string;
  tier: string;
  detected: boolean;
  servers: string[];
}

function renderListText(platforms: PlatformInfo[], fmt: Formatter): string {
  return (
    platforms
      .map(
        // Match the discovery view: emoji marker (self-colored), cyan id, dim
        // metadata. detected -> 🟢, not -> ⚪.
        (p) =>
          `${p.detected ? SYMBOLS.running : SYMBOLS.cold} ${fmt.cyan(p.id)} ${fmt.dim(`(${p.tier})`)}  ${fmt.dim(p.servers.join(' '))}`
      )
      .join('\n') + '\n'
  );
}

export function configList(flags: ConfigFlags, fmt?: Formatter): void {
  const platforms = getAdapters().map((a) => {
    const base = homeForAdapter(a.id, flags.root);
    const detected = a.detect(flags.scope, base);
    const servers = detected ? Object.keys(a.read(flags.scope, base)) : [];
    return { id: a.id, name: a.name, tier: a.tier, detected, servers };
  });
  const text = renderListText(platforms, fmt ?? createFormatter(false));
  emit(flags, { platforms }, text);
}

function fail(flags: ConfigFlags, message: string): never {
  if (flags.json) process.stdout.write(JSON.stringify({ ok: false, error: message }) + '\n');
  else process.stderr.write(`error: ${message}\n`);
  process.exit(1);
}

function requireAdapter(platform: string, flags: ConfigFlags): PlatformAdapter {
  const adapter = getAdapter(platform);
  if (!adapter) {
    fail(
      flags,
      `Unknown platform "${platform}". Known: ${getAdapters()
        .map((a) => a.id)
        .join(', ')}`
    );
  }
  return adapter;
}

export function configImport(platform: string, flags: ConfigFlags, fmt?: Formatter): void {
  const f = fmt ?? createFormatter(false);
  const adapter = requireAdapter(platform, flags);
  const incoming = adapter.read(flags.scope, homeForAdapter(adapter.id, flags.root));
  const target = lspjsonAdapter.configPath(flags.scope, flags.root);
  const base = readLspJsonFile(target);
  const { merged, added, updated } = mergeServers(base, incoming);
  writeLspJsonFile(target, merged);
  emit(
    flags,
    { ok: true, platform, target, added, updated },
    `imported ${f.green(String(added.length + updated.length))} server(s) from ${f.yellow(platform)} into ${f.dim(target)}\n` +
      `  ${f.dim('added:')} ${added.map((n) => f.green(n)).join(', ') || f.dim('(none)')}\n` +
      `  ${f.dim('updated:')} ${updated.map((n) => f.yellow(n)).join(', ') || f.dim('(none)')}\n`
  );
}

export function configExport(platform: string, flags: ConfigFlags, fmt?: Formatter): void {
  const f = fmt ?? createFormatter(false);
  const adapter = requireAdapter(platform, flags);
  if (!adapter.write) fail(flags, `Platform "${platform}" is read-only and cannot be exported to.`);
  const servers: CanonicalServers = readLspJsonFile(
    lspjsonAdapter.configPath(flags.scope, flags.root)
  );
  const result = adapter.write(servers, flags.scope, homeForAdapter(adapter.id, flags.root));
  emit(
    flags,
    { ok: true, platform, ...result },
    `exported ${f.green(String(result.written.length))} server(s) to ${f.green(result.path)}\n` +
      (result.skipped.length
        ? `  ${f.dim('skipped:')} ${result.skipped.map((s) => `${f.yellow(s.name)} ${f.dim(`(${s.reason})`)}`).join(', ')}\n`
        : '')
  );
}

export function configDiff(platform: string, flags: ConfigFlags, fmt?: Formatter): void {
  const f = fmt ?? createFormatter(false);
  const adapter = requireAdapter(platform, flags);
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
    { ok: true, platform, onlyPlatform, onlyLsp, changed },
    `${f.dim('diff')} ${f.yellow(platform)} ${f.dim('vs lsp.json')}\n` +
      `  ${f.dim(`only in ${platform}:`)} ${onlyPlatform.map((k) => f.green(k)).join(', ') || f.dim('(none)')}\n` +
      `  ${f.dim('only in lsp.json:')} ${onlyLsp.join(', ') || f.dim('(none)')}\n` +
      `  ${f.dim('changed:')} ${changed.map((k) => f.yellow(k)).join(', ') || f.dim('(none)')}\n`
  );
}
