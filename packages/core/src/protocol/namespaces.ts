/**
 * LSP Request and Notification namespaces
 * Auto-generated from metaModel.json
 *
 * DO NOT EDIT MANUALLY
 */

import type * as LSP from 'vscode-languageserver-protocol';

/**
 * callHierarchy namespace
 */
export namespace callHierarchy {
  /**
   * A request to resolve the incoming calls for a given `CallHierarchyItem`.
   * @method callHierarchy/incomingCalls
   */
  export const IncomingCalls = 'callHierarchy/incomingCalls' as const;
  /**
   * A request to resolve the outgoing calls for a given `CallHierarchyItem`.
   * @method callHierarchy/outgoingCalls
   */
  export const OutgoingCalls = 'callHierarchy/outgoingCalls' as const;
}

/**
 * client namespace
 */
export namespace client {
  /**
   * The `client/registerCapability` request is sent from the server to the client to register a new capability
   * @method client/registerCapability
   */
  export const RegisterCapability = 'client/registerCapability' as const;
  /**
   * The `client/unregisterCapability` request is sent from the server to the client to unregister a previously registered capability
   * @method client/unregisterCapability
   */
  export const UnregisterCapability = 'client/unregisterCapability' as const;
}

/**
 * codeAction namespace
 */
export namespace codeAction {
  /**
   * Request to resolve additional information for a given code action.The request's
   * @method codeAction/resolve
   */
  export const Resolve = 'codeAction/resolve' as const;
}

/**
 * codeLens namespace
 */
export namespace codeLens {
  /**
   * A request to resolve a command for a given code lens.
   * @method codeLens/resolve
   */
  export const Resolve = 'codeLens/resolve' as const;
}

/**
 * completionItem namespace
 */
export namespace completionItem {
  /**
   * Request to resolve additional information for a given completion item.The request's
   * @method completionItem/resolve
   */
  export const Resolve = 'completionItem/resolve' as const;
}

/**
 * documentLink namespace
 */
export namespace documentLink {
  /**
   * Request to resolve additional information for a given document link. The request's
   * @method documentLink/resolve
   */
  export const Resolve = 'documentLink/resolve' as const;
}

/**
 * inlayHint namespace
 */
export namespace inlayHint {
  /**
   * A request to resolve additional properties for an inlay hint.
   * @method inlayHint/resolve
   */
  export const Resolve = 'inlayHint/resolve' as const;
}

/**
 * notebookDocument namespace
 */
export namespace notebookDocument {
  /**
   * A notification sent when a notebook opens.
   * @method notebookDocument/didOpen
   */
  export const DidOpen = 'notebookDocument/didOpen' as const;
  /**
   * @method notebookDocument/didChange
   */
  export const DidChange = 'notebookDocument/didChange' as const;
  /**
   * A notification sent when a notebook document is saved.
   * @method notebookDocument/didSave
   */
  export const DidSave = 'notebookDocument/didSave' as const;
  /**
   * A notification sent when a notebook closes.
   * @method notebookDocument/didClose
   */
  export const DidClose = 'notebookDocument/didClose' as const;
}

/**
 * telemetry namespace
 */
export namespace telemetry {
  /**
   * The telemetry event notification is sent from the server to the client to ask
   * @method telemetry/event
   */
  export const Event = 'telemetry/event' as const;
}

/**
 * textDocument namespace
 */
