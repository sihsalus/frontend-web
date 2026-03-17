import '@testing-library/jest-dom';

jest.mock('single-spa', () => ({
  navigateToUrl: jest.fn(),
}));

declare global {
  interface Window {
    openmrsBase: string;
    spaBase: string;
  }
}

window.openmrsBase = '/openmrs';
window.spaBase = '/spa';
window.getOpenmrsSpaBase = () => '/openmrs/spa/';
window.URL.createObjectURL = jest.fn();
window.HTMLElement.prototype.scrollIntoView = jest.fn();
window.HTMLFormElement.prototype.requestSubmit = jest.fn();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
