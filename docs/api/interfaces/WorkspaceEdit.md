[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WorkspaceEdit

# Interface: WorkspaceEdit

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:888

A workspace edit represents changes to many resources managed in the workspace. The edit
should either provide `changes` or `documentChanges`. If documentChanges are present
they are preferred over `changes` if the client can handle versioned document edits.

Since version 3.13.0 a workspace edit can contain resource operations as well. If resource
operations are present clients need to execute the operations in the order in which they
are provided. So a workspace edit for example can consist of the following two changes:
(1) a create file a.txt and (2) a text document edit which insert text into file a.txt.

An invalid sequence (e.g. (1) delete file a.txt and (2) insert text into file a.txt) will
cause failure of the operation. How the client recovers from the failure is described by
the client capability: `workspace.workspaceEdit.failureHandling`

## Properties

### changeAnnotations?

> `optional` **changeAnnotations?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:916

A map of change annotations that can be referenced in `AnnotatedTextEdit`s or create, rename and
delete file / folder operations.

Whether clients honor this property depends on the client capability `workspace.changeAnnotationSupport`.

#### Index Signature

\[`id`: `string`\]: [`ChangeAnnotation`](ChangeAnnotation.md)

#### Since

3.16.0

***

### changes?

> `optional` **changes?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:892

Holds changes to existing resources.

#### Index Signature

\[`uri`: `string`\]: [`TextEdit`](TextEdit.md)[]

***

### documentChanges?

> `optional` **documentChanges?**: ([`TextDocumentEdit`](TextDocumentEdit.md) \| [`CreateFile`](CreateFile.md) \| [`RenameFile`](RenameFile.md) \| [`DeleteFile`](DeleteFile.md))[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:907

Depending on the client capability `workspace.workspaceEdit.resourceOperations` document changes
are either an array of `TextDocumentEdit`s to express changes to n different text documents
where each text document edit addresses a specific version of a text document. Or it can contain
above `TextDocumentEdit`s mixed with create, rename and delete file / folder operations.

Whether a client supports versioned document edits is expressed via
`workspace.workspaceEdit.documentChanges` client capability.

If a client neither supports `documentChanges` nor `workspace.workspaceEdit.resourceOperations` then
only plain `TextEdit`s using the `changes` property are supported.
