import { describe, it, expect } from 'vitest';
import { findAnchorFile } from './anchor.js';

describe('findAnchorFile', () => {
  it('finds the file for a file-position method (e.g. textDocument/hover)', () => {
    expect(findAnchorFile('textDocument/hover', ['src/foo.ts', '12:7'])).toBe('src/foo.ts');
  });

  it('finds the file for a file-position-newname method (e.g. textDocument/rename)', () => {
    expect(findAnchorFile('textDocument/rename', ['src/foo.ts', '12:7', 'newName'])).toBe(
      'src/foo.ts'
    );
  });

  it('does not treat a query argument as a file (workspace/symbol)', () => {
    expect(findAnchorFile('workspace/symbol', ['MyClass'])).toBeUndefined();
  });

  it('does not treat a JSON literal as a file', () => {
    expect(findAnchorFile('textDocument/hover', ['{"not":"a file"}', '1:1'])).toBeUndefined();
  });

  it('mines a file URI out of a --params JSON blob for workspace/willRenameFiles', () => {
    const params = JSON.stringify({
      files: [{ oldUri: 'file:///project/a.ts', newUri: 'file:///project/b.ts' }]
    });
    expect(findAnchorFile('workspace/willRenameFiles', [params])).toBe('/project/a.ts');
  });

  it("mines textDocument.uri out of a raw call's --params blob", () => {
    const params = JSON.stringify({ textDocument: { uri: 'file:///project/c.ts' } });
    expect(findAnchorFile(undefined, [params])).toBe('/project/c.ts');
  });

  it('mines arguments[0].file out of an executeCommand-style --params blob', () => {
    const params = JSON.stringify({ arguments: [{ file: '/project/d.ts' }] });
    expect(findAnchorFile(undefined, [params])).toBe('/project/d.ts');
  });

  it('returns undefined when nothing anchors (e.g. the generic call command)', () => {
    expect(findAnchorFile(undefined, ['{"command":"typescript.reloadProjects"}'])).toBeUndefined();
  });
});
