/// <reference types="vitest/globals" />

declare module "*.scss" {
  const styles: { [className: string]: string };
  export default styles;
}

declare module "*.css" {
  const styles: { [className: string]: string };
  export default styles;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare const require: NodeJS.Require;

declare namespace NodeJS {
  interface Require {
    (moduleName: string): any;
    context(
      directory: string,
      useSubdirectories?: boolean,
      regExp?: RegExp,
      mode?: string,
    ): any;
  }
}

declare var spaBase: string;
declare function getOpenmrsSpaBase(): string;

// Minimal ambient declarations for Vitest globals used across tests.
declare global {
  const vi: any;
  namespace vi {
    // vi.Mock is used in a few places for casting; provide a permissive alias.
    type Mock = any;
    function fn(...args: any[]): any;
    function mocked<T>(t: T): T;
    function importActual<T = any>(path: string): Promise<T>;
  }
}

export {};
