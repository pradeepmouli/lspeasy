/**
 * `lspeasy query <op> <file> <line:col>`
 *
 * Read-only parity ops (definition / references / hover) exposed for terminals
 * and CI that want the same position-driven interface as the write commands.
 * Always emits JSON on stdout (these are data ops, not edits).
 */

import { pathToFileURL } from 'node:url';

import { fail, parseLineCol, resolvePathArg, toLspPosition, type GlobalFlags } from '../io.js';
import { RefactorSession } from '../session.js';

const OPS = new Set(['definition', 'references', 'hover']);

export async function runQuery(
  args: { op: string; file: string; position: string },
  flags: GlobalFlags
): Promise<void> {
  if (!OPS.has(args.op))
    fail(`unknown query op "${args.op}" (definition | references | hover)`, true);
  const file = resolvePathArg(args.file, flags);
  const pos = toLspPosition(parseLineCol(args.position));

  const session = new RefactorSession({
    serverCommand: flags.server,
    root: flags.root,
    indexWaitMs: flags.waitMs,
    verbose: flags.verbose
  });

  try {
    await session.start();
    await session.openAndWait(file);

    const td = { textDocument: { uri: pathToFileURL(file).href }, position: pos };
    let result: unknown;
    if (args.op === 'definition') {
      result = await session.lsp.sendRequest('textDocument/definition', td);
    } else if (args.op === 'references') {
      result = await session.lsp.sendRequest('textDocument/references', {
        ...td,
        context: { includeDeclaration: true }
      });
    } else {
      result = await session.lsp.sendRequest('textDocument/hover', td);
    }

    process.stdout.write(JSON.stringify({ ok: true, op: args.op, result }) + '\n');
  } finally {
    await session.stop();
  }
}
