import type { LanguageStatus, StatusReport } from '@lsproxy/proxy';
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
