/**
 * Logger interface and implementation
 * Pattern: MCP SDK's logging infrastructure
 */

/**
 * Numeric severity levels for filtering log output.
 *
 * @remarks
 * Levels are ordered from most to least severe: `Error (0)` through
 * `Trace (4)`. A logger configured at level `Info` will emit `Error`,
 * `Warn`, and `Info` messages but suppress `Debug` and `Trace`.
 *
 * @category Logging
 */
export enum LogLevel {
  Error = 0,
  Warn = 1,
  Info = 2,
  Debug = 3,
  Trace = 4
}

/**
 * Structured logging interface used throughout lspeasy.
 *
 * @remarks
 * Implement this interface to plug in your own logger (e.g. `pino`, `winston`,
 * structured JSON output). Pass it via `ServerOptions.logger` or
 * `ClientOptions.logger`.
 *
 * @useWhen
 * You need to integrate lspeasy log output into an existing observability
 * stack — implement `Logger` and forward to your preferred library.
 *
 * @avoidWhen
 * You only need basic output — use the built-in `ConsoleLogger` with an
 * appropriate `LogLevel`.
 *
 * @category Logging
 */
export interface Logger {
  error(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
  trace(message: string, ...args: unknown[]): void;
}

/**
 * Logger implementation that writes to the process console with level filtering.
 *
 * @remarks
 * This is the default logger used by `LSPServer` and `LSPClient` when no
 * custom logger is provided. Set `logLevel` in `ServerOptions` /
 * `ClientOptions` to control verbosity.
 *
 * @never
 * NEVER use `ConsoleLogger` in a stdio LSP server (`StdioTransport`) — the
 * LSP base protocol uses stdout as the message channel. Any `console.log` /
 * `console.info` / `console.debug` output will corrupt the stdio stream.
 * Use `NullLogger` or a file-based logger instead, and send diagnostic
 * messages via `window/logMessage` notifications.
 *
 * @example
 * ```ts
 * import { ConsoleLogger, LogLevel } from '@lspeasy/core';
 * import { LSPServer } from '@lspeasy/server';
 *
 * // Only emit errors and warnings
 * const server = new LSPServer({
 *   logger: new ConsoleLogger(LogLevel.Warn),
 * });
 * ```
 *
 * @category Logging
 */
export class ConsoleLogger implements Logger {
  constructor(private readonly level: LogLevel = LogLevel.Info) {}

  error(message: string, ...args: unknown[]): void {
    if (this.level >= LogLevel.Error) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.level >= LogLevel.Warn) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.level >= LogLevel.Info) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.level >= LogLevel.Debug) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  trace(message: string, ...args: unknown[]): void {
    if (this.level >= LogLevel.Trace) {
      console.log(`[TRACE] ${message}`, ...args);
    }
  }
}

/**
 * No-op logger that silently discards all messages.
 *
 * @remarks
 * Use `NullLogger` in stdio servers (where `console.*` would corrupt the
 * stream), in tests where log noise is undesirable, or in production builds
 * where LSP diagnostic messages are forwarded via the protocol itself
 * (`window/logMessage`).
 *
 * @category Logging
 */
export class NullLogger implements Logger {
  error(): void {}
  warn(): void {}
  info(): void {}
  debug(): void {}
  trace(): void {}
}
