/**
 * Type-safe interfaces for LSP metaModel.json schema
 *
 * These interfaces match the official metaModel.json structure from
 * the VSCode Language Server Protocol repository.
 *
 * @see https://github.com/microsoft/vscode-languageserver-node/tree/main/protocol
 */

/**
 * Direction of a message (client to server or server to client)
 */
export type MessageDirection = 'clientToServer' | 'serverToClient' | 'both';

/**
 * Base type reference
 */
export interface BaseTypes {
  kind: 'base';
  name:
    | 'URI'
    | 'DocumentUri'
    | 'integer'
    | 'uinteger'
    | 'decimal'
    | 'RegExp'
    | 'string'
    | 'boolean'
    | 'null';
}

/**
 * Reference to another type
 */
export interface ReferenceType {
  kind: 'reference';
  name: string;
}

/**
 * Array type
 */
export interface ArrayType {
  kind: 'array';
  element: Type;
}

/**
 * Map type (key-value pairs)
 */
export interface MapType {
  kind: 'map';
  key: Type;
  value: Type;
}

/**
 * AND composition of types
 */
export interface AndType {
  kind: 'and';
  items: Type[];
}

/**
 * OR composition of types (union)
 */
export interface OrType {
  kind: 'or';
  items: Type[];
}

/**
 * Tuple type (fixed-length array with specific types)
 */
export interface TupleType {
  kind: 'tuple';
  items: Type[];
}

/**
 * Literal type (specific constant value)
 */
export interface LiteralType {
  kind: 'literal';
  value: StringLiteralType | IntegerLiteralType | BooleanLiteralType;
}

/**
 * String literal value
 */
export interface StringLiteralType {
  kind: 'string';
  value: string;
}

/**
 * Integer literal value
 */
export interface IntegerLiteralType {
  kind: 'integer';
  value: number;
}

/**
 * Boolean literal value
 */
export interface BooleanLiteralType {
  kind: 'boolean';
  value: boolean;
}

/**
 * String literal type reference (for enumerations)
 */
export interface StringLiteralTypeReference {
  kind: 'stringLiteral';
  value: string;
}

/**
 * Union of all possible type representations
 */
export type Type =
  | BaseTypes
  | ReferenceType
  | ArrayType
  | MapType
  | AndType
  | OrType
  | TupleType
  | LiteralType
  | StringLiteralTypeReference;

/**
 * Property of a structure or request/notification parameters
 */
export interface Property {
  /**
   * Property name
   */
  name: string;

  /**
   * Property type
   */
  type: Type;

  /**
   * Whether the property is optional
   */
  optional?: boolean;

  /**
   * Documentation for this property
   */
  documentation?: string;

  /**
   * Since when this property is available (version)
   */
  since?: string;

  /**
   * Whether this property is deprecated
   */
  deprecated?: string;

  /**
   * Proposed state (if experimental)
   */
  proposed?: boolean;
}

/**
 * Structure type definition (like TypeScript interface)
 */
export interface Structure {
  /**
   * Structure name
   */
  name: string;

  /**
   * Properties of this structure
   */
  properties: Property[];

  /**
   * Structures this extends (inheritance)
   */
  extends?: Type[];

  /**
   * Structures this mixes in
   */
  mixins?: Type[];

  /**
   * Documentation for this structure
   */
  documentation?: string;

  /**
   * Since when this structure is available (version)
   */
  since?: string;

  /**
   * Whether this structure is deprecated
   */
  deprecated?: string;

  /**
   * Proposed state (if experimental)
   */
  proposed?: boolean;
}

/**
 * Entry in an enumeration
 */
export interface EnumerationEntry {
  /**
   * Entry name
   */
  name: string;

  /**
   * Entry value (string or integer)
   */
  value: string | number;

  /**
   * Documentation for this entry
   */
  documentation?: string;

  /**
   * Since when this entry is available (version)
   */
  since?: string;

  /**
   * Whether this entry is deprecated
   */
  deprecated?: string;

  /**
   * Proposed state (if experimental)
   */
  proposed?: boolean;
}

/**
 * Enumeration type definition
 */
export interface Enumeration {
  /**
   * Enumeration name
   */
  name: string;

  /**
   * Type of enumeration values (string or integer)
   */
  type: {
    kind: 'base';
    name: 'string' | 'integer' | 'uinteger';
  };

  /**
   * Enumeration entries
   */
  values: EnumerationEntry[];

  /**
   * Whether this is a set of flags (bitwise)
   */
  supportsCustomValues?: boolean;

  /**
   * Documentation for this enumeration
   */
  documentation?: string;

  /**
   * Since when this enumeration is available (version)
   */
  since?: string;

  /**
   * Whether this enumeration is deprecated
   */
  deprecated?: string;

  /**
   * Proposed state (if experimental)
   */
  proposed?: boolean;
}

/**
 * Type alias (like TypeScript type declaration)
 */
export interface TypeAlias {
  /**
   * Alias name
   */
  name: string;

  /**
   * Type this aliases
   */
  type: Type;

  /**
   * Documentation for this type alias
   */
  documentation?: string;

  /**
   * Since when this type alias is available (version)
   */
  since?: string;

  /**
   * Whether this type alias is deprecated
   */
  deprecated?: string;

  /**
   * Proposed state (if experimental)
   */
  proposed?: boolean;
}

/**
 * LSP request definition
 */
export interface Request {
  /**
   * Request method name (e.g., "textDocument/hover")
   */
  method: string;

  /**
   * Request parameters type
   */
  params?: Type;

  /**
   * Request result type
   */
  result: Type;

  /**
   * Partial result type (for progress reporting)
   */
  partialResult?: Type;

  /**
   * Error data type
   */
  errorData?: Type;

  /**
   * Request message direction
   */
  messageDirection: MessageDirection;

  /**
   * Registration options type (for dynamic registration)
   */
  registrationOptions?: Type;

  /**
   * Registration method (for dynamic registration)
   */
  registrationMethod?: string;

  /**
   * Documentation for this request
   */
  documentation?: string;

  /**
   * Since when this request is available (version)
   */
  since?: string;

  /**
   * Whether this request is deprecated
   */
  deprecated?: string;

  /**
   * Proposed state (if experimental)
   */
  proposed?: boolean;
}

/**
 * LSP notification definition
 */
export interface Notification {
  /**
   * Notification method name (e.g., "textDocument/didOpen")
   */
  method: string;

  /**
   * Notification parameters type
   */
  params?: Type;

  /**
   * Notification message direction
   */
  messageDirection: MessageDirection;

  /**
   * Registration options type (for dynamic registration)
   */
  registrationOptions?: Type;

  /**
   * Registration method (for dynamic registration)
   */
  registrationMethod?: string;

  /**
   * Documentation for this notification
   */
  documentation?: string;

  /**
   * Since when this notification is available (version)
   */
  since?: string;

  /**
   * Whether this notification is deprecated
   */
  deprecated?: string;

  /**
   * Proposed state (if experimental)
   */
  proposed?: boolean;
}

/**
 * Root metaModel structure
 */
export interface MetaModel {
  /**
   * All request definitions
   */
  requests: Request[];

  /**
   * All notification definitions
   */
  notifications: Notification[];

  /**
   * All structure definitions
   */
  structures: Structure[];

  /**
   * All enumeration definitions
   */
  enumerations: Enumeration[];

  /**
   * All type alias definitions
   */
  typeAliases: TypeAlias[];

  /**
   * MetaModel version
   */
  metaData?: {
    version: string;
  };
}
