/**
 * Capability-conditional method types
 *
 * These types transform LSPRequest and LSPNotification into strongly-typed
 * method interfaces that are conditionally visible based on declared capabilities.
 */

import type { ServerCapabilities, ClientCapabilities } from './types.js';
import { LSPRequest } from './namespaces.js';
import type { CamelCase, KeyAsString } from 'type-fest';

/**
 * Helper type to check if a capability is enabled
 */
type IsCapabilityEnabled<Caps, Key extends string> = Key extends keyof Caps
  ? Caps[Key] extends undefined | false | null
    ? never
    : Caps[Key]
  : unknown; // Permissive for dynamic capabilities not in the type

/**
 * Transform a request type definition into a method signature
 * Only included if the server capability is enabled
 */
type TransformToClientSendMethod<T, ServerCaps> = T extends {
  Method: string;
  Params: infer P;
  Result?: infer R;
  ServerCapability: infer Cap extends string;
  Direction: 'clientToServer';
}
  ? IsCapabilityEnabled<ServerCaps, Cap> extends never
    ? never
    : (params: P) => Promise<R>
  : never;

/**
 * Transform a request type definition into a server handler registration
 */
type TransformToServerHandler<T, ServerCaps> = T extends {
  Method: string;
  Params: infer P;
  Result?: infer R;
  ServerCapability: infer Cap extends string;
  Direction: 'clientToServer';
}
  ? IsCapabilityEnabled<ServerCaps, Cap> extends never
    ? never
    : (handler: (params: P) => Promise<R> | R) => void
  : never;

/**
 * Transform a request type definition into a server sending method
 */
type TransformToServerSendMethod<T> = T extends {
  Method: string;
  Params: infer P;
  Result?: infer R;
  Direction: 'serverToClient';
}
  ? (params: P) => Promise<R>
  : never;

/**
 * Transform a request type definition into a client handler registration
 */
type TransformToClientHandler<T> = T extends {
  Method: string;
  Params: infer P;
  Result?: infer R;
  Direction: 'serverToClient';
}
  ? (handler: (params: P) => Promise<R> | R) => void
  : never;

/**
 * Remove 'never' properties from an object type
 */
type RemoveNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

/**
 * Uncapitalize first letter of string
 */
/**
 * Client methods for sending requests to server
 * Methods are conditionally visible based on ServerCapabilities
 *
 * @example
 * type MyCaps = { hoverProvider: true; completionProvider: { triggerCharacters: ['.'] } };
 * type MyMethods = ClientSendMethods<MyCaps>;
 * // MyMethods.textDocument.hover is available
 * // MyMethods.textDocument.completion is available
 * // MyMethods.textDocument.definition is 'never' (not in capabilities)
 */
export type ClientSendMethods<ServerCaps extends Partial<ServerCapabilities>> = {
  [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNever<{
    [Method in keyof LSPRequest[Namespace] as CamelCase<Method>]: TransformToClientSendMethod<
      LSPRequest[Namespace][Method],
      ServerCaps
    >;
  }>;
};

/**
 * Server handler registration methods (for requests from client)
 * Handlers are conditionally visible based on ServerCapabilities
 *
 * @example
 * type MyCaps = { hoverProvider: true };
 * type MyHandlers = ServerHandlers<MyCaps>;
 * // MyHandlers.onHover is available
 * // MyHandlers.onCompletion is 'never'
 */
export type ServerHandlers<ServerCaps extends Partial<ServerCapabilities>> = {
  [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: {
    [Method in keyof LSPRequest[Namespace] as `on${Method & string}`]: TransformToServerHandler<
      LSPRequest[Namespace][Method],
      ServerCaps
    >;
  };
}[CamelCase<keyof LSPRequest>];

/**
 * Server methods for sending requests to client
 *
 * @example
 * type MyMethods = ServerSendMethods<ClientCapabilities>;
 * // MyMethods.window.showMessageRequest(params)
 * // MyMethods.workspace.applyWorkspaceEdit(params)
 */
export type ServerSendMethods<
  _ClientCaps extends Partial<ClientCapabilities> = ClientCapabilities
> = {
  [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNever<{
    [Method in keyof LSPRequest[Namespace] as CamelCase<
      Method & string
    >]: TransformToServerSendMethod<LSPRequest[Namespace][Method]>;
  }>;
};

/**
 * Client handler registration methods (for requests from server)
 *
 * @example
 * type MyHandlers = ClientHandlers<ClientCapabilities>;
 * // client.onShowMessageRequest(handler)
 * // client.onApplyWorkspaceEdit(handler)
 */
export type ClientHandlers<_ClientCaps extends Partial<ClientCapabilities>> = {
  [Namespace in keyof LSPRequest]: {
    [Method in keyof LSPRequest[Namespace] as `on${Method & string}`]: TransformToClientHandler<
      LSPRequest[Namespace][Method]
    >;
  };
}[keyof LSPRequest];

export const ClientRequestMethodToCapabilityMap: Map<string, keyof ServerCapabilities> = new Map(
  (Object.values(LSPRequest) as any[])
    .flatMap((ns) => Object.values(ns))
    .map((req: any) => [req.Method, req.ServerCapability] as [string, keyof ServerCapabilities])
);

export const ClientNotificationMethodToCapabilityMap: Map<string, keyof ServerCapabilities> =
  new Map(
    Object.values(LSPRequest)
      .flatMap((ns) => Object.values(ns))
      .filter(
        (req: any) =>
          req.Direction === 'clientToServer' ||
          req.Driection.map(
            (req: any) => [req.Method, req.ServerCapability] as [string, keyof ServerCapabilities]
          )
      )
  );