export namespace textDocument {
  /**
   * A request to resolve the implementation locations of a symbol at a given text
   * @method textDocument/implementation
   */
  export const Implementation = 'textDocument/implementation' as const;
  /**
   * A request to resolve the type definition locations of a symbol at a given text
   * @method textDocument/typeDefinition
   */
  export const TypeDefinition = 'textDocument/typeDefinition' as const;
  /**
   * A request to list all color symbols found in a given text document. The request's
   * @method textDocument/documentColor
   */
  export const DocumentColor = 'textDocument/documentColor' as const;
  /**
   * A request to list all presentation for a color. The request's
   * @method textDocument/colorPresentation
   */
  export const ColorPresentation = 'textDocument/colorPresentation' as const;
  /**
   * A request to provide folding ranges in a document. The request's
   * @method textDocument/foldingRange
   */
  export const FoldingRange = 'textDocument/foldingRange' as const;
  /**
   * A request to resolve the type definition locations of a symbol at a given text
   * @method textDocument/declaration
   */
  export const Declaration = 'textDocument/declaration' as const;
  /**
   * A request to provide selection ranges in a document. The request's
   * @method textDocument/selectionRange
   */
  export const SelectionRange = 'textDocument/selectionRange' as const;
  /**
   * A request to result a `CallHierarchyItem` in a document at a given position.
   * @method textDocument/prepareCallHierarchy
   */
  export const PrepareCallHierarchy = 'textDocument/prepareCallHierarchy' as const;
  /**
   * @since 3.16.0
   * @method textDocument/semanticTokens/full
   */
  export const SemanticTokensFull = 'textDocument/semanticTokens/full' as const;
  /**
   * @since 3.16.0
   * @method textDocument/semanticTokens/full/delta
   */
  export const FullDelta = 'textDocument/semanticTokens/full/delta' as const;
  /**
   * @since 3.16.0
   * @method textDocument/semanticTokens/range
   */
  export const SemanticTokensRange = 'textDocument/semanticTokens/range' as const;
  /**
   * A request to provide ranges that can be edited together.
   * @method textDocument/linkedEditingRange
   */
  export const LinkedEditingRange = 'textDocument/linkedEditingRange' as const;
  /**
   * A request to get the moniker of a symbol at a given text document position.
   * @method textDocument/moniker
   */
  export const Moniker = 'textDocument/moniker' as const;
  /**
   * A request to result a `TypeHierarchyItem` in a document at a given position.
   * @method textDocument/prepareTypeHierarchy
   */
  export const PrepareTypeHierarchy = 'textDocument/prepareTypeHierarchy' as const;
  /**
   * A request to provide inline values in a document. The request's parameter is of
   * @method textDocument/inlineValue
   */
  export const InlineValue = 'textDocument/inlineValue' as const;
  /**
   * A request to provide inlay hints in a document. The request's parameter is of
   * @method textDocument/inlayHint
   */
  export const InlayHint = 'textDocument/inlayHint' as const;
  /**
   * The document diagnostic request definition.
   * @method textDocument/diagnostic
   */
  export const Diagnostic = 'textDocument/diagnostic' as const;
  /**
   * A request to provide inline completions in a document. The request's parameter is of
   * @method textDocument/inlineCompletion
   */
  export const InlineCompletion = 'textDocument/inlineCompletion' as const;
  /**
   * A document will save request is sent from the client to the server before
   * @method textDocument/willSaveWaitUntil
   */
  export const WillSaveWaitUntil = 'textDocument/willSaveWaitUntil' as const;
  /**
   * Request to request completion at a given text document position. The request's
   * @method textDocument/completion
   */
  export const Completion = 'textDocument/completion' as const;
  /**
   * Request to request hover information at a given text document position. The request's
   * @method textDocument/hover
   */
  export const Hover = 'textDocument/hover' as const;
  /**
   * @method textDocument/signatureHelp
   */
  export const SignatureHelp = 'textDocument/signatureHelp' as const;
  /**
   * A request to resolve the definition location of a symbol at a given text
   * @method textDocument/definition
   */
  export const Definition = 'textDocument/definition' as const;
  /**
   * A request to resolve project-wide references for the symbol denoted
   * @method textDocument/references
   */
  export const References = 'textDocument/references' as const;
  /**
   * Request to resolve a {@link DocumentHighlight} for a given
   * @method textDocument/documentHighlight
   */
  export const DocumentHighlight = 'textDocument/documentHighlight' as const;
  /**
   * A request to list all symbols found in a given text document. The request's
   * @method textDocument/documentSymbol
   */
  export const DocumentSymbol = 'textDocument/documentSymbol' as const;
  /**
   * A request to provide commands for the given text document and range.
   * @method textDocument/codeAction
   */
  export const CodeAction = 'textDocument/codeAction' as const;
  /**
   * A request to provide code lens for the given text document.
   * @method textDocument/codeLens
   */
  export const CodeLens = 'textDocument/codeLens' as const;
  /**
   * A request to provide document links
   * @method textDocument/documentLink
   */
  export const DocumentLink = 'textDocument/documentLink' as const;
  /**
   * A request to format a whole document.
   * @method textDocument/formatting
   */
  export const Formatting = 'textDocument/formatting' as const;
  /**
   * A request to format a range in a document.
   * @method textDocument/rangeFormatting
   */
  export const RangeFormatting = 'textDocument/rangeFormatting' as const;
  /**
   * A request to format ranges in a document.
   * @method textDocument/rangesFormatting
   */
  export const RangesFormatting = 'textDocument/rangesFormatting' as const;
  /**
   * A request to format a document on type.
   * @method textDocument/onTypeFormatting
   */
  export const OnTypeFormatting = 'textDocument/onTypeFormatting' as const;
  /**
   * A request to rename a symbol.
   * @method textDocument/rename
   */
  export const Rename = 'textDocument/rename' as const;
  /**
   * A request to test and perform the setup necessary for a rename.
   * @method textDocument/prepareRename
   */
  export const PrepareRename = 'textDocument/prepareRename' as const;
  /**
   * The document open notification is sent from the client to the server to signal
   * @method textDocument/didOpen
   */
  export const DidOpen = 'textDocument/didOpen' as const;
  /**
   * The document change notification is sent from the client to the server to signal
   * @method textDocument/didChange
   */
  export const DidChange = 'textDocument/didChange' as const;
  /**
   * The document close notification is sent from the client to the server when
   * @method textDocument/didClose
   */
  export const DidClose = 'textDocument/didClose' as const;
  /**
   * The document save notification is sent from the client to the server when
   * @method textDocument/didSave
   */
  export const DidSave = 'textDocument/didSave' as const;
  /**
   * A document will save notification is sent from the client to the server before
   * @method textDocument/willSave
   */
  export const WillSave = 'textDocument/willSave' as const;
  /**
   * Diagnostics notification are sent from the server to the client to signal
   * @method textDocument/publishDiagnostics
   */
  export const PublishDiagnostics = 'textDocument/publishDiagnostics' as const;
}

/**
 * typeHierarchy namespace
 */
export namespace typeHierarchy {
  /**
   * A request to resolve the supertypes for a given `TypeHierarchyItem`.
   * @method typeHierarchy/supertypes
   */
  export const Supertypes = 'typeHierarchy/supertypes' as const;
  /**
   * A request to resolve the subtypes for a given `TypeHierarchyItem`.
   * @method typeHierarchy/subtypes
   */
  export const Subtypes = 'typeHierarchy/subtypes' as const;
}

/**
 * window namespace
 */
export namespace window {
  /**
   * The `window/workDoneProgress/create` request is sent from the server to the client to initiate progress
   * @method window/workDoneProgress/create
   */
  export const WorkDoneProgressCreate = 'window/workDoneProgress/create' as const;
  /**
   * A request to show a document. This request might open an
   * @method window/showDocument
   */
  export const ShowDocument = 'window/showDocument' as const;
  /**
   * The show message request is sent from the server to the client to show a message
   * @method window/showMessageRequest
   */
  export const ShowMessageRequest = 'window/showMessageRequest' as const;
  /**
   * The `window/workDoneProgress/cancel` notification is sent from  the client to the server to cancel a progress
   * @method window/workDoneProgress/cancel
   */
  export const WorkDoneProgressCancel = 'window/workDoneProgress/cancel' as const;
  /**
   * The show message notification is sent from a server to a client to ask
   * @method window/showMessage
   */
  export const ShowMessage = 'window/showMessage' as const;
  /**
   * The log message notification is sent from the server to the client to ask
   * @method window/logMessage
   */
  export const LogMessage = 'window/logMessage' as const;
}

/**
 * workspace namespace
 */
