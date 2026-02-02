/**
 * High-level textDocument.* method builders
 */

import type { LSPClient } from '../client.js';
import type {
  HoverParams,
  Hover,
  CompletionParams,
  CompletionList,
  CompletionItem,
  DefinitionParams,
  Definition,
  ReferenceParams,
  Location,
  DocumentSymbolParams,
  DocumentSymbol,
  SymbolInformation,
  DidOpenTextDocumentParams,
  DidChangeTextDocumentParams,
  DidCloseTextDocumentParams,
  DidSaveTextDocumentParams
} from 'vscode-languageserver-protocol';

/**
 * Text document request methods
 */
export class TextDocumentRequests {
  constructor(private client: LSPClient) {}

  /**
   * Send textDocument/hover request
   */
  async hover(params: HoverParams): Promise<Hover | null> {
    return this.client.sendRequest<HoverParams, Hover | null>('textDocument/hover', params);
  }

  /**
   * Send textDocument/completion request
   */
  async completion(params: CompletionParams): Promise<CompletionList | CompletionItem[] | null> {
    return this.client.sendRequest<CompletionParams, CompletionList | CompletionItem[] | null>(
      'textDocument/completion',
      params
    );
  }

  /**
   * Send textDocument/definition request
   */
  async definition(params: DefinitionParams): Promise<Definition | null> {
    return this.client.sendRequest<DefinitionParams, Definition | null>(
      'textDocument/definition',
      params
    );
  }

  /**
   * Send textDocument/references request
   */
  async references(params: ReferenceParams): Promise<Location[] | null> {
    return this.client.sendRequest<ReferenceParams, Location[] | null>(
      'textDocument/references',
      params
    );
  }

  /**
   * Send textDocument/documentSymbol request
   */
  async documentSymbol(
    params: DocumentSymbolParams
  ): Promise<DocumentSymbol[] | SymbolInformation[] | null> {
    return this.client.sendRequest<
      DocumentSymbolParams,
      DocumentSymbol[] | SymbolInformation[] | null
    >('textDocument/documentSymbol', params);
  }

  /**
   * Send textDocument/didOpen notification
   */
  async didOpen(params: DidOpenTextDocumentParams): Promise<void> {
    return this.client.sendNotification('textDocument/didOpen', params);
  }

  /**
   * Send textDocument/didChange notification
   */
  async didChange(params: DidChangeTextDocumentParams): Promise<void> {
    return this.client.sendNotification('textDocument/didChange', params);
  }

  /**
   * Send textDocument/didClose notification
   */
  async didClose(params: DidCloseTextDocumentParams): Promise<void> {
    return this.client.sendNotification('textDocument/didClose', params);
  }

  /**
   * Send textDocument/didSave notification
   */
  async didSave(params: DidSaveTextDocumentParams): Promise<void> {
    return this.client.sendNotification('textDocument/didSave', params);
  }
}
