/**
 * LSP Protocol Types
 *
 * Generated directly from metaModel.json — not inferred from Zod schemas.
 * Optional properties use `prop?: T` (no `| undefined`) so these types are
 * compatible with packages compiled with exactOptionalPropertyTypes: true.
 *
 * Auto-generated — DO NOT EDIT MANUALLY
 */

export type * from './enums.js';

export type ImplementationParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
};

export type Location = {
  uri: string;
  range: Range;
};

export type ImplementationRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  id?: string;
};

export type TypeDefinitionParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
};

export type TypeDefinitionRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  id?: string;
};

export type WorkspaceFolder = {
  uri: string;
  name: string;
};

export type DidChangeWorkspaceFoldersParams = {
  event: WorkspaceFoldersChangeEvent;
};

export type ConfigurationParams = {
  items: ConfigurationItem[];
};

export type DocumentColorParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
};

export type ColorInformation = {
  range: Range;
  color: Color;
};

export type DocumentColorRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  id?: string;
};

export type ColorPresentationParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
  color: Color;
  range: Range;
};

export type ColorPresentation = {
  label: string;
  textEdit?: TextEdit;
  additionalTextEdits?: TextEdit[];
};

export type WorkDoneProgressOptions = {
  workDoneProgress?: boolean;
};

export type TextDocumentRegistrationOptions = {
  documentSelector: DocumentSelector | null;
};

export type FoldingRangeParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
};

export type FoldingRange = {
  startLine: number;
  startCharacter?: number;
  endLine: number;
  endCharacter?: number;
  kind?: 'comment' | 'imports' | 'region' | string;
  collapsedText?: string;
};

export type FoldingRangeRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  id?: string;
};

export type DeclarationParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
};

export type DeclarationRegistrationOptions = {
  workDoneProgress?: boolean;
  documentSelector: DocumentSelector | null;
  id?: string;
};

export type SelectionRangeParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
  positions: Position[];
};

export type SelectionRange = {
  range: Range;
  parent?: SelectionRange;
};

export type SelectionRangeRegistrationOptions = {
  workDoneProgress?: boolean;
  documentSelector: DocumentSelector | null;
  id?: string;
};

export type WorkDoneProgressCreateParams = {
  token: ProgressToken;
};

export type WorkDoneProgressCancelParams = {
  token: ProgressToken;
};

export type CallHierarchyPrepareParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  workDoneToken?: ProgressToken;
};

export type CallHierarchyItem = {
  name: string;
  kind:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26;
  tags?: 1[];
  detail?: string;
  uri: string;
  range: Range;
  selectionRange: Range;
  data?: LSPAny;
};

export type CallHierarchyRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  id?: string;
};

export type CallHierarchyIncomingCallsParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  item: CallHierarchyItem;
};

export type CallHierarchyIncomingCall = {
  from: CallHierarchyItem;
  fromRanges: Range[];
};

export type CallHierarchyOutgoingCallsParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  item: CallHierarchyItem;
};

export type CallHierarchyOutgoingCall = {
  to: CallHierarchyItem;
  fromRanges: Range[];
};

export type SemanticTokensParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
};

export type SemanticTokens = {
  resultId?: string;
  data: number[];
};

export type SemanticTokensPartialResult = {
  data: number[];
};

export type SemanticTokensRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  legend: SemanticTokensLegend;
  range?: boolean | {};
  full?: boolean | SemanticTokensFullDelta;
  id?: string;
};

export type SemanticTokensDeltaParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
  previousResultId: string;
};

export type SemanticTokensDelta = {
  resultId?: string;
  edits: SemanticTokensEdit[];
};

export type SemanticTokensDeltaPartialResult = {
  edits: SemanticTokensEdit[];
};

export type SemanticTokensRangeParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
  range: Range;
};

export type ShowDocumentParams = {
  uri: string;
  external?: boolean;
  takeFocus?: boolean;
  selection?: Range;
};

export type ShowDocumentResult = {
  success: boolean;
};

export type LinkedEditingRangeParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  workDoneToken?: ProgressToken;
};

export type LinkedEditingRanges = {
  ranges: Range[];
  wordPattern?: string;
};

export type LinkedEditingRangeRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  id?: string;
};

export type CreateFilesParams = {
  files: FileCreate[];
};

export type WorkspaceEdit = {
  changes?: { [key: string]: TextEdit[] };
  documentChanges?: (TextDocumentEdit | CreateFile | RenameFile | DeleteFile)[];
  changeAnnotations?: Record<ChangeAnnotationIdentifier, ChangeAnnotation>;
};

export type FileOperationRegistrationOptions = {
  filters: FileOperationFilter[];
};

export type RenameFilesParams = {
  files: FileRename[];
};

export type DeleteFilesParams = {
  files: FileDelete[];
};

export type MonikerParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
};

export type Moniker = {
  scheme: string;
  identifier: string;
  unique: 'document' | 'project' | 'group' | 'scheme' | 'global';
  kind?: 'import' | 'export' | 'local';
};

export type MonikerRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
};

export type TypeHierarchyPrepareParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  workDoneToken?: ProgressToken;
};

export type TypeHierarchyItem = {
  name: string;
  kind:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26;
  tags?: 1[];
  detail?: string;
  uri: string;
  range: Range;
  selectionRange: Range;
  data?: LSPAny;
};

export type TypeHierarchyRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  id?: string;
};

export type TypeHierarchySupertypesParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  item: TypeHierarchyItem;
};

export type TypeHierarchySubtypesParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  item: TypeHierarchyItem;
};

export type InlineValueParams = {
  workDoneToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
  range: Range;
  context: InlineValueContext;
};

export type InlineValueRegistrationOptions = {
  workDoneProgress?: boolean;
  documentSelector: DocumentSelector | null;
  id?: string;
};

export type InlayHintParams = {
  workDoneToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
  range: Range;
};

export type InlayHint = {
  position: Position;
  label: string | InlayHintLabelPart[];
  kind?: 1 | 2;
  textEdits?: TextEdit[];
  tooltip?: string | MarkupContent;
  paddingLeft?: boolean;
  paddingRight?: boolean;
  data?: LSPAny;
};

export type InlayHintRegistrationOptions = {
  workDoneProgress?: boolean;
  resolveProvider?: boolean;
  documentSelector: DocumentSelector | null;
  id?: string;
};

export type DocumentDiagnosticParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
  identifier?: string;
  previousResultId?: string;
};

export type DocumentDiagnosticReportPartialResult = {
  relatedDocuments: {
    [key: string]: FullDocumentDiagnosticReport | UnchangedDocumentDiagnosticReport;
  };
};

export type DiagnosticServerCancellationData = {
  retriggerRequest: boolean;
};

export type DiagnosticRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  identifier?: string;
  interFileDependencies: boolean;
  workspaceDiagnostics: boolean;
  id?: string;
};

export type WorkspaceDiagnosticParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  identifier?: string;
  previousResultIds: PreviousResultId[];
};

export type WorkspaceDiagnosticReport = {
  items: WorkspaceDocumentDiagnosticReport[];
};

export type WorkspaceDiagnosticReportPartialResult = {
  items: WorkspaceDocumentDiagnosticReport[];
};

