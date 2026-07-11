// apps/cli/src/connect.proxy-bin-resolution.test.ts
//
// Regression coverage for GitHub issue #205: PROXY_BIN in connect.ts used to be
// computed as `new URL('../../proxy/dist/main.js', import.meta.url).pathname`,
// which hardcodes the assumption that @lsproxy/cli and @lsproxy/proxy are
// always sibling directories under the same parent. That's true in this
// monorepo's own dev layout (real directory siblings), so a test that only
// runs against THIS repo's layout would never catch the bug. A real user
// reported that `npm install -g @lsproxy/cli` produced a nested (not hoisted)
// layout instead:
//
//   <prefix>/@lsproxy/cli/
//     dist/connect.js
//     node_modules/@lsproxy/proxy/dist/main.js   <-- nested, NOT a sibling
//
// The hardcoded relative path resolves to `<prefix>/@lsproxy/proxy/dist/main.js`
// in that layout, which was never created, so daemon spawn failed with
// MODULE_NOT_FOUND. The fix replaces the hardcoded path with real module
// resolution: `fileURLToPath(import.meta.resolve('@lsproxy/proxy/dist/main.js'))`,
// which walks node_modules from the calling module's own location exactly like
// a real import/require would, so it finds the package wherever npm/pnpm
// actually placed it.
//
// import.meta.resolve is resolved relative to the *calling module's own file
// location* on disk, so it can't be exercised in-process against a fake
// layout — connect.ts is already loaded from its real location in this repo.
// Instead, this test builds a real, minimal filesystem fixture in a scratch
// temp directory that reproduces the issue's exact nested (non-hoisted)
// node_modules shape, places a real script at the fixture's simulated CLI
// location, and spawns it as a real child process — matching this codebase's
// established preference for real fixtures over mocks (see
// apps/proxy/src/backend-pool.spawn-error.test.ts).
import { describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

describe('PROXY_BIN resolution (real nested node_modules fixture, no mocks)', () => {
  it('resolves @lsproxy/proxy/dist/main.js via real module resolution when nested under @lsproxy/cli/node_modules (not hoisted to a sibling)', () => {
    const scratch = mkdtempSync(join(tmpdir(), 'lspeasy-proxy-bin-resolution-'));
    try {
      // Reproduce the issue's exact reported layout:
      //   <scratch>/node_modules/@lsproxy/cli/dist/connect.mjs   (stand-in for the real connect.js)
      //   <scratch>/node_modules/@lsproxy/cli/node_modules/@lsproxy/proxy/dist/main.js  (nested, not a sibling)
      const cliDir = join(scratch, 'node_modules', '@lsproxy', 'cli');
      const cliDistDir = join(cliDir, 'dist');
      const nestedProxyDir = join(cliDir, 'node_modules', '@lsproxy', 'proxy');
      const nestedProxyDistDir = join(nestedProxyDir, 'dist');
      mkdirSync(cliDistDir, { recursive: true });
      mkdirSync(nestedProxyDistDir, { recursive: true });

      writeFileSync(
        join(cliDir, 'package.json'),
        JSON.stringify({ name: '@lsproxy/cli', version: '0.0.0-fixture', type: 'module' }, null, 2),
        'utf8'
      );

      // The nested proxy package's exports map, matching the real fix in
      // apps/proxy/package.json: a "./dist/main.js" subpath export. Node's ESM
      // resolver strictly enforces the exports map when present, so without
      // this subpath, import.meta.resolve would throw ERR_PACKAGE_PATH_NOT_EXPORTED
      // even for a correctly-nested package.
      writeFileSync(
        join(nestedProxyDir, 'package.json'),
        JSON.stringify(
          {
            name: '@lsproxy/proxy',
            version: '0.0.0-fixture',
            type: 'module',
            exports: {
              '.': { types: './dist/index.d.ts', import: './dist/index.js' },
              './dist/main.js': './dist/main.js'
            }
          },
          null,
          2
        ),
        'utf8'
      );
      const nestedMainPath = join(nestedProxyDistDir, 'main.js');
      writeFileSync(
        nestedMainPath,
        '// fixture stand-in for the real @lsproxy/proxy CLI entry\n',
        'utf8'
      );

      // A real script placed at the fixture's simulated CLI dist location,
      // exercising the exact same expression connect.ts uses.
      const probeScript = join(cliDistDir, 'connect.mjs');
      writeFileSync(
        probeScript,
        [
          "import { fileURLToPath } from 'node:url';",
          "const resolved = fileURLToPath(import.meta.resolve('@lsproxy/proxy/dist/main.js'));",
          'process.stdout.write(resolved);'
        ].join('\n'),
        'utf8'
      );

      // The OLD hardcoded-relative-path code, evaluated for this exact fixture
      // layout: '../../proxy/dist/main.js' resolved against probeScript's own
      // location walks up two directories from cli/dist -> cli -> @lsproxy,
      // then into 'proxy/dist/main.js' — i.e. a HOISTED sibling location that
      // was never created in this (deliberately nested-only) fixture.
      const oldHardcodedPath = fileURLToPath(
        new URL('../../proxy/dist/main.js', pathToFileURL(probeScript))
      );
      expect(existsSync(oldHardcodedPath)).toBe(false);

      // The NEW code (real module resolution) correctly finds the nested copy.
      // Compare via realpath: on macOS, os.tmpdir() lives under a symlinked
      // /var -> /private/var, and Node's resolver canonicalizes that away, so
      // a literal string comparison against the un-canonicalized fixture path
      // would spuriously fail even though it's the same file.
      const output = execFileSync(process.execPath, [probeScript], { encoding: 'utf8' });
      expect(existsSync(output)).toBe(true);
      expect(realpathSync(output)).toBe(realpathSync(nestedMainPath));
    } finally {
      rmSync(scratch, { recursive: true, force: true });
    }
  });
});
