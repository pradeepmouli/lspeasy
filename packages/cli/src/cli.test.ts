/**
 * Tests for `buildFlags` — the flag validation/precedence layer. Covers the
 * two silent footguns the CLI previously shipped: `--apply` + `--dry-run`
 * together (one silently winning) and an unvalidated `--wait` (NaN → 0ms).
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildFlags } from './cli.js';

/** Run a body with process.exit + stderr stubbed; `fail()` throws 'exit'. */
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
    expect(flags.server).toBe('typescript-language-server --stdio');
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

  it('errors when --apply and --dry-run are both set', () => {
    const errs = withFailStubbed(() => {
      expect(() => buildFlags({ root: '/repo', apply: true, 'dry-run': true })).toThrow('exit');
    });
    expect(errs.join('')).toMatch(/--apply and --dry-run are mutually exclusive/);
  });

  it('accepts --apply alone (dryRun stays false)', () => {
    expect(buildFlags({ root: '/repo', apply: true }).dryRun).toBe(false);
  });

  it('accepts --dry-run alone (dryRun true)', () => {
    expect(buildFlags({ root: '/repo', 'dry-run': true }).dryRun).toBe(true);
  });

  it('threads --overwrite onto the flags', () => {
    expect(buildFlags({ root: '/repo', overwrite: true }).overwrite).toBe(true);
  });
});
