import { describe, it, expect } from 'vitest';
import { tokenizeCommand } from '../../src/utils/tokenize-command.js';

describe('tokenizeCommand', () => {
  it('splits on whitespace', () => {
    expect(tokenizeCommand('node server.js --stdio')).toEqual(['node', 'server.js', '--stdio']);
  });
  it('preserves single-quoted spans', () => {
    expect(tokenizeCommand("node 'path with spaces/server.js'")).toEqual([
      'node',
      'path with spaces/server.js'
    ]);
  });
  it('preserves double-quoted spans', () => {
    expect(tokenizeCommand('node "path with spaces/server.js" --stdio')).toEqual([
      'node',
      'path with spaces/server.js',
      '--stdio'
    ]);
  });
  it('handles Windows backslash paths inside double quotes', () => {
    // The input string (as JS value) is: "C:\\Program Files\\server.exe" --stdio
    // Inside double quotes, \\ escapes to a single \, so the token is C:\Program Files\server.exe
    expect(tokenizeCommand('"C:\\\\Program Files\\\\server.exe" --stdio')).toEqual([
      'C:\\Program Files\\server.exe',
      '--stdio'
    ]);
  });
  it('handles escaped quote inside double-quoted span', () => {
    expect(tokenizeCommand('"say \\"hello\\""')).toEqual(['say "hello"']);
  });
  it('returns empty array for empty string', () => {
    expect(tokenizeCommand('')).toEqual([]);
  });
});
