/**
 * Default file extensions per LSP languageId. Used as a fallback when a config
 * source names a language but omits its extensions. Not exhaustive — covers the
 * common languages; extend as needed.
 */
export const DEFAULT_EXTENSIONS: Record<string, string[]> = {
  typescript: ['.ts', '.mts', '.cts'],
  typescriptreact: ['.tsx'],
  javascript: ['.js', '.mjs', '.cjs'],
  javascriptreact: ['.jsx'],
  rust: ['.rs'],
  python: ['.py', '.pyi', '.pyw'],
  go: ['.go'],
  c: ['.c', '.h'],
  cpp: ['.cpp', '.cc', '.cxx', '.hpp', '.hh'],
  json: ['.json'],
  jsonc: ['.jsonc'],
  css: ['.css'],
  scss: ['.scss'],
  less: ['.less'],
  html: ['.html', '.htm'],
  ruby: ['.rb'],
  java: ['.java'],
  csharp: ['.cs']
};

/** Extensions for a languageId, or [] when unknown. */
export function extensionsForLanguage(languageId: string): string[] {
  return DEFAULT_EXTENSIONS[languageId] ?? [];
}
