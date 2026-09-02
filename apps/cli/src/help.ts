import type { LanguageStatus, StatusReport } from '@lsproxy/proxy';
import type { Command } from 'commander';
import { z } from 'zod';
import {
  exampleFromZod,
  getResultSchemaForMethod,
  getSchemaForMethod
} from '@lspeasy/core/schemas';
import { SYMBOLS, type Formatter } from './format.js';
import { globalOptionsHelpText } from './global-options.js';
import type { ServerGroupStatus } from './server-groups.js';
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

// Role of a usage token, mapped to a color so the same role reads the same
// everywhere (namespaces cyan, methods blue, args teal, options magenta) — the
// same scheme the drill-down help applies via Commander's per-role style hooks.
type UsageRole = 'ns' | 'method' | 'arg' | 'option' | 'literal';

// Placeholders whose role can't be inferred from shape alone (`<namespace>` and
// `<request>` are both `<…>`). Shape handles the rest: `-x`/`--x` → option,
// other `<…>`/`[…]` → arg, bare words (lsproxy, config) → namespace.
const USAGE_ROLE: Readonly<Record<string, UsageRole>> = {
  '<language>': 'ns',
  '<language-or-file>': 'ns',
  '<namespace>': 'ns',
  '<request>': 'method',
  '<method>': 'method',
  '[flags]': 'option',
  '[options]': 'option'
};

function classifyUsageToken(tok: string): UsageRole {
  if (tok.startsWith('-')) return 'option';
  const mapped = USAGE_ROLE[tok];
  if (mapped) return mapped;
  if (tok.startsWith('<') || tok.startsWith('[')) return 'arg';
  return 'literal';
}

/** Colorize a usage/command string token-by-token by role. With a disabled
 *  formatter every color is identity, so the string is returned ANSI-free. */
function colorizeUsage(s: string, fmt: Formatter): string {
  return s
    .split(' ')
    .map((tok) => {
      if (tok === '') return tok;
      switch (classifyUsageToken(tok)) {
        case 'option':
          return fmt.magenta(tok);
        case 'method':
          return fmt.blue(tok);
        case 'arg':
          return fmt.teal(tok);
        default:
          return fmt.cyan(tok);
      }
    })
    .join(' ');
}

/** Render the top-level `lsproxy` view: configured languages + live status. */
export function renderTopLevel(report: StatusReport, fmt: Formatter): string {
  const header =
    report.daemon === null
      ? daemonStatusLine(report.daemon, fmt) +
        fmt.dim(' — starts on first request; showing configured languages only')
      : daemonStatusLine(report.daemon, fmt);
  const lines = report.languages.map((l) => languageLine(l, fmt));
  // Color each row's term by role (namespace/method/arg/option), then pad by
  // the term's *visible* width — ANSI bytes don't count toward alignment, so we
  // pad the plain string and color the spacer-free term separately.
  const row = (term: string, desc: string): string => {
    const gap = ' '.repeat(Math.max(0, 48 - term.length));
    return `  ${colorizeUsage(term, fmt)}${gap}  ${fmt.dim(desc)}`;
  };

  const usage = [
    fmt.bold('Usage:'),
    `  ${colorizeUsage('lsproxy <language-or-file> <namespace> <request> [args] [flags]', fmt)}`,
    `  ${colorizeUsage('lsproxy <language-or-file> call <method> --params <json>', fmt)}`
  ].join('\n');

  // Non-namespace (meta) commands — listed with descriptions so they're
  // discoverable from the bare view, not just the per-language drill-down.
  const commands = [
    fmt.bold('Commands:'),
    row('config <list|import|export|diff>', 'read/write LSP config across platforms'),
    row('daemon <start|stop|status>', 'manage the per-root proxy daemon'),
    row('status', 'servers grouped by process, with location and config source'),
    row('call <method> --params <json>', 'send any LSP request by method name'),
    row('--version, -V', 'print the CLI version')
  ].join('\n');

  const explore = [
    fmt.bold('Explore:'),
    row('lsproxy <language-or-file>', 'namespaces for that server'),
    row('lsproxy <language-or-file> <namespace>', 'requests in that namespace'),
    row('lsproxy <language-or-file> <namespace> <request> --help', 'parameter schema'),
    fmt.dim('(fewer args than a request needs shows the same schema view instead of an error)')
  ].join('\n');

  const globalOpts = [
    fmt.bold('Global options:'),
    globalOptionsHelpText().split('\n').slice(1).join('\n')
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
    explore,
    '',
    globalOpts,
    ''
  ].join('\n');
}

