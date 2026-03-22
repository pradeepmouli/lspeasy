---
name: completion-request
description: "Request to request completion at a given text document position. The request's
parameter is of type TextDocumentPosition the response
is of type CompletionItem CompletionItem[] or CompletionList
or a Thenable that resolves to such.

The request can delay the computation of the CompletionItem.detail `detail`
and CompletionItem.documentation `documentation` properties to the `completionItem/resolve`
request. However, properties that are needed for the initial sorting and filtering, like `sortText`,
`filterText`, `insertText`, and `textEdit`, must not be changed during resolve. Keywords: lsp, language-server-protocol, sdk, language-server, lsp-client, lsp-server."
license: MIT
---

# CompletionRequest

Request to request completion at a given text document position. The request's
parameter is of type TextDocumentPosition the response
is of type CompletionItem CompletionItem[] or CompletionList
or a Thenable that resolves to such.

The request can delay the computation of the CompletionItem.detail `detail`
and CompletionItem.documentation `documentation` properties to the `completionItem/resolve`
request. However, properties that are needed for the initial sorting and filtering, like `sortText`,
`filterText`, `insertText`, and `textEdit`, must not be changed during resolve.

## Links

- [Repository](https://github.com/pradeepmouli/lspeasy)
- Author: Pradeep Mouli