import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { copilotAdapter } from './copilot.js';

const roots: string[] = [];
function root(): string {
  const d = mkdtempSync(join(tmpdir(), 'lspeasy-copilot-'));
  roots.push(d);
  return d;
}
afterEach(() => {
  while (roots.length) rmSync(roots.pop()!, { recursive: true, force: true });
});

describe('copilotAdapter', () => {
  it('round-trips servers through the project .github/lsp.json', () => {
    const r = root();
    const servers = {
      python: {
        command: 'basedpyright-langserver',
        args: ['--stdio'],
        fileExtensions: { '.py': 'python' }
      }
    };
    const res = copilotAdapter.write!(servers, 'project', r);
    expect(res.path).toBe(join(r, '.github', 'lsp.json'));
    expect(res.written).toEqual(['python']);
    expect(copilotAdapter.read('project', r)).toEqual(servers);
  });

  it('uses the user-level lsp-config.json path', () => {
    expect(copilotAdapter.configPath('user', root())).toMatch(/\.copilot\/lsp-config\.json$/);
  });
});
