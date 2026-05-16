declare module '*.scss' {
  const styles: { [className: string]: string };
  export default styles;
}

declare module '*.css' {
  const styles: { [className: string]: string };
  export default styles;
}

declare global {
  var importMapOverrides: import('./devtools/import-map-overrides.types').ImportMapOverridesApi;
}

export {};

declare namespace NodeJS {
  interface Require {
    context(directory: string, useSubdirectories?: boolean, regExp?: RegExp, mode?: string): any;
  }
}
