import { describe, it, expect, afterEach } from 'vitest';
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, delimiter } from 'node:path';
import { resolveBinaryPath } from './resolve-binary.js';

const dirs: string[] = [];
function fakeBin(name: string): { dir: string; path: string } {
  const dir = mkdtempSync(join(tmpdir(), 'lspeasy-bin-'));
  dirs.push(dir);
  const path = join(dir, name);
  writeFileSync(path, '#!/bin/sh\necho hi\n');
  chmodSync(path, 0o755);
  return { dir, path };
}

const originalPath = process.env['PATH'];
afterEach(() => {
  process.env['PATH'] = originalPath;
  while (dirs.length) rmSync(dirs.pop()!, { recursive: true, force: true });
});

describe('resolveBinaryPath', () => {
  it('finds an executable on $PATH', () => {
    const { dir, path } = fakeBin('fake-lsp-server');
    process.env['PATH'] = `${dir}${delimiter}${originalPath}`;
    expect(resolveBinaryPath('fake-lsp-server')).toBe(path);
  });

  it('returns the path unchanged when already absolute and it exists', () => {
    const { path } = fakeBin('fake-lsp-server-2');
    expect(resolveBinaryPath(path)).toBe(path);
  });

  it('returns undefined for a name not on $PATH', () => {
    process.env['PATH'] = '';
    expect(resolveBinaryPath('definitely-not-a-real-binary-xyz')).toBeUndefined();
  });

  it('returns undefined for an absolute path that does not exist', () => {
    expect(resolveBinaryPath('/no/such/path/binary')).toBeUndefined();
  });
});
