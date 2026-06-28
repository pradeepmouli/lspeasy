import type { PlatformAdapter } from '../adapter.js';

export const lspjsonAdapter: PlatformAdapter = {
  id: 'lspjson',
  name: 'lsp.json',
  tier: 'full',
  detect: () => false,
  configPath: () => '',
  read: () => ({})
};
