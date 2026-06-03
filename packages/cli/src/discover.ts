import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export interface LspServerEntry {
  command: string;
  args?: string[];
  fileExtensions: Record<string, string>;
}

export interface LspJson {
  lspServers: Record<string, LspServerEntry>;
}

export interface ResolvedServer {
  /** Full spawn command string passed to RefactorSession as serverCommand. */
  serverCommand: string;
  /** languageId for textDocument/didOpen (e.g. 'typescript', 'rust'). */
  languageId: string;
}

const SEARCH_PATHS = ['lsp.json', '.claude/lsp.json', '.github/lsp.json'];

function findLspJsonPath(root: string): string | null {
  for (const rel of SEARCH_PATHS) {
    const full = join(root, rel);
    if (existsSync(full)) return full;
  }
  const global = join(homedir(), '.claude', 'lsp.json');
  return existsSync(global) ? global : null;
}

export function selectServer(config: LspJson, fileExt: string): ResolvedServer | null {
  for (const entry of Object.values(config.lspServers)) {
    const languageId = entry.fileExtensions[fileExt];
    if (languageId) {
      const parts = [entry.command, ...(entry.args ?? [])].filter(Boolean);
      // Quote tokens containing spaces so tokenizeCommand in session.ts can
      // round-trip them without splitting on the embedded whitespace.
      // Escape backslashes first, then double-quotes: tokenizeCommand treats \\
      // inside double-quotes as a literal backslash, so a trailing backslash in a
      // Windows path like "C:\Program Files\" must become "C:\Program Files\\"
      // to avoid the closing " being consumed as \" (an escaped quote).
      const quoted = parts.map((t) =>
        t.includes(' ') ? `"${t.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"` : t
      );
      return { serverCommand: quoted.join(' '), languageId };
    }
  }
  return null;
}

export function discoverServer(root: string, fileExt: string): ResolvedServer | null {
  const lspJsonPath = findLspJsonPath(root);
  if (!lspJsonPath) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(lspJsonPath, 'utf8'));
  } catch {
    return null;
  }
  if (!parsed || typeof (parsed as Record<string, unknown>)['lspServers'] !== 'object') return null;
  return selectServer(parsed as LspJson, fileExt);
}
