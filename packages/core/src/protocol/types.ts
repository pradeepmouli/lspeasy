/**
 * LSP Protocol Types — inferred from Zod schemas
 *
 * Auto-generated from metaModel.json
 * DO NOT EDIT MANUALLY
 */

import type { z } from 'zod';
import type * as Schemas from './schemas.js';

// Enum types (TypeScript enum declarations)
export type * from './enums.js';

// Structure and type-alias types inferred from Zod schemas
export type ImplementationParams = z.infer<typeof Schemas.ImplementationParamsSchema>;
export type Location = z.infer<typeof Schemas.LocationSchema>;
export type ImplementationRegistrationOptions = z.infer<
  typeof Schemas.ImplementationRegistrationOptionsSchema
>;
export type TypeDefinitionParams = z.infer<typeof Schemas.TypeDefinitionParamsSchema>;
export type TypeDefinitionRegistrationOptions = z.infer<
  typeof Schemas.TypeDefinitionRegistrationOptionsSchema
>;
export type WorkspaceFolder = z.infer<typeof Schemas.WorkspaceFolderSchema>;
export type DidChangeWorkspaceFoldersParams = z.infer<
  typeof Schemas.DidChangeWorkspaceFoldersParamsSchema
>;
export type ConfigurationParams = z.infer<typeof Schemas.ConfigurationParamsSchema>;
export type DocumentColorParams = z.infer<typeof Schemas.DocumentColorParamsSchema>;
export type ColorInformation = z.infer<typeof Schemas.ColorInformationSchema>;
export type DocumentColorRegistrationOptions = z.infer<
  typeof Schemas.DocumentColorRegistrationOptionsSchema
>;
export type ColorPresentationParams = z.infer<typeof Schemas.ColorPresentationParamsSchema>;
export type ColorPresentation = z.infer<typeof Schemas.ColorPresentationSchema>;
export type WorkDoneProgressOptions = z.infer<typeof Schemas.WorkDoneProgressOptionsSchema>;
export type TextDocumentRegistrationOptions = z.infer<
  typeof Schemas.TextDocumentRegistrationOptionsSchema
>;
export type FoldingRangeParams = z.infer<typeof Schemas.FoldingRangeParamsSchema>;
export type FoldingRange = z.infer<typeof Schemas.FoldingRangeSchema>;
export type FoldingRangeRegistrationOptions = z.infer<
  typeof Schemas.FoldingRangeRegistrationOptionsSchema
>;
export type DeclarationParams = z.infer<typeof Schemas.DeclarationParamsSchema>;
export type DeclarationRegistrationOptions = z.infer<
  typeof Schemas.DeclarationRegistrationOptionsSchema
>;
export type SelectionRangeParams = z.infer<typeof Schemas.SelectionRangeParamsSchema>;
export type SelectionRange = z.infer<typeof Schemas.SelectionRangeSchema>;
export type SelectionRangeRegistrationOptions = z.infer<
  typeof Schemas.SelectionRangeRegistrationOptionsSchema
>;
export type WorkDoneProgressCreateParams = z.infer<
  typeof Schemas.WorkDoneProgressCreateParamsSchema
>;
export type WorkDoneProgressCancelParams = z.infer<
  typeof Schemas.WorkDoneProgressCancelParamsSchema
>;
export type CallHierarchyPrepareParams = z.infer<typeof Schemas.CallHierarchyPrepareParamsSchema>;
export type CallHierarchyItem = z.infer<typeof Schemas.CallHierarchyItemSchema>;
export type CallHierarchyRegistrationOptions = z.infer<
  typeof Schemas.CallHierarchyRegistrationOptionsSchema
>;
export type CallHierarchyIncomingCallsParams = z.infer<
  typeof Schemas.CallHierarchyIncomingCallsParamsSchema
>;
export type CallHierarchyIncomingCall = z.infer<typeof Schemas.CallHierarchyIncomingCallSchema>;
export type CallHierarchyOutgoingCallsParams = z.infer<
  typeof Schemas.CallHierarchyOutgoingCallsParamsSchema
>;
export type CallHierarchyOutgoingCall = z.infer<typeof Schemas.CallHierarchyOutgoingCallSchema>;
export type SemanticTokensParams = z.infer<typeof Schemas.SemanticTokensParamsSchema>;
export type SemanticTokens = z.infer<typeof Schemas.SemanticTokensSchema>;
export type SemanticTokensPartialResult = z.infer<typeof Schemas.SemanticTokensPartialResultSchema>;
export type SemanticTokensRegistrationOptions = z.infer<
  typeof Schemas.SemanticTokensRegistrationOptionsSchema
>;
export type SemanticTokensDeltaParams = z.infer<typeof Schemas.SemanticTokensDeltaParamsSchema>;
export type SemanticTokensDelta = z.infer<typeof Schemas.SemanticTokensDeltaSchema>;
export type SemanticTokensDeltaPartialResult = z.infer<
  typeof Schemas.SemanticTokensDeltaPartialResultSchema
>;
export type SemanticTokensRangeParams = z.infer<typeof Schemas.SemanticTokensRangeParamsSchema>;
export type ShowDocumentParams = z.infer<typeof Schemas.ShowDocumentParamsSchema>;
export type ShowDocumentResult = z.infer<typeof Schemas.ShowDocumentResultSchema>;
export type LinkedEditingRangeParams = z.infer<typeof Schemas.LinkedEditingRangeParamsSchema>;
export type LinkedEditingRanges = z.infer<typeof Schemas.LinkedEditingRangesSchema>;
export type LinkedEditingRangeRegistrationOptions = z.infer<
  typeof Schemas.LinkedEditingRangeRegistrationOptionsSchema
>;
export type CreateFilesParams = z.infer<typeof Schemas.CreateFilesParamsSchema>;
export type WorkspaceEdit = z.infer<typeof Schemas.WorkspaceEditSchema>;
export type FileOperationRegistrationOptions = z.infer<
  typeof Schemas.FileOperationRegistrationOptionsSchema