export type DidOpenNotebookDocumentParams = {
  notebookDocument: NotebookDocument;
  cellTextDocuments: TextDocumentItem[];
};

export type NotebookDocumentSyncRegistrationOptions = {
  notebookSelector: (NotebookDocumentFilterWithNotebook | NotebookDocumentFilterWithCells)[];
  save?: boolean;
  id?: string;
};

export type DidChangeNotebookDocumentParams = {
  notebookDocument: VersionedNotebookDocumentIdentifier;
  change: NotebookDocumentChangeEvent;
};

export type DidSaveNotebookDocumentParams = {
  notebookDocument: NotebookDocumentIdentifier;
};

export type DidCloseNotebookDocumentParams = {
  notebookDocument: NotebookDocumentIdentifier;
  cellTextDocuments: TextDocumentIdentifier[];
};

export type InlineCompletionParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  workDoneToken?: ProgressToken;
  context: InlineCompletionContext;
};

export type InlineCompletionList = {
  items: InlineCompletionItem[];
};

export type InlineCompletionItem = {
  insertText: string | StringValue;
  filterText?: string;
  range?: Range;
  command?: Command;
};

export type InlineCompletionRegistrationOptions = {
  workDoneProgress?: boolean;
  documentSelector: DocumentSelector | null;
  id?: string;
};

export type TextDocumentContentParams = {
  uri: string;
};

export type TextDocumentContentResult = {
  text: string;
};

export type TextDocumentContentRegistrationOptions = {
  schemes: string[];
  id?: string;
};

export type TextDocumentContentRefreshParams = {
  uri: string;
};

export type RegistrationParams = {
  registrations: Registration[];
};

export type UnregistrationParams = {
  unregisterations: Unregistration[];
};

export type InitializeParams = {
  workDoneToken?: ProgressToken;
  processId: number | null;
  clientInfo?: ClientInfo;
  locale?: string;
  rootPath?: string | null;
  rootUri: string | null;
  capabilities: ClientCapabilities;
  initializationOptions?: LSPAny;
  trace?: 'off' | 'messages' | 'compact' | 'verbose';
  workspaceFolders?: WorkspaceFolder[] | null;
};

export type InitializeResult = {
  capabilities: ServerCapabilities;
  serverInfo?: ServerInfo;
};

export type InitializeError = {
  retry: boolean;
};

export type InitializedParams = {};

export type DidChangeConfigurationParams = {
  settings: LSPAny;
};

export type DidChangeConfigurationRegistrationOptions = {
  section?: string | string[];
};

export type ShowMessageParams = {
  type: 1 | 2 | 3 | 4 | 5;
  message: string;
};

export type ShowMessageRequestParams = {
  type: 1 | 2 | 3 | 4 | 5;
  message: string;
  actions?: MessageActionItem[];
};

export type MessageActionItem = {
  title: string;
};

export type LogMessageParams = {
  type: 1 | 2 | 3 | 4 | 5;
  message: string;
};

export type DidOpenTextDocumentParams = {
  textDocument: TextDocumentItem;
};

export type DidChangeTextDocumentParams = {
  textDocument: VersionedTextDocumentIdentifier;
  contentChanges: TextDocumentContentChangeEvent[];
};

export type TextDocumentChangeRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  syncKind: 0 | 1 | 2;
};

export type DidCloseTextDocumentParams = {
  textDocument: TextDocumentIdentifier;
};

export type DidSaveTextDocumentParams = {
  textDocument: TextDocumentIdentifier;
  text?: string;
};

export type TextDocumentSaveRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  includeText?: boolean;
};

export type WillSaveTextDocumentParams = {
  textDocument: TextDocumentIdentifier;
  reason: 1 | 2 | 3;
};

export type TextEdit = {
  range: Range;
  newText: string;
};

export type DidChangeWatchedFilesParams = {
  changes: FileEvent[];
};

export type DidChangeWatchedFilesRegistrationOptions = {
  watchers: FileSystemWatcher[];
};

export type PublishDiagnosticsParams = {
  uri: string;
  version?: number;
  diagnostics: Diagnostic[];
};

export type CompletionParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  context?: CompletionContext;
};

export type CompletionItem = {
  label: string;
  labelDetails?: CompletionItemLabelDetails;
  kind?:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25;
  tags?: 1[];
  detail?: string;
  documentation?: string | MarkupContent;
  deprecated?: boolean;
  preselect?: boolean;
  sortText?: string;
  filterText?: string;
  insertText?: string;
  insertTextFormat?: 1 | 2;
  insertTextMode?: 1 | 2;
  textEdit?: TextEdit | InsertReplaceEdit;
  textEditText?: string;
  additionalTextEdits?: TextEdit[];
  commitCharacters?: string[];
  command?: Command;
  data?: LSPAny;
};

export type CompletionList = {
  isIncomplete: boolean;
  itemDefaults?: CompletionItemDefaults;
  applyKind?: CompletionItemApplyKinds;
  items: CompletionItem[];
};

export type CompletionRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  triggerCharacters?: string[];
  allCommitCharacters?: string[];
  resolveProvider?: boolean;
  completionItem?: ServerCompletionItemOptions;
};

export type HoverParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  workDoneToken?: ProgressToken;
};

export type Hover = {
  contents: MarkupContent | MarkedString | MarkedString[];
  range?: Range;
};

export type HoverRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
};

export type SignatureHelpParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  workDoneToken?: ProgressToken;
  context?: SignatureHelpContext;
};

export type SignatureHelp = {
  signatures: SignatureInformation[];
  activeSignature?: number;
  activeParameter?: number | null;
};

export type SignatureHelpRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  triggerCharacters?: string[];
  retriggerCharacters?: string[];
};

export type DefinitionParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
};

export type DefinitionRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
};

export type ReferenceParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  context: ReferenceContext;
};

export type ReferenceRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
};

export type DocumentHighlightParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
};

export type DocumentHighlight = {
  range: Range;
  kind?: 1 | 2 | 3;
};

export type DocumentHighlightRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
};

export type DocumentSymbolParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
};

export type SymbolInformation = {
  name: string;
  kind:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26;
  tags?: 1[];
  containerName?: string;
  deprecated?: boolean;
  location: Location;
};

export type DocumentSymbol = {
  name: string;
  detail?: string;
  kind:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26;
  tags?: 1[];
  deprecated?: boolean;
  range: Range;
  selectionRange: Range;
  children?: DocumentSymbol[];
};

export type DocumentSymbolRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  label?: string;
};

export type CodeActionParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
  range: Range;
  context: CodeActionContext;
};

export type Command = {
  title: string;
  tooltip?: string;
  command: string;
  arguments?: LSPAny[];
};

export type CodeAction = {
  title: string;
  kind?:
    | ''
    | 'quickfix'
    | 'refactor'
    | 'refactor.extract'
    | 'refactor.inline'
    | 'refactor.move'
    | 'refactor.rewrite'
    | 'source'
    | 'source.organizeImports'
    | 'source.fixAll'
    | 'notebook'
    | string;
  diagnostics?: Diagnostic[];
  isPreferred?: boolean;
  disabled?: CodeActionDisabled;
  edit?: WorkspaceEdit;
  command?: Command;
  data?: LSPAny;
  tags?: 1[];
};

