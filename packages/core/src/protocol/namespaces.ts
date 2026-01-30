/**
 * Hierarchical type structure for LSP methods using nested types and const overloads
 * Mirrors LSP specification organization (textDocument/*, workspace/*, etc.)
 */

import type {
  HoverParams,
  Hover,
  HoverOptions,
  HoverRegistrationOptions,
  HoverClientCapabilities,
  CompletionParams,
  CompletionItem,
  CompletionList,
  CompletionOptions,
  CompletionRegistrationOptions,
  CompletionClientCapabilities,
  DefinitionParams,
  Definition,
  DefinitionOptions,
  DefinitionRegistrationOptions,
  DefinitionClientCapabilities,
  ReferenceParams,
  Location,
  ReferenceOptions,
  ReferenceRegistrationOptions,
  ReferenceClientCapabilities,
  DocumentSymbolParams,
  DocumentSymbol,
  SymbolInformation,
  DocumentSymbolOptions,
  DocumentSymbolRegistrationOptions,
  DocumentSymbolClientCapabilities,
  WorkspaceSymbolParams,
  WorkspaceSymbol,
  WorkspaceSymbolOptions,
  WorkspaceSymbolRegistrationOptions,
  WorkspaceSymbolClientCapabilities,
  CodeActionParams,
  CodeAction,
  Command,
  CodeActionOptions,
  CodeActionRegistrationOptions,
  CodeActionClientCapabilities,
  DocumentFormattingParams,
  TextEdit,
  DocumentFormattingOptions,
  DocumentFormattingRegistrationOptions,
  DocumentFormattingClientCapabilities,
  RenameParams,
  RenameOptions,
  RenameRegistrationOptions,
  WorkspaceEdit,
  RenameClientCapabilities,
  InitializeParams,
  InitializeResult,
  InitializedParams,
  DidOpenTextDocumentParams,
  DidChangeTextDocumentParams,
  DidCloseTextDocumentParams,
  DidSaveTextDocumentParams,
  DidChangeConfigurationParams,
  DidChangeWatchedFilesParams,
  DidChangeWorkspaceFoldersParams,
  ExecuteCommandParams,
  ExecuteCommandOptions,
  ExecuteCommandRegistrationOptions,
  ExecuteCommandClientCapabilities
} from 'vscode-languageserver-protocol';

export type LSPRequest = {
  TextDocument: {
    Hover: {
      Method: 'textDocument/hover';
      Params: HoverParams;
      Result: Hover | null;
      ClientCapability: HoverClientCapabilities;
      ServerCapability: 'hoverProvider';
      Options: HoverOptions;
      RegistrationOptions: HoverRegistrationOptions;
    };
    Completion: {
      Method: 'textDocument/completion';
      Params: CompletionParams;
      Result: CompletionList | CompletionItem[] | null;
      ClientCapability: CompletionClientCapabilities;
      ServerCapability: 'completionProvider';
      Options: CompletionOptions;
      RegistrationOptions: CompletionRegistrationOptions;
    };
    Definition: {
      Method: 'textDocument/definition';
      Params: DefinitionParams;
      Result: Definition | null;
      ClientCapability: DefinitionClientCapabilities;
      ServerCapability: 'definitionProvider';
      Options: DefinitionOptions;
      RegistrationOptions: DefinitionRegistrationOptions;
    };
    References: {
      Method: 'textDocument/references';
      Params: ReferenceParams;
      Result: Location[] | null;
      ClientCapability: ReferenceClientCapabilities;
      ServerCapability: 'referencesProvider';
      Options: ReferenceOptions;
      RegistrationOptions: ReferenceRegistrationOptions;
    };
    DocumentSymbol: {
      Method: 'textDocument/documentSymbol';
      Params: DocumentSymbolParams;
      Result: DocumentSymbol[] | SymbolInformation[] | null;
      ClientCapability: DocumentSymbolClientCapabilities;
      ServerCapability: 'documentSymbolProvider';
      Options: DocumentSymbolOptions;
      RegistrationOptions: DocumentSymbolRegistrationOptions;
    };
    CodeAction: {
      Method: 'textDocument/codeAction';
      Params: CodeActionParams;
      Result: (Command | CodeAction)[] | null;
      ClientCapability: CodeActionClientCapabilities;
      ServerCapability: 'codeActionProvider';
      Options: CodeActionOptions;
      RegistrationOptions: CodeActionRegistrationOptions;
    };
    Formatting: {
      Method: 'textDocument/formatting';
      Params: DocumentFormattingParams;
      Result: TextEdit[] | null;
      ClientCapability: DocumentFormattingClientCapabilities;
      ServerCapability: 'documentFormattingProvider';
      Options: DocumentFormattingOptions;
      RegistrationOptions: DocumentFormattingRegistrationOptions;
    };
    Rename: {
      Method: 'textDocument/rename';
      Params: RenameParams;
      Result: WorkspaceEdit | null;
      ClientCapability: RenameClientCapabilities;
      ServerCapability: 'renameProvider';
      Options: RenameOptions;
      RegistrationOptions: RenameRegistrationOptions;
    };
  };
  Workspace: {
    Symbol: {
      Method: 'workspace/symbol';
      Params: WorkspaceSymbolParams;
      Result: SymbolInformation[] | WorkspaceSymbol[] | null;
      ClientCapability: WorkspaceSymbolClientCapabilities;
      ServerCapability: 'workspaceSymbolProvider';
      Options: WorkspaceSymbolOptions;
      RegistrationOptions: WorkspaceSymbolRegistrationOptions;
    };
    ExecuteCommand: {
      Method: 'workspace/executeCommand';
      Params: ExecuteCommandParams;
      Result: any | null;
      ClientCapability: ExecuteCommandClientCapabilities;
      ServerCapability: 'executeCommandProvider';
      Options: ExecuteCommandOptions;
      RegistrationOptions: ExecuteCommandRegistrationOptions;
    };
  };
  Initialize: {
    Method: 'initialize';
    Params: InitializeParams;
    Result: InitializeResult;
    ClientCapability: never;
    ServerCapability: never;
  };
  Shutdown: {
    Method: 'shutdown';
    Params: void;
    Result: null;
    ClientCapability: never;
    ServerCapability: never;
  };
};

