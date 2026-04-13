[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / Diagnostic

# Interface: Diagnostic

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:515

Represents a diagnostic, such as a compiler error or warning. Diagnostic objects
are only valid in the scope of a resource.

## Properties

### code?

> `optional` **code?**: `string` \| `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:528

The diagnostic's code, which usually appear in the user interface.

***

### codeDescription?

> `optional` **codeDescription?**: [`CodeDescription`](CodeDescription.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:535

An optional property to describe the error code.
Requires the code field (above) to be present/not null.

#### Since

3.16.0

***

### data?

> `optional` **data?**: `any`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:563

A data entry field that is preserved between a `textDocument/publishDiagnostics`
notification and `textDocument/codeAction` request.

#### Since

3.16.0

***

### message

> **message**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:545

The diagnostic's message. It usually appears in the user interface

***

### range

> **range**: [`Range`](Range.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:519

The range at which the message applies

***

### relatedInformation?

> `optional` **relatedInformation?**: [`DiagnosticRelatedInformation`](DiagnosticRelatedInformation.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:556

An array of related diagnostic information, e.g. when symbol-names within
a scope collide all definitions can be marked via this property.

***

### severity?

> `optional` **severity?**: [`DiagnosticSeverity`](../type-aliases/DiagnosticSeverity.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:524

The diagnostic's severity. Can be omitted. If omitted it is up to the
client to interpret diagnostics as error, warning, info or hint.

***

### source?

> `optional` **source?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:541

A human-readable string describing the source of this
diagnostic, e.g. 'typescript' or 'super lint'. It usually
appears in the user interface.

***

### tags?

> `optional` **tags?**: [`DiagnosticTag`](../type-aliases/DiagnosticTag.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:551

Additional metadata about the diagnostic.

#### Since

3.15.0