export type CodeActionRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  codeActionKinds?: (
    | ''
    | 'quickfix'
    | 'refactor'
    | 'refactor.extract'
    | 'refactor.inline'
    | 'refactor.move'
    | 'refactor.rewrite'
    | 'source'
    | 'source.organizeImports'
    | 'source.fixAll'
    | 'notebook'
    | string
  )[];
  documentation?: CodeActionKindDocumentation[];
  resolveProvider?: boolean;
};

export type WorkspaceSymbolParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  query: string;
};

export type WorkspaceSymbol = {
  name: string;
  kind:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26;
  tags?: 1[];
  containerName?: string;
  location: Location | LocationUriOnly;
  data?: LSPAny;
};

export type WorkspaceSymbolRegistrationOptions = {
  workDoneProgress?: boolean;
  resolveProvider?: boolean;
};

export type CodeLensParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
};

export type CodeLens = {
  range: Range;
  command?: Command;
  data?: LSPAny;
};

export type CodeLensRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  resolveProvider?: boolean;
};

export type DocumentLinkParams = {
  workDoneToken?: ProgressToken;
  partialResultToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
};

export type DocumentLink = {
  range: Range;
  target?: string;
  tooltip?: string;
  data?: LSPAny;
};

export type DocumentLinkRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  resolveProvider?: boolean;
};

export type DocumentFormattingParams = {
  workDoneToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
  options: FormattingOptions;
};

export type DocumentFormattingRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
};

export type DocumentRangeFormattingParams = {
  workDoneToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
  range: Range;
  options: FormattingOptions;
};

export type DocumentRangeFormattingRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  rangesSupport?: boolean;
};

export type DocumentRangesFormattingParams = {
  workDoneToken?: ProgressToken;
  textDocument: TextDocumentIdentifier;
  ranges: Range[];
  options: FormattingOptions;
};

export type DocumentOnTypeFormattingParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  ch: string;
  options: FormattingOptions;
};

export type DocumentOnTypeFormattingRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  firstTriggerCharacter: string;
  moreTriggerCharacter?: string[];
};

export type RenameParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  workDoneToken?: ProgressToken;
  newName: string;
};

export type RenameRegistrationOptions = {
  documentSelector: DocumentSelector | null;
  workDoneProgress?: boolean;
  prepareProvider?: boolean;
};

export type PrepareRenameParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
  workDoneToken?: ProgressToken;
};

export type ExecuteCommandParams = {
  workDoneToken?: ProgressToken;
  command: string;
  arguments?: LSPAny[];
};

export type ExecuteCommandRegistrationOptions = {
  workDoneProgress?: boolean;
  commands: string[];
};

export type ApplyWorkspaceEditParams = {
  label?: string;
  edit: WorkspaceEdit;
  metadata?: WorkspaceEditMetadata;
};

export type ApplyWorkspaceEditResult = {
  applied: boolean;
  failureReason?: string;
  failedChange?: number;
};

export type WorkDoneProgressBegin = {
  kind: 'begin';
  title: string;
  cancellable?: boolean;
  message?: string;
  percentage?: number;
};

export type WorkDoneProgressReport = {
  kind: 'report';
  cancellable?: boolean;
  message?: string;
  percentage?: number;
};

export type WorkDoneProgressEnd = {
  kind: 'end';
  message?: string;
};

export type SetTraceParams = {
  value: 'off' | 'messages' | 'compact' | 'verbose';
};

export type LogTraceParams = {
  message: string;
  verbose?: string;
};

export type CancelParams = {
  id: number | string;
};

export type ProgressParams = {
  token: ProgressToken;
  value: LSPAny;
};

export type TextDocumentPositionParams = {
  textDocument: TextDocumentIdentifier;
  position: Position;
};

export type WorkDoneProgressParams = {
  workDoneToken?: ProgressToken;
};

export type PartialResultParams = {
  partialResultToken?: ProgressToken;
};

export type LocationLink = {
  originSelectionRange?: Range;
  targetUri: string;
  targetRange: Range;
  targetSelectionRange: Range;
};

export type Range = {
  start: Position;
  end: Position;
};

export type ImplementationOptions = {
  workDoneProgress?: boolean;
};

export type StaticRegistrationOptions = {
  id?: string;
};

export type TypeDefinitionOptions = {
  workDoneProgress?: boolean;
};

export type WorkspaceFoldersChangeEvent = {
  added: WorkspaceFolder[];
  removed: WorkspaceFolder[];
};

export type ConfigurationItem = {
  scopeUri?: string;
  section?: string;
};

export type TextDocumentIdentifier = {
  uri: string;
};

export type Color = {
  red: number;
  green: number;
  blue: number;
  alpha: number;
};

export type DocumentColorOptions = {
  workDoneProgress?: boolean;
};

export type FoldingRangeOptions = {
  workDoneProgress?: boolean;
};

export type DeclarationOptions = {
  workDoneProgress?: boolean;
};

export type Position = {
  line: number;
  character: number;
};

export type SelectionRangeOptions = {
  workDoneProgress?: boolean;
};

export type CallHierarchyOptions = {
  workDoneProgress?: boolean;
};

export type SemanticTokensOptions = {
  workDoneProgress?: boolean;
  legend: SemanticTokensLegend;
  range?: boolean | {};
  full?: boolean | SemanticTokensFullDelta;
};

export type SemanticTokensEdit = {
  start: number;
  deleteCount: number;
  data?: number[];
};

export type LinkedEditingRangeOptions = {
  workDoneProgress?: boolean;
};

export type FileCreate = {
  uri: string;
};

export type TextDocumentEdit = {
  textDocument: OptionalVersionedTextDocumentIdentifier;
  edits: (TextEdit | AnnotatedTextEdit | SnippetTextEdit)[];
};

export type CreateFile = {
  kind: 'create';
  annotationId?: ChangeAnnotationIdentifier;
  uri: string;
  options?: CreateFileOptions;
};

export type RenameFile = {
  kind: 'rename';
  annotationId?: ChangeAnnotationIdentifier;
  oldUri: string;
  newUri: string;
  options?: RenameFileOptions;
};

export type DeleteFile = {
  kind: 'delete';
  annotationId?: ChangeAnnotationIdentifier;
  uri: string;
  options?: DeleteFileOptions;
};

export type ChangeAnnotation = {
  label: string;
  needsConfirmation?: boolean;
  description?: string;
};

export type FileOperationFilter = {
  scheme?: string;
  pattern: FileOperationPattern;
};

export type FileRename = {
  oldUri: string;
  newUri: string;
};

export type FileDelete = {
  uri: string;
};

export type MonikerOptions = {
  workDoneProgress?: boolean;
};

export type TypeHierarchyOptions = {
  workDoneProgress?: boolean;
};

export type InlineValueContext = {
  frameId: number;
  stoppedLocation: Range;
};

export type InlineValueText = {
  range: Range;
  text: string;
};

export type InlineValueVariableLookup = {
  range: Range;
  variableName?: string;
  caseSensitiveLookup: boolean;
};

export type InlineValueEvaluatableExpression = {
  range: Range;
  expression?: string;
};

