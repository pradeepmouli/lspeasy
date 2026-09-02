/**
 * Guards the invariant this whole workstream exists to establish:
 *
 *   importing the `lsproxy` CLI loads no zod, and none of the large generated
 *   help data.
 *
 * zod cost ~15-30ms to load plus ~17ms to construct the protocol schema graph
 * — roughly 45% of cold start — and nothing failed when it crept in, which is
 * why this is a test and not a comment. The generated JSON Schemas are ~1MB;
 * a single static import of them would trade zod's cost for a larger one, so
 * they are guarded here too.
 *
 * Importing `dist/cli.js` does not run the CLI: `main()` sits behind an
 * `isEntryPoint()` check, so this observes the startup module graph only.
 */
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const CLI_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const HOOK = resolve(CLI_ROOT, '../../packages/core/src/__graph-hook.mjs');

/**
 * Import `specifier` in a CHILD process and return every URL Node loaded. The
 * child is not optional: vitest's own graph already contains zod via other
 * test files, so an in-process check would report it no matter what the CLI
 * does.
 */
function graphAfterImporting(specifier: string): string[] {
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
    { cwd: CLI_ROOT, encoding: 'utf8' }
  );
  return JSON.parse(out) as string[];
}

const zodModules = (graph: string[]): string[] =>
  graph.filter((u) => /[/\\]node_modules[/\\].*zod/.test(u));

describe('lsproxy startup purity', () => {
  it('does not load zod when the CLI module is imported', () => {
    const zod = zodModules(graphAfterImporting('./dist/cli.js'));
    expect(zod, `zod reached the startup graph via ${zod[0] ?? ''}`).toEqual([]);
  });

  it('does not eagerly load the generated JSON schemas', () => {
    // ~1MB, and read only by `--help --json` via a dynamic import in
    // help.ts's drillDownJson. A static import would silently undo the win.
    const graph = graphAfterImporting('./dist/cli.js');
    expect(graph.some((u) => u.includes('generated/json-schemas'))).toBe(false);
    // Control: the small examples module IS expected on the startup graph, so
    // a probe that saw nothing at all would not pass this.
    expect(graph.some((u) => u.includes('generated/examples'))).toBe(true);
  });

  // Control: without this, a probe that silently reported an empty graph would
  // make the assertions above pass for the wrong reason.
  it('the core schemas subpath does pull zod', () => {
    expect(zodModules(graphAfterImporting('@lspeasy/core/schemas')).length).toBeGreaterThan(0);
  });
});
