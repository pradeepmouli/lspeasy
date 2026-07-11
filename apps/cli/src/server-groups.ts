import { basename } from 'node:path';
import type { LanguageStatus } from '@lsproxy/proxy';
import { tokenizeCommand } from '@lspeasy/core';
import { resolveBinaryPath } from './resolve-binary.js';
import type { SourcedServer } from './resolve.js';

export interface ServerLanguageStatus {
  languageId: string;
  extensions: string[];
  status: 'running' | 'cold';
  healthy?: boolean;
  pid?: number;
  uptimeMs?: number;
  openDocuments?: number;
  requestsServed?: number;
}

export interface ServerGroupStatus {
  /** Display name — the resolved binary's basename (e.g.
   * "typescript-language-server"), not the lsp.json config key. */
  name: string;
  command: string;
  resolvedPath?: string;
  source: string;
  status: 'running' | 'cold';
  healthy?: boolean;
  /** True when this group's members disagree on status — see the design
   * doc's "optimistic" aggregation policy. */
  mixed: boolean;
  pid?: number;
  uptimeMs?: number;
  openDocuments?: number;
  requestsServed?: number;
  languages: ServerLanguageStatus[];
}

/**
 * Group per-language status entries by their server command — one entry per
 * distinct command, with every language it serves listed underneath.
 * "Optimistic" aggregation: the group is `running` if ANY member is
 * running, and its aggregate pid/uptime/stats come from that running
 * member; `mixed: true` flags when members disagree so the renderer can
 * show per-language detail instead of one clean status for the whole group.
 */
export function groupServerStatus(
  languages: readonly LanguageStatus[],
  sources: readonly SourcedServer[]
): ServerGroupStatus[] {
  const sourceByCommand = new Map(sources.map((s) => [s.command, s.source]));
  const groups = new Map<string, ServerGroupStatus>();

  for (const lang of languages) {
    const entry: ServerLanguageStatus = {
      languageId: lang.languageId,
      extensions: lang.extensions,
      status: lang.status,
      ...(lang.healthy !== undefined && { healthy: lang.healthy }),
      ...(lang.pid !== undefined && { pid: lang.pid }),
      ...(lang.uptimeMs !== undefined && { uptimeMs: lang.uptimeMs }),
      ...(lang.openDocuments !== undefined && { openDocuments: lang.openDocuments }),
      ...(lang.requestsServed !== undefined && { requestsServed: lang.requestsServed })
    };

    let group = groups.get(lang.command);
    if (!group) {
      const [cmdToken] = tokenizeCommand(lang.command);
      const resolvedPath = cmdToken ? resolveBinaryPath(cmdToken) : undefined;
      group = {
        name: basename(resolvedPath ?? cmdToken ?? lang.command),
        command: lang.command,
        ...(resolvedPath !== undefined && { resolvedPath }),
        source: sourceByCommand.get(lang.command) ?? '(unconfigured)',
        status: entry.status,
        ...(entry.healthy !== undefined && { healthy: entry.healthy }),
        mixed: false,
        ...(entry.pid !== undefined && { pid: entry.pid }),
        ...(entry.uptimeMs !== undefined && { uptimeMs: entry.uptimeMs }),
        ...(entry.openDocuments !== undefined && { openDocuments: entry.openDocuments }),
        ...(entry.requestsServed !== undefined && { requestsServed: entry.requestsServed }),
        languages: []
      };
      groups.set(lang.command, group);
    } else if (group.status !== entry.status) {
      group.mixed = true;
      if (entry.status === 'running') {
        group.status = 'running';
        if (entry.healthy !== undefined) group.healthy = entry.healthy;
        else delete group.healthy;
        if (entry.pid !== undefined) group.pid = entry.pid;
        else delete group.pid;
        if (entry.uptimeMs !== undefined) group.uptimeMs = entry.uptimeMs;
        else delete group.uptimeMs;
        if (entry.openDocuments !== undefined) group.openDocuments = entry.openDocuments;
        else delete group.openDocuments;
        if (entry.requestsServed !== undefined) group.requestsServed = entry.requestsServed;
        else delete group.requestsServed;
      }
    }
    group.languages.push(entry);
  }

  return [...groups.values()];
}
