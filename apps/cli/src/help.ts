import type { LanguageStatus, StatusReport } from '@lsproxy/proxy';
import type { Command } from 'commander';
import { SYMBOLS, type Formatter } from './format.js';

function languageLine(lang: LanguageStatus, fmt: Formatter): string {
  const exts = lang.extensions.join(' ');
  if (lang.status !== 'running') {
    return `  ${fmt.dim(SYMBOLS.cold)} ${lang.languageId}  ${fmt.dim(exts)}  ${fmt.dim('(cold)')}`;
  }
  const mark = lang.healthy ? fmt.green(SYMBOLS.running) : fmt.yellow(SYMBOLS.degraded);
  const health = lang.healthy ? fmt.green(SYMBOLS.healthy) : fmt.red(SYMBOLS.unhealthy);
  const stats = fmt.dim(
    `pid ${lang.pid} · up ${Math.round((lang.uptimeMs ?? 0) / 1000)}s · ` +
      `${lang.openDocuments ?? 0} docs · ${lang.requestsServed ?? 0} reqs`
  );
  return `  ${mark} ${lang.languageId}  ${fmt.dim(exts)}  ${health} ${stats}`;
}

/** Render the top-level `lsproxy` view: configured languages + live status. */
export function renderTopLevel(report: StatusReport, fmt: Formatter): string {
  const header =
    report.daemon === null
      ? fmt.dim('daemon: down — showing configured languages only')
      : fmt.dim(
          `daemon: up · pid ${report.daemon.pid} · ` +
            `${report.daemon.backends} backend(s) · ${report.daemon.sessions} session(s)`
        );
  const lines = report.languages.map((l) => languageLine(l, fmt));
  const footer = [
    '',
    'Drill down:',
    '  lsproxy --help <language>             namespaces for that server',
    '  lsproxy --help <language> <namespace> requests in that namespace',
    '  lsproxy --help <language> <namespace> <request>  parameter schema'
  ].join('\n');
  return ['lsproxy — LSP-driven CLI', '', header, '', 'Languages:', ...lines, footer, ''].join(
    '\n'
  );
}

export type NavResult = { command: Command } | { error: string; available: string[] };

/** Walk `program` → namespace → request along `path`; report siblings on a miss. */
export function navigateTree(program: Command, path: string[]): NavResult {
  let node = program;
  for (let i = 0; i < path.length; i++) {
    const name = path[i]!;
    const next = node.commands.find((c) => c.name() === name);
    if (!next) {
      const level = i === 0 ? 'namespace' : 'request';
      return {
        error: `Unknown ${level} "${name}".`,
        available: node.commands.map((c) => c.name()).sort()
      };
    }
    node = next;
  }
  return { command: node };
}

export function renderDrillDownText(
  program: Command,
  path: string[]
): { ok: boolean; text: string } {
  const result = navigateTree(program, path);
  if ('error' in result) {
    return { ok: false, text: `${result.error}\nAvailable: ${result.available.join(', ')}\n` };
  }
  return { ok: true, text: result.command.helpInformation() };
}

interface OptionInfo {
  flags: string;
  description: string;
  required: boolean;
}

function optionInfos(command: Command): OptionInfo[] {
  return command.options.map((o) => ({
    flags: o.flags,
    description: o.description,
    required: o.required === true
  }));
}

/** Structured drill-down for `--json`: namespaces, requests, or request options. */
export function drillDownJson(program: Command, languageId: string, path: string[]): unknown {
  const result = navigateTree(program, path);
  if ('error' in result) {
    return { ok: false, languageId, error: result.error, available: result.available };
  }
  const node = result.command;
  if (path.length === 0) {
    return {
      ok: true,
      languageId,
      namespaces: node.commands.map((ns) => ({
        name: ns.name(),
        requests: ns.commands.map((r) => r.name())
      }))
    };
  }
  if (path.length === 1) {
    return {
      ok: true,
      languageId,
      namespace: path[0],
      requests: node.commands.map((r) => r.name())
    };
  }
  return {
    ok: true,
    languageId,
    namespace: path[0],
    request: path[1],
    options: optionInfos(node)
  };
}
