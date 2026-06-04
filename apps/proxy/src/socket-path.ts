import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import { homedir } from 'node:os';

function rootHash(root: string): string {
  return createHash('sha1').update(resolve(root)).digest('hex').slice(0, 12);
}

export function socketPath(root: string): string {
  return join(homedir(), '.lsproxy', `${rootHash(root)}.sock`);
}

export function pidPath(root: string): string {
  return join(homedir(), '.lsproxy', `${rootHash(root)}.pid`);
}
