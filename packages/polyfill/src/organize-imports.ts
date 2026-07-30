// packages/polyfill/src/organize-imports.ts
import type { CodeAction, CodeActionParams, Command, ServerCapabilities } from '@lspeasy/core';
import type { LSPClient } from '@lspeasy/client';
import type { CodeActionPolyfill } from './types.js';
import { aggregateQuickFixes, isCodeAction } from './quickfix-aggregation.js';

function hasDiagnosticProvider(capabilities: ServerCapabilities): boolean {
  return Boolean(capabilities.diagnosticProvider);
}

function alreadyAdvertisesOrganizeImports(capabilities: ServerCapabilities): boolean {
  const provider = capabilities.codeActionProvider;
  return (
    typeof provider === 'object' &&
    Array.isArray(provider.codeActionKinds) &&
    provider.codeActionKinds.includes('source.organizeImports' as never)
  );
}

function requestsOrganizeImports(params: CodeActionParams): boolean {
  const only = params.context.only;
  if (!only) return false;
  return only.some((kind) => kind === 'source.organizeImports' || kind === 'source');
}

const IMPORT_FIX_TITLE = /import/i;

function isImportRelatedFix(action: CodeAction): boolean {
  return IMPORT_FIX_TITLE.test(action.title);
}

function pickImportFix(candidates: (Command | CodeAction)[]): CodeAction | undefined {
  const actions = candidates.filter(isCodeAction).filter(isImportRelatedFix);
  return actions.find((a) => a.isPreferred) ?? actions[0];
}

export const organizeImports: CodeActionPolyfill = {
  id: 'organize-imports',

  appliesTo(capabilities) {
    return (
      Boolean(capabilities.codeActionProvider) &&
      hasDiagnosticProvider(capabilities) &&
      !alreadyAdvertisesOrganizeImports(capabilities)
    );
  },

  async augmentCodeActions(actions, params, backend: LSPClient) {
    if (!requestsOrganizeImports(params)) return actions;
    // The backend may implement source.organizeImports without advertising
    // it in codeActionKinds (e.g. codeActionProvider: true with no explicit
    // kind list) — if it already returned one, don't synthesize a duplicate.
    if (actions.some((a) => a.kind === 'source.organizeImports')) return actions;

    const { changes, mergedCount } = await aggregateQuickFixes(params, backend, pickImportFix);
    if (mergedCount === 0) return actions;

    return [
      ...actions,
      {
        title: 'Organize imports',
        kind: 'source.organizeImports',
        edit: { changes }
      }
    ];
  }
};
