import type { LspServerEntry } from '@lspeasy/core';

export type Tier = 'full' | 'plugin-resolved' | 'read-only';
export type Scope = 'user' | 'project';
export type CanonicalServers = Record<string, LspServerEntry>;

export interface WriteResult {
  path: string;
  written: string[];
  skipped: Array<{ name: string; reason: string }>;
}

export interface PlatformAdapter {
  id: string;
  name: string;
  tier: Tier;
  /** Is this platform's config present for the given scope? */
  detect(scope: Scope, root: string): boolean;
  /** The file this adapter reads/writes for the given scope. */
  configPath(scope: Scope, root: string): string;
  /** Native config → canonical servers. {} when absent. */
  read(scope: Scope, root: string): CanonicalServers;
  /** Canonical servers → native config. Absent ⇒ read-only adapter. */
  write?(servers: CanonicalServers, scope: Scope, root: string): WriteResult;
}