export namespace workspace {
  /**
   * The `workspace/workspaceFolders` is sent from the server to the client to fetch the open workspace folders.
   * @method workspace/workspaceFolders
   */
  export const WorkspaceFolders = 'workspace/workspaceFolders' as const;
  /**
   * The 'workspace/configuration' request is sent from the server to the client to fetch a certain
   * @method workspace/configuration
   */
  export const Configuration = 'workspace/configuration' as const;
  /**
   * @since 3.18.0
   * @method workspace/foldingRange/refresh
   */
  export const FoldingRangeRefresh = 'workspace/foldingRange/refresh' as const;
  /**
   * @since 3.16.0
   * @method workspace/semanticTokens/refresh
   */
  export const SemanticTokensRefresh = 'workspace/semanticTokens/refresh' as const;
  /**
   * The will create files request is sent from the client to the server before files are actually
   * @method workspace/willCreateFiles
   */
  export const WillCreateFiles = 'workspace/willCreateFiles' as const;
  /**
   * The will rename files request is sent from the client to the server before files are actually
   * @method workspace/willRenameFiles
   */
  export const WillRenameFiles = 'workspace/willRenameFiles' as const;
  /**
   * The did delete files notification is sent from the client to the server when
   * @method workspace/willDeleteFiles
   */
  export const WillDeleteFiles = 'workspace/willDeleteFiles' as const;
  /**
   * @since 3.17.0
   * @method workspace/inlineValue/refresh
   */
  export const InlineValueRefresh = 'workspace/inlineValue/refresh' as const;
  /**
   * @since 3.17.0
   * @method workspace/inlayHint/refresh
   */
  export const InlayHintRefresh = 'workspace/inlayHint/refresh' as const;
  /**
   * The workspace diagnostic request definition.
   * @method workspace/diagnostic
   */
  export const Diagnostic = 'workspace/diagnostic' as const;
  /**
   * The diagnostic refresh request definition.
   * @method workspace/diagnostic/refresh
   */
  export const DiagnosticRefresh = 'workspace/diagnostic/refresh' as const;
  /**
   * The `workspace/textDocumentContent` request is sent from the client to the
   * @method workspace/textDocumentContent
   */
  export const TextDocumentContent = 'workspace/textDocumentContent' as const;
  /**
   * The `workspace/textDocumentContent` request is sent from the server to the client to refresh
   * @method workspace/textDocumentContent/refresh
   */
  export const TextDocumentContentRefresh = 'workspace/textDocumentContent/refresh' as const;
  /**
   * A request to list project-wide symbols matching the query string given
   * @method workspace/symbol
   */
  export const Symbol = 'workspace/symbol' as const;
  /**
   * A request to refresh all code actions
   * @method workspace/codeLens/refresh
   */
  export const CodeLensRefresh = 'workspace/codeLens/refresh' as const;
  /**
   * A request send from the client to the server to execute a command. The request might return
   * @method workspace/executeCommand
   */
  export const ExecuteCommand = 'workspace/executeCommand' as const;
  /**
   * A request sent from the server to the client to modified certain resources.
   * @method workspace/applyEdit
   */
  export const ApplyEdit = 'workspace/applyEdit' as const;
  /**
   * The `workspace/didChangeWorkspaceFolders` notification is sent from the client to the server when the workspace
   * @method workspace/didChangeWorkspaceFolders
   */
  export const DidChangeWorkspaceFolders = 'workspace/didChangeWorkspaceFolders' as const;
  /**
   * The did create files notification is sent from the client to the server when
   * @method workspace/didCreateFiles
   */
  export const DidCreateFiles = 'workspace/didCreateFiles' as const;
  /**
   * The did rename files notification is sent from the client to the server when
   * @method workspace/didRenameFiles
   */
  export const DidRenameFiles = 'workspace/didRenameFiles' as const;
  /**
   * The will delete files request is sent from the client to the server before files are actually
   * @method workspace/didDeleteFiles
   */
  export const DidDeleteFiles = 'workspace/didDeleteFiles' as const;
  /**
   * The configuration change notification is sent from the client to the server
   * @method workspace/didChangeConfiguration
   */
  export const DidChangeConfiguration = 'workspace/didChangeConfiguration' as const;
  /**
   * The watched files notification is sent from the client to the server when
   * @method workspace/didChangeWatchedFiles
   */
  export const DidChangeWatchedFiles = 'workspace/didChangeWatchedFiles' as const;
}

/**
 * workspaceSymbol namespace
 */
export namespace workspaceSymbol {
  /**
   * A request to resolve the range inside the workspace
   * @method workspaceSymbol/resolve
   */
  export const Resolve = 'workspaceSymbol/resolve' as const;
}

/**
 * LSP Request type definitions organized by namespace
 */
