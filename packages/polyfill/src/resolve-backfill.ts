// packages/polyfill/src/resolve-backfill.ts
import type { ServerCapabilities } from '@lspeasy/core';
import type { CodeActionPolyfill } from './types.js';

function hasNativeResolve(capabilities: ServerCapabilities): boolean {
  const provider = capabilities.codeActionProvider;
  if (!provider) return false;
  return typeof provider === 'object' && provider.resolveProvider === true;
}

export const resolveBackfill: CodeActionPolyfill = {
  id: 'resolve-backfill',

  appliesTo(capabilities) {
    return Boolean(capabilities.codeActionProvider) && !hasNativeResolve(capabilities);
  },

  patchCapabilities(capabilities) {
    const provider = capabilities.codeActionProvider;
    const base = typeof provider === 'object' ? provider : {};
    return { ...capabilities, codeActionProvider: { ...base, resolveProvider: true } };
  },

  async resolveCodeAction(action) {
    // Per the LSP spec, a server without resolveProvider must return fully
    // resolved actions from textDocument/codeAction already — echo unchanged.
    return action;
  }
};
