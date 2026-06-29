// 24-bit (truecolor) palette — Nord ("Minimalist Zen"), cohesive for a
// line-oriented dev CLI. Modern terminals render these directly and downsample
// gracefully on older ones.
const RGB = {
  green: [163, 190, 140], // nord14
  red: [191, 97, 106], // nord11
  yellow: [235, 203, 139], // nord13
  cyan: [136, 192, 208], // nord8 (frost) — namespaces
  blue: [129, 161, 193], // nord9 — methods/requests
  magenta: [180, 142, 173], // nord15 — options/flags
  teal: [143, 188, 187] // nord7 — positional arguments
} as const;
// bold/dim are SGR attributes, not colors.
const ATTR = { bold: 1, dim: 2 } as const;

export interface Formatter {
  green(s: string): string;
  red(s: string): string;
  yellow(s: string): string;
  cyan(s: string): string;
  blue(s: string): string;
  magenta(s: string): string;
  teal(s: string): string;
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
      blue: identity,
      magenta: identity,
      teal: identity,
      bold: identity,
      dim: identity
    };
  }
  return {
    green: (s) => rgb(RGB.green, s),
    red: (s) => rgb(RGB.red, s),
    yellow: (s) => rgb(RGB.yellow, s),
    cyan: (s) => rgb(RGB.cyan, s),
    blue: (s) => rgb(RGB.blue, s),
    magenta: (s) => rgb(RGB.magenta, s),
    teal: (s) => rgb(RGB.teal, s),
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