export type LSPRequest = {
  callHierarchy: {
    IncomingCalls: {
      Method: 'callHierarchy/incomingCalls';
      Params: LSP.CallHierarchyIncomingCallsParams;
      Result: LSP.CallHierarchyIncomingCall[] | null;
      Direction: 'clientToServer';
    };
    OutgoingCalls: {
      Method: 'callHierarchy/outgoingCalls';
      Params: LSP.CallHierarchyOutgoingCallsParams;
      Result: LSP.CallHierarchyOutgoingCall[] | null;
      Direction: 'clientToServer';
    };
  };
  client: {
    RegisterCapability: {
      Method: 'client/registerCapability';
      Params: LSP.RegistrationParams;
      Result: null;
      Direction: 'clientToServer';
    };
    UnregisterCapability: {
      Method: 'client/unregisterCapability';
      Params: LSP.UnregistrationParams;
      Result: null;
      Direction: 'clientToServer';
    };
  };
  codeAction: {
    Resolve: {
      Method: 'codeAction/resolve';
      Params: LSP.CodeAction;
      Result: LSP.CodeAction;
      ServerCapability: 'codeActionProvider.resolveProvider';
      Direction: 'clientToServer';
    };
  };
  codeLens: {
    Resolve: {
      Method: 'codeLens/resolve';
      Params: LSP.CodeLens;
      Result: LSP.CodeLens;
      ServerCapability: 'codeLensProvider.resolveProvider';
      Direction: 'clientToServer';
    };
  };
  completionItem: {
    Resolve: {
      Method: 'completionItem/resolve';
      Params: LSP.CompletionItem;
      Result: LSP.CompletionItem;
      ServerCapability: 'completionProvider.resolveProvider';
      Direction: 'clientToServer';
    };
  };
  documentLink: {
    Resolve: {
      Method: 'documentLink/resolve';
      Params: LSP.DocumentLink;
      Result: LSP.DocumentLink;
      ServerCapability: 'documentLinkProvider.resolveProvider';
      Direction: 'clientToServer';
    };
  };
  inlayHint: {
    Resolve: {
      Method: 'inlayHint/resolve';
      Params: LSP.InlayHint;
      Result: LSP.InlayHint;
      ServerCapability: 'inlayHintProvider.resolveProvider';
      Direction: 'clientToServer';
    };
  };
  textDocument: {
    Implementation: {
      Method: 'textDocument/implementation';
      Params: LSP.ImplementationParams;
      Result: LSP.Definition | LSP.DefinitionLink[] | null;
      ServerCapability: 'implementationProvider';
      Direction: 'clientToServer';
    };
    TypeDefinition: {
      Method: 'textDocument/typeDefinition';
      Params: LSP.TypeDefinitionParams;
      Result: LSP.Definition | LSP.DefinitionLink[] | null;
      ServerCapability: 'typeDefinitionProvider';
      Direction: 'clientToServer';
    };
    DocumentColor: {
      Method: 'textDocument/documentColor';
      Params: LSP.DocumentColorParams;
      Result: LSP.ColorInformation[];
      ServerCapability: 'colorProvider';
      Direction: 'clientToServer';
    };
    ColorPresentation: {
      Method: 'textDocument/colorPresentation';
      Params: LSP.ColorPresentationParams;
      Result: LSP.ColorPresentation[];
      ServerCapability: 'colorProvider';
      Direction: 'clientToServer';
    };
    FoldingRange: {
      Method: 'textDocument/foldingRange';
      Params: LSP.FoldingRangeParams;
      Result: LSP.FoldingRange[] | null;
      ServerCapability: 'foldingRangeProvider';
      Direction: 'clientToServer';
    };
    Declaration: {
      Method: 'textDocument/declaration';
      Params: LSP.DeclarationParams;
      Result: LSP.Declaration | LSP.DeclarationLink[] | null;
      ServerCapability: 'declarationProvider';
      Direction: 'clientToServer';
    };
    SelectionRange: {
      Method: 'textDocument/selectionRange';
      Params: LSP.SelectionRangeParams;
      Result: LSP.SelectionRange[] | null;
      ServerCapability: 'selectionRangeProvider';
      Direction: 'clientToServer';
    };
    PrepareCallHierarchy: {
      Method: 'textDocument/prepareCallHierarchy';
      Params: LSP.CallHierarchyPrepareParams;
      Result: LSP.CallHierarchyItem[] | null;
      ServerCapability: 'callHierarchyProvider';
      Direction: 'clientToServer';
    };
    SemanticTokensFull: {
      Method: 'textDocument/semanticTokens/full';
      Params: LSP.SemanticTokensParams;
      Result: LSP.SemanticTokens | null;
      ServerCapability: 'semanticTokensProvider';
      Direction: 'clientToServer';
    };
    FullDelta: {
      Method: 'textDocument/semanticTokens/full/delta';
      Params: LSP.SemanticTokensDeltaParams;
      Result: LSP.SemanticTokens | LSP.SemanticTokensDelta | null;
      ServerCapability: 'semanticTokensProvider.full.delta';
      Direction: 'clientToServer';
    };
    SemanticTokensRange: {
      Method: 'textDocument/semanticTokens/range';
      Params: LSP.SemanticTokensRangeParams;
      Result: LSP.SemanticTokens | null;
      ServerCapability: 'semanticTokensProvider.range';
      Direction: 'clientToServer';
    };
    LinkedEditingRange: {
      Method: 'textDocument/linkedEditingRange';
      Params: LSP.LinkedEditingRangeParams;
      Result: LSP.LinkedEditingRanges | null;
      ServerCapability: 'linkedEditingRangeProvider';
      Direction: 'clientToServer';
    };
    Moniker: {
      Method: 'textDocument/moniker';
      Params: LSP.MonikerParams;
      Result: LSP.Moniker[] | null;
      ServerCapability: 'monikerProvider';
      Direction: 'clientToServer';
    };
    PrepareTypeHierarchy: {
      Method: 'textDocument/prepareTypeHierarchy';
      Params: LSP.TypeHierarchyPrepareParams;
      Result: LSP.TypeHierarchyItem[] | null;
      ServerCapability: 'typeHierarchyProvider';
      Direction: 'clientToServer';
    };
    InlineValue: {
      Method: 'textDocument/inlineValue';
      Params: LSP.InlineValueParams;
      Result: LSP.InlineValue[] | null;
      ServerCapability: 'inlineValueProvider';
      Direction: 'clientToServer';
    };
    InlayHint: {
      Method: 'textDocument/inlayHint';
      Params: LSP.InlayHintParams;
      Result: LSP.InlayHint[] | null;
      ServerCapability: 'inlayHintProvider';
      Direction: 'clientToServer';
    };
    Diagnostic: {
      Method: 'textDocument/diagnostic';
      Params: LSP.DocumentDiagnosticParams;
      Result: LSP.DocumentDiagnosticReport;
      ServerCapability: 'diagnosticProvider';
      Direction: 'clientToServer';
    };
    InlineCompletion: {
      Method: 'textDocument/inlineCompletion';
      Params: any /* InlineCompletionParams (proposed) */;
      Result:
        | any /* InlineCompletionList (proposed) */
        | any /* InlineCompletionItem (proposed) */[]
        | null;
      ServerCapability: 'inlineCompletionProvider';
      Direction: 'clientToServer';
    };
    WillSaveWaitUntil: {
      Method: 'textDocument/willSaveWaitUntil';
      Params: LSP.WillSaveTextDocumentParams;
      Result: LSP.TextEdit[] | null;
      ServerCapability: 'textDocumentSync.willSaveWaitUntil';
      Direction: 'clientToServer';
    };
    Completion: {
      Method: 'textDocument/completion';
      Params: LSP.CompletionParams;
      Result: LSP.CompletionItem[] | LSP.CompletionList | null;
      ServerCapability: 'completionProvider';
      Direction: 'clientToServer';
    };
    Hover: {
      Method: 'textDocument/hover';
      Params: LSP.HoverParams;
      Result: LSP.Hover | null;
      ServerCapability: 'hoverProvider';
      Direction: 'clientToServer';
    };
    SignatureHelp: {
      Method: 'textDocument/signatureHelp';
      Params: LSP.SignatureHelpParams;
      Result: LSP.SignatureHelp | null;
      ServerCapability: 'signatureHelpProvider';
      Direction: 'clientToServer';
    };
    Definition: {
      Method: 'textDocument/definition';
      Params: LSP.DefinitionParams;
      Result: LSP.Definition | LSP.DefinitionLink[] | null;
      ServerCapability: 'definitionProvider';
      Direction: 'clientToServer';
    };
    References: {
      Method: 'textDocument/references';
      Params: LSP.ReferenceParams;
      Result: LSP.Location[] | null;
      ServerCapability: 'referencesProvider';
      Direction: 'clientToServer';
    };
    DocumentHighlight: {
      Method: 'textDocument/documentHighlight';
      Params: LSP.DocumentHighlightParams;
      Result: LSP.DocumentHighlight[] | null;
      ServerCapability: 'documentHighlightProvider';
      Direction: 'clientToServer';
    };
    DocumentSymbol: {
      Method: 'textDocument/documentSymbol';
      Params: LSP.DocumentSymbolParams;
      Result: LSP.SymbolInformation[] | LSP.DocumentSymbol[] | null;
      ServerCapability: 'documentSymbolProvider';
      Direction: 'clientToServer';
    };
    CodeAction: {
      Method: 'textDocument/codeAction';
      Params: LSP.CodeActionParams;
      Result: LSP.Command | LSP.CodeAction[] | null;
      ServerCapability: 'codeActionProvider';
      Direction: 'clientToServer';
    };
    CodeLens: {
      Method: 'textDocument/codeLens';
      Params: LSP.CodeLensParams;
      Result: LSP.CodeLens[] | null;
      ServerCapability: 'codeLensProvider';
      Direction: 'clientToServer';
    };
    DocumentLink: {
      Method: 'textDocument/documentLink';
      Params: LSP.DocumentLinkParams;
      Result: LSP.DocumentLink[] | null;
      ServerCapability: 'documentLinkProvider';
      Direction: 'clientToServer';
    };
    Formatting: {
      Method: 'textDocument/formatting';
      Params: LSP.DocumentFormattingParams;
      Result: LSP.TextEdit[] | null;
      ServerCapability: 'documentFormattingProvider';
      Direction: 'clientToServer';
    };
    RangeFormatting: {
      Method: 'textDocument/rangeFormatting';
      Params: LSP.DocumentRangeFormattingParams;
      Result: LSP.TextEdit[] | null;
      ServerCapability: 'documentRangeFormattingProvider';
      Direction: 'clientToServer';
    };
    RangesFormatting: {
      Method: 'textDocument/rangesFormatting';
      Params: any /* DocumentRangesFormattingParams (proposed) */;
      Result: any /* TextEdit (proposed) */[] | null;
      ServerCapability: 'documentRangeFormattingProvider.rangesSupport';
      Direction: 'clientToServer';
    };
    OnTypeFormatting: {
      Method: 'textDocument/onTypeFormatting';
      Params: LSP.DocumentOnTypeFormattingParams;
      Result: LSP.TextEdit[] | null;
      ServerCapability: 'documentOnTypeFormattingProvider';
      Direction: 'clientToServer';
    };
    Rename: {
      Method: 'textDocument/rename';
      Params: LSP.RenameParams;
      Result: LSP.WorkspaceEdit | null;
      ServerCapability: 'renameProvider';
      Direction: 'clientToServer';
    };
    PrepareRename: {
      Method: 'textDocument/prepareRename';
      Params: LSP.PrepareRenameParams;
      Result: LSP.PrepareRenameResult | null;
      ServerCapability: 'renameProvider.prepareProvider';
      Direction: 'clientToServer';
    };
  };
  typeHierarchy: {
    Supertypes: {
      Method: 'typeHierarchy/supertypes';
      Params: LSP.TypeHierarchySupertypesParams;
      Result: LSP.TypeHierarchyItem[] | null;
      Direction: 'clientToServer';
    };
    Subtypes: {
      Method: 'typeHierarchy/subtypes';
      Params: LSP.TypeHierarchySubtypesParams;
      Result: LSP.TypeHierarchyItem[] | null;
      Direction: 'clientToServer';
    };
  };
  window: {
    WorkDoneProgressCreate: {
      Method: 'window/workDoneProgress/create';
      Params: LSP.WorkDoneProgressCreateParams;
      Result: null;
      Direction: 'clientToServer';
    };
    ShowDocument: {
      Method: 'window/showDocument';
      Params: LSP.ShowDocumentParams;
      Result: LSP.ShowDocumentResult;
      Direction: 'clientToServer';
    };
    ShowMessageRequest: {
      Method: 'window/showMessageRequest';
      Params: LSP.ShowMessageRequestParams;
      Result: LSP.MessageActionItem | null;
      Direction: 'clientToServer';
    };
  };
  workspace: {
    WorkspaceFolders: {
      Method: 'workspace/workspaceFolders';
      Params?: never;
      Result: LSP.WorkspaceFolder[] | null;
      ServerCapability: 'workspace.workspaceFolders';
      Direction: 'clientToServer';
    };
    Configuration: {
      Method: 'workspace/configuration';
      Params: LSP.ConfigurationParams;
      Result: LSP.LSPAny[];
      Direction: 'clientToServer';
    };
    FoldingRangeRefresh: {
      Method: 'workspace/foldingRange/refresh';
      Params?: never;
      Result: null;
      Direction: 'clientToServer';
    };
    SemanticTokensRefresh: {
      Method: 'workspace/semanticTokens/refresh';
      Params?: never;
      Result: null;
      Direction: 'clientToServer';
    };
    WillCreateFiles: {
      Method: 'workspace/willCreateFiles';
      Params: LSP.CreateFilesParams;
      Result: LSP.WorkspaceEdit | null;
      ServerCapability: 'workspace.fileOperations.willCreate';
      Direction: 'clientToServer';
    };
    WillRenameFiles: {
      Method: 'workspace/willRenameFiles';
      Params: LSP.RenameFilesParams;
      Result: LSP.WorkspaceEdit | null;
      ServerCapability: 'workspace.fileOperations.willRename';
      Direction: 'clientToServer';
    };
    WillDeleteFiles: {
      Method: 'workspace/willDeleteFiles';
      Params: LSP.DeleteFilesParams;
      Result: LSP.WorkspaceEdit | null;
      ServerCapability: 'workspace.fileOperations.willDelete';
      Direction: 'clientToServer';
    };
    InlineValueRefresh: {
      Method: 'workspace/inlineValue/refresh';
      Params?: never;
      Result: null;
      Direction: 'clientToServer';
    };
    InlayHintRefresh: {
      Method: 'workspace/inlayHint/refresh';
      Params?: never;
      Result: null;
      Direction: 'clientToServer';
    };
    Diagnostic: {
      Method: 'workspace/diagnostic';
      Params: LSP.WorkspaceDiagnosticParams;
      Result: LSP.WorkspaceDiagnosticReport;
      ServerCapability: 'diagnosticProvider.workspaceDiagnostics';
      Direction: 'clientToServer';
    };
    DiagnosticRefresh: {
      Method: 'workspace/diagnostic/refresh';
      Params?: never;
      Result: null;
      Direction: 'clientToServer';
    };
    TextDocumentContent: {
      Method: 'workspace/textDocumentContent';
      Params: any /* TextDocumentContentParams (proposed) */;
      Result: any /* TextDocumentContentResult (proposed) */;
      ServerCapability: 'workspace.textDocumentContent';
      Direction: 'clientToServer';
    };
    TextDocumentContentRefresh: {
      Method: 'workspace/textDocumentContent/refresh';
      Params: any /* TextDocumentContentRefreshParams (proposed) */;
      Result: null;
      Direction: 'clientToServer';
    };
    Symbol: {
      Method: 'workspace/symbol';
      Params: LSP.WorkspaceSymbolParams;
      Result: LSP.SymbolInformation[] | LSP.WorkspaceSymbol[] | null;
      ServerCapability: 'workspaceSymbolProvider';
      Direction: 'clientToServer';
    };
    CodeLensRefresh: {
      Method: 'workspace/codeLens/refresh';
      Params?: never;
      Result: null;
      Direction: 'clientToServer';
    };
    ExecuteCommand: {
      Method: 'workspace/executeCommand';
      Params: LSP.ExecuteCommandParams;
      Result: LSP.LSPAny | null;
      ServerCapability: 'executeCommandProvider';
      Direction: 'clientToServer';
    };
    ApplyEdit: {
      Method: 'workspace/applyEdit';
      Params: LSP.ApplyWorkspaceEditParams;
      Result: LSP.ApplyWorkspaceEditResult;
      Direction: 'clientToServer';
    };
  };
  workspaceSymbol: {
    Resolve: {
      Method: 'workspaceSymbol/resolve';
      Params: LSP.WorkspaceSymbol;
      Result: LSP.WorkspaceSymbol;
      ServerCapability: 'workspaceSymbolProvider.resolveProvider';
      Direction: 'clientToServer';
    };
  };
};

