/**
 * Tests for shared capability guard utilities
 */

import { describe, it, expect } from 'vitest';
import {
  buildMethodSets,
  SERVER_METHODS,
  CLIENT_METHODS,
  checkMethod,
  ConsoleLogger,
  LogLevel
} from '../../../src/index.js';

const logger = new ConsoleLogger(LogLevel.Debug);

describe('buildMethodSets', () => {
  it('should return all and alwaysAllowed sets for ServerCapability', () => {
    const result = buildMethodSets('ServerCapability');
    expect(result.all).toBeInstanceOf(Set);
    expect(result.alwaysAllowed).toBeInstanceOf(Set);
    expect(result.all.size).toBeGreaterThan(0);
    // alwaysAllowed should be a subset of all
    for (const m of result.alwaysAllowed) {
      expect(result.all.has(m)).toBe(true);
    }
  });

  it('should return all and alwaysAllowed sets for ClientCapability', () => {
    const result = buildMethodSets('ClientCapability');
    expect(result.all.size).toBeGreaterThan(0);
    for (const m of result.alwaysAllowed) {
      expect(result.all.has(m)).toBe(true);
    }
  });

  it('should include lifecycle methods like initialize and shutdown', () => {
    expect(SERVER_METHODS.all.has('initialize')).toBe(true);
    expect(SERVER_METHODS.all.has('shutdown')).toBe(true);
  });
});

describe('SERVER_METHODS and CLIENT_METHODS', () => {
  it('should be pre-built and available', () => {
    expect(SERVER_METHODS.all.size).toBeGreaterThan(0);
    expect(CLIENT_METHODS.all.size).toBeGreaterThan(0);
  });

  it('should include lifecycle methods as always allowed', () => {
    expect(SERVER_METHODS.alwaysAllowed.has('initialize')).toBe(true);
    expect(SERVER_METHODS.alwaysAllowed.has('shutdown')).toBe(true);
  });
});

describe('checkMethod', () => {
  const methodSets = {
    all: new Set(['known/method', 'guarded/method', 'alwaysOn/method']),
    alwaysAllowed: new Set(['known/method'])
  };

  const baseOpts = {
    methodSets,
    logger,
    actionLabel: 'test action',
    capabilityLabel: 'test capability'
  };

  it('should allow always-allowed methods', () => {
    const result = checkMethod({
      ...baseOpts,
      method: 'known/method',
      strict: true,
      getCapabilityKey: () => null,
      hasCapability: () => false
    });
    expect(result).toBe(true);
  });

  it('should allow unknown methods in non-strict mode', () => {
    const result = checkMethod({
      ...baseOpts,
      method: 'unknown/method',
      strict: false,
      getCapabilityKey: () => null,
      hasCapability: () => false
    });
    expect(result).toBe(true);
  });

  it('should throw on unknown methods in strict mode', () => {
    expect(() =>
      checkMethod({
        ...baseOpts,
        method: 'unknown/method',
        strict: true,
        getCapabilityKey: () => null,
        hasCapability: () => false
      })
    ).toThrow(/Cannot test action for unknown method/);
  });

  it('should allow methods with alwaysOn capability', () => {
    const result = checkMethod({
      ...baseOpts,
      method: 'alwaysOn/method',
      strict: true,
      getCapabilityKey: () => 'alwaysOn',
      hasCapability: () => false
    });
    expect(result).toBe(true);
  });

  it('should allow methods when capability is present', () => {
    const result = checkMethod({
      ...baseOpts,
      method: 'guarded/method',
      strict: false,
      getCapabilityKey: () => 'someCapability',
      hasCapability: (key) => key === 'someCapability'
    });
    expect(result).toBe(true);
  });

  it('should return false when capability is missing in non-strict mode', () => {
    const result = checkMethod({
      ...baseOpts,
      method: 'guarded/method',
      strict: false,
      getCapabilityKey: () => 'someCapability',
      hasCapability: () => false
    });
    expect(result).toBe(false);
  });

  it('should throw when capability is missing in strict mode', () => {
    expect(() =>
      checkMethod({
        ...baseOpts,
        method: 'guarded/method',
        strict: true,
        getCapabilityKey: () => 'someCapability',
        hasCapability: () => false
      })
    ).toThrow(/Cannot test action guarded\/method: test capability 'someCapability' not declared/);
  });

  it('should throw on known method with null capability key in strict mode', () => {
    expect(() =>
      checkMethod({
        ...baseOpts,
        method: 'guarded/method',
        strict: true,
        getCapabilityKey: () => null,
        hasCapability: () => false
      })
    ).toThrow(/Cannot test action for unknown method/);
  });

  it('should allow known method with null capability key in non-strict mode', () => {
    const result = checkMethod({
      ...baseOpts,
      method: 'guarded/method',
      strict: false,
      getCapabilityKey: () => null,
      hasCapability: () => false
    });
    expect(result).toBe(true);
  });
});
