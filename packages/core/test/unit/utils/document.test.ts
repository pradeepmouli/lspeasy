import { describe, expect, it } from 'vitest';
import {
  DocumentVersionTracker,
  createFullDidChangeParams,
  createIncrementalDidChangeParams
} from '../../../src/utils/document.js';

describe('DocumentVersionTracker', () => {
  it('tracks versions per document uri', () => {
    const tracker = new DocumentVersionTracker();
    tracker.open('file:///doc.ts', 5);

    expect(tracker.currentVersion('file:///doc.ts')).toBe(5);
    expect(tracker.nextVersion('file:///doc.ts')).toBe(6);
    expect(tracker.currentVersion('file:///doc.ts')).toBe(6);

    tracker.close('file:///doc.ts');
    expect(tracker.currentVersion('file:///doc.ts')).toBeUndefined();
  });
});

describe('document change helpers', () => {
  it('builds incremental didChange params with range changes', () => {
    const tracker = new DocumentVersionTracker();
    tracker.open('file:///inc.ts', 0);

    const params = createIncrementalDidChangeParams(
      'file:///inc.ts',
      [
        {
          range: {
            start: { line: 0, character: 0 },
            end: { line: 0, character: 5 }
          },
          text: 'const',
          rangeLength: 5
        }
      ],
      { tracker }
    );

    expect(params.textDocument.version).toBe(1);
    expect(params.contentChanges[0].text).toBe('const');
    expect(params.contentChanges[0].range).toEqual({
      start: { line: 0, character: 0 },
      end: { line: 0, character: 5 }
    });
  });

  it('builds full didChange params for full document replacement', () => {
    const params = createFullDidChangeParams('file:///full.ts', 'const x = 1;', {
      version: 12
    });

    expect(params.textDocument.version).toBe(12);
    expect(params.contentChanges).toEqual([{ text: 'const x = 1;' }]);
  });

  it('auto-increments version on repeated tracker-based changes', () => {
    const tracker = new DocumentVersionTracker();
    tracker.open('file:///auto.ts', 3);

    const first = createFullDidChangeParams('file:///auto.ts', 'a', { tracker });
    const second = createFullDidChangeParams('file:///auto.ts', 'ab', { tracker });

    expect(first.textDocument.version).toBe(4);
    expect(second.textDocument.version).toBe(5);
  });
});
