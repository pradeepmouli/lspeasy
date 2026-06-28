import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { configList, configImport } from './commands.js';

const dirs: string[] = [];
function root(): string {
  const d = mkdtempSync(join(tmpdir(), 'lspeasy-cmd-'));
  dirs.push(d);
  return d;
}
function captureStdout(): { out: () => string; restore: () => void } {
  const chunks: string[] = [];
  const spy = vi.spyOn(process.stdout, 'write').mockImplementation(((s: string) => {
    chunks.push(s);
    return true;
  }) as never);
  return { out: () => chunks.join(''), restore: () => spy.mockRestore() };
}
afterEach(() => {
  vi.restoreAllMocks();
  while (dirs.length) rmSync(dirs.pop()!, { recursive: true, force: true });
});

describe('config commands', () => {
  it('list --json reports every adapter with tier and detected flag', () => {
    const cap = captureStdout();
    try {
      configList({ json: true, root: root(), scope: 'project' });
    } finally {
      cap.restore();
    }
    const parsed = JSON.parse(cap.out()) as {
      platforms: Array<{ id: string; tier: string; detected: boolean }>;
    };
    expect(parsed.platforms.map((p) => p.id).sort()).toEqual([
      'claude-code',
      'codex',
      'copilot',
      'lspjson',
      'vscode'
    ]);
  });

  it('import copilot merges the platform config into lsp.json', () => {
    const r = root();
    // seed a Copilot repo config
    mkdirSync(join(r, '.github'), { recursive: true });
    writeFileSync(
      join(r, '.github', 'lsp.json'),
      JSON.stringify({ lspServers: { go: { command: 'gopls', fileExtensions: { '.go': 'go' } } } })
    );
    const cap = captureStdout();
    try {
      configImport('copilot', { json: true, root: r, scope: 'project' });
    } finally {
      cap.restore();
    }
    expect(existsSync(join(r, 'lsp.json'))).toBe(true);
    const written = JSON.parse(readFileSync(join(r, 'lsp.json'), 'utf8'));
    expect(written.lspServers.go.command).toBe('gopls');
    const parsed = JSON.parse(cap.out()) as { ok: boolean; added: string[] };
    expect(parsed.ok).toBe(true);
    expect(parsed.added).toContain('go');
  });
});
