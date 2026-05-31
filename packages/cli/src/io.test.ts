/**
 * Tests for resolvePathArg — the BUG 4 fix. Path-arg resolution must use --root
 * as the base (not process.cwd), and out-of-root targets must be refused.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { sep } from 'node:path';

import { resolvePathArg, summarizeChanges } from './io.js';
import type { AppliedChange } from './apply.js';

const flags = (root: string, allowOutsideRoot = false) => ({ root, json: false, allowOutsideRoot });

afterEach(() => {
  vi.restoreAllMocks();
});

describe('resolvePathArg', () => {
  it('resolves a relative arg against --root, NOT process.cwd', () => {
    // Run "from" an unrelated cwd to prove cwd is irrelevant.
    vi.spyOn(process, 'cwd').mockReturnValue(`${sep}some${sep}other${sep}dir`);
    const out = resolvePathArg('src/foo.ts', flags(`${sep}repoB`));
    expect(out).toBe(`${sep}repoB${sep}src${sep}foo.ts`);
  });

  it('keeps an absolute arg inside root as-is', () => {
    const out = resolvePathArg(`${sep}repoB${sep}src${sep}foo.ts`, flags(`${sep}repoB`));
    expect(out).toBe(`${sep}repoB${sep}src${sep}foo.ts`);
  });

  it('allows the root itself', () => {
    const out = resolvePathArg(`${sep}repoB`, flags(`${sep}repoB`));
    expect(out).toBe(`${sep}repoB`);
  });

  it('refuses an absolute arg outside --root (exits non-zero)', () => {
    const exit = vi.spyOn(process, 'exit').mockImplementation(((): never => {
      throw new Error('exit');
    }) as never);
    const errs: string[] = [];
    vi.spyOn(process.stderr, 'write').mockImplementation(((s: string) => {
      errs.push(s);
      return true;
    }) as never);

    expect(() => resolvePathArg(`${sep}repoA${sep}foo.ts`, flags(`${sep}repoB`))).toThrow('exit');
    expect(exit).toHaveBeenCalledWith(1);
    expect(errs.join('')).toMatch(/outside --root/);
  });

  it('refuses a sibling dir that shares a name prefix with root', () => {
    const exit = vi.spyOn(process, 'exit').mockImplementation(((): never => {
      throw new Error('exit');
    }) as never);
    vi.spyOn(process.stderr, 'write').mockImplementation((() => true) as never);
    // /repoB-evil must NOT be treated as inside /repoB
    expect(() => resolvePathArg(`${sep}repoB-evil${sep}foo.ts`, flags(`${sep}repoB`))).toThrow(
      'exit'
    );
    expect(exit).toHaveBeenCalledWith(1);
  });

  it('permits an out-of-root arg when allowOutsideRoot is set', () => {
    const out = resolvePathArg(`${sep}repoA${sep}foo.ts`, flags(`${sep}repoB`, true));
    expect(out).toBe(`${sep}repoA${sep}foo.ts`);
  });
});

describe('summarizeChanges', () => {
  it('strips the root prefix with the platform separator (path.relative)', () => {
    // Using path.relative makes the prefix-strip separator-correct on every
    // platform, where a hardcoded '/' would leave Windows paths un-shortened.
    const root = `${sep}repo`;
    const changes: AppliedChange[] = [
      { kind: 'edit', path: `${sep}repo${sep}src${sep}a.ts`, editCount: 2 },
      { kind: 'rename', path: `${sep}repo${sep}old.ts`, toPath: `${sep}repo${sep}sub${sep}new.ts` }
    ];
    const out = summarizeChanges(changes, root, false);
    const rel = ['src', 'a.ts'].join(sep);
    const relOld = 'old.ts';
    const relNew = ['sub', 'new.ts'].join(sep);
    expect(out).toContain(`edit   2\t${rel}`);
    expect(out).toContain(`rename  \t${relOld} -> ${relNew}`);
    // the absolute root prefix must be gone
    expect(out).not.toContain(`${sep}repo${sep}src`);
  });

  it('renders an out-of-root path as a platform-correct relative path', () => {
    const out = summarizeChanges(
      [{ kind: 'edit', path: `${sep}elsewhere${sep}x.ts`, editCount: 1 }],
      `${sep}repo`,
      true
    );
    // path.relative('/repo', '/elsewhere/x.ts') === '../elsewhere/x.ts'
    expect(out).toContain(['..', 'elsewhere', 'x.ts'].join(sep));
    expect(out).toContain('[dry-run]');
  });
});
