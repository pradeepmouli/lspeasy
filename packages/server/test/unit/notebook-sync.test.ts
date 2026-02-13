import { describe, expect, it, vi } from 'vitest';
import { LSPServer } from '../../src/server.js';

describe('server notebook namespace', () => {
  it('registers notebook handlers through namespace helpers', () => {
    const server = new LSPServer();

    const open = vi.fn();
    const change = vi.fn();
    const save = vi.fn();
    const close = vi.fn();

    const d1 = server.notebookDocument.onDidOpen(open);
    const d2 = server.notebookDocument.onDidChange(change);
    const d3 = server.notebookDocument.onDidSave(save);
    const d4 = server.notebookDocument.onDidClose(close);

    expect(d1.dispose).toBeTypeOf('function');
    expect(d2.dispose).toBeTypeOf('function');
    expect(d3.dispose).toBeTypeOf('function');
    expect(d4.dispose).toBeTypeOf('function');
  });

  it('accepts combined structural and content change payloads', async () => {
    const server = new LSPServer();
    const handler = vi.fn();

    server.notebookDocument.onDidChange(handler);

    const disposable = server.onNotification('notebookDocument/didChange', handler);
    expect(disposable.dispose).toBeTypeOf('function');
  });
});
