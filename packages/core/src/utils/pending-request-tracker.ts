/**
 * Pending request tracker for correlating request/response lifecycles.
 */

type PendingEntry<TResponse, TMeta> = {
  resolve: (value: TResponse) => void;
  reject: (error: Error) => void;
  timeoutId: ReturnType<typeof setTimeout> | undefined;
  metadata: TMeta | undefined;
};

/**
 * Tracks pending requests with timeouts and cleanup.
 */
export class PendingRequestTracker<TResponse, TMeta = undefined> {
  private pending = new Map<string, PendingEntry<TResponse, TMeta>>();

  constructor(private readonly defaultTimeout?: number) {}

  /**
   * Create a new pending request.
   */
  create(timeout?: number, metadata?: TMeta): { id: string; promise: Promise<TResponse> } {
    const id = crypto.randomUUID();
    const effectiveTimeout = timeout ?? this.defaultTimeout;

    let resolveEntry: (value: TResponse) => void;
    let rejectEntry: (error: Error) => void;

    const promise = new Promise<TResponse>((resolve, reject) => {
      resolveEntry = resolve;
      rejectEntry = reject;
    });

    void promise.catch(() => undefined);

    const entry: PendingEntry<TResponse, TMeta> = {
      resolve: (value) => {
        this.clearTimeout(id);
        resolveEntry(value);
      },
      reject: (error) => {
        this.clearTimeout(id);
        rejectEntry(error);
      },
      metadata,
      timeoutId: undefined
    };

    this.pending.set(id, entry);

    if (effectiveTimeout && effectiveTimeout > 0) {
      entry.timeoutId = setTimeout(() => {
        this.pending.delete(id);
        entry.reject(new Error('Request timed out'));
      }, effectiveTimeout);
    }

    return { id, promise };
  }

  /**
   * Resolve a pending request.
   */
  resolve(id: string, response: TResponse): void {
    const entry = this.pending.get(id);
    if (!entry) {
      return;
    }
    this.pending.delete(id);
    entry.resolve(response);
  }

  /**
   * Reject a pending request.
   */
  reject(id: string, error: Error): void {
    const entry = this.pending.get(id);
    if (!entry) {
      return;
    }
    this.pending.delete(id);
    entry.reject(error);
  }

  /**
   * Clear all pending requests.
   */
  clear(error: Error = new Error('Pending request cleared')): void {
    for (const [id, entry] of this.pending.entries()) {
      this.pending.delete(id);
      entry.reject(error);
    }
  }

  /**
   * Get metadata associated with a pending request.
   */
  getMetadata(id: string): TMeta | undefined {
    return this.pending.get(id)?.metadata;
  }

  private clearTimeout(id: string): void {
    const entry = this.pending.get(id);
    if (entry?.timeoutId) {
      clearTimeout(entry.timeoutId);
      entry.timeoutId = undefined;
    }
  }
}
