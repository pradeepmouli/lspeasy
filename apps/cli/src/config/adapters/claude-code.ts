import type { PlatformAdapter } from '../adapter.js';

export const claudeCodeAdapter: PlatformAdapter = {
  id: 'claude-code',
  name: 'Claude Code',
  tier: 'full',
  detect: () => false,
  configPath: () => '',
  read: () => ({})
};
