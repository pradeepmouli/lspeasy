import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { detectArgPattern, marshalParams } from './zod-to-commander.js';
import {
  TextDocumentPositionParamsSchema,
  RenameParamsSchema,
  FoldingRangeParamsSchema,
  WorkspaceSymbolParamsSchema,
  InlayHintParamsSchema
} from '@lspeasy/core';
import type { GlobalFlags } from './io.js';

const FLAGS: GlobalFlags = {
  server: '',
  root: '/project',
  dryRun: false,
  json: false,
  verbose: false,
  waitMs: 15000,
  allowOutsideRoot: true,
  overwrite: false
};

describe('detectArgPattern', () => {
  it('returns file-position for TextDocumentPositionParams', () => {
    expect(detectArgPattern(TextDocumentPositionParamsSchema)).toBe('file-position');
  });

  it('returns file-position-newname for RenameParams', () => {
    expect(detectArgPattern(RenameParamsSchema)).toBe('file-position-newname');
  });

  it('returns file for document-only schema', () => {
    expect(detectArgPattern(FoldingRangeParamsSchema)).toBe('file');
  });

  it('returns file-range for schemas with textDocument + range', () => {
    expect(detectArgPattern(InlayHintParamsSchema)).toBe('file-range');
  });

  it('returns raw for schemas without textDocument', () => {
    expect(detectArgPattern(WorkspaceSymbolParamsSchema)).toBe('raw');
  });

  it('returns raw for non-ZodObject schema', () => {
    expect(detectArgPattern(z.string())).toBe('raw');
  });
});

describe('marshalParams', () => {
  it('converts 1-based position to 0-based for file-position', () => {
    const result = marshalParams(
      'file-position',
      ['/project/src/foo.ts', '5:10'],
      {},
      FLAGS
    ) as any;
    expect(result.position).toEqual({ line: 4, character: 9 });
  });

  it('includes URI for file-position', () => {
    const result = marshalParams('file-position', ['/project/src/foo.ts', '1:1'], {}, FLAGS) as any;
    expect(result.textDocument.uri).toMatch(/foo\.ts$/);
  });

  it('includes newName for file-position-newname', () => {
    const result = marshalParams(
      'file-position-newname',
      ['/project/src/foo.ts', '5:10', 'newFoo'],
      {},
      FLAGS
    ) as any;
    expect(result.newName).toBe('newFoo');
  });

  it('builds range for file-range', () => {
    const result = marshalParams(
      'file-range',
      ['/project/src/foo.ts', '2:1-4:5'],
      {},
      FLAGS
    ) as any;
    expect(result.range).toEqual({
      start: { line: 1, character: 0 },
      end: { line: 3, character: 4 }
    });
  });

  it('overrides with --params JSON when provided', () => {
    const raw = { textDocument: { uri: 'file:///x.ts' }, position: { line: 0, character: 0 } };
    const result = marshalParams(
      'file-position',
      ['/project/src/ignored.ts', '1:1'],
      { params: JSON.stringify(raw) },
      FLAGS
    );
    expect(result).toEqual(raw);
  });

  it('throws for raw pattern without --params', () => {
    expect(() => marshalParams('raw', [], {}, FLAGS)).toThrow('--params');
  });
});
