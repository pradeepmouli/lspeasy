import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { buildFlags, runHelp } from './cli.js';
import type { GlobalFlags } from './io.js';

function withFailStubbed(body: () => void): string[] {
  const errs: string[] = [];
  vi.spyOn(process, 'exit').mockImplementation(((): never => {
    throw new Error('exit');
  }) as never);
  vi.spyOn(process.stderr, 'write').mockImplementation(((s: string) => {
    errs.push(s);
    return true;
  }) as never);
  body();
  return errs;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('buildFlags', () => {
  it('defaults --wait to 15000 and applies the documented defaults', () => {
    const flags = buildFlags({ root: '/repo' });
    expect(flags.waitMs).toBe(15000);
    expect(flags.dryRun).toBe(false);
    expect(flags.overwrite).toBe(false);
    expect(flags.allowOutsideRoot).toBe(false);
    expect(flags.server).toBe('');
  });

  it('parses a numeric --wait', () => {
    expect(buildFlags({ root: '/repo', wait: '2000' }).waitMs).toBe(2000);
    expect(buildFlags({ root: '/repo', wait: '0' }).waitMs).toBe(0);
  });

  it('rejects a non-numeric --wait (NaN would silently become 0ms)', () => {
    const errs = withFailStubbed(() => {
      expect(() => buildFlags({ root: '/repo', wait: 'abc' })).toThrow('exit');
    });
    expect(errs.join('')).toMatch(/--wait must be a non-negative number/);
  });

  it('rejects a negative --wait', () => {
    const errs = withFailStubbed(() => {
      expect(() => buildFlags({ root: '/repo', wait: '-5' })).toThrow('exit');
    });
    expect(errs.join('')).toMatch(/--wait must be a non-negative number/);
  });

  it('accepts --dry-run (dryRun true)', () => {
    expect(buildFlags({ root: '/repo', 'dry-run': true }).dryRun).toBe(true);
  });

  it('passes through --server override', () => {
    expect(buildFlags({ root: '/repo', server: 'rust-analyzer' }).server).toBe('rust-analyzer');
  });
});

function tmpRootWithConfig(): string {
  const dir = mkdtempSync(join(tmpdir(), 'lspeasy-help-'));
  writeFileSync(
    join(dir, 'lsp.json'),
    JSON.stringify({
      lspServers: { typescript: { command: 'tsls', fileExtensions: { '.ts': 'typescript' } } }
    }),
    'utf8'
  );
  return dir;
}

function baseFlags(root: string, json: boolean): GlobalFlags {
  return {
    server: '',
    root,
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

describe('runHelp (daemon down)', () => {
  it('lists configured languages with the drill-down hint and no ANSI', async () => {
    const root = tmpRootWithConfig();
    const cap = captureStdout();
    try {
      await runHelp([], baseFlags(root, false));
    } finally {
      cap.restore();
    }
    const text = cap.out();
    expect(text).toContain('typescript');
    expect(text).toMatch(/lsproxy --help <language>/);
    expect(text).not.toContain('\x1b');
  });

  it('--json emits a parseable status object with a languages array and no ANSI', async () => {
    const root = tmpRootWithConfig();
    const cap = captureStdout();
    try {
      await runHelp([], baseFlags(root, true));
    } finally {
      cap.restore();
    }
    const text = cap.out();
    expect(text).not.toContain('\x1b');
    const parsed = JSON.parse(text) as {
      daemon: unknown;
      languages: Array<{ languageId: string }>;
    };
    expect(parsed.daemon).toBeNull();
    expect(parsed.languages.map((l) => l.languageId)).toContain('typescript');
  });

  it('errors for an unconfigured language', () => {
    const root = tmpRootWithConfig();
    const errs: string[] = [];
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((): never => {
      throw new Error('exit');
    }) as never);
    const errSpy = vi.spyOn(process.stderr, 'write').mockImplementation(((s: string) => {
      errs.push(s);
      return true;
    }) as never);
    try {
      // python is not configured -> fail() throws via the stubbed exit
      expect(runHelp(['python'], baseFlags(root, false))).rejects.toThrow('exit');
    } finally {
      exitSpy.mockRestore();
      errSpy.mockRestore();
    }
  });
});
