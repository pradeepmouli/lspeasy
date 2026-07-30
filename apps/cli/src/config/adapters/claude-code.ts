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
  try {
    return JSON.parse(readFileSync(p, 'utf8')) as Settings;
  } catch {
    return {};
  }
}

export const claudeCodeAdapter: PlatformAdapter = {
  id: 'claude-code',
  name: 'Claude Code',
  tier: 'plugin-resolved',
  detect: (_scope, home) => existsSync(settingsPath(home)),
  configPath: (_scope, home) => settingsPath(home),
  read: (_scope: Scope, home: string): CanonicalServers => {
    const enabled = readSettings(home).enabledPlugins ?? {};
    const servers: CanonicalServers = {};
    for (const [pluginId, on] of Object.entries(enabled)) {
      if (!on) continue;
      Object.assign(servers, resolvePlugin(pluginId, pluginsRoot(home)));
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
      try {
        copyFileSync(p, p + '.bak');
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
      }
      settings.enabledPlugins = enabled;
      writeFileSync(p, JSON.stringify(settings, null, 2) + '\n', 'utf8');
    }
    return { path: p, written, skipped };
  }
};
