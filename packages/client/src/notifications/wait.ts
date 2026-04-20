/**
 * Options for `NotificationWaiter` and `LSPClient.waitForNotification`.
 *
 * @config
 * @typeParam TParams - The notification params type for the awaited method.
 * @category Client
 */
export interface NotificationWaitOptions<TParams> {
  /**
   * Maximum time to wait in milliseconds before rejecting with a timeout error.
   */
  timeout: number;
  /**
   * Optional predicate to skip notifications that don't match the expected
   * content. The waiter continues listening until a matching notification
   * arrives or the timeout expires.
   */
  filter?: (params: TParams) => boolean;
}

/**
 * Tracks a single wait-for-notification operation and its timeout lifecycle.
 *
 * @remarks
 * Created internally by `LSPClient.waitForNotification`. Use
 * `LSPClient.waitForNotification` rather than instantiating this class
 * directly.
 *
 * @useWhen
 * You need to await a specific server-to-client notification after triggering
 * a server-side operation — for example, waiting for
 * `textDocument/publishDiagnostics` after saving a document.
 *
 * @avoidWhen
 * You need to listen for ongoing notifications (not a one-shot wait) — use
 * `LSPClient.onNotification` for persistent subscriptions instead.
 *
 * @never
 * NEVER create a `NotificationWaiter` without setting a timeout — an
 * indefinite wait will leak the waiter permanently if the notification never
 * arrives (e.g. the server suppresses it for certain file types).
 *
 * NEVER use `NotificationWaiter` to wait for notifications that arrive before
 * the waiter is registered. The waiter only sees notifications emitted after
 * `start()` is called; earlier notifications are silently missed.
 *
 * @example
 * ```ts
 * // Wait for diagnostics after saving
 * const diags = await client.waitForNotification(
 *   'textDocument/publishDiagnostics',
 *   {
 *     timeout: 5000,
 *     filter: (params) => params.uri === 'file:///src/main.ts',
 *   }
 * );
 * console.log(diags.diagnostics);
 * ```
 *
 * @typeParam TParams - The notification params type.
 * @category Client
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
   *
   * @param method - The notification method string of the incoming message.
   * @param params - The notification params to test against the optional filter predicate.
   * @returns `true` when the method matches and the filter (if any) passes.
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
