import { accessSync, constants, existsSync } from 'node:fs';
import { delimiter, isAbsolute, join } from 'node:path';

/**
 * Resolve a command's executable to an absolute filesystem path, the way a
 * shell would find it: an absolute/relative path (containing a path
 * separator) is checked directly; a bare name is searched across `$PATH`
 * (and, on Windows, each `$PATHEXT` extension). Returns `undefined` if
 * nothing is found — this is best-effort display info for `lsproxy status`,
 * not a spawn-time guarantee (the daemon/session resolve the command
 * themselves when actually launching a server).
 */
export function resolveBinaryPath(cmd: string): string | undefined {
  if (!cmd) return undefined;
  if (cmd.includes('/') || cmd.includes('\\') || isAbsolute(cmd)) {
    return existsSync(cmd) ? cmd : undefined;
  }

  const pathDirs = (process.env['PATH'] ?? '').split(delimiter).filter(Boolean);
  const extensions =
    process.platform === 'win32' ? (process.env['PATHEXT'] ?? '.EXE;.CMD;.BAT').split(';') : [''];

  for (const dir of pathDirs) {
    for (const ext of extensions) {
      const candidate = join(dir, cmd + ext);
      if (!existsSync(candidate)) continue;
      try {
        accessSync(candidate, constants.X_OK);
        return candidate;
      } catch {
        continue; // exists but not executable — keep searching
      }
    }
  }
  return undefined;
}