export type InlineValueOptions = {
  workDoneProgress?: boolean;
};

export type InlayHintLabelPart = {
  value: string;
  tooltip?: string | MarkupContent;
  location?: Location;
  command?: Command;
};

export type MarkupContent = {
  kind: 'plaintext' | 'markdown';
  value: string;
};

export type InlayHintOptions = {
  workDoneProgress?: boolean;
  resolveProvider?: boolean;
};

export type RelatedFullDocumentDiagnosticReport = {
  kind: 'full';
  resultId?: string;
  items: Diagnostic[];
  relatedDocuments?: {
    [key: string]: FullDocumentDiagnosticReport | UnchangedDocumentDiagnosticReport;
  };
};

export type RelatedUnchangedDocumentDiagnosticReport = {
  kind: 'unchanged';
  resultId: string;
  relatedDocuments?: {
    [key: string]: FullDocumentDiagnosticReport | UnchangedDocumentDiagnosticReport;
  };
};

export type FullDocumentDiagnosticReport = {
  kind: 'full';
  resultId?: string;
  items: Diagnostic[];
};

export type UnchangedDocumentDiagnosticReport = {
  kind: 'unchanged';
  resultId: string;
};

export type DiagnosticOptions = {
  workDoneProgress?: boolean;
  identifier?: string;
  interFileDependencies: boolean;
  workspaceDiagnostics: boolean;
};

export type PreviousResultId = {
  uri: string;
  value: string;
};

export type NotebookDocument = {
  uri: string;
  notebookType: string;
  version: number;
  metadata?: LSPObject;
  cells: NotebookCell[];
};

export type TextDocumentItem = {
  uri: string;
  languageId:
    | 'abap'
    | 'bat'
    | 'bibtex'
    | 'clojure'
    | 'coffeescript'
    | 'c'
    | 'cpp'
    | 'csharp'
    | 'css'
    | 'd'
    | 'pascal'
    | 'diff'
    | 'dart'
    | 'dockerfile'
    | 'elixir'
    | 'erlang'
    | 'fsharp'
    | 'git-commit'
    | 'git-rebase'
    | 'go'
    | 'groovy'
    | 'handlebars'
    | 'haskell'
    | 'html'
    | 'ini'
    | 'java'
    | 'javascript'
    | 'javascriptreact'
    | 'json'
    | 'latex'
    | 'less'
    | 'lua'
    | 'makefile'
    | 'markdown'
    | 'objective-c'
    | 'objective-cpp'
    | 'pascal'
    | 'perl'
    | 'perl6'
    | 'php'
    | 'plaintext'
    | 'powershell'
    | 'jade'
    | 'python'
    | 'r'
    | 'razor'
    | 'ruby'
    | 'rust'
    | 'scss'
    | 'sass'
    | 'scala'
    | 'shaderlab'
    | 'shellscript'
    | 'sql'
    | 'swift'
    | 'typescript'
    | 'typescriptreact'
    | 'tex'
    | 'vb'
    | 'xml'
    | 'xsl'
    | 'yaml'
    | string;
  version: number;
  text: string;
};

export type NotebookDocumentSyncOptions = {
  notebookSelector: (NotebookDocumentFilterWithNotebook | NotebookDocumentFilterWithCells)[];
  save?: boolean;
};

export type VersionedNotebookDocumentIdentifier = {
  version: number;
  uri: string;
};

export type NotebookDocumentChangeEvent = {
  metadata?: LSPObject;
  cells?: NotebookDocumentCellChanges;
};

export type NotebookDocumentIdentifier = {
  uri: string;
};

export type InlineCompletionContext = {
  triggerKind: 1 | 2;
  selectedCompletionInfo?: SelectedCompletionInfo;
};

export type StringValue = {
  kind: 'snippet';
  value: string;
};

export type InlineCompletionOptions = {
  workDoneProgress?: boolean;
};

export type TextDocumentContentOptions = {
  schemes: string[];
};

export type Registration = {
  id: string;
  method: string;
  registerOptions?: LSPAny;
};

export type Unregistration = {
  id: string;
  method: string;
};

export type _InitializeParams = {
  workDoneToken?: ProgressToken;
  processId: number | null;
  clientInfo?: ClientInfo;
  locale?: string;
  rootPath?: string | null;
  rootUri: string | null;
  capabilities: ClientCapabilities;
  initializationOptions?: LSPAny;
  trace?: 'off' | 'messages' | 'compact' | 'verbose';
};

export type WorkspaceFoldersInitializeParams = {
  workspaceFolders?: WorkspaceFolder[] | null;
};

export type ServerCapabilities = {
  positionEncoding?: 'utf-8' | 'utf-16' | 'utf-32' | string;
  textDocumentSync?: TextDocumentSyncOptions | 0 | 1 | 2;
  notebookDocumentSync?: NotebookDocumentSyncOptions | NotebookDocumentSyncRegistrationOptions;
  completionProvider?: CompletionOptions;
  hoverProvider?: boolean | HoverOptions;
  signatureHelpProvider?: SignatureHelpOptions;
  declarationProvider?: boolean | DeclarationOptions | DeclarationRegistrationOptions;
  definitionProvider?: boolean | DefinitionOptions;
  typeDefinitionProvider?: boolean | TypeDefinitionOptions | TypeDefinitionRegistrationOptions;
  implementationProvider?: boolean | ImplementationOptions | ImplementationRegistrationOptions;
  referencesProvider?: boolean | ReferenceOptions;
  documentHighlightProvider?: boolean | DocumentHighlightOptions;
  documentSymbolProvider?: boolean | DocumentSymbolOptions;
  codeActionProvider?: boolean | CodeActionOptions;
  codeLensProvider?: CodeLensOptions;
  documentLinkProvider?: DocumentLinkOptions;
  colorProvider?: boolean | DocumentColorOptions | DocumentColorRegistrationOptions;
  workspaceSymbolProvider?: boolean | WorkspaceSymbolOptions;
  documentFormattingProvider?: boolean | DocumentFormattingOptions;
  documentRangeFormattingProvider?: boolean | DocumentRangeFormattingOptions;
  documentOnTypeFormattingProvider?: DocumentOnTypeFormattingOptions;
  renameProvider?: boolean | RenameOptions;
  foldingRangeProvider?: boolean | FoldingRangeOptions | FoldingRangeRegistrationOptions;
  selectionRangeProvider?: boolean | SelectionRangeOptions | SelectionRangeRegistrationOptions;
  executeCommandProvider?: ExecuteCommandOptions;
  callHierarchyProvider?: boolean | CallHierarchyOptions | CallHierarchyRegistrationOptions;
  linkedEditingRangeProvider?:
    | boolean
    | LinkedEditingRangeOptions
    | LinkedEditingRangeRegistrationOptions;
  semanticTokensProvider?: SemanticTokensOptions | SemanticTokensRegistrationOptions;
  monikerProvider?: boolean | MonikerOptions | MonikerRegistrationOptions;
  typeHierarchyProvider?: boolean | TypeHierarchyOptions | TypeHierarchyRegistrationOptions;
  inlineValueProvider?: boolean | InlineValueOptions | InlineValueRegistrationOptions;
  inlayHintProvider?: boolean | InlayHintOptions | InlayHintRegistrationOptions;
  diagnosticProvider?: DiagnosticOptions | DiagnosticRegistrationOptions;
  inlineCompletionProvider?: boolean | InlineCompletionOptions;
  workspace?: WorkspaceOptions;
  experimental?: LSPAny;
};

