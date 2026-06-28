/**
 * Zod schemas for LSP protocol types
 * Runtime validators derived from the official LSP metaModel.json
 *
 * Auto-generated from metaModel.json — DO NOT EDIT MANUALLY
 */

import { z } from 'zod';

export const SemanticTokenTypesSchema = z.union([
  z.literal('namespace'),
  z.literal('type'),
  z.literal('class'),
  z.literal('enum'),
  z.literal('interface'),
  z.literal('struct'),
  z.literal('typeParameter'),
  z.literal('parameter'),
  z.literal('variable'),
  z.literal('property'),
  z.literal('enumMember'),
  z.literal('event'),
  z.literal('function'),
  z.literal('method'),
  z.literal('macro'),
  z.literal('keyword'),
  z.literal('modifier'),
  z.literal('comment'),
  z.literal('string'),
  z.literal('number'),
  z.literal('regexp'),
  z.literal('operator'),
  z.literal('decorator'),
  z.literal('label'),
  z.string()
]);
export const SemanticTokenModifiersSchema = z.union([
  z.literal('declaration'),
  z.literal('definition'),
  z.literal('readonly'),
  z.literal('static'),
  z.literal('deprecated'),
  z.literal('abstract'),
  z.literal('async'),
  z.literal('modification'),
  z.literal('documentation'),
  z.literal('defaultLibrary'),
  z.string()
]);
export const DocumentDiagnosticReportKindSchema = z.union([
  z.literal('full'),
  z.literal('unchanged')
]);
export const ErrorCodesSchema = z.union([
  z.literal(-32700),
  z.literal(-32600),
  z.literal(-32601),
  z.literal(-32602),
  z.literal(-32603),
  z.literal(-32002),
  z.literal(-32001),
  z.number().int()
]);
export const LSPErrorCodesSchema = z.union([
  z.literal(-32803),
  z.literal(-32802),
  z.literal(-32801),
  z.literal(-32800),
  z.number().int()
]);
export const FoldingRangeKindSchema = z.union([
  z.literal('comment'),
  z.literal('imports'),
  z.literal('region'),
  z.string()
]);
export const SymbolKindSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
  z.literal(11),
  z.literal(12),
  z.literal(13),
  z.literal(14),
  z.literal(15),
  z.literal(16),
  z.literal(17),
  z.literal(18),
  z.literal(19),
  z.literal(20),
  z.literal(21),
  z.literal(22),
  z.literal(23),
  z.literal(24),
  z.literal(25),
  z.literal(26)
]);
export const SymbolTagSchema = z.literal(1);
export const UniquenessLevelSchema = z.union([
  z.literal('document'),
  z.literal('project'),
  z.literal('group'),
  z.literal('scheme'),
  z.literal('global')
]);
export const MonikerKindSchema = z.union([
  z.literal('import'),
  z.literal('export'),
  z.literal('local')
]);
export const InlayHintKindSchema = z.union([z.literal(1), z.literal(2)]);
export const MessageTypeSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5)
]);
export const TextDocumentSyncKindSchema = z.union([z.literal(0), z.literal(1), z.literal(2)]);
export const TextDocumentSaveReasonSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export const CompletionItemKindSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
  z.literal(11),
  z.literal(12),
  z.literal(13),
  z.literal(14),
  z.literal(15),
  z.literal(16),
  z.literal(17),
  z.literal(18),
  z.literal(19),
  z.literal(20),
  z.literal(21),
  z.literal(22),
  z.literal(23),
  z.literal(24),
  z.literal(25)
]);
export const CompletionItemTagSchema = z.literal(1);
export const InsertTextFormatSchema = z.union([z.literal(1), z.literal(2)]);
export const InsertTextModeSchema = z.union([z.literal(1), z.literal(2)]);
export const DocumentHighlightKindSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export const CodeActionKindSchema = z.union([
  z.literal(''),
  z.literal('quickfix'),
  z.literal('refactor'),
  z.literal('refactor.extract'),
  z.literal('refactor.inline'),
  z.literal('refactor.move'),
  z.literal('refactor.rewrite'),
  z.literal('source'),
  z.literal('source.organizeImports'),
  z.literal('source.fixAll'),
  z.literal('notebook'),
  z.string()
]);
export const CodeActionTagSchema = z.literal(1);
export const TraceValueSchema = z.union([
  z.literal('off'),
  z.literal('messages'),
  z.literal('compact'),
  z.literal('verbose')
]);
export const MarkupKindSchema = z.union([z.literal('plaintext'), z.literal('markdown')]);
export const LanguageKindSchema = z.union([
  z.literal('abap'),
  z.literal('bat'),
  z.literal('bibtex'),
  z.literal('clojure'),
  z.literal('coffeescript'),
  z.literal('c'),
  z.literal('cpp'),
  z.literal('csharp'),
  z.literal('css'),
  z.literal('d'),
  z.literal('pascal'),
  z.literal('diff'),
  z.literal('dart'),
  z.literal('dockerfile'),
  z.literal('elixir'),
  z.literal('erlang'),
  z.literal('fsharp'),
  z.literal('git-commit'),
  z.literal('git-rebase'),
  z.literal('go'),
  z.literal('groovy'),
  z.literal('handlebars'),
  z.literal('haskell'),
  z.literal('html'),
  z.literal('ini'),
  z.literal('java'),
  z.literal('javascript'),
  z.literal('javascriptreact'),
  z.literal('json'),
  z.literal('latex'),
  z.literal('less'),
  z.literal('lua'),
  z.literal('makefile'),
  z.literal('markdown'),
  z.literal('objective-c'),
  z.literal('objective-cpp'),
  z.literal('pascal'),
  z.literal('perl'),
  z.literal('perl6'),
  z.literal('php'),
  z.literal('plaintext'),
  z.literal('powershell'),
  z.literal('jade'),
  z.literal('python'),
  z.literal('r'),
  z.literal('razor'),
  z.literal('ruby'),
  z.literal('rust'),
  z.literal('scss'),
  z.literal('sass'),
  z.literal('scala'),
  z.literal('shaderlab'),
  z.literal('shellscript'),
  z.literal('sql'),
  z.literal('swift'),
  z.literal('typescript'),
  z.literal('typescriptreact'),
  z.literal('tex'),
  z.literal('vb'),
  z.literal('xml'),
  z.literal('xsl'),
  z.literal('yaml'),
  z.string()
]);
export const InlineCompletionTriggerKindSchema = z.union([z.literal(1), z.literal(2)]);
export const PositionEncodingKindSchema = z.union([
  z.literal('utf-8'),
  z.literal('utf-16'),
  z.literal('utf-32'),
  z.string()
]);
export const FileChangeTypeSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export const WatchKindSchema = z.union([z.literal(1), z.literal(2), z.literal(4), z.number()]);
export const DiagnosticSeveritySchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4)
]);
export const DiagnosticTagSchema = z.union([z.literal(1), z.literal(2)]);
export const CompletionTriggerKindSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export const ApplyKindSchema = z.union([z.literal(1), z.literal(2)]);
export const SignatureHelpTriggerKindSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export const CodeActionTriggerKindSchema = z.union([z.literal(1), z.literal(2)]);
export const FileOperationPatternKindSchema = z.union([z.literal('file'), z.literal('folder')]);
export const NotebookCellKindSchema = z.union([z.literal(1), z.literal(2)]);
export const ResourceOperationKindSchema = z.union([
  z.literal('create'),
  z.literal('rename'),
  z.literal('delete')
]);
export const FailureHandlingKindSchema = z.union([
  z.literal('abort'),
  z.literal('transactional'),
  z.literal('textOnlyTransactional'),
  z.literal('undo')
]);
export const PrepareSupportDefaultBehaviorSchema = z.literal(1);
export const TokenFormatSchema = z.literal('relative');
export const TextDocumentIdentifierSchema = z.object({
  uri: z.string()
});
export const PositionSchema = z.object({
  line: z.number().int().gte(0),
  character: z.number().int().gte(0)
});
export const ProgressTokenSchema = z.union([z.number().int(), z.string()]);
export const ImplementationParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional()
});
export const RangeSchema = z.object({
  start: PositionSchema,
  end: PositionSchema
});
export const LocationSchema = z.object({
  uri: z.string(),
  range: RangeSchema
});
export const PatternSchema = z.string();
export const WorkspaceFolderSchema = z.object({
  uri: z.string(),
  name: z.string()
});
export const RelativePatternSchema = z.object({
  baseUri: z.union([WorkspaceFolderSchema, z.string()]),
  pattern: PatternSchema
});
export const GlobPatternSchema = z.union([PatternSchema, RelativePatternSchema]);
export const TextDocumentFilterLanguageSchema = z.object({
  language: z.string(),
  scheme: z.string().optional(),
  pattern: GlobPatternSchema.optional()
});
export const TextDocumentFilterSchemeSchema = z.object({
  language: z.string().optional(),
  scheme: z.string(),
  pattern: GlobPatternSchema.optional()
});
export const TextDocumentFilterPatternSchema = z.object({
  language: z.string().optional(),
  scheme: z.string().optional(),
  pattern: GlobPatternSchema
});
export const TextDocumentFilterSchema = z.union([
  TextDocumentFilterLanguageSchema,
  TextDocumentFilterSchemeSchema,
  TextDocumentFilterPatternSchema
]);
export const NotebookDocumentFilterNotebookTypeSchema = z.object({
  notebookType: z.string(),
  scheme: z.string().optional(),
  pattern: GlobPatternSchema.optional()
});
export const NotebookDocumentFilterSchemeSchema = z.object({
  notebookType: z.string().optional(),
  scheme: z.string(),
  pattern: GlobPatternSchema.optional()
});
export const NotebookDocumentFilterPatternSchema = z.object({
  notebookType: z.string().optional(),
  scheme: z.string().optional(),
  pattern: GlobPatternSchema
});
export const NotebookDocumentFilterSchema = z.union([
  NotebookDocumentFilterNotebookTypeSchema,
  NotebookDocumentFilterSchemeSchema,
  NotebookDocumentFilterPatternSchema
]);
export const NotebookCellTextDocumentFilterSchema = z.object({
  notebook: z.union([z.string(), NotebookDocumentFilterSchema]),
  language: z.string().optional()
});
export const DocumentFilterSchema = z.union([
  TextDocumentFilterSchema,
  NotebookCellTextDocumentFilterSchema
]);
export const DocumentSelectorSchema = z.array(DocumentFilterSchema);
export const ImplementationRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  id: z.string().optional()
});
export const TypeDefinitionParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional()
});
export const TypeDefinitionRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  id: z.string().optional()
});
export const WorkspaceFoldersChangeEventSchema = z.object({
  added: z.array(WorkspaceFolderSchema),
  removed: z.array(WorkspaceFolderSchema)
});
export const DidChangeWorkspaceFoldersParamsSchema = z.object({
  event: WorkspaceFoldersChangeEventSchema
});
export const ConfigurationItemSchema = z.object({
  scopeUri: z.string().optional(),
  section: z.string().optional()
});
export const ConfigurationParamsSchema = z.object({
  items: z.array(ConfigurationItemSchema)
});
export const DocumentColorParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema
});
export const ColorSchema = z.object({
  red: z.number(),
  green: z.number(),
  blue: z.number(),
  alpha: z.number()
});
export const ColorInformationSchema = z.object({
  range: RangeSchema,
  color: ColorSchema
});
export const DocumentColorRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  id: z.string().optional()
});
export const ColorPresentationParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema,
  color: ColorSchema,
  range: RangeSchema
});
export const TextEditSchema = z.object({
  range: RangeSchema,
  newText: z.string()
});
export const ColorPresentationSchema = z.object({
  label: z.string(),
  textEdit: TextEditSchema.optional(),
  additionalTextEdits: z.array(TextEditSchema).optional()
});
export const WorkDoneProgressOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const TextDocumentRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)])
});
export const FoldingRangeParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema
});
export const FoldingRangeSchema = z.object({
  startLine: z.number().int().gte(0),
  startCharacter: z.number().int().gte(0).optional(),
  endLine: z.number().int().gte(0),
  endCharacter: z.number().int().gte(0).optional(),
  kind: FoldingRangeKindSchema.optional(),
  collapsedText: z.string().optional()
});
export const FoldingRangeRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  id: z.string().optional()
});
export const DeclarationParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional()
});
export const DeclarationRegistrationOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  id: z.string().optional()
});
export const SelectionRangeParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema,
  positions: z.array(PositionSchema)
});
type _SelectionRange = {
  range: z.infer<typeof RangeSchema>;
  parent?: _SelectionRange | undefined;
};
export const SelectionRangeSchema: z.ZodType<_SelectionRange> = z.object({
  range: RangeSchema,
  parent: z.lazy(() => SelectionRangeSchema).optional()
});
export const SelectionRangeRegistrationOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  id: z.string().optional()
});
export const WorkDoneProgressCreateParamsSchema = z.object({
  token: ProgressTokenSchema
});
export const WorkDoneProgressCancelParamsSchema = z.object({
  token: ProgressTokenSchema
});
export const CallHierarchyPrepareParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  workDoneToken: ProgressTokenSchema.optional()
});
export const LSPObjectSchema = z.record(
  z.string(),
  z.lazy(() => LSPAnySchema)
);
export const LSPArraySchema = z.array(z.lazy(() => LSPAnySchema));
export const LSPAnySchema: z.ZodType<unknown> = z.union([
  LSPObjectSchema,
  LSPArraySchema,
  z.string(),
  z.number().int(),
  z.number().int().gte(0),
  z.number(),
  z.boolean(),
  z.literal(null)
]);
export const CallHierarchyItemSchema = z.object({
  name: z.string(),
  kind: SymbolKindSchema,
  tags: z.array(SymbolTagSchema).optional(),
  detail: z.string().optional(),
  uri: z.string(),
  range: RangeSchema,
  selectionRange: RangeSchema,
  data: z.lazy(() => LSPAnySchema).optional()
});
export const CallHierarchyRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  id: z.string().optional()
});
export const CallHierarchyIncomingCallsParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  item: CallHierarchyItemSchema
});
export const CallHierarchyIncomingCallSchema = z.object({
  from: CallHierarchyItemSchema,
  fromRanges: z.array(RangeSchema)
});
export const CallHierarchyOutgoingCallsParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  item: CallHierarchyItemSchema
});
export const CallHierarchyOutgoingCallSchema = z.object({
  to: CallHierarchyItemSchema,
  fromRanges: z.array(RangeSchema)
});
export const SemanticTokensParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema
});
export const SemanticTokensSchema = z.object({
  resultId: z.string().optional(),
  data: z.array(z.number().int().gte(0))
});
export const SemanticTokensPartialResultSchema = z.object({
  data: z.array(z.number().int().gte(0))
});
export const SemanticTokensLegendSchema = z.object({
  tokenTypes: z.array(z.string()),
  tokenModifiers: z.array(z.string())
});
export const SemanticTokensFullDeltaSchema = z.object({
  delta: z.boolean().optional()
});
export const SemanticTokensRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  legend: SemanticTokensLegendSchema,
  range: z.union([z.boolean(), z.object({})]).optional(),
  full: z.union([z.boolean(), SemanticTokensFullDeltaSchema]).optional(),
  id: z.string().optional()
});
export const SemanticTokensDeltaParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema,
  previousResultId: z.string()
});
export const SemanticTokensEditSchema = z.object({
  start: z.number().int().gte(0),
  deleteCount: z.number().int().gte(0),
  data: z.array(z.number().int().gte(0)).optional()
});
export const SemanticTokensDeltaSchema = z.object({
  resultId: z.string().optional(),
  edits: z.array(SemanticTokensEditSchema)
});
export const SemanticTokensDeltaPartialResultSchema = z.object({
  edits: z.array(SemanticTokensEditSchema)
});
export const SemanticTokensRangeParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema,
  range: RangeSchema
});
export const ShowDocumentParamsSchema = z.object({
  uri: z.string(),
  external: z.boolean().optional(),
  takeFocus: z.boolean().optional(),
  selection: RangeSchema.optional()
});
export const ShowDocumentResultSchema = z.object({
  success: z.boolean()
});
export const LinkedEditingRangeParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  workDoneToken: ProgressTokenSchema.optional()
});
export const LinkedEditingRangesSchema = z.object({
  ranges: z.array(RangeSchema),
  wordPattern: z.string().optional()
});
export const LinkedEditingRangeRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  id: z.string().optional()
});
export const FileCreateSchema = z.object({
  uri: z.string()
});
export const CreateFilesParamsSchema = z.object({
  files: z.array(FileCreateSchema)
});
export const OptionalVersionedTextDocumentIdentifierSchema = z.object({
  uri: z.string(),
  version: z.union([z.number().int(), z.literal(null)])
});
export const ChangeAnnotationIdentifierSchema = z.string();
export const AnnotatedTextEditSchema = z.object({
  range: RangeSchema,
  newText: z.string(),
  annotationId: ChangeAnnotationIdentifierSchema
});
export const StringValueSchema = z.object({
  kind: z.literal('snippet'),
  value: z.string()
});
export const SnippetTextEditSchema = z.object({
  range: RangeSchema,
  snippet: StringValueSchema,
  annotationId: ChangeAnnotationIdentifierSchema.optional()
});
export const TextDocumentEditSchema = z.object({
  textDocument: OptionalVersionedTextDocumentIdentifierSchema,
  edits: z.array(z.union([TextEditSchema, AnnotatedTextEditSchema, SnippetTextEditSchema]))
});
export const CreateFileOptionsSchema = z.object({
  overwrite: z.boolean().optional(),
  ignoreIfExists: z.boolean().optional()
});
export const CreateFileSchema = z.object({
  kind: z.literal('create'),
  annotationId: ChangeAnnotationIdentifierSchema.optional(),
  uri: z.string(),
  options: CreateFileOptionsSchema.optional()
});
export const RenameFileOptionsSchema = z.object({
  overwrite: z.boolean().optional(),
  ignoreIfExists: z.boolean().optional()
});
export const RenameFileSchema = z.object({
  kind: z.literal('rename'),
  annotationId: ChangeAnnotationIdentifierSchema.optional(),
  oldUri: z.string(),
  newUri: z.string(),
  options: RenameFileOptionsSchema.optional()
});
export const DeleteFileOptionsSchema = z.object({
  recursive: z.boolean().optional(),
  ignoreIfNotExists: z.boolean().optional()
});
export const DeleteFileSchema = z.object({
  kind: z.literal('delete'),
  annotationId: ChangeAnnotationIdentifierSchema.optional(),
  uri: z.string(),
  options: DeleteFileOptionsSchema.optional()
});
export const ChangeAnnotationSchema = z.object({
  label: z.string(),
  needsConfirmation: z.boolean().optional(),
  description: z.string().optional()
});
export const WorkspaceEditSchema = z.object({
  changes: z.record(z.string(), z.array(TextEditSchema)).optional(),
  documentChanges: z
    .array(z.union([TextDocumentEditSchema, CreateFileSchema, RenameFileSchema, DeleteFileSchema]))
    .optional(),
  changeAnnotations: z.record(ChangeAnnotationIdentifierSchema, ChangeAnnotationSchema).optional()
});
export const FileOperationPatternOptionsSchema = z.object({
  ignoreCase: z.boolean().optional()
});
export const FileOperationPatternSchema = z.object({
  glob: z.string(),
  matches: FileOperationPatternKindSchema.optional(),
  options: FileOperationPatternOptionsSchema.optional()
});
export const FileOperationFilterSchema = z.object({
  scheme: z.string().optional(),
  pattern: FileOperationPatternSchema
});
export const FileOperationRegistrationOptionsSchema = z.object({
  filters: z.array(FileOperationFilterSchema)
});
export const FileRenameSchema = z.object({
  oldUri: z.string(),
  newUri: z.string()
});
export const RenameFilesParamsSchema = z.object({
  files: z.array(FileRenameSchema)
});
export const FileDeleteSchema = z.object({
  uri: z.string()
});
export const DeleteFilesParamsSchema = z.object({
  files: z.array(FileDeleteSchema)
});
export const MonikerParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional()
});
export const MonikerSchema = z.object({
  scheme: z.string(),
  identifier: z.string(),
  unique: UniquenessLevelSchema,
  kind: MonikerKindSchema.optional()
});
export const MonikerRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional()
});
export const TypeHierarchyPrepareParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  workDoneToken: ProgressTokenSchema.optional()
});
export const TypeHierarchyItemSchema = z.object({
  name: z.string(),
  kind: SymbolKindSchema,
  tags: z.array(SymbolTagSchema).optional(),
  detail: z.string().optional(),
  uri: z.string(),
  range: RangeSchema,
  selectionRange: RangeSchema,
  data: z.lazy(() => LSPAnySchema).optional()
});
export const TypeHierarchyRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  id: z.string().optional()
});
export const TypeHierarchySupertypesParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  item: TypeHierarchyItemSchema
});
export const TypeHierarchySubtypesParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  item: TypeHierarchyItemSchema
});
export const InlineValueContextSchema = z.object({
  frameId: z.number().int(),
  stoppedLocation: RangeSchema
});
export const InlineValueParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema,
  range: RangeSchema,
  context: InlineValueContextSchema
});
export const InlineValueRegistrationOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  id: z.string().optional()
});
export const InlayHintParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema,
  range: RangeSchema
});
export const MarkupContentSchema = z.object({
  kind: MarkupKindSchema,
  value: z.string()
});
export const CommandSchema = z.object({
  title: z.string(),
  tooltip: z.string().optional(),
  command: z.string(),
  arguments: z.array(z.lazy(() => LSPAnySchema)).optional()
});
export const InlayHintLabelPartSchema = z.object({
  value: z.string(),
  tooltip: z.union([z.string(), MarkupContentSchema]).optional(),
  location: LocationSchema.optional(),
  command: CommandSchema.optional()
});
export const InlayHintSchema = z.object({
  position: PositionSchema,
  label: z.union([z.string(), z.array(InlayHintLabelPartSchema)]),
  kind: InlayHintKindSchema.optional(),
  textEdits: z.array(TextEditSchema).optional(),
  tooltip: z.union([z.string(), MarkupContentSchema]).optional(),
  paddingLeft: z.boolean().optional(),
  paddingRight: z.boolean().optional(),
  data: z.lazy(() => LSPAnySchema).optional()
});
export const InlayHintRegistrationOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  resolveProvider: z.boolean().optional(),
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  id: z.string().optional()
});
export const DocumentDiagnosticParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema,
  identifier: z.string().optional(),
  previousResultId: z.string().optional()
});
export const CodeDescriptionSchema = z.object({
  href: z.string()
});
export const DiagnosticRelatedInformationSchema = z.object({
  location: LocationSchema,
  message: z.string()
});
export const DiagnosticSchema = z.object({
  range: RangeSchema,
  severity: DiagnosticSeveritySchema.optional(),
  code: z.union([z.number().int(), z.string()]).optional(),
  codeDescription: CodeDescriptionSchema.optional(),
  source: z.string().optional(),
  message: z.union([z.string(), MarkupContentSchema]),
  tags: z.array(DiagnosticTagSchema).optional(),
  relatedInformation: z.array(DiagnosticRelatedInformationSchema).optional(),
  data: z.lazy(() => LSPAnySchema).optional()
});
export const FullDocumentDiagnosticReportSchema = z.object({
  kind: z.literal('full'),
  resultId: z.string().optional(),
  items: z.array(DiagnosticSchema)
});
export const UnchangedDocumentDiagnosticReportSchema = z.object({
  kind: z.literal('unchanged'),
  resultId: z.string()
});
export const DocumentDiagnosticReportPartialResultSchema = z.object({
  relatedDocuments: z.record(
    z.string(),
    z.union([FullDocumentDiagnosticReportSchema, UnchangedDocumentDiagnosticReportSchema])
  )
});
export const DiagnosticServerCancellationDataSchema = z.object({
  retriggerRequest: z.boolean()
});
export const DiagnosticRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  identifier: z.string().optional(),
  interFileDependencies: z.boolean(),
  workspaceDiagnostics: z.boolean(),
  id: z.string().optional()
});
export const PreviousResultIdSchema = z.object({
  uri: z.string(),
  value: z.string()
});
export const WorkspaceDiagnosticParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  identifier: z.string().optional(),
  previousResultIds: z.array(PreviousResultIdSchema)
});
export const WorkspaceFullDocumentDiagnosticReportSchema = z.object({
  kind: z.literal('full'),
  resultId: z.string().optional(),
  items: z.array(DiagnosticSchema),
  uri: z.string(),
  version: z.union([z.number().int(), z.literal(null)])
});
export const WorkspaceUnchangedDocumentDiagnosticReportSchema = z.object({
  kind: z.literal('unchanged'),
  resultId: z.string(),
  uri: z.string(),
  version: z.union([z.number().int(), z.literal(null)])
});
export const WorkspaceDocumentDiagnosticReportSchema = z.union([
  WorkspaceFullDocumentDiagnosticReportSchema,
  WorkspaceUnchangedDocumentDiagnosticReportSchema
]);
export const WorkspaceDiagnosticReportSchema = z.object({
  items: z.array(WorkspaceDocumentDiagnosticReportSchema)
});
export const WorkspaceDiagnosticReportPartialResultSchema = z.object({
  items: z.array(WorkspaceDocumentDiagnosticReportSchema)
});
export const ExecutionSummarySchema = z.object({
  executionOrder: z.number().int().gte(0),
  success: z.boolean().optional()
});
export const NotebookCellSchema = z.object({
  kind: NotebookCellKindSchema,
  document: z.string(),
  metadata: LSPObjectSchema.optional(),
  executionSummary: ExecutionSummarySchema.optional()
});
export const NotebookDocumentSchema = z.object({
  uri: z.string(),
  notebookType: z.string(),
  version: z.number().int(),
  metadata: LSPObjectSchema.optional(),
  cells: z.array(NotebookCellSchema)
});
export const TextDocumentItemSchema = z.object({
  uri: z.string(),
  languageId: LanguageKindSchema,
  version: z.number().int(),
  text: z.string()
});
export const DidOpenNotebookDocumentParamsSchema = z.object({
  notebookDocument: NotebookDocumentSchema,
  cellTextDocuments: z.array(TextDocumentItemSchema)
});
export const NotebookCellLanguageSchema = z.object({
  language: z.string()
});
export const NotebookDocumentFilterWithNotebookSchema = z.object({
  notebook: z.union([z.string(), NotebookDocumentFilterSchema]),
  cells: z.array(NotebookCellLanguageSchema).optional()
});
export const NotebookDocumentFilterWithCellsSchema = z.object({
  notebook: z.union([z.string(), NotebookDocumentFilterSchema]).optional(),
  cells: z.array(NotebookCellLanguageSchema)
});
export const NotebookDocumentSyncRegistrationOptionsSchema = z.object({
  notebookSelector: z.array(
    z.union([NotebookDocumentFilterWithNotebookSchema, NotebookDocumentFilterWithCellsSchema])
  ),
  save: z.boolean().optional(),
  id: z.string().optional()
});
export const VersionedNotebookDocumentIdentifierSchema = z.object({
  version: z.number().int(),
  uri: z.string()
});
export const NotebookCellArrayChangeSchema = z.object({
  start: z.number().int().gte(0),
  deleteCount: z.number().int().gte(0),
  cells: z.array(NotebookCellSchema).optional()
});
export const NotebookDocumentCellChangeStructureSchema = z.object({
  array: NotebookCellArrayChangeSchema,
  didOpen: z.array(TextDocumentItemSchema).optional(),
  didClose: z.array(TextDocumentIdentifierSchema).optional()
});
export const VersionedTextDocumentIdentifierSchema = z.object({
  uri: z.string(),
  version: z.number().int()
});
export const TextDocumentContentChangePartialSchema = z.object({
  range: RangeSchema,
  rangeLength: z.number().int().gte(0).optional(),
  text: z.string()
});
export const TextDocumentContentChangeWholeDocumentSchema = z.object({
  text: z.string()
});
export const TextDocumentContentChangeEventSchema = z.union([
  TextDocumentContentChangePartialSchema,
  TextDocumentContentChangeWholeDocumentSchema
]);
export const NotebookDocumentCellContentChangesSchema = z.object({
  document: VersionedTextDocumentIdentifierSchema,
  changes: z.array(TextDocumentContentChangeEventSchema)
});
export const NotebookDocumentCellChangesSchema = z.object({
  structure: NotebookDocumentCellChangeStructureSchema.optional(),
  data: z.array(NotebookCellSchema).optional(),
  textContent: z.array(NotebookDocumentCellContentChangesSchema).optional()
});
export const NotebookDocumentChangeEventSchema = z.object({
  metadata: LSPObjectSchema.optional(),
  cells: NotebookDocumentCellChangesSchema.optional()
});
export const DidChangeNotebookDocumentParamsSchema = z.object({
  notebookDocument: VersionedNotebookDocumentIdentifierSchema,
  change: NotebookDocumentChangeEventSchema
});
export const NotebookDocumentIdentifierSchema = z.object({
  uri: z.string()
});
export const DidSaveNotebookDocumentParamsSchema = z.object({
  notebookDocument: NotebookDocumentIdentifierSchema
});
export const DidCloseNotebookDocumentParamsSchema = z.object({
  notebookDocument: NotebookDocumentIdentifierSchema,
  cellTextDocuments: z.array(TextDocumentIdentifierSchema)
});
export const SelectedCompletionInfoSchema = z.object({
  range: RangeSchema,
  text: z.string()
});
export const InlineCompletionContextSchema = z.object({
  triggerKind: InlineCompletionTriggerKindSchema,
  selectedCompletionInfo: SelectedCompletionInfoSchema.optional()
});
export const InlineCompletionParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  workDoneToken: ProgressTokenSchema.optional(),
  context: InlineCompletionContextSchema
});
export const InlineCompletionItemSchema = z.object({
  insertText: z.union([z.string(), StringValueSchema]),
  filterText: z.string().optional(),
  range: RangeSchema.optional(),
  command: CommandSchema.optional()
});
export const InlineCompletionListSchema = z.object({
  items: z.array(InlineCompletionItemSchema)
});
export const InlineCompletionRegistrationOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  id: z.string().optional()
});
export const TextDocumentContentParamsSchema = z.object({
  uri: z.string()
});
export const TextDocumentContentResultSchema = z.object({
  text: z.string()
});
export const TextDocumentContentRegistrationOptionsSchema = z.object({
  schemes: z.array(z.string()),
  id: z.string().optional()
});
export const TextDocumentContentRefreshParamsSchema = z.object({
  uri: z.string()
});
export const RegistrationSchema = z.object({
  id: z.string(),
  method: z.string(),
  registerOptions: z.lazy(() => LSPAnySchema).optional()
});
export const RegistrationParamsSchema = z.object({
  registrations: z.array(RegistrationSchema)
});
export const UnregistrationSchema = z.object({
  id: z.string(),
  method: z.string()
});
export const UnregistrationParamsSchema = z.object({
  unregisterations: z.array(UnregistrationSchema)
});
export const ClientInfoSchema = z.object({
  name: z.string(),
  version: z.string().optional()
});
export const ChangeAnnotationsSupportOptionsSchema = z.object({
  groupsOnLabel: z.boolean().optional()
});
export const WorkspaceEditClientCapabilitiesSchema = z.object({
  documentChanges: z.boolean().optional(),
  resourceOperations: z.array(ResourceOperationKindSchema).optional(),
  failureHandling: FailureHandlingKindSchema.optional(),
  normalizesLineEndings: z.boolean().optional(),
  changeAnnotationSupport: ChangeAnnotationsSupportOptionsSchema.optional(),
  metadataSupport: z.boolean().optional(),
  snippetEditSupport: z.boolean().optional()
});
export const DidChangeConfigurationClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional()
});
export const DidChangeWatchedFilesClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  relativePatternSupport: z.boolean().optional()
});
export const ClientSymbolKindOptionsSchema = z.object({
  valueSet: z.array(SymbolKindSchema).optional()
});
export const ClientSymbolTagOptionsSchema = z.object({
  valueSet: z.array(SymbolTagSchema)
});
export const ClientSymbolResolveOptionsSchema = z.object({
  properties: z.array(z.string())
});
export const WorkspaceSymbolClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  symbolKind: ClientSymbolKindOptionsSchema.optional(),
  tagSupport: ClientSymbolTagOptionsSchema.optional(),
  resolveSupport: ClientSymbolResolveOptionsSchema.optional()
});
export const ExecuteCommandClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional()
});
export const SemanticTokensWorkspaceClientCapabilitiesSchema = z.object({
  refreshSupport: z.boolean().optional()
});
export const CodeLensWorkspaceClientCapabilitiesSchema = z.object({
  refreshSupport: z.boolean().optional()
});
export const FileOperationClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  didCreate: z.boolean().optional(),
  willCreate: z.boolean().optional(),
  didRename: z.boolean().optional(),
  willRename: z.boolean().optional(),
  didDelete: z.boolean().optional(),
  willDelete: z.boolean().optional()
});
export const InlineValueWorkspaceClientCapabilitiesSchema = z.object({
  refreshSupport: z.boolean().optional()
});
export const InlayHintWorkspaceClientCapabilitiesSchema = z.object({
  refreshSupport: z.boolean().optional()
});
export const DiagnosticWorkspaceClientCapabilitiesSchema = z.object({
  refreshSupport: z.boolean().optional()
});
export const FoldingRangeWorkspaceClientCapabilitiesSchema = z.object({
  refreshSupport: z.boolean().optional()
});
export const TextDocumentContentClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional()
});
export const WorkspaceClientCapabilitiesSchema = z.object({
  applyEdit: z.boolean().optional(),
  workspaceEdit: WorkspaceEditClientCapabilitiesSchema.optional(),
  didChangeConfiguration: DidChangeConfigurationClientCapabilitiesSchema.optional(),
  didChangeWatchedFiles: DidChangeWatchedFilesClientCapabilitiesSchema.optional(),
  symbol: WorkspaceSymbolClientCapabilitiesSchema.optional(),
  executeCommand: ExecuteCommandClientCapabilitiesSchema.optional(),
  workspaceFolders: z.boolean().optional(),
  configuration: z.boolean().optional(),
  semanticTokens: SemanticTokensWorkspaceClientCapabilitiesSchema.optional(),
  codeLens: CodeLensWorkspaceClientCapabilitiesSchema.optional(),
  fileOperations: FileOperationClientCapabilitiesSchema.optional(),
  inlineValue: InlineValueWorkspaceClientCapabilitiesSchema.optional(),
  inlayHint: InlayHintWorkspaceClientCapabilitiesSchema.optional(),
  diagnostics: DiagnosticWorkspaceClientCapabilitiesSchema.optional(),
  foldingRange: FoldingRangeWorkspaceClientCapabilitiesSchema.optional(),
  textDocumentContent: TextDocumentContentClientCapabilitiesSchema.optional()
});
export const TextDocumentSyncClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  willSave: z.boolean().optional(),
  willSaveWaitUntil: z.boolean().optional(),
  didSave: z.boolean().optional()
});
export const TextDocumentFilterClientCapabilitiesSchema = z.object({
  relativePatternSupport: z.boolean().optional()
});
export const CompletionItemTagOptionsSchema = z.object({
  valueSet: z.array(CompletionItemTagSchema)
});
export const ClientCompletionItemResolveOptionsSchema = z.object({
  properties: z.array(z.string())
});
export const ClientCompletionItemInsertTextModeOptionsSchema = z.object({
  valueSet: z.array(InsertTextModeSchema)
});
export const ClientCompletionItemOptionsSchema = z.object({
  snippetSupport: z.boolean().optional(),
  commitCharactersSupport: z.boolean().optional(),
  documentationFormat: z.array(MarkupKindSchema).optional(),
  deprecatedSupport: z.boolean().optional(),
  preselectSupport: z.boolean().optional(),
  tagSupport: CompletionItemTagOptionsSchema.optional(),
  insertReplaceSupport: z.boolean().optional(),
  resolveSupport: ClientCompletionItemResolveOptionsSchema.optional(),
  insertTextModeSupport: ClientCompletionItemInsertTextModeOptionsSchema.optional(),
  labelDetailsSupport: z.boolean().optional()
});
export const ClientCompletionItemOptionsKindSchema = z.object({
  valueSet: z.array(CompletionItemKindSchema).optional()
});
export const CompletionListCapabilitiesSchema = z.object({
  itemDefaults: z.array(z.string()).optional(),
  applyKindSupport: z.boolean().optional()
});
export const CompletionClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  completionItem: ClientCompletionItemOptionsSchema.optional(),
  completionItemKind: ClientCompletionItemOptionsKindSchema.optional(),
  insertTextMode: InsertTextModeSchema.optional(),
  contextSupport: z.boolean().optional(),
  completionList: CompletionListCapabilitiesSchema.optional()
});
export const HoverClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  contentFormat: z.array(MarkupKindSchema).optional()
});
export const ClientSignatureParameterInformationOptionsSchema = z.object({
  labelOffsetSupport: z.boolean().optional()
});
export const ClientSignatureInformationOptionsSchema = z.object({
  documentationFormat: z.array(MarkupKindSchema).optional(),
  parameterInformation: ClientSignatureParameterInformationOptionsSchema.optional(),
  activeParameterSupport: z.boolean().optional(),
  noActiveParameterSupport: z.boolean().optional()
});
export const SignatureHelpClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  signatureInformation: ClientSignatureInformationOptionsSchema.optional(),
  contextSupport: z.boolean().optional()
});
export const DeclarationClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  linkSupport: z.boolean().optional()
});
export const DefinitionClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  linkSupport: z.boolean().optional()
});
export const TypeDefinitionClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  linkSupport: z.boolean().optional()
});
export const ImplementationClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  linkSupport: z.boolean().optional()
});
export const ReferenceClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional()
});
export const DocumentHighlightClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional()
});
export const DocumentSymbolClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  symbolKind: ClientSymbolKindOptionsSchema.optional(),
  hierarchicalDocumentSymbolSupport: z.boolean().optional(),
  tagSupport: ClientSymbolTagOptionsSchema.optional(),
  labelSupport: z.boolean().optional()
});
export const ClientCodeActionKindOptionsSchema = z.object({
  valueSet: z.array(CodeActionKindSchema)
});
export const ClientCodeActionLiteralOptionsSchema = z.object({
  codeActionKind: ClientCodeActionKindOptionsSchema
});
export const ClientCodeActionResolveOptionsSchema = z.object({
  properties: z.array(z.string())
});
export const CodeActionTagOptionsSchema = z.object({
  valueSet: z.array(CodeActionTagSchema)
});
export const CodeActionClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  codeActionLiteralSupport: ClientCodeActionLiteralOptionsSchema.optional(),
  isPreferredSupport: z.boolean().optional(),
  disabledSupport: z.boolean().optional(),
  dataSupport: z.boolean().optional(),
  resolveSupport: ClientCodeActionResolveOptionsSchema.optional(),
  honorsChangeAnnotations: z.boolean().optional(),
  documentationSupport: z.boolean().optional(),
  tagSupport: CodeActionTagOptionsSchema.optional()
});
export const ClientCodeLensResolveOptionsSchema = z.object({
  properties: z.array(z.string())
});
export const CodeLensClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  resolveSupport: ClientCodeLensResolveOptionsSchema.optional()
});
export const DocumentLinkClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  tooltipSupport: z.boolean().optional()
});
export const DocumentColorClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional()
});
export const DocumentFormattingClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional()
});
export const DocumentRangeFormattingClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  rangesSupport: z.boolean().optional()
});
export const DocumentOnTypeFormattingClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional()
});
export const RenameClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  prepareSupport: z.boolean().optional(),
  prepareSupportDefaultBehavior: PrepareSupportDefaultBehaviorSchema.optional(),
  honorsChangeAnnotations: z.boolean().optional()
});
export const ClientFoldingRangeKindOptionsSchema = z.object({
  valueSet: z.array(FoldingRangeKindSchema).optional()
});
export const ClientFoldingRangeOptionsSchema = z.object({
  collapsedText: z.boolean().optional()
});
export const FoldingRangeClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  rangeLimit: z.number().int().gte(0).optional(),
  lineFoldingOnly: z.boolean().optional(),
  foldingRangeKind: ClientFoldingRangeKindOptionsSchema.optional(),
  foldingRange: ClientFoldingRangeOptionsSchema.optional()
});
export const SelectionRangeClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional()
});
export const ClientDiagnosticsTagOptionsSchema = z.object({
  valueSet: z.array(DiagnosticTagSchema)
});
export const PublishDiagnosticsClientCapabilitiesSchema = z.object({
  relatedInformation: z.boolean().optional(),
  tagSupport: ClientDiagnosticsTagOptionsSchema.optional(),
  codeDescriptionSupport: z.boolean().optional(),
  dataSupport: z.boolean().optional(),
  versionSupport: z.boolean().optional()
});
export const CallHierarchyClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional()
});
export const ClientSemanticTokensRequestFullDeltaSchema = z.object({
  delta: z.boolean().optional()
});
export const ClientSemanticTokensRequestOptionsSchema = z.object({
  range: z.union([z.boolean(), z.object({})]).optional(),
  full: z.union([z.boolean(), ClientSemanticTokensRequestFullDeltaSchema]).optional()
});
export const SemanticTokensClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  requests: ClientSemanticTokensRequestOptionsSchema,
  tokenTypes: z.array(z.string()),
  tokenModifiers: z.array(z.string()),
  formats: z.array(TokenFormatSchema),
  overlappingTokenSupport: z.boolean().optional(),
  multilineTokenSupport: z.boolean().optional(),
  serverCancelSupport: z.boolean().optional(),
  augmentsSyntaxTokens: z.boolean().optional()
});
export const LinkedEditingRangeClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional()
});
export const MonikerClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional()
});
export const TypeHierarchyClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional()
});
export const InlineValueClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional()
});
export const ClientInlayHintResolveOptionsSchema = z.object({
  properties: z.array(z.string())
});
export const InlayHintClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  resolveSupport: ClientInlayHintResolveOptionsSchema.optional()
});
export const DiagnosticClientCapabilitiesSchema = z.object({
  relatedInformation: z.boolean().optional(),
  tagSupport: ClientDiagnosticsTagOptionsSchema.optional(),
  codeDescriptionSupport: z.boolean().optional(),
  dataSupport: z.boolean().optional(),
  dynamicRegistration: z.boolean().optional(),
  relatedDocumentSupport: z.boolean().optional(),
  markupMessageSupport: z.boolean().optional()
});
export const InlineCompletionClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional()
});
export const TextDocumentClientCapabilitiesSchema = z.object({
  synchronization: TextDocumentSyncClientCapabilitiesSchema.optional(),
  filters: TextDocumentFilterClientCapabilitiesSchema.optional(),
  completion: CompletionClientCapabilitiesSchema.optional(),
  hover: HoverClientCapabilitiesSchema.optional(),
  signatureHelp: SignatureHelpClientCapabilitiesSchema.optional(),
  declaration: DeclarationClientCapabilitiesSchema.optional(),
  definition: DefinitionClientCapabilitiesSchema.optional(),
  typeDefinition: TypeDefinitionClientCapabilitiesSchema.optional(),
  implementation: ImplementationClientCapabilitiesSchema.optional(),
  references: ReferenceClientCapabilitiesSchema.optional(),
  documentHighlight: DocumentHighlightClientCapabilitiesSchema.optional(),
  documentSymbol: DocumentSymbolClientCapabilitiesSchema.optional(),
  codeAction: CodeActionClientCapabilitiesSchema.optional(),
  codeLens: CodeLensClientCapabilitiesSchema.optional(),
  documentLink: DocumentLinkClientCapabilitiesSchema.optional(),
  colorProvider: DocumentColorClientCapabilitiesSchema.optional(),
  formatting: DocumentFormattingClientCapabilitiesSchema.optional(),
  rangeFormatting: DocumentRangeFormattingClientCapabilitiesSchema.optional(),
  onTypeFormatting: DocumentOnTypeFormattingClientCapabilitiesSchema.optional(),
  rename: RenameClientCapabilitiesSchema.optional(),
  foldingRange: FoldingRangeClientCapabilitiesSchema.optional(),
  selectionRange: SelectionRangeClientCapabilitiesSchema.optional(),
  publishDiagnostics: PublishDiagnosticsClientCapabilitiesSchema.optional(),
  callHierarchy: CallHierarchyClientCapabilitiesSchema.optional(),
  semanticTokens: SemanticTokensClientCapabilitiesSchema.optional(),
  linkedEditingRange: LinkedEditingRangeClientCapabilitiesSchema.optional(),
  moniker: MonikerClientCapabilitiesSchema.optional(),
  typeHierarchy: TypeHierarchyClientCapabilitiesSchema.optional(),
  inlineValue: InlineValueClientCapabilitiesSchema.optional(),
  inlayHint: InlayHintClientCapabilitiesSchema.optional(),
  diagnostic: DiagnosticClientCapabilitiesSchema.optional(),
  inlineCompletion: InlineCompletionClientCapabilitiesSchema.optional()
});
export const NotebookDocumentSyncClientCapabilitiesSchema = z.object({
  dynamicRegistration: z.boolean().optional(),
  executionSummarySupport: z.boolean().optional()
});
export const NotebookDocumentClientCapabilitiesSchema = z.object({
  synchronization: NotebookDocumentSyncClientCapabilitiesSchema
});
export const ClientShowMessageActionItemOptionsSchema = z.object({
  additionalPropertiesSupport: z.boolean().optional()
});
export const ShowMessageRequestClientCapabilitiesSchema = z.object({
  messageActionItem: ClientShowMessageActionItemOptionsSchema.optional()
});
export const ShowDocumentClientCapabilitiesSchema = z.object({
  support: z.boolean()
});
export const WindowClientCapabilitiesSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  showMessage: ShowMessageRequestClientCapabilitiesSchema.optional(),
  showDocument: ShowDocumentClientCapabilitiesSchema.optional()
});
export const StaleRequestSupportOptionsSchema = z.object({
  cancel: z.boolean(),
  retryOnContentModified: z.array(z.string())
});
export const RegularExpressionEngineKindSchema = z.string();
export const RegularExpressionsClientCapabilitiesSchema = z.object({
  engine: RegularExpressionEngineKindSchema,
  version: z.string().optional()
});
export const MarkdownClientCapabilitiesSchema = z.object({
  parser: z.string(),
  version: z.string().optional(),
  allowedTags: z.array(z.string()).optional()
});
export const GeneralClientCapabilitiesSchema = z.object({
  staleRequestSupport: StaleRequestSupportOptionsSchema.optional(),
  regularExpressions: RegularExpressionsClientCapabilitiesSchema.optional(),
  markdown: MarkdownClientCapabilitiesSchema.optional(),
  positionEncodings: z.array(PositionEncodingKindSchema).optional()
});
export const ClientCapabilitiesSchema = z.object({
  workspace: WorkspaceClientCapabilitiesSchema.optional(),
  textDocument: TextDocumentClientCapabilitiesSchema.optional(),
  notebookDocument: NotebookDocumentClientCapabilitiesSchema.optional(),
  window: WindowClientCapabilitiesSchema.optional(),
  general: GeneralClientCapabilitiesSchema.optional(),
  experimental: z.lazy(() => LSPAnySchema).optional()
});
export const InitializeParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  processId: z.union([z.number().int(), z.literal(null)]),
  clientInfo: ClientInfoSchema.optional(),
  locale: z.string().optional(),
  rootPath: z.union([z.string(), z.literal(null)]).optional(),
  rootUri: z.union([z.string(), z.literal(null)]),
  capabilities: ClientCapabilitiesSchema,
  initializationOptions: z.lazy(() => LSPAnySchema).optional(),
  trace: TraceValueSchema.optional(),
  workspaceFolders: z.union([z.array(WorkspaceFolderSchema), z.literal(null)]).optional()
});
export const SaveOptionsSchema = z.object({
  includeText: z.boolean().optional()
});
export const TextDocumentSyncOptionsSchema = z.object({
  openClose: z.boolean().optional(),
  change: TextDocumentSyncKindSchema.optional(),
  willSave: z.boolean().optional(),
  willSaveWaitUntil: z.boolean().optional(),
  save: z.union([z.boolean(), SaveOptionsSchema]).optional()
});
export const NotebookDocumentSyncOptionsSchema = z.object({
  notebookSelector: z.array(
    z.union([NotebookDocumentFilterWithNotebookSchema, NotebookDocumentFilterWithCellsSchema])
  ),
  save: z.boolean().optional()
});
export const ServerCompletionItemOptionsSchema = z.object({
  labelDetailsSupport: z.boolean().optional()
});
export const CompletionOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  triggerCharacters: z.array(z.string()).optional(),
  allCommitCharacters: z.array(z.string()).optional(),
  resolveProvider: z.boolean().optional(),
  completionItem: ServerCompletionItemOptionsSchema.optional()
});
export const HoverOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const SignatureHelpOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  triggerCharacters: z.array(z.string()).optional(),
  retriggerCharacters: z.array(z.string()).optional()
});
export const DeclarationOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const DefinitionOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const TypeDefinitionOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const ImplementationOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const ReferenceOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const DocumentHighlightOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const DocumentSymbolOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  label: z.string().optional()
});
export const CodeActionKindDocumentationSchema = z.object({
  kind: CodeActionKindSchema,
  command: CommandSchema
});
export const CodeActionOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  codeActionKinds: z.array(CodeActionKindSchema).optional(),
  documentation: z.array(CodeActionKindDocumentationSchema).optional(),
  resolveProvider: z.boolean().optional()
});
export const CodeLensOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  resolveProvider: z.boolean().optional()
});
export const DocumentLinkOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  resolveProvider: z.boolean().optional()
});
export const DocumentColorOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const WorkspaceSymbolOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  resolveProvider: z.boolean().optional()
});
export const DocumentFormattingOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const DocumentRangeFormattingOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  rangesSupport: z.boolean().optional()
});
export const DocumentOnTypeFormattingOptionsSchema = z.object({
  firstTriggerCharacter: z.string(),
  moreTriggerCharacter: z.array(z.string()).optional()
});
export const RenameOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  prepareProvider: z.boolean().optional()
});
export const FoldingRangeOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const SelectionRangeOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const ExecuteCommandOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  commands: z.array(z.string())
});
export const CallHierarchyOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const LinkedEditingRangeOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const SemanticTokensOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  legend: SemanticTokensLegendSchema,
  range: z.union([z.boolean(), z.object({})]).optional(),
  full: z.union([z.boolean(), SemanticTokensFullDeltaSchema]).optional()
});
export const MonikerOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const TypeHierarchyOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const InlineValueOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const InlayHintOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  resolveProvider: z.boolean().optional()
});
export const DiagnosticOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  identifier: z.string().optional(),
  interFileDependencies: z.boolean(),
  workspaceDiagnostics: z.boolean()
});
export const InlineCompletionOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional()
});
export const WorkspaceFoldersServerCapabilitiesSchema = z.object({
  supported: z.boolean().optional(),
  changeNotifications: z.union([z.string(), z.boolean()]).optional()
});
export const FileOperationOptionsSchema = z.object({
  didCreate: FileOperationRegistrationOptionsSchema.optional(),
  willCreate: FileOperationRegistrationOptionsSchema.optional(),
  didRename: FileOperationRegistrationOptionsSchema.optional(),
  willRename: FileOperationRegistrationOptionsSchema.optional(),
  didDelete: FileOperationRegistrationOptionsSchema.optional(),
  willDelete: FileOperationRegistrationOptionsSchema.optional()
});
export const TextDocumentContentOptionsSchema = z.object({
  schemes: z.array(z.string())
});
export const WorkspaceOptionsSchema = z.object({
  workspaceFolders: WorkspaceFoldersServerCapabilitiesSchema.optional(),
  fileOperations: FileOperationOptionsSchema.optional(),
  textDocumentContent: z
    .union([TextDocumentContentOptionsSchema, TextDocumentContentRegistrationOptionsSchema])
    .optional()
});
export const ServerCapabilitiesSchema = z.object({
  positionEncoding: PositionEncodingKindSchema.optional(),
  textDocumentSync: z.union([TextDocumentSyncOptionsSchema, TextDocumentSyncKindSchema]).optional(),
  notebookDocumentSync: z
    .union([NotebookDocumentSyncOptionsSchema, NotebookDocumentSyncRegistrationOptionsSchema])
    .optional(),
  completionProvider: CompletionOptionsSchema.optional(),
  hoverProvider: z.union([z.boolean(), HoverOptionsSchema]).optional(),
  signatureHelpProvider: SignatureHelpOptionsSchema.optional(),
  declarationProvider: z
    .union([z.boolean(), DeclarationOptionsSchema, DeclarationRegistrationOptionsSchema])
    .optional(),
  definitionProvider: z.union([z.boolean(), DefinitionOptionsSchema]).optional(),
  typeDefinitionProvider: z
    .union([z.boolean(), TypeDefinitionOptionsSchema, TypeDefinitionRegistrationOptionsSchema])
    .optional(),
  implementationProvider: z
    .union([z.boolean(), ImplementationOptionsSchema, ImplementationRegistrationOptionsSchema])
    .optional(),
  referencesProvider: z.union([z.boolean(), ReferenceOptionsSchema]).optional(),
  documentHighlightProvider: z.union([z.boolean(), DocumentHighlightOptionsSchema]).optional(),
  documentSymbolProvider: z.union([z.boolean(), DocumentSymbolOptionsSchema]).optional(),
  codeActionProvider: z.union([z.boolean(), CodeActionOptionsSchema]).optional(),
  codeLensProvider: CodeLensOptionsSchema.optional(),
  documentLinkProvider: DocumentLinkOptionsSchema.optional(),
  colorProvider: z
    .union([z.boolean(), DocumentColorOptionsSchema, DocumentColorRegistrationOptionsSchema])
    .optional(),
  workspaceSymbolProvider: z.union([z.boolean(), WorkspaceSymbolOptionsSchema]).optional(),
  documentFormattingProvider: z.union([z.boolean(), DocumentFormattingOptionsSchema]).optional(),
  documentRangeFormattingProvider: z
    .union([z.boolean(), DocumentRangeFormattingOptionsSchema])
    .optional(),
  documentOnTypeFormattingProvider: DocumentOnTypeFormattingOptionsSchema.optional(),
  renameProvider: z.union([z.boolean(), RenameOptionsSchema]).optional(),
  foldingRangeProvider: z
    .union([z.boolean(), FoldingRangeOptionsSchema, FoldingRangeRegistrationOptionsSchema])
    .optional(),
  selectionRangeProvider: z
    .union([z.boolean(), SelectionRangeOptionsSchema, SelectionRangeRegistrationOptionsSchema])
    .optional(),
  executeCommandProvider: ExecuteCommandOptionsSchema.optional(),
  callHierarchyProvider: z
    .union([z.boolean(), CallHierarchyOptionsSchema, CallHierarchyRegistrationOptionsSchema])
    .optional(),
  linkedEditingRangeProvider: z
    .union([
      z.boolean(),
      LinkedEditingRangeOptionsSchema,
      LinkedEditingRangeRegistrationOptionsSchema
    ])
    .optional(),
  semanticTokensProvider: z
    .union([SemanticTokensOptionsSchema, SemanticTokensRegistrationOptionsSchema])
    .optional(),
  monikerProvider: z
    .union([z.boolean(), MonikerOptionsSchema, MonikerRegistrationOptionsSchema])
    .optional(),
  typeHierarchyProvider: z
    .union([z.boolean(), TypeHierarchyOptionsSchema, TypeHierarchyRegistrationOptionsSchema])
    .optional(),
  inlineValueProvider: z
    .union([z.boolean(), InlineValueOptionsSchema, InlineValueRegistrationOptionsSchema])
    .optional(),
  inlayHintProvider: z
    .union([z.boolean(), InlayHintOptionsSchema, InlayHintRegistrationOptionsSchema])
    .optional(),
  diagnosticProvider: z
    .union([DiagnosticOptionsSchema, DiagnosticRegistrationOptionsSchema])
    .optional(),
  inlineCompletionProvider: z.union([z.boolean(), InlineCompletionOptionsSchema]).optional(),
  workspace: WorkspaceOptionsSchema.optional(),
  experimental: z.lazy(() => LSPAnySchema).optional()
});
export const ServerInfoSchema = z.object({
  name: z.string(),
  version: z.string().optional()
});
export const InitializeResultSchema = z.object({
  capabilities: ServerCapabilitiesSchema,
  serverInfo: ServerInfoSchema.optional()
});
export const InitializeErrorSchema = z.object({
  retry: z.boolean()
});
export const InitializedParamsSchema = z.object({});
export const DidChangeConfigurationParamsSchema = z.object({
  settings: z.lazy(() => LSPAnySchema)
});
export const DidChangeConfigurationRegistrationOptionsSchema = z.object({
  section: z.union([z.string(), z.array(z.string())]).optional()
});
export const ShowMessageParamsSchema = z.object({
  type: MessageTypeSchema,
  message: z.string()
});
export const MessageActionItemSchema = z.object({
  title: z.string()
});
export const ShowMessageRequestParamsSchema = z.object({
  type: MessageTypeSchema,
  message: z.string(),
  actions: z.array(MessageActionItemSchema).optional()
});
export const LogMessageParamsSchema = z.object({
  type: MessageTypeSchema,
  message: z.string()
});
export const DidOpenTextDocumentParamsSchema = z.object({
  textDocument: TextDocumentItemSchema
});
export const DidChangeTextDocumentParamsSchema = z.object({
  textDocument: VersionedTextDocumentIdentifierSchema,
  contentChanges: z.array(TextDocumentContentChangeEventSchema)
});
export const TextDocumentChangeRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  syncKind: TextDocumentSyncKindSchema
});
export const DidCloseTextDocumentParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema
});
export const DidSaveTextDocumentParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  text: z.string().optional()
});
export const TextDocumentSaveRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  includeText: z.boolean().optional()
});
export const WillSaveTextDocumentParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  reason: TextDocumentSaveReasonSchema
});
export const FileEventSchema = z.object({
  uri: z.string(),
  type: FileChangeTypeSchema
});
export const DidChangeWatchedFilesParamsSchema = z.object({
  changes: z.array(FileEventSchema)
});
export const FileSystemWatcherSchema = z.object({
  globPattern: GlobPatternSchema,
  kind: WatchKindSchema.optional()
});
export const DidChangeWatchedFilesRegistrationOptionsSchema = z.object({
  watchers: z.array(FileSystemWatcherSchema)
});
export const PublishDiagnosticsParamsSchema = z.object({
  uri: z.string(),
  version: z.number().int().optional(),
  diagnostics: z.array(DiagnosticSchema)
});
export const CompletionContextSchema = z.object({
  triggerKind: CompletionTriggerKindSchema,
  triggerCharacter: z.string().optional()
});
export const CompletionParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  context: CompletionContextSchema.optional()
});
export const CompletionItemLabelDetailsSchema = z.object({
  detail: z.string().optional(),
  description: z.string().optional()
});
export const InsertReplaceEditSchema = z.object({
  newText: z.string(),
  insert: RangeSchema,
  replace: RangeSchema
});
export const CompletionItemSchema = z.object({
  label: z.string(),
  labelDetails: CompletionItemLabelDetailsSchema.optional(),
  kind: CompletionItemKindSchema.optional(),
  tags: z.array(CompletionItemTagSchema).optional(),
  detail: z.string().optional(),
  documentation: z.union([z.string(), MarkupContentSchema]).optional(),
  deprecated: z.boolean().optional(),
  preselect: z.boolean().optional(),
  sortText: z.string().optional(),
  filterText: z.string().optional(),
  insertText: z.string().optional(),
  insertTextFormat: InsertTextFormatSchema.optional(),
  insertTextMode: InsertTextModeSchema.optional(),
  textEdit: z.union([TextEditSchema, InsertReplaceEditSchema]).optional(),
  textEditText: z.string().optional(),
  additionalTextEdits: z.array(TextEditSchema).optional(),
  commitCharacters: z.array(z.string()).optional(),
  command: CommandSchema.optional(),
  data: z.lazy(() => LSPAnySchema).optional()
});
export const EditRangeWithInsertReplaceSchema = z.object({
  insert: RangeSchema,
  replace: RangeSchema
});
export const CompletionItemDefaultsSchema = z.object({
  commitCharacters: z.array(z.string()).optional(),
  editRange: z.union([RangeSchema, EditRangeWithInsertReplaceSchema]).optional(),
  insertTextFormat: InsertTextFormatSchema.optional(),
  insertTextMode: InsertTextModeSchema.optional(),
  data: z.lazy(() => LSPAnySchema).optional()
});
export const CompletionItemApplyKindsSchema = z.object({
  commitCharacters: ApplyKindSchema.optional(),
  data: ApplyKindSchema.optional()
});
export const CompletionListSchema = z.object({
  isIncomplete: z.boolean(),
  itemDefaults: CompletionItemDefaultsSchema.optional(),
  applyKind: CompletionItemApplyKindsSchema.optional(),
  items: z.array(CompletionItemSchema)
});
export const CompletionRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  triggerCharacters: z.array(z.string()).optional(),
  allCommitCharacters: z.array(z.string()).optional(),
  resolveProvider: z.boolean().optional(),
  completionItem: ServerCompletionItemOptionsSchema.optional()
});
export const HoverParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  workDoneToken: ProgressTokenSchema.optional()
});
export const MarkedStringWithLanguageSchema = z.object({
  language: z.string(),
  value: z.string()
});
export const MarkedStringSchema = z.union([z.string(), MarkedStringWithLanguageSchema]);
export const HoverSchema = z.object({
  contents: z.union([MarkupContentSchema, MarkedStringSchema, z.array(MarkedStringSchema)]),
  range: RangeSchema.optional()
});
export const HoverRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional()
});
export const ParameterInformationSchema = z.object({
  label: z.union([z.string(), z.tuple([z.number().int().gte(0), z.number().int().gte(0)])]),
  documentation: z.union([z.string(), MarkupContentSchema]).optional()
});
export const SignatureInformationSchema = z.object({
  label: z.string(),
  documentation: z.union([z.string(), MarkupContentSchema]).optional(),
  parameters: z.array(ParameterInformationSchema).optional(),
  activeParameter: z.union([z.number().int().gte(0), z.literal(null)]).optional()
});
export const SignatureHelpSchema = z.object({
  signatures: z.array(SignatureInformationSchema),
  activeSignature: z.number().int().gte(0).optional(),
  activeParameter: z.union([z.number().int().gte(0), z.literal(null)]).optional()
});
export const SignatureHelpContextSchema = z.object({
  triggerKind: SignatureHelpTriggerKindSchema,
  triggerCharacter: z.string().optional(),
  isRetrigger: z.boolean(),
  activeSignatureHelp: SignatureHelpSchema.optional()
});
export const SignatureHelpParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  workDoneToken: ProgressTokenSchema.optional(),
  context: SignatureHelpContextSchema.optional()
});
export const SignatureHelpRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  triggerCharacters: z.array(z.string()).optional(),
  retriggerCharacters: z.array(z.string()).optional()
});
export const DefinitionParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional()
});
export const DefinitionRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional()
});
export const ReferenceContextSchema = z.object({
  includeDeclaration: z.boolean()
});
export const ReferenceParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  context: ReferenceContextSchema
});
export const ReferenceRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional()
});
export const DocumentHighlightParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional()
});
export const DocumentHighlightSchema = z.object({
  range: RangeSchema,
  kind: DocumentHighlightKindSchema.optional()
});
export const DocumentHighlightRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional()
});
export const DocumentSymbolParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema
});
export const SymbolInformationSchema = z.object({
  name: z.string(),
  kind: SymbolKindSchema,
  tags: z.array(SymbolTagSchema).optional(),
  containerName: z.string().optional(),
  deprecated: z.boolean().optional(),
  location: LocationSchema
});
type _DocumentSymbol = {
  name: string;
  detail?: string | undefined;
  kind: z.infer<typeof SymbolKindSchema>;
  tags?: z.infer<typeof SymbolTagSchema>[] | undefined;
  deprecated?: boolean | undefined;
  range: z.infer<typeof RangeSchema>;
  selectionRange: z.infer<typeof RangeSchema>;
  children?: _DocumentSymbol[] | undefined;
};
export const DocumentSymbolSchema: z.ZodType<_DocumentSymbol> = z.object({
  name: z.string(),
  detail: z.string().optional(),
  kind: SymbolKindSchema,
  tags: z.array(SymbolTagSchema).optional(),
  deprecated: z.boolean().optional(),
  range: RangeSchema,
  selectionRange: RangeSchema,
  children: z.array(z.lazy(() => DocumentSymbolSchema)).optional()
});
export const DocumentSymbolRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  label: z.string().optional()
});
export const CodeActionContextSchema = z.object({
  diagnostics: z.array(DiagnosticSchema),
  only: z.array(CodeActionKindSchema).optional(),
  triggerKind: CodeActionTriggerKindSchema.optional()
});
export const CodeActionParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema,
  range: RangeSchema,
  context: CodeActionContextSchema
});
export const CodeActionDisabledSchema = z.object({
  reason: z.string()
});
export const CodeActionSchema = z.object({
  title: z.string(),
  kind: CodeActionKindSchema.optional(),
  diagnostics: z.array(DiagnosticSchema).optional(),
  isPreferred: z.boolean().optional(),
  disabled: CodeActionDisabledSchema.optional(),
  edit: WorkspaceEditSchema.optional(),
  command: CommandSchema.optional(),
  data: z.lazy(() => LSPAnySchema).optional(),
  tags: z.array(CodeActionTagSchema).optional()
});
export const CodeActionRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  codeActionKinds: z.array(CodeActionKindSchema).optional(),
  documentation: z.array(CodeActionKindDocumentationSchema).optional(),
  resolveProvider: z.boolean().optional()
});
export const WorkspaceSymbolParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  query: z.string()
});
export const LocationUriOnlySchema = z.object({
  uri: z.string()
});
export const WorkspaceSymbolSchema = z.object({
  name: z.string(),
  kind: SymbolKindSchema,
  tags: z.array(SymbolTagSchema).optional(),
  containerName: z.string().optional(),
  location: z.union([LocationSchema, LocationUriOnlySchema]),
  data: z.lazy(() => LSPAnySchema).optional()
});
export const WorkspaceSymbolRegistrationOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  resolveProvider: z.boolean().optional()
});
export const CodeLensParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema
});
export const CodeLensSchema = z.object({
  range: RangeSchema,
  command: CommandSchema.optional(),
  data: z.lazy(() => LSPAnySchema).optional()
});
export const CodeLensRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  resolveProvider: z.boolean().optional()
});
export const DocumentLinkParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  partialResultToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema
});
export const DocumentLinkSchema = z.object({
  range: RangeSchema,
  target: z.string().optional(),
  tooltip: z.string().optional(),
  data: z.lazy(() => LSPAnySchema).optional()
});
export const DocumentLinkRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  resolveProvider: z.boolean().optional()
});
export const FormattingOptionsSchema = z.object({
  tabSize: z.number().int().gte(0),
  insertSpaces: z.boolean(),
  trimTrailingWhitespace: z.boolean().optional(),
  insertFinalNewline: z.boolean().optional(),
  trimFinalNewlines: z.boolean().optional()
});
export const DocumentFormattingParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema,
  options: FormattingOptionsSchema
});
export const DocumentFormattingRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional()
});
export const DocumentRangeFormattingParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema,
  range: RangeSchema,
  options: FormattingOptionsSchema
});
export const DocumentRangeFormattingRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  rangesSupport: z.boolean().optional()
});
export const DocumentRangesFormattingParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  textDocument: TextDocumentIdentifierSchema,
  ranges: z.array(RangeSchema),
  options: FormattingOptionsSchema
});
export const DocumentOnTypeFormattingParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  ch: z.string(),
  options: FormattingOptionsSchema
});
export const DocumentOnTypeFormattingRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  firstTriggerCharacter: z.string(),
  moreTriggerCharacter: z.array(z.string()).optional()
});
export const RenameParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  workDoneToken: ProgressTokenSchema.optional(),
  newName: z.string()
});
export const RenameRegistrationOptionsSchema = z.object({
  documentSelector: z.union([DocumentSelectorSchema, z.literal(null)]),
  workDoneProgress: z.boolean().optional(),
  prepareProvider: z.boolean().optional()
});
export const PrepareRenameParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema,
  workDoneToken: ProgressTokenSchema.optional()
});
export const ExecuteCommandParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  command: z.string(),
  arguments: z.array(z.lazy(() => LSPAnySchema)).optional()
});
export const ExecuteCommandRegistrationOptionsSchema = z.object({
  workDoneProgress: z.boolean().optional(),
  commands: z.array(z.string())
});
export const WorkspaceEditMetadataSchema = z.object({
  isRefactoring: z.boolean().optional()
});
export const ApplyWorkspaceEditParamsSchema = z.object({
  label: z.string().optional(),
  edit: WorkspaceEditSchema,
  metadata: WorkspaceEditMetadataSchema.optional()
});
export const ApplyWorkspaceEditResultSchema = z.object({
  applied: z.boolean(),
  failureReason: z.string().optional(),
  failedChange: z.number().int().gte(0).optional()
});
export const WorkDoneProgressBeginSchema = z.object({
  kind: z.literal('begin'),
  title: z.string(),
  cancellable: z.boolean().optional(),
  message: z.string().optional(),
  percentage: z.number().int().gte(0).optional()
});
export const WorkDoneProgressReportSchema = z.object({
  kind: z.literal('report'),
  cancellable: z.boolean().optional(),
  message: z.string().optional(),
  percentage: z.number().int().gte(0).optional()
});
export const WorkDoneProgressEndSchema = z.object({
  kind: z.literal('end'),
  message: z.string().optional()
});
export const SetTraceParamsSchema = z.object({
  value: TraceValueSchema
});
export const LogTraceParamsSchema = z.object({
  message: z.string(),
  verbose: z.string().optional()
});
export const CancelParamsSchema = z.object({
  id: z.union([z.number().int(), z.string()])
});
export const ProgressParamsSchema = z.object({
  token: ProgressTokenSchema,
  value: z.lazy(() => LSPAnySchema)
});
export const TextDocumentPositionParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  position: PositionSchema
});
export const WorkDoneProgressParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional()
});
export const PartialResultParamsSchema = z.object({
  partialResultToken: ProgressTokenSchema.optional()
});
export const LocationLinkSchema = z.object({
  originSelectionRange: RangeSchema.optional(),
  targetUri: z.string(),
  targetRange: RangeSchema,
  targetSelectionRange: RangeSchema
});
export const StaticRegistrationOptionsSchema = z.object({
  id: z.string().optional()
});
export const InlineValueTextSchema = z.object({
  range: RangeSchema,
  text: z.string()
});
export const InlineValueVariableLookupSchema = z.object({
  range: RangeSchema,
  variableName: z.string().optional(),
  caseSensitiveLookup: z.boolean()
});
export const InlineValueEvaluatableExpressionSchema = z.object({
  range: RangeSchema,
  expression: z.string().optional()
});
export const RelatedFullDocumentDiagnosticReportSchema = z.object({
  kind: z.literal('full'),
  resultId: z.string().optional(),
  items: z.array(DiagnosticSchema),
  relatedDocuments: z
    .record(
      z.string(),
      z.union([FullDocumentDiagnosticReportSchema, UnchangedDocumentDiagnosticReportSchema])
    )
    .optional()
});
export const RelatedUnchangedDocumentDiagnosticReportSchema = z.object({
  kind: z.literal('unchanged'),
  resultId: z.string(),
  relatedDocuments: z
    .record(
      z.string(),
      z.union([FullDocumentDiagnosticReportSchema, UnchangedDocumentDiagnosticReportSchema])
    )
    .optional()
});
export const _InitializeParamsSchema = z.object({
  workDoneToken: ProgressTokenSchema.optional(),
  processId: z.union([z.number().int(), z.literal(null)]),
  clientInfo: ClientInfoSchema.optional(),
  locale: z.string().optional(),
  rootPath: z.union([z.string(), z.literal(null)]).optional(),
  rootUri: z.union([z.string(), z.literal(null)]),
  capabilities: ClientCapabilitiesSchema,
  initializationOptions: z.lazy(() => LSPAnySchema).optional(),
  trace: TraceValueSchema.optional()
});
export const WorkspaceFoldersInitializeParamsSchema = z.object({
  workspaceFolders: z.union([z.array(WorkspaceFolderSchema), z.literal(null)]).optional()
});
export const BaseSymbolInformationSchema = z.object({
  name: z.string(),
  kind: SymbolKindSchema,
  tags: z.array(SymbolTagSchema).optional(),
  containerName: z.string().optional()
});
export const PrepareRenamePlaceholderSchema = z.object({
  range: RangeSchema,
  placeholder: z.string()
});
export const PrepareRenameDefaultBehaviorSchema = z.object({
  defaultBehavior: z.boolean()
});
export const ResourceOperationSchema = z.object({
  kind: z.string(),
  annotationId: ChangeAnnotationIdentifierSchema.optional()
});
export const DiagnosticsCapabilitiesSchema = z.object({
  relatedInformation: z.boolean().optional(),
  tagSupport: ClientDiagnosticsTagOptionsSchema.optional(),
  codeDescriptionSupport: z.boolean().optional(),
  dataSupport: z.boolean().optional()
});
export const DefinitionSchema = z.union([LocationSchema, z.array(LocationSchema)]);
export const DefinitionLinkSchema = LocationLinkSchema;
export const DeclarationSchema = z.union([LocationSchema, z.array(LocationSchema)]);
export const DeclarationLinkSchema = LocationLinkSchema;
export const InlineValueSchema = z.union([
  InlineValueTextSchema,
  InlineValueVariableLookupSchema,
  InlineValueEvaluatableExpressionSchema
]);
export const DocumentDiagnosticReportSchema = z.union([
  RelatedFullDocumentDiagnosticReportSchema,
  RelatedUnchangedDocumentDiagnosticReportSchema
]);
export const PrepareRenameResultSchema = z.union([
  RangeSchema,
  PrepareRenamePlaceholderSchema,
  PrepareRenameDefaultBehaviorSchema
]);

