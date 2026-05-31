/**
 * Tests for the `move-file` destination-overwrite guard. A move onto an
 * existing path used to call `renameSync` (untracked) or `git mv` and could
 * silently destroy the destination; it must now refuse unless `--overwrite`.
 *
 * The guard runs BEFORE the LSP session is spawned, so with `process.exit`
 * stubbed to throw, `runMoveFile` aborts without touching the network/server.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { runMoveFile } from './move-file.js';
import type { GlobalFlags } from '../io.js';

let dir: string;

const baseFlags = (over: Partial<GlobalFlags> = {}): GlobalFlags => ({
  server: 'noop',
  root: dir,
  dryRun: false,
  json: false,
  verbose: false,
  waitMs: 0,
  allowOutsideRoot: false,
  overwrite: false,
  ...over
});

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'lspeasy-movefile-'));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
  vi.restoreAllMocks();
});

describe('runMoveFile destination guard', () => {
  it('refuses when the destination exists and --overwrite is absent', async () => {
    writeFileSync(join(dir, 'from.ts'), 'FROM\n');
    writeFileSync(join(dir, 'to.ts'), 'TO\n');

    const errs: string[] = [];
    vi.spyOn(process, 'exit').mockImplementation(((): never => {
      throw new Error('exit');
    }) as never);
    vi.spyOn(process.stderr, 'write').mockImplementation(((s: string) => {
      errs.push(s);
      return true;
    }) as never);

    await expect(
      runMoveFile({ oldPath: 'from.ts', newPath: 'to.ts' }, baseFlags())
    ).rejects.toThrow('exit');
    expect(errs.join('')).toMatch(/destination already exists/);
    // The guard fired before any move — both files are intact.
    expect(() => rmSync(join(dir, 'from.ts'))).not.toThrow();
  });
});
