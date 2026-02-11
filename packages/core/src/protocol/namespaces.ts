/**
 * LSP Request and Notification namespaces
 * Auto-generated from metaModel.json
 *
 * DO NOT EDIT MANUALLY
 */
import type * as LSP from './types.js';

/** LSP Request type definitions organized by namespace */
export type LSPRequest = {
  CallHierarchy: {
    IncomingCalls: {
      Method: 'callHierarchy/incomingCalls';
      Params: LSP.CallHierarchyIncomingCallsParams;
      Result: LSP.CallHierarchyIncomingCall[] | null;
      PartialResult: LSP.CallHierarchyIncomingCall[];
      Since: '3.16.0';
      Direction: 'clientToServer';
    };
    OutgoingCalls: {
      Method: 'callHierarchy/outgoingCalls';
      Params: LSP.CallHierarchyOutgoingCallsParams;
      Result: LSP.CallHierarchyOutgoingCall[] | null;
      PartialResult: LSP.CallHierarchyOutgoingCall[];
      Since: '3.16.0';
      Direction: 'clientToServer';
    };
  };
  Client: {
    Registration: {
      Method: 'client/registerCapability';
      Params: LSP.RegistrationParams;
      Result: null;
      Direction: 'serverToClient';
    };
    Unregistration: {
      Method: 'client/unregisterCapability';
      Params: LSP.UnregistrationParams;
      Result: null;
      Direction: 'serverToClient';
    };
  };
  CodeAction: {
    Resolve: {
      Method: 'codeAction/resolve';
      Params: LSP.CodeAction;
      Result: LSP.CodeAction;
      ServerCapability: 'codeActionProvider.resolveProvider';
      ClientCapability: 'textDocument.codeAction.resolveSupport';
      Direction: 'clientToServer';
    };
  };
  CodeLens: {
    Resolve: {
      Method: 'codeLens/resolve';
      Params: LSP.CodeLens;
      Result: LSP.CodeLens;
      ServerCapability: 'codeLensProvider.resolveProvider';
      ClientCapability: 'textDocument.codeLens.resolveSupport';
      Direction: 'clientToServer';
    };
  };
  CompletionItem: {
    CompletionResolve: {
      Method: 'completionItem/resolve';
      Params: LSP.CompletionItem;
      Result: LSP.CompletionItem;
      ServerCapability: 'completionProvider.resolveProvider';
      ClientCapability: 'textDocument.completion.completionItem.resolveSupport';
      Direction: 'clientToServer';
    };
  };
  DocumentLink: {
    Resolve: {
      Method: 'documentLink/resolve';
      Params: LSP.DocumentLink;
      Result: LSP.DocumentLink;
      ServerCapability: 'documentLinkProvider.resolveProvider';
      ClientCapability: 'textDocument.documentLink';
      Direction: 'clientToServer';
    };
  };
  InlayHint: {
    Resolve: {
      Method: 'inlayHint/resolve';
      Params: LSP.InlayHint;
      Result: LSP.InlayHint;
      ServerCapability: 'inlayHintProvider.resolveProvider';
      ClientCapability: 'textDocument.inlayHint.resolveSupport';
      Since: '3.17.0';
      Direction: 'clientToServer';
    };
  };
  Lifecycle: {
    Initialize: {
      Method: 'initialize';
      Params: LSP.InitializeParams;
      Result: LSP.InitializeResult;
      ErrorData: LSP.InitializeError;
      Direction: 'clientToServer';
    };
    Shutdown: {
      Method: 'shutdown';
      Params: undefined;
      Result: null;
      Direction: 'clientToServer';
    };
  };
  TextDocument: {
    Implementation: {
      Method: 'textDocument/implementation';
      Params: LSP.ImplementationParams;
      Result: LSP.Definition | LSP.DefinitionLink[] | null;
      PartialResult: LSP.Location[] | LSP.DefinitionLink[];
      RegistrationOptions: LSP.ImplementationRegistrationOptions;
      ServerCapability: 'implementationProvider';
      ClientCapability: 'textDocument.implementation';
      Direction: 'clientToServer';
    };
    TypeDefinition: {
      Method: 'textDocument/typeDefinition';
      Params: LSP.TypeDefinitionParams;
      Result: LSP.Definition | LSP.DefinitionLink[] | null;
      PartialResult: LSP.Location[] | LSP.DefinitionLink[];
      RegistrationOptions: LSP.TypeDefinitionRegistrationOptions;
      ServerCapability: 'typeDefinitionProvider';
      ClientCapability: 'textDocument.typeDefinition';
      Direction: 'clientToServer';
    };
    DocumentColor: {
      Method: 'textDocument/documentColor';
      Params: LSP.DocumentColorParams;
      Result: LSP.ColorInformation[];
      PartialResult: LSP.ColorInformation[];
      RegistrationOptions: LSP.DocumentColorRegistrationOptions;
      ServerCapability: 'colorProvider';
      ClientCapability: 'textDocument.colorProvider';
      Direction: 'clientToServer';
    };
    ColorPresentation: {
      Method: 'textDocument/colorPresentation';
      Params: LSP.ColorPresentationParams;
      Result: LSP.ColorPresentation[];
      PartialResult: LSP.ColorPresentation[];
      RegistrationOptions: LSP.WorkDoneProgressOptions & LSP.TextDocumentRegistrationOptions;
      ServerCapability: 'colorProvider';
      ClientCapability: 'textDocument.colorProvider';
      Direction: 'clientToServer';
    };
    FoldingRange: {
      Method: 'textDocument/foldingRange';
      Params: LSP.FoldingRangeParams;
      Result: LSP.FoldingRange[] | null;
      PartialResult: LSP.FoldingRange[];
      RegistrationOptions: LSP.FoldingRangeRegistrationOptions;
      ServerCapability: 'foldingRangeProvider';
      ClientCapability: 'textDocument.foldingRange';
      Direction: 'clientToServer';
    };
    Declaration: {
      Method: 'textDocument/declaration';
      Params: LSP.DeclarationParams;
      Result: LSP.Declaration | LSP.DeclarationLink[] | null;
      PartialResult: LSP.Location[] | LSP.DeclarationLink[];
      RegistrationOptions: LSP.DeclarationRegistrationOptions;
      ServerCapability: 'declarationProvider';
      ClientCapability: 'textDocument.declaration';
      Direction: 'clientToServer';
    };
    SelectionRange: {
      Method: 'textDocument/selectionRange';
      Params: LSP.SelectionRangeParams;
      Result: LSP.SelectionRange[] | null;
      PartialResult: LSP.SelectionRange[];
      RegistrationOptions: LSP.SelectionRangeRegistrationOptions;
      ServerCapability: 'selectionRangeProvider';
      ClientCapability: 'textDocument.selectionRange';
      Direction: 'clientToServer';
    };
    CallHierarchyPrepare: {
      Method: 'textDocument/prepareCallHierarchy';
      Params: LSP.CallHierarchyPrepareParams;
      Result: LSP.CallHierarchyItem[] | null;
      RegistrationOptions: LSP.CallHierarchyRegistrationOptions;
      ServerCapability: 'callHierarchyProvider';
      ClientCapability: 'textDocument.callHierarchy';
      Since: '3.16.0';
      Direction: 'clientToServer';
    };
    SemanticTokens: {
      Method: 'textDocument/semanticTokens/full';
      Params: LSP.SemanticTokensParams;
      Result: LSP.SemanticTokens | null;
      PartialResult: LSP.SemanticTokensPartialResult;
      RegistrationOptions: LSP.SemanticTokensRegistrationOptions;
      ServerCapability: 'semanticTokensProvider';
      ClientCapability: 'textDocument.semanticTokens';
      RegistrationMethod: 'textDocument/semanticTokens';
      Since: '3.16.0';
      Direction: 'clientToServer';
    };
    SemanticTokensDelta: {
      Method: 'textDocument/semanticTokens/full/delta';
      Params: LSP.SemanticTokensDeltaParams;
      Result: LSP.SemanticTokens | LSP.SemanticTokensDelta | null;
      PartialResult: LSP.SemanticTokensPartialResult | LSP.SemanticTokensDeltaPartialResult;
      RegistrationOptions: LSP.SemanticTokensRegistrationOptions;
      ServerCapability: 'semanticTokensProvider.full.delta';
      ClientCapability: 'textDocument.semanticTokens.requests.full.delta';
      RegistrationMethod: 'textDocument/semanticTokens';
      Since: '3.16.0';
      Direction: 'clientToServer';
    };
    SemanticTokensRange: {
      Method: 'textDocument/semanticTokens/range';
      Params: LSP.SemanticTokensRangeParams;
      Result: LSP.SemanticTokens | null;
      PartialResult: LSP.SemanticTokensPartialResult;
      ServerCapability: 'semanticTokensProvider.range';
      ClientCapability: 'textDocument.semanticTokens.requests.range';
      RegistrationMethod: 'textDocument/semanticTokens';
      Since: '3.16.0';
      Direction: 'clientToServer';
    };
    LinkedEditingRange: {
      Method: 'textDocument/linkedEditingRange';
      Params: LSP.LinkedEditingRangeParams;
      Result: LSP.LinkedEditingRanges | null;
      RegistrationOptions: LSP.LinkedEditingRangeRegistrationOptions;
      ServerCapability: 'linkedEditingRangeProvider';
      ClientCapability: 'textDocument.linkedEditingRange';
      Since: '3.16.0';
      Direction: 'clientToServer';
    };
    Moniker: {
      Method: 'textDocument/moniker';
      Params: LSP.MonikerParams;
      Result: LSP.Moniker[] | null;
      PartialResult: LSP.Moniker[];
      RegistrationOptions: LSP.MonikerRegistrationOptions;
      ServerCapability: 'monikerProvider';
      ClientCapability: 'textDocument.moniker';
      Direction: 'clientToServer';
    };
    TypeHierarchyPrepare: {
      Method: 'textDocument/prepareTypeHierarchy';
      Params: LSP.TypeHierarchyPrepareParams;
      Result: LSP.TypeHierarchyItem[] | null;
      RegistrationOptions: LSP.TypeHierarchyRegistrationOptions;
      ServerCapability: 'typeHierarchyProvider';
      ClientCapability: 'textDocument.typeHierarchy';
      Since: '3.17.0';
      Direction: 'clientToServer';
    };
    InlineValue: {
      Method: 'textDocument/inlineValue';
      Params: LSP.InlineValueParams;
      Result: LSP.InlineValue[] | null;
      PartialResult: LSP.InlineValue[];
      RegistrationOptions: LSP.InlineValueRegistrationOptions;
      ServerCapability: 'inlineValueProvider';
      ClientCapability: 'textDocument.inlineValue';
      Since: '3.17.0';
      Direction: 'clientToServer';
    };
    InlayHint: {
      Method: 'textDocument/inlayHint';
      Params: LSP.InlayHintParams;
      Result: LSP.InlayHint[] | null;
      PartialResult: LSP.InlayHint[];
      RegistrationOptions: LSP.InlayHintRegistrationOptions;
      ServerCapability: 'inlayHintProvider';
      ClientCapability: 'textDocument.inlayHint';
      Since: '3.17.0';
      Direction: 'clientToServer';
    };
    DocumentDiagnostic: {
      Method: 'textDocument/diagnostic';
      Params: LSP.DocumentDiagnosticParams;
      Result: LSP.DocumentDiagnosticReport;
      PartialResult: LSP.DocumentDiagnosticReportPartialResult;
      RegistrationOptions: LSP.DiagnosticRegistrationOptions;
      ErrorData: LSP.DiagnosticServerCancellationData;
      ServerCapability: 'diagnosticProvider';
      ClientCapability: 'textDocument.diagnostic';
      Since: '3.17.0';
      Direction: 'clientToServer';
    };
    InlineCompletion: {
      Method: 'textDocument/inlineCompletion';
      Params: LSP.InlineCompletionParams;
      Result: LSP.InlineCompletionList | LSP.InlineCompletionItem[] | null;
      PartialResult: LSP.InlineCompletionItem[];
      RegistrationOptions: LSP.InlineCompletionRegistrationOptions;
      ServerCapability: 'inlineCompletionProvider';
      ClientCapability: 'textDocument.inlineCompletion';
      Since: '3.18.0';
      Proposed: true;
      Direction: 'clientToServer';
    };
    WillSaveTextDocumentWaitUntil: {
      Method: 'textDocument/willSaveWaitUntil';
      Params: LSP.WillSaveTextDocumentParams;
      Result: LSP.TextEdit[] | null;
      RegistrationOptions: LSP.TextDocumentRegistrationOptions;
      ServerCapability: 'textDocumentSync.willSaveWaitUntil';
      ClientCapability: 'textDocument.synchronization.willSaveWaitUntil';
      Direction: 'clientToServer';
    };
    Completion: {
      Method: 'textDocument/completion';
      Params: LSP.CompletionParams;
      Result: LSP.CompletionItem[] | LSP.CompletionList | null;
      PartialResult: LSP.CompletionItem[];
      RegistrationOptions: LSP.CompletionRegistrationOptions;
      ServerCapability: 'completionProvider';
      ClientCapability: 'textDocument.completion';
      Direction: 'clientToServer';
    };
    Hover: {
      Method: 'textDocument/hover';
      Params: LSP.HoverParams;
      Result: LSP.Hover | null;
      RegistrationOptions: LSP.HoverRegistrationOptions;
      ServerCapability: 'hoverProvider';
      ClientCapability: 'textDocument.hover';
      Direction: 'clientToServer';
    };
    SignatureHelp: {
      Method: 'textDocument/signatureHelp';
      Params: LSP.SignatureHelpParams;
      Result: LSP.SignatureHelp | null;
      RegistrationOptions: LSP.SignatureHelpRegistrationOptions;
      ServerCapability: 'signatureHelpProvider';
      ClientCapability: 'textDocument.signatureHelp';
      Direction: 'clientToServer';
    };
    Definition: {
      Method: 'textDocument/definition';
      Params: LSP.DefinitionParams;
      Result: LSP.Definition | LSP.DefinitionLink[] | null;
      PartialResult: LSP.Location[] | LSP.DefinitionLink[];
      RegistrationOptions: LSP.DefinitionRegistrationOptions;
      ServerCapability: 'definitionProvider';
      ClientCapability: 'textDocument.definition';
      Direction: 'clientToServer';
    };
    References: {
      Method: 'textDocument/references';
      Params: LSP.ReferenceParams;
      Result: LSP.Location[] | null;
      PartialResult: LSP.Location[];
      RegistrationOptions: LSP.ReferenceRegistrationOptions;
      ServerCapability: 'referencesProvider';
      ClientCapability: 'textDocument.references';
      Direction: 'clientToServer';
    };
    DocumentHighlight: {
      Method: 'textDocument/documentHighlight';
      Params: LSP.DocumentHighlightParams;
      Result: LSP.DocumentHighlight[] | null;
      PartialResult: LSP.DocumentHighlight[];
      RegistrationOptions: LSP.DocumentHighlightRegistrationOptions;
      ServerCapability: 'documentHighlightProvider';
      ClientCapability: 'textDocument.documentHighlight';
      Direction: 'clientToServer';
    };
    DocumentSymbol: {
      Method: 'textDocument/documentSymbol';
      Params: LSP.DocumentSymbolParams;
      Result: LSP.SymbolInformation[] | LSP.DocumentSymbol[] | null;
      PartialResult: LSP.SymbolInformation[] | LSP.DocumentSymbol[];
      RegistrationOptions: LSP.DocumentSymbolRegistrationOptions;
      ServerCapability: 'documentSymbolProvider';
      ClientCapability: 'textDocument.documentSymbol';
      Direction: 'clientToServer';
    };
    CodeAction: {
      Method: 'textDocument/codeAction';
      Params: LSP.CodeActionParams;
      Result: LSP.Command | LSP.CodeAction[] | null;
      PartialResult: LSP.Command | LSP.CodeAction[];
      RegistrationOptions: LSP.CodeActionRegistrationOptions;
      ServerCapability: 'codeActionProvider';
      ClientCapability: 'textDocument.codeAction';
      Direction: 'clientToServer';
    };
    CodeLens: {
      Method: 'textDocument/codeLens';
      Params: LSP.CodeLensParams;
      Result: LSP.CodeLens[] | null;
      PartialResult: LSP.CodeLens[];
      RegistrationOptions: LSP.CodeLensRegistrationOptions;
      ServerCapability: 'codeLensProvider';
      ClientCapability: 'textDocument.codeLens';
      Direction: 'clientToServer';
    };
    DocumentLink: {
      Method: 'textDocument/documentLink';
      Params: LSP.DocumentLinkParams;
      Result: LSP.DocumentLink[] | null;
      PartialResult: LSP.DocumentLink[];
      RegistrationOptions: LSP.DocumentLinkRegistrationOptions;
      ServerCapability: 'documentLinkProvider';
      ClientCapability: 'textDocument.documentLink';
      Direction: 'clientToServer';
    };
    DocumentFormatting: {
      Method: 'textDocument/formatting';
      Params: LSP.DocumentFormattingParams;
      Result: LSP.TextEdit[] | null;
      RegistrationOptions: LSP.DocumentFormattingRegistrationOptions;
      ServerCapability: 'documentFormattingProvider';
      ClientCapability: 'textDocument.formatting';
      Direction: 'clientToServer';
    };
    DocumentRangeFormatting: {
      Method: 'textDocument/rangeFormatting';
      Params: LSP.DocumentRangeFormattingParams;
      Result: LSP.TextEdit[] | null;
      RegistrationOptions: LSP.DocumentRangeFormattingRegistrationOptions;
      ServerCapability: 'documentRangeFormattingProvider';
      ClientCapability: 'textDocument.rangeFormatting';
      Direction: 'clientToServer';
    };
    DocumentRangesFormatting: {
      Method: 'textDocument/rangesFormatting';
      Params: LSP.DocumentRangesFormattingParams;
      Result: LSP.TextEdit[] | null;
      RegistrationOptions: LSP.DocumentRangeFormattingRegistrationOptions;
      ServerCapability: 'documentRangeFormattingProvider.rangesSupport';
      ClientCapability: 'textDocument.rangeFormatting.rangesSupport';
      Since: '3.18.0';
      Proposed: true;
      Direction: 'clientToServer';
    };
    DocumentOnTypeFormatting: {
      Method: 'textDocument/onTypeFormatting';
      Params: LSP.DocumentOnTypeFormattingParams;
      Result: LSP.TextEdit[] | null;
      RegistrationOptions: LSP.DocumentOnTypeFormattingRegistrationOptions;
      ServerCapability: 'documentOnTypeFormattingProvider';
      ClientCapability: 'textDocument.onTypeFormatting';
      Direction: 'clientToServer';
    };
    Rename: {
      Method: 'textDocument/rename';
      Params: LSP.RenameParams;
      Result: LSP.WorkspaceEdit | null;
      RegistrationOptions: LSP.RenameRegistrationOptions;
      ServerCapability: 'renameProvider';
      ClientCapability: 'textDocument.rename';
      Direction: 'clientToServer';
    };
    PrepareRename: {
      Method: 'textDocument/prepareRename';
      Params: LSP.PrepareRenameParams;
      Result: LSP.PrepareRenameResult | null;
      ServerCapability: 'renameProvider.prepareProvider';
      ClientCapability: 'textDocument.rename.prepareSupport';
      Since: '3.16';
      Direction: 'clientToServer';
    };
  };
  TypeHierarchy: {
    Supertypes: {
      Method: 'typeHierarchy/supertypes';
      Params: LSP.TypeHierarchySupertypesParams;
      Result: LSP.TypeHierarchyItem[] | null;
      PartialResult: LSP.TypeHierarchyItem[];
      Since: '3.17.0';
      Direction: 'clientToServer';
    };
    Subtypes: {
      Method: 'typeHierarchy/subtypes';
      Params: LSP.TypeHierarchySubtypesParams;
      Result: LSP.TypeHierarchyItem[] | null;
      PartialResult: LSP.TypeHierarchyItem[];
      Since: '3.17.0';
      Direction: 'clientToServer';
    };
  };
  Window: {
    WorkDoneProgressCreate: {
      Method: 'window/workDoneProgress/create';
      Params: LSP.WorkDoneProgressCreateParams;
      Result: null;
      ClientCapability: 'window.workDoneProgress';
      Direction: 'serverToClient';
    };
    ShowDocument: {
      Method: 'window/showDocument';
      Params: LSP.ShowDocumentParams;
      Result: LSP.ShowDocumentResult;
      ClientCapability: 'window.showDocument.support';
      Since: '3.16.0';
      Direction: 'serverToClient';
    };
    ShowMessage: {
      Method: 'window/showMessageRequest';
      Params: LSP.ShowMessageRequestParams;
      Result: LSP.MessageActionItem | null;
      ClientCapability: 'window.showMessage';
      Direction: 'serverToClient';
    };
  };
  Workspace: {
    WillCreateFiles: {
      Method: 'workspace/willCreateFiles';
      Params: LSP.CreateFilesParams;
      Result: LSP.WorkspaceEdit | null;
      RegistrationOptions: LSP.FileOperationRegistrationOptions;
      ServerCapability: 'workspace.fileOperations.willCreate';
      ClientCapability: 'workspace.fileOperations.willCreate';
      Since: '3.16.0';
      Direction: 'clientToServer';
    };
    WillRenameFiles: {
      Method: 'workspace/willRenameFiles';
      Params: LSP.RenameFilesParams;
      Result: LSP.WorkspaceEdit | null;
      RegistrationOptions: LSP.FileOperationRegistrationOptions;
      ServerCapability: 'workspace.fileOperations.willRename';
      ClientCapability: 'workspace.fileOperations.willRename';
      Since: '3.16.0';
      Direction: 'clientToServer';
    };
    WillDeleteFiles: {
      Method: 'workspace/willDeleteFiles';
      Params: LSP.DeleteFilesParams;
      Result: LSP.WorkspaceEdit | null;
      RegistrationOptions: LSP.FileOperationRegistrationOptions;
      ServerCapability: 'workspace.fileOperations.willDelete';
      ClientCapability: 'workspace.fileOperations.willDelete';
      Since: '3.16.0';
      Direction: 'clientToServer';
    };
    Diagnostic: {
      Method: 'workspace/diagnostic';
      Params: LSP.WorkspaceDiagnosticParams;
      Result: LSP.WorkspaceDiagnosticReport;
      PartialResult: LSP.WorkspaceDiagnosticReportPartialResult;
      ErrorData: LSP.DiagnosticServerCancellationData;
      ServerCapability: 'diagnosticProvider.workspaceDiagnostics';
      ClientCapability: 'workspace.diagnostics';
      Since: '3.17.0';
      Direction: 'clientToServer';
    };
    TextDocumentContent: {
      Method: 'workspace/textDocumentContent';
      Params: LSP.TextDocumentContentParams;
      Result: LSP.TextDocumentContentResult;
      RegistrationOptions: LSP.TextDocumentContentRegistrationOptions;
      ServerCapability: 'workspace.textDocumentContent';
      ClientCapability: 'workspace.textDocumentContent';
      Since: '3.18.0';
      Proposed: true;
      Direction: 'clientToServer';
    };
    Symbol: {
      Method: 'workspace/symbol';
      Params: LSP.WorkspaceSymbolParams;
      Result: LSP.SymbolInformation[] | LSP.WorkspaceSymbol[] | null;
      PartialResult: LSP.SymbolInformation[] | LSP.WorkspaceSymbol[];
      RegistrationOptions: LSP.WorkspaceSymbolRegistrationOptions;
      ServerCapability: 'workspaceSymbolProvider';
      ClientCapability: 'workspace.symbol';
      Since: '3.17.0';
      Direction: 'clientToServer';
    };
    ExecuteCommand: {
      Method: 'workspace/executeCommand';
      Params: LSP.ExecuteCommandParams;
      Result: LSP.LSPAny | null;
      RegistrationOptions: LSP.ExecuteCommandRegistrationOptions;
      ServerCapability: 'executeCommandProvider';
      ClientCapability: 'workspace.executeCommand';
      Direction: 'clientToServer';
    };
    Folders: {
      Method: 'workspace/workspaceFolders';
      Params: undefined;
      Result: LSP.WorkspaceFolder[] | null;
      ServerCapability: 'workspace.workspaceFolders';
      ClientCapability: 'workspace.workspaceFolders';
      Direction: 'serverToClient';
    };
    Configuration: {
      Method: 'workspace/configuration';
      Params: LSP.ConfigurationParams;
      Result: LSP.LSPAny[];
      ClientCapability: 'workspace.configuration';
      Direction: 'serverToClient';
    };
    FoldingRangeRefresh: {
      Method: 'workspace/foldingRange/refresh';
      Params: undefined;
      Result: null;
      ClientCapability: 'workspace.foldingRange.refreshSupport';
      Since: '3.18.0';
      Proposed: true;
      Direction: 'serverToClient';
    };
    SemanticTokensRefresh: {
      Method: 'workspace/semanticTokens/refresh';
      Params: undefined;
      Result: null;
      ClientCapability: 'workspace.semanticTokens.refreshSupport';
      Since: '3.16.0';
      Direction: 'serverToClient';
    };
    InlineValueRefresh: {
      Method: 'workspace/inlineValue/refresh';
      Params: undefined;
      Result: null;
      ClientCapability: 'workspace.inlineValue.refreshSupport';
      Since: '3.17.0';
      Direction: 'serverToClient';
    };
    InlayHintRefresh: {
      Method: 'workspace/inlayHint/refresh';
      Params: undefined;
      Result: null;
      ClientCapability: 'workspace.inlayHint.refreshSupport';
      Since: '3.17.0';
      Direction: 'serverToClient';
    };
    DiagnosticRefresh: {
      Method: 'workspace/diagnostic/refresh';
      Params: undefined;
      Result: null;
      ClientCapability: 'workspace.diagnostics.refreshSupport';
      Since: '3.17.0';
      Direction: 'serverToClient';
    };
    TextDocumentContentRefresh: {
      Method: 'workspace/textDocumentContent/refresh';
      Params: LSP.TextDocumentContentRefreshParams;
      Result: null;
      Since: '3.18.0';
      Proposed: true;
      Direction: 'serverToClient';
    };
    CodeLensRefresh: {
      Method: 'workspace/codeLens/refresh';
      Params: undefined;
      Result: null;
      ClientCapability: 'workspace.codeLens';
      Since: '3.16.0';
      Direction: 'serverToClient';
    };
    ApplyWorkspaceEdit: {
      Method: 'workspace/applyEdit';
      Params: LSP.ApplyWorkspaceEditParams;
      Result: LSP.ApplyWorkspaceEditResult;
      ClientCapability: 'workspace.applyEdit';
      Direction: 'serverToClient';
    };
  };
  WorkspaceSymbol: {
    Resolve: {
      Method: 'workspaceSymbol/resolve';
      Params: LSP.WorkspaceSymbol;
      Result: LSP.WorkspaceSymbol;
      ServerCapability: 'workspaceSymbolProvider.resolveProvider';
      ClientCapability: 'workspace.symbol.resolveSupport';
      Since: '3.17.0';
      Direction: 'clientToServer';
    };
  };
};
/** LSP Notification type definitions organized by namespace */
export type LSPNotification = {
  General: {
    Cancel: {
      Method: '$/cancelRequest';
      Params: LSP.CancelParams;
      Direction: 'both';
    };
    Progress: {
      Method: '$/progress';
      Params: LSP.ProgressParams;
      Direction: 'both';
    };
    SetTrace: {
      Method: '$/setTrace';
      Params: LSP.SetTraceParams;
      Direction: 'clientToServer';
    };
    LogTrace: {
      Method: '$/logTrace';
      Params: LSP.LogTraceParams;
      Direction: 'serverToClient';
    };
  };
  Lifecycle: {
    Initialized: {
      Method: 'initialized';
      Params: LSP.InitializedParams;
      Direction: 'clientToServer';
    };
    Exit: {
      Method: 'exit';
      Params: undefined;
      Direction: 'clientToServer';
    };
  };
  NotebookDocument: {
    DidOpenNotebookDocument: {
      Method: 'notebookDocument/didOpen';
      Params: LSP.DidOpenNotebookDocumentParams;
      RegistrationMethod: 'notebookDocument/sync';
      RegistrationOptions: LSP.NotebookDocumentSyncRegistrationOptions;
      Since: '3.17.0';
      Direction: 'clientToServer';
    };
    DidChangeNotebookDocument: {
      Method: 'notebookDocument/didChange';
      Params: LSP.DidChangeNotebookDocumentParams;
      RegistrationMethod: 'notebookDocument/sync';
      RegistrationOptions: LSP.NotebookDocumentSyncRegistrationOptions;
      Direction: 'clientToServer';
    };
    DidSaveNotebookDocument: {
      Method: 'notebookDocument/didSave';
      Params: LSP.DidSaveNotebookDocumentParams;
      RegistrationMethod: 'notebookDocument/sync';
      RegistrationOptions: LSP.NotebookDocumentSyncRegistrationOptions;
      Since: '3.17.0';
      Direction: 'clientToServer';
    };
    DidCloseNotebookDocument: {
      Method: 'notebookDocument/didClose';
      Params: LSP.DidCloseNotebookDocumentParams;
      RegistrationMethod: 'notebookDocument/sync';
      RegistrationOptions: LSP.NotebookDocumentSyncRegistrationOptions;
      Since: '3.17.0';
      Direction: 'clientToServer';
    };
  };
  Telemetry: {
    Event: {
      Method: 'telemetry/event';
      Params: LSP.LSPAny;
      Direction: 'serverToClient';
    };
  };
  TextDocument: {
    DidOpenTextDocument: {
      Method: 'textDocument/didOpen';
      Params: LSP.DidOpenTextDocumentParams;
      ClientCapability: 'textDocument.synchronization';
      ServerCapability: 'textDocumentSync.openClose';
      RegistrationOptions: LSP.TextDocumentRegistrationOptions;
      Direction: 'clientToServer';
    };
    DidChangeTextDocument: {
      Method: 'textDocument/didChange';
      Params: LSP.DidChangeTextDocumentParams;
      ClientCapability: 'textDocument.synchronization';
      ServerCapability: 'textDocumentSync';
      RegistrationOptions: LSP.TextDocumentChangeRegistrationOptions;
      Direction: 'clientToServer';
    };
    DidCloseTextDocument: {
      Method: 'textDocument/didClose';
      Params: LSP.DidCloseTextDocumentParams;
      ClientCapability: 'textDocument.synchronization';
      ServerCapability: 'textDocumentSync.openClose';
      RegistrationOptions: LSP.TextDocumentRegistrationOptions;
      Direction: 'clientToServer';
    };
    DidSaveTextDocument: {
      Method: 'textDocument/didSave';
      Params: LSP.DidSaveTextDocumentParams;
      ClientCapability: 'textDocument.synchronization.didSave';
      ServerCapability: 'textDocumentSync.save';
      RegistrationOptions: LSP.TextDocumentSaveRegistrationOptions;
      Direction: 'clientToServer';
    };
    WillSaveTextDocument: {
      Method: 'textDocument/willSave';
      Params: LSP.WillSaveTextDocumentParams;
      ClientCapability: 'textDocument.synchronization.willSave';
      ServerCapability: 'textDocumentSync.willSave';
      RegistrationOptions: LSP.TextDocumentRegistrationOptions;
      Direction: 'clientToServer';
    };
    PublishDiagnostics: {
      Method: 'textDocument/publishDiagnostics';
      Params: LSP.PublishDiagnosticsParams;
      ClientCapability: 'textDocument.publishDiagnostics';
      Direction: 'serverToClient';
    };
  };
  Window: {
    WorkDoneProgressCancel: {
      Method: 'window/workDoneProgress/cancel';
      Params: LSP.WorkDoneProgressCancelParams;
      Direction: 'clientToServer';
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
  Workspace: {
    DidChangeWorkspaceFolders: {
      Method: 'workspace/didChangeWorkspaceFolders';
      Params: LSP.DidChangeWorkspaceFoldersParams;
      ServerCapability: 'workspace.workspaceFolders.changeNotifications';
      Direction: 'clientToServer';
    };
    DidCreateFiles: {
      Method: 'workspace/didCreateFiles';
      Params: LSP.CreateFilesParams;
      ClientCapability: 'workspace.fileOperations.didCreate';
      ServerCapability: 'workspace.fileOperations.didCreate';
      RegistrationOptions: LSP.FileOperationRegistrationOptions;
      Since: '3.16.0';
      Direction: 'clientToServer';
    };
    DidRenameFiles: {
      Method: 'workspace/didRenameFiles';
      Params: LSP.RenameFilesParams;
      ClientCapability: 'workspace.fileOperations.didRename';
      ServerCapability: 'workspace.fileOperations.didRename';
      RegistrationOptions: LSP.FileOperationRegistrationOptions;
      Since: '3.16.0';
      Direction: 'clientToServer';
    };
    DidDeleteFiles: {
      Method: 'workspace/didDeleteFiles';
      Params: LSP.DeleteFilesParams;
      ClientCapability: 'workspace.fileOperations.didDelete';
      ServerCapability: 'workspace.fileOperations.didDelete';
      RegistrationOptions: LSP.FileOperationRegistrationOptions;
      Since: '3.16.0';
      Direction: 'clientToServer';
    };
    DidChangeConfiguration: {
      Method: 'workspace/didChangeConfiguration';
      Params: LSP.DidChangeConfigurationParams;
      ClientCapability: 'workspace.didChangeConfiguration';
      RegistrationOptions: LSP.DidChangeConfigurationRegistrationOptions;
      Direction: 'clientToServer';
    };
    DidChangeWatchedFiles: {
      Method: 'workspace/didChangeWatchedFiles';
      Params: LSP.DidChangeWatchedFilesParams;
      ClientCapability: 'workspace.didChangeWatchedFiles';
      RegistrationOptions: LSP.DidChangeWatchedFilesRegistrationOptions;
      Direction: 'clientToServer';
    };
  };
};

/**
 * LSP Request methods organized by namespace
 * @deprecated Use individual namespace exports instead
 */
export const LSPRequest = {
  CallHierarchy: {
    IncomingCalls: {
      Method: 'callHierarchy/incomingCalls',
      Direction: 'clientToServer'
    },
    OutgoingCalls: {
      Method: 'callHierarchy/outgoingCalls',
      Direction: 'clientToServer'
    }
  },
  Client: {
    Registration: {
      Method: 'client/registerCapability',
      Direction: 'serverToClient'
    },
    Unregistration: {
      Method: 'client/unregisterCapability',
      Direction: 'serverToClient'
    }
  },
  CodeAction: {
    Resolve: {
      Method: 'codeAction/resolve',
      Direction: 'clientToServer',
      ServerCapability: 'codeActionProvider.resolveProvider',
      ClientCapability: 'textDocument.codeAction.resolveSupport'
    }
  },
  CodeLens: {
    Resolve: {
      Method: 'codeLens/resolve',
      Direction: 'clientToServer',
      ServerCapability: 'codeLensProvider.resolveProvider',
      ClientCapability: 'textDocument.codeLens.resolveSupport'
    }
  },
  CompletionItem: {
    CompletionResolve: {
      Method: 'completionItem/resolve',
      Direction: 'clientToServer',
      ServerCapability: 'completionProvider.resolveProvider',
      ClientCapability: 'textDocument.completion.completionItem.resolveSupport'
    }
  },
  DocumentLink: {
    Resolve: {
      Method: 'documentLink/resolve',
      Direction: 'clientToServer',
      ServerCapability: 'documentLinkProvider.resolveProvider',
      ClientCapability: 'textDocument.documentLink'
    }
  },
  InlayHint: {
    Resolve: {
      Method: 'inlayHint/resolve',
      Direction: 'clientToServer',
      ServerCapability: 'inlayHintProvider.resolveProvider',
      ClientCapability: 'textDocument.inlayHint.resolveSupport'
    }
  },
  Lifecycle: {
    Initialize: {
      Method: 'initialize',
      Direction: 'clientToServer'
    },
    Shutdown: {
      Method: 'shutdown',
      Direction: 'clientToServer'
    }
  },
  TextDocument: {
    Implementation: {
      Method: 'textDocument/implementation',
      Direction: 'clientToServer',
      ServerCapability: 'implementationProvider',
      ClientCapability: 'textDocument.implementation'
    },
    TypeDefinition: {
      Method: 'textDocument/typeDefinition',
      Direction: 'clientToServer',
      ServerCapability: 'typeDefinitionProvider',
      ClientCapability: 'textDocument.typeDefinition'
    },
    DocumentColor: {
      Method: 'textDocument/documentColor',
      Direction: 'clientToServer',
      ServerCapability: 'colorProvider',
      ClientCapability: 'textDocument.colorProvider'
    },
    ColorPresentation: {
      Method: 'textDocument/colorPresentation',
      Direction: 'clientToServer',
      ServerCapability: 'colorProvider',
      ClientCapability: 'textDocument.colorProvider'
    },
    FoldingRange: {
      Method: 'textDocument/foldingRange',
      Direction: 'clientToServer',
      ServerCapability: 'foldingRangeProvider',
      ClientCapability: 'textDocument.foldingRange'
    },
    Declaration: {
      Method: 'textDocument/declaration',
      Direction: 'clientToServer',
      ServerCapability: 'declarationProvider',
      ClientCapability: 'textDocument.declaration'
    },
    SelectionRange: {
      Method: 'textDocument/selectionRange',
      Direction: 'clientToServer',
      ServerCapability: 'selectionRangeProvider',
      ClientCapability: 'textDocument.selectionRange'
    },
    CallHierarchyPrepare: {
      Method: 'textDocument/prepareCallHierarchy',
      Direction: 'clientToServer',
      ServerCapability: 'callHierarchyProvider',
      ClientCapability: 'textDocument.callHierarchy'
    },
    SemanticTokens: {
      Method: 'textDocument/semanticTokens/full',
      Direction: 'clientToServer',
      ServerCapability: 'semanticTokensProvider',
      ClientCapability: 'textDocument.semanticTokens',
      RegistrationMethod: 'textDocument/semanticTokens'
    },
    SemanticTokensDelta: {
      Method: 'textDocument/semanticTokens/full/delta',
      Direction: 'clientToServer',
      ServerCapability: 'semanticTokensProvider.full.delta',
      ClientCapability: 'textDocument.semanticTokens.requests.full.delta',
      RegistrationMethod: 'textDocument/semanticTokens'
    },
    SemanticTokensRange: {
      Method: 'textDocument/semanticTokens/range',
      Direction: 'clientToServer',
      ServerCapability: 'semanticTokensProvider.range',
      ClientCapability: 'textDocument.semanticTokens.requests.range',
      RegistrationMethod: 'textDocument/semanticTokens'
    },
    LinkedEditingRange: {
      Method: 'textDocument/linkedEditingRange',
      Direction: 'clientToServer',
      ServerCapability: 'linkedEditingRangeProvider',
      ClientCapability: 'textDocument.linkedEditingRange'
    },
    Moniker: {
      Method: 'textDocument/moniker',
      Direction: 'clientToServer',
      ServerCapability: 'monikerProvider',
      ClientCapability: 'textDocument.moniker'
    },
    TypeHierarchyPrepare: {
      Method: 'textDocument/prepareTypeHierarchy',
      Direction: 'clientToServer',
      ServerCapability: 'typeHierarchyProvider',
      ClientCapability: 'textDocument.typeHierarchy'
    },
    InlineValue: {
      Method: 'textDocument/inlineValue',
      Direction: 'clientToServer',
      ServerCapability: 'inlineValueProvider',
      ClientCapability: 'textDocument.inlineValue'
    },
    InlayHint: {
      Method: 'textDocument/inlayHint',
      Direction: 'clientToServer',
      ServerCapability: 'inlayHintProvider',
      ClientCapability: 'textDocument.inlayHint'
    },
    DocumentDiagnostic: {
      Method: 'textDocument/diagnostic',
      Direction: 'clientToServer',
      ServerCapability: 'diagnosticProvider',
      ClientCapability: 'textDocument.diagnostic'
    },
    InlineCompletion: {
      Method: 'textDocument/inlineCompletion',
      Direction: 'clientToServer',
      ServerCapability: 'inlineCompletionProvider',
      ClientCapability: 'textDocument.inlineCompletion'
    },
    WillSaveTextDocumentWaitUntil: {
      Method: 'textDocument/willSaveWaitUntil',
      Direction: 'clientToServer',
      ServerCapability: 'textDocumentSync.willSaveWaitUntil',
      ClientCapability: 'textDocument.synchronization.willSaveWaitUntil'
    },
    Completion: {
      Method: 'textDocument/completion',
      Direction: 'clientToServer',
      ServerCapability: 'completionProvider',
      ClientCapability: 'textDocument.completion'
    },
    Hover: {
      Method: 'textDocument/hover',
      Direction: 'clientToServer',
      ServerCapability: 'hoverProvider',
      ClientCapability: 'textDocument.hover'
    },
    SignatureHelp: {
      Method: 'textDocument/signatureHelp',
      Direction: 'clientToServer',
      ServerCapability: 'signatureHelpProvider',
      ClientCapability: 'textDocument.signatureHelp'
    },
    Definition: {
      Method: 'textDocument/definition',
      Direction: 'clientToServer',
      ServerCapability: 'definitionProvider',
      ClientCapability: 'textDocument.definition'
    },
    References: {
      Method: 'textDocument/references',
      Direction: 'clientToServer',
      ServerCapability: 'referencesProvider',
      ClientCapability: 'textDocument.references'
    },
    DocumentHighlight: {
      Method: 'textDocument/documentHighlight',
      Direction: 'clientToServer',
      ServerCapability: 'documentHighlightProvider',
      ClientCapability: 'textDocument.documentHighlight'
    },
    DocumentSymbol: {
      Method: 'textDocument/documentSymbol',
      Direction: 'clientToServer',
      ServerCapability: 'documentSymbolProvider',
      ClientCapability: 'textDocument.documentSymbol'
    },
    CodeAction: {
      Method: 'textDocument/codeAction',
      Direction: 'clientToServer',
      ServerCapability: 'codeActionProvider',
      ClientCapability: 'textDocument.codeAction'
    },
    CodeLens: {
      Method: 'textDocument/codeLens',
      Direction: 'clientToServer',
      ServerCapability: 'codeLensProvider',
      ClientCapability: 'textDocument.codeLens'
    },
    DocumentLink: {
      Method: 'textDocument/documentLink',
      Direction: 'clientToServer',
      ServerCapability: 'documentLinkProvider',
      ClientCapability: 'textDocument.documentLink'
    },
    DocumentFormatting: {
      Method: 'textDocument/formatting',
      Direction: 'clientToServer',
      ServerCapability: 'documentFormattingProvider',
      ClientCapability: 'textDocument.formatting'
    },
    DocumentRangeFormatting: {
      Method: 'textDocument/rangeFormatting',
      Direction: 'clientToServer',
      ServerCapability: 'documentRangeFormattingProvider',
      ClientCapability: 'textDocument.rangeFormatting'
    },
    DocumentRangesFormatting: {
      Method: 'textDocument/rangesFormatting',
      Direction: 'clientToServer',
      ServerCapability: 'documentRangeFormattingProvider.rangesSupport',
      ClientCapability: 'textDocument.rangeFormatting.rangesSupport'
    },
    DocumentOnTypeFormatting: {
      Method: 'textDocument/onTypeFormatting',
      Direction: 'clientToServer',
      ServerCapability: 'documentOnTypeFormattingProvider',
      ClientCapability: 'textDocument.onTypeFormatting'
    },
    Rename: {
      Method: 'textDocument/rename',
      Direction: 'clientToServer',
      ServerCapability: 'renameProvider',
      ClientCapability: 'textDocument.rename'
    },
    PrepareRename: {
      Method: 'textDocument/prepareRename',
      Direction: 'clientToServer',
      ServerCapability: 'renameProvider.prepareProvider',
      ClientCapability: 'textDocument.rename.prepareSupport'
    }
  },
  TypeHierarchy: {
    Supertypes: {
      Method: 'typeHierarchy/supertypes',
      Direction: 'clientToServer'
    },
    Subtypes: {
      Method: 'typeHierarchy/subtypes',
      Direction: 'clientToServer'
    }
  },
  Window: {
    WorkDoneProgressCreate: {
      Method: 'window/workDoneProgress/create',
      Direction: 'serverToClient',
      ClientCapability: 'window.workDoneProgress'
    },
    ShowDocument: {
      Method: 'window/showDocument',
      Direction: 'serverToClient',
      ClientCapability: 'window.showDocument.support'
    },
    ShowMessage: {
      Method: 'window/showMessageRequest',
      Direction: 'serverToClient',
      ClientCapability: 'window.showMessage'
    }
  },
  Workspace: {
    WillCreateFiles: {
      Method: 'workspace/willCreateFiles',
      Direction: 'clientToServer',
      ServerCapability: 'workspace.fileOperations.willCreate',
      ClientCapability: 'workspace.fileOperations.willCreate'
    },
    WillRenameFiles: {
      Method: 'workspace/willRenameFiles',
      Direction: 'clientToServer',
      ServerCapability: 'workspace.fileOperations.willRename',
      ClientCapability: 'workspace.fileOperations.willRename'
    },
    WillDeleteFiles: {
      Method: 'workspace/willDeleteFiles',
      Direction: 'clientToServer',
      ServerCapability: 'workspace.fileOperations.willDelete',
      ClientCapability: 'workspace.fileOperations.willDelete'
    },
    Diagnostic: {
      Method: 'workspace/diagnostic',
      Direction: 'clientToServer',
      ServerCapability: 'diagnosticProvider.workspaceDiagnostics',
      ClientCapability: 'workspace.diagnostics'
    },
    TextDocumentContent: {
      Method: 'workspace/textDocumentContent',
      Direction: 'clientToServer',
      ServerCapability: 'workspace.textDocumentContent',
      ClientCapability: 'workspace.textDocumentContent'
    },
    Symbol: {
      Method: 'workspace/symbol',
      Direction: 'clientToServer',
      ServerCapability: 'workspaceSymbolProvider',
      ClientCapability: 'workspace.symbol'
    },
    ExecuteCommand: {
      Method: 'workspace/executeCommand',
      Direction: 'clientToServer',
      ServerCapability: 'executeCommandProvider',
      ClientCapability: 'workspace.executeCommand'
    },
    Folders: {
      Method: 'workspace/workspaceFolders',
      Direction: 'serverToClient',
      ServerCapability: 'workspace.workspaceFolders',
      ClientCapability: 'workspace.workspaceFolders'
    },
    Configuration: {
      Method: 'workspace/configuration',
      Direction: 'serverToClient',
      ClientCapability: 'workspace.configuration'
    },
    FoldingRangeRefresh: {
      Method: 'workspace/foldingRange/refresh',
      Direction: 'serverToClient',
      ClientCapability: 'workspace.foldingRange.refreshSupport'
    },
    SemanticTokensRefresh: {
      Method: 'workspace/semanticTokens/refresh',
      Direction: 'serverToClient',
      ClientCapability: 'workspace.semanticTokens.refreshSupport'
    },
    InlineValueRefresh: {
      Method: 'workspace/inlineValue/refresh',
      Direction: 'serverToClient',
      ClientCapability: 'workspace.inlineValue.refreshSupport'
    },
    InlayHintRefresh: {
      Method: 'workspace/inlayHint/refresh',
      Direction: 'serverToClient',
      ClientCapability: 'workspace.inlayHint.refreshSupport'
    },
    DiagnosticRefresh: {
      Method: 'workspace/diagnostic/refresh',
      Direction: 'serverToClient',
      ClientCapability: 'workspace.diagnostics.refreshSupport'
    },
    TextDocumentContentRefresh: {
      Method: 'workspace/textDocumentContent/refresh',
      Direction: 'serverToClient'
    },
    CodeLensRefresh: {
      Method: 'workspace/codeLens/refresh',
      Direction: 'serverToClient',
      ClientCapability: 'workspace.codeLens'
    },
    ApplyWorkspaceEdit: {
      Method: 'workspace/applyEdit',
      Direction: 'serverToClient',
      ClientCapability: 'workspace.applyEdit'
    }
  },
  WorkspaceSymbol: {
    Resolve: {
      Method: 'workspaceSymbol/resolve',
      Direction: 'clientToServer',
      ServerCapability: 'workspaceSymbolProvider.resolveProvider',
      ClientCapability: 'workspace.symbol.resolveSupport'
    }
  }
} as const;
/**
 * LSP Notification methods organized by namespace
 * @deprecated Use individual namespace exports instead
 */
export const LSPNotification = {
  General: {
    Cancel: {
      Method: '$/cancelRequest',
      Direction: 'both'
    },
    Progress: {
      Method: '$/progress',
      Direction: 'both'
    },
    SetTrace: {
      Method: '$/setTrace',
      Direction: 'clientToServer'
    },
    LogTrace: {
      Method: '$/logTrace',
      Direction: 'serverToClient'
    }
  },
  Lifecycle: {
    Initialized: {
      Method: 'initialized',
      Direction: 'clientToServer'
    },
    Exit: {
      Method: 'exit',
      Direction: 'clientToServer'
    }
  },
  NotebookDocument: {
    DidOpenNotebookDocument: {
      Method: 'notebookDocument/didOpen',
      Direction: 'clientToServer',
      RegistrationMethod: 'notebookDocument/sync'
    },
    DidChangeNotebookDocument: {
      Method: 'notebookDocument/didChange',
      Direction: 'clientToServer',
      RegistrationMethod: 'notebookDocument/sync'
    },
    DidSaveNotebookDocument: {
      Method: 'notebookDocument/didSave',
      Direction: 'clientToServer',
      RegistrationMethod: 'notebookDocument/sync'
    },
    DidCloseNotebookDocument: {
      Method: 'notebookDocument/didClose',
      Direction: 'clientToServer',
      RegistrationMethod: 'notebookDocument/sync'
    }
  },
  Telemetry: {
    Event: {
      Method: 'telemetry/event',
      Direction: 'serverToClient'
    }
  },
  TextDocument: {
    DidOpenTextDocument: {
      Method: 'textDocument/didOpen',
      Direction: 'clientToServer',
      ServerCapability: 'textDocumentSync.openClose',
      ClientCapability: 'textDocument.synchronization'
    },
    DidChangeTextDocument: {
      Method: 'textDocument/didChange',
      Direction: 'clientToServer',
      ServerCapability: 'textDocumentSync',
      ClientCapability: 'textDocument.synchronization'
    },
    DidCloseTextDocument: {
      Method: 'textDocument/didClose',
      Direction: 'clientToServer',
      ServerCapability: 'textDocumentSync.openClose',
      ClientCapability: 'textDocument.synchronization'
    },
    DidSaveTextDocument: {
      Method: 'textDocument/didSave',
      Direction: 'clientToServer',
      ServerCapability: 'textDocumentSync.save',
      ClientCapability: 'textDocument.synchronization.didSave'
    },
    WillSaveTextDocument: {
      Method: 'textDocument/willSave',
      Direction: 'clientToServer',
      ServerCapability: 'textDocumentSync.willSave',
      ClientCapability: 'textDocument.synchronization.willSave'
    },
    PublishDiagnostics: {
      Method: 'textDocument/publishDiagnostics',
      Direction: 'serverToClient',
      ClientCapability: 'textDocument.publishDiagnostics'
    }
  },
  Window: {
    WorkDoneProgressCancel: {
      Method: 'window/workDoneProgress/cancel',
      Direction: 'clientToServer'
    },
    ShowMessage: {
      Method: 'window/showMessage',
      Direction: 'serverToClient',
      ClientCapability: 'window.showMessage'
    },
    LogMessage: {
      Method: 'window/logMessage',
      Direction: 'serverToClient'
    }
  },
  Workspace: {
    DidChangeWorkspaceFolders: {
      Method: 'workspace/didChangeWorkspaceFolders',
      Direction: 'clientToServer',
      ServerCapability: 'workspace.workspaceFolders.changeNotifications'
    },
    DidCreateFiles: {
      Method: 'workspace/didCreateFiles',
      Direction: 'clientToServer',
      ServerCapability: 'workspace.fileOperations.didCreate',
      ClientCapability: 'workspace.fileOperations.didCreate'
    },
    DidRenameFiles: {
      Method: 'workspace/didRenameFiles',
      Direction: 'clientToServer',
      ServerCapability: 'workspace.fileOperations.didRename',
      ClientCapability: 'workspace.fileOperations.didRename'
    },
    DidDeleteFiles: {
      Method: 'workspace/didDeleteFiles',
      Direction: 'clientToServer',
      ServerCapability: 'workspace.fileOperations.didDelete',
      ClientCapability: 'workspace.fileOperations.didDelete'
    },
    DidChangeConfiguration: {
      Method: 'workspace/didChangeConfiguration',
      Direction: 'clientToServer',
      ClientCapability: 'workspace.didChangeConfiguration'
    },
    DidChangeWatchedFiles: {
      Method: 'workspace/didChangeWatchedFiles',
      Direction: 'clientToServer',
      ClientCapability: 'workspace.didChangeWatchedFiles'
    }
  }
} as const;
