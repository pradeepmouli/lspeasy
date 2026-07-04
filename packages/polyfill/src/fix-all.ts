// packages/polyfill/src/fix-all.ts
import type {
  CodeAction,
  CodeActionParams,
  Command,
  Diagnostic,
  Position,
  ServerCapabilities,
  TextEdit
} from '@lspeasy/core';
import type { LSPClient } from '@lspeasy/client';
import type { CodeActionPolyfill } from './types.js';

function hasDiagnosticProvider(capabilities: ServerCapabilities): boolean {
  return Boolean(capabilities.diagnosticProvider);
}

function alreadyAdvertisesFixAll(capabilities: ServerCapabilities): boolean {
  const provider = capabilities.codeActionProvider;
  return (
    typeof provider === 'object' &&
    Array.isArray(provider.codeActionKinds) &&
    provider.codeActionKinds.includes('source.fixAll' as never)
  );
}

function requestsFixAll(params: CodeActionParams): boolean {
  const only = params.context.only;
  if (!only) return false;
  return only.some((kind) => kind === 'source.fixAll' || kind === 'source');
}

function isCodeAction(item: Command | CodeAction): item is CodeAction {
  return typeof item.command !== 'string';
}

function pickFix(candidates: (Command | CodeAction)[]): CodeAction | undefined {
  const actions = candidates.filter(isCodeAction);
  return actions.find((a) => a.isPreferred) ?? actions[0];
}

function supportsResolve(capabilities: ServerCapabilities): boolean {
  const provider = capabilities.codeActionProvider;
  return typeof provider === 'object' && provider.resolveProvider === true;
}

function comparePositions(a: Position, b: Position): number {
  return a.line !== b.line ? a.line - b.line : a.character - b.character;
}

function rangesOverlap(a: TextEdit['range'], b: TextEdit['range']): boolean {
  return comparePositions(a.start, b.end) < 0 && comparePositions(b.start, a.end) < 0;
}

function mergeEdits(existing: TextEdit[], incoming: TextEdit[]): TextEdit[] {
  const merged = [...existing];
  for (const edit of incoming) {
    if (merged.some((m) => rangesOverlap(m.range, edit.range))) continue;
    merged.push(edit);
  }
  return merged;
}

export const fixAll: CodeActionPolyfill = {
  id: 'fix-all',

  appliesTo(capabilities) {
    return (
      Boolean(capabilities.codeActionProvider) &&
      hasDiagnosticProvider(capabilities) &&
      !alreadyAdvertisesFixAll(capabilities)
    );
  },

  async augmentCodeActions(actions, params, backend: LSPClient) {
    if (!requestsFixAll(params)) return actions;

    const report = (await (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(
      'textDocument/diagnostic',
      { textDocument: params.textDocument }
    )) as { kind: 'full' | 'unchanged'; items?: Diagnostic[] };
    const diagnostics = report.kind === 'full' ? (report.items ?? []) : [];

    const capabilities = backend.getServerCapabilities() ?? {};
    const changes: Record<string, TextEdit[]> = {};
    let mergedCount = 0;

    for (const diagnostic of diagnostics) {
      const candidates = (await (
        backend.sendRequest as (m: string, p: unknown) => Promise<unknown>
      )('textDocument/codeAction', {
        textDocument: params.textDocument,
        range: diagnostic.range,
        context: { diagnostics: [diagnostic], only: ['quickfix'] }
      })) as (Command | CodeAction)[] | null;

      let fix = candidates ? pickFix(candidates) : undefined;
      if (fix && !fix.edit?.changes && fix.command && supportsResolve(capabilities)) {
        fix = (await (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(
          'codeAction/resolve',
          fix
        )) as CodeAction;
      }
      if (!fix?.edit?.changes) continue;

      let mergedAny = false;
      for (const [uri, edits] of Object.entries(fix.edit.changes)) {
        if (edits.length === 0) continue;
        changes[uri] = mergeEdits(changes[uri] ?? [], edits);
        mergedAny = true;
      }
      if (mergedAny) mergedCount += 1;
    }

    if (mergedCount === 0) return actions;

    return [
      ...actions,
      {
        title: 'Fix all auto-fixable problems',
        kind: 'source.fixAll',
        edit: { changes }
      }
    ];
  }
};