export const TextDocumentImplementationResultSchema: z.ZodType<unknown> = z.union([
  DefinitionSchema,
  z.array(DefinitionLinkSchema),
  z.literal(null)
]);
export const TextDocumentTypeDefinitionResultSchema: z.ZodType<unknown> = z.union([
  DefinitionSchema,
  z.array(DefinitionLinkSchema),
  z.literal(null)
]);
export const TextDocumentDocumentColorResultSchema: z.ZodType<unknown> =
  z.array(ColorInformationSchema);
export const TextDocumentColorPresentationResultSchema: z.ZodType<unknown> =
  z.array(ColorPresentationSchema);
export const TextDocumentFoldingRangeResultSchema: z.ZodType<unknown> = z.union([
  z.array(FoldingRangeSchema),
  z.literal(null)
]);
export const TextDocumentDeclarationResultSchema: z.ZodType<unknown> = z.union([
  DeclarationSchema,
  z.array(DeclarationLinkSchema),
  z.literal(null)
]);
export const TextDocumentSelectionRangeResultSchema: z.ZodType<unknown> = z.union([
  z.array(SelectionRangeSchema),
  z.literal(null)
]);
export const TextDocumentPrepareCallHierarchyResultSchema: z.ZodType<unknown> = z.union([
  z.array(CallHierarchyItemSchema),
  z.literal(null)
]);
export const CallHierarchyIncomingCallsResultSchema: z.ZodType<unknown> = z.union([
  z.array(CallHierarchyIncomingCallSchema),
  z.literal(null)
]);
export const CallHierarchyOutgoingCallsResultSchema: z.ZodType<unknown> = z.union([
  z.array(CallHierarchyOutgoingCallSchema),
  z.literal(null)
]);
export const TextDocumentSemanticTokensFullResultSchema: z.ZodType<unknown> = z.union([
  SemanticTokensSchema,
  z.literal(null)
]);
export const TextDocumentSemanticTokensFullDeltaResultSchema: z.ZodType<unknown> = z.union([
  SemanticTokensSchema,
  SemanticTokensDeltaSchema,
  z.literal(null)
]);
export const TextDocumentSemanticTokensRangeResultSchema: z.ZodType<unknown> = z.union([
  SemanticTokensSchema,
  z.literal(null)
]);
export const TextDocumentLinkedEditingRangeResultSchema: z.ZodType<unknown> = z.union([
  LinkedEditingRangesSchema,
  z.literal(null)
]);
export const WorkspaceWillCreateFilesResultSchema: z.ZodType<unknown> = z.union([
  WorkspaceEditSchema,
  z.literal(null)
]);
export const WorkspaceWillRenameFilesResultSchema: z.ZodType<unknown> = z.union([
  WorkspaceEditSchema,
  z.literal(null)
]);
export const WorkspaceWillDeleteFilesResultSchema: z.ZodType<unknown> = z.union([
  WorkspaceEditSchema,
  z.literal(null)
]);
export const TextDocumentMonikerResultSchema: z.ZodType<unknown> = z.union([
  z.array(MonikerSchema),
  z.literal(null)
]);
export const TextDocumentPrepareTypeHierarchyResultSchema: z.ZodType<unknown> = z.union([
  z.array(TypeHierarchyItemSchema),
  z.literal(null)
]);
export const TypeHierarchySupertypesResultSchema: z.ZodType<unknown> = z.union([
  z.array(TypeHierarchyItemSchema),
  z.literal(null)
]);
export const TypeHierarchySubtypesResultSchema: z.ZodType<unknown> = z.union([
  z.array(TypeHierarchyItemSchema),
  z.literal(null)
]);
export const TextDocumentInlineValueResultSchema: z.ZodType<unknown> = z.union([
  z.array(InlineValueSchema),
  z.literal(null)
]);
export const TextDocumentInlayHintResultSchema: z.ZodType<unknown> = z.union([
  z.array(InlayHintSchema),
  z.literal(null)
]);
export const InlayHintResolveResultSchema: z.ZodType<unknown> = InlayHintSchema;
export const TextDocumentDiagnosticResultSchema: z.ZodType<unknown> =
  DocumentDiagnosticReportSchema;