/**
 * LSP Notification type definitions organized by namespace
 */
export type LSPNotification = {
  notebookDocument: {
    DidOpen: {
      Method: 'notebookDocument/didOpen';
      Params: LSP.DidOpenNotebookDocumentParams;
      Direction: 'serverToClient';
    };
    DidChange: {
      Method: 'notebookDocument/didChange';
      Params: LSP.DidChangeNotebookDocumentParams;
      Direction: 'serverToClient';
    };
    DidSave: {
      Method: 'notebookDocument/didSave';
      Params: LSP.DidSaveNotebookDocumentParams;
      Direction: 'serverToClient';
    };
    DidClose: {
      Method: 'notebookDocument/didClose';
      Params: LSP.DidCloseNotebookDocumentParams;
      Direction: 'serverToClient';
    };
  };
  telemetry: {
    Event: {
      Method: 'telemetry/event';
      Params: LSP.LSPAny;
      Direction: 'serverToClient';
    };
  };
  textDocument: {
    DidOpen: {
      Method: 'textDocument/didOpen';
      Params: LSP.DidOpenTextDocumentParams;
      ClientCapability: 'textDocument.synchronization';
      Direction: 'serverToClient';
    };
    DidChange: {
      Method: 'textDocument/didChange';
      Params: LSP.DidChangeTextDocumentParams;
      ClientCapability: 'textDocument.synchronization';
      Direction: 'serverToClient';
    };
    DidClose: {
      Method: 'textDocument/didClose';
      Params: LSP.DidCloseTextDocumentParams;
      ClientCapability: 'textDocument.synchronization';
      Direction: 'serverToClient';
    };
    DidSave: {
      Method: 'textDocument/didSave';
      Params: LSP.DidSaveTextDocumentParams;
      ClientCapability: 'textDocument.synchronization.didSave';
      Direction: 'serverToClient';
    };
    WillSave: {
      Method: 'textDocument/willSave';
      Params: LSP.WillSaveTextDocumentParams;
      ClientCapability: 'textDocument.synchronization.willSave';
      Direction: 'serverToClient';
    };
    PublishDiagnostics: {
      Method: 'textDocument/publishDiagnostics';
      Params: LSP.PublishDiagnosticsParams;
      ClientCapability: 'textDocument.publishDiagnostics';
      Direction: 'serverToClient';
    };
  };
  window: {
    WorkDoneProgressCancel: {
      Method: 'window/workDoneProgress/cancel';
      Params: LSP.WorkDoneProgressCancelParams;
      Direction: 'serverToClient';
    };
    ShowMessage: {
      Method: 'window/showMessage';
      Params: LSP.ShowMessageParams;
      ClientCapability: 'window.showMessage';
      Direction: 'serverToClient';
    };
    LogMessage: {
      Method: 'window/logMessage';
      Params: LSP.LogMessageParams;
      Direction: 'serverToClient';
    };
  };
  workspace: {
    DidChangeWorkspaceFolders: {
      Method: 'workspace/didChangeWorkspaceFolders';
      Params: LSP.DidChangeWorkspaceFoldersParams;
      Direction: 'serverToClient';
    };
    DidCreateFiles: {
      Method: 'workspace/didCreateFiles';
      Params: LSP.CreateFilesParams;
      ClientCapability: 'workspace.fileOperations.didCreate';
      Direction: 'serverToClient';
    };
    DidRenameFiles: {
      Method: 'workspace/didRenameFiles';
      Params: LSP.RenameFilesParams;
      ClientCapability: 'workspace.fileOperations.didRename';
      Direction: 'serverToClient';
    };
    DidDeleteFiles: {
      Method: 'workspace/didDeleteFiles';
      Params: LSP.DeleteFilesParams;
      ClientCapability: 'workspace.fileOperations.didDelete';
      Direction: 'serverToClient';
    };
    DidChangeConfiguration: {
      Method: 'workspace/didChangeConfiguration';
      Params: LSP.DidChangeConfigurationParams;
      ClientCapability: 'workspace.didChangeConfiguration';
      Direction: 'serverToClient';
    };
    DidChangeWatchedFiles: {
      Method: 'workspace/didChangeWatchedFiles';
      Params: LSP.DidChangeWatchedFilesParams;
      ClientCapability: 'workspace.didChangeWatchedFiles';
      Direction: 'serverToClient';
    };
  };
};

