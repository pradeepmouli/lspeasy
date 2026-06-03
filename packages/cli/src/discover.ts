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

export function findLspJsonPath(root: string): string | null {
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
      return { serverCommand: parts.join(' '), languageId };
    }
  }
  return null;
}

export function discoverServer(root: string, fileExt: string): ResolvedServer | null {
  const lspJsonPath = findLspJsonPath(root);
  if (!lspJsonPath) return null;
  let config: LspJson;
  try {
    config = JSON.parse(readFileSync(lspJsonPath, 'utf8')) as LspJson;
  } catch {
    return null;
  }
  return selectServer(config, fileExt);
}
