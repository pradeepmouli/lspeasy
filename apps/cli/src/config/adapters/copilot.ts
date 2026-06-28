import { homedir } from 'node:os';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { readLspJsonFile, writeLspJsonFile } from '@lspeasy/core';
import type { CanonicalServers, PlatformAdapter, Scope, WriteResult } from '../adapter.js';

// Copilot CLI uses the SAME { lspServers } schema as lsp.json. User-level lives
// at ~/.copilot/lsp-config.json; repo-level is .github/lsp.json (its canonical
// repo location, distinct from lspeasy's primary lsp.json).
function pathFor(scope: Scope, root: string): string {
  return scope === 'user'
    ? join(homedir(), '.copilot', 'lsp-config.json')
    : join(root, '.github', 'lsp.json');
}

export const copilotAdapter: PlatformAdapter = {
  id: 'copilot',
  name: 'Copilot CLI',
  tier: 'full',
  detect: (scope, root) => existsSync(pathFor(scope, root)),
  configPath: (scope, root) => pathFor(scope, root),
  read: (scope, root) => readLspJsonFile(pathFor(scope, root)),
  write: (servers: CanonicalServers, scope, root): WriteResult => {
    const path = pathFor(scope, root);
    writeLspJsonFile(path, servers);
    return { path, written: Object.keys(servers), skipped: [] };
  }
};
