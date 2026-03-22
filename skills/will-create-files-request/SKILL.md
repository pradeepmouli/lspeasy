---
name: will-create-files-request
description: "The will create files request is sent from the client to the server before files are actually
created as long as the creation is triggered from within the client.

The request can return a `WorkspaceEdit` which will be applied to workspace before the
files are created. Hence the `WorkspaceEdit` can not manipulate the content of the file
to be created. Keywords: lsp, language-server-protocol, sdk, language-server, lsp-client, lsp-server."
license: MIT
---

# WillCreateFilesRequest

The will create files request is sent from the client to the server before files are actually
created as long as the creation is triggered from within the client.

The request can return a `WorkspaceEdit` which will be applied to workspace before the
files are created. Hence the `WorkspaceEdit` can not manipulate the content of the file
to be created.

## When to Use

- Typing with `HandlerSignature`

## Quick Reference

**1 types** — `HandlerSignature`

## Links

- [Repository](https://github.com/pradeepmouli/lspeasy)
- Author: Pradeep Mouli