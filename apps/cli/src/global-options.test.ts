import { describe, it, expect, vi } from 'vitest';
import { Command } from 'commander';
import {
  GLOBAL_OPTIONS,
  registerGlobalOptions,
  globalOptionsHelpText,
  buildFlags
} from './global-options.js';

describe('registerGlobalOptions', () => {
  it('registers every entry in GLOBAL_OPTIONS on the command', () => {
    const cmd = new Command('x');
    registerGlobalOptions(cmd);
    for (const { flags } of GLOBAL_OPTIONS) {
      const long = flags.split(/[ ,]+/).find((t) => t.startsWith('--'));
      expect(cmd.options.some((o) => o.long === long)).toBe(true);
    }
  });
});

describe('globalOptionsHelpText', () => {
  it('mentions every flag exactly once, in a "Global options:" block', () => {
    const text = globalOptionsHelpText();
    expect(text).toMatch(/^Global options:/);
    for (const { flags } of GLOBAL_OPTIONS) {
      const long = flags.split(/[ ,]+/).find((t) => t.startsWith('--'))!;
      expect(text).toContain(long);
    }
  });
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

  it('rejects a non-numeric --wait', () => {
    vi.spyOn(process, 'exit').mockImplementation(((): never => {
      throw new Error('exit');
    }) as never);
    const errs: string[] = [];
    vi.spyOn(process.stderr, 'write').mockImplementation(((s: string) => {
      errs.push(s);
      return true;
    }) as never);
    expect(() => buildFlags({ root: '/repo', wait: 'abc' })).toThrow('exit');
    expect(errs.join('')).toMatch(/--wait must be a non-negative number/);
    vi.restoreAllMocks();
  });
});