>;
export type RenameFilesParams = z.infer<typeof Schemas.RenameFilesParamsSchema>;
export type DeleteFilesParams = z.infer<typeof Schemas.DeleteFilesParamsSchema>;
export type MonikerParams = z.infer<typeof Schemas.MonikerParamsSchema>;
export type Moniker = z.infer<typeof Schemas.MonikerSchema>;
export type MonikerRegistrationOptions = z.infer<typeof Schemas.MonikerRegistrationOptionsSchema>;
export type TypeHierarchyPrepareParams = z.infer<typeof Schemas.TypeHierarchyPrepareParamsSchema>;
export type TypeHierarchyItem = z.infer<typeof Schemas.TypeHierarchyItemSchema>;
export type TypeHierarchyRegistrationOptions = z.infer<
  typeof Schemas.TypeHierarchyRegistrationOptionsSchema
>;
export type TypeHierarchySupertypesParams = z.infer<
  typeof Schemas.TypeHierarchySupertypesParamsSchema
>;
export type TypeHierarchySubtypesParams = z.infer<typeof Schemas.TypeHierarchySubtypesParamsSchema>;
export type InlineValueParams = z.infer<typeof Schemas.InlineValueParamsSchema>;
export type InlineValueRegistrationOptions = z.infer<
  typeof Schemas.InlineValueRegistrationOptionsSchema
>;
export type InlayHintParams = z.infer<typeof Schemas.InlayHintParamsSchema>;
export type InlayHint = z.infer<typeof Schemas.InlayHintSchema>;
export type InlayHintRegistrationOptions = z.infer<
  typeof Schemas.InlayHintRegistrationOptionsSchema
>;
export type DocumentDiagnosticParams = z.infer<typeof Schemas.DocumentDiagnosticParamsSchema>;
export type DocumentDiagnosticReportPartialResult = z.infer<
  typeof Schemas.DocumentDiagnosticReportPartialResultSchema
>;
export type DiagnosticServerCancellationData = z.infer<
  typeof Schemas.DiagnosticServerCancellationDataSchema
>;
export type DiagnosticRegistrationOptions = z.infer<
  typeof Schemas.DiagnosticRegistrationOptionsSchema
>;
export type WorkspaceDiagnosticParams = z.infer<typeof Schemas.WorkspaceDiagnosticParamsSchema>;
export type WorkspaceDiagnosticReport = z.infer<typeof Schemas.WorkspaceDiagnosticReportSchema>;
export type WorkspaceDiagnosticReportPartialResult = z.infer<
  typeof Schemas.WorkspaceDiagnosticReportPartialResultSchema
>;
export type DidOpenNotebookDocumentParams = z.infer<
  typeof Schemas.DidOpenNotebookDocumentParamsSchema
>;
export type NotebookDocumentSyncRegistrationOptions = z.infer<
  typeof Schemas.NotebookDocumentSyncRegistrationOptionsSchema
>;
export type DidChangeNotebookDocumentParams = z.infer<
  typeof Schemas.DidChangeNotebookDocumentParamsSchema
>;
export type DidSaveNotebookDocumentParams = z.infer<
  typeof Schemas.DidSaveNotebookDocumentParamsSchema
>;
export type DidCloseNotebookDocumentParams = z.infer<
  typeof Schemas.DidCloseNotebookDocumentParamsSchema
>;
export type InlineCompletionParams = z.infer<typeof Schemas.InlineCompletionParamsSchema>;
export type InlineCompletionList = z.infer<typeof Schemas.InlineCompletionListSchema>;
export type InlineCompletionItem = z.infer<typeof Schemas.InlineCompletionItemSchema>;
export type InlineCompletionRegistrationOptions = z.infer<
  typeof Schemas.InlineCompletionRegistrationOptionsSchema
>;
export type TextDocumentContentParams = z.infer<typeof Schemas.TextDocumentContentParamsSchema>;
export type TextDocumentContentResult = z.infer<typeof Schemas.TextDocumentContentResultSchema>;
export type TextDocumentContentRegistrationOptions = z.infer<
  typeof Schemas.TextDocumentContentRegistrationOptionsSchema
>;
export type TextDocumentContentRefreshParams = z.infer<
  typeof Schemas.TextDocumentContentRefreshParamsSchema
>;
export type RegistrationParams = z.infer<typeof Schemas.RegistrationParamsSchema>;
export type UnregistrationParams = z.infer<typeof Schemas.UnregistrationParamsSchema>;
export type InitializeParams = z.infer<typeof Schemas.InitializeParamsSchema>;
export type InitializeResult = z.infer<typeof Schemas.InitializeResultSchema>;
export type InitializeError = z.infer<typeof Schemas.InitializeErrorSchema>;
export type InitializedParams = z.infer<typeof Schemas.InitializedParamsSchema>;
export type DidChangeConfigurationParams = z.infer<
  typeof Schemas.DidChangeConfigurationParamsSchema
>;
export type DidChangeConfigurationRegistrationOptions = z.infer<
  typeof Schemas.DidChangeConfigurationRegistrationOptionsSchema
>;
export type ShowMessageParams = z.infer<typeof Schemas.ShowMessageParamsSchema>;
export type ShowMessageRequestParams = z.infer<typeof Schemas.ShowMessageRequestParamsSchema>;
export type MessageActionItem = z.infer<typeof Schemas.MessageActionItemSchema>;
export type LogMessageParams = z.infer<typeof Schemas.LogMessageParamsSchema>;
export type DidOpenTextDocumentParams = z.infer<typeof Schemas.DidOpenTextDocumentParamsSchema>;
export type DidChangeTextDocumentParams = z.infer<typeof Schemas.DidChangeTextDocumentParamsSchema>;
export type TextDocumentChangeRegistrationOptions = z.infer<
  typeof Schemas.TextDocumentChangeRegistrationOptionsSchema
