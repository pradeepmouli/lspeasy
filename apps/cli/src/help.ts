import type { LanguageStatus, StatusReport } from '@lsproxy/proxy';
import type { Command } from 'commander';
import { z } from 'zod';
import { exampleFromZod, getResultSchemaForMethod, getSchemaForMethod } from '@lspeasy/core';
import { SYMBOLS, type Formatter } from './format.js';
import { paramsResidualExample } from './zod-to-commander.js';

function safeResidual(schema: z.ZodType): { ok: boolean; value: unknown } {
  try {
    return { ok: true, value: paramsResidualExample(schema) };
  } catch {
    return { ok: false, value: undefined };
  }
}

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
  // Color only the command/term portion of each row; keep the description dim.
  // Pad the plain term before coloring so alignment is by visible width (ANSI
  // bytes don't count toward padEnd).
  const row = (term: string, desc: string): string =>
    `  ${fmt.cyan(term.padEnd(48))}  ${fmt.dim(desc)}`;

  const usage = [
    fmt.bold('Usage:'),
    `  ${fmt.cyan('lsproxy <language> <namespace> <request>')} ${fmt.dim('[args] [flags]')}`,
    `  ${fmt.cyan('lsproxy call <method>')} ${fmt.dim('--params <json>')}`
  ].join('\n');

  // Non-namespace (meta) commands — listed with descriptions so they're
  // discoverable from the bare view, not just the per-language drill-down.
  const commands = [
    fmt.bold('Commands:'),
    row('config <list|import|export|diff>', 'read/write LSP config across platforms'),
    row('daemon <start|stop|status>', 'manage the per-root proxy daemon'),
    row('call <method> --params <json>', 'send any LSP request by method name'),
    row('--version, -V', 'print the CLI version')
  ].join('\n');

  const drill = [
    fmt.bold('Drill down:'),
    row('lsproxy --help <language>', 'namespaces for that server'),
    row('lsproxy --help <language> <namespace>', 'requests in that namespace'),
    row('lsproxy --help <language> <namespace> <request>', 'parameter schema')
  ].join('\n');

  return [
    fmt.bold('lsproxy — LSP-driven CLI'),
    '',
    header,
    '',
    usage,
    '',
    fmt.bold('Languages:'),
    ...lines,
    '',
    commands,
    '',
    drill,
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
  // Colorize Commander's own help (usage, section titles, option/argument
  // terms) to match the rest of the output. When a plain formatter is passed
  // the style hooks return their input unchanged → zero ANSI.
  if (fmt) {
    // Commander suppresses its help styling unless it thinks the output has
    // colors; helpInformation() returns a string (no TTY), so force it on. With
    // a plain formatter the hooks return their input unchanged → still no ANSI.
    navResult.command.configureOutput({ getOutHasColors: () => true });
    navResult.command.configureHelp({
      styleTitle: (s) => fmt.bold(s),
      styleUsage: (s) => fmt.cyan(s),
      styleCommandText: (s) => fmt.cyan(s),
      styleOptionTerm: (s) => fmt.cyan(s),
      styleSubcommandTerm: (s) => fmt.cyan(s),
      styleArgumentTerm: (s) => fmt.cyan(s),
      styleDescriptionText: (s) => fmt.dim(s)
    });
  }
  let text = navResult.command.helpInformation();
  if (path.length >= 2) {
    const method = methodForPath(path)!;
    const paramsSchema = getSchemaForMethod(method);
    const resultSchema = getResultSchemaForMethod(method);
    if (paramsSchema) {
      const { ok, value } = safeResidual(paramsSchema);
      if (ok) {
        text +=
          value !== undefined
            ? `\n${label('Example --params (fields not exposed as args/flags):')}\n${JSON.stringify(value, null, 2)}\n`
            : `\n${label('All inputs map to positional args/flags — no --params needed.')}\n`;
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
  const zParams = getSchemaForMethod(method);
  const paramsSchema = safeJsonSchema(zParams);
  const resultSchema = safeJsonSchema(getResultSchemaForMethod(method));
  // Residual = only the fields that still need --params (not exposed as args/flags).
  const paramsExample = zParams ? safeResidual(zParams).value : undefined;
  return {
    ok: true,
    languageId,
    namespace: path[0],
    request: path[1],
    arguments: argumentInfos(node),
    options: optionInfos(node),
    ...(paramsSchema !== undefined && { paramsSchema }),
    ...(paramsExample !== undefined && { paramsExample }),
    ...(resultSchema !== undefined && { resultSchema })
  };
}
