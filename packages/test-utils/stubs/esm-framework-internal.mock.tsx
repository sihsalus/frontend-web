import { vi } from 'vitest';

import { Type, clearHistory, getExtensionInternalStore, useStore } from './esm-framework.mock';

function createMockStore<T>(initialState: T) {
  let state = initialState;
  const subscribers = new Set<(state: T) => void>();

  return {
    getState: vi.fn(() => state),
    setState: vi.fn((update: Partial<T> | T) => {
      state = typeof update === 'object' && update !== null ? ({ ...state, ...update } as T) : state;
      subscribers.forEach((subscriber) => subscriber(state));
    }),
    subscribe: vi.fn((subscriber: (state: T) => void) => {
      subscribers.add(subscriber);
      return () => subscribers.delete(subscriber);
    }),
  };
}

export { Type, clearHistory, getExtensionInternalStore, useStore };

export const implementerToolsConfigStore = createMockStore({ config: {} as Record<string, unknown> });
export const temporaryConfigStore = createMockStore({ config: {} as Record<string, unknown> });
export const clearConfigErrors = vi.fn();

export const useStoreWithActions = vi.fn((store, actions) => ({
  ...useStore(store),
  ...actions,
}));
