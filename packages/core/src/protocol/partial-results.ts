/** Structured response when a partial-enabled request is cancelled. */
export interface CancelledPartialResult<TPartial = unknown> {
  cancelled: true;
  partialResults: TPartial[];
  finalResult?: undefined;
}

/** Structured response when a partial-enabled request completes successfully. */
export interface CompletedPartialResult<TPartial = unknown, TResult = unknown> {
  cancelled: false;
  partialResults: TPartial[];
  finalResult: TResult;
}

/** Union return type for partial-enabled client requests. */
export type PartialRequestOutcome<TPartial = unknown, TResult = unknown> =
  | CancelledPartialResult<TPartial>
  | CompletedPartialResult<TPartial, TResult>;