>;
export type DidCloseTextDocumentParams = z.infer<typeof Schemas.DidCloseTextDocumentParamsSchema>;
export type DidSaveTextDocumentParams = z.infer<typeof Schemas.DidSaveTextDocumentParamsSchema>;
export type TextDocumentSaveRegistrationOptions = z.infer<
  typeof Schemas.TextDocumentSaveRegistrationOptionsSchema
>;
export type WillSaveTextDocumentParams = z.infer<typeof Schemas.WillSaveTextDocumentParamsSchema>;
export type TextEdit = z.infer<typeof Schemas.TextEditSchema>;
export type DidChangeWatchedFilesParams = z.infer<typeof Schemas.DidChangeWatchedFilesParamsSchema>;
export type DidChangeWatchedFilesRegistrationOptions = z.infer<
  typeof Schemas.DidChangeWatchedFilesRegistrationOptionsSchema
>;
export type PublishDiagnosticsParams = z.infer<typeof Schemas.PublishDiagnosticsParamsSchema>;
export type CompletionParams = z.infer<typeof Schemas.CompletionParamsSchema>;
export type CompletionItem = z.infer<typeof Schemas.CompletionItemSchema>;
export type CompletionList = z.infer<typeof Schemas.CompletionListSchema>;
export type CompletionRegistrationOptions = z.infer<
  typeof Schemas.CompletionRegistrationOptionsSchema
>;
export type HoverParams = z.infer<typeof Schemas.HoverParamsSchema>;
export type Hover = z.infer<typeof Schemas.HoverSchema>;
export type HoverRegistrationOptions = z.infer<typeof Schemas.HoverRegistrationOptionsSchema>;
export type SignatureHelpParams = z.infer<typeof Schemas.SignatureHelpParamsSchema>;
export type SignatureHelp = z.infer<typeof Schemas.SignatureHelpSchema>;
export type SignatureHelpRegistrationOptions = z.infer<
  typeof Schemas.SignatureHelpRegistrationOptionsSchema
>;
export type DefinitionParams = z.infer<typeof Schemas.DefinitionParamsSchema>;
export type DefinitionRegistrationOptions = z.infer<
  typeof Schemas.DefinitionRegistrationOptionsSchema
>;
export type ReferenceParams = z.infer<typeof Schemas.ReferenceParamsSchema>;
export type ReferenceRegistrationOptions = z.infer<
  typeof Schemas.ReferenceRegistrationOptionsSchema
>;
export type DocumentHighlightParams = z.infer<typeof Schemas.DocumentHighlightParamsSchema>;
export type DocumentHighlight = z.infer<typeof Schemas.DocumentHighlightSchema>;
export type DocumentHighlightRegistrationOptions = z.infer<
  typeof Schemas.DocumentHighlightRegistrationOptionsSchema
>;
export type DocumentSymbolParams = z.infer<typeof Schemas.DocumentSymbolParamsSchema>;
export type SymbolInformation = z.infer<typeof Schemas.SymbolInformationSchema>;
export type DocumentSymbol = z.infer<typeof Schemas.DocumentSymbolSchema>;
export type DocumentSymbolRegistrationOptions = z.infer<
  typeof Schemas.DocumentSymbolRegistrationOptionsSchema
>;
export type CodeActionParams = z.infer<typeof Schemas.CodeActionParamsSchema>;
export type Command = z.infer<typeof Schemas.CommandSchema>;
export type CodeAction = z.infer<typeof Schemas.CodeActionSchema>;
export type CodeActionRegistrationOptions = z.infer<
  typeof Schemas.CodeActionRegistrationOptionsSchema
>;
export type WorkspaceSymbolParams = z.infer<typeof Schemas.WorkspaceSymbolParamsSchema>;
export type WorkspaceSymbol = z.infer<typeof Schemas.WorkspaceSymbolSchema>;
export type WorkspaceSymbolRegistrationOptions = z.infer<
  typeof Schemas.WorkspaceSymbolRegistrationOptionsSchema
>;
export type CodeLensParams = z.infer<typeof Schemas.CodeLensParamsSchema>;
export type CodeLens = z.infer<typeof Schemas.CodeLensSchema>;
export type CodeLensRegistrationOptions = z.infer<typeof Schemas.CodeLensRegistrationOptionsSchema>;
export type DocumentLinkParams = z.infer<typeof Schemas.DocumentLinkParamsSchema>;
export type DocumentLink = z.infer<typeof Schemas.DocumentLinkSchema>;
export type DocumentLinkRegistrationOptions = z.infer<
  typeof Schemas.DocumentLinkRegistrationOptionsSchema
>;
export type DocumentFormattingParams = z.infer<typeof Schemas.DocumentFormattingParamsSchema>;
export type DocumentFormattingRegistrationOptions = z.infer<
  typeof Schemas.DocumentFormattingRegistrationOptionsSchema
>;
export type DocumentRangeFormattingParams = z.infer<
  typeof Schemas.DocumentRangeFormattingParamsSchema
>;
export type DocumentRangeFormattingRegistrationOptions = z.infer<
  typeof Schemas.DocumentRangeFormattingRegistrationOptionsSchema
>;
export type DocumentRangesFormattingParams = z.infer<
  typeof Schemas.DocumentRangesFormattingParamsSchema
>;
export type DocumentOnTypeFormattingParams = z.infer<
  typeof Schemas.DocumentOnTypeFormattingParamsSchema
>;
export type DocumentOnTypeFormattingRegistrationOptions = z.infer<
  typeof Schemas.DocumentOnTypeFormattingRegistrationOptionsSchema
>;
export type RenameParams = z.infer<typeof Schemas.RenameParamsSchema>;
export type RenameRegistrationOptions = z.infer<typeof Schemas.RenameRegistrationOptionsSchema>;
export type PrepareRenameParams = z.infer<typeof Schemas.PrepareRenameParamsSchema>;
export type ExecuteCommandParams = z.infer<typeof Schemas.ExecuteCommandParamsSchema>;
export type ExecuteCommandRegistrationOptions = z.infer<
  typeof Schemas.ExecuteCommandRegistrationOptionsSchema
