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
      Object.assign(servers, resolvePlugin(pluginId, pluginsRoot(home)));
    }
    return servers;
  }
  // read-only: no write()
};