export const WorkspaceDiagnosticResultSchema: z.ZodType<unknown> = WorkspaceDiagnosticReportSchema;
export const TextDocumentInlineCompletionResultSchema: z.ZodType<unknown> = z.union([
  InlineCompletionListSchema,
  z.array(InlineCompletionItemSchema),
  z.literal(null)
]);
export const WorkspaceTextDocumentContentResultSchema: z.ZodType<unknown> =
  TextDocumentContentResultSchema;
export const ShutdownResultSchema: z.ZodType<unknown> = z.literal(null);
export const TextDocumentWillSaveWaitUntilResultSchema: z.ZodType<unknown> = z.union([
  z.array(TextEditSchema),
  z.literal(null)
]);
export const TextDocumentCompletionResultSchema: z.ZodType<unknown> = z.union([
  z.array(CompletionItemSchema),
  CompletionListSchema,
  z.literal(null)
]);
export const CompletionItemResolveResultSchema: z.ZodType<unknown> = CompletionItemSchema;
export const TextDocumentHoverResultSchema: z.ZodType<unknown> = z.union([
  HoverSchema,
  z.literal(null)
]);
export const TextDocumentSignatureHelpResultSchema: z.ZodType<unknown> = z.union([
  SignatureHelpSchema,
  z.literal(null)
]);
export const TextDocumentDefinitionResultSchema: z.ZodType<unknown> = z.union([
  DefinitionSchema,
  z.array(DefinitionLinkSchema),
  z.literal(null)
]);
export const TextDocumentReferencesResultSchema: z.ZodType<unknown> = z.union([
  z.array(LocationSchema),
  z.literal(null)
]);
export const TextDocumentDocumentHighlightResultSchema: z.ZodType<unknown> = z.union([
  z.array(DocumentHighlightSchema),
  z.literal(null)
]);
export const TextDocumentDocumentSymbolResultSchema: z.ZodType<unknown> = z.union([
  z.array(SymbolInformationSchema),
  z.array(DocumentSymbolSchema),
  z.literal(null)
]);
export const TextDocumentCodeActionResultSchema: z.ZodType<unknown> = z.union([
  z.array(z.union([CommandSchema, CodeActionSchema])),
  z.literal(null)
]);
export const CodeActionResolveResultSchema: z.ZodType<unknown> = CodeActionSchema;
export const WorkspaceSymbolResultSchema: z.ZodType<unknown> = z.union([
  z.array(SymbolInformationSchema),
  z.array(WorkspaceSymbolSchema),
  z.literal(null)
]);
export const WorkspaceSymbolResolveResultSchema: z.ZodType<unknown> = WorkspaceSymbolSchema;
export const TextDocumentCodeLensResultSchema: z.ZodType<unknown> = z.union([
  z.array(CodeLensSchema),
  z.literal(null)
]);
export const CodeLensResolveResultSchema: z.ZodType<unknown> = CodeLensSchema;
export const TextDocumentDocumentLinkResultSchema: z.ZodType<unknown> = z.union([
  z.array(DocumentLinkSchema),
  z.literal(null)
]);
export const DocumentLinkResolveResultSchema: z.ZodType<unknown> = DocumentLinkSchema;
export const TextDocumentFormattingResultSchema: z.ZodType<unknown> = z.union([
  z.array(TextEditSchema),
  z.literal(null)
]);
export const TextDocumentRangeFormattingResultSchema: z.ZodType<unknown> = z.union([
  z.array(TextEditSchema),
  z.literal(null)
]);
export const TextDocumentRangesFormattingResultSchema: z.ZodType<unknown> = z.union([
  z.array(TextEditSchema),
  z.literal(null)
]);
export const TextDocumentOnTypeFormattingResultSchema: z.ZodType<unknown> = z.union([
  z.array(TextEditSchema),
  z.literal(null)
]);
export const TextDocumentRenameResultSchema: z.ZodType<unknown> = z.union([
  WorkspaceEditSchema,
  z.literal(null)
]);
export const TextDocumentPrepareRenameResultSchema: z.ZodType<unknown> = z.union([
  PrepareRenameResultSchema,
  z.literal(null)
]);
export const WorkspaceExecuteCommandResultSchema: z.ZodType<unknown> = z.union([
  z.lazy(() => LSPAnySchema),
  z.literal(null)
]);
export const WorkspaceWorkspaceFoldersResultSchema: z.ZodType<unknown> = z.union([
  z.array(WorkspaceFolderSchema),
  z.literal(null)
]);
export const WorkspaceConfigurationResultSchema: z.ZodType<unknown> = z.array(
  z.lazy(() => LSPAnySchema)
);
export const WorkspaceFoldingRangeRefreshResultSchema: z.ZodType<unknown> = z.literal(null);
export const WindowWorkDoneProgressCreateResultSchema: z.ZodType<unknown> = z.literal(null);
export const WorkspaceSemanticTokensRefreshResultSchema: z.ZodType<unknown> = z.literal(null);
export const WindowShowDocumentResultSchema: z.ZodType<unknown> = ShowDocumentResultSchema;
export const WorkspaceInlineValueRefreshResultSchema: z.ZodType<unknown> = z.literal(null);
export const WorkspaceInlayHintRefreshResultSchema: z.ZodType<unknown> = z.literal(null);
export const WorkspaceDiagnosticRefreshResultSchema: z.ZodType<unknown> = z.literal(null);
export const WorkspaceTextDocumentContentRefreshResultSchema: z.ZodType<unknown> = z.literal(null);
export const ClientRegisterCapabilityResultSchema: z.ZodType<unknown> = z.literal(null);
export const ClientUnregisterCapabilityResultSchema: z.ZodType<unknown> = z.literal(null);
export const WindowShowMessageRequestResultSchema: z.ZodType<unknown> = z.union([
  MessageActionItemSchema,
  z.literal(null)
]);
export const WorkspaceCodeLensRefreshResultSchema: z.ZodType<unknown> = z.literal(null);
export const WorkspaceApplyEditResultSchema: z.ZodType<unknown> = ApplyWorkspaceEditResultSchema;

