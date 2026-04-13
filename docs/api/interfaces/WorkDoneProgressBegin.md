[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WorkDoneProgressBegin

# Interface: WorkDoneProgressBegin

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.progress.d.ts:4

## Properties

### cancellable?

> `optional` **cancellable?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.progress.d.ts:18

Controls if a cancel button should show to allow the user to cancel the
long running operation. Clients that don't support cancellation are allowed
to ignore the setting.

***

### kind

> **kind**: `"begin"`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.progress.d.ts:5

***

### message?

> `optional` **message?**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.progress.d.ts:26

Optional, more detailed associated progress message. Contains
complementary information to the `title`.

Examples: "3/25 files", "project/src/module2", "node_modules/some_dep".
If unset, the previous progress message (if any) is still valid.

***

### percentage?

> `optional` **percentage?**: `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.progress.d.ts:35

Optional progress percentage to display (value 100 is considered 100%).
If not provided infinite progress is assumed and clients are allowed
to ignore the `percentage` value in subsequent in report notifications.

The value should be steadily rising. Clients are free to ignore values
that are not following this rule. The value range is [0, 100].

***

### title

> **title**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.progress.d.ts:12

Mandatory title of the progress operation. Used to briefly inform about
the kind of operation being performed.

Examples: "Indexing" or "Linking dependencies".
