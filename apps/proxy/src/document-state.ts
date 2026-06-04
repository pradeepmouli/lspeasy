// apps/proxy/src/document-state.ts
import { createHash } from 'node:crypto';

export type DidOpenAction = 'open' | 'change' | 'skip';

export interface DocumentStateOptions {
  lazyCloseMs?: number;
  onClose?: (uri: string) => void;
}

interface DocEntry {
  languageId: string;
  content: string;
  contentHash: string;
  openSessions: Set<string>;
  closeTimer?: ReturnType<typeof setTimeout>;
}

export class DocumentStateManager {
  private readonly docs = new Map<string, DocEntry>();
  private readonly lazyCloseMs: number;
  private readonly onClose: ((uri: string) => void) | undefined;

  constructor(opts: DocumentStateOptions = {}) {
    this.lazyCloseMs = opts.lazyCloseMs ?? 300_000;
    this.onClose = opts.onClose;
  }

  onDidOpen(sessionId: string, uri: string, content: string, languageId: string): DidOpenAction {
    const hash = createHash('sha256').update(content).digest('hex');
    const entry = this.docs.get(uri);

    if (!entry) {
      this.docs.set(uri, {
        languageId,
        content,
        contentHash: hash,
        openSessions: new Set([sessionId])
      });
      return 'open';
    }

    if (entry.closeTimer !== undefined) {
      clearTimeout(entry.closeTimer);
      delete entry.closeTimer;
    }

    entry.openSessions.add(sessionId);

    if (entry.contentHash === hash) return 'skip';

    entry.content = content;
    entry.contentHash = hash;
    return 'change';
  }

  onDidClose(sessionId: string, uri: string): void {
    const entry = this.docs.get(uri);
    if (!entry) return;
    entry.openSessions.delete(sessionId);
    if (entry.openSessions.size === 0) {
      this.scheduleLazyClose(uri, entry);
    }
  }

  // Returns URIs where this session was the last opener (informational).
  // The actual backend didClose fires via onClose after lazyCloseMs — do NOT
  // forward didClose immediately based on this return value.
  onSessionEnd(sessionId: string): string[] {
    const toClose: string[] = [];
    for (const [uri, entry] of this.docs) {
      if (!entry.openSessions.has(sessionId)) continue;
      entry.openSessions.delete(sessionId);
      if (entry.openSessions.size === 0) {
        toClose.push(uri);
        this.scheduleLazyClose(uri, entry);
      }
    }
    return toClose;
  }

  getContent(uri: string): string | undefined {
    return this.docs.get(uri)?.content;
  }

  private scheduleLazyClose(uri: string, entry: DocEntry): void {
    entry.closeTimer = setTimeout(() => {
      this.docs.delete(uri);
      this.onClose?.(uri);
    }, this.lazyCloseMs);
  }
}
