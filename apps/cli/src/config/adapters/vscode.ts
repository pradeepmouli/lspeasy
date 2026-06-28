import type { PlatformAdapter } from '../adapter.js';

export const vscodeAdapter: PlatformAdapter = {
  id: 'vscode',
  name: 'VS Code',
  tier: 'read-only',
  detect: () => false,
  configPath: () => '',
  read: () => ({})
};
