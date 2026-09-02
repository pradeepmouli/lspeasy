import { extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMMAND_DESCRIPTORS } from './generated/command-descriptors.js';

function isFileLike(p: string): boolean {
  return extname(p) !== '' && !p.startsWith('{') && !p.startsWith('[') && !p.startsWith('"');
}

const FILE_LEADING_PATTERNS = new Set([
  'file-position-newname',
  'file-position',
  'file-range',
  'file'
]);

/**
 * Best-effort file to open before sending a request, so the language server
 * has a document loaded (e.g. TS project resolution depends on it). Checks,
 * in order:
 *   1. the method's own first remaining arg, when its generated pattern
 *      leads with a file (skipped generically for query-style methods like
 *      workspace/symbol, since their pattern isn't file-leading);
 *   2. any `--params`-style JSON blob among the remaining args:
 *      workspace/willRenameFiles' `files[].oldUri`, a raw `textDocument/*`
 *      call's `textDocument.uri`, or an executeCommand refactor's
 *      `arguments[0].file`.
 * `method` is undefined for the generic `call` command, whose "method" is a
 * user-supplied string, not a fixed schema — only the --params scan applies.
 */
export function findAnchorFile(
  method: string | undefined,
  args: readonly string[]
): string | undefined {
  if (method) {
    const pattern = COMMAND_DESCRIPTORS[method]?.pattern;
    const first = args[0];
    if (
      pattern !== undefined &&
      FILE_LEADING_PATTERNS.has(pattern) &&
      first !== undefined &&
      isFileLike(first)
    ) {
      return first;
    }
  }

  for (const candidate of args) {
    if (!candidate.startsWith('{')) continue;
    try {
      const parsed = JSON.parse(candidate) as {
        files?: Array<{ oldUri?: string; uri?: string }>;
        textDocument?: { uri?: string };
        arguments?: Array<{ file?: string }>;
      };
      const uri = parsed.files?.[0]?.oldUri ?? parsed.files?.[0]?.uri ?? parsed.textDocument?.uri;
      if (typeof uri === 'string') return fileURLToPath(uri);
      const cmdFile = parsed.arguments?.[0]?.file;
      if (typeof cmdFile === 'string') return cmdFile;
    } catch {
      /* not the params JSON — keep scanning */
    }
  }
  return undefined;
}