/**
 * Result schema registry — maps a request method to its result schema.
 */
export const LSPResultSchemas = {
  'callHierarchy/incomingCalls': CallHierarchyIncomingCallsResultSchema,
  'callHierarchy/outgoingCalls': CallHierarchyOutgoingCallsResultSchema,
  'client/registerCapability': ClientRegisterCapabilityResultSchema,
  'client/unregisterCapability': ClientUnregisterCapabilityResultSchema,
  'codeAction/resolve': CodeActionResolveResultSchema,
  'codeLens/resolve': CodeLensResolveResultSchema,
  'completionItem/resolve': CompletionItemResolveResultSchema,
  'documentLink/resolve': DocumentLinkResolveResultSchema,
  initialize: InitializeResultSchema,
  'inlayHint/resolve': InlayHintResolveResultSchema,
  shutdown: ShutdownResultSchema,
  'textDocument/codeAction': TextDocumentCodeActionResultSchema,
  'textDocument/codeLens': TextDocumentCodeLensResultSchema,
  'textDocument/colorPresentation': TextDocumentColorPresentationResultSchema,
  'textDocument/completion': TextDocumentCompletionResultSchema,
  'textDocument/declaration': TextDocumentDeclarationResultSchema,
  'textDocument/definition': TextDocumentDefinitionResultSchema,
  'textDocument/diagnostic': TextDocumentDiagnosticResultSchema,
  'textDocument/documentColor': TextDocumentDocumentColorResultSchema,
  'textDocument/documentHighlight': TextDocumentDocumentHighlightResultSchema,
  'textDocument/documentLink': TextDocumentDocumentLinkResultSchema,
  'textDocument/documentSymbol': TextDocumentDocumentSymbolResultSchema,
  'textDocument/foldingRange': TextDocumentFoldingRangeResultSchema,
  'textDocument/formatting': TextDocumentFormattingResultSchema,
  'textDocument/hover': TextDocumentHoverResultSchema,
  'textDocument/implementation': TextDocumentImplementationResultSchema,
  'textDocument/inlayHint': TextDocumentInlayHintResultSchema,
  'textDocument/inlineCompletion': TextDocumentInlineCompletionResultSchema,
  'textDocument/inlineValue': TextDocumentInlineValueResultSchema,
  'textDocument/linkedEditingRange': TextDocumentLinkedEditingRangeResultSchema,
  'textDocument/moniker': TextDocumentMonikerResultSchema,
  'textDocument/onTypeFormatting': TextDocumentOnTypeFormattingResultSchema,
  'textDocument/prepareCallHierarchy': TextDocumentPrepareCallHierarchyResultSchema,
  'textDocument/prepareRename': TextDocumentPrepareRenameResultSchema,
  'textDocument/prepareTypeHierarchy': TextDocumentPrepareTypeHierarchyResultSchema,
  'textDocument/rangeFormatting': TextDocumentRangeFormattingResultSchema,
  'textDocument/rangesFormatting': TextDocumentRangesFormattingResultSchema,
  'textDocument/references': TextDocumentReferencesResultSchema,
  'textDocument/rename': TextDocumentRenameResultSchema,
  'textDocument/selectionRange': TextDocumentSelectionRangeResultSchema,
  'textDocument/semanticTokens/full': TextDocumentSemanticTokensFullResultSchema,
  'textDocument/semanticTokens/full/delta': TextDocumentSemanticTokensFullDeltaResultSchema,
  'textDocument/semanticTokens/range': TextDocumentSemanticTokensRangeResultSchema,
  'textDocument/signatureHelp': TextDocumentSignatureHelpResultSchema,
  'textDocument/typeDefinition': TextDocumentTypeDefinitionResultSchema,
  'textDocument/willSaveWaitUntil': TextDocumentWillSaveWaitUntilResultSchema,
  'typeHierarchy/subtypes': TypeHierarchySubtypesResultSchema,
  'typeHierarchy/supertypes': TypeHierarchySupertypesResultSchema,
  'window/showDocument': WindowShowDocumentResultSchema,
  'window/showMessageRequest': WindowShowMessageRequestResultSchema,
  'window/workDoneProgress/create': WindowWorkDoneProgressCreateResultSchema,
  'workspace/applyEdit': WorkspaceApplyEditResultSchema,
  'workspace/codeLens/refresh': WorkspaceCodeLensRefreshResultSchema,
  'workspace/configuration': WorkspaceConfigurationResultSchema,
  'workspace/diagnostic': WorkspaceDiagnosticResultSchema,
  'workspace/diagnostic/refresh': WorkspaceDiagnosticRefreshResultSchema,
  'workspace/executeCommand': WorkspaceExecuteCommandResultSchema,
  'workspace/foldingRange/refresh': WorkspaceFoldingRangeRefreshResultSchema,
  'workspace/inlayHint/refresh': WorkspaceInlayHintRefreshResultSchema,
  'workspace/inlineValue/refresh': WorkspaceInlineValueRefreshResultSchema,
  'workspace/semanticTokens/refresh': WorkspaceSemanticTokensRefreshResultSchema,
  'workspace/symbol': WorkspaceSymbolResultSchema,
  'workspace/textDocumentContent': WorkspaceTextDocumentContentResultSchema,
  'workspace/textDocumentContent/refresh': WorkspaceTextDocumentContentRefreshResultSchema,
  'workspace/willCreateFiles': WorkspaceWillCreateFilesResultSchema,
  'workspace/willDeleteFiles': WorkspaceWillDeleteFilesResultSchema,
  'workspace/willRenameFiles': WorkspaceWillRenameFilesResultSchema,
  'workspace/workspaceFolders': WorkspaceWorkspaceFoldersResultSchema,
  'workspaceSymbol/resolve': WorkspaceSymbolResolveResultSchema
} as const;

