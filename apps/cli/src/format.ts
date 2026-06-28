const CODES = { green: 32, red: 31, yellow: 33, dim: 2 } as const;

export interface Formatter {
  green(s: string): string;
  red(s: string): string;
  yellow(s: string): string;
  dim(s: string): string;
}

function wrap(code: number, s: string): string {
  return `\x1b[${code}m${s}\x1b[0m`;
}

/**
 * Build a color formatter. When `enabled` is false every method returns its
 * argument unchanged, guaranteeing zero ANSI bytes (used for pipes, CI, and
 * `--json`). Callers gate `enabled` on
 * `process.stdout.isTTY && !process.env.NO_COLOR && !flags.json`.
 */
export function createFormatter(enabled: boolean): Formatter {
  if (!enabled) {
    const identity = (s: string): string => s;
    return { green: identity, red: identity, yellow: identity, dim: identity };
  }
  return {
    green: (s) => wrap(CODES.green, s),
    red: (s) => wrap(CODES.red, s),
    yellow: (s) => wrap(CODES.yellow, s),
    dim: (s) => wrap(CODES.dim, s)
  };
}

export const SYMBOLS = {
  running: '●',
  cold: '○',
  healthy: '✓',
  unhealthy: '✗',
  degraded: '⚠'
} as const;
