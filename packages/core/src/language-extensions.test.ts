import { describe, expect, it } from 'vitest';
import { extensionsForLanguage, DEFAULT_EXTENSIONS } from './language-extensions.js';

describe('extensionsForLanguage', () => {
  it('returns known extensions for a standard languageId', () => {
    expect(extensionsForLanguage('typescript')).toContain('.ts');
    expect(extensionsForLanguage('rust')).toEqual(['.rs']);
  });
  it('returns an empty array for an unknown languageId', () => {
    expect(extensionsForLanguage('made-up-lang')).toEqual([]);
  });
  it('exposes the table', () => {
    expect(DEFAULT_EXTENSIONS['python']).toContain('.py');
  });
});
