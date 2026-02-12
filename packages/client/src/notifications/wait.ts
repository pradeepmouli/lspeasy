export interface NotificationWaitOptions<TParams> {
  timeout: number;
  filter?: (params: TParams) => boolean;
}

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

  matches(method: string, params: TParams): boolean {
    if (method !== this.method) {
      return false;
    }

    if (this.options.filter && !this.options.filter(params)) {
      return false;
    }

    return true;
  }

  resolve(params: TParams): void {
    this.cleanup();
    this.resolveFn(params);
  }

  reject(error: Error): void {
    this.cleanup();
    this.rejectFn(error);
  }

  cleanup(): void {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = undefined;
    }

    this.onCleanup();
  }
}
