import type { LanguageStatus, StatusReport } from '@lsproxy/proxy';
import type { Command } from 'commander';
import { z } from 'zod';
import { exampleFromZod, getResultSchemaForMethod, getSchemaForMethod } from '@lspeasy/core';
import { SYMBOLS, type Formatter } from './format.js';

function methodForPath(path: string[]): string | undefined {
  return path.length >= 2 ? `${path[0]}/${path[1]}` : undefined;
}

function safeJsonSchema(schema: z.ZodType | undefined): unknown {
  if (!schema) return undefined;
  try {
    return z.toJSONSchema(schema);
  } catch {
    return undefined;
  }
}

function safeExample(schema: z.ZodType): unknown | undefined {
  try {
    return exampleFromZod(schema);
  } catch {
    return undefined;
  }
}

function languageLine(lang: LanguageStatus, fmt: Formatter): string {
  const exts = lang.extensions.join(' ');
  const name = fmt.cyan(lang.languageId);
  // Emoji markers carry their own color, so they are not wrapped in fmt.*.
  if (lang.status !== 'running') {
    return `  ${SYMBOLS.cold} ${name}  ${fmt.dim(exts)}  ${fmt.dim('(cold)')}`;
  }
  const mark = lang.healthy ? SYMBOLS.running : SYMBOLS.degraded;
  const health = lang.healthy ? SYMBOLS.healthy : SYMBOLS.unhealthy;
  const stats = fmt.dim(
    `pid ${lang.pid} · up ${Math.round((lang.uptimeMs ?? 0) / 1000)}s · ` +
      `${lang.openDocuments ?? 0} docs · ${lang.requestsServed ?? 0} reqs`
  );
  return `  ${mark} ${name}  ${fmt.dim(exts)}  ${health} ${stats}`;
}

/** One-line daemon status: "daemon: up · pid … · N backend(s) · M session(s)"
 *  or "daemon: not started". Shared by the top-level view and `daemon status`. */
export function daemonStatusLine(daemon: StatusReport['daemon'], fmt: Formatter): string {
  return daemon === null
    ? `${fmt.dim('daemon: ')}${fmt.yellow('not started')}`
    : `${fmt.dim('daemon: ')}${fmt.green('up')}${fmt.dim(
        ` · pid ${daemon.pid} · ${daemon.backends} backend(s) · ${daemon.sessions} session(s)`
      )}`;
}

/** Render the top-level `lsproxy` view: configured languages + live status. */
export function renderTopLevel(report: StatusReport, fmt: Formatter): string {
  const header =
    report.daemon === null
      ? daemonStatusLine(report.daemon, fmt) +
        fmt.dim(' — starts on first request; showing configured languages only')
      : daemonStatusLine(report.daemon, fmt);
  const lines = report.languages.map((l) => languageLine(l, fmt));
  // Color only the command portion of each hint; keep the description dim. Pad
  // the plain command before coloring so alignment is by visible width (ANSI
  // bytes don't count toward padEnd).
  const hint = (cmd: string, desc: string): string =>
    `  ${fmt.cyan(cmd.padEnd(48))}  ${fmt.dim(desc)}`;
  const footer = [
    '',
    fmt.bold('Drill down:'),
    hint('lsproxy --help <language>', 'namespaces for that server'),
    hint('lsproxy --help <language> <namespace>', 'requests in that namespace'),
    hint('lsproxy --help <language> <namespace> <request>', 'parameter schema')
  ].join('\n');
  return [
    fmt.bold('lsproxy — LSP-driven CLI'),
    '',
    header,
    '',
    fmt.bold('Languages:'),
    ...lines,
    footer,
    ''
  ].join('\n');
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
  path: string[],
  fmt?: Formatter
): { ok: boolean; text: string } {
  const navResult = navigateTree(program, path);
  if ('error' in navResult) {
    return {
      ok: false,
      text: `${navResult.error}\nAvailable: ${navResult.available.join(', ')}\n`
    };
  }
  const label = (s: string): string => (fmt ? fmt.yellow(s) : s);
  let text = navResult.command.helpInformation();
  if (path.length >= 2) {
    const method = methodForPath(path)!;
    const paramsSchema = getSchemaForMethod(method);
    const resultSchema = getResultSchemaForMethod(method);
    if (paramsSchema) {
      const ex = safeExample(paramsSchema);
      if (ex !== undefined) {
        text += `\n${label('Example input (illustrative):')}\n${JSON.stringify(ex, null, 2)}\n`;
      }
    }
    if (resultSchema) {
      const ex = safeExample(resultSchema);
      if (ex !== undefined) {
        text += `\n${label('Example output (illustrative):')}\n${JSON.stringify(ex, null, 2)}\n`;
      }
    }
  }
  return { ok: true, text };
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

interface ArgInfo {
  name: string;
  description: string;
  required: boolean;
  variadic: boolean;
}

// Many requests take their inputs as positional arguments (e.g. `<file>`,
// `<line:col>`) rather than options — see zodToCommander. The text help shows
// them; the JSON drill-down must too, or agents can't construct the request.
function argumentInfos(command: Command): ArgInfo[] {
  return command.registeredArguments.map((a) => ({
    name: a.name(),
    description: a.description,
    required: a.required === true,
    variadic: a.variadic === true
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
  const method = methodForPath(path)!;
  const paramsSchema = safeJsonSchema(getSchemaForMethod(method));
  const resultSchema = safeJsonSchema(getResultSchemaForMethod(method));
  return {
    ok: true,
    languageId,
    namespace: path[0],
    request: path[1],
    arguments: argumentInfos(node),
    options: optionInfos(node),
    ...(paramsSchema !== undefined && { paramsSchema }),
    ...(resultSchema !== undefined && { resultSchema })
  };
}