>;
export type ApplyWorkspaceEditParams = z.infer<typeof Schemas.ApplyWorkspaceEditParamsSchema>;
export type ApplyWorkspaceEditResult = z.infer<typeof Schemas.ApplyWorkspaceEditResultSchema>;
export type WorkDoneProgressBegin = z.infer<typeof Schemas.WorkDoneProgressBeginSchema>;
export type WorkDoneProgressReport = z.infer<typeof Schemas.WorkDoneProgressReportSchema>;
export type WorkDoneProgressEnd = z.infer<typeof Schemas.WorkDoneProgressEndSchema>;
export type SetTraceParams = z.infer<typeof Schemas.SetTraceParamsSchema>;
export type LogTraceParams = z.infer<typeof Schemas.LogTraceParamsSchema>;
export type CancelParams = z.infer<typeof Schemas.CancelParamsSchema>;
export type ProgressParams = z.infer<typeof Schemas.ProgressParamsSchema>;
export type TextDocumentPositionParams = z.infer<typeof Schemas.TextDocumentPositionParamsSchema>;
export type WorkDoneProgressParams = z.infer<typeof Schemas.WorkDoneProgressParamsSchema>;
export type PartialResultParams = z.infer<typeof Schemas.PartialResultParamsSchema>;
export type LocationLink = z.infer<typeof Schemas.LocationLinkSchema>;
export type Range = z.infer<typeof Schemas.RangeSchema>;
export type ImplementationOptions = z.infer<typeof Schemas.ImplementationOptionsSchema>;
export type StaticRegistrationOptions = z.infer<typeof Schemas.StaticRegistrationOptionsSchema>;
export type TypeDefinitionOptions = z.infer<typeof Schemas.TypeDefinitionOptionsSchema>;
export type WorkspaceFoldersChangeEvent = z.infer<typeof Schemas.WorkspaceFoldersChangeEventSchema>;
export type ConfigurationItem = z.infer<typeof Schemas.ConfigurationItemSchema>;
export type TextDocumentIdentifier = z.infer<typeof Schemas.TextDocumentIdentifierSchema>;
export type Color = z.infer<typeof Schemas.ColorSchema>;
export type DocumentColorOptions = z.infer<typeof Schemas.DocumentColorOptionsSchema>;
export type FoldingRangeOptions = z.infer<typeof Schemas.FoldingRangeOptionsSchema>;
export type DeclarationOptions = z.infer<typeof Schemas.DeclarationOptionsSchema>;
export type Position = z.infer<typeof Schemas.PositionSchema>;
export type SelectionRangeOptions = z.infer<typeof Schemas.SelectionRangeOptionsSchema>;
export type CallHierarchyOptions = z.infer<typeof Schemas.CallHierarchyOptionsSchema>;
export type SemanticTokensOptions = z.infer<typeof Schemas.SemanticTokensOptionsSchema>;
export type SemanticTokensEdit = z.infer<typeof Schemas.SemanticTokensEditSchema>;
export type LinkedEditingRangeOptions = z.infer<typeof Schemas.LinkedEditingRangeOptionsSchema>;
export type FileCreate = z.infer<typeof Schemas.FileCreateSchema>;
export type TextDocumentEdit = z.infer<typeof Schemas.TextDocumentEditSchema>;
export type CreateFile = z.infer<typeof Schemas.CreateFileSchema>;
export type RenameFile = z.infer<typeof Schemas.RenameFileSchema>;
export type DeleteFile = z.infer<typeof Schemas.DeleteFileSchema>;
export type ChangeAnnotation = z.infer<typeof Schemas.ChangeAnnotationSchema>;
export type FileOperationFilter = z.infer<typeof Schemas.FileOperationFilterSchema>;
export type FileRename = z.infer<typeof Schemas.FileRenameSchema>;
export type FileDelete = z.infer<typeof Schemas.FileDeleteSchema>;
export type MonikerOptions = z.infer<typeof Schemas.MonikerOptionsSchema>;
export type TypeHierarchyOptions = z.infer<typeof Schemas.TypeHierarchyOptionsSchema>;
export type InlineValueContext = z.infer<typeof Schemas.InlineValueContextSchema>;
export type InlineValueText = z.infer<typeof Schemas.InlineValueTextSchema>;
export type InlineValueVariableLookup = z.infer<typeof Schemas.InlineValueVariableLookupSchema>;
export type InlineValueEvaluatableExpression = z.infer<
  typeof Schemas.InlineValueEvaluatableExpressionSchema
>;
export type InlineValueOptions = z.infer<typeof Schemas.InlineValueOptionsSchema>;
export type InlayHintLabelPart = z.infer<typeof Schemas.InlayHintLabelPartSchema>;
export type MarkupContent = z.infer<typeof Schemas.MarkupContentSchema>;
export type InlayHintOptions = z.infer<typeof Schemas.InlayHintOptionsSchema>;
export type RelatedFullDocumentDiagnosticReport = z.infer<
  typeof Schemas.RelatedFullDocumentDiagnosticReportSchema
>;
export type RelatedUnchangedDocumentDiagnosticReport = z.infer<
  typeof Schemas.RelatedUnchangedDocumentDiagnosticReportSchema
>;
export type FullDocumentDiagnosticReport = z.infer<
  typeof Schemas.FullDocumentDiagnosticReportSchema
>;
export type UnchangedDocumentDiagnosticReport = z.infer<
  typeof Schemas.UnchangedDocumentDiagnosticReportSchema
>;
export type DiagnosticOptions = z.infer<typeof Schemas.DiagnosticOptionsSchema>;
export type PreviousResultId = z.infer<typeof Schemas.PreviousResultIdSchema>;
export type NotebookDocument = z.infer<typeof Schemas.NotebookDocumentSchema>;
export type TextDocumentItem = z.infer<typeof Schemas.TextDocumentItemSchema>;
export type NotebookDocumentSyncOptions = z.infer<typeof Schemas.NotebookDocumentSyncOptionsSchema>;
export type VersionedNotebookDocumentIdentifier = z.infer<
  typeof Schemas.VersionedNotebookDocumentIdentifierSchema
