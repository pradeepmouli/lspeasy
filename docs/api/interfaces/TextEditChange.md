[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / TextEditChange

# Interface: TextEditChange

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:926

A change to capture text edits for existing resources.

## Methods

### add()

> **add**(`edit`): `void`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:948

Adds a text edit.

#### Parameters

##### edit

[`TextEdit`](TextEdit.md) \| [`AnnotatedTextEdit`](AnnotatedTextEdit.md)

the text edit to add.

#### Returns

`void`

#### Since

3.16.0 - support for annotated text edits. This is usually
guarded using a client capability.

***

### all()

> **all**(): ([`TextEdit`](TextEdit.md) \| [`AnnotatedTextEdit`](AnnotatedTextEdit.md))[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:935

Gets all text edits for this change.

#### Returns

([`TextEdit`](TextEdit.md) \| [`AnnotatedTextEdit`](AnnotatedTextEdit.md))[]

An array of text edits.

#### Since

3.16.0 - support for annotated text edits. This is usually
guarded using a client capability.

***

### clear()

> **clear**(): `void`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:939

Clears the edits for this change.

#### Returns

`void`

***

### delete()

#### Call Signature

> **delete**(`range`): `void`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:973

Delete the text at the given range.

##### Parameters

###### range

[`Range`](Range.md)

A range.

##### Returns

`void`

#### Call Signature

> **delete**(`range`, `annotation?`): `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:974

##### Parameters

###### range

[`Range`](Range.md)

###### annotation?

`string` \| [`ChangeAnnotation`](ChangeAnnotation.md)

##### Returns

`string`

***

### insert()

#### Call Signature

> **insert**(`position`, `newText`): `void`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:956

Insert the given text at the given position.

##### Parameters

###### position

[`Position`](Position.md)

A position.

###### newText

`string`

A string.

##### Returns

`void`

#### Call Signature

> **insert**(`position`, `newText`, `annotation`): `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:957

##### Parameters

###### position

[`Position`](Position.md)

###### newText

`string`

###### annotation

`string` \| [`ChangeAnnotation`](ChangeAnnotation.md)

##### Returns

`string`

***

### replace()

#### Call Signature

> **replace**(`range`, `newText`): `void`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:965

Replace the given range with given text for the given resource.

##### Parameters

###### range

[`Range`](Range.md)

A range.

###### newText

`string`

A string.

##### Returns

`void`

#### Call Signature

> **replace**(`range`, `newText`, `annotation?`): `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:966

##### Parameters

###### range

[`Range`](Range.md)

###### newText

`string`

###### annotation?

`string` \| [`ChangeAnnotation`](ChangeAnnotation.md)

##### Returns

`string`
