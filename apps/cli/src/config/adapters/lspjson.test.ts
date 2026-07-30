import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { lspjsonAdapter } from './lspjson.js';

const roots: string[] = [];
function root(): string {
  const d = mkdtempSync(join(tmpdir(), 'lspeasy-lspjson-'));
  roots.push(d);
  return d;
}
afterEach(() => {
  while (roots.length) rmSync(roots.pop()!, { recursive: true, force: true });
});

describe('lspjsonAdapter', () => {
  it('round-trips servers through the project lsp.json', () => {
    const r = root();
    const servers = { rust: { command: 'rust-analyzer', fileExtensions: { '.rs': 'rust' } } };
    const res = lspjsonAdapter.write!(servers, 'project', r);
    expect(res.written).toEqual(['rust']);
    expect(lspjsonAdapter.detect('project', r)).toBe(true);
    expect(lspjsonAdapter.read('project', r)).toEqual(servers);
  });

  it('reads {} when no file exists', () => {
    expect(lspjsonAdapter.read('project', root())).toEqual({});
    expect(lspjsonAdapter.detect('project', root())).toBe(false);
  });
});
