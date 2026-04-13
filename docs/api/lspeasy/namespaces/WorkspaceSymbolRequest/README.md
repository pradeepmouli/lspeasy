[**lspeasy v1.0.0**](../../../README.md)

***

[lspeasy](../../../README.md) / WorkspaceSymbolRequest

# WorkspaceSymbolRequest

A request to list project-wide symbols matching the query string given
by the [WorkspaceSymbolParams](../../../interfaces/WorkspaceSymbolParams.md). The response is
of type [SymbolInformation\[\]](../../../interfaces/SymbolInformation.md) or a Thenable that
resolves to such.

## Since

3.17.0 - support for WorkspaceSymbol in the returned data. Clients
 need to advertise support for WorkspaceSymbols via the client capability
 `workspace.symbol.resolveSupport`.

## Variables

- [messageDirection](variables/messageDirection.md)
- [method](variables/method.md)
- [type](variables/type.md)
