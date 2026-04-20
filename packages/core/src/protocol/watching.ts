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
 * Helper to create a FileEvent.
 *
 * @param uri - The URI of the changed file.
 * @param type - The type of file change (created, changed, or deleted).
 * @returns A `FileEvent` object.
 */
export function createFileEvent(uri: string, type: FileChangeType): FileEvent {
  return { uri, type };
}

/**
 * Helper to create a FileSystemWatcher.
 *
 * @param globPattern - Glob pattern to watch (e.g. "**\/*.ts").
 * @param kind - The watch kinds to subscribe to; defaults to all (create, change, delete).
 * @returns A `FileSystemWatcher` object.
 */
export function createFileSystemWatcher(globPattern: string, kind?: WatchKind): FileSystemWatcher {
  if (kind === undefined) {
    return { globPattern };
  }
  return { globPattern, kind };
}

/**
 * Helper to create DidChangeWatchedFilesParams.
 *
 * @param changes - Array of file events describing each changed file.
 * @returns A `DidChangeWatchedFilesParams` ready to send.
 */
export function createDidChangeWatchedFilesParams(
  changes: FileEvent[]
): DidChangeWatchedFilesParams {
  return { changes };
}
