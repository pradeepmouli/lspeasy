import type { PlatformAdapter } from '../adapter.js';

export const copilotAdapter: PlatformAdapter = {
  id: 'copilot',
  name: 'GitHub Copilot',
  tier: 'full',
  detect: () => false,
  configPath: () => '',
  read: () => ({})
};
