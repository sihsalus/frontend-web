// Suppress act() warnings BEFORE any React code loads
// These warnings are expected due to store-to-store subscriptions in the data layer
const originalError = console.error;
console.error = (...args: any[]) => {
  const message = args[0];
  if (
    typeof message === 'string' &&
    message.includes('Warning: An update to') &&
    message.includes('was not wrapped in act')
  ) {
    return;
  }
  originalError.call(console, ...args);
};

import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, expect } from 'vitest';

// Extend Vitest's expect with @testing-library/jest-dom matchers.
// The '/vitest' import path is incompatible with Vitest v4; use expect.extend() instead.
expect.extend(matchers);
import type {} from '@openmrs/esm-globals';

declare global {
  interface Window {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  }
}

// Configure React's act() environment for Vitest
// See: https://github.com/testing-library/react-testing-library/issues/1061
// Store the actual value in a variable to avoid infinite recursion
let actEnvironment = true;

Object.defineProperty(globalThis, 'IS_REACT_ACT_ENVIRONMENT', {
  get() {
    return actEnvironment;
  },
  set(value) {
    actEnvironment = value;
    if (typeof window !== 'undefined' && globalThis !== window) {
      window.IS_REACT_ACT_ENVIRONMENT = value;
    }
  },
});

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

window.openmrsBase = '/openmrs';
window.spaBase = '/spa';
window.getOpenmrsSpaBase = () => '/openmrs/spa/';

// happy-dom v20 doesn't always expose localStorage as callable methods at the global scope;
// provide a simple in-memory shim so modules that call localStorage.setItem/getItem work.
const _localStorageData: Record<string, string> = {};
const _localStorageShim: Storage = {
  getItem: (key) => _localStorageData[key] ?? null,
  setItem: (key, value) => {
    _localStorageData[key] = String(value);
  },
  removeItem: (key) => {
    delete _localStorageData[key];
  },
  clear: () => {
    Object.keys(_localStorageData).forEach((k) => delete _localStorageData[k]);
  },
  get length() {
    return Object.keys(_localStorageData).length;
  },
  key: (index) => Object.keys(_localStorageData)[index] ?? null,
};
Object.defineProperty(globalThis, 'localStorage', { value: _localStorageShim, writable: true });
Object.defineProperty(window, 'localStorage', { value: _localStorageShim, writable: true });
const { getComputedStyle } = window;
window.getComputedStyle = (elt) => getComputedStyle(elt);

afterEach(() => {
  cleanup();
});

afterAll(() => {
  console.error = originalError;
});
