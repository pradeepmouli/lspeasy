/** Structured response when a partial-enabled request is cancelled. */
export interface CancelledPartialResult<TPartial = unknown> {
  /** Discriminant — always `true` for cancelled results. */
  cancelled: true;
  /** Partial result batches received before the cancellation occurred. */
  partialResults: TPartial[];
  /** Always `undefined` for cancelled results — no final result was received. */
  finalResult?: undefined;
}

/** Structured response when a partial-enabled request completes successfully. */
export interface CompletedPartialResult<TPartial = unknown, TResult = unknown> {
  /** Discriminant — always `false` for completed results. */
  cancelled: false;
  /** Partial result batches received during streaming. */
  partialResults: TPartial[];
  /** The final result returned when the request completed. */
  finalResult: TResult;
}

/** Union return type for partial-enabled client requests. */
export type PartialRequestOutcome<TPartial = unknown, TResult = unknown> =
  | CancelledPartialResult<TPartial>
  | CompletedPartialResult<TPartial, TResult>;
