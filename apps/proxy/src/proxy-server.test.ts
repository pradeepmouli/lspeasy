import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ProxyServer } from './proxy-server.js';

const roots: string[] = [];
function tmpRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'lspeasy-proxy-'));
  roots.push(dir);
  writeFileSync(
    join(dir, 'lsp.json'),
    JSON.stringify({
      lspServers: { typescript: { command: 'tsls', fileExtensions: { '.ts': 'typescript' } } }
    }),
    'utf8'
  );
  return dir;
}

afterEach(() => {
  while (roots.length) rmSync(roots.pop()!, { recursive: true, force: true });
});

describe('ProxyServer.getStatus', () => {
  it('reports daemon facts and configured languages as cold before any backend starts', () => {
    const root = tmpRoot();
    const server = new ProxyServer({ root, socketOverride: join(root, 'x.sock') });
    const status = server.getStatus();
    expect(status.daemon).toMatchObject({ pid: process.pid, root, sessions: 0, backends: 0 });
    expect(typeof status.daemon!.uptimeMs).toBe('number');
    expect(status.languages).toEqual([
      expect.objectContaining({ languageId: 'typescript', status: 'cold', command: '"tsls"' })
    ]);
  });
});