>;
export type NotebookDocumentChangeEvent = z.infer<typeof Schemas.NotebookDocumentChangeEventSchema>;
export type NotebookDocumentIdentifier = z.infer<typeof Schemas.NotebookDocumentIdentifierSchema>;
export type InlineCompletionContext = z.infer<typeof Schemas.InlineCompletionContextSchema>;
export type StringValue = z.infer<typeof Schemas.StringValueSchema>;
export type InlineCompletionOptions = z.infer<typeof Schemas.InlineCompletionOptionsSchema>;
export type TextDocumentContentOptions = z.infer<typeof Schemas.TextDocumentContentOptionsSchema>;
export type Registration = z.infer<typeof Schemas.RegistrationSchema>;
export type Unregistration = z.infer<typeof Schemas.UnregistrationSchema>;
export type _InitializeParams = z.infer<typeof Schemas._InitializeParamsSchema>;
export type WorkspaceFoldersInitializeParams = z.infer<
  typeof Schemas.WorkspaceFoldersInitializeParamsSchema
>;
export type ServerCapabilities = z.infer<typeof Schemas.ServerCapabilitiesSchema>;
export type ServerInfo = z.infer<typeof Schemas.ServerInfoSchema>;
export type VersionedTextDocumentIdentifier = z.infer<
  typeof Schemas.VersionedTextDocumentIdentifierSchema
>;
export type SaveOptions = z.infer<typeof Schemas.SaveOptionsSchema>;
export type FileEvent = z.infer<typeof Schemas.FileEventSchema>;
export type FileSystemWatcher = z.infer<typeof Schemas.FileSystemWatcherSchema>;
export type Diagnostic = z.infer<typeof Schemas.DiagnosticSchema>;
export type CompletionContext = z.infer<typeof Schemas.CompletionContextSchema>;
export type CompletionItemLabelDetails = z.infer<typeof Schemas.CompletionItemLabelDetailsSchema>;
export type InsertReplaceEdit = z.infer<typeof Schemas.InsertReplaceEditSchema>;
export type CompletionItemDefaults = z.infer<typeof Schemas.CompletionItemDefaultsSchema>;
export type CompletionItemApplyKinds = z.infer<typeof Schemas.CompletionItemApplyKindsSchema>;
export type CompletionOptions = z.infer<typeof Schemas.CompletionOptionsSchema>;
export type HoverOptions = z.infer<typeof Schemas.HoverOptionsSchema>;
export type SignatureHelpContext = z.infer<typeof Schemas.SignatureHelpContextSchema>;
export type SignatureInformation = z.infer<typeof Schemas.SignatureInformationSchema>;
export type SignatureHelpOptions = z.infer<typeof Schemas.SignatureHelpOptionsSchema>;
export type DefinitionOptions = z.infer<typeof Schemas.DefinitionOptionsSchema>;
export type ReferenceContext = z.infer<typeof Schemas.ReferenceContextSchema>;
export type ReferenceOptions = z.infer<typeof Schemas.ReferenceOptionsSchema>;
export type DocumentHighlightOptions = z.infer<typeof Schemas.DocumentHighlightOptionsSchema>;
export type BaseSymbolInformation = z.infer<typeof Schemas.BaseSymbolInformationSchema>;
export type DocumentSymbolOptions = z.infer<typeof Schemas.DocumentSymbolOptionsSchema>;
export type CodeActionContext = z.infer<typeof Schemas.CodeActionContextSchema>;
export type CodeActionDisabled = z.infer<typeof Schemas.CodeActionDisabledSchema>;
export type CodeActionOptions = z.infer<typeof Schemas.CodeActionOptionsSchema>;
export type LocationUriOnly = z.infer<typeof Schemas.LocationUriOnlySchema>;
export type WorkspaceSymbolOptions = z.infer<typeof Schemas.WorkspaceSymbolOptionsSchema>;
export type CodeLensOptions = z.infer<typeof Schemas.CodeLensOptionsSchema>;
export type DocumentLinkOptions = z.infer<typeof Schemas.DocumentLinkOptionsSchema>;
export type FormattingOptions = z.infer<typeof Schemas.FormattingOptionsSchema>;
export type DocumentFormattingOptions = z.infer<typeof Schemas.DocumentFormattingOptionsSchema>;
export type DocumentRangeFormattingOptions = z.infer<
  typeof Schemas.DocumentRangeFormattingOptionsSchema
>;
export type DocumentOnTypeFormattingOptions = z.infer<
  typeof Schemas.DocumentOnTypeFormattingOptionsSchema
>;
export type RenameOptions = z.infer<typeof Schemas.RenameOptionsSchema>;
export type PrepareRenamePlaceholder = z.infer<typeof Schemas.PrepareRenamePlaceholderSchema>;
export type PrepareRenameDefaultBehavior = z.infer<
  typeof Schemas.PrepareRenameDefaultBehaviorSchema
>;
export type ExecuteCommandOptions = z.infer<typeof Schemas.ExecuteCommandOptionsSchema>;
export type WorkspaceEditMetadata = z.infer<typeof Schemas.WorkspaceEditMetadataSchema>;
export type SemanticTokensLegend = z.infer<typeof Schemas.SemanticTokensLegendSchema>;
export type SemanticTokensFullDelta = z.infer<typeof Schemas.SemanticTokensFullDeltaSchema>;
export type OptionalVersionedTextDocumentIdentifier = z.infer<
  typeof Schemas.OptionalVersionedTextDocumentIdentifierSchema
