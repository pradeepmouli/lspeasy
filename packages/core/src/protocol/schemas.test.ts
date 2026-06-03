import { describe, it, expect } from 'vitest';
import {
  RenameParamsSchema,
  CodeActionParamsSchema,
  WorkspaceSymbolParamsSchema,
  FormattingOptionsSchema,
  DocumentFormattingParamsSchema,
  DocumentRangeFormattingParamsSchema,
  LSPSchemas
} from './schemas.js';

describe('expanded LSPSchemas', () => {
  it('exports RenameParamsSchema with newName', () => {
    const result = RenameParamsSchema.safeParse({
      textDocument: { uri: 'file:///foo.ts' },
      position: { line: 0, character: 0 },
      newName: 'bar'
    });
    expect(result.success).toBe(true);
  });

  it('rejects RenameParamsSchema without newName', () => {
    const result = RenameParamsSchema.safeParse({
      textDocument: { uri: 'file:///foo.ts' },
      position: { line: 0, character: 0 }
    });
    expect(result.success).toBe(false);
  });

  it('exports WorkspaceSymbolParamsSchema with query', () => {
    const result = WorkspaceSymbolParamsSchema.safeParse({ query: 'hello' });
    expect(result.success).toBe(true);
  });

  it('has textDocument/rename in LSPSchemas', () => {
    expect(LSPSchemas['textDocument/rename']).toBeDefined();
  });

  it('has workspace/symbol in LSPSchemas', () => {
    expect(LSPSchemas['workspace/symbol']).toBeDefined();
  });
});
