import type { ParamsForNotification, ProgressToken } from '@lspeasy/core';
import type { BaseLSPServer } from '../server.js';

/**
 * Emits typed `$/progress` partial-result batches from server-side request handlers.
 *
 * @remarks
 * Use `PartialResultSender` inside a `RequestHandler` when the client has
 * supplied a `partialResultToken` (e.g. for `textDocument/references` or
 * `workspace/symbol`). Call `send(token, value)` to stream result batches
 * before returning the final response.
 *
 * @useWhen
 * The client sets `partialResultToken` in the request params and you want to
 * stream intermediate results (e.g. symbols found so far) rather than waiting
 * for the complete set.
 *
 * @never
 * NEVER call `send` after the handler has already returned a response — the
 * `$/progress` notification will arrive after the client has closed the
 * partial-result channel, and the client will silently discard or error on it.
 *
 * NEVER send partial results without a `partialResultToken` — the client has
 * no way to correlate the `$/progress` notification to the pending request.
 *
 * @category Server
 */
export class PartialResultSender {
  constructor(private readonly server: BaseLSPServer) {}

  async send<T>(token: ProgressToken, value: T): Promise<void> {
    const payload = {
      token,
      value
    } as unknown as ParamsForNotification<'$/progress'>;

    await this.server.sendNotification('$/progress', {
      ...payload
    });
  }
}
