import type { ConfiguredServer } from '@lspeasy/core';

export interface BackendRuntime {
  languageId: string;
  pid: number;
  startedAt: number;
  requestCount: number;
  healthy: boolean;
}

export interface LanguageStatus {
  languageId: string;
  name: string;
  extensions: string[];
  command: string;
  status: 'running' | 'cold';
  healthy?: boolean;
  pid?: number;
  uptimeMs?: number;
  openDocuments?: number;
  requestsServed?: number;
}

export interface DaemonStatus {
  pid: number;
  uptimeMs: number;
  root: string;
  sessions: number;
  backends: number;
}

export interface StatusReport {
  daemon: DaemonStatus | null;
  languages: LanguageStatus[];
}

export interface BuildStatusInput {
  now: number;
  daemonPid: number;
  daemonStartedAt: number;
  root: string;
  sessions: number;
  configured: ConfiguredServer[];
  backends: BackendRuntime[];
  openDocsByLanguage: Record<string, number>;
}

/** Group a server's extensions by the languageId they map to. */
function extensionsByLanguage(server: ConfiguredServer): Map<string, string[]> {
  const byLang = new Map<string, string[]>();
  for (const [ext, languageId] of Object.entries(server.fileExtensions)) {
    const list = byLang.get(languageId) ?? [];
    list.push(ext);
    byLang.set(languageId, list);
  }
  return byLang;
}

function coldLanguages(configured: ConfiguredServer[]): LanguageStatus[] {
  const out: LanguageStatus[] = [];
  for (const server of configured) {
    for (const [languageId, extensions] of extensionsByLanguage(server)) {
      out.push({
        languageId,
        name: server.name,
        extensions,
        command: server.command,
        status: 'cold'
      });
    }
  }
  return out;
}

export function buildStatusReport(input: BuildStatusInput): StatusReport {
  const byLang = new Map(input.backends.map((b) => [b.languageId, b]));
  const languages: LanguageStatus[] = [];
  for (const server of input.configured) {
    for (const [languageId, extensions] of extensionsByLanguage(server)) {
      const rt = byLang.get(languageId);
      if (rt) {
        languages.push({
          languageId,
          name: server.name,
          extensions,
          command: server.command,
          status: 'running',
          healthy: rt.healthy,
          pid: rt.pid,
          uptimeMs: input.now - rt.startedAt,
          openDocuments: input.openDocsByLanguage[languageId] ?? 0,
          requestsServed: rt.requestCount
        });
      } else {
        languages.push({
          languageId,
          name: server.name,
          extensions,
          command: server.command,
          status: 'cold'
        });
      }
    }
  }
  return {
    daemon: {
      pid: input.daemonPid,
      uptimeMs: input.now - input.daemonStartedAt,
      root: input.root,
      sessions: input.sessions,
      backends: input.backends.length
    },
    languages
  };
}

/** Status view when the daemon is unreachable: null daemon, all languages cold. */
export function coldStatusReport(configured: ConfiguredServer[]): StatusReport {
  return { daemon: null, languages: coldLanguages(configured) };
}
