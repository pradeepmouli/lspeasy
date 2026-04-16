import type {
  DidChangeTextDocumentParams,
  Range,
  TextDocumentContentChangeEvent,
  VersionedTextDocumentIdentifier
} from 'vscode-languageserver-protocol';

/**
 * Tracks monotonically increasing version numbers for open text documents.
 *
 * @remarks
 * The LSP spec requires `DidChangeTextDocumentParams.textDocument.version` to
 * increment with every change notification. Use `DocumentVersionTracker` to
 * manage version numbers centrally rather than maintaining ad-hoc counters in
 * each document model.
 *
 * @useWhen
 * You are building an LSP client that sends `textDocument/didChange`
 * notifications and need to track per-document version counters.
 *
 * @pitfalls
 * NEVER send a `textDocument/didChange` with the same version number as a
 * previous change for the same document. The server may reject the change as
 * a no-op or apply it out of order, causing text state desync.
 *
 * @example
 * ```ts
 * import { DocumentVersionTracker, createIncrementalDidChangeParams } from '@lspeasy/core';
 *
 * const tracker = new DocumentVersionTracker();
 * tracker.open('file:///src/main.ts');
 *
 * const params = createIncrementalDidChangeParams(
 *   'file:///src/main.ts',
 *   [{ range: { start: { line: 0, character: 0 }, end: { line: 0, character: 5 } }, text: 'hello' }],
 *   { tracker }
 * );
 * await client.sendNotification('textDocument/didChange', params);
 * ```
 *
 * @category Document
 */
export class DocumentVersionTracker {
  private readonly versions = new Map<string, number>();

  /**
   * Starts tracking a document URI with an optional initial version.
   */
  open(uri: string, initialVersion: number = 0): void {
    this.versions.set(uri, initialVersion);
  }

  /**
   * Increments and returns the next document version.
   */
  nextVersion(uri: string): number {
    const current = this.versions.get(uri) ?? 0;
    const next = current + 1;
    this.versions.set(uri, next);
    return next;
  }

  /**
   * Returns the current tracked version, if any.
   */
  currentVersion(uri: string): number | undefined {
    return this.versions.get(uri);
  }

  /**
   * Stops tracking a document URI.
   */
  close(uri: string): void {
    this.versions.delete(uri);
  }
}

/**
 * Source of version information for helper constructors.
 */
export interface VersionSource {
  version?: number;
  tracker?: DocumentVersionTracker;
}

/**
 * Represents a single incremental text document change.
 */
export interface IncrementalChange {
  range: Range;
  text: string;
  rangeLength?: number;
}

function resolveVersion(uri: string, source: VersionSource): number {
  if (typeof source.version === 'number') {
    return source.version;
  }

  if (source.tracker) {
    return source.tracker.nextVersion(uri);
  }

  throw new Error('Either an explicit version or a DocumentVersionTracker must be provided');
}

function createIdentifier(uri: string, version: number): VersionedTextDocumentIdentifier {
  return {
    uri,
    version
  };
}

/**
 * Builds `DidChangeTextDocumentParams` for an incremental (range-based)
 * document change notification.
 *
 * @remarks
 * Use when the client tracks individual edits (e.g. single-character
 * insertions, deletions) rather than sending the full document text on each
 * change. Requires the server to have `textDocumentSync.change = Incremental`.
 *
 * @param uri - The document URI.
 * @param changes - One or more range-based text changes.
 * @param source - Either an explicit `version` number or a `tracker` instance.
 * @returns A `DidChangeTextDocumentParams` ready to send.
 * @throws If neither `version` nor `tracker` is provided.
 *
 * @category Document
 */
export function createIncrementalDidChangeParams(
  uri: string,
  changes: IncrementalChange[],
  source: VersionSource
): DidChangeTextDocumentParams {
  const version = resolveVersion(uri, source);
  const contentChanges: TextDocumentContentChangeEvent[] = changes.map((change) => ({
    range: change.range,
    text: change.text,
    rangeLength: change.rangeLength
  }));

  return {
    textDocument: createIdentifier(uri, version),
    contentChanges
  };
}

/**
 * Builds `DidChangeTextDocumentParams` for a full-document text replacement.
 *
 * @remarks
 * Use when the server only supports full-text synchronisation
 * (`textDocumentSync.change = Full`) or when tracking individual edits is
 * impractical (e.g. clipboard paste of a large file).
 *
 * @param uri - The document URI.
 * @param text - The complete new document text.
 * @param source - Either an explicit `version` number or a `tracker` instance.
 * @returns A `DidChangeTextDocumentParams` ready to send.
 * @throws If neither `version` nor `tracker` is provided.
 *
 * @category Document
 */
export function createFullDidChangeParams(
  uri: string,
  text: string,
  source: VersionSource
): DidChangeTextDocumentParams {
  const version = resolveVersion(uri, source);
  const contentChanges: TextDocumentContentChangeEvent[] = [{ text }];

  return {
    textDocument: createIdentifier(uri, version),
    contentChanges
  };
}
