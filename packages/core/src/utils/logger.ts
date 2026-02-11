/**
 * Logger interface and implementation
 * Pattern: MCP SDK's logging infrastructure
 */

/**
 * Log levels
 */
export enum LogLevel {
  Error = 0,
  Warn = 1,
  Info = 2,
  Debug = 3,
  Trace = 4
}

/**
 * Logger interface
 */
export interface Logger {
  error(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
  trace(message: string, ...args: unknown[]): void;
}

/**
 * Console logger implementation
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
 * No-op logger that discards all messages
 */
export class NullLogger implements Logger {
  error(): void {}
  warn(): void {}
  info(): void {}
  debug(): void {}
  trace(): void {}
}
