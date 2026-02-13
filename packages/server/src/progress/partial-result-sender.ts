import type { ParamsForNotification, ProgressToken } from '@lspeasy/core';
import type { BaseLSPServer } from '../server.js';

/** Helper for emitting typed `$/progress` partial result batches from server handlers. */
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
