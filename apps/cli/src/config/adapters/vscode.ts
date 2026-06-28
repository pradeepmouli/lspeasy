import { homedir, platform } from 'node:os';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import type { CanonicalServers, PlatformAdapter, Scope } from '../adapter.js';

// VS Code has no portable LSP server map (LSP comes from per-extension config),
// so v1 detects presence but reports no servers. Revisit if a faithful source
// (e.g. a Piebald extension reusing .lsp.json) is confirmed.
function userSettingsPath(): string {
  const home = homedir();
  if (platform() === 'darwin')
    return join(home, 'Library', 'Application Support', 'Code', 'User', 'settings.json');
  if (platform() === 'win32')
    return join(home, 'AppData', 'Roaming', 'Code', 'User', 'settings.json');
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
