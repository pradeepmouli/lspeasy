// apps/polyfill/src/registry.ts
import type { ServerCapabilities } from '@lspeasy/core';
import type { CodeActionPolyfill } from './types.js';
import { resolveBackfill } from './resolve-backfill.js';
import { fixAll } from './fix-all.js';

export const BUILTIN_POLYFILLS: readonly CodeActionPolyfill[] = [resolveBackfill, fixAll];

export function applicablePolyfills(capabilities: ServerCapabilities): CodeActionPolyfill[] {
  return BUILTIN_POLYFILLS.filter((p) => p.appliesTo(capabilities));
}