export type ServerInfo = {
  name: string;
  version?: string;
};

export type VersionedTextDocumentIdentifier = {
  uri: string;
  version: number;
};

export type SaveOptions = {
  includeText?: boolean;
};

export type FileEvent = {
  uri: string;
  type: 1 | 2 | 3;
};

export type FileSystemWatcher = {
  globPattern: GlobPattern;
  kind?: 1 | 2 | 4 | number;
};

export type Diagnostic = {
  range: Range;
  severity?: 1 | 2 | 3 | 4;
  code?: number | string;
  codeDescription?: CodeDescription;
  source?: string;
  message: string | MarkupContent;
  tags?: (1 | 2)[];
  relatedInformation?: DiagnosticRelatedInformation[];
  data?: LSPAny;
};

export type CompletionContext = {
  triggerKind: 1 | 2 | 3;
  triggerCharacter?: string;
};

export type CompletionItemLabelDetails = {
  detail?: string;
  description?: string;
};

export type InsertReplaceEdit = {
  newText: string;
  insert: Range;
  replace: Range;
};

export type CompletionItemDefaults = {
  commitCharacters?: string[];
  editRange?: Range | EditRangeWithInsertReplace;
  insertTextFormat?: 1 | 2;
  insertTextMode?: 1 | 2;
  data?: LSPAny;
};

export type CompletionItemApplyKinds = {
  commitCharacters?: 1 | 2;
  data?: 1 | 2;
};

export type CompletionOptions = {
  workDoneProgress?: boolean;
  triggerCharacters?: string[];
  allCommitCharacters?: string[];
  resolveProvider?: boolean;
  completionItem?: ServerCompletionItemOptions;
};

export type HoverOptions = {
  workDoneProgress?: boolean;
};

export type SignatureHelpContext = {
  triggerKind: 1 | 2 | 3;
  triggerCharacter?: string;
  isRetrigger: boolean;
  activeSignatureHelp?: SignatureHelp;
};

export type SignatureInformation = {
  label: string;
  documentation?: string | MarkupContent;
  parameters?: ParameterInformation[];
  activeParameter?: number | null;
};

export type SignatureHelpOptions = {
  workDoneProgress?: boolean;
  triggerCharacters?: string[];
  retriggerCharacters?: string[];
};

export type DefinitionOptions = {
  workDoneProgress?: boolean;
};

export type ReferenceContext = {
  includeDeclaration: boolean;
};

export type ReferenceOptions = {
  workDoneProgress?: boolean;
};

export type DocumentHighlightOptions = {
  workDoneProgress?: boolean;
};

export type BaseSymbolInformation = {
  name: string;
  kind:
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26;
  tags?: 1[];
  containerName?: string;
};

export type DocumentSymbolOptions = {
  workDoneProgress?: boolean;
  label?: string;
};

export type CodeActionContext = {
  diagnostics: Diagnostic[];
  only?: (
    | ''
    | 'quickfix'
    | 'refactor'
    | 'refactor.extract'
    | 'refactor.inline'
    | 'refactor.move'
    | 'refactor.rewrite'
    | 'source'
    | 'source.organizeImports'
    | 'source.fixAll'
    | 'notebook'
    | string
  )[];
  triggerKind?: 1 | 2;
};

export type CodeActionDisabled = {
  reason: string;
};

export type CodeActionOptions = {
  workDoneProgress?: boolean;
  codeActionKinds?: (
    | ''
    | 'quickfix'
    | 'refactor'
    | 'refactor.extract'
    | 'refactor.inline'
    | 'refactor.move'
    | 'refactor.rewrite'
    | 'source'
    | 'source.organizeImports'
    | 'source.fixAll'
    | 'notebook'
    | string
  )[];
  documentation?: CodeActionKindDocumentation[];
  resolveProvider?: boolean;
};

export type LocationUriOnly = {
  uri: string;
};

export type WorkspaceSymbolOptions = {
  workDoneProgress?: boolean;
  resolveProvider?: boolean;
};

export type CodeLensOptions = {
  workDoneProgress?: boolean;
  resolveProvider?: boolean;
};

export type DocumentLinkOptions = {
  workDoneProgress?: boolean;
  resolveProvider?: boolean;
};

export type FormattingOptions = {
  tabSize: number;
  insertSpaces: boolean;
  trimTrailingWhitespace?: boolean;
  insertFinalNewline?: boolean;
  trimFinalNewlines?: boolean;
};

export type DocumentFormattingOptions = {
  workDoneProgress?: boolean;
};

export type DocumentRangeFormattingOptions = {
  workDoneProgress?: boolean;
  rangesSupport?: boolean;
};

export type DocumentOnTypeFormattingOptions = {
  firstTriggerCharacter: string;
  moreTriggerCharacter?: string[];
};

export type RenameOptions = {
  workDoneProgress?: boolean;
  prepareProvider?: boolean;
};

export type PrepareRenamePlaceholder = {
  range: Range;
  placeholder: string;
};

export type PrepareRenameDefaultBehavior = {
  defaultBehavior: boolean;
};

export type ExecuteCommandOptions = {
  workDoneProgress?: boolean;
  commands: string[];
};

export type WorkspaceEditMetadata = {
  isRefactoring?: boolean;
};

export type SemanticTokensLegend = {
  tokenTypes: string[];
  tokenModifiers: string[];
};

export type SemanticTokensFullDelta = {
  delta?: boolean;
};

export type OptionalVersionedTextDocumentIdentifier = {
  uri: string;
  version: number | null;
};

export type AnnotatedTextEdit = {
  range: Range;
  newText: string;
  annotationId: ChangeAnnotationIdentifier;
};

export type SnippetTextEdit = {
  range: Range;
  snippet: StringValue;
  annotationId?: ChangeAnnotationIdentifier;
};

export type ResourceOperation = {
  kind: string;
  annotationId?: ChangeAnnotationIdentifier;
};

export type CreateFileOptions = {
  overwrite?: boolean;
  ignoreIfExists?: boolean;
};

export type RenameFileOptions = {
  overwrite?: boolean;
  ignoreIfExists?: boolean;
};

export type DeleteFileOptions = {
  recursive?: boolean;
  ignoreIfNotExists?: boolean;
};

export type FileOperationPattern = {
  glob: string;
  matches?: 'file' | 'folder';
  options?: FileOperationPatternOptions;
};

export type WorkspaceFullDocumentDiagnosticReport = {
  kind: 'full';
  resultId?: string;
  items: Diagnostic[];
  uri: string;
  version: number | null;
};

export type WorkspaceUnchangedDocumentDiagnosticReport = {
  kind: 'unchanged';
  resultId: string;
  uri: string;
  version: number | null;
};

export type NotebookCell = {
  kind: 1 | 2;
  document: string;
  metadata?: LSPObject;
  executionSummary?: ExecutionSummary;
};