>;
export type AnnotatedTextEdit = z.infer<typeof Schemas.AnnotatedTextEditSchema>;
export type SnippetTextEdit = z.infer<typeof Schemas.SnippetTextEditSchema>;
export type ResourceOperation = z.infer<typeof Schemas.ResourceOperationSchema>;
export type CreateFileOptions = z.infer<typeof Schemas.CreateFileOptionsSchema>;
export type RenameFileOptions = z.infer<typeof Schemas.RenameFileOptionsSchema>;
export type DeleteFileOptions = z.infer<typeof Schemas.DeleteFileOptionsSchema>;
export type FileOperationPattern = z.infer<typeof Schemas.FileOperationPatternSchema>;
export type WorkspaceFullDocumentDiagnosticReport = z.infer<
  typeof Schemas.WorkspaceFullDocumentDiagnosticReportSchema
>;
export type WorkspaceUnchangedDocumentDiagnosticReport = z.infer<
  typeof Schemas.WorkspaceUnchangedDocumentDiagnosticReportSchema
>;
export type NotebookCell = z.infer<typeof Schemas.NotebookCellSchema>;
export type NotebookDocumentFilterWithNotebook = z.infer<
  typeof Schemas.NotebookDocumentFilterWithNotebookSchema
>;
export type NotebookDocumentFilterWithCells = z.infer<
  typeof Schemas.NotebookDocumentFilterWithCellsSchema
>;
export type NotebookDocumentCellChanges = z.infer<typeof Schemas.NotebookDocumentCellChangesSchema>;
export type SelectedCompletionInfo = z.infer<typeof Schemas.SelectedCompletionInfoSchema>;
export type ClientInfo = z.infer<typeof Schemas.ClientInfoSchema>;
export type ClientCapabilities = z.infer<typeof Schemas.ClientCapabilitiesSchema>;
export type TextDocumentSyncOptions = z.infer<typeof Schemas.TextDocumentSyncOptionsSchema>;
export type WorkspaceOptions = z.infer<typeof Schemas.WorkspaceOptionsSchema>;
export type TextDocumentContentChangePartial = z.infer<
  typeof Schemas.TextDocumentContentChangePartialSchema
>;
export type TextDocumentContentChangeWholeDocument = z.infer<
  typeof Schemas.TextDocumentContentChangeWholeDocumentSchema
>;
export type CodeDescription = z.infer<typeof Schemas.CodeDescriptionSchema>;
export type DiagnosticRelatedInformation = z.infer<
  typeof Schemas.DiagnosticRelatedInformationSchema
>;
export type EditRangeWithInsertReplace = z.infer<typeof Schemas.EditRangeWithInsertReplaceSchema>;
export type ServerCompletionItemOptions = z.infer<typeof Schemas.ServerCompletionItemOptionsSchema>;
export type MarkedStringWithLanguage = z.infer<typeof Schemas.MarkedStringWithLanguageSchema>;
export type ParameterInformation = z.infer<typeof Schemas.ParameterInformationSchema>;
export type CodeActionKindDocumentation = z.infer<typeof Schemas.CodeActionKindDocumentationSchema>;
export type NotebookCellTextDocumentFilter = z.infer<
  typeof Schemas.NotebookCellTextDocumentFilterSchema
>;
export type FileOperationPatternOptions = z.infer<typeof Schemas.FileOperationPatternOptionsSchema>;
export type ExecutionSummary = z.infer<typeof Schemas.ExecutionSummarySchema>;
export type NotebookCellLanguage = z.infer<typeof Schemas.NotebookCellLanguageSchema>;
export type NotebookDocumentCellChangeStructure = z.infer<
  typeof Schemas.NotebookDocumentCellChangeStructureSchema
>;
export type NotebookDocumentCellContentChanges = z.infer<
  typeof Schemas.NotebookDocumentCellContentChangesSchema
>;
export type WorkspaceClientCapabilities = z.infer<typeof Schemas.WorkspaceClientCapabilitiesSchema>;
export type TextDocumentClientCapabilities = z.infer<
  typeof Schemas.TextDocumentClientCapabilitiesSchema
>;
export type NotebookDocumentClientCapabilities = z.infer<
  typeof Schemas.NotebookDocumentClientCapabilitiesSchema
>;
export type WindowClientCapabilities = z.infer<typeof Schemas.WindowClientCapabilitiesSchema>;
export type GeneralClientCapabilities = z.infer<typeof Schemas.GeneralClientCapabilitiesSchema>;
export type WorkspaceFoldersServerCapabilities = z.infer<
  typeof Schemas.WorkspaceFoldersServerCapabilitiesSchema
>;
export type FileOperationOptions = z.infer<typeof Schemas.FileOperationOptionsSchema>;
export type RelativePattern = z.infer<typeof Schemas.RelativePatternSchema>;
export type TextDocumentFilterLanguage = z.infer<typeof Schemas.TextDocumentFilterLanguageSchema>;
export type TextDocumentFilterScheme = z.infer<typeof Schemas.TextDocumentFilterSchemeSchema>;
export type TextDocumentFilterPattern = z.infer<typeof Schemas.TextDocumentFilterPatternSchema>;
export type NotebookDocumentFilterNotebookType = z.infer<
  typeof Schemas.NotebookDocumentFilterNotebookTypeSchema
>;
export type NotebookDocumentFilterScheme = z.infer<
  typeof Schemas.NotebookDocumentFilterSchemeSchema
>;
export type NotebookDocumentFilterPattern = z.infer<
  typeof Schemas.NotebookDocumentFilterPatternSchema
>;
export type NotebookCellArrayChange = z.infer<typeof Schemas.NotebookCellArrayChangeSchema>;
export type WorkspaceEditClientCapabilities = z.infer<
  typeof Schemas.WorkspaceEditClientCapabilitiesSchema
>;
export type DidChangeConfigurationClientCapabilities = z.infer<
  typeof Schemas.DidChangeConfigurationClientCapabilitiesSchema
>;
export type DidChangeWatchedFilesClientCapabilities = z.infer<
  typeof Schemas.DidChangeWatchedFilesClientCapabilitiesSchema
>;
export type WorkspaceSymbolClientCapabilities = z.infer<
  typeof Schemas.WorkspaceSymbolClientCapabilitiesSchema
>;
export type ExecuteCommandClientCapabilities = z.infer<
  typeof Schemas.ExecuteCommandClientCapabilitiesSchema
