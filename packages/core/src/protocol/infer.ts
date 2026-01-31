/**
 * Type inference utilities for extracting params/result types from LSP method names
 *
 * Uses mapped types and lookups instead of nested conditionals
 */

import { LSPRequest, LSPNotification } from './namespaces.js';

// Helper type to flatten nested method types into a flat map
type FlattenMethods<T> = {
  [K in keyof T]: T[K] extends { Method: infer M }
    ? { [P in M & string]: T[K] }
    : T[K] extends Record<string, any>
      ? FlattenMethods<T[K]>
      : never;
}[keyof T];

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
  ? I
  : never;

//@ts-ignore - TS bug workaround
type FlatRequestMap = UnionToIntersection<FlattenMethods<LSPRequest>>;
//@ts-ignore - TS bug workaround
type FlatNotificationMap = UnionToIntersection<FlattenMethods<LSPNotification>>;

/**
 * Union type of all valid LSP request method names
 */
export type LSPRequestMethod = keyof FlatRequestMap;

/**
 * Union type of all valid LSP notification method names
 */
export type LSPNotificationMethod = keyof FlatNotificationMap;

/**
 * Infer request parameters from method name
 *
 * @example
 * type HoverParams = InferRequestParams<'textDocument/hover'>
 * // Resolves to: HoverParams from vscode-languageserver-protocol
 */
export type ParamsForMethod<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M]['Params']
  : never;

/**
 * Infer request result from method name
 *
 * @example
 * type HoverResult = InferRequestResult<'textDocument/hover'>
 * // Resolves to: Hover | null
 */
export type ResultForMethod<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M]['Result']
  : never;

export type ServerCapabilityForMethod<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M] extends { ServerCapability: infer C }
    ? C
    : never
  : never;

export type ClientCapabilityForMethod<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M] extends { ClientCapability: infer C }
    ? C
    : never
  : never;

/**
 * Infer notification parameters from method name
 *
 * @example
 * type DidOpenParams = InferNotificationParams<'textDocument/didOpen'>
 * // Resolves to: DidOpenTextDocumentParams from vscode-languageserver-protocol
 */
export type ParamsForNotification<M extends string> = M extends LSPNotificationMethod
  ? FlatNotificationMap[M]['Params']
  : never;

export type OptionsForMethod<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M] extends { Options: infer O }
    ? O
    : never
  : never;

export type RegistrationOptionsForMethod<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M] extends { RegistrationOptions: infer R }
    ? R
    : never
  : never;

/**
 * Type inference benefits:
 *
 * 1. Zero manual mapping - types inferred directly from type definitions
 * 2. Single source of truth - add a type, get automatic type support
 * 3. Automatic flattening - no need to manually update conditionals
 * 4. Compile-time validation - invalid method names caught by union types
 *
 * Adding new methods:
 * 1. Define type (e.g., LSPRequest['TextDocument']['NewFeature'])
 * 2. Types automatically available through lookup
 * → Automatically works in onRequest/sendRequest signatures
 */
