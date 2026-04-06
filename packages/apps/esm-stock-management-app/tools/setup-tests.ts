import '@testing-library/jest-dom';

// https://github.com/jsdom/jsdom/issues/1695
 
window.HTMLElement.prototype.scrollIntoView = function () {};

// Mock ResizeObserver for Carbon components
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
