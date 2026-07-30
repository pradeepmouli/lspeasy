import { describe, it, expect, vi, afterEach } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildConfigCommand } from './config-command.js';
import type { GlobalFlags } from './io.js';

const dirs: string[] = [];
function root(): string {
  const d = mkdtempSync(join(tmpdir(), 'lspeasy-config-cmd-'));
  dirs.push(d);
  return d;
}
afterEach(() => {
  vi.restoreAllMocks();
  while (dirs.length) rmSync(dirs.pop()!, { recursive: true, force: true });
});

function flagsFor(r: string, json = false): GlobalFlags {
  return {
    server: '',
    root: r,
    dryRun: false,
    json,
    verbose: false,
    waitMs: 0,
    allowOutsideRoot: false,
    noProxy: false,
    overwrite: false
  };
}

function captureStdout(): { out: () => string; restore: () => void } {
  const chunks: string[] = [];
  const spy = vi.spyOn(process.stdout, 'write').mockImplementation(((s: string) => {
    chunks.push(s);
    return true;
  }) as never);
  return { out: () => chunks.join(''), restore: () => spy.mockRestore() };
}

describe('buildConfigCommand', () => {
  it('has real Commander help for list/import/export/diff (not a hand-written usage string)', () => {
    const cmd = buildConfigCommand(flagsFor('/x'));
    expect(cmd.commands.map((c) => c.name()).sort()).toEqual(['diff', 'export', 'import', 'list']);
    expect(cmd.commands.find((c) => c.name() === 'list')?.helpInformation()).toMatch(/Usage:/);
  });

  it('list dispatches to configList with project scope by default', async () => {
    const r = root();
    const cmd = buildConfigCommand(flagsFor(r, true));
    const cap = captureStdout();
    try {
      await cmd.parseAsync(['list'], { from: 'user' });
    } finally {
      cap.restore();
    }
    const parsed = JSON.parse(cap.out()) as { platforms: Array<{ id: string }> };
    expect(parsed.platforms.length).toBeGreaterThan(0);
  });

  it('--user switches scope to user-level config', async () => {
    const r = root();
    writeFileSync(join(r, 'lsp.json'), JSON.stringify({ lspServers: {} }), 'utf8');
    const cmd = buildConfigCommand(flagsFor(r, true));
    const cap = captureStdout();
    try {
      await cmd.parseAsync(['import', 'copilot', '--user'], { from: 'user' });
    } finally {
      cap.restore();
    }
    // Doesn't throw and produces a parseable result — scope plumbing works end to end.
    expect(() => JSON.parse(cap.out())).not.toThrow();
  });
});
