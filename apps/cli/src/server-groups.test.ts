import { describe, it, expect } from 'vitest';
import { groupServerStatus } from './server-groups.js';
import type { LanguageStatus } from '@lsproxy/proxy';
import type { SourcedServer } from './resolve.js';

const SOURCES: SourcedServer[] = [
  {
    name: 'typescript',
    command: '"tsls"',
    fileExtensions: { '.ts': 'typescript' },
    source: 'lsp.json'
  }
];

describe('groupServerStatus', () => {
  it('one language, one group, source looked up by command', () => {
    const languages: LanguageStatus[] = [
      {
        languageId: 'typescript',
        name: 'typescript',
        extensions: ['.ts'],
        command: '"tsls"',
        status: 'cold'
      }
    ];
    const [group] = groupServerStatus(languages, SOURCES);
    expect(group?.source).toBe('lsp.json');
    expect(group?.status).toBe('cold');
    expect(group?.mixed).toBe(false);
    expect(group?.languages).toHaveLength(1);
  });

  it('two languages sharing a command become one group', () => {
    const languages: LanguageStatus[] = [
      {
        languageId: 'typescript',
        name: 'ts',
        extensions: ['.ts'],
        command: '"multi-lang"',
        status: 'running',
        pid: 1
      },
      {
        languageId: 'javascript',
        name: 'js',
        extensions: ['.js'],
        command: '"multi-lang"',
        status: 'running',
        pid: 1
      }
    ];
    const groups = groupServerStatus(languages, []);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.languages.map((l) => l.languageId).sort()).toEqual([
      'javascript',
      'typescript'
    ]);
  });

  it('mixed status: optimistic headline (running wins), mixed flag set', () => {
    const languages: LanguageStatus[] = [
      {
        languageId: 'typescript',
        name: 'ts',
        extensions: ['.ts'],
        command: '"multi-lang"',
        status: 'cold'
      },
      {
        languageId: 'javascript',
        name: 'js',
        extensions: ['.js'],
        command: '"multi-lang"',
        status: 'running',
        pid: 7
      }
    ];
    const [group] = groupServerStatus(languages, []);
    expect(group?.mixed).toBe(true);
    expect(group?.status).toBe('running');
    expect(group?.pid).toBe(7);
  });

  it('source falls back to "(unconfigured)" when no match', () => {
    const languages: LanguageStatus[] = [
      { languageId: 'go', name: 'go', extensions: ['.go'], command: '"gopls"', status: 'cold' }
    ];
    const [group] = groupServerStatus(languages, []);
    expect(group?.source).toBe('(unconfigured)');
  });
});