/**
 * LSP Request methods organized by namespace
 * @deprecated Use individual namespace exports instead
 */
export const LSPRequest = {
  callHierarchy: {
    IncomingCalls: {
      Method: 'callHierarchy/incomingCalls' as const,
      Direction: 'clientToServer' as const
    },
    OutgoingCalls: {
      Method: 'callHierarchy/outgoingCalls' as const,
      Direction: 'clientToServer' as const
    }
  },
  client: {
    RegisterCapability: {
      Method: 'client/registerCapability' as const,
      Direction: 'clientToServer' as const
    },
    UnregisterCapability: {
      Method: 'client/unregisterCapability' as const,
      Direction: 'clientToServer' as const
    }
  },
  codeAction: {
    Resolve: {
      Method: 'codeAction/resolve' as const,
      Direction: 'clientToServer' as const
    }
  },
  codeLens: {
    Resolve: {
      Method: 'codeLens/resolve' as const,
      Direction: 'clientToServer' as const
    }
  },
  completionItem: {
    Resolve: {
      Method: 'completionItem/resolve' as const,
      Direction: 'clientToServer' as const
    }
  },
  documentLink: {
    Resolve: {
      Method: 'documentLink/resolve' as const,
      Direction: 'clientToServer' as const
    }
  },
  inlayHint: {
    Resolve: {
      Method: 'inlayHint/resolve' as const,
      Direction: 'clientToServer' as const
    }
  },
  textDocument: {
    Implementation: {
      Method: 'textDocument/implementation' as const,
      Direction: 'clientToServer' as const
    },
    TypeDefinition: {
      Method: 'textDocument/typeDefinition' as const,
      Direction: 'clientToServer' as const
    },
    DocumentColor: {
      Method: 'textDocument/documentColor' as const,
      Direction: 'clientToServer' as const
    },
    ColorPresentation: {
      Method: 'textDocument/colorPresentation' as const,
      Direction: 'clientToServer' as const
    },
    FoldingRange: {
      Method: 'textDocument/foldingRange' as const,
      Direction: 'clientToServer' as const
    },
    Declaration: {
      Method: 'textDocument/declaration' as const,
      Direction: 'clientToServer' as const
    },
    SelectionRange: {
      Method: 'textDocument/selectionRange' as const,
      Direction: 'clientToServer' as const
    },
    PrepareCallHierarchy: {
      Method: 'textDocument/prepareCallHierarchy' as const,
      Direction: 'clientToServer' as const
    },
    SemanticTokensFull: {
      Method: 'textDocument/semanticTokens/full' as const,
      Direction: 'clientToServer' as const
    },
    FullDelta: {
      Method: 'textDocument/semanticTokens/full/delta' as const,
      Direction: 'clientToServer' as const
    },
    SemanticTokensRange: {
      Method: 'textDocument/semanticTokens/range' as const,
      Direction: 'clientToServer' as const
    },
    LinkedEditingRange: {
      Method: 'textDocument/linkedEditingRange' as const,
      Direction: 'clientToServer' as const
    },
    Moniker: {
      Method: 'textDocument/moniker' as const,
      Direction: 'clientToServer' as const
    },
    PrepareTypeHierarchy: {
      Method: 'textDocument/prepareTypeHierarchy' as const,
      Direction: 'clientToServer' as const
    },
    InlineValue: {
      Method: 'textDocument/inlineValue' as const,
      Direction: 'clientToServer' as const
    },
    InlayHint: {
      Method: 'textDocument/inlayHint' as const,
      Direction: 'clientToServer' as const
    },
    Diagnostic: {
      Method: 'textDocument/diagnostic' as const,
      Direction: 'clientToServer' as const
    },
    InlineCompletion: {
      Method: 'textDocument/inlineCompletion' as const,
      Direction: 'clientToServer' as const
    },
    WillSaveWaitUntil: {
      Method: 'textDocument/willSaveWaitUntil' as const,
      Direction: 'clientToServer' as const
    },
    Completion: {
      Method: 'textDocument/completion' as const,
      Direction: 'clientToServer' as const
    },
    Hover: {
      Method: 'textDocument/hover' as const,
      Direction: 'clientToServer' as const
    },
    SignatureHelp: {
      Method: 'textDocument/signatureHelp' as const,
      Direction: 'clientToServer' as const
    },
    Definition: {
      Method: 'textDocument/definition' as const,
      Direction: 'clientToServer' as const
    },
    References: {
      Method: 'textDocument/references' as const,
      Direction: 'clientToServer' as const
    },
    DocumentHighlight: {
      Method: 'textDocument/documentHighlight' as const,
      Direction: 'clientToServer' as const
    },
    DocumentSymbol: {
      Method: 'textDocument/documentSymbol' as const,
      Direction: 'clientToServer' as const
    },
    CodeAction: {
      Method: 'textDocument/codeAction' as const,
      Direction: 'clientToServer' as const
    },
    CodeLens: {
      Method: 'textDocument/codeLens' as const,
      Direction: 'clientToServer' as const
    },
    DocumentLink: {
      Method: 'textDocument/documentLink' as const,
      Direction: 'clientToServer' as const
    },
    Formatting: {
      Method: 'textDocument/formatting' as const,
      Direction: 'clientToServer' as const
    },
    RangeFormatting: {
      Method: 'textDocument/rangeFormatting' as const,
      Direction: 'clientToServer' as const
    },
    RangesFormatting: {
      Method: 'textDocument/rangesFormatting' as const,
      Direction: 'clientToServer' as const
    },
    OnTypeFormatting: {
      Method: 'textDocument/onTypeFormatting' as const,
      Direction: 'clientToServer' as const
    },
    Rename: {
      Method: 'textDocument/rename' as const,
      Direction: 'clientToServer' as const
    },
    PrepareRename: {
      Method: 'textDocument/prepareRename' as const,
      Direction: 'clientToServer' as const
    }
  },
  typeHierarchy: {
    Supertypes: {
      Method: 'typeHierarchy/supertypes' as const,
      Direction: 'clientToServer' as const
    },
    Subtypes: {
      Method: 'typeHierarchy/subtypes' as const,
      Direction: 'clientToServer' as const
    }
  },
  window: {
    WorkDoneProgressCreate: {
      Method: 'window/workDoneProgress/create' as const,
      Direction: 'clientToServer' as const
    },
    ShowDocument: {
      Method: 'window/showDocument' as const,
      Direction: 'clientToServer' as const
    },
    ShowMessageRequest: {
      Method: 'window/showMessageRequest' as const,
      Direction: 'clientToServer' as const
    }
  },
  workspace: {
    WorkspaceFolders: {
      Method: 'workspace/workspaceFolders' as const,
      Direction: 'clientToServer' as const
    },
    Configuration: {
      Method: 'workspace/configuration' as const,
      Direction: 'clientToServer' as const
    },
    FoldingRangeRefresh: {
      Method: 'workspace/foldingRange/refresh' as const,
      Direction: 'clientToServer' as const
    },
    SemanticTokensRefresh: {
      Method: 'workspace/semanticTokens/refresh' as const,
      Direction: 'clientToServer' as const
    },
    WillCreateFiles: {
      Method: 'workspace/willCreateFiles' as const,
      Direction: 'clientToServer' as const
    },
    WillRenameFiles: {
      Method: 'workspace/willRenameFiles' as const,
      Direction: 'clientToServer' as const
    },
    WillDeleteFiles: {
      Method: 'workspace/willDeleteFiles' as const,
      Direction: 'clientToServer' as const
    },
    InlineValueRefresh: {
      Method: 'workspace/inlineValue/refresh' as const,
      Direction: 'clientToServer' as const
    },
    InlayHintRefresh: {
      Method: 'workspace/inlayHint/refresh' as const,
      Direction: 'clientToServer' as const
    },
    Diagnostic: {
      Method: 'workspace/diagnostic' as const,
      Direction: 'clientToServer' as const
    },
    DiagnosticRefresh: {
      Method: 'workspace/diagnostic/refresh' as const,
      Direction: 'clientToServer' as const
    },
    TextDocumentContent: {
      Method: 'workspace/textDocumentContent' as const,
      Direction: 'clientToServer' as const
    },
    TextDocumentContentRefresh: {
      Method: 'workspace/textDocumentContent/refresh' as const,
      Direction: 'clientToServer' as const
    },
    Symbol: {
      Method: 'workspace/symbol' as const,
      Direction: 'clientToServer' as const
    },
    CodeLensRefresh: {
      Method: 'workspace/codeLens/refresh' as const,
      Direction: 'clientToServer' as const
    },
    ExecuteCommand: {
      Method: 'workspace/executeCommand' as const,
      Direction: 'clientToServer' as const
    },
    ApplyEdit: {
      Method: 'workspace/applyEdit' as const,
      Direction: 'clientToServer' as const
    }
  },
  workspaceSymbol: {
    Resolve: {
      Method: 'workspaceSymbol/resolve' as const,
      Direction: 'clientToServer' as const
    }
  }
} as const;

