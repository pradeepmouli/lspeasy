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
  it('processes documentChanges in array order: rename old→new, then edit on NEW', () => {
    // The canonical move-into-subdir shape: a rename moves core.ts → sub/core.ts,
    // then a text edit keyed to the NEW uri rewrites the self-import. The edit
    // must read the file at its post-rename path, so ordering is honored
    // literally — the rename runs first.
    writeFileSync(join(dir, 'core.ts'), `import { DEP } from './dep.js';\n`);
    mkdirSync(join(dir, 'sub'), { recursive: true });

    const edit: WorkspaceEdit = {
      documentChanges: [
        { kind: 'rename', oldUri: uri('core.ts'), newUri: uri('sub/core.ts') },
        {
          // keyed to the NEW uri — only readable once the rename has run
          textDocument: { uri: uri('sub/core.ts') },
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
    expect(applied.map((c) => c.kind)).toEqual(['rename', 'edit']);
  });

  it('honors order: an edit keyed to a path a PRIOR rename moved away throws', () => {
    // The mirror of the above: if a server emits [rename old→new, edit on OLD]
    // the edit targets a path the rename already vacated. Sequential processing
    // surfaces that as a read error rather than silently hoisting the edit.
    writeFileSync(join(dir, 'core.ts'), 'x\n');
    const edit: WorkspaceEdit = {
      documentChanges: [
        { kind: 'rename', oldUri: uri('core.ts'), newUri: uri('moved.ts') },
        { textDocument: { uri: uri('core.ts') }, edits: [wholeLineEdit(0, 'y')] }
      ]
    };
    expect(() => applyWorkspaceEdit(edit)).toThrow(/cannot read/);
  });

  it('creates a file before a later text edit fills it', () => {
    const edit: WorkspaceEdit = {
      documentChanges: [
        { kind: 'create', uri: uri('new.ts') },
        {
          textDocument: { uri: uri('new.ts') },
          edits: [wholeLineEdit(0, 'export const x = 1;\n')]
        }
      ]
    };

    const applied = applyWorkspaceEdit(edit);

    expect(readFileSync(join(dir, 'new.ts'), 'utf8')).toBe('export const x = 1;\n');
    expect(applied.map((c) => c.kind)).toEqual(['create', 'edit']);
  });

  it('fails a create on an existing path without overwrite/ignoreIfExists', () => {
    writeFileSync(join(dir, 'exists.ts'), 'PRE\n');
    const edit: WorkspaceEdit = {
      documentChanges: [{ kind: 'create', uri: uri('exists.ts') }]
    };
    expect(() => applyWorkspaceEdit(edit)).toThrow(/already exists/);
    // the pre-existing content must be untouched
    expect(readFileSync(join(dir, 'exists.ts'), 'utf8')).toBe('PRE\n');
  });

  it('skips a create on an existing path with ignoreIfExists (content preserved)', () => {
    writeFileSync(join(dir, 'exists.ts'), 'PRE\n');
    const edit: WorkspaceEdit = {
      documentChanges: [
        { kind: 'create', uri: uri('exists.ts'), options: { ignoreIfExists: true } }
      ]
    };
    const applied = applyWorkspaceEdit(edit);
    expect(applied).toEqual([]);
    expect(readFileSync(join(dir, 'exists.ts'), 'utf8')).toBe('PRE\n');
  });

  it('truncates an existing path on create when overwrite is set (overwrite wins)', () => {
    writeFileSync(join(dir, 'exists.ts'), 'PRE\n');
    const edit: WorkspaceEdit = {
      documentChanges: [
        // overwrite takes precedence over ignoreIfExists per the LSP spec
        {
          kind: 'create',
          uri: uri('exists.ts'),
          options: { overwrite: true, ignoreIfExists: true }
        }
      ]
    };
    const applied = applyWorkspaceEdit(edit);
    expect(applied.map((c) => c.kind)).toEqual(['create']);
    expect(readFileSync(join(dir, 'exists.ts'), 'utf8')).toBe('');
  });

  it('fails a rename whose destination exists without overwrite/ignoreIfExists', () => {
    writeFileSync(join(dir, 'from.ts'), 'FROM\n');
    writeFileSync(join(dir, 'to.ts'), 'TO\n');
    const edit: WorkspaceEdit = {
      documentChanges: [{ kind: 'rename', oldUri: uri('from.ts'), newUri: uri('to.ts') }]
    };
    expect(() => applyWorkspaceEdit(edit)).toThrow(/already exists/);
    // neither file is clobbered
    expect(readFileSync(join(dir, 'from.ts'), 'utf8')).toBe('FROM\n');
    expect(readFileSync(join(dir, 'to.ts'), 'utf8')).toBe('TO\n');
  });

  it('skips a rename onto an existing destination with ignoreIfExists', () => {
    writeFileSync(join(dir, 'from.ts'), 'FROM\n');
    writeFileSync(join(dir, 'to.ts'), 'TO\n');
    const edit: WorkspaceEdit = {
      documentChanges: [
        {
          kind: 'rename',
          oldUri: uri('from.ts'),
          newUri: uri('to.ts'),
          options: { ignoreIfExists: true }
        }
      ]
    };
    const applied = applyWorkspaceEdit(edit);
    expect(applied).toEqual([]);
    expect(readFileSync(join(dir, 'from.ts'), 'utf8')).toBe('FROM\n');
    expect(readFileSync(join(dir, 'to.ts'), 'utf8')).toBe('TO\n');
  });

  it('clobbers an existing rename destination when overwrite is set', () => {
    writeFileSync(join(dir, 'from.ts'), 'FROM\n');
    writeFileSync(join(dir, 'to.ts'), 'TO\n');
    const edit: WorkspaceEdit = {
      documentChanges: [
        {
          kind: 'rename',
          oldUri: uri('from.ts'),
          newUri: uri('to.ts'),
          options: { overwrite: true }
        }
      ]
    };
    const applied = applyWorkspaceEdit(edit);
    expect(applied.map((c) => c.kind)).toEqual(['rename']);
    expect(existsSync(join(dir, 'from.ts'))).toBe(false);
    expect(readFileSync(join(dir, 'to.ts'), 'utf8')).toBe('FROM\n');
  });

  it('applies two edits on the same line correctly (reused line map)', () => {
    // Guards the per-file lineStarts reuse: both edits resolve against the same
    // original line map and splice in reverse offset order.
    writeFileSync(join(dir, 'a.ts'), 'const ab = 1;\n');
    const edit: WorkspaceEdit = {
      changes: {
        [uri('a.ts')]: [
          {
            range: { start: { line: 0, character: 6 }, end: { line: 0, character: 7 } },
            newText: 'X'
          },
          {
            range: { start: { line: 0, character: 7 }, end: { line: 0, character: 8 } },
            newText: 'Y'
          }
        ]
      }
    };
    applyWorkspaceEdit(edit);
    expect(readFileSync(join(dir, 'a.ts'), 'utf8')).toBe('const XY = 1;\n');
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
  it('drops ONLY the rename matching the physical move, keeping text edits', () => {
    const from = join(dir, 'a.ts');
    const to = join(dir, 'b.ts');
    const edit: WorkspaceEdit = {
      documentChanges: [
        { kind: 'rename', oldUri: uri('a.ts'), newUri: uri('b.ts') },
        { textDocument: { uri: uri('c.ts') }, edits: [wholeLineEdit(0, 'x')] }
      ]
    };
    const out = stripResourceOps(edit, { from, to });
    expect(out.documentChanges).toHaveLength(1);
    expect(out.documentChanges![0]).toHaveProperty('textDocument');
  });

  it('preserves UNRELATED resource ops (e.g. a server create) and their order', () => {
    // A server's willRenameFiles may emit `create shim.ts` + a text edit for it,
    // alongside the rename that duplicates our physical move. Only the matching
    // rename is stripped; the create and its edit survive, in order.
    const from = join(dir, 'old.ts');
    const to = join(dir, 'new.ts');
    const edit: WorkspaceEdit = {
      documentChanges: [
        { kind: 'create', uri: uri('shim.ts') },
        { kind: 'rename', oldUri: uri('old.ts'), newUri: uri('new.ts') },
        { textDocument: { uri: uri('shim.ts') }, edits: [wholeLineEdit(0, 'export {};\n')] }
      ]
    };
    const out = stripResourceOps(edit, { from, to });
    expect(out.documentChanges).toHaveLength(2);
    expect(out.documentChanges![0]).toMatchObject({ kind: 'create', uri: uri('shim.ts') });
    expect(out.documentChanges![1]).toHaveProperty('textDocument');
  });

  it('keeps a rename that does NOT match the physical move', () => {
    const from = join(dir, 'a.ts');
    const to = join(dir, 'b.ts');
    const edit: WorkspaceEdit = {
      documentChanges: [{ kind: 'rename', oldUri: uri('x.ts'), newUri: uri('y.ts') }]
    };
    const out = stripResourceOps(edit, { from, to });
    expect(out.documentChanges).toHaveLength(1);
  });

  it('passes a changes-map edit through unchanged', () => {
    const edit: WorkspaceEdit = { changes: { [uri('a.ts')]: [wholeLineEdit(0, 'x')] } };
    expect(stripResourceOps(edit, { from: 'x', to: 'y' })).toBe(edit);
  });
});

describe('applyWorkspaceEdit — root boundary on server-returned edits', () => {
  it('refuses a server edit whose target escapes --root', () => {
    // Write a file outside the project root and target it via a changes map.
    const outside = mkdtempSync(join(tmpdir(), 'lspeasy-outside-'));
    try {
      writeFileSync(join(outside, 'victim.ts'), 'secret\n');
      const edit: WorkspaceEdit = {
        changes: {
          [pathToFileURL(join(outside, 'victim.ts')).href]: [wholeLineEdit(0, 'pwned ')]
        }
      };
      const guard = { root: dir, allowOutsideRoot: false };
      expect(() => applyWorkspaceEdit(edit, guard)).toThrow(/outside --root/);
      // The external file must be untouched.
      expect(readFileSync(join(outside, 'victim.ts'), 'utf8')).toBe('secret\n');
    } finally {
      rmSync(outside, { recursive: true, force: true });
    }
  });

  it('refuses a server rename whose destination escapes --root (validated pre-flight)', () => {
    const outside = mkdtempSync(join(tmpdir(), 'lspeasy-outside-'));
    try {
      writeFileSync(join(dir, 'in.ts'), 'x\n');
      const edit: WorkspaceEdit = {
        documentChanges: [
          {
            kind: 'rename',
            oldUri: uri('in.ts'),
            newUri: pathToFileURL(join(outside, 'out.ts')).href
          }
        ]
      };
      const guard = { root: dir, allowOutsideRoot: false };
      expect(() => applyWorkspaceEdit(edit, guard)).toThrow(/outside --root/);
      // The source must NOT have been moved — refusal happens before any op.
      expect(existsSync(join(dir, 'in.ts'))).toBe(true);
    } finally {
      rmSync(outside, { recursive: true, force: true });
    }
  });

  it('permits an out-of-root server edit when allowOutsideRoot is set', () => {
    const outside = mkdtempSync(join(tmpdir(), 'lspeasy-outside-'));
    try {
      writeFileSync(join(outside, 'ok.ts'), 'old\n');
      const edit: WorkspaceEdit = {
        changes: { [pathToFileURL(join(outside, 'ok.ts')).href]: [wholeLineEdit(0, 'new ')] }
      };
      const guard = { root: dir, allowOutsideRoot: true };
      expect(() => applyWorkspaceEdit(edit, guard)).not.toThrow();
      expect(readFileSync(join(outside, 'ok.ts'), 'utf8')).toBe('new old\n');
    } finally {
      rmSync(outside, { recursive: true, force: true });
    }
  });
});
