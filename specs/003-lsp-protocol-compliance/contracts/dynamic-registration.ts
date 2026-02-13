/**
 * Dynamic registration contracts.
 */

export interface DynamicRegistrationBehaviorOptions {
  strictDynamicRegistration: boolean;
}

export interface Registration {
  id: string;
  method: string;
  registerOptions?: unknown;
}

export interface RegistrationStoreView {
  staticCapabilities: unknown;
  dynamicRegistrations: Registration[];
}

export interface DynamicRegistrationService {
  register(
    registrations: Registration[],
    options: DynamicRegistrationBehaviorOptions
  ): Promise<void>;
  unregister(registrationIds: string[]): Promise<void>;
  getView(): RegistrationStoreView;
}

/**
 * Unknown unregister IDs MUST return JSON-RPC InvalidParams (-32602).
 */
export interface UnregisterError {
  code: -32602;
  message: string;
  data?: { unknownRegistrationIds: string[] };
}