export type NotebookDocumentFilterWithNotebook = {
  notebook: string | NotebookDocumentFilter;
  cells?: NotebookCellLanguage[];
};

export type NotebookDocumentFilterWithCells = {
  notebook?: string | NotebookDocumentFilter;
  cells: NotebookCellLanguage[];
};

export type NotebookDocumentCellChanges = {
  structure?: NotebookDocumentCellChangeStructure;
  data?: NotebookCell[];
  textContent?: NotebookDocumentCellContentChanges[];
};

export type SelectedCompletionInfo = {
  range: Range;
  text: string;
};

export type ClientInfo = {
  name: string;
  version?: string;
};

export type ClientCapabilities = {
  workspace?: WorkspaceClientCapabilities;
  textDocument?: TextDocumentClientCapabilities;
  notebookDocument?: NotebookDocumentClientCapabilities;
  window?: WindowClientCapabilities;
  general?: GeneralClientCapabilities;
  experimental?: LSPAny;
};

export type TextDocumentSyncOptions = {
  openClose?: boolean;
  change?: 0 | 1 | 2;
  willSave?: boolean;
  willSaveWaitUntil?: boolean;
  save?: boolean | SaveOptions;
};

export type WorkspaceOptions = {
  workspaceFolders?: WorkspaceFoldersServerCapabilities;
  fileOperations?: FileOperationOptions;
  textDocumentContent?: TextDocumentContentOptions | TextDocumentContentRegistrationOptions;
};

export type TextDocumentContentChangePartial = {
  range: Range;
  rangeLength?: number;
  text: string;
};

export type TextDocumentContentChangeWholeDocument = {
  text: string;
};

export type CodeDescription = {
  href: string;
};

export type DiagnosticRelatedInformation = {
  location: Location;
  message: string;
};

export type EditRangeWithInsertReplace = {
  insert: Range;
  replace: Range;
};

export type ServerCompletionItemOptions = {
  labelDetailsSupport?: boolean;
};

export type MarkedStringWithLanguage = {
  language: string;
  value: string;
};

export type ParameterInformation = {
  label: string | [number, number];
  documentation?: string | MarkupContent;
};

export type CodeActionKindDocumentation = {
  kind:
    | ''
    | 'quickfix'
    | 'refactor'
    | 'refactor.extract'
    | 'refactor.inline'
    | 'refactor.move'
    | 'refactor.rewrite'
    | 'source'
    | 'source.organizeImports'
    | 'source.fixAll'
    | 'notebook'
    | string;
  command: Command;
};

export type NotebookCellTextDocumentFilter = {
  notebook: string | NotebookDocumentFilter;
  language?: string;
};

export type FileOperationPatternOptions = {
  ignoreCase?: boolean;
};

export type ExecutionSummary = {
  executionOrder: number;
  success?: boolean;
};

export type NotebookCellLanguage = {
  language: string;
};

export type NotebookDocumentCellChangeStructure = {
  array: NotebookCellArrayChange;
  didOpen?: TextDocumentItem[];
  didClose?: TextDocumentIdentifier[];
};

export type NotebookDocumentCellContentChanges = {
  document: VersionedTextDocumentIdentifier;
  changes: TextDocumentContentChangeEvent[];
};

export type WorkspaceClientCapabilities = {
  applyEdit?: boolean;
  workspaceEdit?: WorkspaceEditClientCapabilities;
  didChangeConfiguration?: DidChangeConfigurationClientCapabilities;
  didChangeWatchedFiles?: DidChangeWatchedFilesClientCapabilities;
  symbol?: WorkspaceSymbolClientCapabilities;
  executeCommand?: ExecuteCommandClientCapabilities;
  workspaceFolders?: boolean;
  configuration?: boolean;
  semanticTokens?: SemanticTokensWorkspaceClientCapabilities;
  codeLens?: CodeLensWorkspaceClientCapabilities;
  fileOperations?: FileOperationClientCapabilities;
  inlineValue?: InlineValueWorkspaceClientCapabilities;
  inlayHint?: InlayHintWorkspaceClientCapabilities;
  diagnostics?: DiagnosticWorkspaceClientCapabilities;
  foldingRange?: FoldingRangeWorkspaceClientCapabilities;
  textDocumentContent?: TextDocumentContentClientCapabilities;
};

export type TextDocumentClientCapabilities = {
  synchronization?: TextDocumentSyncClientCapabilities;
  filters?: TextDocumentFilterClientCapabilities;
  completion?: CompletionClientCapabilities;
  hover?: HoverClientCapabilities;
  signatureHelp?: SignatureHelpClientCapabilities;
  declaration?: DeclarationClientCapabilities;
  definition?: DefinitionClientCapabilities;
  typeDefinition?: TypeDefinitionClientCapabilities;
  implementation?: ImplementationClientCapabilities;
  references?: ReferenceClientCapabilities;
  documentHighlight?: DocumentHighlightClientCapabilities;
  documentSymbol?: DocumentSymbolClientCapabilities;
  codeAction?: CodeActionClientCapabilities;
  codeLens?: CodeLensClientCapabilities;
  documentLink?: DocumentLinkClientCapabilities;
  colorProvider?: DocumentColorClientCapabilities;
  formatting?: DocumentFormattingClientCapabilities;
  rangeFormatting?: DocumentRangeFormattingClientCapabilities;
  onTypeFormatting?: DocumentOnTypeFormattingClientCapabilities;
  rename?: RenameClientCapabilities;
  foldingRange?: FoldingRangeClientCapabilities;
  selectionRange?: SelectionRangeClientCapabilities;
  publishDiagnostics?: PublishDiagnosticsClientCapabilities;
  callHierarchy?: CallHierarchyClientCapabilities;
  semanticTokens?: SemanticTokensClientCapabilities;
  linkedEditingRange?: LinkedEditingRangeClientCapabilities;
  moniker?: MonikerClientCapabilities;
  typeHierarchy?: TypeHierarchyClientCapabilities;
  inlineValue?: InlineValueClientCapabilities;
  inlayHint?: InlayHintClientCapabilities;
  diagnostic?: DiagnosticClientCapabilities;
  inlineCompletion?: InlineCompletionClientCapabilities;
};

export type NotebookDocumentClientCapabilities = {
  synchronization: NotebookDocumentSyncClientCapabilities;
};

export type WindowClientCapabilities = {
  workDoneProgress?: boolean;
  showMessage?: ShowMessageRequestClientCapabilities;
  showDocument?: ShowDocumentClientCapabilities;
};

export type GeneralClientCapabilities = {
  staleRequestSupport?: StaleRequestSupportOptions;
  regularExpressions?: RegularExpressionsClientCapabilities;
  markdown?: MarkdownClientCapabilities;
  positionEncodings?: ('utf-8' | 'utf-16' | 'utf-32' | string)[];
};

export type WorkspaceFoldersServerCapabilities = {
  supported?: boolean;
  changeNotifications?: string | boolean;
};

export type FileOperationOptions = {
  didCreate?: FileOperationRegistrationOptions;
  willCreate?: FileOperationRegistrationOptions;
  didRename?: FileOperationRegistrationOptions;
  willRename?: FileOperationRegistrationOptions;
  didDelete?: FileOperationRegistrationOptions;
  willDelete?: FileOperationRegistrationOptions;
};

