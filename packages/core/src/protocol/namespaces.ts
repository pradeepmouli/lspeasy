/**
 * Hierarchical namespace structure for LSP methods
 * Mirrors LSP specification organization (textDocument/*, workspace/*, etc.)
 *
 * Type-only imports from vscode-languageserver-protocol
 */

/* eslint-disable no-unused-vars */
import type {
  // Hover
  HoverParams,
  Hover,
  HoverOptions,
  HoverRegistrationOptions,
  // Completion
  CompletionParams,
  CompletionItem,
  CompletionList,
  CompletionOptions,
  CompletionRegistrationOptions,
  // Definition
  DefinitionParams,
  Definition,
  DefinitionOptions,
  DefinitionRegistrationOptions,
  // References
  ReferenceParams,
  Location,
  ReferenceOptions,
  ReferenceRegistrationOptions,
  // Document Symbol
  DocumentSymbolParams,
  DocumentSymbol,
  SymbolInformation,
  DocumentSymbolOptions,
  DocumentSymbolRegistrationOptions,
  // Workspace Symbol
  WorkspaceSymbolParams,
  WorkspaceSymbol,
  WorkspaceSymbolOptions,
  WorkspaceSymbolRegistrationOptions,
  // Code Action
  CodeActionParams,
  CodeAction,
  Command,
  CodeActionOptions,
  CodeActionRegistrationOptions,
  // Formatting
  DocumentFormattingParams,
  TextEdit,
  DocumentFormattingOptions,
  DocumentFormattingRegistrationOptions,
  // Rename
  RenameParams,
  RenameOptions,
  RenameRegistrationOptions,
  WorkspaceEdit,
  // Initialization
  InitializeParams,
  InitializeResult,
  InitializedParams,
  // Text Document Sync
  DidOpenTextDocumentParams,
  DidChangeTextDocumentParams,
  DidCloseTextDocumentParams,
  DidSaveTextDocumentParams,
  // Workspace
  DidChangeConfigurationParams,
  DidChangeWatchedFilesParams,
  DidChangeWorkspaceFoldersParams,
  ExecuteCommandParams,
  ClientCapabilities,
  HoverClientCapabilities,
  CompletionClientCapabilities,
  DefinitionClientCapabilities,
  ReferenceClientCapabilities,
  DocumentSymbolClientCapabilities,
  CodeActionClientCapabilities,
  DocumentFormattingClientCapabilities,
  RenameClientCapabilities,
  WorkspaceSymbolClientCapabilities,
  ExecuteCommandOptions,
  ExecuteCommandRegistrationOptions,
  ExecuteCommandClientCapabilities
} from 'vscode-languageserver-protocol';
/* eslint-enable no-unused-vars */

/**
 * Request method namespaces (hierarchically organized)
 */
export namespace LSPRequest {
  /**
   * Text Document methods
   */
  export namespace TextDocument {
    export type Path = 'textDocument';

    export namespace Hover {
      export type Method = 'textDocument/hover';
      export const Method = 'textDocument/hover';
      export type Params = HoverParams;
      export type Result = Hover | null;
      export type ClientCapability = HoverClientCapabilities;
      export type ServerCapability = 'hoverProvider';
      export type Options = HoverOptions;
      export type RegistrationOptions = HoverRegistrationOptions;
    }

    export namespace Completion {
      export type Method = 'textDocument/completion';
      export const Method = 'textDocument/completion';
      export type Params = CompletionParams;
      export type Result = CompletionList | CompletionItem[] | null;
      export type ClientCapability = CompletionClientCapabilities;
      export type ServerCapability = 'completionProvider';
      export type Options = CompletionOptions;
      export type RegistrationOptions = CompletionRegistrationOptions;
    }

    export namespace Definition {
      export type Method = 'textDocument/definition';
      export const Method = 'textDocument/definition';
      export type Params = DefinitionParams;
      export type Result = Definition | null;
      export type ClientCapability = DefinitionClientCapabilities;
      export type ServerCapability = 'definitionProvider';
      export type Options = DefinitionOptions;
      export type RegistrationOptions = DefinitionRegistrationOptions;
    }

    export namespace References {
      export type Method = 'textDocument/references';
      export const Method = 'textDocument/references';
      export type Params = ReferenceParams;
      export type Result = Location[] | null;
      export type ClientCapability = ReferenceClientCapabilities;
      export type ServerCapability = 'referencesProvider';
      export type Options = ReferenceOptions;
      export type RegistrationOptions = ReferenceRegistrationOptions;
    }

    export namespace DocumentSymbol {
      export type Method = 'textDocument/documentSymbol';
      export const Method = 'textDocument/documentSymbol';
      export type Params = DocumentSymbolParams;
      export type Result = DocumentSymbol[] | SymbolInformation[] | null;
      export type ClientCapability = DocumentSymbolClientCapabilities;
      export type ServerCapability = 'documentSymbolProvider';
      export type Options = DocumentSymbolOptions;
      export type RegistrationOptions = DocumentSymbolRegistrationOptions;
    }

