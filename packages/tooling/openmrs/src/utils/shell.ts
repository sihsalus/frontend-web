import { resolve } from 'node:path';

export const shellDir = resolve(require.resolve('@openmrs/esm-app-shell/package.json'), '..');

export const rspackBin = resolve(require.resolve('@rspack/cli/package.json'), '..', 'bin', 'rspack.js');
