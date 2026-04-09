/**
 * Vitest setup: expose addEventListener / removeEventListener as own,
 * writable, configurable properties on globalThis so that vi.spyOn works.
 *
 * In jsdom the methods live on EventTarget.prototype, not as own properties
 * of the global object, which Vitest 4 requires for vi.spyOn to succeed.
 * We bind to window before replacing so jsdom's instanceof check stays valid.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
const win = globalThis as any;

// Capture originals bound to window BEFORE we overwrite them on globalThis.
const boundAdd: typeof globalThis.addEventListener = win.addEventListener.bind(win);
const boundRemove: typeof globalThis.removeEventListener = win.removeEventListener.bind(win);

Object.defineProperty(win, 'addEventListener', {
  value: boundAdd,
  writable: true,
  configurable: true,
  enumerable: false,
});

Object.defineProperty(win, 'removeEventListener', {
  value: boundRemove,
  writable: true,
  configurable: true,
  enumerable: false,
});
