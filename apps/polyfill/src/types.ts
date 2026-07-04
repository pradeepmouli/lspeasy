// apps/polyfill/src/types.ts
import type { CodeAction, CodeActionParams, ServerCapabilities } from '@lspeasy/core';
import type { LSPClient } from '@lspeasy/client';

export interface CodeActionPolyfill {
  readonly id: string;

  /** Does this backend have the gap this polyfill fills? Checked once per
   *  backend, from its real (unpatched) capabilities. */
  appliesTo(capabilities: ServerCapabilities): boolean;

  /** Patch the capabilities lsproxy advertises to its own client so it knows
   *  the polyfilled feature is available. */
  patchCapabilities?(capabilities: ServerCapabilities): ServerCapabilities;

  /** Augment textDocument/codeAction's real result with synthesized actions. */
  augmentCodeActions?(
    actions: CodeAction[],
    params: CodeActionParams,
    backend: LSPClient
  ): Promise<CodeAction[]>;

  /** Answer codeAction/resolve when the backend doesn't natively support it. */
  resolveCodeAction?(action: CodeAction, backend: LSPClient): Promise<CodeAction>;
}
