import { homedir } from 'node:os';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { readLspJsonFile, writeLspJsonFile } from '@lspeasy/core';
import type { CanonicalServers, PlatformAdapter, Scope, WriteResult } from '../adapter.js';

function pathFor(scope: Scope, root: string): string {
  return scope === 'user' ? join(homedir(), '.claude', 'lsp.json') : join(root, 'lsp.json');
}

export const lspjsonAdapter: PlatformAdapter = {
  id: 'lspjson',
  name: 'lsp.json',
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
