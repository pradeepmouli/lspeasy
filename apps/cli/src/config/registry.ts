import type { PlatformAdapter } from './adapter.js';
import { lspjsonAdapter } from './adapters/lspjson.js';
import { copilotAdapter } from './adapters/copilot.js';
import { claudeCodeAdapter } from './adapters/claude-code.js';
import { codexAdapter } from './adapters/codex.js';
import { vscodeAdapter } from './adapters/vscode.js';

const ADAPTERS: PlatformAdapter[] = [
  lspjsonAdapter,
  copilotAdapter,
  claudeCodeAdapter,
  codexAdapter,
  vscodeAdapter
];

export function getAdapters(): PlatformAdapter[] {
  return ADAPTERS;
}

export function getAdapter(id: string): PlatformAdapter | undefined {
  return ADAPTERS.find((a) => a.id === id);
}