export type RelativePattern = {
  baseUri: WorkspaceFolder | string;
  pattern: Pattern;
};

export type TextDocumentFilterLanguage = {
  language: string;
  scheme?: string;
  pattern?: GlobPattern;
};

export type TextDocumentFilterScheme = {
  language?: string;
  scheme: string;
  pattern?: GlobPattern;
};

export type TextDocumentFilterPattern = {
  language?: string;
  scheme?: string;
  pattern: GlobPattern;
};

export type NotebookDocumentFilterNotebookType = {
  notebookType: string;
  scheme?: string;
  pattern?: GlobPattern;
};

export type NotebookDocumentFilterScheme = {
  notebookType?: string;
  scheme: string;
  pattern?: GlobPattern;
};

export type NotebookDocumentFilterPattern = {
  notebookType?: string;
  scheme?: string;
  pattern: GlobPattern;
};

export type NotebookCellArrayChange = {
  start: number;
  deleteCount: number;
  cells?: NotebookCell[];
};

export type WorkspaceEditClientCapabilities = {
  documentChanges?: boolean;
  resourceOperations?: ('create' | 'rename' | 'delete')[];
  failureHandling?: 'abort' | 'transactional' | 'textOnlyTransactional' | 'undo';
  normalizesLineEndings?: boolean;
  changeAnnotationSupport?: ChangeAnnotationsSupportOptions;
  metadataSupport?: boolean;
  snippetEditSupport?: boolean;
};

export type DidChangeConfigurationClientCapabilities = {
  dynamicRegistration?: boolean;
};

export type DidChangeWatchedFilesClientCapabilities = {
  dynamicRegistration?: boolean;
  relativePatternSupport?: boolean;
};

export type WorkspaceSymbolClientCapabilities = {
  dynamicRegistration?: boolean;
  symbolKind?: ClientSymbolKindOptions;
  tagSupport?: ClientSymbolTagOptions;
  resolveSupport?: ClientSymbolResolveOptions;
};

export type ExecuteCommandClientCapabilities = {
  dynamicRegistration?: boolean;
};

export type SemanticTokensWorkspaceClientCapabilities = {
  refreshSupport?: boolean;
};

export type CodeLensWorkspaceClientCapabilities = {
  refreshSupport?: boolean;
};

export type FileOperationClientCapabilities = {
  dynamicRegistration?: boolean;
  didCreate?: boolean;
  willCreate?: boolean;
  didRename?: boolean;
  willRename?: boolean;
  didDelete?: boolean;
  willDelete?: boolean;
};

export type InlineValueWorkspaceClientCapabilities = {
  refreshSupport?: boolean;
};

export type InlayHintWorkspaceClientCapabilities = {
  refreshSupport?: boolean;
};

export type DiagnosticWorkspaceClientCapabilities = {
  refreshSupport?: boolean;
};

export type FoldingRangeWorkspaceClientCapabilities = {
  refreshSupport?: boolean;
};

export type TextDocumentContentClientCapabilities = {
  dynamicRegistration?: boolean;
};

export type TextDocumentSyncClientCapabilities = {
  dynamicRegistration?: boolean;
  willSave?: boolean;
  willSaveWaitUntil?: boolean;
  didSave?: boolean;
};

export type TextDocumentFilterClientCapabilities = {
  relativePatternSupport?: boolean;
};

export type CompletionClientCapabilities = {
  dynamicRegistration?: boolean;
  completionItem?: ClientCompletionItemOptions;
  completionItemKind?: ClientCompletionItemOptionsKind;
  insertTextMode?: 1 | 2;
  contextSupport?: boolean;
  completionList?: CompletionListCapabilities;
};

export type HoverClientCapabilities = {
  dynamicRegistration?: boolean;
  contentFormat?: ('plaintext' | 'markdown')[];
};

export type SignatureHelpClientCapabilities = {
  dynamicRegistration?: boolean;
  signatureInformation?: ClientSignatureInformationOptions;
  contextSupport?: boolean;
};

export type DeclarationClientCapabilities = {
  dynamicRegistration?: boolean;
  linkSupport?: boolean;
};

export type DefinitionClientCapabilities = {
  dynamicRegistration?: boolean;
  linkSupport?: boolean;
};

export type TypeDefinitionClientCapabilities = {
  dynamicRegistration?: boolean;
  linkSupport?: boolean;
};

export type ImplementationClientCapabilities = {
  dynamicRegistration?: boolean;
  linkSupport?: boolean;
};

export type ReferenceClientCapabilities = {
  dynamicRegistration?: boolean;
};

export type DocumentHighlightClientCapabilities = {
  dynamicRegistration?: boolean;
};

export type DocumentSymbolClientCapabilities = {
  dynamicRegistration?: boolean;
  symbolKind?: ClientSymbolKindOptions;
  hierarchicalDocumentSymbolSupport?: boolean;
  tagSupport?: ClientSymbolTagOptions;
  labelSupport?: boolean;
};

export type CodeActionClientCapabilities = {
  dynamicRegistration?: boolean;
  codeActionLiteralSupport?: ClientCodeActionLiteralOptions;
  isPreferredSupport?: boolean;
  disabledSupport?: boolean;
  dataSupport?: boolean;
  resolveSupport?: ClientCodeActionResolveOptions;
  honorsChangeAnnotations?: boolean;
  documentationSupport?: boolean;
  tagSupport?: CodeActionTagOptions;
};

export type CodeLensClientCapabilities = {
  dynamicRegistration?: boolean;
  resolveSupport?: ClientCodeLensResolveOptions;
};

export type DocumentLinkClientCapabilities = {
  dynamicRegistration?: boolean;
  tooltipSupport?: boolean;
};

export type DocumentColorClientCapabilities = {
  dynamicRegistration?: boolean;
};

export type DocumentFormattingClientCapabilities = {
  dynamicRegistration?: boolean;
};

export type DocumentRangeFormattingClientCapabilities = {
  dynamicRegistration?: boolean;
  rangesSupport?: boolean;
};

export type DocumentOnTypeFormattingClientCapabilities = {
  dynamicRegistration?: boolean;
};

export type RenameClientCapabilities = {
  dynamicRegistration?: boolean;
  prepareSupport?: boolean;
  prepareSupportDefaultBehavior?: 1;
  honorsChangeAnnotations?: boolean;
};

export type FoldingRangeClientCapabilities = {
  dynamicRegistration?: boolean;
  rangeLimit?: number;
  lineFoldingOnly?: boolean;
  foldingRangeKind?: ClientFoldingRangeKindOptions;
  foldingRange?: ClientFoldingRangeOptions;
};

export type SelectionRangeClientCapabilities = {
  dynamicRegistration?: boolean;
};

export type PublishDiagnosticsClientCapabilities = {
  relatedInformation?: boolean;
  tagSupport?: ClientDiagnosticsTagOptions;
  codeDescriptionSupport?: boolean;
  dataSupport?: boolean;
  versionSupport?: boolean;
};

export type CallHierarchyClientCapabilities = {
  dynamicRegistration?: boolean;
};

