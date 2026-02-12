import type {
  DidChangeTextDocumentParams,
  Range,
  TextDocumentContentChangeEvent,
  VersionedTextDocumentIdentifier
} from 'vscode-languageserver-protocol';

export class DocumentVersionTracker {
  private readonly versions = new Map<string, number>();

  open(uri: string, initialVersion: number = 0): void {
    this.versions.set(uri, initialVersion);
  }

  nextVersion(uri: string): number {
    const current = this.versions.get(uri) ?? 0;
    const next = current + 1;
    this.versions.set(uri, next);
    return next;
  }

  currentVersion(uri: string): number | undefined {
    return this.versions.get(uri);
  }

  close(uri: string): void {
    this.versions.delete(uri);
  }
}

export interface VersionSource {
  version?: number;
  tracker?: DocumentVersionTracker;
}

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
