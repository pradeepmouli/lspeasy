/**
 * Runtime validation surface, deliberately kept OUT of the main barrel.
 *
 * Everything re-exported here transitively imports zod, which costs ~15-30ms
 * to load plus ~17ms to construct the protocol schema graph. `@lspeasy/core`
 * itself stays zod-free so consumers that only want types and transports do
 * not pay for it — import from here when you actually need to validate at
 * runtime.
 *
 * The split is enforced by `barrel-purity.test.ts`; see
 * docs/superpowers/specs/2026-09-02-zod-off-the-runtime-path-design.md.
 */
export {
  requestMessageSchema,
  notificationMessageSchema,
  responseErrorSchema,
  successResponseMessageSchema,
  errorResponseMessageSchema,
  responseMessageSchema,
  messageSchema
} from './jsonrpc/schemas.js';

export * from './protocol/schemas.js';

export {
  TextEditArraySchema,
  NonEmptyWorkspaceEditSchema
} from './protocol/result-classification.js';

export {
  dynamicRegistrationSchema,
  registerCapabilityParamsSchema,
  unregisterCapabilitySchema,
  unregisterCapabilityParamsSchema,
  isRegisterCapabilityParams,
  isUnregisterCapabilityParams
} from './protocol/dynamic-registration.js';

export { exampleFromZod } from './example-from-zod.js';
export { unwrapZodType } from './zod-introspection.js';
