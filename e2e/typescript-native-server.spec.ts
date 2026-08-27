/**
 * Real-server compatibility check against TypeScript's native compiler LSP
 * (`tsc --lsp --stdio`, shipped directly by the `typescript` package since
 * the Go-ported compiler landed — the successor to the old
 * `@typescript/native-preview` / `tsgo` preview package). Unlike the rest of
 * `e2e/`, which drives `@lspeasy/server`'s in-repo mock server, this spawns
 * the real `tsc` binary to guard against protocol drift in an external,
 * fast-moving server implementation.
 *
 * Skipped when the environment's `tsc` doesn't support `--lsp` (added in the
 * TypeScript 7 native compiler) so this doesn't fail CI on older toolchains.
 */

import { execFileSync, spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { LSPClient } from '@lspeasy/client';
import type { WorkspaceEdit } from '@lspeasy/core';
import { StdioTransport } from '@lspeasy/core/node';

/** Collects target URIs from both `changes` and `documentChanges` — servers
 * may return either shape, and `tsc --lsp`'s choice isn't a stable contract
 * to assert on. */
function editedUris(edit: WorkspaceEdit): string[] {
  const fromChanges = Object.keys(edit.changes ?? {});
  const fromDocumentChanges = (edit.documentChanges ?? [])
    .map((dc) => ('textDocument' in dc ? dc.textDocument.uri : undefined))
    .filter((uri): uri is string => uri !== undefined);
  return [...fromChanges, ...fromDocumentChanges];
}

const FIXTURE_ROOT = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'typescript-native');

function tscSupportsLsp(): boolean {
  try {
    const version = execFileSync('tsc', ['--version'], { encoding: 'utf8' });
    const major = Number(version.match(/(\d+)\./)?.[1] ?? 0);
    return major >= 7;
  } catch {
    return false;
  }
}

describe.skipIf(!tscSupportsLsp())('TypeScript native compiler LSP (tsc --lsp --stdio)', () => {
  let proc: ChildProcessWithoutNullStreams;
  let client: LSPClient;

  beforeAll(async () => {
    proc = spawn('tsc', ['--lsp', '--stdio'], {
      cwd: FIXTURE_ROOT
    }) as ChildProcessWithoutNullStreams;
    const transport = new StdioTransport({ input: proc.stdout, output: proc.stdin });

    client = new LSPClient({
      name: 'lspeasy-e2e',
      version: '0.0.0',
      capabilities: {
        textDocument: {
          hover: { dynamicRegistration: false, contentFormat: ['plaintext', 'markdown'] },
          references: { dynamicRegistration: false },
          rename: { dynamicRegistration: false, prepareSupport: true },
          synchronization: {
            dynamicRegistration: false,
            willSave: false,
            willSaveWaitUntil: false,
            didSave: false
          }
        }
      },
      rootUri: pathToFileURL(FIXTURE_ROOT).href,
      workspaceFolders: [{ uri: pathToFileURL(FIXTURE_ROOT).href, name: 'typescript-native' }]
    });

    await client.connect(transport);

    for (const file of ['greet.ts', 'main.ts']) {
      const { readFileSync } = await import('node:fs');
      await client.sendNotification('textDocument/didOpen', {
        textDocument: {
          uri: pathToFileURL(join(FIXTURE_ROOT, file)).href,
          languageId: 'typescript',
          version: 1,
          text: readFileSync(join(FIXTURE_ROOT, file), 'utf8')
        }
      });
    }
    // Let the server finish loading the (tiny) project before the first request.
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }, 20000);

  afterAll(async () => {
    try {
      await client.disconnect();
    } catch {
      // Ignore
    }
    proc?.kill();
  });

  it('resolves the exported symbol via initialize + capabilities', () => {
    expect(client.serverCapabilities?.hoverProvider).toBeTruthy();
    expect(client.serverCapabilities?.referencesProvider).toBeTruthy();
    expect(client.serverCapabilities?.renameProvider).toBeTruthy();
  });

  it('hovers the exported function with its computed signature', async () => {
    const result = await client.textDocument.hover({
      textDocument: { uri: pathToFileURL(join(FIXTURE_ROOT, 'greet.ts')).href },
      position: { line: 0, character: 17 } // `greet` in `export function greet(...)`
    });

    const value =
      typeof result?.contents === 'object' && 'value' in result.contents
        ? result.contents.value
        : '';
    expect(value).toContain('greet');
    expect(value).toContain('string');
  });

  it('finds the cross-file reference from main.ts', async () => {
    const result = await client.textDocument.references({
      textDocument: { uri: pathToFileURL(join(FIXTURE_ROOT, 'greet.ts')).href },
      position: { line: 0, character: 17 },
      context: { includeDeclaration: true }
    });

    expect(result).not.toBeNull();
    const uris = (result ?? []).map((loc) => loc.uri);
    expect(uris.some((uri) => uri.endsWith('main.ts'))).toBe(true);
    expect(uris.some((uri) => uri.endsWith('greet.ts'))).toBe(true);
  });

  it('produces a cross-file WorkspaceEdit on rename', async () => {
    const edit = await client.textDocument.rename({
      textDocument: { uri: pathToFileURL(join(FIXTURE_ROOT, 'greet.ts')).href },
      position: { line: 0, character: 17 },
      newName: 'sayHello'
    });

    expect(edit).not.toBeNull();
    const changedUris = editedUris(edit as WorkspaceEdit);
    expect(changedUris.some((uri) => uri.endsWith('greet.ts'))).toBe(true);
    expect(changedUris.some((uri) => uri.endsWith('main.ts'))).toBe(true);
  });
});
