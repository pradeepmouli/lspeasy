import { describe, expect, it, vi } from 'vitest';
import { PartialResultSender } from '../../src/progress/partial-result-sender.js';

describe('PartialResultSender', () => {
  it('emits $/progress notification payload through server helper', async () => {
    const sendNotification = vi.fn(async () => undefined);
    const sender = new PartialResultSender({
      sendNotification
    } as never);

    await sender.send('token-1', [{ uri: 'file:///a.ts' }]);

    expect(sendNotification).toHaveBeenCalledWith('$/progress', {
      token: 'token-1',
      value: [{ uri: 'file:///a.ts' }]
    });
  });
});
