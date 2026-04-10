[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [LSPErrorCodes](../README.md) / ContentModified

# Variable: ContentModified

> `const` **ContentModified**: [`integer`](../../../../type-aliases/integer.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/api.d.ts:42

The server detected that the content of a document got
modified outside normal conditions. A server should
NOT send this error code if it detects a content change
in it unprocessed messages. The result even computed
on an older state might still be useful for the client.

If a client decides that a result is not of any use anymore
the client should cancel the request.