>;
export type SemanticTokensWorkspaceClientCapabilities = z.infer<
  typeof Schemas.SemanticTokensWorkspaceClientCapabilitiesSchema
>;
export type CodeLensWorkspaceClientCapabilities = z.infer<
  typeof Schemas.CodeLensWorkspaceClientCapabilitiesSchema
>;
export type FileOperationClientCapabilities = z.infer<
  typeof Schemas.FileOperationClientCapabilitiesSchema
>;
export type InlineValueWorkspaceClientCapabilities = z.infer<
  typeof Schemas.InlineValueWorkspaceClientCapabilitiesSchema
>;
export type InlayHintWorkspaceClientCapabilities = z.infer<
  typeof Schemas.InlayHintWorkspaceClientCapabilitiesSchema
>;
export type DiagnosticWorkspaceClientCapabilities = z.infer<
  typeof Schemas.DiagnosticWorkspaceClientCapabilitiesSchema
>;
export type FoldingRangeWorkspaceClientCapabilities = z.infer<
  typeof Schemas.FoldingRangeWorkspaceClientCapabilitiesSchema
>;
export type TextDocumentContentClientCapabilities = z.infer<
  typeof Schemas.TextDocumentContentClientCapabilitiesSchema
>;
export type TextDocumentSyncClientCapabilities = z.infer<
  typeof Schemas.TextDocumentSyncClientCapabilitiesSchema
>;
export type TextDocumentFilterClientCapabilities = z.infer<
  typeof Schemas.TextDocumentFilterClientCapabilitiesSchema
>;
export type CompletionClientCapabilities = z.infer<
  typeof Schemas.CompletionClientCapabilitiesSchema
>;
export type HoverClientCapabilities = z.infer<typeof Schemas.HoverClientCapabilitiesSchema>;
export type SignatureHelpClientCapabilities = z.infer<
  typeof Schemas.SignatureHelpClientCapabilitiesSchema
>;
export type DeclarationClientCapabilities = z.infer<
  typeof Schemas.DeclarationClientCapabilitiesSchema
>;
export type DefinitionClientCapabilities = z.infer<
  typeof Schemas.DefinitionClientCapabilitiesSchema
>;
export type TypeDefinitionClientCapabilities = z.infer<
  typeof Schemas.TypeDefinitionClientCapabilitiesSchema
>;
export type ImplementationClientCapabilities = z.infer<
  typeof Schemas.ImplementationClientCapabilitiesSchema
>;
export type ReferenceClientCapabilities = z.infer<typeof Schemas.ReferenceClientCapabilitiesSchema>;
export type DocumentHighlightClientCapabilities = z.infer<
  typeof Schemas.DocumentHighlightClientCapabilitiesSchema
>;
export type DocumentSymbolClientCapabilities = z.infer<
  typeof Schemas.DocumentSymbolClientCapabilitiesSchema
>;
export type CodeActionClientCapabilities = z.infer<
  typeof Schemas.CodeActionClientCapabilitiesSchema
>;
export type CodeLensClientCapabilities = z.infer<typeof Schemas.CodeLensClientCapabilitiesSchema>;
export type DocumentLinkClientCapabilities = z.infer<
  typeof Schemas.DocumentLinkClientCapabilitiesSchema
>;
export type DocumentColorClientCapabilities = z.infer<
  typeof Schemas.DocumentColorClientCapabilitiesSchema
>;
export type DocumentFormattingClientCapabilities = z.infer<
  typeof Schemas.DocumentFormattingClientCapabilitiesSchema
>;
export type DocumentRangeFormattingClientCapabilities = z.infer<
  typeof Schemas.DocumentRangeFormattingClientCapabilitiesSchema
>;
export type DocumentOnTypeFormattingClientCapabilities = z.infer<
  typeof Schemas.DocumentOnTypeFormattingClientCapabilitiesSchema
>;
export type RenameClientCapabilities = z.infer<typeof Schemas.RenameClientCapabilitiesSchema>;
export type FoldingRangeClientCapabilities = z.infer<
  typeof Schemas.FoldingRangeClientCapabilitiesSchema
>;
export type SelectionRangeClientCapabilities = z.infer<
  typeof Schemas.SelectionRangeClientCapabilitiesSchema
>;
export type PublishDiagnosticsClientCapabilities = z.infer<
  typeof Schemas.PublishDiagnosticsClientCapabilitiesSchema
>;
export type CallHierarchyClientCapabilities = z.infer<
  typeof Schemas.CallHierarchyClientCapabilitiesSchema
>;
export type SemanticTokensClientCapabilities = z.infer<
  typeof Schemas.SemanticTokensClientCapabilitiesSchema
>;
export type LinkedEditingRangeClientCapabilities = z.infer<
  typeof Schemas.LinkedEditingRangeClientCapabilitiesSchema
>;
export type MonikerClientCapabilities = z.infer<typeof Schemas.MonikerClientCapabilitiesSchema>;
export type TypeHierarchyClientCapabilities = z.infer<
  typeof Schemas.TypeHierarchyClientCapabilitiesSchema
>;
export type InlineValueClientCapabilities = z.infer<
  typeof Schemas.InlineValueClientCapabilitiesSchema
>;
export type InlayHintClientCapabilities = z.infer<typeof Schemas.InlayHintClientCapabilitiesSchema>;
export type DiagnosticClientCapabilities = z.infer<
  typeof Schemas.DiagnosticClientCapabilitiesSchema
>;
export type InlineCompletionClientCapabilities = z.infer<
  typeof Schemas.InlineCompletionClientCapabilitiesSchema
>;
export type NotebookDocumentSyncClientCapabilities = z.infer<
  typeof Schemas.NotebookDocumentSyncClientCapabilitiesSchema
>;
export type ShowMessageRequestClientCapabilities = z.infer<
  typeof Schemas.ShowMessageRequestClientCapabilitiesSchema
