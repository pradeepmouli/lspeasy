/**
 * Tests for `tokenizeCommand` — the quote-aware server-command splitter that
 * replaced a naive `split(/\s+/)`, which shredded any launch command with a
 * quoted argument containing spaces.
 */
import { describe, expect, it } from 'vitest';

import { tokenizeCommand } from './session.js';

describe('tokenizeCommand', () => {
  it('splits a plain command on whitespace', () => {
    expect(tokenizeCommand('typescript-language-server --stdio')).toEqual([
      'typescript-language-server',
      '--stdio'
    ]);
  });

  it('collapses runs of whitespace and trims edges', () => {
    expect(tokenizeCommand('  node   server.js   --stdio  ')).toEqual([
      'node',
      'server.js',
      '--stdio'
    ]);
  });

  it('keeps a double-quoted argument with spaces as one token', () => {
    expect(tokenizeCommand('node "/path with spaces/server.js" --stdio')).toEqual([
      'node',
      '/path with spaces/server.js',
      '--stdio'
    ]);
  });

  it('keeps a single-quoted argument with spaces as one token', () => {
    expect(tokenizeCommand("node '/a b/srv.js' --x")).toEqual(['node', '/a b/srv.js', '--x']);
  });

  it('joins adjacent quoted and unquoted segments into one token', () => {
    expect(tokenizeCommand('cmd --flag="a b" tail')).toEqual(['cmd', '--flag=a b', 'tail']);
  });

  it('honors a backslash escape outside quotes', () => {
    expect(tokenizeCommand('node a\\ b c')).toEqual(['node', 'a b', 'c']);
  });

  it('returns an empty array for an empty/whitespace command', () => {
    expect(tokenizeCommand('')).toEqual([]);
    expect(tokenizeCommand('   ')).toEqual([]);
  });
});
