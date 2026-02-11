/**
 * File watching types for LSP protocol
 *
 * @module protocol/watching
 */

import type {
  DidChangeWatchedFilesParams,
  FileEvent,
  DidChangeWatchedFilesRegistrationOptions,
  FileSystemWatcher,
  WatchKind,
  FileChangeType
} from 'vscode-languageserver-protocol';

// Re-export file watching types
export type {
  DidChangeWatchedFilesParams,
  FileEvent,
  DidChangeWatchedFilesRegistrationOptions,
  FileSystemWatcher,
  WatchKind,
  FileChangeType
};

/**
 * Watch kinds for file system watchers
 */
export const WatchKinds = {
  Create: 1 as WatchKind,
  Change: 2 as WatchKind,
  Delete: 4 as WatchKind,
  All: 7 as WatchKind // Create | Change | Delete
} as const;

/**
 * Helper to create a FileEvent
 */
export function createFileEvent(uri: string, type: FileChangeType): FileEvent {
  return { uri, type };
}

/**
 * Helper to create a FileSystemWatcher
 */
export function createFileSystemWatcher(globPattern: string, kind?: WatchKind): FileSystemWatcher {
  if (kind === undefined) {
    return { globPattern };
  }
  return { globPattern, kind };
}

/**
 * Helper to create DidChangeWatchedFilesParams
 */
export function createDidChangeWatchedFilesParams(
  changes: FileEvent[]
): DidChangeWatchedFilesParams {
  return { changes };
}
