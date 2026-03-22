---
name: will-save-text-document-wait-until-request
description: "A document will save request is sent from the client to the server before
the document is actually saved. The request can return an array of TextEdits
which will be applied to the text document before it is saved. Please note that
clients might drop results if computing the text edits took too long or if a
server constantly fails on this request. This is done to keep the save fast and
reliable. Keywords: lsp, language-server-protocol, sdk, language-server, lsp-client, lsp-server."
license: MIT
---

# WillSaveTextDocumentWaitUntilRequest

A document will save request is sent from the client to the server before
the document is actually saved. The request can return an array of TextEdits
which will be applied to the text document before it is saved. Please note that
clients might drop results if computing the text edits took too long or if a
server constantly fails on this request. This is done to keep the save fast and
reliable.

## Links

- [Repository](https://github.com/pradeepmouli/lspeasy)
- Author: Pradeep Mouli