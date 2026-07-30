import { describe, expect, it } from 'vitest';

import { assessResultQuality } from './result-quality.js';

const uri = 'file:///repo/packages/codegen/src/compiler/common.ts';
const params = {
  textDocument: { uri },
  position: { line: 30, character: 16 },
  context: { includeDeclaration: true }
};

function loc(u: string, line: number, char: number) {
  return {
    uri: u,
    range: {
      start: { line, character: char },
      end: { line, character: char + 8 }
    }
  };
}

describe('assessResultQuality — textDocument/references', () => {
  it('flags an empty array as partial (no references at all)', () => {
    const q = assessResultQuality('textDocument/references', params, []);
    expect(q.partial).toBe(true);
    expect(q.warning).toMatch(/no references|not.*indexed|project/i);
  });

  it('flags a null result as partial', () => {
    const q = assessResultQuality('textDocument/references', params, null);
    expect(q.partial).toBe(true);
    expect(q.warning).toBeTruthy();
  });

  it('flags a declaration-only result (single same-file hit covering the queried position)', () => {
    // The one returned location is in the queried file and overlaps the position.
    const q = assessResultQuality('textDocument/references', params, [loc(uri, 30, 12)]);
    expect(q.partial).toBe(true);
    expect(q.warning).toMatch(/declaration|same file|cross-file/i);
  });

  it('does NOT flag genuine cross-file results', () => {
    const q = assessResultQuality('textDocument/references', params, [
      loc(uri, 30, 12),
      loc('file:///repo/packages/codegen/src/compiler/assemble.ts', 4, 9),
      loc('file:///repo/packages/codegen/src/emitters/wrap.ts', 12, 2)
    ]);
    expect(q.partial).toBe(false);
  });

  it('does NOT flag a single hit in a DIFFERENT file (a real cross-file reference)', () => {
    const q = assessResultQuality('textDocument/references', params, [
      loc('file:///repo/packages/codegen/src/compiler/assemble.ts', 4, 9)
    ]);
    expect(q.partial).toBe(false);
  });

  it('does NOT flag an empty result when includeDeclaration:false (legitimate "no other usages")', () => {
    const noDeclParams = {
      ...params,
      context: { includeDeclaration: false }
    };
    expect(assessResultQuality('textDocument/references', noDeclParams, []).partial).toBe(false);
    expect(assessResultQuality('textDocument/references', noDeclParams, null).partial).toBe(false);
  });

  it('does not throw on a malformed Location (missing range) — degrades to not-partial', () => {
    // Two malformed entries: a Location whose range lacks start/end, and a non-object.
    const malformed = [{ uri }, 'not-a-location'];
    expect(() => assessResultQuality('textDocument/references', params, malformed)).not.toThrow();
    // Two entries → not the single-result declaration-only shape, so not flagged.
    expect(assessResultQuality('textDocument/references', params, malformed).partial).toBe(false);
    // A single malformed Location must also not throw.
    expect(() =>
      assessResultQuality('textDocument/references', params, [{ uri, range: {} }])
    ).not.toThrow();
  });
});

describe('assessResultQuality — other methods', () => {
  it('does not flag a single-result definition (normal for definition)', () => {
    const q = assessResultQuality('textDocument/definition', params, [loc(uri, 30, 12)]);
    expect(q.partial).toBe(false);
  });

  it('does not flag unrelated methods', () => {
    const q = assessResultQuality('textDocument/hover', params, { contents: 'x' });
    expect(q.partial).toBe(false);
  });
});
