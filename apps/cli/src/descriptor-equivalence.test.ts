import { describe, it, expect } from 'vitest';
import { LSPSchemas, getSchemaForMethod } from '@lspeasy/core/schemas';

import { COMMAND_DESCRIPTORS } from './generated/command-descriptors.js';
import { detectArgPattern, legacyFlagSurface, zodToCommander } from './zod-to-commander.js';
import type { GlobalFlags } from './io.js';
import type { RefactorSession } from './session.js';

/**
 * The gate that licenses deleting the runtime walker in Task 7.
 *
 * Task 2 generated `COMMAND_DESCRIPTORS` by porting the walking logic out of
 * `zod-to-commander.ts`. Task 4 then switched `zodToCommander` to render those
 * descriptors instead of walking schemas. This file is the only thing standing
 * between "the port looked right" and "the port IS right".
 *
 * Since Task 4 it compares the two IMPLEMENTATIONS end-to-end: the command
 * `zodToCommander` now builds from descriptors, against the command
 * `legacyFlagSurface` builds by walking the schema the old way. That is the
 * user-facing property — the CLI's flag surface did not change — rather than
 * the weaker "the generated table is self-consistent".
 *
 * If a case here fails, fix the GENERATOR or the renderer — never the
 * assertions.
 */

const METHODS = Object.keys(LSPSchemas);

const FLAGS: GlobalFlags = {
  server: '',
  root: '/project',
  dryRun: false,
  json: false,
  verbose: false,
  waitMs: 15000,
  allowOutsideRoot: true,
  overwrite: false,
  noProxy: false
};

// zodToCommander only touches the session inside the action handler, which is
// never invoked when we are just inspecting registered options.
const STUB_SESSION = {} as RefactorSession;

function longFlags(cmd: { options: ReadonlyArray<{ long: string | null }> }): string[] {
  return cmd.options
    .map((o) => o.long)
    .filter((l): l is string => typeof l === 'string' && l !== '--params')
    .sort();
}

/** The flags the RETAINED schema walker registers. */
function walkerFlags(method: string): string[] {
  return longFlags(legacyFlagSurface(method, getSchemaForMethod(method)!));
}

/** The flags the descriptor-driven `zodToCommander` actually registers today. */
function renderedFlags(method: string): string[] {
  return longFlags(zodToCommander(method, COMMAND_DESCRIPTORS[method]!, STUB_SESSION, FLAGS));
}

function descriptorFlags(method: string): string[] {
  return (COMMAND_DESCRIPTORS[method]?.fields ?? []).map((f) => `--${f.cliKey}`).sort();
}

describe('generated descriptors match the runtime walker', () => {
  it('covers every method in LSPSchemas', () => {
    for (const m of METHODS) {
      if (getSchemaForMethod(m)) expect(COMMAND_DESCRIPTORS[m], m).toBeDefined();
    }
  });

  it.each(METHODS)('pattern matches for %s', (method) => {
    const schema = getSchemaForMethod(method);
    if (!schema) return;
    expect(COMMAND_DESCRIPTORS[method]?.pattern).toBe(detectArgPattern(schema));
  });

  it.each(METHODS)('flag surface matches for %s', (method) => {
    const schema = getSchemaForMethod(method);
    if (!schema) return;
    const descriptor = COMMAND_DESCRIPTORS[method];
    expect(descriptor, method).toBeDefined();

    // Every descriptor cliKey must be unique — a collision would silently drop a
    // flag when Commander registers the second one.
    const keys = descriptor!.fields.map((f) => f.cliKey);
    expect(new Set(keys).size, `duplicate cliKey in ${method}`).toBe(keys.length);

    // The property Task 7 actually relies on: the descriptors produce exactly the
    // flags the walker does — no additions, no omissions.
    expect(descriptorFlags(method), method).toEqual(walkerFlags(method));

    // …and the renderer is faithful to the descriptors, so the CLI surface a
    // user sees is unchanged by the switch.
    expect(renderedFlags(method), method).toEqual(walkerFlags(method));
  });

  it.each(METHODS)('choice surface matches for %s', (method) => {
    const schema = getSchemaForMethod(method);
    if (!schema) return;
    const cmd = zodToCommander(method, COMMAND_DESCRIPTORS[method]!, STUB_SESSION, FLAGS);
    const legacy = legacyFlagSurface(method, schema);

    for (const field of COMMAND_DESCRIPTORS[method]?.fields ?? []) {
      const opt = cmd.options.find((o) => o.long === `--${field.cliKey}`);
      expect(opt, `${method} ${field.cliKey}`).toBeDefined();

      // Scalar ARRAYS carry their valid values in the description, not via
      // Commander .choices() — a comma-separated value would fail choice
      // validation. Only non-array leaves get argChoices. Task 4 must preserve
      // that asymmetry, so pin it here.
      if (field.isArray || field.choices === undefined) {
        expect(opt?.argChoices, `${method} ${field.cliKey}`).toBeUndefined();
      } else {
        expect(opt?.argChoices, `${method} ${field.cliKey}`).toEqual([...field.choices]);
      }

      // And identical to what the schema walker produced for the same flag.
      const legacyOpt = legacy.options.find((o) => o.long === `--${field.cliKey}`);
      expect(opt?.argChoices, `${method} ${field.cliKey}`).toEqual(legacyOpt?.argChoices);
      expect(opt?.description, `${method} ${field.cliKey}`).toBe(legacyOpt?.description);
    }
  });
});
