import type {
  DidChangeTextDocumentParams,
  Range,
  TextDocumentContentChangeEvent,
  VersionedTextDocumentIdentifier
} from 'vscode-languageserver-protocol';

/**
 * Tracks per-document versions for change notifications.
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
 * Creates incremental didChange params from one or more range edits.
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
 * Creates full-document didChange params for full text replacement.
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