export type LSPNotification = {
  TextDocument: {
    DidOpen: { Method: 'textDocument/didOpen'; Params: DidOpenTextDocumentParams };
    DidChange: { Method: 'textDocument/didChange'; Params: DidChangeTextDocumentParams };
    DidClose: { Method: 'textDocument/didClose'; Params: DidCloseTextDocumentParams };
    DidSave: { Method: 'textDocument/didSave'; Params: DidSaveTextDocumentParams };
  };
  Workspace: {
    DidChangeConfiguration: {
      Method: 'workspace/didChangeConfiguration';
      Params: DidChangeConfigurationParams;
    };
    DidChangeWatchedFiles: {
      Method: 'workspace/didChangeWatchedFiles';
      Params: DidChangeWatchedFilesParams;
    };
    DidChangeWorkspaceFolders: {
      Method: 'workspace/didChangeWorkspaceFolders';
      Params: DidChangeWorkspaceFoldersParams;
    };
  };
  Initialized: { Method: 'initialized'; Params: InitializedParams };
  Exit: { Method: 'exit'; Params: void };
  CancelRequest: { Method: '$/cancelRequest'; Params: { id: number | string } };
};

export const LSPRequest = {
  TextDocument: {
    Hover: { Method: 'textDocument/hover' as const },
    Completion: { Method: 'textDocument/completion' as const },
    Definition: { Method: 'textDocument/definition' as const },
    References: { Method: 'textDocument/references' as const },
    DocumentSymbol: { Method: 'textDocument/documentSymbol' as const },
    CodeAction: { Method: 'textDocument/codeAction' as const },
    Formatting: { Method: 'textDocument/formatting' as const },
    Rename: { Method: 'textDocument/rename' as const }
  },
  Workspace: {
    Symbol: { Method: 'workspace/symbol' as const },
    ExecuteCommand: { Method: 'workspace/executeCommand' as const }
  },
  Initialize: { Method: 'initialize' as const },
  Shutdown: { Method: 'shutdown' as const }
} as const;

export const LSPNotification = {
  TextDocument: {
    DidOpen: { Method: 'textDocument/didOpen' as const },
    DidChange: { Method: 'textDocument/didChange' as const },
    DidClose: { Method: 'textDocument/didClose' as const },
    DidSave: { Method: 'textDocument/didSave' as const }
  },
  Workspace: {
    DidChangeConfiguration: { Method: 'workspace/didChangeConfiguration' as const },
    DidChangeWatchedFiles: { Method: 'workspace/didChangeWatchedFiles' as const },
    DidChangeWorkspaceFolders: { Method: 'workspace/didChangeWorkspaceFolders' as const }
  },
  Initialized: { Method: 'initialized' as const },
  Exit: { Method: 'exit' as const },
  CancelRequest: { Method: '$/cancelRequest' as const }
} as const;
