---
name: vscode-languageserver-protocol
description: "TypeScript SDK for building Language Server Protocol clients and servers Use when working with lsp, language-server-protocol, sdk, language-server, lsp-client, lsp-server."
license: MIT
---

# vscode-languageserver-protocol

TypeScript SDK for building Language Server Protocol clients and servers

## When to Use

- Working with lsp, language-server-protocol, sdk, language-server, lsp-client, lsp-server
- API surface: 24 functions, 46 types, 338 constants

## Quick Reference

**protocol.d:** `is`, `is`, `is`, `is`, `hasId`, `is`, `isIncremental`, `isFull`, `is`, `is`, `hasWorkDoneProgress`, `HandlerSignature`, `HandlerSignature`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `Create`, `Rename`, `Delete`, `Abort`, `Transactional`, `TextOnlyTransactional`, `Undo`, `UTF8`, `UTF16`, `UTF32`, `method`, `messageDirection`, `type`, `unknownProtocolVersion`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `Error`, `Warning`, `Info`, `Log`, `Debug`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `None`, `Full`, `Incremental`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `Manual`, `AfterDelay`, `FocusOut`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `Invoked`, `TriggerCharacter`, `TriggerForIncompleteCompletions`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `Invoked`, `TriggerCharacter`, `ContentChange`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `Identifier`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `Created`, `Changed`, `Deleted`, `Create`, `Change`, `Delete`
**protocol.progress.d:** `is`, `HandlerSignature`, `HandlerSignature`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`
**protocol.diagnostic.d:** `is`, `HandlerSignature`, `HandlerSignature`, `HandlerSignature`, `Full`, `Unchanged`, `method`, `messageDirection`, `type`, `partialResult`, `method`, `messageDirection`, `type`, `partialResult`, `method`, `messageDirection`, `type`
**protocol.notebook.d:** `is`, `create`, `is`, `equals`, `create`, `is`, `diff`, `create`, `is`, `is`, `create`, `Markup`, `Code`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `registrationMethod`, `method`, `messageDirection`, `type`, `registrationMethod`, `method`, `messageDirection`, `type`, `registrationMethod`, `method`, `messageDirection`, `type`, `registrationMethod`
**protocol.implementation.d:** `HandlerSignature`, `method`, `messageDirection`, `type`
**protocol.typeDefinition.d:** `HandlerSignature`, `method`, `messageDirection`, `type`
**protocol.workspaceFolder.d:** `HandlerSignature`, `MiddlewareSignature`, `HandlerSignature`, `MiddlewareSignature`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`
**protocol.configuration.d:** `HandlerSignature`, `MiddlewareSignature`, `method`, `messageDirection`, `type`
**protocol.colorProvider.d:** `HandlerSignature`, `HandlerSignature`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`
**protocol.foldingRange.d:** `HandlerSignature`, `HandlerSignature`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`
**protocol.declaration.d:** `HandlerSignature`, `method`, `messageDirection`, `type`
**protocol.selectionRange.d:** `HandlerSignature`, `method`, `messageDirection`, `type`
**protocol.callHierarchy.d:** `HandlerSignature`, `HandlerSignature`, `HandlerSignature`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`
**protocol.semanticTokens.d:** `HandlerSignature`, `HandlerSignature`, `HandlerSignature`, `HandlerSignature`, `Relative`, `method`, `messageDirection`, `type`, `registrationMethod`, `method`, `messageDirection`, `type`, `registrationMethod`, `method`, `messageDirection`, `type`, `registrationMethod`, `method`, `messageDirection`, `type`, `method`, `type`
**protocol.showDocument.d:** `HandlerSignature`, `MiddlewareSignature`, `method`, `messageDirection`, `type`
**protocol.linkedEditingRange.d:** `HandlerSignature`, `method`, `messageDirection`, `type`
**protocol.fileOperations.d:** `HandlerSignature`, `HandlerSignature`, `HandlerSignature`, `HandlerSignature`, `HandlerSignature`, `HandlerSignature`, `file`, `folder`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`
**protocol.typeHierarchy.d:** `HandlerSignature`, `HandlerSignature`, `HandlerSignature`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`
**protocol.inlineValue.d:** `HandlerSignature`, `HandlerSignature`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`
**protocol.inlayHint.d:** `HandlerSignature`, `HandlerSignature`, `HandlerSignature`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`, `method`, `messageDirection`, `type`
**protocol.inlineCompletion.d:** `HandlerSignature`, `method`, `messageDirection`, `type`
**api.d:** `lspReservedErrorRangeStart`, `RequestFailed`, `ServerCancelled`, `ContentModified`, `RequestCancelled`, `lspReservedErrorRangeEnd`
**protocol.moniker.d:** `document`, `project`, `group`, `scheme`, `global`, `$import`, `$export`, `local`, `method`, `messageDirection`, `type`

## Links

- [Repository](https://github.com/pradeepmouli/lspeasy)
- Author: Pradeep Mouli