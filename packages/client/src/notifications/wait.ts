/**
 * Configuration for waiting on a specific notification.
 */
export interface NotificationWaitOptions<TParams> {
  timeout: number;
  filter?: (params: TParams) => boolean;
}

/**
 * Tracks a single wait-for-notification operation and timeout lifecycle.
 */
export class NotificationWaiter<TParams> {
  private timeoutHandle: NodeJS.Timeout | undefined;
  private readonly resolveFn: (params: TParams) => void;
  private readonly rejectFn: (error: Error) => void;

  constructor(
    private readonly method: string,
    private readonly options: NotificationWaitOptions<TParams>,
    resolve: (params: TParams) => void,
    reject: (error: Error) => void,
    private readonly onCleanup: () => void
  ) {
    this.resolveFn = resolve;
    this.rejectFn = reject;
  }

  /**
   * Starts timeout tracking for the wait operation.
   */
  start(): void {
    this.timeoutHandle = setTimeout(() => {
      this.cleanup();
      this.rejectFn(
        new Error(
          `Timed out waiting for notification '${this.method}' after ${this.options.timeout}ms`
        )
      );
    }, this.options.timeout);
  }

  /**
   * Returns whether an incoming notification satisfies this waiter.
   */
  matches(method: string, params: TParams): boolean {
    if (method !== this.method) {
      return false;
    }

    if (this.options.filter && !this.options.filter(params)) {
      return false;
    }

    return true;
  }

  /**
   * Resolves the waiter and performs cleanup.
   */
  resolve(params: TParams): void {
    this.cleanup();
    this.resolveFn(params);
  }

  /**
   * Rejects the waiter and performs cleanup.
   */
  reject(error: Error): void {
    this.cleanup();
    this.rejectFn(error);
  }

  /**
   * Clears timeout state and detaches waiter resources.
   */
  cleanup(): void {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = undefined;
    }

    this.onCleanup();
  }
}
