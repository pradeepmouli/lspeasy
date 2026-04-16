/**
 * Partial results contracts.
 */

export interface PartialResultOptions<TPartial> {
  token: string | number;
  onPartial: (batch: TPartial) => void;
}

export interface CancelledPartialResult<TPartial> {
  cancelled: true;
  partialResults: TPartial[];
  finalResult?: undefined;
}

export interface CompletedPartialResult<TPartial, TResult> {
  cancelled: false;
  partialResults: TPartial[];
  finalResult: TResult;
}

export type PartialRequestOutcome<TPartial, TResult> =
  | CancelledPartialResult<TPartial>
  | CompletedPartialResult<TPartial, TResult>;

/**
 * Aggregation rules:
 * - preserve arrival order
 * - append/merge final response payload when present
 */
export interface PartialResultAggregator<TPartial, TResult> {
  addPartial(batch: TPartial): void;
  complete(finalResult: TResult): CompletedPartialResult<TPartial, TResult>;
  cancel(): CancelledPartialResult<TPartial>;
}
