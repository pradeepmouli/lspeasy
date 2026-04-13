[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WorkspaceEditClientCapabilities

# Interface: WorkspaceEditClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3157

## Properties

### changeAnnotationSupport?

> `optional` **changeAnnotationSupport?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3192

Whether the client in general supports change annotations on text edits,
create file, rename file and delete file changes.

#### groupsOnLabel?

> `optional` **groupsOnLabel?**: `boolean`

Whether the client groups edits with equal labels into tree nodes,
for instance all edits labelled with "Changes in Strings" would
be a tree node.

#### Since

3.16.0

***

### documentChanges?

> `optional` **documentChanges?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3161

The client supports versioned document changes in `WorkspaceEdit`s

***

### failureHandling?

> `optional` **failureHandling?**: [`FailureHandlingKind`](../type-aliases/FailureHandlingKind.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3175

The failure handling strategy of a client if applying the workspace edit
fails.

#### Since

3.13.0

***

### normalizesLineEndings?

> `optional` **normalizesLineEndings?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3185

Whether the client normalizes line endings to the client specific
setting.
If set to `true` the client will normalize line ending characters
in a workspace edit to the client-specified new line
character.

#### Since

3.16.0

***

### resourceOperations?

> `optional` **resourceOperations?**: [`ResourceOperationKind`](../type-aliases/ResourceOperationKind.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3168

The resource operations the client supports. Clients should at least
support 'create', 'rename' and 'delete' files and folders.

#### Since

3.13.0
