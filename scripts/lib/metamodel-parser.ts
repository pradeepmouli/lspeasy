/**
 * Parser for LSP metaModel.json
 *
 * Provides utilities for parsing and querying the LSP metaModel structure.
 * Builds registries and indexes for efficient lookup of requests, notifications,
 * and type definitions.
 */

import type {
  MetaModel,
  Request,
  Notification,
  Structure,
  Enumeration,
  TypeAlias,
  Type
} from './metamodel-types.js';

/**
 * Registry of requests and notifications indexed by method name
 */
export interface Registry {
  /**
   * Map of method name to request definition
   * e.g., "textDocument/hover" -> Request
   */
  requests: Map<string, Request>;

  /**
   * Map of method name to notification definition
   * e.g., "textDocument/didOpen" -> Notification
   */
  notifications: Map<string, Notification>;
}

/**
 * Parser for metaModel.json with indexing and query capabilities
 */
export class MetaModelParser {
  private readonly metaModel: MetaModel;
  private registry: Registry | null = null;
  private categories: Set<string> | null = null;

  constructor(metaModel: MetaModel) {
    this.metaModel = metaModel;
  }

  /**
   * Build registries for fast method lookup
   *
   * Creates maps of method names to their request/notification definitions.
   * This is used for quick lookup when generating type definitions.
   *
   * @returns Registry with request and notification maps
   *
   * @example
   * ```typescript
   * const parser = new MetaModelParser(metaModel);
   * const registry = parser.buildRegistry();
   * const hover = registry.requests.get('textDocument/hover');
   * ```
   */
  buildRegistry(): Registry {
    if (this.registry) {
      return this.registry;
    }

    const requests = new Map<string, Request>();
    const notifications = new Map<string, Notification>();
    this.metaModel.requests.sort((a, b) => a.messageDirection.localeCompare(b.messageDirection));

    // Index all requests by method name
    for (const request of this.metaModel.requests) {
      request.typeName = request.typeName.replace('Request', '');
      const category = this.extractCategory(request.method);
      if (category) {
        request.typeName = request.typeName.toLowerCase().startsWith(category.toLowerCase())
          ? request.typeName.substring(category.length)
          : request.typeName;
        request.category = category;
      }

      requests.set(request.method, request);
    }

    this.metaModel.notifications.sort((a, b) =>
      a.messageDirection.localeCompare(b.messageDirection)
    );

    // Index all notifications by method name
    for (const notification of this.metaModel.notifications) {
      notifications.set(notification.method, notification);
      notification.typeName = notification.typeName.replace('Notification', '');
      const category = this.extractCategory(notification.method);
      if (category) {
        notification.typeName = notification.typeName
          .toLowerCase()
          .startsWith(category.toLowerCase())
          ? notification.typeName.substring(category.length)
          : notification.typeName;
        notification.category = category;
      }
    }

    this.registry = { requests, notifications };
    return this.registry;
  }

  /**
   * Extract categories from method names
   *
   * LSP methods follow a hierarchical naming convention like:
   * - "textDocument/hover"
   * - "workspace/didChangeConfiguration"
   * - "window/showMessage"
   *
   * This extracts the category prefix (e.g., "textDocument", "workspace", "window").
   *
   * @returns Set of unique category names
   *
   * @example
   * ```typescript
   * const categories = parser.getCategories();
   * // Returns: Set(['textDocument', 'workspace', 'window', ...])
   * ```
   */
  getCategories(): Set<string> {
    if (this.categories) {
      return this.categories;
    }

    const categories = new Set<string>();

    // Extract categories from request methods
    for (const request of this.metaModel.requests) {
      const category = this.extractCategory(request.method) || 'lifecycle';
      if (category) {
        categories.add(category);
      }
    }

    // Extract categories from notification methods
    for (const notification of this.metaModel.notifications) {
      const category = this.extractCategory(notification.method) || 'lifecycle';
      if (category) {
        categories.add(category);
      }
    }

    this.categories = categories;
    return this.categories;
  }

  /**
   * Extract category from a method name
   *
   * @param method - Method name like "textDocument/hover"
   * @returns Category name like "textDocument", or null for special methods
   *
   * @private
   */
  private extractCategory(method: string): string | null {
    // Skip special methods that start with $
    if (method.startsWith('$/')) {
      return 'general';
    }

    // Extract prefix before the first slash
    const slashIndex = method.indexOf('/');
    if (slashIndex > 0) {
      return method.substring(0, slashIndex);
    }

    // Method has no category (e.g., "initialize", "shutdown")
    return 'lifecycle';
  }

