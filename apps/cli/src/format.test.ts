import { describe, expect, it } from 'vitest';
import { createFormatter, SYMBOLS } from './format.js';

describe('createFormatter', () => {
  it('emits ANSI codes when enabled', () => {
    const fmt = createFormatter(true);
    const green = fmt.green('ok');
    expect(green).toContain('\x1b[');
    expect(green).toContain('ok');
  });

  it('returns the raw string unchanged when disabled (no ANSI bytes)', () => {
    const fmt = createFormatter(false);
    expect(fmt.green('ok')).toBe('ok');
    expect(fmt.red('x')).toBe('x');
    expect(fmt.dim('y')).toBe('y');
    expect(fmt.green('z')).not.toContain('\x1b');
  });

  it('exposes status glyphs', () => {
    expect(SYMBOLS.running).toBe('●');
    expect(SYMBOLS.cold).toBe('○');
  });
});