export type SemanticTokensClientCapabilities = {
  dynamicRegistration?: boolean;
  requests: ClientSemanticTokensRequestOptions;
  tokenTypes: string[];
  tokenModifiers: string[];
  formats: 'relative'[];
  overlappingTokenSupport?: boolean;
  multilineTokenSupport?: boolean;
  serverCancelSupport?: boolean;
  augmentsSyntaxTokens?: boolean;
};

export type LinkedEditingRangeClientCapabilities = {
  dynamicRegistration?: boolean;
};

export type MonikerClientCapabilities = {
  dynamicRegistration?: boolean;
};

export type TypeHierarchyClientCapabilities = {
  dynamicRegistration?: boolean;
};

export type InlineValueClientCapabilities = {
  dynamicRegistration?: boolean;
};

export type InlayHintClientCapabilities = {
  dynamicRegistration?: boolean;
  resolveSupport?: ClientInlayHintResolveOptions;
};

export type DiagnosticClientCapabilities = {
  relatedInformation?: boolean;
  tagSupport?: ClientDiagnosticsTagOptions;
  codeDescriptionSupport?: boolean;
  dataSupport?: boolean;
  dynamicRegistration?: boolean;
  relatedDocumentSupport?: boolean;
  markupMessageSupport?: boolean;
};

export type InlineCompletionClientCapabilities = {
  dynamicRegistration?: boolean;
};

export type NotebookDocumentSyncClientCapabilities = {
  dynamicRegistration?: boolean;
  executionSummarySupport?: boolean;
};

export type ShowMessageRequestClientCapabilities = {
  messageActionItem?: ClientShowMessageActionItemOptions;
};

export type ShowDocumentClientCapabilities = {
  support: boolean;
};

export type StaleRequestSupportOptions = {
  cancel: boolean;
  retryOnContentModified: string[];
};

export type RegularExpressionsClientCapabilities = {
  engine: RegularExpressionEngineKind;
  version?: string;
};

export type MarkdownClientCapabilities = {
  parser: string;
  version?: string;
  allowedTags?: string[];
};

export type ChangeAnnotationsSupportOptions = {
  groupsOnLabel?: boolean;
};

export type ClientSymbolKindOptions = {
  valueSet?: (
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
  )[];
};

export type ClientSymbolTagOptions = {
  valueSet: 1[];
};

export type ClientSymbolResolveOptions = {
  properties: string[];
};

export type ClientCompletionItemOptions = {
  snippetSupport?: boolean;
  commitCharactersSupport?: boolean;
  documentationFormat?: ('plaintext' | 'markdown')[];
  deprecatedSupport?: boolean;
  preselectSupport?: boolean;
  tagSupport?: CompletionItemTagOptions;
  insertReplaceSupport?: boolean;
  resolveSupport?: ClientCompletionItemResolveOptions;
  insertTextModeSupport?: ClientCompletionItemInsertTextModeOptions;
  labelDetailsSupport?: boolean;
};

export type ClientCompletionItemOptionsKind = {
  valueSet?: (
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
  )[];
};

export type CompletionListCapabilities = {
  itemDefaults?: string[];
  applyKindSupport?: boolean;
};

export type ClientSignatureInformationOptions = {
  documentationFormat?: ('plaintext' | 'markdown')[];
  parameterInformation?: ClientSignatureParameterInformationOptions;
  activeParameterSupport?: boolean;
  noActiveParameterSupport?: boolean;
};

export type ClientCodeActionLiteralOptions = {
  codeActionKind: ClientCodeActionKindOptions;
};

export type ClientCodeActionResolveOptions = {
  properties: string[];
};

export type CodeActionTagOptions = {
  valueSet: 1[];
};

export type ClientCodeLensResolveOptions = {
  properties: string[];
};

export type ClientFoldingRangeKindOptions = {
  valueSet?: ('comment' | 'imports' | 'region' | string)[];
};

export type ClientFoldingRangeOptions = {
  collapsedText?: boolean;
};

export type DiagnosticsCapabilities = {
  relatedInformation?: boolean;
  tagSupport?: ClientDiagnosticsTagOptions;
  codeDescriptionSupport?: boolean;
  dataSupport?: boolean;
};

export type ClientSemanticTokensRequestOptions = {
  range?: boolean | {};
  full?: boolean | ClientSemanticTokensRequestFullDelta;
};

export type ClientInlayHintResolveOptions = {
  properties: string[];
};

export type ClientShowMessageActionItemOptions = {
  additionalPropertiesSupport?: boolean;
};

export type CompletionItemTagOptions = {
  valueSet: 1[];
};

export type ClientCompletionItemResolveOptions = {
  properties: string[];
};

export type ClientCompletionItemInsertTextModeOptions = {
  valueSet: (1 | 2)[];
};

export type ClientSignatureParameterInformationOptions = {
  labelOffsetSupport?: boolean;
};

export type ClientCodeActionKindOptions = {
  valueSet: (
    | ''
    | 'quickfix'
    | 'refactor'
    | 'refactor.extract'
    | 'refactor.inline'
    | 'refactor.move'
    | 'refactor.rewrite'
    | 'source'
    | 'source.organizeImports'
    | 'source.fixAll'
    | 'notebook'
    | string
  )[];
};

export type ClientDiagnosticsTagOptions = {
  valueSet: (1 | 2)[];
};

export type ClientSemanticTokensRequestFullDelta = {
  delta?: boolean;
};

export type Definition = Location | Location[];
export type DefinitionLink = LocationLink;
export type LSPArray = LSPAny[];
export type LSPAny = LSPObject | LSPArray | string | number | boolean | null;
export type Declaration = Location | Location[];
export type DeclarationLink = LocationLink;
export type InlineValue =
  | InlineValueText
  | InlineValueVariableLookup
  | InlineValueEvaluatableExpression;
export type DocumentDiagnosticReport =
  | RelatedFullDocumentDiagnosticReport
  | RelatedUnchangedDocumentDiagnosticReport;
export type PrepareRenameResult = Range | PrepareRenamePlaceholder | PrepareRenameDefaultBehavior;
export type DocumentSelector = DocumentFilter[];
export type ProgressToken = number | string;
export type ChangeAnnotationIdentifier = string;
export type WorkspaceDocumentDiagnosticReport =
  | WorkspaceFullDocumentDiagnosticReport
  | WorkspaceUnchangedDocumentDiagnosticReport;
export type TextDocumentContentChangeEvent =
  | TextDocumentContentChangePartial
  | TextDocumentContentChangeWholeDocument;
export type MarkedString = string | MarkedStringWithLanguage;
export type DocumentFilter = TextDocumentFilter | NotebookCellTextDocumentFilter;
export type LSPObject = { [key: string]: LSPAny };
export type GlobPattern = Pattern | RelativePattern;
export type TextDocumentFilter =
  | TextDocumentFilterLanguage
  | TextDocumentFilterScheme
  | TextDocumentFilterPattern;
export type NotebookDocumentFilter =
  | NotebookDocumentFilterNotebookType
  | NotebookDocumentFilterScheme
  | NotebookDocumentFilterPattern;
export type Pattern = string;
export type RegularExpressionEngineKind = string;

// TextDocumentContent has no schema in the metamodel yet
export type TextDocumentContent = unknown;