  /**
   * Resolve a type reference to its definition
   *
   * Given a type reference, attempts to resolve it to the actual type definition.
   * Handles recursive resolution for complex types.
   *
   * @param type - Type to resolve
   * @returns Resolved type (may be the same as input if not a reference)
   *
   * @example
   * ```typescript
   * // If type is { kind: 'reference', name: 'Position' }
   * // Returns the actual Position structure definition
   * const resolved = parser.resolveType(type);
   * ```
   */
  resolveType(type: Type): Type {
    // If not a reference type, return as-is
    if (type.kind !== 'reference') {
      return type;
    }

    // Try to resolve reference to a structure, enum, or type alias
    // For now, just return the reference (full resolution can be added later)
    return type;
  }

  /**
   * Get all structure definitions
   *
   * @returns Array of all structure definitions
   */
  getAllStructures(): Structure[] {
    return this.metaModel.structures;
  }

  /**
   * Get all enumeration definitions
   *
   * @returns Array of all enumeration definitions
   */
  getAllEnumerations(): Enumeration[] {
    return this.metaModel.enumerations;
  }

  /**
   * Get all type alias definitions
   *
   * @returns Array of all type alias definitions
   */
  getAllTypeAliases(): TypeAlias[] {
    return this.metaModel.typeAliases;
  }

  /**
   * Get a structure by name
   *
   * @param name - Structure name to look up
   * @returns Structure definition or undefined if not found
   */
  getStructure(name: string): Structure | undefined {
    return this.metaModel.structures.find((s) => s.name === name);
  }

  /**
   * Get an enumeration by name
   *
   * @param name - Enumeration name to look up
   * @returns Enumeration definition or undefined if not found
   */
  getEnumeration(name: string): Enumeration | undefined {
    return this.metaModel.enumerations.find((e) => e.name === name);
  }

  /**
   * Get a type alias by name
   *
   * @param name - Type alias name to look up
   * @returns TypeAlias definition or undefined if not found
   */
  getTypeAlias(name: string): TypeAlias | undefined {
    return this.metaModel.typeAliases.find((t) => t.name === name);
  }

  /**
   * Get all requests
   *
   * @returns Array of all request definitions
   */
  getAllRequests(): Request[] {
    return this.metaModel.requests;
  }

  /**
   * Get all notifications
   *
   * @returns Array of all notification definitions
   */
  getAllNotifications(): Notification[] {
    return this.metaModel.notifications;
  }

  /**
   * Get a request by method name
   *
   * @param method - Request method name (e.g., "textDocument/hover")
   * @returns Request definition or undefined if not found
   */
  getRequest(method: string): Request | undefined {
    const registry = this.buildRegistry();
    return registry.requests.get(method);
  }

  /**
   * Get a notification by method name
   *
   * @param method - Notification method name (e.g., "textDocument/didOpen")
   * @returns Notification definition or undefined if not found
   */
  getNotification(method: string): Notification | undefined {
    const registry = this.buildRegistry();
    return registry.notifications.get(method);
  }

  /**
   * Get the underlying metaModel
   *
   * @returns The raw metaModel object
   */
  getMetaModel(): MetaModel {
    return this.metaModel;
  }

  /**
   * Get requests by category
   *
   * @param category - Category name (e.g., "textDocument")
   * @returns Array of requests in that category
   */
  getRequestsByCategory(category: string): Request[] {
    return this.metaModel.requests.filter((r) => {
      const methodCategory = this.extractCategory(r.method);
      return methodCategory === category;
    });
  }

  /**
   * Get notifications by category
   *
   * @param category - Category name (e.g., "textDocument")
   * @returns Array of notifications in that category
   */
  getNotificationsByCategory(category: string): Notification[] {
    return this.metaModel.notifications.filter((n) => {
      const methodCategory = this.extractCategory(n.method);
      return methodCategory === category;
    });
  }

  /**
   * Check if a method is a request
   *
   * @param method - Method name to check
   * @returns True if the method is a request
   */
  isRequest(method: string): boolean {
    const registry = this.buildRegistry();
    return registry.requests.has(method);
  }

  /**
   * Check if a method is a notification
   *
   * @param method - Method name to check
   * @returns True if the method is a notification
   */
  isNotification(method: string): boolean {
    const registry = this.buildRegistry();
    return registry.notifications.has(method);
  }
}