/** Grouped-by-server view for `lsproxy status` — see design doc §7. */
export function renderStatus(
  servers: ServerGroupStatus[],
  daemon: StatusReport['daemon'],
  fmt: Formatter
): string {
  const serverLines = servers.flatMap((s) => {
    const lines: string[] = [];
    const mark =
      s.status === 'running'
        ? s.healthy === false
          ? SYMBOLS.degraded
          : SYMBOLS.running
        : SYMBOLS.cold;
    const statusLabel =
      s.status === 'running'
        ? fmt.green('running') +
          (s.mixed
            ? fmt.dim(' (mixed — see below)')
            : s.healthy === false
              ? ` ${fmt.yellow('· unhealthy')}`
              : ` · ${fmt.dim('healthy')}`)
        : fmt.dim('not started');
    lines.push(`  ${mark} ${fmt.cyan(s.name)}  ${statusLabel}`);
    lines.push(
      `    ${fmt.dim('location')}   ${s.resolvedPath ?? `${fmt.dim(s.command)}  ${fmt.yellow('(not found on $PATH)')}`}`
    );
    lines.push(`    ${fmt.dim('source')}     ${s.source}`);
    if (s.status === 'running' && !s.mixed) {
      lines.push(
        `    ${fmt.dim('uptime')}     ${Math.round((s.uptimeMs ?? 0) / 1000)}s · ${s.requestsServed ?? 0} reqs · ${s.openDocuments ?? 0} open docs`
      );
    }
    if (s.mixed) {
      lines.push(`    ${fmt.dim('languages')}`);
      for (const l of s.languages) {
        const lMark = l.status === 'running' ? SYMBOLS.running : SYMBOLS.cold;
        const lLabel =
          l.status === 'running'
            ? `${fmt.green('running')} · pid ${l.pid} · up ${Math.round((l.uptimeMs ?? 0) / 1000)}s`
            : fmt.dim('not started');
        lines.push(`      ${lMark} ${l.languageId}  ${lLabel}`);
      }
    } else {
      const langList = s.languages
        .map((l) => `${l.languageId} (${l.extensions.join(' ')})`)
        .join('  ');
      lines.push(`    ${fmt.dim('languages')}  ${langList}`);
    }
    return lines;
  });

  return [
    fmt.bold('lsproxy status'),
    '',
    fmt.bold('Servers:'),
    ...(serverLines.length ? serverLines : [fmt.dim('  (none configured)')]),
    '',
    daemonStatusLine(daemon, fmt),
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
  // Only force Commander's help styling when the formatter actually emits color
  // (not the identity/plain one). Forcing getOutHasColors with a plain formatter
  // would let Commander's *own default* styling leak ANSI in NO_COLOR/piped mode.
  if (fmt && fmt.bold('x') !== 'x') {
    // helpInformation() returns a string (no TTY), so Commander would otherwise
    // suppress styling — force it on for the colored path. Distinct colors per
    // role for readability: namespaces (cyan) vs methods (blue) — chosen by drill
    // depth (depth 0 lists namespaces, deeper lists methods) — options (magenta),
    // arguments (teal).
    const subcommandColor = path.length === 0 ? fmt.cyan : fmt.blue;
    navResult.command.configureOutput({ getOutHasColors: () => true });
    navResult.command.configureHelp({
      styleTitle: (s) => fmt.bold(s),
      styleUsage: (s) => fmt.cyan(s),
      styleCommandText: (s) => fmt.cyan(s),
      styleSubcommandTerm: (s) => subcommandColor(s),
      styleOptionTerm: (s) => fmt.magenta(s),
      styleArgumentTerm: (s) => fmt.teal(s),
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
