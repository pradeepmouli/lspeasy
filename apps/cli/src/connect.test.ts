import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fetchDaemonStatus } from './connect.js';
import { ProxyServer } from '../../proxy/src/proxy-server.js';

describe('fetchDaemonStatus', () => {
  it('returns null when no daemon socket is live', async () => {
    const root = mkdtempSync(join(tmpdir(), 'lspeasy-nostatus-'));
    expect(await fetchDaemonStatus(root)).toBeNull();
  });

  it('returns a status report with daemon info when a ProxyServer is running', async () => {
    const root = mkdtempSync(join(tmpdir(), 'lspeasy-livestatus-'));
    writeFileSync(
      join(root, 'lsp.json'),
      JSON.stringify({
        lspServers: {
          typescript: { command: 'tsls', fileExtensions: { '.ts': 'typescript' } }
        }
      }),
      'utf8'
    );
    // Construct without socketOverride so the daemon listens on socketPath(root),
    // the same path that fetchDaemonStatus uses to find it.
    const server = new ProxyServer({ root });
    try {
      await server.start();
      const report = await fetchDaemonStatus(root);
      expect(report).not.toBeNull();
      expect(report!.daemon).not.toBeNull();
      expect(report!.languages.map((l) => l.languageId)).toContain('typescript');
    } finally {
      await server.stop();
      rmSync(root, { recursive: true, force: true });
    }
  });
});
