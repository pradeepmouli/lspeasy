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
  if (raw.initializationOptions !== undefined)
    entry.initializationOptions = raw.initializationOptions;
  if (raw.settings !== undefined) entry.settings = raw.settings;
  if (raw.maxRestarts !== undefined) entry.maxRestarts = raw.maxRestarts;
  return entry;
}

/**
 * Map every installed plugin's servers, keyed by "<plugin>@<marketplace>".
 * `<marketplace>` is the first path segment under the root; `<plugin>` is the
 * directory directly containing the `.lsp.json` (handles flat and nested layouts).
 * Each plugin's value is a record of server name (the outer key in `.lsp.json`) → entry.
 */
export function listInstalledPluginServers(
  pluginsRoot: string = defaultPluginsRoot()
): Record<string, Record<string, LspServerEntry>> {
  const result: Record<string, Record<string, LspServerEntry>> = {};
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
    const servers: Record<string, LspServerEntry> = {};
    for (const [name, raw0] of Object.entries(raw)) servers[name] = toCanonical(raw0, pluginId);
    result[pluginId] = servers;
  }
  return result;
}

/** Canonical servers for one "<plugin>@<marketplace>" id, keyed by server name, or {} when not installed. */
export function resolvePlugin(
  pluginId: string,
  pluginsRoot: string = defaultPluginsRoot()
): Record<string, LspServerEntry> {
  return listInstalledPluginServers(pluginsRoot)[pluginId] ?? {};
}

/** Find the plugin id a canonical entry maps to: prefer stamped provenance, else match by command. */
export function findPluginFor(
  entry: LspServerEntry,
  pluginsRoot: string = defaultPluginsRoot()
): string | undefined {
  if (entry.marketplacePlugin) return entry.marketplacePlugin;
  const all = listInstalledPluginServers(pluginsRoot);
  for (const [pluginId, servers] of Object.entries(all)) {
    if (Object.values(servers).some((s) => s.command === entry.command)) return pluginId;
  }
  return undefined;
}
