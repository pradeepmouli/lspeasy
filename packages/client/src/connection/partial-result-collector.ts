import type { ProgressToken } from '@lspeasy/core';

interface Collector<TPartial> {
  partials: TPartial[];
  onPartial: (value: TPartial) => void;
}

/** Collects partial result batches by progress token and dispatches callback updates. */
export class PartialResultCollector {
  private readonly collectors = new Map<ProgressToken, Collector<unknown>>();

  start<TPartial>(token: ProgressToken, onPartial: (value: TPartial) => void): void {
    this.collectors.set(token, {
      partials: [],
      onPartial: onPartial as (value: unknown) => void
    });
  }

  push(token: ProgressToken, value: unknown): boolean {
    const collector = this.collectors.get(token);
    if (!collector) {
      return false;
    }

    collector.partials.push(value);
    collector.onPartial(value);
    return true;
  }

  finish<TPartial>(token: ProgressToken): TPartial[] {
    const collector = this.collectors.get(token);
    if (!collector) {
      return [];
    }

    this.collectors.delete(token);
    return collector.partials as TPartial[];
  }

  abort(token: ProgressToken): void {
    this.collectors.delete(token);
  }

  clear(): void {
    this.collectors.clear();
  }
}
