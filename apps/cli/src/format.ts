// 24-bit (truecolor) palette — Nord ("Minimalist Zen"), cohesive for a
// line-oriented dev CLI. Modern terminals render these directly and downsample
// gracefully on older ones.
const RGB = {
  green: [163, 190, 140], // nord14
  red: [191, 97, 106], // nord11
  yellow: [235, 203, 139], // nord13
  cyan: [136, 192, 208] // nord8 (frost)
} as const;
// bold/dim are SGR attributes, not colors.
const ATTR = { bold: 1, dim: 2 } as const;

export interface Formatter {
  green(s: string): string;
  red(s: string): string;
  yellow(s: string): string;
  cyan(s: string): string;
  bold(s: string): string;
  dim(s: string): string;
}

function rgb([r, g, b]: readonly [number, number, number], s: string): string {
  return `\x1b[38;2;${r};${g};${b}m${s}\x1b[0m`;
}

function attr(code: number, s: string): string {
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
    return {
      green: identity,
      red: identity,
      yellow: identity,
      cyan: identity,
      bold: identity,
      dim: identity
    };
  }
  return {
    green: (s) => rgb(RGB.green, s),
    red: (s) => rgb(RGB.red, s),
    yellow: (s) => rgb(RGB.yellow, s),
    cyan: (s) => rgb(RGB.cyan, s),
    bold: (s) => attr(ATTR.bold, s),
    dim: (s) => attr(ATTR.dim, s)
  };
}

export const SYMBOLS = {
  running: '🟢',
  cold: '⚪',
  healthy: '✅',
  unhealthy: '❌',
  degraded: '🟡'
} as const;
