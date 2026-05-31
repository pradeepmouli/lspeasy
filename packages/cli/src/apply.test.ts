/**
 * Tests for the WorkspaceEdit applier — focused on ordering robustness, which
 * no live language server exercises (tsserver only ever returns a `changes`
 * map; the interleaved-resource-op cases must be tested synthetically).
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { applyWorkspaceEdit, stripResourceOps, type WorkspaceEdit } from './apply.js';

let dir: string;
const uri = (rel: string) => pathToFileURL(join(dir, rel)).href;
const wholeLineEdit = (line: number, newText: string) => ({
  range: { start: { line, character: 0 }, end: { line, character: 0 } },
  newText
});

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), 'lspeasy-apply-'));
});
afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe('applyWorkspaceEdit', () => {
  it('applies a text edit to a file that a rename also moves (text first, then move)', () => {
    // Reproduces the move-into-subdir shape: the moved file gets a self-import
    // text edit keyed to its OLD uri, plus a rename op. If the rename ran first
    // the text edit would target a missing path and throw.
    writeFileSync(join(dir, 'core.ts'), `import { DEP } from './dep.js';\n`);
    mkdirSync(join(dir, 'sub'), { recursive: true });

    const edit: WorkspaceEdit = {
      documentChanges: [
        // intentionally list the rename BEFORE the text edit to prove ordering
        { kind: 'rename', oldUri: uri('core.ts'), newUri: uri('sub/core.ts') },
        {
          textDocument: { uri: uri('core.ts') },
          edits: [
            {
              // replace the exact `'./dep.js'` span (chars 20..30)
              range: { start: { line: 0, character: 20 }, end: { line: 0, character: 30 } },
              newText: `'../dep.js'`
            }
          ]
        }
      ]
    };

    const applied = applyWorkspaceEdit(edit);

    expect(existsSync(join(dir, 'core.ts'))).toBe(false);
    expect(existsSync(join(dir, 'sub/core.ts'))).toBe(true);
    expect(readFileSync(join(dir, 'sub/core.ts'), 'utf8')).toBe(
      `import { DEP } from '../dep.js';\n`
    );
    expect(applied.map((c) => c.kind)).toEqual(['edit', 'rename']);
  });

  it('creates a file before a text edit fills it', () => {
    const edit: WorkspaceEdit = {
      documentChanges: [
        // text edit listed before the create — must still create first
        {
          textDocument: { uri: uri('new.ts') },
          edits: [wholeLineEdit(0, 'export const x = 1;\n')]
        },
        { kind: 'create', uri: uri('new.ts') }
      ]
    };

    const applied = applyWorkspaceEdit(edit);

    expect(readFileSync(join(dir, 'new.ts'), 'utf8')).toBe('export const x = 1;\n');
    expect(applied.map((c) => c.kind)).toEqual(['create', 'edit']);
  });

  it('aborts before any write when a text-edit target cannot be read', () => {
    writeFileSync(join(dir, 'ok.ts'), 'a\n');
    const edit: WorkspaceEdit = {
      changes: {
        [uri('ok.ts')]: [wholeLineEdit(0, 'CHANGED ')],
        [uri('missing.ts')]: [wholeLineEdit(0, 'x')]
      }
    };

    expect(() => applyWorkspaceEdit(edit)).toThrow(/cannot read/);
    // ok.ts must be untouched — the failed read aborts before any write.
    expect(readFileSync(join(dir, 'ok.ts'), 'utf8')).toBe('a\n');
  });

  it('applies a plain changes map', () => {
    writeFileSync(join(dir, 'a.ts'), 'old\n');
    const edit: WorkspaceEdit = { changes: { [uri('a.ts')]: [wholeLineEdit(0, 'new ')] } };
    const applied = applyWorkspaceEdit(edit);
    expect(readFileSync(join(dir, 'a.ts'), 'utf8')).toBe('new old\n');
    expect(applied).toEqual([{ kind: 'edit', path: join(dir, 'a.ts'), editCount: 1 }]);
  });
});

describe('stripResourceOps', () => {
  it('removes resource ops but keeps text edits', () => {
    const edit: WorkspaceEdit = {
      documentChanges: [
        { kind: 'rename', oldUri: uri('a.ts'), newUri: uri('b.ts') },
        { textDocument: { uri: uri('c.ts') }, edits: [wholeLineEdit(0, 'x')] }
      ]
    };
    const out = stripResourceOps(edit);
    expect(out.documentChanges).toHaveLength(1);
    expect(out.documentChanges![0]).toHaveProperty('textDocument');
  });

  it('passes a changes-map edit through unchanged', () => {
    const edit: WorkspaceEdit = { changes: { [uri('a.ts')]: [wholeLineEdit(0, 'x')] } };
    expect(stripResourceOps(edit)).toBe(edit);
  });
});
