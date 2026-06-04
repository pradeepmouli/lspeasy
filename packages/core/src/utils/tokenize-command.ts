/**
 * Split a server launch command into argv tokens, honoring single- and
 * double-quoted spans so an argument containing spaces survives intact (e.g.
 * `node "/path with spaces/server.js" --stdio`). A naive `split(/\s+/)` shredded
 * such commands into broken fragments.
 *
 * This is a deliberately small, dependency-free tokenizer (matching the repo's
 * "no extra dependency" ethos): quotes group and unquoted whitespace separates
 * tokens. Crucially, a backslash is a LITERAL path separator (so Windows paths
 * like `"C:\Program Files\server.exe"` survive intact) — it escapes ONLY a
 * following quote character (`\"` inside a double-quoted span yields a literal
 * `"`). It is not a full POSIX shell parser (no variable/glob expansion) — only
 * the quoting needed to pass paths/args.
 */
export function tokenizeCommand(command: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let inToken = false;
  let quote: '"' | "'" | undefined;

  for (let i = 0; i < command.length; i++) {
    const ch = command[i]!;
    if (quote) {
      if (ch === '\\' && quote === '"' && (command[i + 1] === '"' || command[i + 1] === '\\')) {
        // Inside double quotes a backslash escapes ONLY a following quote or
        // backslash. Otherwise it stays a literal separator (Windows paths).
        current += command[++i]!;
      } else if (ch === quote) {
        quote = undefined;
      } else {
        current += ch;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      inToken = true;
      continue;
    }
    if (ch === '\\' && command[i + 1] === '"') {
      // Outside quotes, a backslash escapes a following quote; elsewhere it is a
      // literal path separator (do NOT consume the next char).
      current += command[++i]!;
      inToken = true;
      continue;
    }
    if (/\s/.test(ch)) {
      if (inToken) {
        tokens.push(current);
        current = '';
        inToken = false;
      }
      continue;
    }
    current += ch;
    inToken = true;
  }
  if (inToken) tokens.push(current);
  return tokens;
}