/**
 * Looks up the result schema for a request method.
 * Returns `undefined` for notifications or unknown methods.
 */
export function getResultSchemaForMethod(method: string): z.ZodType<unknown> | undefined {
  return LSPResultSchemas[method as keyof typeof LSPResultSchemas];
}

/**
 * Schema registry for method-based lookup
 */
export const LSPSchemas = {
  '$/cancelRequest': CancelParamsSchema,
  '$/logTrace': LogTraceParamsSchema,
  '$/progress': ProgressParamsSchema,
  '$/setTrace': SetTraceParamsSchema,
  'callHierarchy/incomingCalls': CallHierarchyIncomingCallsParamsSchema,
  'callHierarchy/outgoingCalls': CallHierarchyOutgoingCallsParamsSchema,
  'client/registerCapability': RegistrationParamsSchema,
  'client/unregisterCapability': UnregistrationParamsSchema,
  'codeAction/resolve': CodeActionSchema,
  'codeLens/resolve': CodeLensSchema,
  'completionItem/resolve': CompletionItemSchema,
  'documentLink/resolve': DocumentLinkSchema,
  initialize: InitializeParamsSchema,
  initialized: InitializedParamsSchema,
  'inlayHint/resolve': InlayHintSchema,
  'notebookDocument/didChange': DidChangeNotebookDocumentParamsSchema,
  'notebookDocument/didClose': DidCloseNotebookDocumentParamsSchema,
  'notebookDocument/didOpen': DidOpenNotebookDocumentParamsSchema,
  'notebookDocument/didSave': DidSaveNotebookDocumentParamsSchema,
  'telemetry/event': LSPAnySchema,
  'textDocument/codeAction': CodeActionParamsSchema,
  'textDocument/codeLens': CodeLensParamsSchema,
  'textDocument/colorPresentation': ColorPresentationParamsSchema,
  'textDocument/completion': CompletionParamsSchema,
  'textDocument/declaration': DeclarationParamsSchema,
  'textDocument/definition': DefinitionParamsSchema,
  'textDocument/diagnostic': DocumentDiagnosticParamsSchema,
  'textDocument/didChange': DidChangeTextDocumentParamsSchema,
  'textDocument/didClose': DidCloseTextDocumentParamsSchema,
  'textDocument/didOpen': DidOpenTextDocumentParamsSchema,
  'textDocument/didSave': DidSaveTextDocumentParamsSchema,
  'textDocument/documentColor': DocumentColorParamsSchema,
  'textDocument/documentHighlight': DocumentHighlightParamsSchema,
  'textDocument/documentLink': DocumentLinkParamsSchema,
  'textDocument/documentSymbol': DocumentSymbolParamsSchema,
  'textDocument/foldingRange': FoldingRangeParamsSchema,
  'textDocument/formatting': DocumentFormattingParamsSchema,
  'textDocument/hover': HoverParamsSchema,
  'textDocument/implementation': ImplementationParamsSchema,
  'textDocument/inlayHint': InlayHintParamsSchema,
  'textDocument/inlineCompletion': InlineCompletionParamsSchema,
  'textDocument/inlineValue': InlineValueParamsSchema,
  'textDocument/linkedEditingRange': LinkedEditingRangeParamsSchema,
  'textDocument/moniker': MonikerParamsSchema,
  'textDocument/onTypeFormatting': DocumentOnTypeFormattingParamsSchema,
  'textDocument/prepareCallHierarchy': CallHierarchyPrepareParamsSchema,
  'textDocument/prepareRename': PrepareRenameParamsSchema,
  'textDocument/prepareTypeHierarchy': TypeHierarchyPrepareParamsSchema,
  'textDocument/publishDiagnostics': PublishDiagnosticsParamsSchema,
  'textDocument/rangeFormatting': DocumentRangeFormattingParamsSchema,
  'textDocument/rangesFormatting': DocumentRangesFormattingParamsSchema,
  'textDocument/references': ReferenceParamsSchema,
  'textDocument/rename': RenameParamsSchema,
  'textDocument/selectionRange': SelectionRangeParamsSchema,
  'textDocument/semanticTokens/full': SemanticTokensParamsSchema,
  'textDocument/semanticTokens/full/delta': SemanticTokensDeltaParamsSchema,
  'textDocument/semanticTokens/range': SemanticTokensRangeParamsSchema,
  'textDocument/signatureHelp': SignatureHelpParamsSchema,
  'textDocument/typeDefinition': TypeDefinitionParamsSchema,
  'textDocument/willSave': WillSaveTextDocumentParamsSchema,
  'textDocument/willSaveWaitUntil': WillSaveTextDocumentParamsSchema,
  'typeHierarchy/subtypes': TypeHierarchySubtypesParamsSchema,
  'typeHierarchy/supertypes': TypeHierarchySupertypesParamsSchema,
  'window/logMessage': LogMessageParamsSchema,
  'window/showDocument': ShowDocumentParamsSchema,
  'window/showMessage': ShowMessageParamsSchema,
  'window/showMessageRequest': ShowMessageRequestParamsSchema,
  'window/workDoneProgress/cancel': WorkDoneProgressCancelParamsSchema,
  'window/workDoneProgress/create': WorkDoneProgressCreateParamsSchema,
  'workspace/applyEdit': ApplyWorkspaceEditParamsSchema,
  'workspace/configuration': ConfigurationParamsSchema,
  'workspace/diagnostic': WorkspaceDiagnosticParamsSchema,
  'workspace/didChangeConfiguration': DidChangeConfigurationParamsSchema,
  'workspace/didChangeWatchedFiles': DidChangeWatchedFilesParamsSchema,
  'workspace/didChangeWorkspaceFolders': DidChangeWorkspaceFoldersParamsSchema,
  'workspace/didCreateFiles': CreateFilesParamsSchema,
  'workspace/didDeleteFiles': DeleteFilesParamsSchema,
  'workspace/didRenameFiles': RenameFilesParamsSchema,
  'workspace/executeCommand': ExecuteCommandParamsSchema,
  'workspace/symbol': WorkspaceSymbolParamsSchema,
  'workspace/textDocumentContent': TextDocumentContentParamsSchema,
  'workspace/textDocumentContent/refresh': TextDocumentContentRefreshParamsSchema,
  'workspace/willCreateFiles': CreateFilesParamsSchema,
  'workspace/willDeleteFiles': DeleteFilesParamsSchema,
  'workspace/willRenameFiles': RenameFilesParamsSchema,
  'workspaceSymbol/resolve': WorkspaceSymbolSchema
} as const;

/**
 * Looks up the Zod validation schema for a given LSP method.
 */
export function getSchemaForMethod(method: string): z.ZodType<unknown> | undefined {
  return LSPSchemas[method as keyof typeof LSPSchemas];
}
