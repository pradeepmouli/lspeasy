/**
 * Guards the invariant that makes lsproxy's cold start fast:
 *
 *   the `@lspeasy/core` barrel re-exports nothing that transitively imports zod.
 *
 * zod costs ~15-30ms to load plus ~17ms to construct the protocol schema
 * graph. That was ~45% of `lsproxy`'s cold start, paid by every consumer of
 * the barrel including ones that only wanted types and a transport. Nothing
 * failed when it crept in, which is exactly why it needs a test rather than a
 * comment.
 */
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const CORE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HOOK = resolve(CORE_ROOT, 'src/__graph-hook.mjs');

/**
 * Imports `specifier` in a CHILD process and reports whether zod appeared in
 * the resulting module graph. The child is not optional: vitest's own graph
 * already contains zod via other test files, so an in-process check would
 * report `true` no matter what the barrel does.
 */
function zodInGraphAfterImporting(specifier: string): boolean {
  const out = execFileSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
      const seen = [];
      const { register } = await import('node:module');
      const { pathToFileURL } = await import('node:url');
      const { MessageChannel } = await import('node:worker_threads');
      const { port1, port2 } = new MessageChannel();
      port1.on('message', (u) => seen.push(u));
      port1.unref();
      register(pathToFileURL(${JSON.stringify(HOOK)}).href, {
        parentURL: import.meta.url,
        data: { port: port2 },
        transferList: [port2]
      });
      await import(${JSON.stringify(specifier)});
      await new Promise((r) => setTimeout(r, 50));
      process.stdout.write(JSON.stringify(seen));
      `
    ],
    { cwd: CORE_ROOT, encoding: 'utf8' }
  );
  return (JSON.parse(out) as string[]).some((u) => /[/\\]node_modules[/\\].*zod/.test(u));
}

describe('@lspeasy/core barrel purity', () => {
  it('does not pull zod into the module graph', () => {
    expect(zodInGraphAfterImporting('./dist/index.js')).toBe(false);
  });

  // Control: without this, a probe that silently reported `false` for
  // everything would make the assertion above pass for the wrong reason.
  it('the schemas subpath does pull zod', () => {
    expect(zodInGraphAfterImporting('./dist/schemas.js')).toBe(true);
  });
});