    export namespace CodeAction {
      export type Method = 'textDocument/codeAction';
      export const Method = 'textDocument/codeAction';
      export type Params = CodeActionParams;
      export type Result = (Command | CodeAction)[] | null;
      export type ClientCapability = CodeActionClientCapabilities;
      export type ServerCapability = 'codeActionProvider';
      export type Options = CodeActionOptions;
      export type RegistrationOptions = CodeActionRegistrationOptions;
    }

    export namespace Formatting {
      export type Method = 'textDocument/formatting';
      export const Method = 'textDocument/formatting';
      export type Params = DocumentFormattingParams;
      export type Result = TextEdit[] | null;
      export type ClientCapability = DocumentFormattingClientCapabilities;
      export type ServerCapability = 'documentFormattingProvider';
      export type Options = DocumentFormattingOptions;
      export type RegistrationOptions = DocumentFormattingRegistrationOptions;
    }

    export namespace Rename {
      export type Method = 'textDocument/rename';
      export const Method = 'textDocument/rename';
      export type Params = RenameParams;
      export type Result = WorkspaceEdit | null;
      export type ClientCapability = RenameClientCapabilities;
      export type ServerCapability = 'renameProvider';
      export type Options = RenameOptions;
      export type RegistrationOptions = RenameRegistrationOptions;
    }
  }

  /**
   * Workspace methods
   */
  export namespace Workspace {
    export type Path = 'workspace';

    export namespace Symbol {
      export type Method = 'workspace/symbol';
      export const Method = 'workspace/symbol';
      export type Params = WorkspaceSymbolParams;
      export type Result = SymbolInformation[] | WorkspaceSymbol[] | null;
      export type ClientCapability = WorkspaceSymbolClientCapabilities;
      export type ServerCapability = 'workspaceSymbolProvider';
      export type Options = WorkspaceSymbolOptions;
      export type RegistrationOptions = WorkspaceSymbolRegistrationOptions;
    }

    export namespace ExecuteCommand {
      export type Method = 'workspace/executeCommand';
      export const Method = 'workspace/executeCommand';
      export type Params = ExecuteCommandParams;
      export type Result = any | null;
      export type ClientCapability = ExecuteCommandClientCapabilities;
      export type ServerCapability = 'executeCommandProvider';
      export type Options = ExecuteCommandOptions;
      export type RegistrationOptions = ExecuteCommandRegistrationOptions;
    }
  }

  /**
   * Lifecycle methods (top-level, no namespace grouping)
   */
  export namespace Initialize {
    export type Method = 'initialize';
    export const Method = 'initialize';
    export type Params = InitializeParams;
    export type Result = InitializeResult;
    export type ClientCapability = never; // Always available
    export type ServerCapability = never; // Always available
  }

  export namespace Shutdown {
    export type Method = 'shutdown';
    export const Method = 'shutdown';
    export type Params = void;
    export type Result = null;
    export type ClientCapability = never; // Always available
    export type ServerCapability = never; // Always available
  }
}

/**
 * Notification method namespaces (hierarchically organized)
 */
export namespace LSPNotification {
  /**
   * Text Document notifications
   */
  export namespace TextDocument {
    export type Path = 'textDocument';

    export namespace DidOpen {
      export type Method = 'textDocument/didOpen';
      export type Params = DidOpenTextDocumentParams;
    }

    export namespace DidChange {
      export type Method = 'textDocument/didChange';
      export type Params = DidChangeTextDocumentParams;
    }

    export namespace DidClose {
      export type Method = 'textDocument/didClose';
      export type Params = DidCloseTextDocumentParams;
    }

    export namespace DidSave {
      export type Method = 'textDocument/didSave';
      export type Params = DidSaveTextDocumentParams;
    }
  }

  /**
   * Workspace notifications
   */
  export namespace Workspace {
    export type Path = 'workspace';

    export namespace DidChangeConfiguration {
      export type Method = 'workspace/didChangeConfiguration';
      export type Params = DidChangeConfigurationParams;
    }

    export namespace DidChangeWatchedFiles {
      export type Method = 'workspace/didChangeWatchedFiles';
      export type Params = DidChangeWatchedFilesParams;
    }

    export namespace DidChangeWorkspaceFolders {
      export type Method = 'workspace/didChangeWorkspaceFolders';
      export type Params = DidChangeWorkspaceFoldersParams;
    }
  }

  /**
   * Lifecycle notifications
   */
  export namespace Initialized {
    export type Method = 'initialized';
    export type Params = InitializedParams;
  }

  export namespace Exit {
    export type Method = 'exit';
    export type Params = void;
  }

  /**
   * Cancellation notification
   */
  export namespace CancelRequest {
    export type Method = '$/cancelRequest';
    export type Params = { id: number | string };
  }
}