>;
export type ShowDocumentClientCapabilities = z.infer<
  typeof Schemas.ShowDocumentClientCapabilitiesSchema
>;
export type StaleRequestSupportOptions = z.infer<typeof Schemas.StaleRequestSupportOptionsSchema>;
export type RegularExpressionsClientCapabilities = z.infer<
  typeof Schemas.RegularExpressionsClientCapabilitiesSchema
>;
export type MarkdownClientCapabilities = z.infer<typeof Schemas.MarkdownClientCapabilitiesSchema>;
export type ChangeAnnotationsSupportOptions = z.infer<
  typeof Schemas.ChangeAnnotationsSupportOptionsSchema
>;
export type ClientSymbolKindOptions = z.infer<typeof Schemas.ClientSymbolKindOptionsSchema>;
export type ClientSymbolTagOptions = z.infer<typeof Schemas.ClientSymbolTagOptionsSchema>;
export type ClientSymbolResolveOptions = z.infer<typeof Schemas.ClientSymbolResolveOptionsSchema>;
export type ClientCompletionItemOptions = z.infer<typeof Schemas.ClientCompletionItemOptionsSchema>;
export type ClientCompletionItemOptionsKind = z.infer<
  typeof Schemas.ClientCompletionItemOptionsKindSchema
>;
export type CompletionListCapabilities = z.infer<typeof Schemas.CompletionListCapabilitiesSchema>;
export type ClientSignatureInformationOptions = z.infer<
  typeof Schemas.ClientSignatureInformationOptionsSchema
>;
export type ClientCodeActionLiteralOptions = z.infer<
  typeof Schemas.ClientCodeActionLiteralOptionsSchema
>;
export type ClientCodeActionResolveOptions = z.infer<
  typeof Schemas.ClientCodeActionResolveOptionsSchema
>;
export type CodeActionTagOptions = z.infer<typeof Schemas.CodeActionTagOptionsSchema>;
export type ClientCodeLensResolveOptions = z.infer<
  typeof Schemas.ClientCodeLensResolveOptionsSchema
>;
export type ClientFoldingRangeKindOptions = z.infer<
  typeof Schemas.ClientFoldingRangeKindOptionsSchema
>;
export type ClientFoldingRangeOptions = z.infer<typeof Schemas.ClientFoldingRangeOptionsSchema>;
export type DiagnosticsCapabilities = z.infer<typeof Schemas.DiagnosticsCapabilitiesSchema>;
export type ClientSemanticTokensRequestOptions = z.infer<
  typeof Schemas.ClientSemanticTokensRequestOptionsSchema
>;
export type ClientInlayHintResolveOptions = z.infer<
  typeof Schemas.ClientInlayHintResolveOptionsSchema
>;
export type ClientShowMessageActionItemOptions = z.infer<
  typeof Schemas.ClientShowMessageActionItemOptionsSchema
>;
export type CompletionItemTagOptions = z.infer<typeof Schemas.CompletionItemTagOptionsSchema>;
export type ClientCompletionItemResolveOptions = z.infer<
  typeof Schemas.ClientCompletionItemResolveOptionsSchema
>;
export type ClientCompletionItemInsertTextModeOptions = z.infer<
  typeof Schemas.ClientCompletionItemInsertTextModeOptionsSchema
>;
export type ClientSignatureParameterInformationOptions = z.infer<
  typeof Schemas.ClientSignatureParameterInformationOptionsSchema
>;
export type ClientCodeActionKindOptions = z.infer<typeof Schemas.ClientCodeActionKindOptionsSchema>;
export type ClientDiagnosticsTagOptions = z.infer<typeof Schemas.ClientDiagnosticsTagOptionsSchema>;
export type ClientSemanticTokensRequestFullDelta = z.infer<
  typeof Schemas.ClientSemanticTokensRequestFullDeltaSchema
>;

export type Definition = z.infer<typeof Schemas.DefinitionSchema>;
export type DefinitionLink = z.infer<typeof Schemas.DefinitionLinkSchema>;
export type LSPArray = z.infer<typeof Schemas.LSPArraySchema>;
export type LSPAny = z.infer<typeof Schemas.LSPAnySchema>;
export type Declaration = z.infer<typeof Schemas.DeclarationSchema>;
export type DeclarationLink = z.infer<typeof Schemas.DeclarationLinkSchema>;
export type InlineValue = z.infer<typeof Schemas.InlineValueSchema>;
export type DocumentDiagnosticReport = z.infer<typeof Schemas.DocumentDiagnosticReportSchema>;
export type PrepareRenameResult = z.infer<typeof Schemas.PrepareRenameResultSchema>;
export type DocumentSelector = z.infer<typeof Schemas.DocumentSelectorSchema>;
export type ProgressToken = z.infer<typeof Schemas.ProgressTokenSchema>;
export type ChangeAnnotationIdentifier = z.infer<typeof Schemas.ChangeAnnotationIdentifierSchema>;
export type WorkspaceDocumentDiagnosticReport = z.infer<
  typeof Schemas.WorkspaceDocumentDiagnosticReportSchema
>;
export type TextDocumentContentChangeEvent = z.infer<
  typeof Schemas.TextDocumentContentChangeEventSchema
>;
export type MarkedString = z.infer<typeof Schemas.MarkedStringSchema>;
export type DocumentFilter = z.infer<typeof Schemas.DocumentFilterSchema>;
export type LSPObject = z.infer<typeof Schemas.LSPObjectSchema>;
export type GlobPattern = z.infer<typeof Schemas.GlobPatternSchema>;
export type TextDocumentFilter = z.infer<typeof Schemas.TextDocumentFilterSchema>;
export type NotebookDocumentFilter = z.infer<typeof Schemas.NotebookDocumentFilterSchema>;
export type Pattern = z.infer<typeof Schemas.PatternSchema>;
export type RegularExpressionEngineKind = z.infer<typeof Schemas.RegularExpressionEngineKindSchema>;

// TextDocumentContent has no schema in the metamodel yet
export type TextDocumentContent = unknown;
