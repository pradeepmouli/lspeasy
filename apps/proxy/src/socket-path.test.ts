import { describe, it, expect } from 'vitest';
import { socketPath, pidPath } from './socket-path.js';
import { homedir } from 'node:os';
import { join, basename } from 'node:path';

describe('socketPath + pidPath', () => {
  it('produces a stable path for a given root', () => {
    expect(socketPath('/home/user/myproject')).toBe(socketPath('/home/user/myproject'));
  });

  it('produces different paths for different roots', () => {
    expect(socketPath('/project/a')).not.toBe(socketPath('/project/b'));
  });

  it('path ends with .sock', () => {
    expect(socketPath('/project')).toMatch(/\.sock$/);
  });

  it('path is inside ~/.lsproxy/', () => {
    const base = join(homedir(), '.lsproxy');
    expect(socketPath('/project')).toContain(base);
  });

  it('pidPath matches socketPath with .pid extension', () => {
    const root = '/project';
    expect(pidPath(root)).toBe(socketPath(root).replace('.sock', '.pid'));
  });

  it('hash is 12 characters long', () => {
    const path = socketPath('/project');
    const hash = basename(path, '.sock');
    expect(hash).toHaveLength(12);
  });
});
