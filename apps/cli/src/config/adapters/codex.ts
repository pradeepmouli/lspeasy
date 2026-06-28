import type { PlatformAdapter } from '../adapter.js';

export const codexAdapter: PlatformAdapter = {
  id: 'codex',
  name: 'Codex',
  tier: 'read-only',
  detect: () => false,
  configPath: () => '',
  read: () => ({})
};
