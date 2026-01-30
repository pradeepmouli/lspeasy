/**
 * Type inference utilities for extracting params/result types from LSP method names
 *
 * No manual maps needed - TypeScript infers from namespace structure
 */

import type { LSPRequest, LSPNotification } from './namespaces.js';

/**
 * Union type of all valid LSP request method names
 */
export type LSPRequestMethod =
  | LSPRequest.TextDocument.Hover.Method
  | LSPRequest.TextDocument.Completion.Method
  | LSPRequest.TextDocument.Definition.Method
  | LSPRequest.TextDocument.References.Method
  | LSPRequest.TextDocument.DocumentSymbol.Method
  | LSPRequest.TextDocument.CodeAction.Method
  | LSPRequest.TextDocument.Formatting.Method
  | LSPRequest.TextDocument.Rename.Method
  | LSPRequest.Workspace.Symbol.Method
  | LSPRequest.Workspace.ExecuteCommand.Method
  | LSPRequest.Initialize.Method
  | LSPRequest.Shutdown.Method;

/**
 * Union type of all valid LSP notification method names
 */
export type LSPNotificationMethod =
  | LSPNotification.TextDocument.DidOpen.Method
  | LSPNotification.TextDocument.DidChange.Method
  | LSPNotification.TextDocument.DidClose.Method
  | LSPNotification.TextDocument.DidSave.Method
  | LSPNotification.Workspace.DidChangeConfiguration.Method
  | LSPNotification.Workspace.DidChangeWatchedFiles.Method
  | LSPNotification.Workspace.DidChangeWorkspaceFolders.Method
  | LSPNotification.Initialized.Method
  | LSPNotification.Exit.Method
  | LSPNotification.CancelRequest.Method;

/**
 * Infer request parameters from method name
 *
 * @example
 * type HoverParams = InferRequestParams<'textDocument/hover'>
 * // Resolves to: HoverParams from vscode-languageserver-protocol
 */
export type InferRequestParams<M extends string> = M extends LSPRequest.TextDocument.Hover.Method
  ? LSPRequest.TextDocument.Hover.Params
  : M extends LSPRequest.TextDocument.Completion.Method
    ? LSPRequest.TextDocument.Completion.Params
    : M extends LSPRequest.TextDocument.Definition.Method
      ? LSPRequest.TextDocument.Definition.Params
      : M extends LSPRequest.TextDocument.References.Method
        ? LSPRequest.TextDocument.References.Params
        : M extends LSPRequest.TextDocument.DocumentSymbol.Method
          ? LSPRequest.TextDocument.DocumentSymbol.Params
          : M extends LSPRequest.TextDocument.CodeAction.Method
            ? LSPRequest.TextDocument.CodeAction.Params
            : M extends LSPRequest.TextDocument.Formatting.Method
              ? LSPRequest.TextDocument.Formatting.Params
              : M extends LSPRequest.TextDocument.Rename.Method
                ? LSPRequest.TextDocument.Rename.Params
                : M extends LSPRequest.Workspace.Symbol.Method
                  ? LSPRequest.Workspace.Symbol.Params
                  : M extends LSPRequest.Workspace.ExecuteCommand.Method
                    ? LSPRequest.Workspace.ExecuteCommand.Params
                    : M extends LSPRequest.Initialize.Method
                      ? LSPRequest.Initialize.Params
                      : M extends LSPRequest.Shutdown.Method
                        ? LSPRequest.Shutdown.Params
                        : never;

/**
 * Infer request result from method name
 *
 * @example
 * type HoverResult = InferRequestResult<'textDocument/hover'>
 * // Resolves to: Hover | null
 */
export type InferRequestResult<M extends string> = M extends LSPRequest.TextDocument.Hover.Method
  ? LSPRequest.TextDocument.Hover.Result
  : M extends LSPRequest.TextDocument.Completion.Method
    ? LSPRequest.TextDocument.Completion.Result
    : M extends LSPRequest.TextDocument.Definition.Method
      ? LSPRequest.TextDocument.Definition.Result
      : M extends LSPRequest.TextDocument.References.Method
        ? LSPRequest.TextDocument.References.Result
        : M extends LSPRequest.TextDocument.DocumentSymbol.Method
          ? LSPRequest.TextDocument.DocumentSymbol.Result
          : M extends LSPRequest.TextDocument.CodeAction.Method
            ? LSPRequest.TextDocument.CodeAction.Result
            : M extends LSPRequest.TextDocument.Formatting.Method
              ? LSPRequest.TextDocument.Formatting.Result
              : M extends LSPRequest.TextDocument.Rename.Method
                ? LSPRequest.TextDocument.Rename.Result
                : M extends LSPRequest.Workspace.Symbol.Method
                  ? LSPRequest.Workspace.Symbol.Result
                  : M extends LSPRequest.Workspace.ExecuteCommand.Method
                    ? LSPRequest.Workspace.ExecuteCommand.Result
                    : M extends LSPRequest.Initialize.Method
                      ? LSPRequest.Initialize.Result
                      : M extends LSPRequest.Shutdown.Method
                        ? LSPRequest.Shutdown.Result
                        : never;

/**
 * Infer notification parameters from method name
 *
 * @example
 * type DidOpenParams = InferNotificationParams<'textDocument/didOpen'>
 * // Resolves to: DidOpenTextDocumentParams from vscode-languageserver-protocol
 */
export type InferNotificationParams<M extends string> =
  M extends LSPNotification.TextDocument.DidOpen.Method
    ? LSPNotification.TextDocument.DidOpen.Params
    : M extends LSPNotification.TextDocument.DidChange.Method
      ? LSPNotification.TextDocument.DidChange.Params
      : M extends LSPNotification.TextDocument.DidClose.Method
        ? LSPNotification.TextDocument.DidClose.Params
        : M extends LSPNotification.TextDocument.DidSave.Method
          ? LSPNotification.TextDocument.DidSave.Params
          : M extends LSPNotification.Workspace.DidChangeConfiguration.Method
            ? LSPNotification.Workspace.DidChangeConfiguration.Params
            : M extends LSPNotification.Workspace.DidChangeWatchedFiles.Method
              ? LSPNotification.Workspace.DidChangeWatchedFiles.Params
              : M extends LSPNotification.Workspace.DidChangeWorkspaceFolders.Method
                ? LSPNotification.Workspace.DidChangeWorkspaceFolders.Params
                : M extends LSPNotification.Initialized.Method
                  ? LSPNotification.Initialized.Params
                  : M extends LSPNotification.Exit.Method
                    ? LSPNotification.Exit.Params
                    : M extends LSPNotification.CancelRequest.Method
                      ? LSPNotification.CancelRequest.Params
                      : never;

/**
 * Type inference benefits:
 *
 * 1. Zero manual mapping - types inferred directly from namespace definitions
 * 2. Single source of truth - add a namespace, get automatic type support
 * 3. No map maintenance - InferRequestParams/Result uses conditional types
 * 4. Compile-time validation - invalid method names caught by LSPRequestMethod union
 *
 * Adding new methods:
 * 1. Define namespace (e.g., LSPRequest.TextDocument.NewFeature)
 * 2. Add to InferRequestParams/Result conditionals
 * 3. Add to LSPRequestMethod union
 * → Automatically works in onRequest/sendRequest signatures
 */