/**
 * LSP Notification methods organized by namespace
 * @deprecated Use individual namespace exports instead
 */
export const LSPNotification = {
  notebookDocument: {
    DidOpen: {
      Method: 'notebookDocument/didOpen' as const,
      Direction: 'serverToClient' as const
    },
    DidChange: {
      Method: 'notebookDocument/didChange' as const,
      Direction: 'serverToClient' as const
    },
    DidSave: {
      Method: 'notebookDocument/didSave' as const,
      Direction: 'serverToClient' as const
    },
    DidClose: {
      Method: 'notebookDocument/didClose' as const,
      Direction: 'serverToClient' as const
    }
  },
  telemetry: {
    Event: {
      Method: 'telemetry/event' as const,
      Direction: 'serverToClient' as const
    }
  },
  textDocument: {
    DidOpen: {
      Method: 'textDocument/didOpen' as const,
      Direction: 'serverToClient' as const
    },
    DidChange: {
      Method: 'textDocument/didChange' as const,
      Direction: 'serverToClient' as const
    },
    DidClose: {
      Method: 'textDocument/didClose' as const,
      Direction: 'serverToClient' as const
    },
    DidSave: {
      Method: 'textDocument/didSave' as const,
      Direction: 'serverToClient' as const
    },
    WillSave: {
      Method: 'textDocument/willSave' as const,
      Direction: 'serverToClient' as const
    },
    PublishDiagnostics: {
      Method: 'textDocument/publishDiagnostics' as const,
      Direction: 'serverToClient' as const
    }
  },
  window: {
    WorkDoneProgressCancel: {
      Method: 'window/workDoneProgress/cancel' as const,
      Direction: 'serverToClient' as const
    },
    ShowMessage: {
      Method: 'window/showMessage' as const,
      Direction: 'serverToClient' as const
    },
    LogMessage: {
      Method: 'window/logMessage' as const,
      Direction: 'serverToClient' as const
    }
  },
  workspace: {
    DidChangeWorkspaceFolders: {
      Method: 'workspace/didChangeWorkspaceFolders' as const,
      Direction: 'serverToClient' as const
    },
    DidCreateFiles: {
      Method: 'workspace/didCreateFiles' as const,
      Direction: 'serverToClient' as const
    },
    DidRenameFiles: {
      Method: 'workspace/didRenameFiles' as const,
      Direction: 'serverToClient' as const
    },
    DidDeleteFiles: {
      Method: 'workspace/didDeleteFiles' as const,
      Direction: 'serverToClient' as const
    },
    DidChangeConfiguration: {
      Method: 'workspace/didChangeConfiguration' as const,
      Direction: 'serverToClient' as const
    },
    DidChangeWatchedFiles: {
      Method: 'workspace/didChangeWatchedFiles' as const,
      Direction: 'serverToClient' as const
    }
  }
} as const;
